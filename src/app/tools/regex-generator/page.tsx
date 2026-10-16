
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
        <div className="relative w-full">
            <PrivacyBadge mode="api" className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RegexGeneratorPage />
        </div>
    );
}
