
import { Metadata } from 'next';
import EmailParaphraserPage from './EmailParaphraserClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

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
    "@type": "SoftwareApplication",
    "name": "Polite Email Paraphraser",
    "url": "https://www.yuliusbox.com/tools/email-paraphraser",
    "description": "Rewrite your emails to be professional, polite, and persuasive using AI.",
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
            <EmailParaphraserPage />
        </div>
    );
}
