
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Video to GIF Converter — Free, No Watermark | YuliusBox",
    description: "Convert MP4 and MOV clips to animated GIFs instantly with FFmpeg WASM in your browser. No watermark, no upload, no sign-up — your video never leaves your PC.",
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

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
