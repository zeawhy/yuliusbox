import type { LongTailContent } from "../long-tail-content";

/**
 * pdf-kit long-tail pages.
 * Shared component: PdfKitTool (prop: pdfMode).
 *
 * Modes (implemented by a sibling task — describe exactly this):
 * - merge:      combine multiple PDFs in custom order into one file.
 * - compress:   metadata cleanup that strips title/author metadata to shrink
 *               files. Does NOT recompress images inside the PDF.
 * - split:      every page becomes its own PDF, bundled into one ZIP download.
 * - extract:    user types page ranges like "1-3, 5, 8-10", gets one PDF
 *               containing those pages.
 * - jpg-to-pdf: multiple JPGs combined into one PDF, one image per full-size
 *               page.
 */
export const mergePdfOnline: LongTailContent = {
    id: "merge-pdf-online",
    slug: "merge-pdf-online",
    hubId: "pdf-kit",
    href: "/tools/pdf-kit/merge-pdf-online/",
    crumb: "Merge PDF Online",
    h1: "Merge PDF Online — Free",
    subtitle:
        "Combine multiple PDFs into one file, in whatever order you choose. Perfect for application bundles, reports, and scanned pages — free and private.",
    metaTitle: "Merge PDF Online Free — Combine PDFs in Order | YuliusBox",
    metaDescription:
        "Combine multiple PDFs into one file in your custom order — application bundles, reports, scanned pages. Free, unlimited, 100% private.",
    keywords: [
        "merge pdf online",
        "combine pdf files",
        "merge pdfs free",
        "join pdf documents",
    ],
    preset: { pdfMode: "merge" },
    howTo: [
        "Drop your PDF files into the merger above — they stay on your device.",
        "Drag them into the order you want the pages to appear.",
        "Click merge and download the single combined PDF.",
    ],
    sections: [
        {
            heading: "The application-document bundle",
            paragraphs: [
                "The most common merge job is the application packet: CV, cover letter, certificates, references, portfolio — five separate files that a portal expects as one. Recruiters and admissions officers consistently prefer a single document over a zip of loose files.",
                "The same need shows up everywhere: monthly reports assembled from department submissions, a contract with its appendices, scanned pages that arrived as separate files. Merging turns a folder into a document.",
            ],
        },
        {
            heading: "Order matters more than you think",
            paragraphs: [
                "A merged PDF reads in the order you set: cover letter first, then CV, then evidence — or whatever logic your reader expects. This page opens the merger with drag-to-reorder, so arranging the sequence is the main event, not an afterthought.",
                "Worth deciding before you merge: what's the narrative? For applications, lead with the document that answers “who is this and what do they want” before the supporting evidence. A well-ordered bundle reads like an argument; a random one reads like a junk drawer.",
            ],
        },
        {
            heading: "How merging works here",
            paragraphs: [
                "Drop in your files, arrange them, and the tool stitches them into one PDF — page order preserved within each file, files in your chosen sequence. The result downloads as a single document, ready to attach or upload.",
                "Everything runs locally in your browser, which matters more for PDFs than for photos: these are contracts, applications, financial records. Nothing is uploaded to a server at any point — verify it in your network inspector if you like.",
            ],
        },
        {
            heading: "Before you hit merge",
            paragraphs: [
                "Two minutes of prep saves re-merging: check that scanned pages are upright and in sequence, remove duplicate or blank pages, and confirm every file actually opens. A corrupted file in the middle of a batch is the classic merge-day surprise.",
                "Also check page sizes. Mixing A4 and US Letter in one document won't break anything, but pick one for a professional result — most scanners let you set this before you scan, which beats fixing it after.",
            ],
        },
        {
            heading: "After the merge",
            paragraphs: [
                "Open the merged file and skim it end to end before sending: confirm the order, check that no file came through blank, and glance at the total page count against what you expected.",
                "Keep the source files. If a recruiter later asks for “just the certificates,” you'll want the originals — re-splitting a merged PDF is possible but never as clean as keeping the pieces.",
            ],
        },
    ],
    faqs: [
        {
            question: "How many PDFs can I merge at once?",
            answer: "There's no artificial cap — the practical limit is your device's memory. Typical jobs (a dozen application documents, a 200-page report assembled from chapters) merge in seconds, entirely in your browser.",
        },
        {
            question: "Will the merged PDF keep each file's quality?",
            answer: "Yes. Merging rearranges pages; it doesn't re-render them. Text stays selectable, scans keep their resolution, and nothing is recompressed — the output is exactly the sum of its inputs.",
        },
        {
            question: "Can I merge scanned PDFs?",
            answer: "Yes — scans are just PDFs with image pages, and they merge like any other. Just make sure the scans are upright and in order first; the merger won't straighten pages for you.",
        },
        {
            question: "Is it safe to merge sensitive documents here?",
            answer: "Yes, because nothing leaves your browser. The merge happens on your device, so contracts and applications never travel over the network to reach us.",
        },
    ],
    related: [
        {
            href: "/tools/pdf-kit",
            label: "PDF Tools — merge, split, convert",
        },
        {
            href: "/tools/pdf-kit/jpg-to-pdf-converter/",
            label: "Turn JPG scans into a PDF first",
        },
        {
            href: "/tools/pdf-kit/extract-pages-from-pdf/",
            label: "Extract pages from a PDF",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb/",
            label: "Shrink scanned images before merging",
        },
    ],
};

