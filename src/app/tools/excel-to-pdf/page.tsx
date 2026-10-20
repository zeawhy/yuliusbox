import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import ExcelToPdfClient from "./ExcelToPdfClient";

const SECTIONS = [
    {
        heading: "Share spreadsheets as fixed, printable PDFs",
        paragraphs: [
            "A spreadsheet is a working document: columns resize, formulas recalculate and filters hide rows. When you send one to a client, an accountant or a manager, you usually want the opposite — a fixed snapshot that prints the same way everywhere and cannot be edited by accident. This converter turns .xlsx, .xls and .csv files into a PDF that preserves your rows, columns, number formats and charts as they appear in the workbook.",
            "Producing that snapshot needs a real spreadsheet engine, so — unlike the local tools elsewhere on this site — the conversion happens on our server. The badge above the upload box says so, and the next section spells out how the file is treated: uploaded over HTTPS, converted in memory, returned as a PDF, and not stored.",
        ],
    },
    {
        heading: "How your spreadsheet is handled during conversion",
        paragraphs: [
            "The file is sent to our conversion endpoint and forwarded, in memory only, to a LibreOffice-based conversion service (Gotenberg). The API route does not write your spreadsheet to disk or to a database, and no copy of the upload or the resulting PDF is kept after the response completes. The server accepts spreadsheets up to 30 MB and rate-limits conversions to 5 requests per minute per IP address.",
            "If a workbook contains data you are not permitted to upload anywhere — payroll under a strict policy, for instance — use desktop Excel or LibreOffice instead. For invoices, price lists, reports and shared trackers, the in-memory handling described here is the whole story.",
        ],
    },
];

const HOW_TO = [
    "Click the upload area or drag your .xlsx, .xls or .csv file onto it. Files up to 30 MB are accepted.",
    "Check the file name and size shown before converting.",
    "Start the conversion. The spreadsheet is uploaded to the conversion server, rendered to PDF, and the download begins automatically.",
    "Open the PDF and check wide tables carefully: very wide sheets may span several PDF pages, just as they would when printed from Excel.",
    "Adjust page setup in your spreadsheet (orientation, fit-to-page) and convert again if the printed layout needs it.",
];

const USE_CASES = [
    "Sending an invoice, quotation or price list that the recipient can read and print but not quietly edit.",
    "Sharing a monthly report or budget summary with people who do not use Excel.",
    "Submitting a spreadsheet-based form or data table through a portal that requires PDF.",
    "Printing a table for a meeting without worrying that the office printer has a different Excel version.",
    "Freezing a tracker or roster at a point in time for records, while the workbook keeps evolving.",
];

const FAQS = [
    {
        question: "Is my spreadsheet uploaded to a server?",
        answer: "Yes. Faithful spreadsheet rendering needs a real office engine, so the file is uploaded over HTTPS and forwarded in memory to a LibreOffice-based conversion service (Gotenberg). It is not written to disk or stored in a database, and no copy is retained once the PDF has been returned.",
    },
    {
        question: "How long is my file kept?",
        answer: "It is not kept. Your spreadsheet exists in server memory only while the conversion request is running. After the PDF is sent back, neither the upload nor the output remains on the server.",
    },
    {
        question: "What is the maximum file size?",
        answer: "Spreadsheets up to 30 MB are accepted. Most workbooks are far smaller; files grow large mainly through embedded images, which you can compress in Excel before converting if needed.",
    },
    {
        question: "Will formulas show their values in the PDF?",
        answer: "Yes. The PDF shows the calculated values as they appear when the workbook is opened, not the formulas themselves. Make sure the workbook has been saved after its last calculation so the values are current.",
    },
    {
        question: "My table is very wide. How will it paginate?",
        answer: "The converter follows the workbook's own print settings. If page setup is left on defaults, a wide sheet flows across multiple pages. Setting landscape orientation or \u201CFit Sheet on One Page\u201D in Excel before converting gives a single-page-wide result.",
    },
    {
        question: "Is the converter free?",
        answer: "Yes, it is free and needs no account. Conversions are rate-limited to 5 per minute per IP address to keep the shared service responsive.",
    },
];

export default function ExcelToPdfPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/excel-to-pdf", label: "Excel to PDF" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Excel to PDF Converter</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Convert .xlsx, .xls and .csv spreadsheets to PDF with rows, columns and charts kept in place. Files are converted on our server and are not stored.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <ExcelToPdfClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="excel-to-pdf" />
            </div>
            <Footer />
        </div>
    );
}
