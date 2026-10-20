import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { stripJpegMetadata } from "../src/lib/jpeg-metadata.ts";

function createTestJpegWithMetadata(outputPath) {
    // Generate a minimal valid JPEG using Python PIL
    execFileSync("python3", [
        "-c",
        `
from PIL import Image
im = Image.new("RGB", (32, 32), color=(120, 180, 240))
im.save("${outputPath}", "JPEG", quality=90)
`,
    ]);

    // Inject EXIF, GPS, XMP, and IPTC using exiftool
    execFileSync("exiftool", [
        "-overwrite_original",
        "-EXIF:Make=TestMake Camera",
        "-EXIF:Model=TestModel Pro",
        "-EXIF:DateTimeOriginal=2026:10:21 07:30:00",
        "-GPS:GPSLatitude=37.7749",
        "-GPS:GPSLatitudeRef=N",
        "-GPS:GPSLongitude=122.4194",
        "-GPS:GPSLongitudeRef=W",
        "-GPS:GPSAltitude=50",
        "-XMP:Title=Confidential Project Shot",
        "-XMP:Description=Detailed internal design schema",
        "-XMP:Creator=Lead Engineer",
        "-IPTC:By-line=Confidential Photographer",
        "-IPTC:Caption-Abstract=Classified press preview",
        "-IPTC:Keywords=internal,secret,review",
        outputPath,
    ]);
}

test("stripJpegMetadata strips EXIF, XMP, IPTC and preserves post-SOS image data byte-for-byte", async (t) => {
    const testFile = join("/tmp", `test-exif-xmp-iptc-${Date.now()}.jpg`);
    createTestJpegWithMetadata(testFile);

    try {
        const inputBytes = readFileSync(testFile);
        const inputBuffer = inputBytes.buffer.slice(
            inputBytes.byteOffset,
            inputBytes.byteOffset + inputBytes.byteLength
        );

        const result = stripJpegMetadata(inputBuffer);
        assert.ok(result, "stripJpegMetadata returned a result");
        assert.strictEqual(result.removedAny, true, "Metadata segments were detected and removed");

        const strippedBytes = new Uint8Array(result.buffer);

        // 1. Verify output starts with SOI (0xFFD8)
        assert.strictEqual(strippedBytes[0], 0xff, "Byte 0 must be 0xFF");
        assert.strictEqual(strippedBytes[1], 0xd8, "Byte 1 must be 0xD8 (SOI)");

        // 2. Scan stripped output segments to verify absence of EXIF, XMP, IPTC
        let pos = 2;
        let strippedSosOffset = -1;
        const observedStrippedMarkers = [];

        while (pos < strippedBytes.length) {
            if (strippedBytes[pos] !== 0xff) break;
            while (pos < strippedBytes.length && strippedBytes[pos] === 0xff) pos++;
            if (pos >= strippedBytes.length) break;

            const marker = strippedBytes[pos];
            const markerStart = pos - 1;
            pos++;

            if (marker === 0xda) {
                strippedSosOffset = markerStart;
                break;
            }
            if (marker === 0xd9) break;
            if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) continue;

            const len = (strippedBytes[pos] << 8) | strippedBytes[pos + 1];
            const payload = strippedBytes.subarray(pos + 2, pos + len);
            observedStrippedMarkers.push(marker);

            // Assert no EXIF APP1
            if (marker === 0xe1) {
                const isExif =
                    payload.length >= 6 &&
                    payload[0] === 0x45 && payload[1] === 0x78 && payload[2] === 0x69 &&
                    payload[3] === 0x66 && payload[4] === 0x00 && payload[5] === 0x00;
                assert.strictEqual(isExif, false, "EXIF APP1 segment must not be present in stripped JPEG");

                const isXmp =
                    payload.length >= 29 &&
                    Buffer.from(payload.subarray(0, 29)).toString("ascii") === "http://ns.adobe.com/xap/1.0/\0";
                assert.strictEqual(isXmp, false, "XMP APP1 segment must not be present in stripped JPEG");
            }

            // Assert no Photoshop IPTC APP13
            if (marker === 0xed) {
                const isPhotoshop =
                    payload.length >= 14 &&
                    Buffer.from(payload.subarray(0, 14)).toString("ascii") === "Photoshop 3.0\0";
                if (isPhotoshop) {
                    const hasIptc =
                        Buffer.from(payload).includes(Buffer.from([0x38, 0x42, 0x49, 0x4d, 0x04, 0x04])) ||
                        Buffer.from(payload).includes(Buffer.from([0x1c, 0x02]));
                    assert.strictEqual(hasIptc, false, "Photoshop IPTC APP13 segment must not be present in stripped JPEG");
                }
            }

            pos += len;
        }

        assert.notStrictEqual(strippedSosOffset, -1, "SOS marker found in stripped JPEG");

        // 3. Find SOS in input and assert byte-for-byte identity of all post-SOS data
        let origSosOffset = -1;
        pos = 2;
        while (pos < inputBytes.length) {
            if (inputBytes[pos] !== 0xff) break;
            while (pos < inputBytes.length && inputBytes[pos] === 0xff) pos++;
            if (pos >= inputBytes.length) break;
            const marker = inputBytes[pos];
            const markerStart = pos - 1;
            pos++;
            if (marker === 0xda) {
                origSosOffset = markerStart;
                break;
            }
            if (marker === 0xd9) break;
            if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) continue;
            const len = (inputBytes[pos] << 8) | inputBytes[pos + 1];
            pos += len;
        }

        assert.notStrictEqual(origSosOffset, -1, "SOS marker found in original JPEG");

        const origSosData = inputBytes.subarray(origSosOffset);
        const strippedSosData = strippedBytes.subarray(strippedSosOffset);

        assert.strictEqual(
            origSosData.length,
            strippedSosData.length,
            `SOS payload length matches (${origSosData.length} bytes)`
        );
        assert.deepStrictEqual(
            Buffer.from(strippedSosData),
            Buffer.from(origSosData),
            "Image data from SOS to EOF is 100% byte-for-byte identical"
        );

        // 4. Verify removed segments report
        const removed = result.observedSegments.filter((s) => s.stripped);
        assert.ok(removed.length >= 3, `Expected at least 3 stripped segments, got ${removed.length}`);
        assert.ok(removed.some((s) => s.reason?.includes("EXIF")), "EXIF was recorded as removed");
        assert.ok(removed.some((s) => s.reason?.includes("XMP")), "XMP was recorded as removed");
        assert.ok(removed.some((s) => s.reason?.includes("IPTC")), "IPTC was recorded as removed");

        // 5. Idempotency test: stripping an already stripped image should report removedAny: false
        const reStripped = stripJpegMetadata(result.buffer);
        assert.ok(reStripped, "Re-stripping returns result");
        assert.strictEqual(reStripped.removedAny, false, "Second strip pass removes nothing");
        assert.strictEqual(reStripped.buffer.byteLength, result.buffer.byteLength, "Size remains unchanged");
    } finally {
        if (existsSync(testFile)) unlinkSync(testFile);
    }
});

