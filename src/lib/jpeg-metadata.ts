/**
 * Lossless JPEG metadata stripping utility.
 *
 * Strips metadata segments (EXIF APP1, XMP APP1, and Photoshop APP13 containing IPTC)
 * by walking the JPEG marker segments directly without re-encoding pixels.
 * All image scan data after Start of Scan (SOS, 0xFFDA) remains 100% byte-for-byte identical.
 */

export interface JpegSegmentReport {
    marker: number;
    markerHex: string;
    name: string;
    offset: number;
    length: number;
    stripped: boolean;
    reason?: string;
}

export interface StripJpegResult {
    buffer: ArrayBuffer;
    removedAny: boolean;
    observedSegments: JpegSegmentReport[];
}

const EXIF_HEADER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"
const XMP_HEADER = [
    0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x6e, 0x73, 0x2e, 0x61, 0x64, 0x6f, 0x62, 0x65, 0x2e,
    0x63, 0x6f, 0x6d, 0x2f, 0x78, 0x61, 0x70, 0x2f, 0x31, 0x2e, 0x30, 0x2f, 0x00,
]; // "http://ns.adobe.com/xap/1.0/\0"
const XMP_EXT_HEADER = [
    0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x6e, 0x73, 0x2e, 0x61, 0x64, 0x6f, 0x62, 0x65, 0x2e,
    0x63, 0x6f, 0x6d, 0x2f, 0x78, 0x6d, 0x70, 0x2f, 0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x2f, 0x00,
]; // "http://ns.adobe.com/xmp/extension/\0"
const PHOTOSHOP_HEADER = [
    0x50, 0x68, 0x6f, 0x74, 0x6f, 0x73, 0x68, 0x6f, 0x70, 0x20, 0x33, 0x2e, 0x30, 0x00,
]; // "Photoshop 3.0\0"

function matchPrefix(data: Uint8Array, offset: number, prefix: number[]): boolean {
    if (offset + prefix.length > data.length) return false;
    for (let i = 0; i < prefix.length; i++) {
        if (data[offset + i] !== prefix[i]) return false;
    }
    return true;
}

/** Check if Photoshop APP13 segment contains IPTC data (8BIM 0x0404 or IPTC tag marker 0x1C 0x02) */
function containsIptcData(data: Uint8Array, payloadOffset: number, payloadLength: number): boolean {
    const end = payloadOffset + payloadLength;
    // Scan for "8BIM" (0x38, 0x42, 0x49, 0x4D) followed by resource ID 0x0404 (IPTC-NAA)
    for (let i = payloadOffset + PHOTOSHOP_HEADER.length; i + 6 <= end; i++) {
        if (
            data[i] === 0x38 &&
            data[i + 1] === 0x42 &&
            data[i + 2] === 0x49 &&
            data[i + 3] === 0x4d &&
            data[i + 4] === 0x04 &&
            data[i + 5] === 0x04
        ) {
            return true;
        }
    }
    // Also scan for standard IPTC record tag delimiter 0x1C 0x02 within payload
    for (let i = payloadOffset + PHOTOSHOP_HEADER.length; i + 2 <= end; i++) {
        if (data[i] === 0x1c && data[i + 1] === 0x02) {
            return true;
        }
    }
    return false;
}

function getMarkerName(marker: number): string {
    switch (marker) {
        case 0xd8: return "SOI";
        case 0xd9: return "EOI";
        case 0xda: return "SOS";
        case 0xdb: return "DQT";
        case 0xdc: return "DNL";
        case 0xdd: return "DRI";
        case 0xde: return "DHP";
        case 0xdf: return "EXP";
        case 0xc0: return "SOF0 (Baseline)";
        case 0xc1: return "SOF1 (Extended Sequential)";
        case 0xc2: return "SOF2 (Progressive)";
        case 0xc3: return "SOF3 (Lossless)";
        case 0xc4: return "DHT";
        case 0xfe: return "COM";
        default:
            if (marker >= 0xe0 && marker <= 0xef) {
                return `APP${marker - 0xe0}`;
            }
            if (marker >= 0xd0 && marker <= 0xd7) {
                return `RST${marker - 0xd0}`;
            }
            return `0x${marker.toString(16).toUpperCase()}`;
    }
}

/**
 * Strip EXIF APP1, XMP APP1, and Photoshop IPTC APP13 segments from a JPEG binary buffer.
 * Preserves original compression and pixel data: everything from SOS onwards is byte-for-byte untouched.
 *
 * Returns null if the data is not a valid JPEG.
 */
