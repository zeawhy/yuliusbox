/**
 * ============================================================================
 * PRIVACY RED LINE — DO NOT VIOLATE
 * ============================================================================
 * Umami event tracking MUST NEVER send sensitive or identifying data:
 *  - NO file names, file paths, or raw file extensions
 *  - NO file contents, text snippets, or extracted metadata
 *  - NO watermark text or image overlays
 *  - NO AI input / prompt text, paraphrasing inputs, or generated answers
 *  - NO pasted text, SQL queries, regex patterns, or cron inputs
 *  - NO token contents, JWT claims, secret keys, or passwords
 *  - NO exact byte counts or file sizes that could fingerprint files
 *  - NO user-identifying data (IP addresses, usernames, personal info)
 *
 * Only coarse, aggregate metrics are allowed:
 *  - Stable tool slug: e.g. "image-compressor", "pdf-kit"
 *  - Coarse context in `detail`: e.g. "count:3", "mode:merge", "target:/tools/pdf-kit"
 *  - Machine-readable snake_case `errorCode`: e.g. "decode_failed", "wasm_load_failed"
 * ============================================================================
 */

declare global {
    interface Window {
        umami?: {
            track: (event: string, data?: Record<string, string | number | boolean>) => void;
        };
    }
}

export type ToolEventName =
    | "tool_view"
    | "file_selected"
    | "process_started"
    | "process_success"
    | "process_error"
    | "download_clicked"
    | "related_tool_clicked";

export interface ToolEventParams {
    tool: string;
    errorCode?: string;
    detail?: string;
}

export function trackToolEvent(event: ToolEventName, params: ToolEventParams): void {
    if (typeof window === "undefined") {
        return;
    }
    try {
        if (typeof window.umami?.track === "function") {
            const data: Record<string, string | number | boolean> = {
                tool: params.tool,
            };
            if (params.errorCode) {
                data.errorCode = params.errorCode;
            }
            if (params.detail) {
                data.detail = params.detail;
            }
            window.umami.track(event, data);
        }
    } catch {
        // Silently tolerate ad blockers or missing analytics script
    }
}

export function toolViewed(tool: string): void {
    trackToolEvent("tool_view", { tool });
}
