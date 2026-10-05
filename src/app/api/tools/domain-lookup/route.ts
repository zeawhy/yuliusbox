import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/server-security";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ---------------------------------------------------------------------------
// Rate limiting: 20 requests per minute per IP (sliding window, Upstash).
// ---------------------------------------------------------------------------
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        analytics: true,
        prefix: "@yuliusbox/domain-lookup",
    });
}

// ---------------------------------------------------------------------------
// Result cache: Upstash Redis when configured, otherwise an in-memory Map.
// Registered domains are stable -> cache 12h. "Not found" may change soon ->
// cache 10 min. "Unknown" (rate-limited / upstream error) is never cached so
// a retry can succeed.
// ---------------------------------------------------------------------------
const memCache = new Map<string, { value: DomainResult; expiresAt: number }>();

let redisClient: Redis | null = null;
function getRedis(): Redis | null {
    if (redisClient) return redisClient;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redisClient = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        return redisClient;
    }
    return null;
}

const CACHE_PREFIX = "domainlookup:";

async function cacheGet(key: string): Promise<DomainResult | null> {
    const redis = getRedis();
    if (redis) {
        try {
            const v = await redis.get<DomainResult>(CACHE_PREFIX + key);
            return v ?? null;
        } catch {
            return null;
        }
    }
    const entry = memCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        memCache.delete(key);
        return null;
    }
    return entry.value;
}

async function cacheSet(key: string, value: DomainResult, ttlSeconds: number): Promise<void> {
    const redis = getRedis();
    if (redis) {
        try {
            await redis.set(CACHE_PREFIX + key, value, { ex: ttlSeconds });
            return;
        } catch {
            /* fall through to memory */
        }
    }
    memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type DomainStatus = "registered" | "not_found" | "unknown";

export interface DomainResult {
    domain: string;
    status: DomainStatus;
    registrar: string | null;
    creationDate: string | null;
    expirationDate: string | null;
    domainStatus: string[] | null;
    nameServers: string[] | null;
    error: string | null;
}

// ---------------------------------------------------------------------------
// Domain validation (strict — also our SSRF guard: only validated domains are
// ever interpolated into a URL path segment, and only against RDAP servers
// taken from the IANA bootstrap over HTTPS).
// ---------------------------------------------------------------------------
const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

function normalizeDomain(input: unknown): string | null {
    if (typeof input !== "string") return null;
    let d = input.trim().toLowerCase();
    if (d.endsWith(".")) d = d.slice(0, -1);
    if (d.length < 3 || d.length > 253) return null;
    // Reject anything that looks like a URL, email, or has illegal chars early.
    if (/[\s/:?#@]/.test(d)) return null;
    const labels = d.split(".");
    if (labels.length < 2) return null;
    for (const label of labels) {
        if (!LABEL_RE.test(label)) return null;
    }
    const tld = labels[labels.length - 1];
    if (/^\d+$/.test(tld)) return null; // all-numeric TLD (likely an IP)
    return d;
}

// ---------------------------------------------------------------------------
// IANA RDAP bootstrap (https://data.iana.org/rdap/dns.json), cached 24h.
// Maps TLD -> authoritative RDAP base URL. Supports multi-label TLDs
// (e.g. "co.uk") via longest-suffix matching.
// ---------------------------------------------------------------------------
interface BootstrapServices {
    services: [string[], string[]][];
}

let bootstrapCache: { map: Map<string, string>; fetchedAt: number } | null = null;
const BOOTSTRAP_TTL_MS = 24 * 3600 * 1000;
const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";

async function loadBootstrap(): Promise<Map<string, string>> {
    const now = Date.now();
    if (bootstrapCache && now - bootstrapCache.fetchedAt < BOOTSTRAP_TTL_MS) {
        return bootstrapCache.map;
    }
    const res = await fetch(BOOTSTRAP_URL, {
        signal: AbortSignal.timeout(10000),
        headers: { Accept: "application/json" },
    });
    if (!res.ok) {
        throw new Error(`IANA bootstrap fetch failed: HTTP ${res.status}`);
    }
    const json = (await res.json()) as BootstrapServices;
    const map = new Map<string, string>();
    for (const [tlds, servers] of json.services ?? []) {
        const server = servers?.[0];
        if (!server) continue;
        // Only accept https RDAP endpoints.
        let https = false;
        try {
            https = new URL(server).protocol === "https:";
        } catch {
            continue;
        }
        if (!https) continue;
        for (const tld of tlds ?? []) {
            map.set(String(tld).toLowerCase(), server.replace(/\/+$/, ""));
        }
    }
    bootstrapCache = { map, fetchedAt: now };
    return map;
}

function findRdapServer(map: Map<string, string>, domain: string): string | null {
    const labels = domain.split(".");
    // Longest-suffix match for multi-label TLDs (e.g. "co.uk").
    for (let i = 0; i < labels.length; i++) {
        const candidate = labels.slice(i).join(".");
        const server = map.get(candidate);
        if (server) return server;
    }
    return null;
}

// ---------------------------------------------------------------------------
// RDAP response parsing
// ---------------------------------------------------------------------------
function extractRegistrar(entities: unknown): string | null {
    if (!Array.isArray(entities)) return null;
    for (const ent of entities) {
        const e = ent as { roles?: unknown; vcardArray?: unknown; handle?: unknown };
        const roles = Array.isArray(e.roles) ? e.roles : [];
        if (!roles.includes("registrar")) continue;
        const vcard = Array.isArray(e.vcardArray) ? e.vcardArray[1] : null;
        if (Array.isArray(vcard)) {
            for (const field of vcard) {
                if (Array.isArray(field) && field[0] === "fn" && field[3]) {
                    const name = String(field[3]).trim();
                    if (name) return name;
                }
            }
        }
        if (e.handle) return String(e.handle);
    }
    return null;
}

function extractEventDate(events: unknown, action: string): string | null {
    if (!Array.isArray(events)) return null;
    for (const ev of events) {
        const e = ev as { eventAction?: unknown; eventDate?: unknown };
        if (e.eventAction === action && typeof e.eventDate === "string") {
            return e.eventDate;
        }
    }
    return null;
}

function extractNameServers(ns: unknown): string[] | null {
    if (!Array.isArray(ns)) return null;
    const out: string[] = [];
    for (const n of ns) {
        const name = (n as { ldhName?: unknown }).ldhName;
        if (typeof name === "string" && name) out.push(name.toLowerCase());
    }
    return out.length > 0 ? out : null;
}

// ---------------------------------------------------------------------------
// Single-domain RDAP lookup
// ---------------------------------------------------------------------------
const RDAP_TIMEOUT_MS = 8000;
const CONCURRENCY = 4;

async function lookupDomain(domain: string): Promise<DomainResult> {
    const base: DomainResult = {
        domain,
        status: "unknown",
        registrar: null,
        creationDate: null,
        expirationDate: null,
        domainStatus: null,
        nameServers: null,
        error: null,
    };

    // Cache first.
    const cached = await cacheGet(domain);
    if (cached) return cached;

    let server: string;
    try {
        const map = await loadBootstrap();
        const found = findRdapServer(map, domain);
        if (!found) {
            return { ...base, error: "No RDAP server found for this TLD" };
        }
        server = found;
    } catch {
        return { ...base, error: "RDAP directory temporarily unavailable" };
    }

    const url = `${server}/domain/${encodeURIComponent(domain)}`;
    let res: Response;
    try {
        res = await fetch(url, {
            signal: AbortSignal.timeout(RDAP_TIMEOUT_MS),
            headers: { Accept: "application/rdap+json" },
        });
    } catch (err) {
        const msg = err instanceof Error ? err.name : "fetch failed";
        return {
            ...base,
            error: msg === "TimeoutError" || msg === "AbortError" ? "RDAP query timed out" : "RDAP query failed",
        };
    }

    if (res.status === 404) {
        // No registration record found. Deliberately NOT "available": the name
        // may be reserved, premium, or blocked at the registry.
        const result: DomainResult = { ...base, status: "not_found" };
        await cacheSet(domain, result, 600); // 10 min
        return result;
    }

    if (res.status === 429) {
        return { ...base, error: "Registry rate limit reached, try again shortly" };
    }

    if (!res.ok) {
        return { ...base, error: `Registry returned HTTP ${res.status}` };
    }

    let json: Record<string, unknown>;
    try {
        json = (await res.json()) as Record<string, unknown>;
    } catch {
        return { ...base, error: "Invalid RDAP response" };
    }

    const domainStatus = Array.isArray(json.status)
        ? (json.status as unknown[]).map(String).filter(Boolean)
        : null;

    const result: DomainResult = {
        ...base,
        status: "registered",
        registrar: extractRegistrar(json.entities),
        creationDate: extractEventDate(json.events, "registration"),
        expirationDate: extractEventDate(json.events, "expiration"),
        domainStatus: domainStatus && domainStatus.length > 0 ? domainStatus : null,
        nameServers: extractNameServers(json.nameservers),
    };
    await cacheSet(domain, result, 12 * 3600); // 12h
    return result;
}

// Simple concurrency pool (no extra dependency).
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let next = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (next < items.length) {
            const idx = next++;
            results[idx] = await fn(items[idx]);
        }
    });
    await Promise.all(workers);
    return results;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
const MAX_DOMAINS = 50;

// Allow the full upstream chain (IANA bootstrap + RDAP, each with its own
// timeout) to complete on serverless. Vercel clamps to the plan's max.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        return await handlePost(request);
    } catch (err) {
        // Last-resort guard: never let an uncaught exception produce an
        // empty/non-JSON response (the client parses JSON unconditionally).
        console.error("domain-lookup POST failed:", err);
        return NextResponse.json(
            { error: "Lookup service temporarily unavailable. Please retry." },
            { status: 500 }
        );
    }
}

