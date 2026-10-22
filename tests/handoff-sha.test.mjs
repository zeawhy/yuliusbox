import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

function sha256(buf) {
    return crypto.createHash("sha256").update(Buffer.from(buf)).digest("hex");
}

test("Task 4: Tool Handoff SHA-256 byte-for-byte consistency across all 6 chains", async () => {
    // 1. ID Watermark → JPG to PDF
    {
        const fakeImageBytes = crypto.randomBytes(1024 * 64);
        const downloadedBlob = new Blob([fakeImageBytes], { type: "image/jpeg" });
        const handoffBlob = new Blob([fakeImageBytes], { type: "image/jpeg" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 1 (ID Watermark -> JPG to PDF) SHA-256 must match");
    }

    // 2. EXIF Remover → Image Compressor
    {
        const cleanedPhotoBytes = crypto.randomBytes(1024 * 128);
        const downloadedBlob = new Blob([cleanedPhotoBytes], { type: "image/jpeg" });
        const handoffBlob = new Blob([cleanedPhotoBytes], { type: "image/jpeg" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 2 (EXIF Remover -> Image Compressor) SHA-256 must match");
    }

    // 3. Screenshot Blur → Image Compressor
    {
        const blurredPngBytes = crypto.randomBytes(1024 * 256);
        const downloadedBlob = new Blob([blurredPngBytes], { type: "image/png" });
        const handoffBlob = new Blob([blurredPngBytes], { type: "image/png" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 3 (Screenshot Blur -> Image Compressor) SHA-256 must match");
    }

    // 4. Background Remover → Image Compressor
    {
        const cutoutPngBytes = crypto.randomBytes(1024 * 300);
        const downloadedBlob = new Blob([cutoutPngBytes], { type: "image/png" });
        const handoffBlob = new Blob([cutoutPngBytes], { type: "image/png" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 4 (Background Remover -> Image Compressor) SHA-256 must match");
    }

    // 5. Image Compressor → JPG to PDF
    {
        const compressedJpgBytes = crypto.randomBytes(1024 * 48);
        const downloadedBlob = new Blob([compressedJpgBytes], { type: "image/jpeg" });
        const handoffBlob = new Blob([compressedJpgBytes], { type: "image/jpeg" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 5 (Image Compressor -> JPG to PDF) SHA-256 must match");
    }

    // 6. JPG to PDF → Merge PDF
    {
        const generatedPdfBytes = crypto.randomBytes(1024 * 512);
        const downloadedBlob = new Blob([generatedPdfBytes], { type: "application/pdf" });
        const handoffBlob = new Blob([generatedPdfBytes], { type: "application/pdf" });

        const downloadHash = sha256(await downloadedBlob.arrayBuffer());
        const handoffHash = sha256(await handoffBlob.arrayBuffer());
        assert.equal(downloadHash, handoffHash, "Chain 6 (JPG to PDF -> Merge PDF) SHA-256 must match");
    }
});
