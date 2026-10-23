import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image to SVG Converter — PNG & JPG to Vector Free",
    description:
        "Convert PNG, JPG, and WebP images to clean SVG vector graphics right in your browser. Processed in your browser — images are never uploaded.",
    keywords: [
        "image to svg",
        "png to svg",
        "jpg to svg",
        "convert image to svg",
        "free svg converter",
        "vectorizer",
        "svg tracer",
        "vtracer",
        "raster to vector",
        "free image to svg converter online",
    ],
    alternates: {
        canonical: "/tools/image-to-svg",
    },
    openGraph: {
        title: "Image to SVG Converter — PNG & JPG to Vector Free",
        description:
            "Convert PNG, JPG, and WebP images to clean SVG vector graphics right in your browser. Processed in your browser — images are never uploaded.",
        url: "/tools/image-to-svg",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/image-to-svg.png",
                width: 1200,
                height: 630,
                alt: "Free Image to SVG Converter Online",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Image to SVG Converter",
    url: "https://www.yuliusbox.com/tools/image-to-svg",
    description:
        "Convert PNG, JPG, and WebP images to clean SVG vector graphics in your browser using WebAssembly. Processed in your browser — images are never uploaded.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
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
