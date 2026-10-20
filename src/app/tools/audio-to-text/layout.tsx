
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Audio to Text — Free Local Transcription | YuliusBox",
    description: "Convert audio to text offline with the OpenAI Whisper model in your browser. Unlimited free transcription for MP3, WAV, and M4A — nothing is ever uploaded.",
    keywords: ["audio to text", "whisper web", "offline transcription", "speech to text free"],
    alternates: {
        canonical: "/tools/audio-to-text",
    },
    openGraph: {
        url: "/tools/audio-to-text",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-audio-to-text.png",
                width: 1200,
                height: 630,
                alt: "Local AI Audio Transcription - Free Speech to Text",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Local AI Audio Transcription",
    "url": "https://www.yuliusbox.com/tools/audio-to-text",
    "description": "Convert audio to text offline using OpenAI Whisper model in your browser. Unlimited free transcription.",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
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
