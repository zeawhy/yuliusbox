import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Grid Splitter - Slice Images into Grids (3x3, 4x4) | YuliusBox",
    description: "Split a single image into a grid of smaller pieces instantly. Perfect for Instagram grids (3x3, 3x1). 100% free, private browser-based processing.",
    keywords: ["image grid splitter", "split picture into grid", "instagram grid maker", "slice image online", "local photo splitter"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Grid Splitter",
    "url": "https://www.yuliusbox.com/tools/image-grid-splitter",
    "description": "Split a single image into a grid of smaller pieces instantly. 100% free, private browser-based processing.",
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
