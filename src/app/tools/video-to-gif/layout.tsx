
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Video to GIF Converter - No Watermark & High Quality | YuliusBox",
    description: "Convert MP4/MOV to animated GIF instantly. Powered by FFmpeg WASM for browser-based processing.",
    keywords: ["mp4 to gif", "video to gif high quality", "ffmpeg wasm", "make gif from video"],
    alternates: {
        canonical: "/tools/video-to-gif",
    },
    openGraph: {
        url: "/tools/video-to-gif",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-video-to-gif.png",
                width: 1200,
                height: 630,
                alt: "Video to GIF Converter - No Watermark & High Quality",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Video to GIF Converter",
    "url": "https://www.yuliusbox.com/tools/video-to-gif",
    "description": "Convert MP4/MOV to animated GIF instantly. Powered by FFmpeg WASM for browser-based processing.",
    "applicationCategory": "MultimediaApplication",
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
