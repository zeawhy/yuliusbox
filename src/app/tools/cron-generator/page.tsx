
import { Metadata } from "next";
import CronGeneratorClient from "./CronGeneratorClient";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "AI Cron Expression Generator - Natural Language to Cron | YuliusBox",
    description: "Convert natural language descriptions into valid Cron expressions instantly. AI-powered cron job maker with clear explanations.",
    keywords: ["cron generator", "cron expression maker", "ai-cron", "crontab generator", "natural language to cron"],
    alternates: {
        canonical: "/tools/cron-generator",
    },
    openGraph: {
        url: "/tools/cron-generator",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Cron Expression Generator",
    "url": "https://www.yuliusbox.com/tools/cron-generator",
    "description": "Convert natural language descriptions into valid Cron expressions instantly.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    return (
        <div className="relative w-full">
            <PrivacyBadge mode="api" className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CronGeneratorClient />
        </div>
    );
}
