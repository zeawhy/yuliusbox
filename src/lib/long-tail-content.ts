import type { HubContent } from "./hub-content";

/**
 * Long-tail scenario pages.
 *
 * Each entry reuses a shared tool component with a preset (e.g. a fixed
 * target size) and carries fully independent editorial content — never a
 * find-and-replace of the hub page copy. HubBody renders the shared
 * template (trust note, how-to, sections, FAQ, related links).
 */
export interface LongTailContent extends HubContent {
    /** URL slug under the hub, e.g. "compress-image-to-100kb". */
    slug: string;
    /** Key into hubContent, e.g. "image-compressor". */
    hubId: string;
    metaTitle: string;
    metaDescription: string;
    /** Preset passed to the shared tool component. */
    targetSizeMB?: number;
}

export const compressImageTo100kb: LongTailContent = {
    id: "compress-image-to-100kb",
    slug: "compress-image-to-100kb",
    hubId: "image-compressor",
    href: "/tools/image-compressor/compress-image-to-100kb/",
    crumb: "Compress Image to 100KB",
    h1: "Compress Image to 100KB Online — Free",
    subtitle:
        "Shrink any JPG, PNG, or WebP photo to under 100KB right in your browser. Built for job portals, application forms, and forums with strict upload limits.",
    metaTitle: "Compress Image to 100KB Online Free — No Upload | YuliusBox",
    metaDescription:
        "Reduce any photo to under 100KB for job applications, exam forms, and forums. Free, unlimited, and 100% private — your image never leaves your browser.",
    targetSizeMB: 0.1,
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

/** Registry of all long-tail pages (sample: one entry this round). */
export const longTailPages: LongTailContent[] = [compressImageTo100kb];
