import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import WordToPdfClient from "./WordToPdfClient";

const SECTIONS = [
    {
        heading: "Convert Word documents to PDF without installing Word",
        paragraphs: [
            "A PDF is what landlords, universities, clients and HR departments usually ask for, because it looks the same on every screen and is awkward to edit after the fact. This converter turns a .doc or .docx file into a PDF that keeps your headings, page breaks, tables, images and fonts in place, so what you send is what the other side opens. You do not need Microsoft Word or a desktop PDF suite installed — the conversion runs on our server and the result downloads straight to your device.",
            "Unlike the document converters built into this site's local tools, a Word file cannot be rendered faithfully by browser code alone, so this tool works differently: your file is uploaded to our server, converted there, and the PDF is returned. The section below explains exactly what happens to your file, and the same explanation appears in the FAQ so there is no fine print to hunt for.",
        ],
    },
    {
        heading: "How your file is handled during conversion",
        paragraphs: [
            "When you convert a document, the file is sent over HTTPS to our conversion endpoint and forwarded, in memory, to a LibreOffice-based conversion service (Gotenberg) that does the actual rendering. The upload route does not write your document to disk or to a database: the file exists only in memory for the duration of the request, the converted PDF is streamed back to your browser, and no copy of either file is retained afterwards. Conversions are limited to 5 requests per minute per IP address, and the server enforces a maximum file size of 30 MB.",
            "Because the file does leave your device, avoid converting documents you are not comfortable uploading to a conversion server — for example files under a strict NDA. For everyday contracts, applications, reports and schoolwork, the in-memory, no-storage handling above is the same model used by most online converters, stated here in plain language instead of a privacy policy PDF of its own.",
        ],
    },
];

const HOW_TO = [
    "Click the upload area or drag your .doc or .docx file onto it. Files up to 30 MB are accepted.",
    "Check that the file name and size shown are the document you meant to convert.",
    "Press \u201CConvert to PDF\u201D. The file is uploaded to the conversion server, rendered to PDF, and the download starts automatically when it is ready.",
    "Open the downloaded PDF and skim it once — page count, tables and images — before you send it on.",
    "Use \u201CConvert Another File\u201D if you have more documents; each file is converted separately.",
];

const USE_CASES = [
    "Sending a CV or cover letter that must look identical on the recruiter's screen and cannot be accidentally edited.",
    "Submitting assignments, theses or application forms that specify PDF upload only.",
    "Sharing a contract, quotation or invoice drafted in Word with a client who does not use Word.",
    "Archiving a report or meeting minutes in a format that will still open the same way years from now.",
    "Turning a Word draft into a print-ready file before sending it to a print shop.",
];

const FAQS = [
    {
        question: "Is my document uploaded to a server?",
        answer: "Yes. Word-to-PDF conversion needs a real document rendering engine, which a browser tab cannot provide on its own. Your file is uploaded over HTTPS to our server and forwarded in memory to a LibreOffice-based conversion service (Gotenberg). It is not written to disk or stored in a database, and no copy is kept once the converted PDF has been sent back to you.",
    },
    {
        question: "How long is my file kept after conversion?",
        answer: "It is not kept at all. The upload is held in memory only while the conversion request runs; when the response finishes, there is no stored copy of your document or of the resulting PDF on the server. If you need the PDF again later, convert the document again.",
    },
    {
        question: "What is the maximum file size?",
        answer: "The server accepts Word documents up to 30 MB. Very large files with many high-resolution images may take longer to convert; if a request times out, try compressing the images inside Word first and converting again.",
    },
    {
        question: "Will the layout of my document change?",
        answer: "The conversion uses LibreOffice, which reproduces most Word documents faithfully, including headings, tables, lists and embedded images. Documents that rely on unusual fonts or very new Word features can render slightly differently, which is why we suggest a quick skim of the PDF before sending it.",
    },
    {
        question: "Can I convert .doc files as well as .docx?",
        answer: "Yes, both the older .doc format and the current .docx format are accepted. Other formats such as .odt or .rtf are not supported by this particular tool.",
    },
    {
        question: "Is the converter free to use?",
        answer: "Yes, the tool is free and needs no account. To keep the shared conversion service responsive, requests are rate-limited to 5 conversions per minute per IP address.",
    },
];

export default function WordToPdfPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/word-to-pdf", label: "Word to PDF" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Word to PDF Converter</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Convert .doc and .docx documents to PDF with the layout kept in place. Files are converted on our server and are not stored.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <WordToPdfClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="word-to-pdf" />
            </div>
            <Footer />
        </div>
    );
}