export const jpgToPdfConverter: LongTailContent = {
    id: "jpg-to-pdf-converter",
    slug: "jpg-to-pdf-converter",
    hubId: "pdf-kit",
    href: "/tools/pdf-kit/jpg-to-pdf-converter/",
    crumb: "JPG to PDF Converter",
    h1: "JPG to PDF Converter — Free",
    subtitle:
        "Turn phone photos of documents into a single clean PDF — one image per full page. Receipts, contracts, whiteboards: free, private, no signup.",
    metaTitle: "JPG to PDF Converter Free — Photos to One PDF | YuliusBox",
    metaDescription:
        "Convert multiple JPGs into one PDF — one image per full-size page. Phone scans, receipts, contracts. Free, unlimited, private: in your browser.",
    keywords: [
        "jpg to pdf converter",
        "convert jpg to pdf",
        "images to pdf online",
        "jpg to pdf free",
    ],
    preset: { pdfMode: "jpg-to-pdf" },
    howTo: [
        "Drop your JPG photos into the converter above — they never leave your device.",
        "Arrange them in page order; each image becomes one full-size page.",
        "Download the single PDF and send it wherever the document needs to go.",
    ],
    sections: [
        {
            heading: "Your phone is a scanner now",
            paragraphs: [
                "Nobody owns a flatbed scanner anymore, and nobody needs to: a phone photo of a document, taken with decent light, is perfectly legible. The missing step has always been turning a camera roll of loose photos into one proper document.",
                "That's what this page does. Drop in the photos — a signed contract, a stack of receipts, whiteboard notes from a meeting — and get back a single PDF where each image fills its own page, in the order you arranged.",
            ],
        },
        {
            heading: "One image per full-size page",
            paragraphs: [
                "Each JPG becomes one full page of the PDF, scaled to fill the page while keeping its aspect ratio. No thumbnails crammed four-to-a-page, no awkward cropping — the document reads like it was scanned, page by page.",
                "Order is yours to set: arrange the images before converting so page 1 is actually page 1. For multi-page documents, photograph the pages in sequence and the converter preserves that order automatically.",
            ],
        },
        {
            heading: "Shoot better source photos",
            paragraphs: [
                "The PDF can only be as good as the photos. Five habits: shoot in bright, even light; hold the phone parallel to the page; leave a small margin around the edges; tap to focus on the text; and check each shot for shadows from your own hand.",
                "For receipts and small items, place them on a contrasting background. For bound books, press the page flat near the spine. Two extra seconds per photo saves you from an illegible document later. And wipe the lens — a smudged phone camera is the most common cause of blurry “scans.”",
            ],
        },
        {
            heading: "What about PNG, HEIC, and other formats?",
            paragraphs: [
                "This converter takes JPGs — the format every phone camera produces by default. If your photos are HEIC (the iPhone default), convert them to JPG first with our free sister site heic2jpg-free.com, then bring them here.",
                "PNG screenshots of documents are also better converted to JPG first: they're dramatically smaller with no legibility loss, which keeps the resulting PDF lean enough to email.",
            ],
        },
        {
            heading: "Private by design",
            paragraphs: [
                "Documents people photograph are sensitive by nature: contracts, IDs, medical forms, financial records. This converter runs entirely in your browser — your photos are never uploaded to any server.",
                "The usual caveat applies downstream: once you email or upload the resulting PDF, its privacy depends on the recipient. But the conversion step itself leaks nothing.",
            ],
        },
    ],
    faqs: [
        {
            question: "How many JPGs can I convert into one PDF?",
            answer: "There's no fixed cap — batch a whole contract or a month of receipts. The practical limit is your device's memory, and typical jobs of dozens of photos convert in seconds.",
        },
        {
            question: "Will each photo fill a whole page?",
            answer: "Yes — each JPG becomes one full-size page, scaled to fill the page while keeping its aspect ratio. The result reads like a scanned document, not a contact sheet of thumbnails.",
        },
        {
            question: "Can I rearrange the page order?",
            answer: "Yes — arrange your images in the converter before generating the PDF, and the pages follow that order. Photographing pages in sequence is the easiest way to get it right first time.",
        },
        {
            question: "My iPhone photos are HEIC, not JPG — now what?",
            answer: "Convert them first with our free sister site heic2jpg-free.com (also in-browser and private), then drop the resulting JPGs here to build your PDF.",
        },
    ],
    related: [
        {
            href: "/tools/pdf-kit",
            label: "PDF Tools — merge, split, convert",
        },
        {
            href: "/tools/pdf-kit/merge-pdf-online/",
            label: "Merge PDFs into one file",
        },
        {
            href: "/tools/pdf-kit/compress-pdf-online/",
            label: "Shrink the resulting PDF",
        },
        {
            href: "https://www.heic2jpg-free.com",
            label: "Convert HEIC to JPG free",
            external: true,
        },
    ],
};

