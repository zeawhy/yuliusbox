import { NextRequest } from "next/server";
import dns from "dns/promises";
import net from "net";

/**
 * Safely extracts client IP address preventing X-Forwarded-For spoofing.
 * Prioritizes platform-assigned headers (x-real-ip, cf-connecting-ip)
 * and takes the last hop of x-forwarded-for if needed.
 */
export function getClientIp(req: Request | NextRequest): string {
    const headers = req.headers;
    const realIp = headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    const cfIp = headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const xff = headers.get("x-forwarded-for");
    if (xff) {
        // Take the last IP in the comma-separated chain (closest to the proxy)
        const parts = xff.split(",");
        const lastIp = parts[parts.length - 1]?.trim();
        if (lastIp) return lastIp;
    }

    return "127.0.0.1";
}

/**
 * Validates if an IP address belongs to private, loopback, or cloud-metadata ranges.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
    const version = net.isIP(ip);
    if (!version) return true; // Invalid IP is unsafe

    if (version === 4) {
        const parts = ip.split(".").map(Number);
        if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
            return true;
        }

        const [a, b] = parts;

        // 0.0.0.0/8 (Current network)
        if (a === 0) return true;
        // 10.0.0.0/8 (Private network)
        if (a === 10) return true;
        // 127.0.0.0/8 (Loopback)
        if (a === 127) return true;
        // 100.64.0.0/10 (Shared address space)
        if (a === 100 && b >= 64 && b <= 127) return true;
        // 169.254.0.0/16 (Link-local, AWS/GCP/Vercel metadata 169.254.169.254)
        if (a === 169 && b === 254) return true;
        // 172.16.0.0/12 (Private network)
        if (a === 172 && b >= 16 && b <= 31) return true;
        // 192.0.0.0/24 (IETF Protocol Assignments)
        if (a === 192 && b === 0 && parts[2] === 0) return true;
        // 192.0.2.0/24 (TEST-NET-1)
        if (a === 192 && b === 0 && parts[2] === 2) return true;
        // 192.168.0.0/16 (Private network)
        if (a === 192 && b === 168) return true;
        // 198.18.0.0/15 (Benchmarking)
        if (a === 198 && (b === 18 || b === 19)) return true;
        // 198.51.100.0/24 (TEST-NET-2)
        if (a === 198 && b === 51 && parts[2] === 100) return true;
        // 203.0.113.0/24 (TEST-NET-3)
        if (a === 203 && b === 0 && parts[2] === 113) return true;
        // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
        if (a >= 224) return true;

        return false;
    }

    if (version === 6) {
        const lower = ip.toLowerCase();
        // ::1 (Loopback) or :: (Unspecified)
        if (lower === "::1" || lower === "::") return true;
        // fc00::/7 (Unique local)
        if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
        // fe80::/10 (Link-local)
        if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
        // IPv4-mapped IPv6 ::ffff:127.0.0.1
        if (lower.startsWith("::ffff:")) {
            const mappedIpv4 = lower.substring(7);
            return isPrivateOrReservedIp(mappedIpv4);
        }
        return false;
    }

    return true;
}

/**
 * Validates a target URL against SSRF attacks:
 * 1. Checks protocol (only http/https)
 * 2. Checks hostname restrictions (optional regex allowlist)
 * 3. Resolves DNS and blocks private/local IP destinations
 */
export async function validateSafeUrl(
    urlString: string,
    options?: {
        allowedHostPatterns?: RegExp[];
        allowDirectIp?: boolean;
    }
): Promise<{ safe: boolean; error?: string; parsedUrl?: URL }> {
    let parsed: URL;
    try {
        parsed = new URL(urlString);
    } catch {
        return { safe: false, error: "Invalid URL format" };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { safe: false, error: "Only HTTP and HTTPS protocols are allowed" };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost explicitly
    if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
        return { safe: false, error: "Access to internal domain names is forbidden" };
    }

    // Check allowlist patterns if provided
    if (options?.allowedHostPatterns && options.allowedHostPatterns.length > 0) {
        const matched = options.allowedHostPatterns.some(pattern => pattern.test(hostname));
        if (!matched) {
            return { safe: false, error: `Domain '${hostname}' is not in the allowed domain whitelist` };
        }
    }

    // Check if hostname is directly an IP
    if (net.isIP(hostname)) {
        if (!options?.allowDirectIp) {
            if (isPrivateOrReservedIp(hostname)) {
                return { safe: false, error: "Direct access to private or reserved IP is forbidden" };
            }
        }
    } else {
        // Resolve DNS to verify the destination IP is not private/reserved
        try {
            const lookupResult = await dns.lookup(hostname, { all: true });
            for (const record of lookupResult) {
                if (isPrivateOrReservedIp(record.address)) {
                    return {
                        safe: false,
                        error: `Host resolves to forbidden private IP address: ${record.address}`
                    };
                }
            }
        } catch (e: any) {
            return { safe: false, error: `Failed to resolve host '${hostname}': ${e.message}` };
        }
    }

    return { safe: true, parsedUrl: parsed };
}

/**
 * Sanitizes download filename to prevent header injection (CRLF) and directory traversal.
 */
export function sanitizeFilename(name: string, fallback = "download.mp4"): string {
    if (!name) return fallback;
    // Strip CRLF and directory separators
    const clean = name.replace(/[\r\n\\/]/g, "").trim();
    // Allow only safe characters: letters, numbers, dot, underscore, dash
    const safe = clean.replace(/[^a-zA-Z0-9._-]/g, "_");
    return safe || fallback;
}
