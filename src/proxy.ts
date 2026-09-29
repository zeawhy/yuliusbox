import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getClientIp } from "@/lib/server-security";

// Initialize Redis client safely
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Rate limiter: 5 requests per 60 seconds
    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        analytics: true,
        prefix: "@yuliusbox/proxy",
    });
}

export const config = {
    // 410 for the removed video-downloader pages (AdSense policy risk) +
    // rate limiting for the extract-video API.
    matcher: ["/tools/video-downloader/:path*", "/api/extract-video"],
};

export default async function proxy(request: NextRequest) {
    // Permanently gone: the video-downloader tool was removed for
    // AdSense/YouTube ToS policy reasons. Return 410 so search engines
    // drop the URL instead of treating it as a soft 404.
    // NOTE: after this deploys, file a URL removal request in Google
    // Search Console for /tools/video-downloader to speed up deindexing.
    if (request.nextUrl.pathname.startsWith("/tools/video-downloader")) {
        return new NextResponse(
            "<!DOCTYPE html><html><head><title>410 Gone</title></head><body><h1>410 Gone</h1><p>This tool has been permanently removed.</p></body></html>",
            {
                status: 410,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            }
        );
    }

    if (!ratelimit) {
        return NextResponse.next();
    }

    // Safely extract client IP
    const ip = getClientIp(request);

    try {
        const { success, pending, limit, reset, remaining } = await ratelimit.limit(`proxy_${ip}`);
        await pending;

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "请求过于频繁，请稍后再试 (Rate limit exceeded)",
                },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                }
            );
        }
    } catch (err) {
        console.error("Proxy rate limiting error:", err);
        // Fail open to avoid blocking genuine users on Redis outage
        return NextResponse.next();
    }

    return NextResponse.next();
}
