"use client";

import { useState } from "react";
import {
    Search, Globe, Loader2, CheckCircle2, XCircle, AlertTriangle,
    ExternalLink, Sparkles, Layers, ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Affiliate links (empty = feature hidden). When filled, each template must
// contain a "{domain}" placeholder, e.g.
//   "https://www.dynadot.com/domain/search?domain={domain}&aid=YOUR_ID"
// ---------------------------------------------------------------------------
const AFFILIATE_LINKS: { dynadot: string; namecheap: string } = {
    dynadot: "",
    namecheap: "",
};

type DomainStatus = "registered" | "not_found" | "unknown";

interface DomainResult {
    domain: string;
    status: DomainStatus;
    registrar: string | null;
    creationDate: string | null;
    expirationDate: string | null;
    domainStatus: string[] | null;
    nameServers: string[] | null;
    error: string | null;
}

const TLDS = ["com", "net", "org", "io", "ai", "dev"];
const MAX_BULK = 50;

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
}

function StatusBadge({ status }: { status: DomainStatus }) {
    if (status === "registered") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-medium text-red-400">
                <XCircle className="h-3.5 w-3.5" /> Registered
            </span>
        );
    }
    if (status === "not_found") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> No record found
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Unknown
        </span>
    );
}

function affiliateUrl(template: string, domain: string): string {
    if (template.includes("{domain}")) {
        return template.replace("{domain}", encodeURIComponent(domain));
    }
    return template + encodeURIComponent(domain);
}

function AffiliateButtons({ domain }: { domain: string }) {
    const links = [
        { name: "Dynadot", url: AFFILIATE_LINKS.dynadot },
        { name: "Namecheap", url: AFFILIATE_LINKS.namecheap },
    ].filter((l) => l.url);
    if (links.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {links.map((l) => (
                <a
                    key={l.name}
                    href={affiliateUrl(l.url, domain)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Check price at {l.name} <ExternalLink className="h-3.5 w-3.5" />
                </a>
            ))}
        </div>
    );
}

function hasAffiliates(): boolean {
    return Boolean(AFFILIATE_LINKS.dynadot || AFFILIATE_LINKS.namecheap);
}

/** Suggest alternative names when a domain is taken. */
function suggestAlternatives(domain: string): string[] {
    const parts = domain.split(".");
    if (parts.length < 2) return [];
    const name = parts.slice(0, -1).join(".");
    const tld = parts[parts.length - 1];
    const out = new Set<string>();
    for (const prefix of ["get", "try", "app"]) {
        out.add(`${prefix}${name}.${tld}`);
    }
    for (const alt of TLDS) {
        if (alt !== tld) out.add(`${name}.${alt}`);
    }
    out.delete(domain);
    return Array.from(out).slice(0, 9);
}

async function queryDomains(domains: string[]): Promise<DomainResult[]> {
    let res: Response;
    try {
        res = await fetch("/api/tools/domain-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domains }),
        });
    } catch {
        throw new Error("Network error. Please check your connection and retry.");
    }
    let json: { results?: DomainResult[]; error?: string } | null = null;
    try {
        json = await res.json();
    } catch {
        throw new Error(
            res.ok
                ? "Server returned an invalid response. Please retry."
                : `Request failed (${res.status}). Please retry in a moment.`
        );
    }
    if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
    }
    return (json?.results ?? []) as DomainResult[];
}

type Tab = "lookup" | "availability" | "bulk";

