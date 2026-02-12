
import { Metadata } from "next";
import CronGeneratorClient from "./CronGeneratorClient";

export const metadata: Metadata = {
    title: "AI Cron Expression Generator - Natural Language to Cron | YuliusBox",
    description: "Convert natural language descriptions into valid Cron expressions instantly. AI-powered cron job maker with clear explanations.",
    keywords: ["cron generator", "cron expression maker", "ai-cron", "crontab generator", "natural language to cron"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Cron Expression Generator",
    "url": "https://www.yuliusbox.com/tools/cron-generator",
    "description": "Convert natural language descriptions into valid Cron expressions instantly.",
    "applicationCategory": "DeveloperApplication",
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
            <CronGeneratorClient />
        </>
    );
}