export const splitPdfOnline: LongTailContent = {
    id: "split-pdf-online",
    slug: "split-pdf-online",
    hubId: "pdf-kit",
    href: "/tools/pdf-kit/split-pdf-online/",
    crumb: "Split PDF Online",
    h1: "Split PDF Online — Free",
    subtitle:
        "Break a PDF into separate one-page files, bundled as a single ZIP download. Free, unlimited, and private — split right in your browser.",
    metaTitle: "Split PDF Online Free — Every Page as Its Own File",
    metaDescription:
        "Split a PDF so every page becomes its own file, bundled in one ZIP. Free, unlimited, private — your document never leaves your browser.",
    keywords: [
        "split pdf online",
        "split pdf into separate pages",
        "pdf splitter free",
        "separate pdf pages",
    ],
    preset: { pdfMode: "split" },
    howTo: [
        "Drop your PDF into the splitter above — it stays on your device.",
        "The tool separates every page into its own PDF file.",
        "Download the single ZIP containing all the page files.",
    ],
    sections: [
        {
            heading: "When one PDF needs to become many",
            paragraphs: [
                "A 40-page slide deck where each speaker needs only their section. A scanned batch of forms that arrived as one file but must be filed individually. A catalog you're pulling single pages from. Sometimes the document is right and the packaging is wrong.",
                "Splitting solves it structurally: every page becomes its own PDF, so each piece can be renamed, forwarded, or filed on its own — no more “see pages 12–15 of the attached.”",
            ],
        },
        {
            heading: "Every page, its own file, one ZIP",
            paragraphs: [
                "This page opens the splitter in its straightforward mode: each page of your PDF is extracted as a standalone PDF file, and all of them are bundled into a single ZIP for one convenient download.",
                "The pages keep their original quality and order — splitting rearranges nothing and re-renders nothing. Page 7 of the original becomes a file containing exactly page 7. Because the ZIP is generated on the fly in your browser, even a hundred-page document splits in seconds with no upload wait.",
            ],
        },
        {
            heading: "Split vs. extract: which do you need?",
            paragraphs: [
                "Two related jobs, easy to confuse. Split breaks the whole document apart — every page becomes a file. Extract pulls only the pages you choose into a single new PDF.",
                "Rule of thumb: if you need most of the pages as separate files, split. If you need a few pages together as one document — a chapter, a clause, an appendix — use our extract pages tool instead.",
            ],
        },
        {
            heading: "Naming and organizing the pieces",
            paragraphs: [
                "A ZIP of generically-named page files is only half the job. Rename the ones that matter as you pull them out of the ZIP — “contract-signature-page.pdf” beats “page-23.pdf” when you're searching for it in six months.",
                "For recurring workflows (monthly reports, regular filings), keep a folder template: one folder per source document, split files inside, named consistently. Future you will thank present you — and anyone you hand the folder to will understand it instantly.",
            ],
        },
        {
            heading: "Your document stays yours",
            paragraphs: [
                "PDFs people split are often confidential — legal documents, financial reports, personnel files. The split happens entirely in your browser; the document is never uploaded anywhere.",
                "One practical note: the ZIP you download contains the full content of those pages, so treat it with the same care as the original — especially before forwarding individual pages to other people.",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I download the split pages?",
            answer: "As a single ZIP file containing one PDF per page. Unzip it with your operating system's built-in tools — no special software needed — and each page is there as its own file.",
        },
        {
            question: "Can I split out only pages 5–10?",
            answer: "That's a different job — extracting a range into one new PDF. Use our extract pages tool for that: type “5-10” and you get a single PDF with just those pages.",
        },
        {
            question: "Will splitting reduce quality?",
            answer: "No. Splitting copies pages, it doesn't re-render them. Text stays selectable, images keep their resolution — each page file is identical in content to that page in the original.",
        },
        {
            question: "Does it work with scanned PDFs?",
            answer: "Yes. Scanned pages are just images inside a PDF, and they split like any other page. The output files will be image-based PDFs, exactly like the source.",
        },
    ],
    related: [
        {
            href: "/tools/pdf-kit",
            label: "PDF Tools — merge, split, convert",
        },
        {
            href: "/tools/pdf-kit/extract-pages-from-pdf/",
            label: "Extract specific pages instead",
        },
        {
            href: "/tools/pdf-kit/merge-pdf-online/",
            label: "Merge PDFs back together",
        },
        {
            href: "/tools/pdf-kit/compress-pdf-online/",
            label: "Shrink large PDFs",
        },
    ],
};

export const extractPagesFromPdf: LongTailContent = {
    id: "extract-pages-from-pdf",
    slug: "extract-pages-from-pdf",
    hubId: "pdf-kit",
    href: "/tools/pdf-kit/extract-pages-from-pdf/",
    crumb: "Extract Pages from PDF",
    h1: "Extract Pages from PDF — Free",
    subtitle:
        "Pull exactly the pages you need from a large PDF — a chapter, a clause, a form — into one new file. Type a range, download, done.",
    metaTitle: "Extract Pages from PDF Free — Pull Any Range | YuliusBox",
    metaDescription:
        "Extract pages from a PDF into one new file — type ranges like “1-3, 5, 8-10”. Free, unlimited, private: runs entirely in your browser.",
    keywords: [
        "extract pages from pdf",
        "pull pages out of pdf",
        "pdf page extractor",
        "save specific pdf pages",
    ],
    preset: { pdfMode: "extract" },
    howTo: [
        "Drop your PDF into the extractor above — it never leaves your device.",
        "Type the pages you want, e.g. “1-3, 5, 8-10”.",
        "Download the new PDF containing exactly those pages.",
    ],
    sections: [
        {
            heading: "The 300-page problem",
            paragraphs: [
                "Large PDFs are reference materials: manuals, reports, contracts, textbooks. But nobody needs all 300 pages — you need chapter 4, or the three appendix pages the accountant asked for, or the signed page.",
                "Forwarding the whole file is lazy and sometimes inappropriate: it buries the relevant pages and shares content the recipient shouldn't see. Extraction gives them exactly the pages, in one clean file.",
            ],
        },
        {
            heading: "The page-range syntax",
            paragraphs: [
                "Tell the tool which pages you want using a simple pattern: single pages as numbers (“5”), ranges with a dash (“1-3”), and combinations separated by commas (“1-3, 5, 8-10”). It reads exactly like you'd describe the pages out loud.",
                "The output PDF contains precisely those pages — nothing before, nothing after, no blank fillers. What you type is what you get, which makes it easy to double-check before downloading. If you only need a single page, just type its number alone.",
            ],
        },
        {
            heading: "Pages in the order you listed",
            paragraphs: [
                "The extracted pages follow the order you typed them in, so “8-10, 1-3” produces a document that starts with the old pages 8–10. That makes the tool a light-duty page rearranger too.",
                "Use this deliberately: pull the signature page first for a quick-send contract excerpt, or reorder appendix pages to match the narrative of the email you're attaching them to.",
            ],
        },
        {
            heading: "Extract vs. split",
            paragraphs: [
                "If extraction gives you some pages as one file, splitting gives you all pages as many files. They're complementary: extract the chapter you need today, split the deck when every speaker needs their own section.",
                "A common workflow combines both directions: extract the relevant pages from a large source, then later merge several such excerpts into a custom briefing pack with our merge tool. It beats emailing around a 50MB original every time.",
            ],
        },
        {
            heading: "Private, like everything here",
            paragraphs: [
                "Extraction is often about confidentiality — pulling the shareable pages out of a document that also contains things others shouldn't see. Doing it in your browser means the full document is never uploaded anywhere.",
                "Still, verify the output: open the extracted PDF and confirm it contains only the pages you intended before forwarding. The tool does what you type, so a typo in the range is the main risk — a ten-second skim beats an embarrassing re-send.",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I write the page range?",
            answer: "Use numbers for single pages (“5”), dashes for ranges (“1-3”), and commas to combine them (“1-3, 5, 8-10”). Pages are counted from the start of the document, with the first page as page 1.",
        },
        {
            question: "Can I extract pages in a custom order?",
            answer: "Yes — list them in the order you want: “8-10, 1-3” produces a PDF starting with the old pages 8–10. The output follows your typing order exactly.",
        },
        {
            question: "What if my ranges overlap, like “1-5, 3-7”?",
            answer: "Overlapping ranges simply include those pages once each in the order listed — you won't get duplicates. But clean, non-overlapping ranges are easier to verify at a glance.",
        },
        {
            question: "Can I extract from a scanned PDF?",
            answer: "Yes. Scanned pages extract like any other pages; the output is an image-based PDF of just those pages. Note the text won't be selectable unless the scan was OCR'd — extraction doesn't add text recognition.",
        },
    ],
    related: [
        {
            href: "/tools/pdf-kit",
            label: "PDF Tools — merge, split, convert",
        },
        {
            href: "/tools/pdf-kit/split-pdf-online/",
            label: "Split a PDF into separate pages",
        },
        {
            href: "/tools/pdf-kit/merge-pdf-online/",
            label: "Merge excerpts into one file",
        },
    ],
};

export const compressPdfOnline: LongTailContent = {
    id: "compress-pdf-online",
    slug: "compress-pdf-online",
    hubId: "pdf-kit",
    href: "/tools/pdf-kit/compress-pdf-online/",
    crumb: "Compress PDF Online",
    h1: "Compress PDF Online — Free",
    subtitle:
        "Slim down PDFs with an honest metadata cleanup — no recompression, no quality loss. Free, private, and clear about what it does.",
    metaTitle: "Compress PDF Online Free — Honest Metadata Cleanup",
    metaDescription:
        "Shrink PDFs by stripping excess metadata — title, author, and hidden bloat. Honest tool: content untouched, quality unchanged. Free and private.",
    keywords: [
        "compress pdf online",
        "reduce pdf file size",
        "pdf compressor free",
        "shrink pdf file",
    ],
    preset: { pdfMode: "compress" },
    howTo: [
        "Drop your PDF into the compressor above — it stays on your device.",
        "The tool strips excess metadata — titles, author fields, and hidden bloat.",
        "Download the leaner PDF, identical in visible content.",
    ],
    sections: [
        {
            heading: "Why PDFs get fat",
            paragraphs: [
                "PDFs accumulate weight from three sources: embedded fonts, images, and metadata — the invisible cargo of titles, author names, editing history, and application data that rides along inside the file. A document that's been through several editors can carry surprising amounts of it.",
                "Not all of that weight is removable without trade-offs. Recompressing images shrinks files dramatically but degrades quality; stripping metadata shrinks them modestly but touches nothing visible. This tool does the second, honestly.",
            ],
        },
        {
            heading: "What this compressor actually does",
            paragraphs: [
                "Let's be explicit: this tool performs a metadata cleanup. It removes the title, author, and other document-info fields plus hidden application bloat, then rewrites the file compactly. Your text, images, and layout come through byte-identical.",
                "What it does not do: recompress the images inside your PDF. If your 40MB scan is 39MB of page images, metadata cleanup won't move the needle — and we'd rather tell you that upfront than sell you a miracle.",
            ],
        },
        {
            heading: "When metadata cleanup is enough",
            paragraphs: [
                "For text-heavy documents — contracts, reports, forms, ebooks — metadata and structural bloat can be a meaningful fraction of the file. Shaving a few hundred kilobytes is often exactly what's needed to slip under an email attachment limit or a portal's upload cap.",
                "It's also the right first step before anything drastic: run the honest cleanup, check the new size, and only then decide whether the images need attention too.",
            ],
        },
        {
            heading: "When it won't help — and what to do instead",
            paragraphs: [
                "If your PDF is mostly scanned page images, the images are the file — metadata is a rounding error. No honest metadata tool will fix that; the fix is compressing the images before they become a PDF.",
                "The practical path: compress your JPGs with our image compressor first (a 100KB-per-page target keeps scans email-friendly), then build the PDF from the compressed images with our JPG-to-PDF converter. That combination beats any metadata trick by orders of magnitude.",
            ],
        },
        {
            heading: "Quality and privacy, guaranteed by design",
            paragraphs: [
                "Because nothing is recompressed, quality cannot change — the guarantee is structural, not a promise. What you see in the original is pixel-for-pixel what you get in the output.",
                "And the processing never leaves your browser, which matters for the contracts and records people typically compress. No upload, no account, no retention question to ask.",
            ],
        },
    ],
    faqs: [
        {
            question: "How much smaller will my PDF get?",
            answer: "Honestly: modestly. Metadata cleanup typically saves kilobytes to a few percent — enough to slip under an attachment limit, not enough to rescue a 50MB scan. If images dominate your file, compress the images first instead.",
        },
        {
            question: "Will the quality of my PDF change?",
            answer: "No — that's the point of this approach. Only metadata is removed; text, images, and layout pass through untouched. The visible document is identical before and after.",
        },
        {
            question: "My scanned PDF barely shrank. Why?",
            answer: "Because the file is almost entirely page images, and this tool deliberately doesn't recompress images. Compress your source images first, then rebuild the PDF — that combination shrinks scans dramatically.",
        },
        {
            question: "Is it safe for legal or official documents?",
            answer: "The content is untouched — only invisible metadata fields are removed — so the document's substance is unchanged. That said, for anything legally sensitive, keep the original and check whether the recipient requires the file unmodified.",
        },
    ],
    related: [
        {
            href: "/tools/pdf-kit",
            label: "PDF Tools — merge, split, convert",
        },
        {
            href: "/tools/pdf-kit/jpg-to-pdf-converter/",
            label: "Build lean PDFs from compressed JPGs",
        },
        {
            href: "/tools/image-compressor/compress-image-to-100kb/",
            label: "Compress scan images first",
        },
        {
            href: "/tools/pdf-kit/merge-pdf-online/",
            label: "Merge PDFs into one file",
        },
    ],
};

export const pdfKitPages: LongTailContent[] = [
    mergePdfOnline,
    jpgToPdfConverter,
    splitPdfOnline,
    extractPagesFromPdf,
    compressPdfOnline,
];
