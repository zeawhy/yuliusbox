import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import { validateSafeUrl } from "@/lib/server-security";

// Safely initialize Redis if configured
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

// Compute MD5 hash for cache key
const generateCacheKey = (url: string) => {
    return "video_cache_" + crypto.createHash("md5").update(url).digest("hex");
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const rawUrl = body.url;

        if (!rawUrl || typeof rawUrl !== "string") {
            return NextResponse.json({ error: "Missing or invalid 'url' parameter" }, { status: 400 });
        }

        // Extract first URL found in potential share text (e.g. Douyin share text with description)
        const urlMatch = rawUrl.match(/(https?:\/\/[^\s]+)/);
        const targetUrl = urlMatch ? urlMatch[0] : rawUrl.trim();

        // Validate URL format and prevent internal network requests
        const validation = await validateSafeUrl(targetUrl);
        if (!validation.safe || !validation.parsedUrl) {
            return NextResponse.json(
                { error: validation.error || "The provided video URL is invalid or forbidden." },
                { status: 400 }
            );
        }

        const cleanUrl = validation.parsedUrl.toString();
        const cacheKey = generateCacheKey(cleanUrl);

        // 1. Query Redis cache if available
        if (redis) {
            try {
                const cachedData = await redis.get(cacheKey);
                if (cachedData) {
                    const parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
                    return NextResponse.json({
                        success: true,
                        ...parsedData,
                        fromCache: true,
                    });
                }
            } catch (cacheErr) {
                console.warn("Redis cache read failed, falling back to live extraction:", cacheErr);
            }
        }

        // 2. Request VPS microservice
        const vpsApiUrl = process.env.VPS_API_URL;
        const vpsApiKey = process.env.VPS_API_KEY;

        if (!vpsApiUrl || !vpsApiKey) {
            return NextResponse.json({ error: "Server configuration error (VPS API not configured)" }, { status: 500 });
        }

        const requestBody = {
            url: cleanUrl,
            proxy: process.env.RESIDENTIAL_PROXY_URL || undefined,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

        const response = await fetch(vpsApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": vpsApiKey,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("VPS API Error:", errorText);
            return NextResponse.json(
                { error: `Video parsing service returned error: ${response.status}` },
                { status: response.status >= 500 ? 502 : response.status }
            );
        }

        const data = await response.json();

        // 3. Verify extracted payload
        if (!data.success || !data.videoUrl) {
            return NextResponse.json({
                success: false,
                error: data.error || "Failed to extract valid video stream URL"
            }, { status: 400 });
        }

        // 4. Save to cache (2 hours TTL)
        if (redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(data), { ex: 7200 });
            } catch (cacheWriteErr) {
                console.warn("Redis cache write failed:", cacheWriteErr);
            }
        }

        return NextResponse.json({
            ...data,
            fromCache: false
        });

    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json({ error: "Video extraction timed out. Please try again." }, { status: 504 });
        }
        console.error("Extract Video Error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error"
        }, { status: 500 });
    }
}
