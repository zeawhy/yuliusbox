import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 初始化 Redis 客户端
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// 创建限流器：每 60 秒最多 5 次请求 (Sliding Window Algorithm)
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export const config = {
    matcher: "/api/extract-video",
};

export default async function middleware(request: NextRequest) {
    // 获取用户 IP
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // check rate limit
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
        `mw_${ip}`
    );
    await pending;

    // 如果请求超过限制，返回 429
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

    return NextResponse.next();
}
