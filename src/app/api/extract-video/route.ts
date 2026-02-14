import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

// 初始化 Redis
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 计算 MD5 Hash 作为缓存 Key
const generateCacheKey = (url: string) => {
    return "video_cache_" + crypto.createHash("md5").update(url).digest("hex");
};

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
        }

        // 1. 生成唯一缓存 Key
        const cacheKey = generateCacheKey(url);

        // 2. 查询 Redis 缓存
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`Cache Hit for: ${url}`);
            return NextResponse.json({
                success: true,
                ...cachedData as object,
                fromCache: true,
            });
        }

        // 3. 缓存未通过，准备请求外部 VPS
        const vpsApiUrl = process.env.VPS_API_URL;
        const vpsApiKey = process.env.VPS_API_KEY;

        if (!vpsApiUrl || !vpsApiKey) {
            return NextResponse.json({ error: "Server configuration error (VPS API)" }, { status: 500 });
        }

        const requestBody = {
            url: url,
            // 如果配置了住宅代理，则传给 VPS 使用
            proxy: process.env.RESIDENTIAL_PROXY_URL || undefined,
        };

        const response = await fetch(vpsApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": vpsApiKey,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("VPS API Error:", errorText);
            return NextResponse.json({ error: `External service error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();

        // 4. 解析成功，写入 Redis 缓存 (TTL: 2小时 = 7200秒)
        if (data && (data.videoUrl || data.url)) { // Adapt to potential API response structure
            await redis.set(cacheKey, JSON.stringify(data), { ex: 7200 });
        }

        return NextResponse.json({
            success: true,
            ...data,
            fromCache: false
        });

    } catch (error) {
        console.error("Extract Video Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
