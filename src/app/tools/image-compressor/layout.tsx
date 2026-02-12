
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bulk Image Compressor - Compress JPG/PNG to 80% Smaller | YuliusBox",
    description: "Free unlimited bulk image compression. Reduce file size locally in your browser without losing quality. No upload limits.",
    keywords: ["compress image", "reduce jpg size", "image optimizer online", "privacy first compressor"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bulk Image Compressor",
    "url": "https://www.yuliusbox.com/tools/image-compressor",
    "description": "Free unlimited bulk image compression. Reduce file size locally in your browser without losing quality.",
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