export function stripJpegMetadata(buffer: ArrayBuffer): StripJpegResult | null {
    const data = new Uint8Array(buffer);

    // JPEG must start with SOI (0xFFD8)
    if (data.length < 4 || data[0] !== 0xff || data[1] !== 0xd8) {
        return null;
    }

    const observedSegments: JpegSegmentReport[] = [
        {
            marker: 0xd8,
            markerHex: "0xFFD8",
            name: "SOI",
            offset: 0,
            length: 2,
            stripped: false,
        },
    ];

    const chunks: Uint8Array[] = [];
    let chunkStart = 0;
    let pos = 2;
    let removedAny = false;

    while (pos < data.length) {
        if (data[pos] !== 0xff) {
            // Unexpected byte in segment headers - stop parsing to prevent corruption
            break;
        }

        // Skip any fill 0xFF bytes preceding marker
        while (pos < data.length && data[pos] === 0xff) {
            pos++;
        }
        if (pos >= data.length) break;

        const marker = data[pos];
        const markerStart = pos - 1;
        pos++;

        // Standalone markers:
        if (marker === 0xd9) {
            // EOI
            observedSegments.push({
                marker,
                markerHex: "0xFFD9",
                name: "EOI",
                offset: markerStart,
                length: data.length - markerStart,
                stripped: false,
            });
            break;
        }

        if (marker === 0xda) {
            // SOS: Stop segment parsing; all data from markerStart to EOF is scan data + EOI
            observedSegments.push({
                marker,
                markerHex: "0xFFDA",
                name: "SOS",
                offset: markerStart,
                length: data.length - markerStart,
                stripped: false,
            });
            break;
        }

        if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
            // Standalone marker with no length (RST0..7, TEM)
            observedSegments.push({
                marker,
                markerHex: `0xFF${marker.toString(16).toUpperCase().padStart(2, "0")}`,
                name: getMarkerName(marker),
                offset: markerStart,
                length: 2,
                stripped: false,
            });
            continue;
        }

        // Markers with 2-byte length field
        if (pos + 2 > data.length) break;
        const len = (data[pos] << 8) | data[pos + 1];
        if (len < 2 || pos + len > data.length) break;

        const segEnd = pos + len;
        const payloadOffset = pos + 2;
        const payloadLen = len - 2;

        let shouldStrip = false;
        let reason: string | undefined;

        if (marker === 0xe1) {
            // APP1: Check EXIF or XMP
            if (payloadLen >= EXIF_HEADER.length && matchPrefix(data, payloadOffset, EXIF_HEADER)) {
                shouldStrip = true;
                reason = "EXIF APP1 metadata segment";
            } else if (
                (payloadLen >= XMP_HEADER.length && matchPrefix(data, payloadOffset, XMP_HEADER)) ||
                (payloadLen >= XMP_EXT_HEADER.length && matchPrefix(data, payloadOffset, XMP_EXT_HEADER))
            ) {
                shouldStrip = true;
                reason = "XMP APP1 metadata segment";
            }
        } else if (marker === 0xed) {
            // APP13: Check Photoshop 3.0 containing IPTC
            if (
                payloadLen >= PHOTOSHOP_HEADER.length &&
                matchPrefix(data, payloadOffset, PHOTOSHOP_HEADER) &&
                containsIptcData(data, payloadOffset, payloadLen)
            ) {
                shouldStrip = true;
                reason = "Photoshop APP13 segment containing IPTC data";
            }
        }

        const segName = getMarkerName(marker);
        const markerHex = `0xFF${marker.toString(16).toUpperCase().padStart(2, "0")}`;

        if (shouldStrip) {
            removedAny = true;
            observedSegments.push({
                marker,
                markerHex,
                name: segName,
                offset: markerStart,
                length: segEnd - markerStart,
                stripped: true,
                reason,
            });

            // Keep everything before this segment
            if (markerStart > chunkStart) {
                chunks.push(data.subarray(chunkStart, markerStart));
            }
            chunkStart = segEnd;
        } else {
            observedSegments.push({
                marker,
                markerHex,
                name: segName,
                offset: markerStart,
                length: segEnd - markerStart,
                stripped: false,
            });
        }

        pos = segEnd;
    }

    // Append whatever remains (including the entire SOS marker, scan data, and EOI)
    if (chunkStart < data.length) {
        chunks.push(data.subarray(chunkStart));
    }

    if (!removedAny) {
        return {
            buffer,
            removedAny: false,
            observedSegments,
        };
    }

    // Assemble output buffer
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
        result.set(c, offset);
        offset += c.length;
    }

    return {
        buffer: result.buffer,
        removedAny: true,
        observedSegments,
    };
}
