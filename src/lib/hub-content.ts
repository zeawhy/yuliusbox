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
    "screenshot-beautifier",
    "audio-to-text",
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
            "Choose the Merge tab to combine files, or the Compress tab to shrink one.",
            "Drop your PDF files in — drag to reorder them for merging.",
            "Click Merge or Compress and let your browser do the work locally.",
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
                question: "Can I password-protect or split PDFs here?",
                answer: "The current toolkit focuses on merging and compression. Splitting a PDF into separate files and password protection are on the roadmap — for now, merge covers combining, and compression covers size limits, which are the two most requested operations.",
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
            "Turn MP4 and MOV clips into GIFs with FFmpeg running in your browser. Your videos never leave your device.",
        howTo: [
            "Drop a video file (MP4, MOV, WebM) onto the upload area.",
            "Trim the clip and set frame rate and width to control the GIF size.",
            "Click convert — FFmpeg runs locally in your browser via WebAssembly.",
            "Download your GIF. No watermark, no upload, no account.",
        ],
        sections: [
            {
                heading: "Where GIFs still beat video",
                paragraphs: [
                    "A decade into the age of streaming video, the humble GIF refuses to die — because for short, looping moments it is simply the most frictionless format on the internet. GitHub READMEs embed GIFs to demo features because they autoplay everywhere with no player chrome. Discord and Slack render them inline, turning a screen recording into an instantly-watchable reaction. Technical writers, open-source maintainers, and community managers all reach for GIFs when a six-second loop explains more than a paragraph.",
                    "The catch has always been file size. A raw screen recording converted naively can balloon to 30 MB, which Discord rejects (its free limit is 25 MB, and many servers cap far lower), Slack chokes on, and GitHub renders sluggishly. The art of a good GIF is restraint: trim to the essential seconds, drop the frame rate, and shrink the dimensions until the file fits where it needs to live.",
                ],
            },
            {
                heading: "Dialing in frame rate, size, and length",
                paragraphs: [
                    "Three knobs control nearly all of a GIF's weight. Frame rate is the biggest lever: 10 frames per second looks perfectly smooth for UI demos and screen recordings, while 15 fps suits anything with real motion. Length is the second — a GIF should rarely exceed 5–8 seconds; if your clip is longer, you probably want two GIFs or an actual video. Width is the third: 480 pixels is the sweet spot for chat and docs, and going above 640 px is almost never worth the bytes.",
                    "A practical recipe: start at 10 fps and 480 px wide, trim ruthlessly, and check the output size. If it is still too heavy for Discord, drop to 8 fps before touching anything else — viewers notice choppy length far less than they notice a file that won't send. Color-heavy footage (gradients, video) compresses worse than flat UI screens, so photographic clips need more aggressive trimming than screencasts.",
                ],
            },
            {
                heading: "FFmpeg in your browser: how it works",
                paragraphs: [
                    "Under the hood, YuliusBox runs FFmpeg — the same legendary video toolkit professionals use — compiled to WebAssembly so it executes inside your browser tab. Your video is decoded, re-encoded frame by frame as a GIF, and handed back to you, all without a single byte leaving your machine. The first conversion takes a few seconds while the engine loads; subsequent conversions start instantly.",
                    "Because it is real FFmpeg and not a toy converter, the output respects the settings you choose rather than applying a one-size-fits-all preset. That matters when you are threading the needle between 'small enough for Discord' and 'clear enough to read the UI text in the demo.'",
                ],
            },
            {
                heading: "Privacy and practical notes",
                paragraphs: [
                    "Screen recordings often contain the accidental and the sensitive: an open email tab, a Slack message preview, a file path with your real name. Uploading raw recordings to a conversion site broadcasts all of it. Local conversion keeps the footage on your machine, and trimming happens before anything is shared — a good habit is to re-watch your clip once specifically hunting for stray personal information before you convert.",
                    "One more tip: GIFs have no audio by design. If your clip's point depends on sound, a GIF is the wrong format — use a compressed MP4 instead. And remember that GIF supports only 256 colors per frame, so subtle gradients will show banding; that is a format limitation, not a bug in the converter.",
                ],
            },
        ],
        faqs: [
            {
                question: "What is the maximum video length I can convert?",
                answer: "There is no hard cap, but GIFs are the wrong tool for long videos — a 30-second clip at 10 fps becomes hundreds of frames and an enormous file. For best results keep clips under 10 seconds. Longer content is better shared as a compressed MP4.",
            },
            {
                question: "How do I make a GIF small enough for Discord?",
                answer: "Trim the clip to under 6 seconds, set 10 fps, and use 480 px width — that combination lands most screen recordings well under Discord's limits. If it is still too big, drop to 8 fps or trim another second before reducing quality further.",
            },
            {
                question: "Which video formats are supported?",
                answer: "MP4 (H.264), MOV (including iPhone recordings), and WebM. If your file uses an unusual codec, re-export it as MP4 from your editor first — the browser decoder needs to understand the input before FFmpeg can convert it.",
            },
            {
                question: "Is there a watermark on the output?",
                answer: "No. The GIF you download is exactly what FFmpeg produced from your settings — no logo, no branding, no time limits, free forever.",
            },
            {
                question: "Are my videos uploaded to a server?",
                answer: "Never. The entire conversion — decoding, frame extraction, GIF encoding — runs locally via FFmpeg WebAssembly in your browser tab. Your footage stays on your device.",
            },
        ],
        related: [
            { href: "/tools/image-compressor", label: "Compress images for the web" },
            { href: "/tools/screenshot-beautifier", label: "Beautify screenshots for sharing" },
            { href: "/tools/audio-to-text", label: "Transcribe audio to text in your browser" },
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
    "screenshot-beautifier": {
        id: "screenshot-beautifier",
        href: "/tools/screenshot-beautifier",
        crumb: "Screenshot Beautifier",
        h1: "Screenshot Beautifier — Mockups, Shadows & Gradients",
        subtitle:
            "Wrap screenshots in browser frames and device mockups with beautiful backgrounds. Free, in your browser.",
        howTo: [
            "Upload a screenshot — or paste one straight from your clipboard.",
            "Pick a browser or device frame, then tune the background, shadow, and padding.",
            "Add a 3D tilt or social mockup style if you want extra polish.",
            "Export as a high-resolution PNG and share it anywhere.",
        ],
        sections: [
            {
                heading: "First impressions are visual",
                paragraphs: [
                    "Nobody reads your launch post before they see the screenshot in it. A raw, full-screen capture with browser tabs and a cluttered menu bar signals 'unfinished' before a single word is processed; the same interface wrapped in a clean browser frame, floating over a soft gradient with a gentle shadow, signals 'crafted.' The underlying product hasn't changed — the perceived care has.",
                    "This matters most where screenshots do the selling: Product Hunt galleries, Twitter/X launch threads, documentation hero images, App Store preview sets, and investor decks. In each of these, the screenshot competes with dozens of others for a glance, and polished presentation is the cheapest competitive advantage available. It takes two minutes and requires zero design skill.",
                ],
            },
            {
                heading: "The anatomy of a screenshot that gets clicked",
                paragraphs: [
                    "Great-looking screenshots share a formula. First, a frame that gives context: a browser window for web apps, a phone mockup for mobile, a code-editor frame for developer tools. The frame tells the viewer what kind of thing they're looking at before they parse a pixel of content. Second, breathing room — generous padding between the frame and the image edge, usually 10–20% of the width, so the composition doesn't feel cramped.",
                    "Third, a background with intent. Subtle gradients in one or two brand-adjacent colors outperform both flat white (boring) and rainbow explosions (distracting). Dark mode screenshots pair beautifully with deep, saturated backgrounds; light UI pops against soft pastels. Finally, a soft drop shadow grounds the frame — it separates the screenshot from the background the way a mat separates a photo from its frame in a gallery.",
                ],
            },
            {
                heading: "Styles for different audiences",
                paragraphs: [
                    "Developer audiences respond to authenticity: a clean browser frame, minimal shadow, dark background — the aesthetic of a well-maintained GitHub README. Social audiences want more drama: 3D perspective tilts, bolder gradients, and device mockups that read clearly at thumbnail size in a fast-scrolling feed. Documentation wants clarity above all: consistent framing across every image in the docs set, so the page feels like one coherent product rather than a collage of eras.",
                    "The tool covers all three with presets rather than a blank canvas. Pick the social mockup style for launch day, the minimal browser frame for docs, and the code-editor frame when the screenshot is source code — code screenshots in particular benefit from syntax highlighting plus a frame, which is why they travel so well on social media.",
                ],
            },
            {
                heading: "Practical tips before you export",
                paragraphs: [
                    "Crop ruthlessly before beautifying. Remove browser toolbars, unrelated tabs, and notification badges — every stray element dilutes focus. If the screenshot contains real user data, emails, or API keys, redact them first; beautification draws more eyes, which is exactly when a leaked token hurts most. Export at 2x resolution so the image stays crisp on retina displays, and keep the PNG — converting a beautified screenshot to JPG reintroduces the compression artifacts you just worked to hide.",
                    "Consistency compounds: use the same background style and padding across a launch set, a docs site, or a slide deck. Viewers won't consciously notice the uniformity, but they'll feel the professionalism. Save your favorite combination and reuse it — a personal visual signature is worth more than novelty per image.",
                ],
            },
        ],
        faqs: [
            {
                question: "What image formats can I upload?",
                answer: "PNG and JPG screenshots work best, including pastes directly from your clipboard (Ctrl/Cmd+V). For the sharpest results, capture at your display's native resolution — beautification can't add detail that isn't there.",
            },
            {
                question: "What resolution is the exported image?",
                answer: "Exports render at 2x for retina-crisp output, saved as PNG to preserve the gradients and shadows without compression artifacts. The exact pixel dimensions depend on your screenshot size plus the padding you choose.",
            },
            {
                question: "Can I use the images commercially?",
                answer: "Yes. Everything you create is yours — use beautified screenshots in product launches, documentation, ads, and decks with no attribution required and no watermark. (The screenshot's own content, like third-party logos, is of course your responsibility.)",
            },
            {
                question: "Do you keep copies of my screenshots?",
                answer: "No. Composition and export happen entirely in your browser; your screenshots are never uploaded or stored. This is especially important since screenshots often contain unreleased work or sensitive data.",
            },
            {
                question: "How is this different from a Figma template?",
                answer: "Speed and zero setup. Figma templates are powerful but require opening Figma, finding the file, and exporting manually. Here you paste a screenshot, pick a style, and download — the whole loop takes under a minute, which is why people actually use it every day.",
            },
        ],
        related: [
            { href: "/tools/image-compressor", label: "Compress images for faster pages" },
            { href: "/tools/video-to-gif", label: "Turn screen recordings into GIFs" },
            { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
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
            "Click Initialize Model to load Whisper (first load downloads the model files).",
            "Upload an audio file or record directly with your microphone.",
            "Pick tiny for speed, base for balance, or small for best accuracy.",
            "Get your transcript, then copy it or export it as a TXT file.",
        ],
        sections: [
            {
                heading: "Transcription without the upload",
                paragraphs: [
                    "Every mainstream transcription service works the same way: you upload your audio to their servers, it gets processed who-knows-where, and the text comes back. That is fine for a podcast episode — and completely unacceptable for a therapy session recording, a board meeting, an unreleased interview, or a voice memo full of personal notes. The content of speech is among the most sensitive data people handle, and the standard workflow ships it to a third party by default.",
                    "YuliusBox inverts the model. OpenAI's Whisper — the same engine behind many commercial transcription products — runs directly in your browser via WebAssembly (ONNX runtime). The audio never traverses the network; transcription happens on your own CPU, and the text appears as if by magic. For journalists protecting sources, lawyers handling client calls, researchers with consent-bound interviews, and anyone who simply prefers their words stay theirs, this architectural difference is the entire point.",
                ],
            },
            {
                heading: "Choosing a model tier: tiny, base, or small",
                paragraphs: [
                    "Three Whisper sizes are available, and the trade-off is the classic speed-versus-accuracy curve. Tiny is the sprinter: it loads fast, transcribes quickly even on modest hardware, and handles clear, single-speaker English well — ideal for quick voice memos and drafts. Base is the balanced default most people should start with: noticeably better on accents, background noise, and mixed audio, while still running comfortably on a typical laptop.",
                    "Small is the precision instrument. It is meaningfully more accurate on difficult audio — overlapping speech, heavy accents, domain jargon — but it downloads a larger model and needs a capable device; older phones will struggle. A practical workflow: draft with base, and only re-run the tricky segments with small. Your choice is remembered, so the tool adapts to your hardware once and stays out of the way.",
                ],
            },
            {
                heading: "Getting accurate transcripts: recording matters more than settings",
                paragraphs: [
                    "Transcription quality is dominated by audio quality, not model size. A clean recording on tiny beats a noisy one on small every time. Record in a quiet room, keep the microphone close to the speaker, and avoid speakerphone mode — the number one killer of accuracy is a phone lying in the middle of a conference table, equidistant from everyone and everything.",
                    "For meetings, a cheap lapel mic or even wired earbuds outperform a laptop's built-in microphone dramatically. If you're transcribing existing files, don't pre-compress them aggressively; Whisper handles MP3, WAV, and M4A (including iPhone voice memos) natively. And set the language explicitly when you know it — auto-detection is convenient but can misfire on very short clips, which is why the tool warns you about recordings under three seconds.",
                ],
            },
            {
                heading: "What you can do with the transcript",
                paragraphs: [
                    "The obvious uses — meeting notes, interview transcripts, lecture capture — barely scratch the surface. Transcribe voice memos to make them searchable; anyone with a hundred untranscribed memos knows they're a write-only medium. Podcasters can generate show notes and chapter markers; students can turn recorded lectures into study documents; developers can dictate commit messages and documentation drafts.",
                    "Because everything is local, there are no per-minute fees and no monthly quotas — transcribing a three-hour workshop costs exactly as much as transcribing a thirty-second memo: nothing. That changes the economics of 'should I bother transcribing this?' from a cost decision into a reflex.",
                ],
            },
        ],
        faqs: [
            {
                question: "How accurate is browser-based Whisper transcription?",
                answer: "Very good on clear audio — these are the same Whisper models used by commercial services, not a watered-down version. The base tier handles accents and moderate noise well; small is better for difficult audio. Accuracy depends far more on recording quality than on which tier you pick.",
            },
            {
                question: "Why does the first use take a while to start?",
                answer: "The Whisper model files (tens to hundreds of MB depending on tier) download once and are then cached in your browser. After that first load, transcription starts almost instantly — even offline.",
            },
            {
                question: "Can it transcribe languages other than English?",
                answer: "Yes — Whisper supports 90+ languages. You can let it auto-detect or set the language explicitly, which is more reliable for short clips. Chinese, Spanish, French, German, and Japanese all work well on the base tier and up.",
            },
            {
                question: "Does it work on phones?",
                answer: "It works best on desktops and recent phones. The tiny tier runs on most modern phones; small needs a powerful device and may be slow on older hardware. For long recordings on a phone, tiny or base is the pragmatic choice.",
            },
            {
                question: "Is my audio really not uploaded?",
                answer: "Really. The model runs in your browser via WebAssembly (ONNX runtime) — you can disconnect from the internet after the model loads and transcription continues. No account, no server, no logs of your audio.",
            },
            {
                question: "Can I export subtitles (SRT) with timestamps?",
                answer: "Not currently — the tool exports a plain TXT transcript (copy to clipboard is also supported). Timestamped SRT export is on the roadmap; for now, the TXT output works well for notes, captions drafts, and searchable archives.",
            },
        ],
        related: [
            { href: "/tools/video-to-gif", label: "Convert video clips to GIF" },
            { href: "/tools/excel-formula-bot", label: "Generate Excel formulas with AI" },
            { href: "/tools/image-compressor", label: "Compress images for the web" },
        ],
    },
};
