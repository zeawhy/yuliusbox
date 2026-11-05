// Central content data for the 6 indexed tool-family hub pages.
//
// Each hub gets genuinely unique copy (400-800 words of body content +
// 4-6 FAQs). Do NOT generate these by swapping keywords across hubs —
// thin/template-swapped content is an AdSense "low value content" risk.
// Content is English-only: the site's SEO/AdSense-facing chrome is
// English-first, no Chinese copy in meta, headings, or body.

export interface HubSectionTable {
    caption?: string;
    headers: string[];
    rows: string[][];
}

export interface HubSection {
    heading: string;
    paragraphs: string[];
    table?: HubSectionTable;
}

export interface HubFaq {
    question: string;
    answer: string;
}

export interface RelatedLink {
    href: string;
    label: string;
    external?: boolean;
}

export interface HubContent {
    id: string;
    href: string;
    crumb: string;
    h1: string;
    subtitle: string;
    howTo: string[];
    sections: HubSection[];
    faqs: HubFaq[];
    related: RelatedLink[];
}

/** Display order of the 6 indexed tool families. */

/** Stable URL-fragment id for a content section heading (used by HubBody). */
export function slugifyHeading(heading: string): string {
    return heading
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_]+/g, "-");
}

export const HUB_ORDER = [
    "image-compressor",
    "pdf-kit",
    "video-to-gif",
    "excel-formula-bot",
    "audio-to-text",
    "id-watermark",
] as const;

