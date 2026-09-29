// Central SEO policy for tool pages.
//
// Context: Google has only a handful of YuliusBox pages indexed. 26 thin,
// low-differentiation tool pages dilute crawl budget and topical authority,
// so the strategy is to keep only the 5 highest-potential tools indexable.
// Everything else stays fully functional for direct visitors but is hidden
// from search engines via `X-Robots-Tag: noindex` (next.config.ts) and
// excluded from sitemap.xml.
//
// video-downloader / youtube-optimizer are additionally isolated here:
// downloader-style pages carry AdSense policy risk, and one bad page can
// affect the whole account once ads go live.
//
// This file contains plain strings only (no component/icon imports) so it is
// safe to import from next.config.ts at build time.
//
// To re-index a tool later: remove its path from the list below and redeploy.

export const NOINDEX_TOOL_PATHS: string[] = [
    "/tools/background-remover",
    "/tools/color-palette",
    "/tools/cron-generator",
    "/tools/email-paraphraser",
    "/tools/excel-to-pdf",
    "/tools/id-watermark",
    "/tools/image-editor",
    "/tools/image-grid-joiner",
    "/tools/image-grid-splitter",
    "/tools/json-to-code",
    "/tools/ppt-to-pdf",
    "/tools/privacy-generator",
    "/tools/regex-generator",
    "/tools/safe-zone-overlay",
    "/tools/speed-test",
    "/tools/sql-builder",
    "/tools/url-to-pdf",
    "/tools/video-downloader",
    "/tools/video-to-gif",
    "/tools/word-to-pdf",
    "/tools/youtube-optimizer",
];

// The 5 tools that REMAIN indexable (English-first focus):
//   /tools/audio-to-text      — in-browser Whisper transcription (differentiator, paid-tier potential)
//   /tools/image-compressor   — huge search volume ("compress image")
//   /tools/excel-formula-bot  — high-RPM office-worker audience
//   /tools/pdf-kit            — massive "merge/split/compress pdf" demand
//   /tools/screenshot-beautifier — moderate demand, lower competition, shareable
export const INDEXED_TOOL_COUNT = 5;
