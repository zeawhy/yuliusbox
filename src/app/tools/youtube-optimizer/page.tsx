
import { Metadata } from 'next';
import YouTubeOptimizer from './YouTubeClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Free YouTube Title Generator & SEO Optimizer (AI Powered) | YuliusBox",
    description: "Generate viral, high-CTR video titles and SEO tags for YouTube using AI. Improve your views and ranking instantly.",
    keywords: ["youtube title generator", "video tag finder", "clickbait title maker", "youtube seo tool"],
    alternates: {
        canonical: "/tools/youtube-optimizer",
    },
    openGraph: {
        url: "/tools/youtube-optimizer",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "YouTube Title Optimizer",
    "url": "https://www.yuliusbox.com/tools/youtube-optimizer",
    "description": "Generate viral, high-CTR video titles and SEO tags for YouTube using AI.",
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
            <YouTubeOptimizer />
        </div>
    );
}