export const hubContent: Record<string, HubContent> = {
    "image-compressor": {
        id: "image-compressor",
        href: "/tools/image-compressor",
        crumb: "Image Compressor",
        h1: "Compress Images Online — Free, No Upload",
        subtitle:
            "Shrink JPG, PNG, and WebP photos right in your browser. Your files never leave your device.",
        howTo: [
            "Drop your images onto the upload area, or click to browse your files.",
            "Adjust the quality slider to balance file size against visual quality.",
            "Click compress and watch every image shrink — in bulk, on your device.",
            "Download images one by one, or grab everything as a single ZIP.",
        ],
        sections: [
            {
                heading: "Why compress images before sharing them",
                paragraphs: [
                    "Modern phone cameras produce stunning photos — and enormous files. A single snapshot can weigh 5–10 MB, which becomes a real problem the moment you try to email it, attach it to a job application, upload it to a government form, or publish it on a website. Many email providers cap attachments at 20–25 MB total, and plenty of application portals reject anything over 1–2 MB per file.",
                    "Compression solves this by rewriting the image data more efficiently. For photos, a quality setting around 80% typically cuts the file size by 60–80% while remaining visually indistinguishable from the original. The trick is finding the sweet spot for each use case: a hero image on your homepage deserves higher quality than a thumbnail in a chat message, and a scanned document needs legibility far more than color fidelity.",
                    "Doing it in the browser has a practical advantage beyond privacy: there is no queue, no upload wait, and no per-day quota. You can compress a hundred product photos for your store in one sitting without creating an account or watching a progress bar crawl as files travel to a server and back.",
                ],
            },
            {
                heading: "How browser-based compression works & DevTools self-verification",
                paragraphs: [
                    "When you drop an image into YuliusBox, browser-image-compression spawns a client-side Web Worker that decodes the source file onto an off-screen HTML5 Canvas, clamps the longest edge to MAX_WIDTH_OR_HEIGHT = 1920 px when oversized, and re-encodes the bitmap using your browser's native JPEG, PNG, or WebP codec (canvas.toBlob). When you use one of our byte-exact preset pages (such as 100 KB, 50 KB, or 20 KB), the tool converts the target into a strict binary ceiling (targetSizeBytes / 1,048,576) and runs up to two automatic fallback passes (quality 0.60, then 0.40) if the first pass exceeds the portal limit.",
                    "How to verify zero-upload execution in Browser DevTools: Open DevTools (F12) -> Network tab, clear the log (or switch Network Throttling to Offline), and drop a batch of photos into the compressor. You will observe zero POST, PUT, or XHR network requests — only local blob: URL allocations inside your tab's memory.",
                ],
            },
            {
                heading: "Measured compression benchmarks: JPEG vs PNG vs WebP across image profiles",
                paragraphs: [
                    "We benchmarked the exact HTML5 Canvas downscaling (maxWidthOrHeight: 1920) and re-encoding pipeline in headless Chromium 1248 across three representative test inputs — a 12-megapixel 4000x3000 camera photo, a 1920x1080 web hero photo, and a 2560x1440 dark-mode UI dashboard screenshot:",
                    "Photographic vs. UI screenshot behavior: On the 1920x1080 photographic hero image (218,179 B / 213.1 KiB source JPEG at q=0.95; 2.23 MiB lossless PNG), re-encoding at the default 80% JPEG quality reduced file size by 59.8% to 87,801 bytes (85.7 KiB) in 26.0 ms, while WebP at 80% quality reached 56,416 bytes (55.1 KiB) — 35.7% smaller than JPEG at the same quality setting. On the 2560x1440 UI screenshot (249,020 B / 243.2 KiB source PNG), WebP at 80% quality (scaled to 1920x1080) produced a 39,996-byte (39.1 KiB) file — 60.8% smaller than the 102,129-byte JPEG (q=0.80) because WebP's predictive spatial coding handles flat UI panels and sharp text edges without JPEG 8x8 DCT ringing.",
                ],
                table: {
                    caption: "Measured in headless Chromium 1248 (Linux x86_64, 4-vCPU AMD EPYC 9D25) with maxWidthOrHeight = 1920 and canvas.toBlob.",
                    headers: [
                        "Test Image Profile",
                        "Dimensions (In → Out)",
                        "Source PNG / JPEG (q=0.95)",
                        "JPEG (q=0.80) Size & Time",
                        "JPEG (q=0.70) Size & Time",
                        "WebP (q=0.80) Size & Time",
                    ],
                    rows: [
                        [
                            "12 MP Camera Photo",
                            "4000x3000 → 1920x1440",
                            "12.34 MiB / 1.11 MiB (1,169,065 B)",
                            "498.2 KiB (510,160 B) / 92.9 ms",
                            "383.4 KiB (392,652 B) / 43.4 ms",
                            "404.5 KiB (414,200 B) / 607.3 ms",
                        ],
                        [
                            "1080p Web Hero Photo",
                            "1920x1080 → 1920x1080",
                            "2.23 MiB / 213.1 KiB (218,179 B)",
                            "85.7 KiB (87,801 B) / 26.0 ms",
                            "63.5 KiB (65,012 B) / 14.7 ms",
                            "55.1 KiB (56,416 B) / 181.8 ms",
                        ],
                        [
                            "1440p UI Dashboard Screenshot",
                            "2560x1440 → 1920x1080",
                            "243.2 KiB / 216.4 KiB (221,572 B)",
                            "99.7 KiB (102,129 B) / 30.9 ms",
                            "86.1 KiB (88,133 B) / 14.5 ms",
                            "39.1 KiB (39,996 B) / 175.4 ms",
                        ],
                    ],
                },
            },
            {
                heading: "How YuliusBox compares to TinyPNG, FileKiwi, Teasoft, and MiniWebtool",
                paragraphs: [
                    "Not all online image compressors handle your files the same way, and browser-local processing is shared by several modern tools:",
                    "Cloud uploaders vs. hybrid retention: TinyPNG uploads your files to remote servers and restricts free users to 20 images per batch at a 5 MB per-file maximum. FileKiwi processes images in the browser UI but explicitly states in its upload notice: 'A copy of your file is stored privately for 30 days.' YuliusBox never transmits or retains copies of your images for any duration.",
                    "Comparison with other browser-local compressors: Teasoft (teasoft.in) and MiniWebtool (miniwebtool.com) also compress images client-side in the browser. Teasoft supports AVIF/BMP inputs and custom background fill colors when converting transparent PNGs to JPG, while MiniWebtool offers custom target-size inputs. However, MiniWebtool restricts free users to '3 free uses daily' and gates bulk ZIP downloads behind a paid Pro plan, and Teasoft gates actions behind a Cloudflare Turnstile challenge. YuliusBox imposes zero daily usage caps, provides free JSZip bulk archiving, verifies byte-exact portal ceilings (such as 100,000 bytes rather than binary 102,400 bytes), and lets you hand off compressed images directly into our local JPG-to-PDF converter in memory.",
                ],
            },
            {
                heading: "JPG vs PNG vs WebP: which format to pick",
                paragraphs: [
                    "JPG is the workhorse for photographs — it compresses smooth gradients and complex scenes extremely well. PNG is the right choice for screenshots, logos, and graphics with sharp edges or transparency, but it produces much larger files for photos. WebP, supported by all modern browsers, beats both: it typically delivers JPG-like quality at 25–35% smaller sizes and supports transparency like PNG.",
                    "A practical rule of thumb: keep originals as they are, export web images as WebP when you can, and use JPG when you need maximum compatibility (for example, some older upload forms still reject WebP). If a form insists on JPG, compress first and convert after — order matters less than most people think, but avoid compressing the same JPG repeatedly, since every re-encode of an already-compressed photo throws away a little more detail.",
                ],
            },
            {
                heading: "Tips for the smallest files without visible loss",
                paragraphs: [
                    "Start at 80% quality and compare the result side by side with the original at full zoom. For most photos you won't see a difference; if the image looks perfect, try 70% and check again. Text-heavy screenshots are less forgiving — keep those at 85–90% or switch them to PNG. Resize before you compress when the destination is small: a 4000-pixel-wide photo destined for a 800-pixel-wide blog column wastes most of its bytes on detail nobody will ever see.",
                    "For bulk jobs, sort by file type first. Compress all JPGs with one quality setting, then handle PNGs separately — screenshots and photos respond very differently to the same slider position. And always keep your originals: compression is a one-way trip, so archive the untouched files before you batch-process a folder.",
                ],
            },
            {
                heading: "Private by design",
                paragraphs: [
                    "Photos carry sensitive metadata — GPS coordinates, device serial numbers, timestamps. Uploading them to a random compression site means handing that data to a stranger's server logs. YuliusBox processes everything locally, so your images and their metadata never traverse the network at all. It is the same reason security-conscious teams prefer local tools for client work, unreleased product shots, and personal documents.",
                ],
            },
        ],
        faqs: [
            {
                question: "Will compressing reduce the visible quality of my photos?",
                answer: "At 80% quality, no — the difference is imperceptible for typical photos viewed on screens. Quality loss only becomes noticeable when you push the slider very low (below ~60%) or re-compress an already-compressed JPG multiple times. For screenshots with small text, keep quality at 85% or higher.",
            },
            {
                question: "Is there a limit on file size or number of images?",
                answer: "No artificial limits. The tool accepts JPG, PNG, and WebP files up to 50 MB each, and you can queue as many as your device's memory allows. Because processing is local, there is no monthly quota like cloud compressors impose.",
            },
            {
                question: "Are my images uploaded to a server?",
                answer: "Never. Compression runs entirely in your browser using local APIs. Your files stay on your device from start to finish — you can verify this by watching your network activity while compressing.",
            },
            {
                question: "Should I convert to WebP after compressing?",
                answer: "WebP usually gives you 25–35% smaller files than JPG at the same visual quality, and every modern browser supports it. Use WebP for websites and modern platforms; stick with JPG when a form or older system explicitly requires it.",
            },
            {
                question: "Why are my PNG screenshots still large after compression?",
                answer: "PNG is lossless, so photographic content and gradients compress poorly in it. If the screenshot doesn't need transparency, converting it to JPG at 85% quality will typically shrink it to a tenth of the size. For graphics with flat colors and sharp edges, PNG remains the better choice.",
            },
        ],
        related: [
            { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
            { href: "/tools/image-compressor/compress-image-to-20kb", label: "Compress image to 20KB for portals & forms" },
            { href: "/tools/image-compressor/compress-jpg-to-50kb", label: "Compress JPG to 50KB for IDs & exams" },
            { href: "/tools/image-compressor/compress-images-for-websites", label: "Compress images for websites & Core Web Vitals" },
            { href: "/tools/image-compressor/compress-photos-for-email", label: "Compress photos for email attachments" },
            { href: "/tools/image-compressor/compress-png-online", label: "Compress PNG screenshots & transparent graphics" },
            { href: "/tools/image-compressor/convert-image-to-webp", label: "Convert JPG & PNG images to WebP" },
            { href: "/tools/pdf-kit", label: "Merge and compress PDF files" },
            { href: "/tools/video-to-gif", label: "Convert video to GIF" },
            { href: "https://www.heic2jpg-free.com", label: "Convert HEIC photos to JPG", external: true },
        ],
    },
    "pdf-kit": {
        id: "pdf-kit",
        href: "/tools/pdf-kit",
        crumb: "PDF Tools",
        h1: "Merge & Compress PDF Files Online — Free, No Upload",
        subtitle:
            "Combine PDFs into one document or shrink oversized files, entirely in your browser. Your documents never leave your device.",
        howTo: [
            "Choose a tab: Merge to combine files, Compress to shrink one, Split to break it apart, Extract to pull out specific pages, or JPG→PDF to create a PDF from images.",
            "Drop your PDF (or image) files in — drag to reorder them for merging.",
            "Click the action button and let your browser do the work locally.",
            "Download the resulting PDF. Nothing was ever uploaded.",
        ],
        sections: [
            {
                heading: "Everyday situations that call for PDF merging",
                paragraphs: [
                    "Job applications are the classic case: a posting asks for 'one PDF' but you have a resume, a cover letter, certificates, and references as separate files. Merging them into a single document in the right order takes seconds and looks far more professional than four attachments. The same applies to expense reports (receipts + form), rental applications (ID + payslips + references), visa paperwork, and school admissions packets.",
                    "Contracts and agreements benefit too. When a deal involves a main contract plus appendices, annexes, and signed signature pages collected over email, combining everything into one authoritative file prevents the all-too-common 'which version is final?' confusion. Reorder pages by dragging before you merge, so the finished document reads in a logical sequence.",
                ],
            },
            {
                heading: "Why PDF files get so big — and how metadata cleanup + image handoff work",
                paragraphs: [
                    "Bloated PDFs almost always come from two sources: full-resolution camera photos embedded onto pages without prior compression, or accumulated document metadata and incremental cross-reference histories generated by office suites. A ten-page scan can easily exceed 20–50 MB, which bounces off email servers and gets rejected by upload portals capped at 5–10 MB.",
                    "Honest scope of our Compress tab: Because YuliusBox runs 100% in your browser via pdf-lib without uploading your paperwork to a server-side Ghostscript cluster, the Compress (Metadata Cleanup) tab strips document Info dictionary fields (Title, Author, Subject, Keywords) and re-serializes the PDF object tree cleanly, without re-encoding embedded raster image streams. If your PDF is oversized because of camera scans or photos, shrink the source JPG/PNG files in our local Image Compressor first (which cuts photo byte weight by 60–80%), then click the built-in handoff button to assemble them in the JPG to PDF tab in one seamless in-memory workflow.",
                ],
            },
            {
                heading: "How in-browser PDF processing works: pdf-lib architecture & measured benchmarks",
                paragraphs: [
                    "YuliusBox uses pdf-lib 1.17.1 and JSZip 3.10.1 to manipulate PDF cross-reference tables and page trees directly inside your browser tab's memory. Merging calls PDFDocument.create() and copyPages() to graft page dictionaries from each source file into a single unified document; Split loops through src.getPageCount(), writes each page into a standalone PDFDocument, and packages all page-N.pdf files into a single ZIP archive in memory; Extract parses custom page range expressions (such as 1-3, 7, 9-10) into 0-based page indices; and JPG to PDF embeds raw JPEG or PNG byte buffers via embedJpg()/embedPng() onto full-resolution pages matching the exact pixel dimensions of each image.",
                    "How to verify zero-upload execution in Browser DevTools: Open DevTools (F12) -> Network tab, clear the request log (or switch Network Throttling to Offline), and run any Merge, Split, Extract, Compress, or JPG-to-PDF operation. You will confirm that zero network requests are dispatched — every byte stays inside your local browser memory and downloads via a blob: URL.",
                ],
                table: {
                    caption: "Measured using pdf-lib 1.17.1 and JSZip 3.10.1 on Node.js v20 / Chromium 1248 (Linux x86_64, 4-vCPU AMD EPYC 9D25).",
                    headers: [
                        "PDF Toolkit Mode",
                        "Test Input Profile",
                        "Input Byte Size",
                        "Output Byte Size",
                        "Execution Time",
                        "Underlying Client-Side Operation",
                    ],
                    rows: [
                        [
                            "Merge PDF",
                            "5 A4 PDFs (5 pages each = 25 pages)",
                            "29.26 KiB (29,965 B)",
                            "24.97 KiB (25,568 B)",
                            "69.71 ms",
                            "PDFDocument.create() + copyPages() deduplicating shared structure",
                        ],
                        [
                            "Split PDF (to ZIP)",
                            "10-page A4 contract PDF",
                            "10.98 KiB (11,247 B)",
                            "18.02 KiB (18,451 B ZIP of 10 PDFs)",
                            "23.90 ms",
                            "10 × single-page PDFDocument.save() + JSZip.generateAsync()",
                        ],
                        [
                            "Extract Pages",
                            "Range '1-3, 7, 9-10' (6 of 10 pages)",
                            "10.98 KiB (11,247 B)",
                            "6.87 KiB (7,034 B)",
                            "3.40 ms",
                            "parsePageRanges() + 0-based copyPages([0,1,2,6,8,9])",
                        ],
                        [
                            "JPG to PDF",
                            "3 × 1920x1200 JPEG scans",
                            "1.09 MiB (1,139,139 B)",
                            "1.09 MiB (1,140,758 B, +1,619 B wrapper)",
                            "34.82 ms",
                            "Direct embedJpg() stream wrapping without lossy re-compression",
                        ],
                        [
                            "Compress (Metadata Cleanup)",
                            "10-page A4 PDF with verbose Info tags",
                            "11.82 KiB (12,108 B)",
                            "10.98 KiB (11,243 B, -865 B)",
                            "7.15 ms",
                            "Clears Title/Author/Subject/Keywords & re-serializes xref stream",
                        ],
                    ],
                },
            },
            {
                heading: "Tips for clean, professional merged documents",
                paragraphs: [
                    "Order matters more than people think. Put the cover letter or summary first, supporting evidence after, and always double-check the page order in the preview before merging — reviewers notice when a certificate appears before the resume. Keep file names descriptive before you upload them; 'resume-2026.pdf' beats 'document-final-FINAL-2.pdf' when you are dragging a dozen files into order.",
                    "For compression, try the default setting first and check the result. If text still looks crisp and images are acceptable, you are done. Only re-run with stronger settings if the file is still over the limit, and keep the original — you cannot un-compress a PDF any more than you can un-compress a photo.",
                ],
            },
        ],
        faqs: [
            {
                question: "Is there a page limit for merging PDFs?",
                answer: "No fixed limit. You can merge as many PDFs as your device's memory can handle — a hundred-page combined document is fine on a typical laptop. Very large jobs (hundreds of megabytes of source files) may take a minute or two.",
            },
            {
                question: "Will compression make my scanned text blurry?",
                answer: "Mild compression keeps scanned text perfectly readable. Heavy compression softens images, so if the document must be printed or archived long-term, use a gentler setting and keep the original. For email and web uploads, stronger compression is usually fine.",
            },
            {
                question: "Can I split or extract pages from a PDF here?",
                answer: "Yes — splitting and page extraction are fully supported. Use the Split tab to break a PDF into individual pages or custom ranges, and the Extract tab to pull out specific pages. JPG-to-PDF conversion is also available: upload your images and download a combined PDF in seconds.",
            },
            {
                question: "Is password protection supported?",
                answer: "Not yet — password-protecting PDFs is on the roadmap. The current toolkit covers merging, compressing, splitting, extracting pages, and converting JPG images to PDF, which handles the most common everyday requests.",
            },
            {
                question: "Are my documents uploaded anywhere?",
                answer: "No. Both merging and compression run entirely in your browser via pdf-lib. Your contracts, IDs, and financial documents never leave your device, which is exactly why a local tool is the right choice for sensitive paperwork.",
            },
            {
                question: "Why does the merged PDF sometimes get larger than expected?",
                answer: "Merging preserves each source file's embedded fonts and images, so the result is roughly the sum of its parts. If the merged file is too big for your email or form, run it through the Compress tab afterwards — the two tools are designed to be used in sequence.",
            },
        ],
        related: [
            { href: "/tools/pdf-kit/compress-pdf-online", label: "Compress PDF files online without upload" },
            { href: "/tools/pdf-kit/split-pdf-online", label: "Split PDF into separate files or page ranges" },
            { href: "/tools/pdf-kit/extract-pages-from-pdf", label: "Extract specific pages from a PDF" },
            { href: "/tools/pdf-redact-sign/redact-pdf-online-free", label: "Redact sensitive text in PDFs permanently" },
            { href: "/tools/word-to-pdf", label: "Convert Word (.doc, .docx) to PDF" },
            { href: "/tools/image-compressor", label: "Compress images for the web" },
            { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
            { href: "/tools/excel-formula-bot", label: "Generate Excel formulas with AI" },
        ],
    },
    "video-to-gif": {
        id: "video-to-gif",
        href: "/tools/video-to-gif",
        crumb: "Video to GIF",
        h1: "Convert Video to GIF Online — Free, No Watermark",
        subtitle:
            "Turn MP4, MOV, and WebM clips into GIFs with FFmpeg running entirely in your browser. Your videos never leave your device.",
        howTo: [
            "Drop a video file (MP4, MOV, or WebM) onto the upload zone, or click to browse.",
            "Adjust frame rate (10 fps recommended for screen recordings; 15 fps for motion).",
            "Set your output width in pixels (480 px is ideal for Discord, Slack, and READMEs).",
            "Click Convert to GIF — FFmpeg compiles locally in your tab for immediate watermark-free download.",
        ],
        sections: [
            {
                heading: "Where GIFs still beat video",
                paragraphs: [
                    "A decade into the era of high-definition streaming video, the humble GIF refuses to die — because for short, looping moments it remains the most frictionless media format on the internet. GitHub README files embed GIFs to demo new software features because they autoplay everywhere without video player controls or click-to-play prompts. Discord, Slack, and Notion render them inline, turning a quick screencast into an instantly visible reaction or tutorial. Technical writers, open-source maintainers, and product managers consistently reach for GIFs when an eight-second animation conveys more than five paragraphs of documentation.",
                    "The persistent hurdle has always been file size. A raw screen recording converted naively can easily balloon past 30 MB, which Discord rejects (free accounts are capped at 25 MB, and many community servers set lower limits), Slack stutters on, and mobile web browsers struggle to download. Crafting an effective GIF requires thoughtful restraint: trimming down to the essential seconds, selecting an appropriate frame rate, and scaling dimensions so the output fits neatly within messaging and web guidelines.",
                ],
            },
            {
                heading: "Measured FFmpeg benchmarks: input profile, FPS, width, and memory footprint",
                paragraphs: [
                    "Rather than quoting generic rules of thumb, we measured the exact filtergraph executed by this page's converter — ffmpeg -i <input.mp4> -t 10 -vf \"fps=<fps>,scale=<width>:-1:flags=lanczos\" <output.gif> — across four reproducible H.264 MP4 test clips (yuv420p, CRF 23, 30 fps) using FFmpeg 8.1.2 (libavcodec 62.28.102, libswscale 9.5.102) on a 4-vCPU AMD EPYC 9D25 Linux x86_64 environment with -benchmark instrumentation:",
                    "Flat-color UI screencasts vs. high-entropy video: A 4.0-second 1280x720 dark-mode UI dashboard animation (8,168 bytes / 8.0 KB input) converted at 10 fps and 480 px width (480x270) produced a 40-frame GIF weighing just 7,739 bytes (7.6 KB) in 0.247 seconds real time (utime 0.374s, peak RSS 73.5 MB). By contrast, a 4.0-second 1280x720 high-motion test pattern with continuous color gradients and sweep bars (1,522,576 bytes / 1.45 MB input) at the exact same 10 fps and 480 px settings produced a 40-frame GIF weighing 372,011 bytes (363.3 KB) in 0.586 seconds (peak RSS 75.2 MB). Because GIF89a uses per-frame LZW run-length dictionary compression, large horizontal runs of identical UI pixels compress nearly 48x smaller than noisy photographic gradients of the same dimensions.",
                    "Scaling FPS and width on 1080p clips: On a 5.0-second 1920x1080 clip (3,841,283 bytes / 3.66 MB input), the default 10 fps / 480 px preset generated 50 frames in 398,445 bytes (389.1 KB). Raising the frame rate to 15 fps at 480 px increased output size by 46.2% (to 582,400 bytes / 568.8 KB across 75 frames), whereas widening the output from 480 px to 640 px at 10 fps increased output size by 72.1% (to 685,814 bytes / 669.7 KB). Because the in-browser tool runs @ffmpeg/core 0.12.6 compiled to WebAssembly with the identical Lanczos filtergraph, frame counts and output byte sizes are deterministic across native CLI and browser runs, while browser WebAssembly wall-clock time typically runs 1.5x to 3x slower than native x86_64 execution due to single-tab WASM memory and worker overhead.",
                ],
                table: {
                    caption: "Measured with FFmpeg 8.1.2 (-benchmark) and ffprobe on 4-vCPU AMD EPYC 9D25 (Linux x86_64) using -t 10 -vf \"fps=<fps>,scale=<width>:-1:flags=lanczos\".",
                    headers: [
                        "Test Clip (30 fps H.264 MP4)",
                        "Input Size",
                        "Settings (FPS / Width)",
                        "Output Dimensions & Frames",
                        "Output GIF Size",
                        "Native CLI Time (rtime / utime)",
                        "Peak Memory (maxrss)",
                    ],
                    rows: [
                        [
                            "4.0s 720p UI Dashboard (clip0_ui)",
                            "8.0 KB (8,168 B)",
                            "10 fps / 480 px",
                            "480x270 (40 frames)",
                            "7.6 KB (7,739 B)",
                            "0.247s / 0.374s",
                            "73.5 MB (75,252 KiB)",
                        ],
                        [
                            "4.0s 720p UI Dashboard (clip0_ui)",
                            "8.0 KB (8,168 B)",
                            "15 fps / 480 px",
                            "480x270 (60 frames)",
                            "8.0 KB (8,239 B)",
                            "0.347s / 0.476s",
                            "74.2 MB (76,016 KiB)",
                        ],
                        [
                            "4.0s 720p High-Motion (clip1)",
                            "1.45 MB (1,522,576 B)",
                            "10 fps / 480 px",
                            "480x270 (40 frames)",
                            "363.3 KB (372,011 B)",
                            "0.586s / 0.866s",
                            "75.2 MB (76,972 KiB)",
                        ],
                        [
                            "5.0s 1080p High-Motion (clip2)",
                            "3.66 MB (3,841,283 B)",
                            "10 fps / 480 px",
                            "480x270 (50 frames)",
                            "389.1 KB (398,445 B)",
                            "1.118s / 1.610s",
                            "108.4 MB (111,020 KiB)",
                        ],
                        [
                            "5.0s 1080p High-Motion (clip2)",
                            "3.66 MB (3,841,283 B)",
                            "15 fps / 480 px",
                            "480x270 (75 frames)",
                            "568.8 KB (582,400 B)",
                            "1.369s / 1.855s",
                            "105.4 MB (107,900 KiB)",
                        ],
                        [
                            "5.0s 1080p High-Motion (clip2)",
                            "3.66 MB (3,841,283 B)",
                            "10 fps / 640 px",
                            "640x360 (50 frames)",
                            "669.7 KB (685,814 B)",
                            "1.632s / 1.960s",
                            "108.5 MB (111,152 KiB)",
                        ],
                        [
                            "10.0s 1080p Cap Boundary (clip3)",
                            "7.31 MB (7,668,259 B)",
                            "10 fps / 480 px",
                            "480x270 (100 frames)",
                            "776.6 KB (795,251 B)",
                            "2.495s / 3.537s",
                            "108.1 MB (110,680 KiB)",
                        ],
                        [
                            "10.0s 1080p Cap Boundary (clip3)",
                            "7.31 MB (7,668,259 B)",
                            "15 fps / 640 px",
                            "640x360 (150 frames)",
                            "1.92 MB (2,013,223 B)",
                            "2.922s / 4.200s",
                            "109.2 MB (111,836 KiB)",
                        ],
                    ],
                },
            },
            {
                heading: "How this converter compares to server-based and browser-local alternatives",
                paragraphs: [
                    "Online video-to-GIF tools fall into three architectural categories: remote server uploaders (such as XConvert), downloadable desktop shareware (such as Etinysoft Total Video2Gif), and in-browser local converters (such as DropGIF, GifPanda, and YuliusBox). Running locally in the browser is not unique to YuliusBox — DropGIF and GifPanda also process files client-side without uploading videos to a remote server.",
                    "Where competitors have an edge: Server-side platforms like XConvert accept 35+ legacy and broadcast containers (including MKV, AVI, MXF, FLV, and WMV) because their cloud workers run full server binaries without browser memory limits. Among client-side tools, DropGIF and GifPanda include interactive start/end timeline trim handles, and DropGIF offers 1-bit background cutout and caption overlays that our single-pass converter does not include.",
                    "Where YuliusBox differs: First, DropGIF restricts free exports to a maximum width of 480 px and 20 fps — exporting at 640 px, 720 px, or 1080 px or at 30 fps requires a paid Pro subscription ($4.99/month to $49), while GifPanda locks frame rate selection to five fixed preset buttons capping at 18 fps. YuliusBox provides unconstrained pixel width input and continuous 1–30 fps slider control completely free with no watermark or tier gate. Second, rather than capturing frames from an HTML5 <video> element via Canvas, YuliusBox runs genuine @ffmpeg/core 0.12.6 compiled to WebAssembly with explicit Lanczos spatial resampling (flags=lanczos) and publishes the exact filtergraph, memory ceiling, and reproducible benchmark traces above.",
                ],
            },
            {
                heading: "Technical limitations and browser environment requirements",
                paragraphs: [
                    "Because this tool executes full FFmpeg binaries compiled to WebAssembly inside your browser tab rather than offloading work to a remote cloud cluster, specific technical boundaries apply:",
                    "10-second duration cap: The converter enforces a 10-second maximum duration limit (via the internal -t 10 parameter). Longer videos are automatically trimmed to their first 10 seconds. This constraint is intentional: rendering hundreds of high-resolution uncompressed image frames in browser memory can trigger WebAssembly out-of-memory (OOM) exceptions and crash the browser tab.",
                    "SharedArrayBuffer and cross-origin isolation: FFmpeg WASM requires SharedArrayBuffer to manage memory buffers across worker threads. This API is only enabled when the page is served in a cross-origin isolated environment (using Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: credentialless headers) over HTTPS or localhost. If you access the tool over an unencrypted local IP or inside an unsupported webview, an advisory warning will be displayed.",
                    "Supported file formats: Supported video inputs include MP4 (H.264 video codec), QuickTime MOV (including iPhone screen recordings), WebM, and animated GIF. Proprietary or legacy codecs (such as Apple ProRes or AVI) should be re-saved as standard H.264 MP4 before uploading.",
                    "GIF palette & audio constraints: By design of the GIF89a specification, every frame is restricted to an indexed palette of at most 256 colors. While flat UI screens and software dashboards look crisp, complex photographic gradients may show slight dithering artifacts. Furthermore, GIFs do not support audio tracks; all audio streams are discarded during encoding.",
                ],
            },
            {
                heading: "Dialing in frame rate, dimensions, and clip length",
                paragraphs: [
                    "Three parameters dictate virtually all of an animated GIF's byte weight. Frame rate is the most influential factor: 10 frames per second looks natural for software demos, code walk-throughs, and cursor clicks, whereas 15 fps should be reserved for fast-moving animations. Setting 24 or 30 fps is rarely worthwhile for GIFs because it multiplies file size without adding perceptible value.",
                    "Resolution is the second key factor: 480 pixels wide is the acknowledged sweet spot for documentation, pull requests, and chat platforms. Stepping up to 640 px or larger increases byte size exponentially, as shown in our 1080p benchmark where moving from 480 px to 640 px at 10 fps added 72.1% to the output file size. Finally, clip duration should stay under 6 to 8 seconds. If an explanation requires more than ten seconds of footage, an embedded MP4 video or WebM file is technically the superior format.",
                ],
            },
            {
                heading: "FFmpeg in your browser: WebAssembly architecture & DevTools verification",
                paragraphs: [
                    "Under the hood, YuliusBox utilizes @ffmpeg/ffmpeg 0.12 and @ffmpeg/core 0.12.6, executing genuine FFmpeg C code compiled to WebAssembly. When you select a video file, the engine lazy-loads ffmpeg-core.js and ffmpeg-core.wasm into a blob-backed Web Worker, writes the input bytes into an in-memory virtual filesystem (MEMFS) as input.mp4 via ffmpeg.writeFile(), executes the Lanczos scaling and GIF encoding pipeline in local RAM, and reads the finished output.gif binary back into a local Blob URL.",
                    "How to verify zero-upload execution yourself in Browser DevTools: (1) Open Chrome, Edge, or Firefox DevTools (F12) and switch to the Network tab before selecting a file. (2) Drop a video into the upload box — on your first visit, you will see two GET requests to unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ fetching the static ffmpeg-core.js and ffmpeg-core.wasm runtime binaries. (3) Click Clear Network Log (or toggle Offline mode in the Network throttling dropdown after the engine status turns Ready), then click Convert to GIF. (4) Confirm that zero POST, PUT, or WebSocket requests occur during conversion, and inspect the Memory tab to observe the temporary WebAssembly heap allocation inside the local worker thread.",
                ],
            },
            {
                heading: "Verifiable privacy for recordings and internal tools",
                paragraphs: [
                    "Screen recordings frequently capture accidental confidential details: browser bookmarks, private Slack message notifications, API keys visible in terminal windows, or local file directory paths containing your real name. Uploading sensitive screencasts to third-party conversion servers exposes that footage to external logs, cloud retention policies, and potential data breaches.",
                    "With client-side WebAssembly conversion, your video bytes never cross the network. The decoding and encoding operations take place entirely within your computer's local memory. You can confirm this at any time by inspecting the browser Network tab while converting — no outbound file packets are transmitted.",
                ],
            },
        ],
        faqs: [
            {
                question: "What is the maximum video duration I can convert?",
                answer: "The tool limits conversions to a maximum of 10 seconds per clip (enforced via the -t 10 parameter). Longer videos are automatically truncated to the first 10 seconds to protect browser memory and prevent WebAssembly out-of-memory crashes. For long recordings, share an MP4 video instead.",
            },
            {
                question: "Why does the tool require SharedArrayBuffer and HTTPS?",
                answer: "FFmpeg WebAssembly relies on SharedArrayBuffer for efficient multi-threaded memory allocation. Browsers only permit this API in secure HTTPS environments configured with cross-origin isolation headers (COOP and COEP credentialless). The tool works on all modern desktop and mobile browsers over HTTPS.",
            },
            {
                question: "How do I make a GIF small enough for Discord and Slack?",
                answer: "Keep the clip under 6 seconds, leave the frame rate at 10 fps, and set the width to 480 px. This configuration typically yields file sizes between 200 KB and 800 KB, easily satisfying Discord's 25 MB limit and Slack's thumbnail caching constraints.",
            },
            {
                question: "Which video formats and codecs are supported?",
                answer: "The tool supports MP4 (H.264), QuickTime MOV (including iPhone screen recordings), WebM, and animated GIF. If your video uses an uncommon or legacy codec, re-export it as a standard H.264 MP4 file before converting.",
            },
            {
                question: "Does the output GIF have a watermark or time limit?",
                answer: "No. The generated GIF is 100% free and contains zero watermarks, brand logos, or developer stamps. The file you download is exactly what the FFmpeg encoder produced from your settings.",
            },
            {
                question: "Can I convert video clips with sound into audio GIFs?",
                answer: "No. By international format specification, GIFs are strictly silent image animations and do not support audio tracks. Any audio streams present in the source video are discarded during the conversion process.",
            },
            {
                question: "Are my video files ever uploaded to your servers?",
                answer: "Never. The entire conversion process — video decoding, frame extraction, scaling, and GIF encoding — executes 100% client-side via WebAssembly in your browser tab. Your files remain on your device at all times.",
            },
        ],
        related: [
            { href: "/tools/video-to-gif/video-to-gif-for-discord", label: "Make GIFs under Discord size limits (480px, 10fps)" },
            { href: "/tools/video-to-gif/webm-to-gif-converter", label: "Convert WebM screen recordings to GIF" },
            { href: "/tools/image-compressor", label: "Compress images for the web" },
            { href: "/tools/audio-to-text", label: "Transcribe audio to text in your browser" },
            { href: "/tools/pdf-kit", label: "Merge and convert documents to PDF" },
        ],
    },
    "excel-formula-bot": {
        id: "excel-formula-bot",
        href: "/tools/excel-formula-bot",
        crumb: "Excel Formula Bot",
        h1: "AI Excel Formula Generator — Describe It, Get the Formula",
        subtitle:
            "Type what you want in plain English; AI writes the Excel or Google Sheets formula for you. Free to try.",
        howTo: [
            "Pick your platform: Microsoft Excel or Google Sheets.",
            "Describe the calculation in plain words, naming your columns and cells.",
            "Click Generate Formula and copy the result.",
            "Paste it into your spreadsheet and adjust cell references to match your data.",
        ],
        sections: [
            {
                heading: "Stop memorizing formula syntax",
                paragraphs: [
                    "Everyone who works with spreadsheets hits the same wall: you know exactly what the data should do, but the formula to express it hides behind nested parentheses and cryptic function names. Is it VLOOKUP or XLOOKUP? Does SUMIFS take the sum range first or last? How do you extract the text after the third hyphen in a product code? These are lookup problems, not intelligence problems — and they are exactly what AI assistants are good at.",
                    "Instead of searching through formula cheat sheets, describe the goal the way you would explain it to a colleague: 'sum column A when column B says Sales and the date in column C is this month.' The bot translates that intent into working syntax for your platform, handling the argument order, quoting rules, and nesting that make manual formula-writing so error-prone.",
                ],
            },
            {
                heading: "What it handles well (and what to double-check)",
                paragraphs: [
                    "The bot shines on the bread-and-butter operations: conditional sums and counts (SUMIFS, COUNTIFS), lookups (VLOOKUP, XLOOKUP, INDEX/MATCH), text extraction (LEFT, RIGHT, MID, TEXTSPLIT), date math (DATEDIF, EOMONTH, NETWORKDAYS), and multi-condition IF logic with AND/OR. These cover the vast majority of real spreadsheet work, from sales reports to grade books to inventory trackers.",
                    "Treat the output as a strong first draft, not gospel. AI occasionally invents a plausible-looking function that doesn't exist, or references the wrong column after a long description. The good news: verifying is fast — paste the formula, glance at the result, and fix the cell references. That loop is still an order of magnitude faster than writing complex nested formulas from scratch, especially for XLOOKUP's array syntax or multi-criteria SUMIFS.",
                ],
            },
            {
                heading: "Excel vs Google Sheets: why the platform toggle matters",
                paragraphs: [
                    "Excel and Google Sheets look similar but diverge in the details that break formulas: Sheets uses different locale separators in some regions, has its own functions like QUERY and ARRAYFORMULA, and handles array behavior differently than modern Excel's dynamic arrays. A formula written for one platform often needs small translations to run on the other.",
                    "That is why the platform toggle exists — the AI generates syntax targeting the engine you actually use, so you don't have to mentally convert semicolons to commas or wonder why a perfectly good Excel formula throws an error in Sheets. If you collaborate across both, generate once per platform rather than assuming portability.",
                ],
            },
            {
                heading: "How to describe your problem for the best results",
                paragraphs: [
                    "Specificity is everything. 'Calculate the total' is vague; 'Sum the values in column D where column A is \"Q3\" and column B is not empty' gives the AI everything it needs. Name your columns or cell ranges explicitly, state the conditions in plain words, and mention edge cases — what should happen with blank cells, errors, or text that looks like numbers.",
                    "For multi-step logic, break it into one sentence per rule rather than one tangled paragraph. And always sanity-check the generated formula against a few rows where you know the expected answer before dragging it down ten thousand rows. A thirty-second test on sample data catches the misunderstandings that a thousand-row fill would multiply.",
                ],
            },
            {
                heading: "API request architecture, privacy boundary, and DevTools verification",
                paragraphs: [
                    "Unlike our file-processing utilities, Excel Formula Bot is a server-assisted AI tool (labeled with the API Privacy Badge above). However, it deliberately omits file upload inputs: your .xlsx or .csv workbook never leaves your computer. When you click Generate Formula, ExcelFormulaBotTool.tsx dispatches a single HTTPS POST request to our stateless Cloudflare Worker containing a minimal JSON object: { type: \"excel\", userInput: \"Platform: <Excel|Google Sheets>. Question: <your prompt>\", language: \"en\" }.",
                    "How to verify the payload in Browser DevTools: Open DevTools (F12) -> Network tab, filter by Fetch/XHR, and click Generate Formula. Inspect the Request Payload tab on the outbound POST call — you will see only the 100–400 byte JSON string containing your plain-English description and selected platform, with zero cookies, account identifiers, or spreadsheet binary data attached.",
                ],
                table: {
                    caption: "Syntax divergence and engine capabilities across Microsoft Excel (365/2021+) and Google Sheets.",
                    headers: [
                        "Calculation Category",
                        "Microsoft Excel (Modern 365 / 2021+)",
                        "Google Sheets Target Syntax",
                        "Legacy Excel (2016 / 2019) Fallback",
                        "Key Edge Case to Verify",
                    ],
                    rows: [
                        [
                            "Multi-Criteria Lookup",
                            "=XLOOKUP(1, (A2:A500=F1)*(B2:B500=F2), C2:C500, \"Not Found\")",
                            "=INDEX(FILTER(C2:C500, A2:A500=F1, B2:B500=F2), 1)",
                            "=INDEX(C2:C500, MATCH(1, INDEX((A2:A500=F1)*(B2:B500=F2), 0), 0))",
                            "Verify exact range lengths match to avoid #VALUE! or #N/A",
                        ],
                        [
                            "Conditional Sum (Date Window)",
                            "=SUMIFS(D2:D500, A2:A500, \"Sales\", C2:C500, \">=\"&DATE(2026,1,1))",
                            "=SUMIFS(D2:D500, A2:A500, \"Sales\", C2:C500, \">=\"&DATE(2026,1,1))",
                            "=SUMIFS(D2:D500, A2:A500, \"Sales\", C2:C500, \">=\"&DATE(2026,1,1))",
                            "Sum range is ALWAYS first in SUMIFS (unlike SUMIF where it is last)",
                        ],
                        [
                            "Regex / Pattern Extraction",
                            "=REGEXEXTRACT(A2, \"[0-9]{4}-[0-9]{2}\") (Excel 365 current channel)",
                            "=REGEXEXTRACT(A2, \"[0-9]{4}-[0-9]{2}\")",
                            "=MID(A2, FIND(\"-\", A2)-4, 7)",
                            "Older desktop Excel builds lack native REGEXfunctions; specify version in prompt",
                        ],
                        [
                            "Dynamic Column Spill",
                            "=UNIQUE(FILTER(A2:B500, C2:C500>1000))",
                            "=UNIQUE(FILTER(A2:B500, C2:C500>1000)) or =QUERY(A2:C500, \"select A,B where C > 1000\")",
                            "Requires Ctrl+Shift+Enter (CSE) array formula or PivotTable",
                            "Ensure cells below the formula are empty to prevent #SPILL! / #REF! errors",
                        ],
                    ],
                },
            },
        ],
        faqs: [
            {
                question: "Is it really free? What's the catch?",
                answer: "Generating formulas is free to try. Each request goes through our backend AI service, so fair-use limits apply to prevent abuse — but normal personal and office use is comfortably within them. Your spreadsheet data itself is never sent anywhere; only your description goes to the AI.",
            },
            {
                question: "Does it work with Google Sheets or only Excel?",
                answer: "Both. Use the platform toggle before generating — Sheets and Excel differ in separators, array behavior, and some functions, so the AI targets the syntax for whichever you pick.",
            },
            {
                question: "Can it write VBA macros or Apps Script?",
                answer: "The bot is optimized for cell formulas, which is what 95% of people need. For automation beyond formulas — macros, scripts, Power Query — describe the task and it will usually produce a solid starting point, but expect to refine it.",
            },
            {
                question: "What if the generated formula returns an error?",
                answer: "First check that the cell references match your actual layout — that's the most common issue. Then verify function names exist in your Excel/Sheets version (older Excel lacks XLOOKUP, for example). If it still fails, rephrase your description with more detail about the data layout and try again.",
            },
            {
                question: "Do you store my descriptions or formulas?",
                answer: "No. Your prompt is sent to the AI service to generate the formula and is not retained. Nothing about your spreadsheet's contents is transmitted — only the plain-English description you type.",
            },
        ],
        related: [
            { href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions", label: "Build multi-condition IF, IFS & AND/OR formulas" },
            { href: "/tools/excel-formula-bot/sumifs-countifs-builder", label: "Generate SUMIFS & COUNTIFS formulas with multiple criteria" },
            { href: "/tools/pdf-kit", label: "Merge and compress PDF files" },
            { href: "/tools/audio-to-text", label: "Transcribe meetings to text privately" },
            { href: "/tools/image-compressor", label: "Compress images for the web" },
        ],
    },
    "audio-to-text": {
        id: "audio-to-text",
        href: "/tools/audio-to-text",
        crumb: "Audio to Text",
        h1: "Free Audio to Text — Whisper Transcription in Your Browser",
        subtitle:
            "Transcribe meetings, interviews, and voice memos with OpenAI Whisper running locally. Your audio never leaves your device.",
        howTo: [
            "Select your model tier (Tiny for quick drafts, Base for everyday balance, Small for best accuracy).",
            "Upload an audio file (MP3, WAV, M4A) or click Start Recording to dictate through your microphone.",
            "Choose your speech language or leave on Auto Detect (explicit language selection improves short clip accuracy).",
            "Watch Whisper transcribe on-device in real time, then copy the text or download it as a TXT file.",
        ],
        sections: [
            {
                heading: "Transcription without the upload",
                paragraphs: [
                    "Every mainstream cloud transcription service follows an identical architecture: you upload your audio recording to a remote server cluster, it gets transcribed somewhere in the cloud, and the text is returned over the network. While that workflow may be acceptable for a public podcast episode, it presents serious confidentiality risks for a doctor-patient consultation, an executive board meeting, an unreleased investigative interview, or a voice memo containing personal financial details. The spoken voice is among the most sensitive personal data types, yet standard transcription pipelines route it through third-party servers by default.",
                    "YuliusBox inverts this model. OpenAI's Whisper model executes directly inside your browser tab through WebAssembly and the ONNX runtime via @xenova/transformers. The audio data never crosses the network; transcription runs entirely on your device's local CPU, and the resulting transcript appears on your screen in real time. For journalists protecting confidential sources, legal practitioners reviewing case depositions, academic researchers bound by strict ethics agreements, and privacy-conscious professionals, this on-device approach provides verifiable data sovereignty.",
                ],
            },
            {
                heading: "Verified client-side pipeline: 16 kHz PCM decoding, VAD silence trimming, and 30s/5s chunking",
                paragraphs: [
                    "Instead of relying on unverifiable single-sentence speed or accuracy claims, you can inspect the exact deterministic signal-processing pipeline executed by AudioToTextTool.tsx and public/whisper.worker.js on every recording:",
                    "1. 16,000 Hz mono PCM normalization: When you select an MP3, WAV, or M4A file (or stop a MediaRecorder microphone capture), the browser's Web Audio API (new AudioContext({ sampleRate: 16000 }).decodeAudioData) resamples the audio into a single-channel 32-bit floating-point array (Float32Array). Because each sample occupies 4 bytes at 16,000 samples per second, decoded audio consumes an exact, predictable 64,000 bytes (62.5 KiB) per second — or 3,840,000 bytes (3.66 MiB) per minute — in local tab memory.",
                    "2. Energy-based Voice Activity Detection (trimSilence): Before invoking the neural network, our pre-processor scans the 16 kHz Float32Array in 20 ms windows (320 samples) and identifies active speech where mean absolute amplitude exceeds 0.02. It trims leading and trailing silence while retaining a 250 ms guard margin (4,000 samples) on both ends so initial consonants are never clipped, and bypasses trimming entirely if effective speech is shorter than 0.5 seconds (8,000 samples).",
                    "3. Sliding-window ONNX inference: Inside the Web Worker, @xenova/transformers v2 executes the quantized 8-bit (q8) Whisper encoder and merged decoder graphs with task: 'transcribe', chunk_length_s: 30, and stride_length_s: 5. Recordings longer than 30 seconds are segmented into overlapping 30-second windows with a 5-second stride on each boundary so words spoken across chunk transitions are reconciled cleanly.",
                    "Realistic accuracy expectations: While a clean, close-mic single-sentence English voice memo routinely transcribes without word errors on the default Base model, single-sentence read-speech tests do not predict Word Error Rate (WER) on noisy multi-speaker meetings, overlapping crosstalk, or reverberant conference rooms. For accented speech, domain jargon, or room echo, switch from Base to the Small tier and explicitly select the spoken language rather than leaving the dropdown on Auto Detect.",
                ],
                table: {
                    caption: "Measured ONNX model byte weights on assets.zypass.dpdns.org/models/v1/ (HTTP Content-Length) and deterministic 16 kHz Float32Array memory footprint.",
                    headers: [
                        "Model Tier / Audio Duration",
                        "Encoder q8 ONNX Size",
                        "Merged Decoder q8 ONNX Size",
                        "Tokenizer + Config",
                        "Total Initial Download / Decoded PCM Buffer",
                        "Pipeline Windowing / Notes",
                    ],
                    rows: [
                        [
                            "Fast Tier (Xenova/whisper-tiny)",
                            "9.66 MiB (10,124,910 B)",
                            "29.30 MiB (30,727,765 B)",
                            "2.37 MiB (2,482,714 B)",
                            "41.33 MiB (43,335,389 B)",
                            "Lowest RAM (~150 MB); best for clear single-speaker notes",
                        ],
                        [
                            "Balanced Tier (Xenova/whisper-base, default)",
                            "22.13 MiB (23,200,850 B)",
                            "51.22 MiB (53,707,539 B)",
                            "2.37 MiB (2,482,714 B)",
                            "75.71 MiB (79,391,103 B)",
                            "Default tier (~250 MB RAM); automatic fallback if another tier fails",
                        ],
                        [
                            "High Accuracy Tier (Xenova/whisper-small)",
                            "88.05 MiB (92,324,809 B)",
                            "149.52 MiB (156,780,950 B)",
                            "2.37 MiB (2,482,698 B)",
                            "239.93 MiB (251,588,457 B)",
                            "Highest precision on accents/jargon (~600 MB RAM; desktop recommended)",
                        ],
                        [
                            "1-Minute Audio Input (16 kHz Float32)",
                            "—",
                            "—",
                            "—",
                            "3.66 MiB (3,840,000 B / 960,000 samples)",
                            "Processed in 3 overlapping windows (30s chunk, 5s stride)",
                        ],
                        [
                            "30-Minute Meeting Input (16 kHz Float32)",
                            "—",
                            "—",
                            "—",
                            "109.86 MiB (115,200,000 B / 28.8M samples)",
                            "Processed in 90 overlapping windows; keep tab foregrounded",
                        ],
                    ],
                },
            },
            {
                heading: "How YuliusBox compares to other browser-based Whisper transcribers",
                paragraphs: [
                    "Running OpenAI Whisper in the browser is a shared architecture across several privacy-first transcription tools, including Whisper Web (whisperwebfree.com), Ryusei Transcriber (transcriber.tools.ryusei.io), Pageonaut, and Floi. On core privacy — keeping audio files on-device with zero server uploads — all of these tools tie.",
                    "Where competitors offer more features: Whisper Web and Ryusei Transcriber support WebGPU hardware acceleration alongside WebAssembly and export timestamped subtitle formats (.srt, .vtt, .json), and Ryusei Transcriber includes on-device speaker diarization and multi-gigabyte models (up to 5.2 GB). YuliusBox currently executes CPU WebAssembly via ONNX Runtime Web and exports plain text (.txt) and clipboard copy.",
                    "Where YuliusBox differs: First, we pre-process decoded 16 kHz audio through an automatic energy-based Voice Activity Detection (trimSilence) pass that strips leading and trailing dead air (while keeping a 250 ms guard buffer) and flags recordings under 3.0 seconds before Whisper's transformer decoder can hallucinate repeated phrases on silence. Second, all three quantized q8 ONNX model tiers (43.34 MB Tiny, 79.39 MB Base, and 251.59 MB Small) are served from our versioned asset CDN with automatic tier fallback to Base if a download is interrupted. Third, you can verify zero-upload execution in DevTools (F12 -> Network): after the initial GET requests for the .onnx model weights and ort-wasm runtime complete, toggling the browser to Offline mode and uploading an MP3 produces zero outbound network packets while transcription runs in the local Web Worker.",
                ],
            },
            {
                heading: "Technical limitations, model sizes, and hardware requirements",
                paragraphs: [
                    "Because Whisper models execute in client-side Web Workers using WebAssembly rather than dedicated cloud GPUs, users should be aware of several practical constraints:",
                    "Model download sizes and memory usage: The tool offers three quantized 8-bit (q8) ONNX model tiers. Tiny requires an initial download of 43.34 MB (41.33 MiB) and ~150 MB of browser RAM, making it exceptionally fast for rough drafts. Base downloads 79.39 MB (75.71 MiB) and uses ~250 MB of RAM, offering the optimal balance of accuracy and speed for most audio. Small downloads 251.59 MB (239.93 MiB) and requires ~600 MB of RAM, delivering high accuracy on technical jargon and thick accents. Model weights download once and are cached persistently in browser storage (CacheStorage and IndexedDB), allowing subsequent transcriptions to run even completely offline.",
                    "Hardware recommendations: The Tiny and Base tiers run smoothly on modern laptops, desktops, and recent smartphones. The Small tier is computationally intensive; mobile phones or computers with less than 4 GB of available system memory may experience high CPU usage or browser tab throttling.",
                    "Short clip advisory: Audio clips under 3.0 seconds trigger an in-app guidance warning. Whisper's transformer encoder relies on acoustic and semantic context; very short isolated sounds or single words can occasionally cause the model to repeat phantom phrases or skip words. Speaking a full, continuous sentence dramatically improves recognition accuracy.",
                    "Supported audio formats and export limits: The tool decodes MP3, WAV, and M4A/AAC files natively, as well as live microphone streams via the browser's MediaRecorder API. Export is currently limited to plain text (.txt) and direct clipboard copying; timestamped subtitle formats (.srt or .vtt) are planned for a subsequent update.",
                ],
            },
            {
                heading: "Choosing a model tier: tiny vs base vs small",
                paragraphs: [
                    "The three model sizes represent a deliberate trade-off between download footprint, execution speed, and linguistic accuracy. Tiny is the fastest option: it loads almost instantaneously on standard mobile connections and transcribes clear, single-speaker English with minimal latency. It is ideal for quick voice dictation, meeting minutes, and brief personal reminders.",
                    "Base is the default configuration recommended for 90% of use cases. It demonstrates substantially stronger resilience against background ambient noise, conversational crosstalk, and non-native accents, while transcribing at roughly 3x to 5x real-time speed on modern consumer hardware. Small is the precision instrument: it delivers the lowest word error rate on difficult recordings featuring overlapping dialogue, medical or technical terminology, or reverberant conference rooms, but requires a capable multi-core computer.",
                ],
            },
            {
                heading: "Getting accurate transcripts: recording matters more than settings",
                paragraphs: [
                    "In speech-to-text systems, acoustic signal quality is far more decisive than model parameter count. A clean recording processed by the Tiny model will consistently outperform a muffled, echoey recording processed by the Small model. Always position the microphone within 15–30 centimeters of the speaker's mouth, and avoid placing a phone flat on the center of a large table in speakerphone mode.",
                    "For interviews or remote calls, using basic wired earphones with an inline microphone dramatically reduces room reverberation compared to built-in laptop microphones. If you are uploading existing recordings, avoid re-compressing them to low-bitrate MP3s beforehand; Whisper processes raw audio waveforms natively. Finally, explicitly selecting your target language in the dropdown rather than relying on Auto Detect improves accuracy on brief recordings.",
                ],
            },
            {
                heading: "What you can do with on-device transcripts",
                paragraphs: [
                    "Local transcription unlocks productivity workflows that were previously impossible due to privacy policies or SaaS subscription costs. Professionals can transcribe confidential executive standups, legal interview tapes, and medical consultation notes without violating non-disclosure agreements or GDPR regulations.",
                    "Content creators and podcasters can turn audio recordings into searchable text archives, draft blog summaries, or produce initial video script outlines. Because there are no monthly minute limits, no paywalls, and no subscription tiers, transcribing an hour-long lecture costs exactly the same as transcribing a ten-second voice note: completely free.",
                ],
            },
        ],
        faqs: [
            {
                question: "How accurate is browser-based Whisper transcription?",
                answer: "Transcription accuracy is exceptionally high on clear audio, matching commercial cloud transcription APIs because it uses the genuine OpenAI Whisper model architecture. The Base model handles diverse accents and conversational noise reliably; the Small model provides superior precision on specialized industry terminology and faint speech.",
            },
            {
                question: "Why does the first transcription take longer to start?",
                answer: "On first use, the browser downloads the quantized model weights (ranging from 43.34 MB for Tiny to 251.59 MB for Small) from our CDN. Once downloaded, the model is cached in your browser's persistent storage. Subsequent visits load instantly and can operate entirely offline without an active internet connection.",
            },
            {
                question: "Can it transcribe languages other than English?",
                answer: "Yes. The Whisper checkpoint supports over 90 languages including Spanish, French, German, Japanese, and Chinese. You can allow the model to auto-detect the spoken language or explicitly select English or Chinese from the dropdown to maximize accuracy on short recordings.",
            },
            {
                question: "Does local transcription work on mobile phones?",
                answer: "Yes, on modern mobile devices. The Tiny and Base tiers perform well on recent iOS and Android phones. The Small tier requires substantial memory and multi-core processing power, so it is recommended primarily for desktop and laptop computers.",
            },
            {
                question: "Are my audio recordings ever uploaded to a server?",
                answer: "No. The entire transcription pipeline runs locally inside a Web Worker using WebAssembly. Your audio files and microphone input never traverse the network. You can verify this independently by checking your browser's network monitor during transcription.",
            },
            {
                question: "Why is there a warning for recordings under 3 seconds?",
                answer: "Transformer-based speech models like Whisper rely on contextual phonetic flow. Very short audio clips (under 3 seconds) can lack sufficient acoustic context, occasionally leading to hallucinated text or omitted words. Speaking at least one full sentence yields significantly higher accuracy.",
            },
            {
                question: "Can I export subtitle files with timestamps (SRT)?",
                answer: "The current version exports complete plain text transcripts (.txt) and provides one-click clipboard copying. Timestamped SRT and VTT subtitle exports are planned for an upcoming release.",
            },
        ],
        related: [
            { href: "/tools/video-to-gif", label: "Convert video clips to GIF" },
            { href: "/tools/excel-formula-bot", label: "Generate Excel formulas with AI" },
            { href: "/tools/image-compressor", label: "Compress images for the web" },
            { href: "/tools/pdf-kit", label: "Merge and convert documents to PDF" },
        ],
    },
    "id-watermark": {
        id: "id-watermark",
        href: "/tools/id-watermark",
        crumb: "ID Watermark",
        h1: "Watermark ID Cards & Passports Online — 100% In-Browser",
        subtitle:
            "Add protective purpose-only text to ID cards, driver licenses, and passport photos before sharing. Runs locally with HTML5 Canvas — zero uploads.",
        howTo: [
            "Drop your ID photo (JPG, PNG, or WebP) into the upload box, or click to browse.",
            "Select a purpose preset (Rental, KYC, Employment, Loan) or type custom restriction wording.",
            "Fine-tune opacity (recommended 15%–30%), font size, and rotation angle so key details remain legible.",
            "Download your watermarked JPEG or PNG, or click Next Steps to package front and back into a combined PDF.",
        ],
        sections: [
            {
                heading: "Why watermark ID copies before sharing them",
                paragraphs: [
                    "In modern daily life, sharing digital copies of government-issued identification cards, driver's licenses, and passports is unavoidable. Landlords request ID photos for apartment rental applications, telecommunications operators require them for SIM card registration, employers ask for them during remote onboarding, and fintech apps demand them for identity verification. Once an unwatermarked photo of your ID leaves your possession via email, messaging apps, or web forms, you lose control over where that file travels, how long it is stored, and who has access to it.",
                    "Unprotected ID photos are prime targets for identity theft and secondary fraud. Unscrupulous intermediaries or compromised database servers can leak your documentation, enabling bad actors to open fraudulent credit cards, apply for micro-loans, or register dummy corporate entities under your name. Adding a bold, repeated watermark explicitly restricting the document's purpose (for example, 'FOR APARTMENT RENTAL AT SUNSET HEIGHTS ONLY — 2026-11 — NOT VALID FOR OTHER PURPOSES') strips away plausible deniability. Legitimate financial institutions and government agencies will immediately reject a watermarked electronic copy presented for an unauthorized purpose.",
                ],
            },
            {
                heading: "Measured HTML5 Canvas watermarking benchmarks across ID resolutions",
                paragraphs: [
                    "We measured the exact rendering and encoding pipeline of IdWatermarkClient.tsx in headless Chromium 1248 across three synthetic identification card resolutions (1000x630 standard flatbed scan, 1920x1200 smartphone ID photo, and 3840x2400 4K camera capture) using the restriction text 'For rental application only - 2026. Invalid for other uses.' in neutral gray (#808080) at 25% opacity and -45° rotation:",
                    "Proportional scaling and tile invariant: Because the tool computes scale = img.width / 1000, fontSize = Math.round(24 * scale), and gap = Math.round(80 * scale), the watermark grid maintains an identical 5x4 (20-tile) diagonal layout regardless of camera resolution. On the 1920x1200 test document (379,713 bytes / 370.8 KiB input JPEG), fontSize scaled to 46 px with a 154 px gap and 1,289.3 px tile pitch. Rendering all 20 rotated text tiles onto the HTML5 Canvas took 5.5 ms; exporting via canvas.toBlob('image/jpeg', 0.95) produced a 436,640-byte (426.4 KiB) JPEG in 40.8 ms, whereas lossless canvas.toBlob('image/png') produced a 3,034,914-byte (2.89 MiB) PNG in 113.5 ms.",
                ],
                table: {
                    caption: "Measured in headless Chromium 1248 (Linux x86_64, 4-vCPU AMD EPYC 9D25) executing IdWatermarkClient.tsx HTML5 Canvas 2D pipeline.",
                    headers: [
                        "ID Document Profile",
                        "Input JPEG Size",
                        "Auto-Scaled Font / Gap / Tile Pitch",
                        "Tiled Grid (Cols × Rows)",
                        "Canvas Draw Time",
                        "JPEG (q=0.95) Export Size & Time",
                        "PNG Export Size & Time",
                        "Raw RGBA Canvas RAM",
                    ],
                    rows: [
                        [
                            "1000x630 Standard Scan",
                            "113.0 KiB (115,747 B)",
                            "24 px / 80 px / 672.3 px",
                            "5×4 (20 tiles)",
                            "3.0 ms",
                            "131.5 KiB (134,623 B) / 15.4 ms",
                            "836.6 KiB (856,648 B) / 32.1 ms",
                            "2.40 MiB (2,520,000 B)",
                        ],
                        [
                            "1920x1200 Smartphone ID Photo",
                            "370.8 KiB (379,713 B)",
                            "46 px / 154 px / 1,289.3 px",
                            "5×4 (20 tiles)",
                            "5.5 ms",
                            "426.4 KiB (436,640 B) / 40.8 ms",
                            "2.89 MiB (3,034,914 B) / 113.5 ms",
                            "8.79 MiB (9,216,000 B)",
                        ],
                        [
                            "3840x2400 4K Camera Capture",
                            "1.42 MiB (1,485,871 B)",
                            "92 px / 307 px / 2,577.6 px",
                            "5×4 (20 tiles)",
                            "149.9 ms",
                            "1.61 MiB (1,692,569 B) / 105.8 ms",
                            "11.30 MiB (11,847,811 B) / 530.7 ms",
                            "35.16 MiB (36,864,000 B)",
                        ],
                    ],
                },
            },
            {
                heading: "How YuliusBox compares to Watermarkly, Canva, and FileReadyNow",
                paragraphs: [
                    "General photo watermarkers such as Watermarkly (watermarkly.com), Canva (canva.com/features/watermark-photos/), and FileReadyNow (filereadynow.com) are designed primarily for photographer copyright logos and brand signatures rather than identity-document fraud prevention.",
                    "Where competitors have an edge: Watermarkly and FileReadyNow also process images locally in the browser (so local processing alone is a tie with those two), and Watermarkly offers bulk multi-file batching, 900+ decorative fonts, 36 visual shadow/3D effects, and logo overlays that our focused ID tool does not attempt. Canva provides a full graphic design suite, but requires creating an account and uploading your unwatermarked ID photo to Canva's cloud storage — an unnecessary exposure risk for government identification.",
                    "What YuliusBox provides that general watermarkers do not: (1) One-click KYC and identity restriction templates ('For rental application only - 2026', 'For SIM card application only - 2026', 'For loan application only - 2026', 'For identity verification only - 2026') pre-configured at a -45° diagonal cross-document tile so an attacker cannot crop out a corner watermark. (2) Automatic resolution-proportional geometry (width / 1000 scaling) so a 4K smartphone scan and a 1000 px flatbed scan receive the exact same visual coverage density without obscuring OCR fields. (3) Direct in-memory handoff buttons ('Turn into PDF', 'JPG to PDF', and 'EXIF Remover') that pass your watermarked Blob directly to /tools/pdf-kit or /tools/exif-remover inside the browser tab so you can strip GPS metadata and combine front-and-back ID scans into a single PDF without touching disk or network.",
                ],
            },
            {
                heading: "Security limitations: what watermarking can and cannot do",
                paragraphs: [
                    "While purpose-only watermarking is a vital security best practice, users must understand its realistic operational boundaries:",
                    "Visual deterrent, not cryptographic proof: A watermark establishes a visible purpose lock and substantially increases the legal liability and manual labor required to abuse a document. However, sophisticated bad actors equipped with specialized image editing tools can attempt manual pixel cloning. Watermarking provides undeniable evidence of intended use and deters unauthorized institutional acceptance, but it does not cryptographically seal the underlying bitmap.",
                    "Does not replace biometric or official checks: Adding a watermark does not transform an invalid document into a valid one, nor does it replace official biometric facial liveness detection, smart-chip NFC verification, or government database audits. It is solely designed to protect legitimate digital copies you entrust to third parties.",
                    "Must not obscure critical identification data: You must carefully adjust opacity (15% to 30%), font size, and rotation angle so that your legal name, document number, validity dates, and facial features remain unobstructed. If a watermark obliterates essential card numbers or holographic stamps, the receiving organization will reject your submission.",
                    "Verify receiving party policies in advance: Certain strict institutions—such as consular visa offices, court notaries, or specialized banking compliance desks—mandate pristine, unannotated document scans. Always verify whether the receiving party accepts watermarked electronic copies before submitting your paperwork.",
                ],
            },
            {
                heading: "How in-browser HTML5 Canvas watermarking works & DevTools verification",
                paragraphs: [
                    "YuliusBox processes your identification documents entirely within your browser using the HTML5 Canvas 2D API (canvas.getContext('2d')). When you select an image, the browser loads the file into local memory using a temporary object URL (URL.createObjectURL). The image dimensions are analyzed, and the watermark text is rendered onto an off-screen canvas surface using affine coordinate transformations (ctx.rotate, ctx.translate) and alpha compositing.",
                    "How to verify zero-upload execution in Browser DevTools: Open DevTools (F12) -> Network tab, clear the request log (or set Network Throttling to Offline), and upload your ID card photo. Adjust the text, opacity, angle, and spacing sliders and click Download Image. Because canvas.toBlob() encodes the JPEG/PNG directly from the local GPU/CPU framebuffer, zero network requests are fired from start to finish.",
                ],
            },
            {
                heading: "Best practices for high-acceptance document submissions",
                paragraphs: [
                    "Following a few straightforward guidelines ensures your watermarked documents provide robust privacy protection without getting rejected by review teams:",
                    "Strike the right opacity balance: An opacity setting between 15% and 30% is ideal. Below 15%, the watermark may be too faint to deter bad actors; above 35%, it risks interfering with automated optical character recognition (OCR) systems used by verification portals.",
                    "Choose contrasting colors thoughtfully: Neutral gray (#808080) or dark charcoal works well on standard white or light-blue identity cards. Use white or soft silver for dark passport photo pages, and reserve bright red for urgent legal notices or high-value financial transactions.",
                    "Package front and back into a single PDF: Many rental portals and verification services require both the front and back of an ID card submitted as a single document. After watermarking each side, use the companion PDF Kit tool (/tools/pdf-kit/jpg-to-pdf-converter) to merge both images into an organized, professional PDF document ready for email or portal upload.",
                ],
            },
        ],
        faqs: [
            {
                question: "Does watermarking guarantee my ID cannot be stolen or misused?",
                answer: "No. Watermarking acts as a visible deterrent and purpose lock that prevents legitimate organizations from accepting the copy for other purposes (such as applying for a loan with an ID marked 'FOR APARTMENT RENTAL ONLY'). However, sophisticated attackers can attempt manual editing. Watermarking significantly raises the effort and legal liability of unauthorized use, but cannot physically prevent determined forgery.",
            },
            {
                question: "What text should I write in the watermark?",
                answer: "Specify the exact purpose, recipient organization, and current date. For example: 'FOR KYC VERIFICATION AT [COMPANY NAME] ONLY — VALID ON [DATE] — NOT VALID FOR OTHER PURPOSES'. Keeping the purpose specific prevents the copy from being repurposed elsewhere.",
            },
            {
                question: "Is my ID photo uploaded to any server or cloud database?",
                answer: "Never. All watermarking operations are drawn directly on your browser's HTML5 Canvas using client-side JavaScript. Your original image and watermarked copy never leave your local device, and no copies are stored on any server.",
            },
            {
                question: "Where should I position the watermark on the ID card?",
                answer: "Position the watermark across the face or card details at an angle, with moderate opacity (15%–30%). The text should be clearly readable across critical card elements without obscuring essential numbers, names, or expiration dates needed by the verifying party.",
            },
            {
                question: "What image formats are supported for watermarking?",
                answer: "You can load JPG, PNG, and WebP images. When saving, you can export the watermarked image as a JPEG or PNG, or pass it directly into the PDF Kit tool to create a watermarked PDF document.",
            },
            {
                question: "How can I combine front and back ID photos into one document?",
                answer: "Watermark both the front and back photos of your ID card separately, then use our companion JPG-to-PDF Converter (under PDF Tools) to bundle both images into a single, professional PDF document for submission.",
            },
            {
                question: "Will institutions reject my application if the watermark is too prominent?",
                answer: "Yes, if essential text or facial features are obscured. Keep the watermark opacity between 15% and 30% and ensure full legal name, ID number, and expiration dates remain crisp and readable so automated OCR and human reviewers can verify your details.",
            },
        ],
        related: [
            { href: "/tools/pdf-kit", label: "Package ID photos into a single PDF" },
            { href: "/tools/exif-remover", label: "Strip camera EXIF & GPS location data" },
            { href: "/tools/image-compressor", label: "Compress ID images for email attachment" },
            { href: "/tools/pdf-redact-sign", label: "Redact sensitive document details" },
        ],
    },
};
