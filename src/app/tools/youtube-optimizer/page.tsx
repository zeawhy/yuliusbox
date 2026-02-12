
import { Metadata } from 'next';
import YouTubeOptimizer from './YouTubeClient';

export const metadata: Metadata = {
    title: "Free YouTube Title Generator & SEO Optimizer (AI Powered) | YuliusBox",
    description: "Generate viral, high-CTR video titles and SEO tags for YouTube using AI. Improve your views and ranking instantly.",
    keywords: ["youtube title generator", "video tag finder", "clickbait title maker", "youtube seo tool"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "YouTube Title Optimizer",
    "url": "https://www.yuliusbox.com/tools/youtube-optimizer",
    "description": "Generate viral, high-CTR video titles and SEO tags for YouTube using AI.",
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
            <YouTubeOptimizer />
        </>
    );
}
