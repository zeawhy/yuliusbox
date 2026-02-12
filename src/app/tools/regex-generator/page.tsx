
import { Metadata } from 'next';
import RegexGeneratorPage from './RegexGeneratorClient';

export const metadata: Metadata = {
    title: "AI Regex Generator & Explainer | YuliusBox",
    description: "Generate regular expressions from plain English or explain complex regex patterns instantly. Free AI-powered regex tool.",
    keywords: ["regex generator", "regular expression explainer", "ai regex tool", "regex cheat sheet"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Regex Generator & Explainer",
    "url": "https://www.yuliusbox.com/tools/regex-generator",
    "description": "Generate regular expressions from plain English or explain complex regex patterns instantly.",
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
            <RegexGeneratorPage />
        </>
    );
}
