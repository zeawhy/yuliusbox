import { NextRequest, NextResponse } from "next/server";
import { validateSafeUrl, sanitizeFilename, getClientIp } from "@/lib/server-security";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Upstash rate limiter (10 requests per minute per IP for video download proxy)
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "@yuliusbox/proxy-download",
    });
}

// Allowed CDN and video media domain patterns
const ALLOWED_VIDEO_HOSTS = [
    /\.tiktokcdn\.com$/,
    /\.douyinpic\.com$/,
    /\.snssdk\.com$/,
    /\.amemv\.com$/,
    /\.douyinvod\.com$/,
    /\.ixigua\.com$/,
    /\.googlevideo\.com$/,
    /\.ytimg\.com$/,
    /\.twimg\.com$/,
    /\.cdninstagram\.com$/,
    /\.fbcdn\.net$/,
    /\.akamaized\.net$/,
    /\.bilivideo\.com$/,
    /\.hdslb\.com$/,
];

// Max file download limit: 150 MB
const MAX_CONTENT_LENGTH = 150 * 1024 * 1024;

export async function GET(request: NextRequest) {
    // 1. Rate Limiting Check
    if (ratelimit) {
        const ip = getClientIp(request);
        const { success } = await ratelimit.limit(`dl_${ip}`);
        if (!success) {
            return NextResponse.json(
                { error: "Too many download requests. Please try again in a minute." },
                { status: 429 }
            );
        }
    }

    const searchParams = request.nextUrl.searchParams;
    const rawUrl = searchParams.get("url");
    const rawFilename = searchParams.get("filename") || "video.mp4";

    if (!rawUrl) {
        return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
    }

    // 2. Validate URL against SSRF and Host Allowlist
    const validation = await validateSafeUrl(rawUrl, {
        allowedHostPatterns: ALLOWED_VIDEO_HOSTS,
    });

    if (!validation.safe || !validation.parsedUrl) {
        return NextResponse.json(
            { error: validation.error || "Forbidden target URL" },
            { status: 403 }
        );
    }

    const cleanFilename = sanitizeFilename(rawFilename, "video.mp4");

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(validation.parsedUrl.toString(), {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://www.douyin.com/",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Upstream resource returned HTTP ${response.status}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("Content-Type") || "video/mp4";
        // Ensure upstream is media/binary
        const isAllowedType =
            contentType.startsWith("video/") ||
            contentType.startsWith("image/") ||
            contentType.startsWith("audio/") ||
            contentType.includes("octet-stream");

        if (!isAllowedType) {
            return NextResponse.json(
                { error: `Forbidden Content-Type: ${contentType}` },
                { status: 400 }
            );
        }

        const contentLengthHeader = response.headers.get("Content-Length");
        if (contentLengthHeader) {
            const contentLength = parseInt(contentLengthHeader, 10);
            if (!isNaN(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
                return NextResponse.json(
                    { error: "Requested file exceeds the maximum allowed limit (150MB)" },
                    { status: 413 }
                );
            }
        }

        const headers = new Headers();
        headers.set("Content-Disposition", `attachment; filename="${cleanFilename}"; filename*=UTF-8''${encodeURIComponent(cleanFilename)}`);
        headers.set("Content-Type", contentType);
        if (contentLengthHeader) {
            headers.set("Content-Length", contentLengthHeader);
        }
        headers.set("X-Content-Type-Options", "nosniff");

        // Stream response body back to user
        return new NextResponse(response.body, {
            status: 200,
            headers,
        });

    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json({ error: "Download request timed out" }, { status: 504 });
        }
        console.error("Proxy download error:", error);
        return NextResponse.json({ error: "Failed to download media through proxy" }, { status: 500 });
    }
}