async function handlePost(request: NextRequest) {
    if (ratelimit) {
        try {
            const ip = getClientIp(request);
            const { success } = await ratelimit.limit(`domainlookup_${ip}`);
            if (!success) {
                return NextResponse.json(
                    { error: "Too many lookup requests. Please try again in a minute." },
                    { status: 429 }
                );
            }
        } catch {
            // Fail open: a rate-limiter outage must not break lookups.
        }
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const domains = (body as { domains?: unknown })?.domains;
    if (!Array.isArray(domains) || domains.length === 0) {
        return NextResponse.json({ error: "Body must contain a non-empty 'domains' array" }, { status: 400 });
    }
    if (domains.length > MAX_DOMAINS) {
        return NextResponse.json(
            { error: `Too many domains (max ${MAX_DOMAINS} per request)` },
            { status: 400 }
        );
    }

    const normalized = domains.map((d) => normalizeDomain(d));

    const indexed = normalized.map((domain, i) => ({ domain, raw: domains[i] }));
    const results = await mapPool(indexed, CONCURRENCY, async ({ domain, raw }) => {
        if (!domain) {
            return {
                domain: typeof raw === "string" ? raw : String(raw ?? ""),
                status: "unknown" as DomainStatus,
                registrar: null,
                creationDate: null,
                expirationDate: null,
                domainStatus: null,
                nameServers: null,
                error: "Invalid domain format",
            };
        }
        return lookupDomain(domain);
    });

    return NextResponse.json({ results });
}
