
import { Metadata } from 'next';
import SafeZoneOverlay from './SafeZoneClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Safe Zone Overlay — TikTok, Reels & Shorts | YuliusBox",
    description: "Check if your subtitles are blocked by UI icons. Free safe zone overlay tool for TikTok, Instagram Reels, and YouTube Shorts. No app download required.",
    keywords: ["tiktok safe zone", "reels overlay preview", "shorts ui template", "video safe area checker"],
    alternates: {
        canonical: "/tools/safe-zone-overlay",
    },
    openGraph: {
        url: "/tools/safe-zone-overlay",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-safe-zone-overlay.png",
                width: 1200,
                height: 630,
                alt: "Safe Zone Overlay — TikTok, Reels & Shorts",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Social Media Safe Zone Overlay",
    "url": "https://www.yuliusbox.com/tools/safe-zone-overlay",
    "description": "Check if your subtitles are blocked by UI icons. Free safe zone overlay tool for TikTok, Instagram Reels, and YouTube Shorts.",
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
            <div className="flex flex-wrap justify-end px-4 pt-4 sm:px-8 sm:pt-8"><PrivacyBadge mode="local" /></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SafeZoneOverlay />
        </div>
    );
}
