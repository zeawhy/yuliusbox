
import { Metadata } from 'next';
import RegexGeneratorPage from './RegexGeneratorClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "AI Regex Generator & Explainer | YuliusBox",
    description: "Generate regular expressions from plain English or explain complex regex patterns instantly. Free AI-powered regex tool.",
    keywords: ["regex generator", "regular expression explainer", "ai regex tool", "regex cheat sheet"],
    alternates: {
        canonical: "/tools/regex-generator",
    },
    openGraph: {
        url: "/tools/regex-generator",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Regex Generator & Explainer",
    "url": "https://www.yuliusbox.com/tools/regex-generator",
    "description": "Generate regular expressions from plain English or explain complex regex patterns instantly.",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-wrap justify-end px-4 pt-4 sm:px-8 sm:pt-8"><PrivacyBadge mode="api" /></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RegexGeneratorPage />
        </div>
    );
}
