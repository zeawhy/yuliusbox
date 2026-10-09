/**
 * Lightweight tool route index for sitemap.ts.
 *
 * sitemap.ts must NOT import from "@/lib/tools-data": that module imports
 * lucide-react (icon components), which balloons the sitemap serverless
 * function past Vercel's 250MB uncompressed limit (was 253.82MB).
 *
 * Keep hrefs in sync with src/lib/tools-data.ts. Only routes starting with
 * "/" are real pages; external URLs and "#" placeholders are excluded here
 * (sitemap.ts filters them anyway).
 */
export interface ToolRoute {
    href: string;
}

export const toolRoutes: ToolRoute[] = [
    { href: "/tools/audio-to-text" },
    { href: "/tools/background-remover" },
    { href: "/tools/color-palette" },
    { href: "/tools/cron-generator" },
    { href: "/tools/domain-lookup" },
    { href: "/tools/email-paraphraser" },
    { href: "/tools/excel-formula-bot" },
    { href: "/tools/excel-to-pdf" },
    { href: "/tools/exif-remover" },
    { href: "/tools/id-watermark" },
    { href: "/tools/image-compressor" },
    { href: "/tools/image-editor" },
    { href: "/tools/image-grid-joiner" },
    { href: "/tools/image-grid-splitter" },
    { href: "/tools/json-to-code" },
    { href: "/tools/pdf-kit" },
    { href: "/tools/ppt-to-pdf" },
    { href: "/tools/privacy-generator" },
    { href: "/tools/regex-generator" },
    { href: "/tools/safe-zone-overlay" },
    { href: "/tools/screenshot-beautifier" },
    { href: "/tools/speed-test" },
    { href: "/tools/sql-builder" },
    { href: "/tools/url-to-pdf" },
    { href: "/tools/video-downloader" },
    { href: "/tools/video-to-gif" },
    { href: "/tools/word-to-pdf" },
    { href: "/tools/youtube-optimizer" },
];
