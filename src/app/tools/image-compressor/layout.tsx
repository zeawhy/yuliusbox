
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bulk Image Compressor - Compress JPG/PNG to 80% Smaller | YuliusBox",
    description: "Free unlimited bulk image compression. Reduce file size locally in your browser without losing quality. No upload limits.",
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
