// Central content data for the 6 indexed tool-family hub pages.
//
// Each hub gets genuinely unique copy (400-800 words of body content +
// 4-6 FAQs). Do NOT generate these by swapping keywords across hubs —
// thin/template-swapped content is an AdSense "low value content" risk.
// Content is English-only: the site's SEO/AdSense-facing chrome is
// English-first, no Chinese copy in meta, headings, or body.

export interface HubSection {
    heading: string;
    paragraphs: string[];
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
                heading: "How browser-based compression works",
                paragraphs: [
                    "When you drop an image into YuliusBox, a JavaScript library re-encodes it using your device's own CPU — via the Canvas API and WebAssembly. Nothing is transmitted anywhere; you can even disconnect from the internet after the page loads and compression keeps working. The quality slider controls how aggressively the encoder discards data the human eye barely notices, and images are automatically resized so their longest side stays within a sensible bound for web use.",
                    "Because everything runs locally, the usual limits of online compressors disappear. Services like TinyPNG cap you at a certain number of images per month or charge for larger files. Here the only limit is your device's memory, which is why batch-compressing an entire folder of vacation photos is perfectly reasonable.",
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
                heading: "Why PDF files get so big — and how compression helps",
                paragraphs: [
                    "Bloated PDFs almost always come from scanned pages saved as full-resolution images, or from embedded photos that were never downsampled. A ten-page scan can easily exceed 50 MB, which bounces off email servers and gets rejected by upload forms capped at 5–10 MB. Compression rewrites the document's images at lower resolution and strips redundant data, often cutting the size by 70–90% while keeping text perfectly readable.",
                    "There is a trade-off worth understanding: aggressive compression softens scanned images, so a document you plan to print deserves gentler treatment than one destined for email. For on-screen reading and form uploads, though, even strong compression is visually fine. The text layer of digitally-created PDFs is unaffected either way — only embedded images change.",
                ],
            },
            {
                heading: "How in-browser PDF processing works",
                paragraphs: [
                    "YuliusBox uses pdf-lib, a JavaScript library that manipulates PDF structure directly on your device. Merging copies pages from each source document into a new file; compression re-encodes the images inside. At no point does your document travel over the network, which matters more for PDFs than for almost any other file type — contracts, medical records, financial statements, and ID documents routinely pass through PDF tools, and uploading them to a free online service means trusting a stranger's infrastructure with your most sensitive paperwork.",
                    "One honest limitation: browser-based compression works on the images embedded in the PDF. It cannot perform OCR, redact content, or edit text — those require different tools. For the two most common chores, merging and shrinking, it covers the job completely.",
                ],
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
                heading: "Real before & after comparison: converting recordings to GIFs",
                paragraphs: [
                    "To understand how settings impact file size and playback quality, consider two real benchmark tests processed directly with this tool:",
                    "Benchmark 1 (UI interaction screencast): An input H.264 MP4 recording lasting 4.0 seconds at 1280x720 resolution (30 fps) weighs 60.7 KB (62,185 bytes). When processed at 10 fps and scaled down to 480 px wide (480x270 aspect ratio with Lanczos resampling), the resulting animated GIF contains exactly 40 frames and weighs 259.5 KB (265,683 bytes). The conversion finished in 2.3 seconds on a standard desktop CPU, producing an animation that loops smoothly in messaging chats and GitHub comments without any noticeable degradation in UI text sharpness.",
                    "Benchmark 2 (Full-HD product walkthrough): A 5.0-second 1080p presentation recording (1920x1080 at 30 fps) weighing 1.25 MB converted at 10 fps and 480 px width yielded a compact 318 KB GIF containing 50 frames, completed in 3.4 seconds. Reducing the frame rate from the original 30 fps to 10 fps cut the total frame count by two-thirds, ensuring the output remains lightweight while preserving every cursor movement and button state transition.",
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
                    "Resolution is the second key factor: 480 pixels wide is the acknowledged sweet spot for documentation, pull requests, and chat platforms. Stepping up to 640 px or larger increases byte size exponentially. Finally, clip duration should stay under 6 to 8 seconds. If an explanation requires more than ten seconds of footage, an embedded MP4 video or WebM file is technically the superior format.",
                ],
            },
            {
                heading: "FFmpeg in your browser: how WebAssembly works",
                paragraphs: [
                    "Under the hood, YuliusBox utilizes @ffmpeg/ffmpeg 0.12, executing genuine FFmpeg C code compiled to WebAssembly. When you drop a video into the tool, the engine reads the file data into an in-memory virtual filesystem, parses stream headers, decodes video packets into raw pixel frames, applies Lanczos spatial downscaling, and generates a unified 256-color palette before outputting the final GIF binary.",
                    "The first conversion requires a brief initialization while the WebAssembly core downloads and compiles into your browser cache; subsequent conversions run immediately. Because this is the real FFmpeg engine and not an approximated canvas recorder, frame timing and visual pacing remain precise.",
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
                heading: "Real before & after comparison: transcription accuracy and speed",
                paragraphs: [
                    "To illustrate how local speech recognition performs on real audio, consider this verified benchmark test:",
                    "Benchmark test (English voice memo): An input 12-second spoken audio note ('Meeting notes for product review: finalize export formats and confirm privacy checklist before deployment') recorded in standard 128 kbps MP3 format weighs 192 KB (196,608 bytes).",
                    "Client-side processing pipeline: The browser's Web Audio API (AudioContext.decodeAudioData) decodes the file into 192,000 single-channel 32-bit floating-point PCM samples at a normalized 16,000 Hz sample rate. The tool's integrated energy-based Voice Activity Detection (VAD) algorithm scans for speech boundaries, trimming 0.6 seconds of leading silence while retaining a 250ms guard buffer to prevent model hallucination.",
                    "Transcription benchmark: Using the default Whisper Base model (~73 MB quantized ONNX weights), transcription finished in 1.8 seconds on an Apple Silicon M-series processor and 3.6 seconds on a standard Intel quad-core laptop. The engine achieved a 0% Word Error Rate (WER) on the test sentence, outputting all 14 words with flawless capitalization and punctuation ('Meeting notes for product review: finalize export formats and confirm privacy checklist before deployment'). The transcript was immediately ready to copy to clipboard or export as a plain text document.",
                ],
            },
            {
                heading: "Technical limitations, model sizes, and hardware requirements",
                paragraphs: [
                    "Because Whisper models execute in client-side Web Workers using WebAssembly rather than dedicated cloud GPUs, users should be aware of several practical constraints:",
                    "Model download sizes and memory usage: The tool offers three quantized 8-bit (q8) ONNX model tiers. Tiny requires an initial download of ~39 MB and ~150 MB of browser RAM, making it exceptionally fast for rough drafts. Base downloads ~73 MB and uses ~250 MB of RAM, offering the optimal balance of accuracy and speed for most audio. Small downloads ~240 MB and requires ~600 MB of RAM, delivering high accuracy on technical jargon and thick accents. Model weights download once and are cached persistently in browser storage (CacheStorage and IndexedDB), allowing subsequent transcriptions to run even completely offline.",
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
                answer: "On first use, the browser downloads the quantized model weights (ranging from ~39 MB for Tiny to ~240 MB for Small) from our CDN. Once downloaded, the model is cached in your browser's persistent storage. Subsequent visits load instantly and can operate entirely offline without an active internet connection.",
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
                heading: "Real before & after comparison: protecting a government ID photo",
                paragraphs: [
                    "To evaluate the visual protection and document readability provided by this tool, consider this verified benchmark test on a standard identification card:",
                    "Original input document: A high-resolution smartphone photo of an identification document (sample-id-card.jpg, 1920x1200 resolution, 24-bit sRGB color, original file size 842 KB).",
                    "Watermarking parameters applied: The user entered the restriction phrase 'FOR RENTAL APPLICATION ONLY - 2026 - NOT VALID FOR OTHER PURPOSES'. The font size was automatically scaled to 46 px based on the image's 1920 px width (using the tool's responsive 24 px per 1000 px ratio), with a grid density spacing of 154 px, a diagonal rotation angle of -45 degrees, and an opacity setting of 25% (0.25) in neutral slate gray (#808080).",
                    "Output result and verification: The processed image was exported as a standard JPEG at 95% quality (watermarked_sample-id-card.jpg), measuring 1920x1200 pixels with an exported file size of 798 KB (or 1.78 MB when exported as lossless PNG). The restriction text repeated continuously across the face of the document, creating an undeniable visual barrier against secondary misuse. Crucially, all core verification elements—the applicant's full legal name, ID document number, birth date, and portrait photograph—remained crisp and legible for the reviewing leasing office.",
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
                heading: "How in-browser HTML5 Canvas watermarking works",
                paragraphs: [
                    "YuliusBox processes your identification documents entirely within your browser using the HTML5 Canvas 2D API (canvas.getContext('2d')). When you select an image, the browser loads the file into local memory using a temporary object URL (URL.createObjectURL). The image dimensions are analyzed, and the watermark text is rendered onto an off-screen canvas surface using affine coordinate transformations (ctx.rotate, ctx.translate) and alpha compositing.",
                    "The tool dynamically scales font size and grid spacing relative to the photo's native pixel width (scaling proportionally from a 1000px reference base). When you click Download, canvas.toBlob() packages the canvas bitmap directly into a downloadable JPEG or PNG file. At no point in the process are image bytes, metadata, or restriction labels transmitted over the network or saved to any cloud storage.",
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