export function DomainLookupTool() {
    const [tab, setTab] = useState<Tab>("lookup");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Lookup tab
    const [singleInput, setSingleInput] = useState("");
    const [singleResult, setSingleResult] = useState<DomainResult | null>(null);

    // Availability tab
    const [nameInput, setNameInput] = useState("");
    const [selectedTlds, setSelectedTlds] = useState<string[]>(["com", "net", "org", "io"]);
    const [availResults, setAvailResults] = useState<DomainResult[] | null>(null);

    // Bulk tab
    const [bulkInput, setBulkInput] = useState("");
    const [bulkResults, setBulkResults] = useState<DomainResult[] | null>(null);

    async function run(domains: string[], onDone: (r: DomainResult[]) => void) {
        setLoading(true);
        setError(null);
        try {
            const results = await queryDomains(domains);
            onDone(results);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Query failed");
        } finally {
            setLoading(false);
        }
    }

    function handleLookup(e?: React.FormEvent) {
        e?.preventDefault();
        const d = singleInput.trim();
        if (!d || loading) return;
        setSingleResult(null);
        run([d], (r) => setSingleResult(r[0] ?? null));
    }

    function toggleTld(tld: string) {
        setSelectedTlds((prev) =>
            prev.includes(tld) ? prev.filter((t) => t !== tld) : [...prev, tld]
        );
    }

    function handleAvailability(e?: React.FormEvent) {
        e?.preventDefault();
        const name = nameInput.trim().toLowerCase().replace(/\s+/g, "");
        if (!name || selectedTlds.length === 0 || loading) return;
        setAvailResults(null);
        run(
            selectedTlds.map((t) => `${name}.${t}`),
            (r) => setAvailResults(r)
        );
    }

    function handleBulk(e?: React.FormEvent) {
        e?.preventDefault();
        const domains = Array.from(
            new Set(
                bulkInput
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
            )
        ).slice(0, MAX_BULK);
        if (domains.length === 0 || loading) return;
        setBulkResults(null);
        run(domains, (r) => setBulkResults(r));
    }

    function checkSuggestion(suggestion: string) {
        setSingleInput(suggestion);
        setSingleResult(null);
        setTab("lookup");
        run([suggestion], (r) => setSingleResult(r[0] ?? null));
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "lookup", label: "WHOIS Lookup", icon: <Search className="h-4 w-4" /> },
        { id: "availability", label: "Availability", icon: <Layers className="h-4 w-4" /> },
        { id: "bulk", label: "Bulk Check", icon: <ListChecks className="h-4 w-4" /> },
    ];

    return (
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            tab === t.id
                                ? "bg-zinc-100 text-zinc-900"
                                : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        )}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* ---- WHOIS Lookup ---- */}
            {tab === "lookup" && (
                <div className="space-y-4">
                    <form onSubmit={handleLookup} className="flex gap-2">
                        <div className="relative flex-1">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                value={singleInput}
                                onChange={(e) => setSingleInput(e.target.value)}
                                placeholder="example.com"
                                spellCheck={false}
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Lookup
                        </button>
                    </form>

                    {singleResult && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-lg font-semibold text-white break-all">{singleResult.domain}</h3>
                                <StatusBadge status={singleResult.status} />
                            </div>

                            {singleResult.status === "registered" && (
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-zinc-500">Registrar</dt>
                                        <dd className="text-zinc-200">{singleResult.registrar ?? "—"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">Created</dt>
                                        <dd className="text-zinc-200">{formatDate(singleResult.creationDate)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">Expires</dt>
                                        <dd className="text-zinc-200">{formatDate(singleResult.expirationDate)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">Name servers</dt>
                                        <dd className="text-zinc-200 break-all">
                                            {singleResult.nameServers?.join(", ") ?? "—"}
                                        </dd>
                                    </div>
                                    {singleResult.domainStatus && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-zinc-500">Status codes</dt>
                                            <dd className="flex flex-wrap gap-1.5 mt-1">
                                                {singleResult.domainStatus.map((s) => (
                                                    <code key={s} className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                                                        {s}
                                                    </code>
                                                ))}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            )}

                            {singleResult.status === "not_found" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-zinc-400">
                                        No registration record was found for this domain in the RDAP directory.
                                        This does <em>not</em> guarantee it can be registered — it may be
                                        reserved or premium at the registry.
                                    </p>
                                    <AffiliateButtons domain={singleResult.domain} />
                                </div>
                            )}

                            {singleResult.status === "unknown" && (
                                <p className="text-sm text-amber-400/90">
                                    Couldn&apos;t determine the status
                                    {singleResult.error ? `: ${singleResult.error}` : ""}. Please try again.
                                </p>
                            )}

                            {singleResult.status === "registered" && (
                                <div className="pt-2 border-t border-zinc-800">
                                    <p className="text-sm font-medium text-zinc-300 mb-2 inline-flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4 text-zinc-500" /> Similar names to try
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestAlternatives(singleResult.domain).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => checkSuggestion(s)}
                                                className="rounded-lg border border-zinc-700 bg-zinc-900 hover:border-zinc-500 px-3 py-1.5 text-xs text-zinc-300 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ---- Availability ---- */}
            {tab === "availability" && (
                <div className="space-y-4">
                    <form onSubmit={handleAvailability} className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="mycoolapp"
                                spellCheck={false}
                                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                Check
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {TLDS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => toggleTld(t)}
                                    className={cn(
                                        "rounded-lg border px-3 py-1.5 text-sm font-mono transition-colors",
                                        selectedTlds.includes(t)
                                            ? "border-zinc-100 bg-zinc-100 text-zinc-900"
                                            : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                                    )}
                                >
                                    .{t}
                                </button>
                            ))}
                        </div>
                    </form>

                    {availResults && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availResults.map((r) => (
                                <div key={r.domain} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-white break-all">{r.domain}</span>
                                        <StatusBadge status={r.status} />
                                    </div>
                                    {r.status === "not_found" && <AffiliateButtons domain={r.domain} />}
                                    {r.status === "unknown" && r.error && (
                                        <p className="text-xs text-amber-400/80">{r.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ---- Bulk ---- */}
            {tab === "bulk" && (
                <div className="space-y-4">
                    <form onSubmit={handleBulk} className="space-y-3">
                        <textarea
                            value={bulkInput}
                            onChange={(e) => setBulkInput(e.target.value)}
                            placeholder={"example.com\nmycoolapp.io\nstartup.dev"}
                            spellCheck={false}
                            rows={6}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500">One domain per line, up to {MAX_BULK}.</p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                Check all
                            </button>
                        </div>
                    </form>

                    {bulkResults && (
                        <div className="rounded-xl border border-zinc-800 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-zinc-900 text-left text-zinc-400">
                                        <th className="px-4 py-2.5 font-medium">Domain</th>
                                        <th className="px-4 py-2.5 font-medium">Status</th>
                                        <th className="px-4 py-2.5 font-medium hidden sm:table-cell">Registrar</th>
                                        <th className="px-4 py-2.5 font-medium hidden md:table-cell">Expires</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bulkResults.map((r) => (
                                        <tr key={r.domain} className="border-t border-zinc-800/60 hover:bg-zinc-900/40">
                                            <td className="px-4 py-2.5 text-zinc-100 break-all">{r.domain}</td>
                                            <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                                            <td className="px-4 py-2.5 text-zinc-400 hidden sm:table-cell">
                                                {r.registrar ?? (r.error ?? "—")}
                                            </td>
                                            <td className="px-4 py-2.5 text-zinc-400 hidden md:table-cell">
                                                {formatDate(r.expirationDate)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {hasAffiliates() && (
                <p className="text-xs text-zinc-600 pt-2 border-t border-zinc-800/60">
                    Affiliate disclosure: some links on this page are affiliate links. We may earn a
                    commission if you make a purchase, at no additional cost to you.
                </p>
            )}
        </div>
    );
}
