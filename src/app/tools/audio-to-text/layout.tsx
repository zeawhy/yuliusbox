import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Local AI Audio Transcription - Free Speech to Text | YuliusBox",
    description: "Convert audio to text offline using OpenAI Whisper model in your browser. Unlimited free transcription.",
    keywords: ["audio to text", "whisper web", "offline transcription", "speech to text free"],
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
