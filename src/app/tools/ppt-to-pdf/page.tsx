import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import PptToPdfClient from "./PptToPdfClient";

const SECTIONS = [
    {
        heading: "Turn a slide deck into a PDF anyone can open",
        paragraphs: [
            "PowerPoint files are only convenient if the other person has PowerPoint. Teachers, conference organisers, clients and printers routinely ask for a PDF instead, because every slide becomes a fixed page that cannot shift fonts, reorder animations or break on a different version of Office. This converter takes a .ppt or .pptx deck and produces a PDF with one page per slide, keeping your layouts, images and charts where you put them.",
            "Rendering a presentation faithfully takes a real office engine, which is more than a browser tab can do by itself. So this tool converts on our server rather than on your device, and it is labelled that way above the upload box. What that means for your file is explained in the next section and repeated in the FAQ — the short version is: uploaded, converted in memory, returned, not stored.",
        ],
    },
    {
        heading: "How your presentation is handled during conversion",
        paragraphs: [
            "Your deck is sent over HTTPS to our conversion endpoint, which forwards it in memory to a LibreOffice-based conversion service (Gotenberg). The route never writes the file to disk or to a database; it exists only while the conversion runs, the finished PDF is streamed back to your browser, and no copy of the presentation or the PDF is retained afterwards. The server accepts presentations up to 50 MB and limits conversions to 5 requests per minute per IP address.",
            "Because the file does leave your device, do not use this tool for decks you are not allowed to upload anywhere — unreleased product plans under NDA are the classic example. For coursework, talks, sales decks and handouts, the handling described above applies exactly as written.",
        ],
    },
];

const HOW_TO = [
    "Click the upload area or drag your .ppt or .pptx presentation onto it. Files up to 50 MB are accepted.",
    "Confirm the file name and size match the deck you want to convert.",
    "Start the conversion. The presentation is uploaded to the conversion server, rendered slide by slide, and the PDF download begins automatically.",
    "Open the PDF and flip through a few slides — especially dense ones with charts or small text — to check everything rendered as expected.",
    "Share or print the PDF, or convert another deck with the same steps.",
];

const USE_CASES = [
    "Emailing slides to attendees after a talk, in a format that opens on any device without PowerPoint.",
    "Submitting coursework or a thesis defence deck through a portal that only accepts PDF.",
    "Sending a sales or pitch deck to a client whose Office version might otherwise reflow your layouts.",
    "Printing handouts: one slide per page, exactly as designed.",
    "Archiving a finished presentation alongside its PDF so it stays readable even without Office.",
];

const FAQS = [
    {
        question: "Is my presentation uploaded to a server?",
        answer: "Yes. Converting PowerPoint files faithfully requires an office rendering engine, so your deck is uploaded over HTTPS and forwarded in memory to a LibreOffice-based conversion service (Gotenberg). The file is not written to disk or stored in a database, and nothing is kept after the PDF has been returned to you.",
    },
    {
        question: "How long are uploaded files kept?",
        answer: "They are not kept. The presentation exists in server memory only for the duration of the conversion request. Once the PDF response has been sent, there is no stored copy of your deck or of the PDF.",
    },
    {
        question: "What is the maximum presentation size?",
        answer: "The server accepts .ppt and .pptx files up to 50 MB. Decks with embedded video are usually much larger and are not a good fit — remove or link the video first if your file exceeds the limit.",
    },
    {
        question: "What happens to animations and speaker notes?",
        answer: "The PDF contains one static page per slide, so animations, transitions and videos do not play in the output — the final state of each slide is what gets rendered. If a build animation reveals content step by step, consider duplicating the slide per step before converting.",
    },
    {
        question: "Will my fonts and layouts survive the conversion?",
        answer: "The LibreOffice engine reproduces standard layouts, images and charts well. Decks built with uncommon fonts may substitute a similar font, which can shift text slightly. A quick flip through the PDF before sharing it is always worthwhile.",
    },
    {
        question: "Is there a cost or an account requirement?",
        answer: "No. The converter is free and works without sign-up. Conversions are rate-limited to 5 per minute per IP address so the shared service stays available.",
    },
];

export default function PptToPdfPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/ppt-to-pdf", label: "PPT to PDF" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">PowerPoint to PDF Converter</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Convert .ppt and .pptx presentations to PDF, one page per slide. Files are converted on our server and are not stored.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <PptToPdfClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="ppt-to-pdf" />
            </div>
            <Footer />
        </div>
    );
}
