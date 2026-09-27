import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Social Media Video Downloader - No Watermark | YuliusBox",
    description: "Download videos from YouTube, TikTok, Instagram, Twitter, and more without watermarks. Free, private, browser-based processing.",
    keywords: ["video downloader", "tiktok downloader no watermark", "youtube video download", "instagram reels downloader"],
    alternates: {
        canonical: "/tools/video-downloader",
    },
    openGraph: {
        url: "/tools/video-downloader",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Social Media Video Downloader",
    "url": "https://www.yuliusbox.com/tools/video-downloader",
    "description": "Download videos from YouTube, TikTok, Instagram, Twitter, and more without watermarks.",
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
