import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
});

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anonymous_ip";
        const { success } = await ratelimit.limit(`yuliusbox_ppt_pdf_${ip}`);

        if (!success) {
            return NextResponse.json(
                { error: "You have reached the conversion limit. Please try again in a minute." },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file provided or invalid file format" }, { status: 400 });
        }

        const gotenbergUrl = process.env.GOTENBERG_URL;
        if (!gotenbergUrl) {
            console.error("GOTENBERG_URL is not configured.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const gotenbergFormData = new FormData();
        const originalName = (file as unknown as File).name || "presentation.pptx";
        gotenbergFormData.append("files", file, originalName);

        const response = await fetch(`${gotenbergUrl}/forms/libreoffice/convert`, {
            method: "POST",
            body: gotenbergFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gotenberg API Error (${response.status}):`, errorText);
            return NextResponse.json({ error: `Conversion failed with status: ${response.status}` }, { status: response.status });
        }

        const convertedBlob = await response.blob();
        const baseName = originalName.replace(/\.[^/.]+$/, "");

        return new NextResponse(convertedBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.pdf"; filename*=UTF-8''${encodeURIComponent(baseName)}.pdf`
            }
        });

    } catch (error) {
        console.error("PPT to PDF API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
