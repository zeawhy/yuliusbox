import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Video to GIF Converter - No Watermark & High Quality | YuliusBox",
    description: "Convert MP4/MOV to animated GIF instantly. Powered by FFmpeg WASM for browser-based processing.",
    keywords: ["mp4 to gif", "video to gif high quality", "ffmpeg wasm", "make gif from video"],
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
