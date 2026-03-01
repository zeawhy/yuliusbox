import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
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

        // Construct a new FormData with the key 'files' required by Gotenberg's LibreOffice endpoint
        const gotenbergFormData = new FormData();
        const originalName = (file as unknown as File).name || "document.docx";
        gotenbergFormData.append("files", file, originalName);

        const response = await fetch(`${gotenbergUrl}/forms/libreoffice/convert`, {
            method: "POST",
            body: gotenbergFormData,
            // Do NOT set Content-Type manually when submitting FormData via fetch.
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gotenberg API Error (${response.status}):`, errorText);
            return NextResponse.json({ error: `Conversion failed with status: ${response.status}` }, { status: response.status });
        }

        // Return the converted PDF blob to the client
        const convertedBlob = await response.blob();

        // Extract base filename without extension
        const baseName = originalName.replace(/\.[^/.]+$/, "");

        return new NextResponse(convertedBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.pdf"; filename*=UTF-8''${encodeURIComponent(baseName)}.pdf`
            }
        });

    } catch (error) {
        console.error("Word to PDF API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
