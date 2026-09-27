import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { validateSafeUrl, getClientIp } from "@/lib/server-security";

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 req/min
        analytics: true,
        prefix: "@yuliusbox/url-to-pdf",
    });
}

export async function POST(req: NextRequest) {
    try {
        // 1. Safe Rate Limiting Check
        if (ratelimit) {
            const ip = getClientIp(req);
            const { success } = await ratelimit.limit(`url_pdf_${ip}`);

            if (!success) {
                return NextResponse.json(
                    { error: "You have reached the conversion limit. Please try again in a minute." },
                    { status: 429 }
                );
            }
        }

        const formData = await req.formData();
        const urlParam = formData.get("url");

        if (!urlParam || typeof urlParam !== "string") {
            return NextResponse.json({ error: "No URL provided or invalid format" }, { status: 400 });
        }

        // 2. SSRF Protection: Ensure URL does not point to internal/loopback or metadata IPs
        const validation = await validateSafeUrl(urlParam);
        if (!validation.safe || !validation.parsedUrl) {
            return NextResponse.json(
                { error: validation.error || "The provided URL is forbidden or invalid." },
                { status: 400 }
            );
        }

        const gotenbergUrl = process.env.GOTENBERG_URL;
        if (!gotenbergUrl) {
            console.error("GOTENBERG_URL is not configured.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Chromium expects the `url` key in form data
        const gotenbergFormData = new FormData();
        gotenbergFormData.append("url", validation.parsedUrl.toString());

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s for web render

        const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/url`, {
            method: "POST",
            body: gotenbergFormData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gotenberg URL API Error (${response.status}):`, errorText);
            return NextResponse.json(
                { error: "Failed to convert URL to PDF. Please ensure the target website is publicly accessible." },
                { status: response.status >= 500 ? 502 : response.status }
            );
        }

        const convertedBlob = await response.blob();

        // Extract a safe filename from the URL domain
        let baseName = "website";
        try {
            baseName = validation.parsedUrl.hostname.replace(/[^a-zA-Z0-9_-]/g, "_");
        } catch {
            // fallback to default
        }

        return new NextResponse(convertedBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.pdf"; filename*=UTF-8''${encodeURIComponent(baseName)}.pdf`,
                "X-Content-Type-Options": "nosniff",
            }
        });

    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json({ error: "Webpage rendering timed out." }, { status: 504 });
        }
        console.error("URL to PDF API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
