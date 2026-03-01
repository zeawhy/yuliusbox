import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Grid Joiner - Combine Multiple Images into a Seamless Grid | YuliusBox",
    description: "Combine multiple images into a single grid picture instantly. 100% free, private browser-based processing. Drag and drop to reorder images seamlessly.",
    keywords: ["image grid maker", "combine pictures into grid", "stitch images online", "photo grid generator", "local image processing"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Grid Joiner",
    "url": "https://www.yuliusbox.com/tools/image-grid-joiner",
    "description": "Combine multiple images into a single grid picture instantly. 100% free, private browser-based processing.",
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
