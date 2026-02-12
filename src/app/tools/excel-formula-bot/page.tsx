
import { Metadata } from 'next';
import ExcelFormulaBotPage from './ExcelBotClient';

export const metadata: Metadata = {
    title: "Free Excel Formula Generator & AI Bot | YuliusBox",
    description: "Describe your problem in plain English, and AI will generate the formula. Supports Microsoft Excel and Google Sheets.",
    keywords: ["excel formula generator", "spreadsheet ai", "google sheets formula maker", "excel bot"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Excel Formula Bot",
    "url": "https://www.yuliusbox.com/tools/excel-formula-bot",
    "description": "Convert plain English to Excel and Google Sheets formulas instantly with AI.",
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ExcelFormulaBotPage />
        </>
    );
}
