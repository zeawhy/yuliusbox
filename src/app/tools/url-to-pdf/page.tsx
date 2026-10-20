import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import UrlToPdfClient from "./UrlToPdfClient";

const SECTIONS = [
    {
        heading: "Save a public web page as a PDF, rendered like a real browser",
        paragraphs: [
            "Browser \u201CPrint to PDF\u201D works, but it is fiddly: headers and cookie banners creep in, pages split in odd places, and the result depends on your screen size. This tool does the printing on our server instead. You paste a public URL, a headless Chromium browser loads the page — CSS, fonts and JavaScript included — and prints the fully rendered result to a PDF that downloads to your device.",
            "Because the rendering happens on a server, using this tool means our server visits the URL you submit. That is worth understanding before you use it: do not submit URLs that contain private tokens, signed download links you do not want a third party to fetch, or pages behind a login — the server cannot sign in, and such pages will come back as a login screen or an error.",
        ],
    },
    {
        heading: "What is sent, what is fetched, and what is stored",
        paragraphs: [
            "You submit only a URL — no file is uploaded from your device. Our endpoint first checks the address to block requests to internal or private network locations, then passes the URL to a Chromium-based rendering service (Gotenberg), which fetches the page from the public internet and returns the printed PDF. The PDF is streamed back to you; the service does not keep a copy of it, and we do not store the URLs submitted beyond the request itself. Requests are rate-limited to 5 per minute per IP address.",
            "One practical consequence: the page is fetched from our server's network, not from yours. Content that is personalised to your account, your region or your cookies will not appear — the PDF shows the page as a fresh, signed-out visitor would see it.",
        ],
    },
];

const HOW_TO = [
    "Copy the address of the public web page you want to save.",
    "Paste it into the URL field (https:// is added automatically if you leave it off) and press \u201CConvert to PDF\u201D.",
    "Wait while the server loads and renders the page; image-heavy or slow pages can take a little longer.",
    "The PDF downloads automatically. Open it to confirm the page rendered completely before relying on it.",
    "Use \u201CConvert Another URL\u201D to save more pages, one at a time.",
];

const USE_CASES = [
    "Archiving an article, documentation page or announcement before it is edited or taken down.",
    "Saving an online receipt, booking confirmation or itinerary as a durable PDF record.",
    "Sharing a web page with someone who prefers a printable, offline copy.",
    "Capturing a public portfolio, listing or product page exactly as it appeared on a given day.",
    "Collecting reference pages for research into a single folder of PDFs.",
];

const FAQS = [
    {
        question: "Do I upload a file to use this tool?",
        answer: "No file is uploaded. You submit a URL, and our server fetches and renders that public page itself using a Chromium-based service (Gotenberg), then returns the printed PDF to you.",
    },
    {
        question: "Is anything stored after the conversion?",
        answer: "No. The PDF is generated for your request and streamed back; neither the PDF nor a rendered copy of the page is kept on the server afterwards. The URL is processed for the request and is not stored as a document.",
    },
    {
        question: "Why did my page come back as a login screen or look different?",
        answer: "The server visits the page as a signed-out visitor with no cookies. Pages behind a login, paywalls, region restrictions or bot checks will render as that visitor sees them — often a login wall or a simplified version. Such pages are better saved with your own browser's Print to PDF.",
    },
    {
        question: "Can I convert a page on my local network or a private link?",
        answer: "No. For security, URLs pointing at internal, loopback or private network addresses are rejected, and the page must be reachable from the public internet.",
    },
    {
        question: "How are long or JavaScript-heavy pages handled?",
        answer: "The renderer runs the page's JavaScript like a real browser before printing, with a 45-second limit. Extremely long pages produce long, multi-page PDFs, and content that only loads on scroll may appear partially.",
    },
    {
        question: "Is the tool free?",
        answer: "Yes, free and without an account. Conversions are rate-limited to 5 per minute per IP address so the rendering service stays available for everyone.",
    },
];

export default function UrlToPdfPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/url-to-pdf", label: "URL to PDF" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Website URL to PDF Converter</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Turn any public web page into a PDF, rendered server-side with a real Chromium browser. You submit a URL — no file upload.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <UrlToPdfClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="url-to-pdf" />
            </div>
            <Footer />
        </div>
    );
}
