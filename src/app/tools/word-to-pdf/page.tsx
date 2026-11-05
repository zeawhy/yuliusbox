import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import WordToPdfClient from "./WordToPdfClient";

const SECTIONS = [
    {
        heading: "Convert Word documents to PDF without installing Microsoft Word",
        paragraphs: [
            "A PDF is what landlords, universities, procurement portals, and HR departments ask for because it locks page geometry in place: margins, line breaks, multi-column tables, and embedded graphics render identically whether the recipient opens the file on Windows, macOS, iOS, or Linux. Converting a .doc or .docx file into a PDF freezes your headings, pagination, headers, footers, and embedded images into fixed coordinates so the recipient sees the exact layout you approved — without needing Microsoft Word or a desktop Office suite installed on your machine.",
            "Unlike the browser-local PDF utilities in YuliusBox (such as PDF Kit or PDF Redact & Sign, which manipulate existing PDF pages using client-side JavaScript), a Word document is not a fixed-layout file. A modern .docx file is an Office Open XML ZIP archive containing word/document.xml, stylesheet definitions, numbering rules, and unpaginated flow content; a legacy .doc file is a binary OLE2 Compound Document stream. Turning either format into a paginated PDF requires a complete document layout engine capable of calculating line wraps, hyphenation, footnote placement, and table row splitting across page boundaries.",
        ],
    },
    {
        heading: "How your file is handled during server-side conversion",
        paragraphs: [
            "When you click Convert to PDF, your browser transmits the .doc or .docx file over HTTPS to our conversion API route, which streams the multipart payload directly in memory to an isolated, containerized LibreOffice rendering worker powered by Gotenberg. Headless LibreOffice parses the OpenXML or OLE2 document tree, lays out each page according to the document's section margins and paper size (such as US Letter or ISO A4), embeds subsetted font glyphs, and exports a standard PDF 1.7 document stream.",
            "Neither the API route nor the Gotenberg container writes your document to persistent storage or logs its contents to a database. The file exists strictly in volatile memory for the duration of the HTTP request, the generated PDF buffer is returned directly to your browser as a download stream, and the container discards the temporary working directory immediately upon completion. To keep the shared rendering worker fast and responsive for everyone, requests are capped at 30 MB per file and rate-limited to 5 conversions per minute per IP address.",
            "Because the document does leave your browser for server-side rendering, follow a simple rule of thumb: for everyday resumes, academic submissions, invoices, proposals, and business letters, this ephemeral in-memory conversion provides fast, high-fidelity results. If you are handling strictly regulated records or agreements under a zero-external-transmission NDA, export the PDF locally inside your desktop word processor first, and then use our 100% in-browser PDF tools to merge, split, compress, or redact the resulting PDF without uploading a single byte.",
        ],
    },
    {
        heading: "Font metrics, pagination, and preparing a Word file for clean conversion",
        paragraphs: [
            "The most common reason a converted PDF has one more or one fewer page than it did on the author's laptop is font substitution. If a .docx file references proprietary operating-system fonts that are not embedded inside the file itself — such as Calibri, Cambria, Times New Roman, or Arial — our Linux conversion container maps them to metric-compatible open-source equivalents (Carlito for Calibri, Caladea for Cambria, Liberation Serif for Times New Roman, and Liberation Sans for Arial). Metric-compatible fonts share the exact character widths and kerning tables of their Microsoft counterparts, preventing unexpected line wraps and page-break shifts.",
            "If your document uses a custom brand typeface or decorative display font, enable 'Embed fonts in the file' inside Word's Save options before saving your .docx, or stick to standard office typefaces. Before uploading a final version, it also pays to accept or reject any pending Track Changes revisions and delete unresolved comment balloons — otherwise LibreOffice will faithfully render the markup sidebar and revision strikethroughs right into the finished PDF.",
            "Pay special attention to wide tables and floating images. Tables with fixed pixel widths wider than the page margins can clip at the right edge; setting table properties to 'AutoFit to Window' inside Word ensures clean column scaling. Similarly, anchoring figures 'In Line with Text' rather than using free-floating text boxes keeps illustrations locked to their surrounding paragraphs during pagination.",
        ],
    },
    {
        heading: "Combining Word-to-PDF with local browser PDF workflows",
        paragraphs: [
            "Converting a Word file to PDF is frequently the first step in a multi-step document workflow. Once your .docx contract, cover letter, or report has been rendered into a PDF and downloaded to your device, you can pass it directly into YuliusBox's client-side PDF tools — which run 100% locally in your browser with zero further network uploads.",
            "For example, after converting a Word cover letter and resume to PDF, open PDF Kit to merge them with scanned certificates into a single application packet, or run the Compress PDF preset if an upload portal enforces a strict 2 MB attachment cap. If you converted an agreement that needs a handwritten signature or has confidential pricing that must be blacked out before external distribution, open PDF Redact & Sign to apply true rasterized redaction and stamp your signature locally.",
        ],
    },
];

