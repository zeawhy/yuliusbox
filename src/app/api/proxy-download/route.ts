import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "video.mp4";

    if (!url) {
        return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.douyin.com/"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        const headers = new Headers();
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);
        headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
        headers.set("Content-Length", response.headers.get("Content-Length") || "");

        // 直接流式传输
        return new NextResponse(response.body, {
            status: 200,
            headers: headers,
        });

    } catch (error: any) {
        console.error("Proxy download error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
