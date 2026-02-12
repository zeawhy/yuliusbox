
import { Metadata } from 'next';
import SafeZoneOverlay from './SafeZoneClient';

export const metadata: Metadata = {
    title: "Social Media Safe Zone Overlay - TikTok, Reels & Shorts Preview | YuliusBox",
    description: "Check if your subtitles are blocked by UI icons. Free safe zone overlay tool for TikTok, Instagram Reels, and YouTube Shorts. No app download required.",
    keywords: ["tiktok safe zone", "reels overlay preview", "shorts ui template", "video safe area checker"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Social Media Safe Zone Overlay",
    "url": "https://www.yuliusbox.com/tools/safe-zone-overlay",
    "description": "Check if your subtitles are blocked by UI icons. Free safe zone overlay tool for TikTok, Instagram Reels, and YouTube Shorts.",
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
            <SafeZoneOverlay />
        </>
    );
}
