import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Grid Splitter - Slice Images into Grids | YuliusBox",
    description: "Split a single image into a grid of smaller pieces instantly. Perfect for Instagram grids (3x3, 3x1). 100% free, private browser-based processing.",
    keywords: ["image grid splitter", "split picture into grid", "instagram grid maker", "slice image online", "local photo splitter"],
    alternates: {
        canonical: "/tools/image-grid-splitter",
    },
    openGraph: {
        url: "/tools/image-grid-splitter",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-image-grid-splitter.png",
                width: 1200,
                height: 630,
                alt: "Image Grid Splitter Online Free",
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
