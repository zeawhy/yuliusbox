
import { Metadata } from "next";
import CronGeneratorClient from "./CronGeneratorClient";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Cron Generator — Turn Plain English into Cron | YuliusBox",
    description: "Convert plain-English schedules like 'every weekday at 9am' into valid cron expressions instantly, with a clear explanation of each field. Free, no sign-up.",
    keywords: ["cron generator", "cron expression maker", "ai-cron", "crontab generator", "natural language to cron"],
    alternates: {
        canonical: "/tools/cron-generator",
    },
    openGraph: {
        url: "/tools/cron-generator",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-cron-generator.png",
                width: 1200,
                height: 630,
                alt: "Cron Generator — Turn Plain English into Cron",
            },
        ],
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
        <div className="relative w-full pt-12">
            <PrivacyBadge mode="api" className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CronGeneratorClient />
        </div>
    );
}