const HOW_TO = [
    "Click the upload zone or drag and drop your .doc or .docx file onto it. Documents up to 30 MB are accepted.",
    "Confirm the displayed filename and byte size match the file you intend to convert.",
    "Click \u201CConvert to PDF\u201D. Your file is sent over HTTPS to the isolated LibreOffice conversion worker, rendered to PDF in memory, and downloaded automatically to your device.",
    "Open the downloaded PDF and verify page breaks, table borders, and headings before sending or uploading it.",
    "Need to combine the new PDF with other files, shrink its byte size, or sign it? Open our local PDF Kit or PDF Redact & Sign tools below.",
];

const USE_CASES = [
    "Exporting a resume and cover letter from .docx to a locked PDF so recruiters see identical typography and spacing on every device.",
    "Submitting university essays, theses, or grant proposals to academic portals that only accept PDF uploads.",
    "Turning client quotations, scopes of work, and invoices drafted in Word into non-editable PDF attachments.",
    "Converting legacy binary .doc archives from older Microsoft Office versions into modern, universally readable PDF files.",
    "Generating a clean PDF from a Word contract before signing or redacting sensitive clauses locally in your browser.",
];

const FAQS = [
    {
        question: "Is my Word document uploaded to a server during conversion?",
        answer: "Yes. Unlike PDF merging or image compression, accurately paginating a .doc or .docx file requires a full Office layout engine that cannot run natively in a browser tab. Your file is sent over HTTPS to our server and piped in memory to an isolated LibreOffice conversion container (Gotenberg). It is never written to persistent disk or stored in a database, and all memory buffers are freed as soon as your PDF download completes.",
    },
    {
        question: "How long are uploaded .doc or .docx files retained?",
        answer: "They are not retained after the HTTP request finishes. The file resides in volatile RAM only for the few seconds required for headless LibreOffice to render the PDF stream. Once the response is sent back to your browser, no copy of the source Word file or the output PDF remains on our infrastructure.",
    },
    {
        question: "What are the file size and rate limits?",
        answer: "The conversion endpoint accepts .doc and .docx files up to 30 MB per upload. To prevent queue congestion on the shared rendering container, conversions are rate-limited to 5 requests per minute per IP address. If your Word file exceeds 30 MB due to high-resolution photos, compress the images before inserting them or shrink the resulting PDF with our local Compress PDF tool.",
    },
    {
        question: "Will my fonts, tables, and page breaks stay in the same place?",
        answer: "For standard business and academic documents, yes. Our rendering container includes metric-compatible font replacements (such as Carlito for Calibri, Caladea for Cambria, and the Liberation family for Arial and Times New Roman) that match Microsoft's character widths and line-height metrics. If your file uses uncommon decorative fonts, embed those fonts inside the .docx file before uploading.",
    },
    {
        question: "What happens if my Word file has Track Changes or comments turned on?",
        answer: "LibreOffice renders the document in its saved visual state. If Track Changes markup or comment balloons are left active in the .docx file, they may appear in the exported PDF margin. Always accept or reject tracked edits and remove internal review comments before converting a final external copy.",
    },
    {
        question: "Can I convert password-protected Word files or other formats like .pages or .odt?",
        answer: "This endpoint specifically validates and converts unencrypted Microsoft Word documents (.doc and .docx). Password-encrypted Word files cannot be opened by the headless renderer unless you remove the password in Word first. For spreadsheets and slide decks, use our dedicated Excel to PDF and PPT to PDF converters.",
    },
];

const COMPANION_LINKS = [
    { href: "/tools/pdf-kit", label: "PDF Kit — Merge, Split, Extract & Compress PDFs Locally" },
    { href: "/tools/pdf-kit/compress-pdf-online", label: "Compress PDF Online — Shrink Converted PDFs Under Portal Limits" },
    { href: "/tools/pdf-redact-sign/redact-pdf-online-free", label: "Redact PDF Online Free — Black Out Sensitive Text & Sign" },
    { href: "/tools/excel-to-pdf", label: "Excel to PDF Converter — Convert .xls & .xlsx Spreadsheets" },
    { href: "/tools/ppt-to-pdf", label: "PPT to PDF Converter — Turn PowerPoint Decks into Handouts" },
];

export default function WordToPdfPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools", label: "Tools" }, { href: "/tools/word-to-pdf", label: "Word to PDF" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Word to PDF Converter</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Convert .doc and .docx documents to accurately paginated PDFs using an isolated headless LibreOffice engine. Processed in memory over HTTPS — files are never stored.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <WordToPdfClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <section aria-label="Next steps for your converted PDF" className="w-full max-w-3xl mx-auto mt-12">
                <h2 className="text-2xl font-bold text-white mb-4">Next steps after converting your Word file</h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                    Once your PDF downloads, you can combine it with other attachments, reduce its file size for strict upload portals, or redact confidential clauses using our 100% in-browser PDF tools:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMPANION_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
                            >
                                <span className="text-zinc-300 group-hover:text-white font-medium text-[15px]">
                                    {link.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="word-to-pdf" />
            </div>
            <Footer />
        </div>
    );
}