test("stripJpegMetadata returns null on invalid or non-JPEG inputs", () => {
    assert.strictEqual(stripJpegMetadata(new ArrayBuffer(0)), null);
    assert.strictEqual(stripJpegMetadata(new Uint8Array([0x00, 0x01, 0x02]).buffer), null);
    assert.strictEqual(stripJpegMetadata(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer), null); // PNG header
});

test("stripJpegMetadata keeps non-metadata segments intact (APP0, DQT, DHT, SOF0)", () => {
    const cleanFile = join("/tmp", `test-clean-${Date.now()}.jpg`);
    execFileSync("python3", [
        "-c",
        `
from PIL import Image
im = Image.new("RGB", (16, 16), color=(255, 0, 0))
im.save("${cleanFile}", "JPEG", quality=85)
`,
    ]);

    try {
        const inputBytes = readFileSync(cleanFile);
        const inputBuffer = inputBytes.buffer.slice(
            inputBytes.byteOffset,
            inputBytes.byteOffset + inputBytes.byteLength
        );
        const result = stripJpegMetadata(inputBuffer);
        assert.ok(result);
        // Clean PIL file has JFIF APP0, DQT, SOF0, DHT, SOS — no EXIF/XMP/IPTC
        assert.strictEqual(result.removedAny, false);
        const observedNames = result.observedSegments.map((s) => s.name);
        assert.ok(observedNames.includes("APP0"), "APP0 preserved");
        assert.ok(observedNames.includes("DQT"), "DQT preserved");
        assert.ok(observedNames.includes("SOS"), "SOS preserved");
    } finally {
        if (existsSync(cleanFile)) unlinkSync(cleanFile);
    }
});
