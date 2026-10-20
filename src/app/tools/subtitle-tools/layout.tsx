import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subtitle Tools — SRT/VTT Convert & Burn-In | YuliusBox",
    description: "Convert subtitles between SRT and WebVTT formats, or burn hardcoded subtitles into a video. Free, unlimited, 100% in-browser — your files are never uploaded.",
    keywords: [
        "subtitle",
        "srt",
        "vtt",
        "webvtt",
        "convert subtitle",
        "burn subtitles",
        "hardcode subtitles",
        "subtitle converter",
        "subtitle burn-in",
        "closed captions",
    ],
    alternates: {
        canonical: "/tools/subtitle-tools",
    },
    openGraph: {
        url: "/tools/subtitle-tools",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-subtitle-tools.png",
                width: 1200,
                height: 630,
                alt: "Subtitle Tools — Convert SRT/VTT & Burn Subtitles Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Subtitle Tools — Convert SRT/VTT & Burn Subtitles",
    url: "https://www.yuliusbox.com/tools/subtitle-tools",
    description:
        "Convert subtitle files between SubRip (.srt) and WebVTT (.vtt) and burn hardcoded subtitles into videos in your browser. 100% private and client-side.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
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
