
import { Metadata } from 'next';
import EmailParaphraserPage from './EmailParaphraserClient';

export const metadata: Metadata = {
    title: "AI Email Rewriter & Politeness Checker | YuliusBox",
    description: "Rewrite your emails to be professional, polite, and persuasive. AI-powered email assistant for better business communication.",
    keywords: ["email rewriter", "polite email generator", "professional email paraphraser", "ai email tool"],
    alternates: {
        canonical: "/tools/email-paraphraser",
    },
    openGraph: {
        url: "/tools/email-paraphraser",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Polite Email Paraphraser",
    "url": "https://www.yuliusbox.com/tools/email-paraphraser",
    "description": "Rewrite your emails to be professional, polite, and persuasive using AI.",
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
            <EmailParaphraserPage />
        </>
    );
}
