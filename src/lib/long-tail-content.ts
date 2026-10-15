import type { HubContent } from "./hub-content";
import { imageCompressorPages } from "./long-tail/image-compressor";
import { pdfKitPages } from "./long-tail/pdf-kit";
import { videoToGifPages } from "./long-tail/video-to-gif";
import { excelFormulaBotPages } from "./long-tail/excel-formula-bot";
import { audioToTextPages } from "./long-tail/audio-to-text";
import { exifRemoverPages } from "./long-tail/exif-remover";

/**
 * Long-tail scenario pages.
 *
 * Each entry reuses a shared tool component with a preset (see ToolPreset)
 * and carries fully independent editorial content — never a find-and-replace
 * of the hub page copy. HubBody renders the shared template (trust note,
 * how-to, sections, FAQ, related links).
 *
 * Content lives in per-family files under src/lib/long-tail/; this module
 * only defines the shared types and the combined registry (used by
 * src/app/sitemap.ts and hub pages).
 */
export interface ToolPreset {
    /** image-compressor: iteratively compress each image under this size (MB). */
    targetSizeMB?: number;
    /** image-compressor: convert output to WebP via canvas encoding. */
    outputFormat?: "webp";
    /** pdf-kit: which tool mode the page opens on. */
    pdfMode?: "merge" | "compress" | "split" | "extract" | "jpg-to-pdf";
    /** video-to-gif: starting fps / width. */
    gifFps?: number;
    gifWidth?: number;
    /** video-to-gif: advisory size target shown to the user (MB), e.g. Discord 8MB. */
    gifMaxMB?: number;
    /** excel-formula-bot: prefilled example prompt in the input box. */
    formulaExample?: string;
    /** excel-formula-bot: preselected platform tab. */
    platform?: "excel" | "google-sheets";
}

export interface LongTailContent extends HubContent {
    /** URL slug under the hub, e.g. "compress-image-to-100kb". */
    slug: string;
    /** Key into hubContent, e.g. "image-compressor". */
    hubId: string;
    metaTitle: string;
    metaDescription: string;
    /** 4-6 English keywords for the metadata tag. */
    keywords: string[];
    /** Preset passed to the shared tool component. */
    preset?: ToolPreset;
}

/** Registry of all indexed long-tail pages (sitemap + hub link lists). */
export const longTailPages: LongTailContent[] = [
    ...imageCompressorPages,
    ...pdfKitPages,
    ...videoToGifPages,
    ...excelFormulaBotPages,
    ...videoToGifPages,
    ...audioToTextPages,
    ...exifRemoverPages,
];

/** Re-exported for the sample page (keeps its existing import working). */
export { compressImageTo100kb } from "./long-tail/image-compressor";

/** Re-exports for the batch-2 long-tail pages. */
export { compressPdfForEmail } from "./long-tail/pdf-kit";
export { compressImageTo1mb } from "./long-tail/image-compressor";
export { removeImageMetadata } from "./long-tail/exif-remover";
export { excelCountifFormulaGenerator } from "./long-tail/excel-formula-bot";
export { transcribePodcastToText } from "./long-tail/audio-to-text";
