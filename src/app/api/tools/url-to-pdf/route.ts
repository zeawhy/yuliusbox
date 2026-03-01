import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // URL to PDF limit: 5 req/min
    analytics: true,
});

export async function POST(req: NextRequest) {
    try {
        const ip = req.ip || req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anonymous_ip";
        const { success } = await ratelimit.limit(`yuliusbox_url_pdf_${ip}`);

        if (!success) {
            return NextResponse.json(
                { error: "You have reached the conversion limit. Please try again in a minute." },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const urlParam = formData.get("url");

        if (!urlParam || typeof urlParam !== "string") {
            return NextResponse.json({ error: "No URL provided or invalid format" }, { status: 400 });
        }

        const gotenbergUrl = process.env.GOTENBERG_URL;
        if (!gotenbergUrl) {
            console.error("GOTENBERG_URL is not configured.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Chromium expects the `url` key in form data
        const gotenbergFormData = new FormData();
        gotenbergFormData.append("url", urlParam);

        const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/url`, {
            method: "POST",
            body: gotenbergFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gotenberg URL API Error (${response.status}):`, errorText);
            return NextResponse.json({ error: `Conversion failed with status: ${response.status}` }, { status: response.status });
        }

        const convertedBlob = await response.blob();

        // Extract a safe filename from the URL domain
        let baseName = "website";
        try {
            const parsedUrl = new URL(urlParam);
            baseName = parsedUrl.hostname.replace(/[^a-zA-Z0-9_-]/g, '_');
        } catch (e) { /* ignore invalid url parse error for filename */ }

        return new NextResponse(convertedBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.pdf"; filename*=UTF-8''${encodeURIComponent(baseName)}.pdf`
            }
        });

    } catch (error) {
        console.error("URL to PDF API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
