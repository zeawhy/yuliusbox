import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { getClientIp } from "@/lib/server-security";

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        prefix: "@yuliusbox/excel-to-pdf",
    });
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(req: NextRequest) {
    try {
        if (ratelimit) {
            const ip = getClientIp(req);
            const { success } = await ratelimit.limit(`excel_pdf_${ip}`);
            if (!success) {
                return NextResponse.json(
                    { error: "You have reached the conversion limit. Please try again in a minute." },
                    { status: 429 }
                );
            }
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file provided or invalid file format" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds the 30MB maximum size limit" }, { status: 413 });
        }

        const gotenbergUrl = process.env.GOTENBERG_URL;
        if (!gotenbergUrl) {
            console.error("GOTENBERG_URL is not configured.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const gotenbergFormData = new FormData();
        const originalName = (file as unknown as File).name || "spreadsheet.xlsx";
        gotenbergFormData.append("files", file, originalName);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(`${gotenbergUrl}/forms/libreoffice/convert`, {
            method: "POST",
            body: gotenbergFormData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gotenberg API Error (${response.status}):`, errorText);
            return NextResponse.json(
                { error: "Spreadsheet conversion failed. Please ensure the file is a valid Excel document." },
                { status: response.status >= 500 ? 502 : response.status }
            );
        }

        const convertedBlob = await response.blob();
        const baseName = originalName.replace(/\.[^/.]+$/, "");

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
            return NextResponse.json({ error: "Spreadsheet conversion timed out." }, { status: 504 });
        }
        console.error("Excel to PDF API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
