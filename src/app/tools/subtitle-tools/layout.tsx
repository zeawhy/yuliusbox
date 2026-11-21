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

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
