
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Compressor — Compress JPG & PNG Free | YuliusBox",
    description: "Compress unlimited JPG, PNG, and WebP images in bulk, right in your browser. Shrink file size with no visible quality loss, no upload limits, and no fees.",
    keywords: ["compress image", "reduce jpg size", "image optimizer online", "privacy first compressor"],
    alternates: {
        canonical: "/tools/image-compressor",
    },
    openGraph: {
        url: "/tools/image-compressor",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-image-compressor.png",
                width: 1200,
                height: 630,
                alt: "Bulk Image Compressor - Compress JPG/PNG to 80% Smaller",
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
