
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Local AI Audio Transcription - Free Speech to Text | YuliusBox",
    description: "Convert audio to text offline using OpenAI Whisper model in your browser. Unlimited free transcription.",
    keywords: ["audio to text", "whisper web", "offline transcription", "speech to text free"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Local AI Audio Transcription",
    "url": "https://www.yuliusbox.com/tools/audio-to-text",
    "description": "Convert audio to text offline using OpenAI Whisper model in your browser. Unlimited free transcription.",
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
