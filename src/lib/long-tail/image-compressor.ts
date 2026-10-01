import type { LongTailContent } from "../long-tail-content";

/**
 * image-compressor long-tail pages.
 * Shared component: ImageCompressorTool (props: targetSizeMB, outputFormat).
 */
export const compressImageTo100kb: LongTailContent = {
    id: "compress-image-to-100kb",
    slug: "compress-image-to-100kb",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-image-to-100kb",
    crumb: "Compress Image to 100KB",
    h1: "Compress Image to 100KB Online — Free",
    subtitle:
        "Shrink any JPG, PNG, or WebP photo to under 100KB right in your browser. Built for job portals, application forms, and forums with strict upload limits.",
    metaTitle: "Compress Image to 100KB Online Free — No Upload | YuliusBox",
    metaDescription:
        "Reduce any photo to under 100KB for job applications, exam forms, and forums. Free, unlimited, and 100% private — your image never leaves your browser.",
    keywords: [
        "compress image to 100kb",
        "reduce image size to 100kb",
        "100kb photo compressor",
        "shrink jpg to 100kb online",
    ],
    preset: { targetSizeMB: 0.1 },
    howTo: [
        "Drop your photo into the uploader above — it never leaves your device.",
        "The tool automatically tunes the quality down, step by step, until the file is under 100KB.",
        "Download the result instantly — or drop in several photos to batch-compress them all.",
    ],
    sections: [
        {
            heading: "Why 100KB?",
            paragraphs: [
                "A 100KB ceiling shows up everywhere: job application portals, government and exam registration forms, scholarship applications, visa document uploads, and old-school forums and classifieds that still cap attachments at 100 or 200KB. Meanwhile a single photo from a modern phone weighs 3 to 12MB — thirty to one hundred times over the limit.",
                "Manually shrinking a photo to hit an exact size is miserable trial and error: export, check the size, guess a lower quality, export again. This page skips the guessing. Drop the photo in, and the encoder iterates automatically until the output lands just under 100KB, so you can attach it and move on.",
            ],
        },
        {
            heading: "How the automatic 100KB target works",
            paragraphs: [
                "Instead of asking you to pick a quality percentage, this page sets the compressor's target to 0.1MB and lets the algorithm do the work. It encodes your photo, checks the result, and steps the quality down until the file fits under 100KB — the same iterative approach professional export tools use, minus the dialog boxes.",
                "Very large photos are also downscaled (long edge capped at 1920 pixels) before compression, because a 4000-pixel-wide image can never be a good 100KB file. Everything runs locally in your browser with WebAssembly: there is no upload queue, no waiting room, and no per-day quota standing between you and the file you need.",
            ],
        },
        {
            heading: "Will a 100KB image still look good?",
            paragraphs: [
                "For anything viewed on a screen — an application portal, a profile photo, a forum avatar — yes. A 100KB JPEG at around 1200 pixels wide looks clean at normal viewing distance; the compression artifacts only become visible if you zoom in looking for them.",
                "Two caveats. First, screenshots full of small text get soft faster than photographs do, so preview the downloaded file before submitting it anywhere official. Second, 100KB is a screen-viewing size, not a print size — never use it for anything that will be printed. And always keep your original: compression throws away data, and you can't get it back.",
            ],
        },
        {
            heading: "When 100KB is the wrong target",
            paragraphs: [
                "Not every form wants 100KB. Some portals ask for \"under 200KB\" or \"under 1MB\" — for those, use the main image compressor page, where the quality slider gives you full manual control over the size-versus-quality trade-off.",
                "Two common gotchas: iPhone photos arrive as HEIC, which browsers can't decode — convert them to JPG first (our free sister site does exactly that), then compress here. And PNG screenshots with transparency compress poorly by design; if a PNG refuses to go under 100KB, flatten it to JPG first and the same pixels will shrink dramatically.",
            ],
        },
        {
            heading: "Your photo never leaves your device",
            paragraphs: [
                "The files people compress to 100KB are often the sensitive ones: ID photos, certificates, signed forms. That's exactly why this tool runs 100% in your browser — your photo is processed by your own device's CPU and is never uploaded to any server. You can confirm it with your browser's network inspector.",
                "One honest warning that has nothing to do with us: once you submit the compressed photo to a portal, its privacy is in that organization's hands. Keep your originals, submit only what's asked, and prefer portals that explain how long they retain your documents.",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I compress a photo to exactly 100KB?",
            answer: "You almost never need exactly 100KB — portals and forms ask for files under a limit, not at it. This tool targets just under 100KB automatically, which satisfies every \"maximum 100KB\" requirement. Chasing an exact byte count would only force worse quality for no benefit.",
        },
        {
            question: "Can I compress multiple images to 100KB at once?",
            answer: "Yes. Drop in as many photos as you like; each one is compressed to under 100KB independently, and you can download them one by one or all together as a ZIP file. There is no batch limit.",
        },
        {
            question: "Why won't my PNG go below 100KB?",
            answer: "PNG is a lossless format designed for crisp graphics, not small photos — a photographic PNG can be ten times larger than the same image as JPG. Convert the image to JPG first (most phones and free editors can do this in one tap), then compress it here and it will fit easily.",
        },
        {
            question: "Is it safe to compress my ID photo here?",
            answer: "Yes — because nothing is uploaded. The compression happens entirely in your browser, so your ID photo never travels over the network to reach us. That said, always check how the organization you're submitting it to stores and retains your documents.",
        },
        {
            question: "Does it work with iPhone HEIC photos?",
            answer: "Not directly: web browsers can't decode Apple's HEIC format. Convert your HEIC photo to JPG first — our free sister site heic2jpg-free.com does this in your browser too — then drop the JPG here to bring it under 100KB.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual quality control",
        },
        {
            href: "/tools/pdf-kit",
            label: "Merge PDFs for application document bundles",
        },
        {
            href: "https://www.heic2jpg-free.com",
            label: "Convert HEIC to JPG free",
            external: true,
        },
    ],
};


export const compressJpgTo50kb: LongTailContent = {
    id: "compress-jpg-to-50kb",
    slug: "compress-jpg-to-50kb",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-jpg-to-50kb",
    crumb: "Compress JPG to 50KB",
    h1: "Compress JPG to 50KB Online — Free",
    subtitle:
        "Shrink JPG photos under 50KB in your browser — no upload, no signup. Built for forum avatars, profile pictures, and portals with strict file limits.",
    metaTitle: "Compress JPG to 50KB Online Free — No Upload | YuliusBox",
    metaDescription:
        "Reduce any JPG photo to under 50KB for avatars, profiles, and strict upload forms. Free, unlimited, and private — compression happens in your browser.",
    keywords: [
        "compress jpg to 50kb",
        "reduce jpg size to 50kb",
        "50kb jpg compressor",
        "shrink jpeg to 50kb online",
    ],
    preset: { targetSizeMB: 0.05 },
    howTo: [
        "Drop your JPG into the uploader above — it stays on your device, nothing is uploaded.",
        "The tool steps the quality down automatically until the file lands under 50KB.",
        "Preview the result, download it, and repeat for as many photos as you need.",
    ],
    sections: [
        {
            heading: "Where 50KB limits still exist",
            paragraphs: [
                "A surprising number of sites still cap uploads at 50KB: classic forums and bulletin boards with avatar limits, matrimonial and dating profiles, some scholarship and exam portals, and email signature images that need to stay tiny. Meanwhile the camera in your pocket produces 3–12MB files — up to two hundred times the limit.",
                "The usual advice — “just lower the quality in an editor” — turns into a guessing game of export, check size, repeat. This page removes the guessing: it is pre-set to a 50KB target, so you drop the photo in and get a file that fits, first try.",
            ],
        },
        {
            heading: "Why JPG is the right format for a 50KB target",
            paragraphs: [
                "JPG was designed for exactly this job: photographic images at small file sizes. Its lossy compression discards detail your eyes won't miss at small display sizes, which is why a photo that needs 4MB as a PNG can live happily under 50KB as a JPG.",
                "That also means your source format matters. If your image is currently a PNG — a screenshot, a graphic with transparency — flatten it to JPG first and it will shrink dramatically. Transparency can't survive the trip to JPG, so this advice is for photos and opaque images only.",
            ],
        },
        {
            heading: "How the automatic 50KB target works",
            paragraphs: [
                "This page opens the compressor with its target locked to 0.05MB. The encoder compresses your photo, measures the result, and steps the quality down until the output sits just under 50KB — the same iterative approach desktop export tools use, without the dialog boxes.",
                "Oversized photos are downscaled first, because a 4000-pixel-wide original can never become a good 50KB file. All of it runs locally with WebAssembly: no upload queue, no account, no daily quota.",
            ],
        },
        {
            heading: "Keeping a 50KB photo looking decent",
            paragraphs: [
                "A 50KB JPG looks best at the size it will actually be shown — avatars and thumbnails displayed at a few hundred pixels. At those sizes the compression is effectively invisible; artifacts only appear if someone zooms in hunting for them.",
                "Two tips from experience: crop tightly before compressing — every pixel of background you remove is quality budget spent on the subject — and always preview the download before submitting it anywhere official. Keep your original too; compression discards data permanently.",
            ],
        },
        {
            heading: "Your photo never leaves your device",
            paragraphs: [
                "Files headed for a 50KB limit are often personal: profile photos, ID pictures, application documents. This tool processes everything in your browser, so your photo never travels to a server. You can verify that with your browser's network tab.",
                "The honest caveat: once you upload the compressed file to a forum or portal, its privacy is governed by that site's policies, not ours. Submit only what's required, and keep your full-resolution originals somewhere safe.",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I compress a JPG to exactly 50KB?",
            answer: "You don't need exactly 50KB — limits are always “under 50KB,” and this tool targets just under the cap automatically. Chasing an exact byte count would only cost you quality for zero benefit.",
        },
        {
            question: "Can I compress several JPGs to 50KB at once?",
            answer: "Yes. Drop in a whole batch; each photo is compressed to under 50KB independently, and you can download the results one by one or together as a ZIP. There's no batch limit.",
        },
        {
            question: "My file came out at 47KB, not 50KB — is something wrong?",
            answer: "No — that's the tool working as designed. It stops as soon as the file fits under the limit, and landing a little below 50KB just means your photo compressed efficiently. Any file under the cap passes the upload check.",
        },
        {
            question: "Will this work for a passport or ID photo upload?",
            answer: "For portals that accept JPGs under 50KB, yes — but check the portal's other rules first. Many official photo uploads also specify dimensions, background color, and recency, which no compressor can fix for you.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual control",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb",
            label: "Compress image to 100KB",
        },
        {
            href: "/tools/image-compressor/compress-png-online",
            label: "Compress PNG screenshots",
        },
        {
            href: "https://www.heic2jpg-free.com",
            label: "Convert HEIC to JPG free",
            external: true,
        },
    ],
};

export const convertImageToWebp: LongTailContent = {
    id: "convert-image-to-webp",
    slug: "convert-image-to-webp",
    hubId: "image-compressor",
    href: "/tools/image-compressor/convert-image-to-webp",
    crumb: "Convert Images to WebP",
    h1: "Convert Images to WebP Online — Free",
    subtitle:
        "Convert JPG and PNG images to genuine WebP files in your browser. Smaller files, same look — perfect for faster websites. Free, unlimited, no upload.",
    metaTitle: "Convert Image to WebP Online Free — Real .webp Output",
    metaDescription:
        "Turn JPG and PNG images into real WebP files right in your browser — typically 25–35% smaller at the same quality. Free, private, no signup.",
    keywords: [
        "convert image to webp",
        "jpg to webp converter",
        "png to webp online",
        "webp converter free",
    ],
    preset: { outputFormat: "webp" },
    howTo: [
        "Drop your JPG or PNG images into the uploader above — they never leave your device.",
        "The tool re-encodes each image as a genuine WebP file using your browser's canvas encoder.",
        "Download the .webp files individually or as a batch and use them anywhere WebP is accepted.",
    ],
    sections: [
        {
            heading: "Why WebP in 2026",
            paragraphs: [
                "WebP has quietly become the web's default image format. Developed by Google, it typically produces files 25–35% smaller than JPEG at equivalent visual quality, and it handles transparency like PNG — one format covering the jobs that used to need two.",
                "For anyone running a website, that size difference is free performance: smaller images download faster, pages feel snappier, and mobile visitors on slow connections notice the difference immediately. It's the single easiest image optimization most sites haven't done yet.",
            ],
        },
        {
            heading: "Browser and app support is a solved problem",
            paragraphs: [
                "A few years ago “but does it work in Safari?” was a real question. Not anymore: every modern browser — Chrome, Firefox, Safari (since version 14), Edge, and all mobile browsers — has displayed WebP natively for years. In 2026, WebP support is effectively universal on the web.",
                "The remaining exceptions are outside the browser: some desktop publishing tools, older email clients, and print workflows still expect JPG or PNG. Rule of thumb: WebP for anything displayed on the web, JPG or PNG for anything headed to print or attached in email to non-technical recipients.",
            ],
        },
        {
            heading: "How conversion works on this page",
            paragraphs: [
                "This page opens the compressor with WebP output pre-selected. Your image is decoded and re-encoded through your browser's native canvas encoder, producing a genuine .webp file — not a renamed JPG, not a container trick. What you download is the real format.",
                "Transparency survives the trip: PNGs with alpha channels convert to WebP with transparency intact, and at a fraction of the file size. Everything happens locally, so you can convert a whole folder of site assets without uploading anything.",
            ],
        },
        {
            heading: "WebP quality: what to expect",
            paragraphs: [
                "Converted WebP files look identical to their sources at normal viewing sizes — the format's whole point is discarding data your eyes can't see. Photographs convert especially well; flat graphics and screenshots with transparency also shrink dramatically compared to PNG.",
                "One honest note: conversion can't add quality that isn't there. A blurry, over-compressed JPG becomes a smaller blurry WebP — the file gets lighter, but the pixels don't get better. Start from the best-quality source you have.",
            ],
        },
        {
            heading: "Pair it with the right size",
            paragraphs: [
                "Format is only half the battle — dimensions are the other half. A 4000-pixel WebP is still heavier than it needs to be for an 800-pixel blog slot. Convert here, then make sure each image is also sized for its actual display slot.",
                "If you're optimizing a whole site rather than converting a few files, our website image guide walks through sensible per-image size targets and how they feed into Google's Core Web Vitals measurements.",
            ],
        },
    ],
    faqs: [
        {
            question: "Is the output a real WebP file?",
            answer: "Yes. The tool re-encodes your image through the browser's canvas encoder and downloads it with a .webp extension — a genuine WebP file that any modern browser, CMS, or image tool will recognize.",
        },
        {
            question: "Will I lose image quality converting to WebP?",
            answer: "Not visibly. WebP is engineered to match JPEG's visual quality at 25–35% smaller sizes. At normal viewing distances a converted photo is indistinguishable from its source.",
        },
        {
            question: "Does transparency survive the conversion?",
            answer: "Yes. Unlike JPG, WebP supports an alpha channel, so transparent PNGs convert to transparent WebPs — usually at a fraction of the original file size.",
        },
        {
            question: "Can I convert animated GIFs to WebP here?",
            answer: "This page handles still images — JPG and PNG in, static WebP out. Animated sources need a dedicated animation converter, which this tool isn't.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual control",
        },
        {
            href: "/tools/image-compressor/compress-images-for-websites",
            label: "Compress images for faster websites",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb",
            label: "Compress image to 100KB",
        },
        {
            href: "https://www.heic2jpg-free.com",
            label: "Convert HEIC to JPG free",
            external: true,
        },
    ],
};

export const compressPhotosForEmail: LongTailContent = {
    id: "compress-photos-for-email",
    slug: "compress-photos-for-email",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-photos-for-email",
    crumb: "Compress Photos for Email",
    h1: "Compress Photos for Email Online — Free",
    subtitle:
        "Shrink a whole photo shoot to email-friendly sizes in your browser. Beat Gmail and Outlook attachment limits without zipping, linking, or signing up.",
    metaTitle: "Compress Photos for Email — Beat Attachment Limits Free",
    metaDescription:
        "Batch-compress photos to ~1MB each for email and stay under Gmail's 25MB and Outlook's attachment limits. Free, unlimited, private.",
    keywords: [
        "compress photos for email",
        "reduce photo size for email",
        "email photo compressor",
        "shrink pictures for gmail",
    ],
    preset: { targetSizeMB: 1 },
    howTo: [
        "Drop your photos into the uploader above — they stay on your device.",
        "Each photo is automatically brought down to around 1MB, the sweet spot for email.",
        "Download the compressed set and attach it to your email like normal.",
    ],
    sections: [
        {
            heading: "The attachment limits you'll hit",
            paragraphs: [
                "Gmail caps a whole message at 25MB including encoding overhead, which means roughly 18MB of actual attachments. Outlook.com allows around 20MB, and many corporate mail servers enforce even less. A ten-photo shoot straight from a phone — 4 to 8MB per photo — sails past every one of these limits.",
                "The failure mode is annoying: the message bounces, or the recipient gets a “download from link” prompt they don't trust. Compressing first keeps everything inside one ordinary email that just works.",
            ],
        },
        {
            heading: "Why 1MB per photo is the sweet spot",
            paragraphs: [
                "This page targets about 1MB per image. That's large enough to look crisp full-screen on any monitor or phone — far beyond what most recipients need — while small enough that twenty photos still fit comfortably inside Gmail's limit.",
                "Going smaller saves little in practice: the difference between a 1MB and a 300KB photo is invisible in an email, but the 1MB version survives if the recipient decides to print one. One megabyte is the point where convenience and quality stop fighting.",
            ],
        },
        {
            heading: "Email beats links for most recipients",
            paragraphs: [
                "Cloud links work until they don't: expired shares, corporate firewalls blocking file hosts, grandparents who won't click a Drive link. An attachment inside the email itself has none of these failure modes — it opens in the mail app, offline, forever.",
                "That's the trade this page makes for you: photos small enough to attach directly, so you never have to explain to anyone how to open a shared folder. For client galleries and family albums alike, the email that “just arrives” wins.",
            ],
        },
        {
            heading: "Batch a whole shoot at once",
            paragraphs: [
                "Drop in the entire set — a wedding's highlights, a house listing's thirty photos, a trip's best-of folder. Each image is compressed independently toward the 1MB target, and you download them one by one or bundled as a ZIP.",
                "Because everything runs in your browser, there's no upload queue and no per-day cap standing between you and a 200-photo batch. Your computer does the work while you write the email.",
            ],
        },
        {
            heading: "Keep your originals, send the copies",
            paragraphs: [
                "Compression permanently discards data, so treat the emailed versions as delivery copies: compress copies, archive the full-resolution originals separately. Future you — wanting a print, a crop, or a re-edit — will be grateful.",
                "Privacy follows the same logic as everything here: the photos never leave your browser during compression. Client shoots and family photos are processed by your own device, not uploaded to a stranger's server.",
            ],
        },
    ],
    faqs: [
        {
            question: "How many photos can I attach to one Gmail after compressing?",
            answer: "Gmail allows about 18MB of real attachments per message. At ~1MB per photo, that's roughly 15–18 photos per email — versus two or three uncompressed. For bigger sets, split across two emails or send a ZIP.",
        },
        {
            question: "Will recipients notice the quality difference?",
            answer: "No. A 1MB photo displayed on a screen is visually identical to the 6MB original for all practical purposes. The compression only becomes visible in large prints or extreme crops — neither of which happens inside an email.",
        },
        {
            question: "My photos are HEIC from an iPhone — will this work?",
            answer: "Not directly: browsers can't decode Apple's HEIC format. Convert them to JPG first with our free sister site heic2jpg-free.com, then drop the JPGs here for email-sized compression.",
        },
        {
            question: "Should I ZIP the photos instead?",
            answer: "A ZIP of full-size photos is still full-size — zipping barely shrinks JPEGs since they're already compressed. Shrink the photos first with this tool; then a ZIP is just convenient packaging, not a size strategy.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual control",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb",
            label: "Compress image to 100KB for strict forms",
        },
        {
            href: "/tools/image-compressor/convert-image-to-webp",
            label: "Convert images to WebP",
        },
        {
            href: "https://www.heic2jpg-free.com",
            label: "Convert HEIC to JPG free",
            external: true,
        },
    ],
};

export const compressImagesForWebsites: LongTailContent = {
    id: "compress-images-for-websites",
    slug: "compress-images-for-websites",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-images-for-websites",
    crumb: "Compress Images for Websites",
    h1: "Compress Images for Websites — Faster Pages",
    subtitle:
        "Slim down hero images, blog graphics, and product shots for faster pages. Hit sensible size targets that keep Google's Core Web Vitals happy.",
    metaTitle: "Compress Images for Websites — Faster Pages, Better SEO",
    metaDescription:
        "Shrink website images to ~0.5MB for faster load times and better Core Web Vitals. Free in-browser compression — no upload, no signup, unlimited use.",
    keywords: [
        "compress images for website",
        "optimize images for web",
        "reduce image size for faster website",
        "web image compressor",
    ],
    preset: { targetSizeMB: 0.5 },
    howTo: [
        "Drop your site images into the uploader above — processing stays in your browser.",
        "Each image is automatically compressed toward ~0.5MB, a solid target for web use.",
        "Download the results and replace the heavy originals on your site.",
    ],
    sections: [
        {
            heading: "Images are the heaviest part of your page",
            paragraphs: [
                "On a typical web page, images account for roughly half of all downloaded bytes — more than the HTML, CSS, and JavaScript combined. A single unoptimized 5MB hero photo can outweigh everything else on the page put together.",
                "That weight is paid by every visitor: slower loads, higher bounce rates, and wasted mobile data. Compressing images is the highest-leverage performance fix on most sites, and it takes minutes.",
            ],
        },
        {
            heading: "Core Web Vitals reward lighter images",
            paragraphs: [
                "Google's Core Web Vitals — the metrics that feed into search rankings — include Largest Contentful Paint (LCP), which measures how fast the page's main content appears. On most pages, the LCP element is an image: usually the hero.",
                "This page targets around 0.5MB per image, a pragmatic ceiling for web slots. A hero compressed to half a megabyte paints dramatically faster than a 4MB original, and at typical display sizes visitors cannot tell the difference.",
            ],
        },
        {
            heading: "Match the size to the slot",
            paragraphs: [
                "Different image slots deserve different sizes: a full-width hero might justify 0.5MB, a blog inline image rarely needs more than 200–300KB, and thumbnails can live under 100KB. One target doesn't fit all — but 0.5MB is a safe default ceiling before you fine-tune.",
                "Dimensions matter as much as compression. Don't serve a 4000-pixel image in an 800-pixel slot; resize to the display size (or 2x for retina crispness) and use responsive srcset markup so phones download the small version. Compression and sizing multiply each other's gains.",
            ],
        },
        {
            heading: "WebP: the other half of the win",
            paragraphs: [
                "Once your images are sensibly sized, the format is the next 25–35% of savings. WebP delivers JPEG-equivalent quality at roughly two-thirds the bytes, and every modern browser displays it natively.",
                "Our WebP converter turns your compressed JPGs and PNGs into genuine .webp files in the browser. The practical workflow: compress here for size, convert there for format — or serve both with a picture-element fallback for maximum compatibility.",
            ],
        },
        {
            heading: "Beyond compression: the quick wins",
            paragraphs: [
                "Two habits multiply what compression achieves. First, lazy-load below-the-fold images so they don't block the initial render. Second, always set explicit width and height attributes to prevent layout shift — another Core Web Vitals metric.",
                "None of this requires a build pipeline or a paid CDN. Sensible sizes, modern formats, lazy loading, and stable dimensions cover the vast majority of image performance — everything else is diminishing returns.",
            ],
        },
    ],
    faqs: [
        {
            question: "How small should my website images be?",
            answer: "Aim for under 500KB for heroes, 200–300KB for content images, and under 100KB for thumbnails. This page's 0.5MB target is a good default ceiling; fine-tune downward per slot from there.",
        },
        {
            question: "Will compressing images hurt my SEO?",
            answer: "The opposite: faster pages rank better. Google's Core Web Vitals explicitly reward fast-loading pages, and compressed images are the fastest route to a better Largest Contentful Paint score. Just keep descriptive filenames and alt text.",
        },
        {
            question: "Should I use WebP or AVIF?",
            answer: "WebP is the safe default in 2026 — universal browser support and mature tooling. AVIF compresses slightly better but still has patchier support in editors and CMS pipelines. Compress to a sensible size first; the format choice is secondary.",
        },
        {
            question: "Can I compress a whole site's images at once?",
            answer: "Yes — drop in a batch and each image is compressed toward the 0.5MB target independently, downloadable individually or as a ZIP. For very large media libraries, repeat per folder; there's no daily cap.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual control",
        },
        {
            href: "/tools/image-compressor/convert-image-to-webp",
            label: "Convert images to WebP for extra savings",
        },
        {
            href: "/tools/image-compressor/compress-png-online",
            label: "Compress PNG screenshots",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb",
            label: "Compress image to 100KB",
        },
    ],
};

export const compressPngOnline: LongTailContent = {
    id: "compress-png-online",
    slug: "compress-png-online",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-png-online",
    crumb: "Compress PNG Online",
    h1: "Compress PNG Online — Free",
    subtitle:
        "Shrink PNG screenshots, graphics, and logos without wrecking them. Free in-browser compression with full manual control — no upload, no signup.",
    metaTitle: "Compress PNG Online Free — Shrink Screenshots & Graphics",
    metaDescription:
        "Reduce PNG file sizes in your browser — screenshots, UI graphics, and logos with transparency intact. Free, unlimited, private: no uploads ever.",
    keywords: [
        "compress png online",
        "reduce png file size",
        "png compressor free",
        "shrink png screenshot",
    ],
    howTo: [
        "Drop your PNG files into the uploader above — they never leave your device.",
        "Use the quality slider to find your size-versus-sharpness sweet spot, with a live preview.",
        "Download the compressed PNGs individually or as a ZIP.",
    ],
    sections: [
        {
            heading: "Why PNGs are so big",
            paragraphs: [
                "PNG is a lossless format: every pixel is preserved exactly, which is wonderful for crispness and terrible for file size. A photographic PNG can easily weigh ten times more than the same image saved as JPG, because lossless compression can't discard the fine detail cameras capture.",
                "There's a second culprit: the alpha channel. Transparency data adds weight to every PNG, even ones that don't visibly use it. Between losslessness and transparency, PNGs start heavy and stay heavy — which is why they need deliberate compression.",
            ],
        },
        {
            heading: "Screenshots: the classic PNG problem",
            paragraphs: [
                "The PNG you'll most often need to shrink is a screenshot. A retina screenshot of a full screen can weigh 2–4MB — fine on your disk, painful as an email attachment or a documentation upload.",
                "Screenshots compress better than photos because flat colors and repeated patterns are PNG's home turf, but “better” still isn't small. This page's manual quality control lets you dial a screenshot down until the text stays razor-sharp and the file stops being embarrassing.",
            ],
        },
        {
            heading: "Transparency is PNG's superpower — keep it",
            paragraphs: [
                "Logos, icons, UI elements, watermarks: anything that needs to float over a background needs PNG's alpha channel. JPG can't do transparency at all — converting a transparent PNG to JPG fills the transparent areas with a solid color, usually white or black.",
                "So the rule is simple: if the image relies on transparency, it stays a PNG and you compress within the format. Only flatten to JPG when the image is fully opaque and photographic — that's where the dramatic 10x savings live.",
            ],
        },
        {
            heading: "When to convert to JPG instead",
            paragraphs: [
                "The biggest PNG wins aren't compression — they're format changes. A photo accidentally saved as PNG (common with phone screenshots of photos, or exports from design tools) will shrink 80–90% the moment it's re-encoded as JPG, with no visible difference.",
                "Judge by content, not extension: photographic content with no transparency belongs in JPG; crisp graphics, text, and anything transparent belongs in PNG. Our 100KB compressor page is the natural next step when a photo needs to hit a hard size limit.",
            ],
        },
        {
            heading: "A lossless-friendly workflow",
            paragraphs: [
                "Because PNG compression here stays within the format, your graphics survive intact — but good habits still apply. Keep the original PNG as your master, and treat compressed copies as delivery files for the web, email, or docs.",
                "And as with everything on this site, the work happens in your browser. Screenshots often contain sensitive information — chats, dashboards, unreleased work — and none of it is uploaded anywhere during compression.",
            ],
        },
    ],
    faqs: [
        {
            question: "Will compressing remove my PNG's transparency?",
            answer: "No — as long as the file stays a PNG, the alpha channel is preserved. Transparency is only lost if you convert the image to JPG, which doesn't support it. Keep transparent graphics in PNG and compress within the format.",
        },
        {
            question: "Why is my screenshot 3MB?",
            answer: "Retina displays pack four times the pixels of older screens, and PNG stores every one losslessly. Screenshots of busy screens with lots of detail compress poorly. Dial the quality down on this page until text stays sharp — that's your sweet spot.",
        },
        {
            question: "Should I convert my PNG photo to JPG?",
            answer: "If it's a photo with no transparency, almost certainly yes: expect 80–90% smaller files with no visible difference. If it has transparency or razor-sharp text and lines, keep it as PNG.",
        },
        {
            question: "Can I compress multiple PNGs at once?",
            answer: "Yes — batch as many as you like; each is compressed independently and you can download them one by one or as a ZIP, with no limits.",
        },
    ],
    related: [
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — full manual control",
        },
        {
            href: "/tools/image-compressor/compress-images-for-websites",
            label: "Compress images for faster websites",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb",
            label: "Compress image to 100KB",
        },
    ],
};

export const imageCompressorPages: LongTailContent[] = [
    compressImageTo100kb,
    compressJpgTo50kb,
    convertImageToWebp,
    compressPhotosForEmail,
    compressImagesForWebsites,
    compressPngOnline,
];
