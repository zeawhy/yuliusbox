// Central SEO policy for tool pages.
//
// Context: Google has only a handful of YuliusBox pages indexed. 26 thin,
// low-differentiation tool pages dilute crawl budget and topical authority,
// so the strategy is to keep only the highest-potential tools indexable.
// Everything else stays fully functional for direct visitors but is hidden
// from search engines via `X-Robots-Tag: noindex` (next.config.ts) and
// excluded from sitemap.xml.
//
// video-downloader / youtube-optimizer are additionally isolated here:
// downloader-style pages carry AdSense policy risk, and one bad page can
// affect the whole account once ads go live. Both Claude consultations
// (2026-09-29) agree video-downloader should be deleted outright (410);
// that deletion is tracked as a follow-up, not done in this change.
//
// NOTE (2026-09-29, corrected): HEIC to JPG exists — it is the user's own
// separate domain heic2jpg-free.com, linked from tools-data.ts as
// "heic-2-jpg". It is a sister site, not a yuliusbox.com subpage, so it is
// not in this sitemap. Cross-linking between the two domains is recommended.
//
// This file contains plain strings only (no component/icon imports) so it is
// safe to import from next.config.ts at build time.
//
// To re-index a tool later: remove its path from the list below and redeploy.

export const NOINDEX_TOOL_PATHS: string[] = [
    "/tools/color-palette",
    "/tools/cron-generator",
    "/tools/email-paraphraser",
    "/tools/image-grid-joiner",
    "/tools/json-to-code",
    "/tools/regex-generator",
    "/tools/safe-zone-overlay",
    // speed-test keeps noindex for now: it received the SSR shell fix but
    // not the full content upgrade in the 2026-10-20 page-upgrade batch.
    "/tools/speed-test",
    "/tools/sql-builder",
    "/tools/video-downloader",
];

// The 6 tools that REMAIN indexable (English-first focus, per the merged
// recommendations of two Claude consultations on 2026-09-29):
//   /tools/audio-to-text      — in-browser Whisper transcription (differentiator, link magnet)
//   /tools/image-compressor   — huge search volume ("compress image"), main entry point
//   /tools/excel-formula-bot  — high-RPM office-worker audience, AdSense-friendly
//   /tools/pdf-kit            — massive "merge/split pdf" demand, long-tail entry
//   /tools/video-to-gif       — stable demand, "for Discord / under 10MB" long-tails
export const INDEXED_TOOL_COUNT = 5;
