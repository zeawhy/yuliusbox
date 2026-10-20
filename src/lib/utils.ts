import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a byte count for display, site-wide.
 *
 * Decimal units (1 KB = 1000 B), matching the convention already used by
 * DraggableFileList and ImageCompressor (upload-portal limits are decimal).
 * - < 1 KB: integer bytes, e.g. "500 B"
 * - < 1 MB: KB with 0–1 decimals (whole KB has no decimal), e.g. "512 KB", "1.5 KB"
 * - >= 1 MB: MB/GB with 1–2 decimals, trailing zeros trimmed, e.g. "1.05 MB", "5.5 MB"
 */
export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    if (bytes < 1000) return `${Math.round(bytes)} B`;

    const units = ["KB", "MB", "GB", "TB"];
    let value = bytes / 1000;
    let unitIndex = 0;
    while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
    }

    if (unitIndex === 0) {
        // KB range: no decimal for whole KB, one decimal otherwise.
        const rounded = Math.round(value * 10) / 10;
        if (rounded >= 1000) return "1 MB"; // e.g. 999,960 B rounds up to the MB boundary
        return Number.isInteger(rounded) ? `${rounded} KB` : `${rounded.toFixed(1)} KB`;
    }

    // MB and up: up to two decimals, trailing zeros trimmed.
    const text = value.toFixed(2).replace(/\.?0+$/, "");
    return `${text} ${units[unitIndex]}`;
}
