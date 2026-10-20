import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Screenshot Blur — Hide Sensitive Info Free | YuliusBox",
    description:
        "Blur, pixelate, or cover sensitive areas in screenshots before sharing. Free, unlimited, 100% in-browser — your screenshots are never uploaded to any server.",
    keywords: [
        "screenshot blur",
        "blur image online",
        "pixelate image",
        "mosaic image",
        "censor screenshot",
        "blur sensitive info",
        "anonymize photo",
        "打码",
    ],
    alternates: {
        canonical: "/tools/screenshot-blur",
    },
    openGraph: {
        url: "/tools/screenshot-blur",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-screenshot-blur.png",
                width: 1200,
                height: 630,
                alt: "Screenshot Blur — Pixelate & Blur Sensitive Info Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Screenshot Blur — Pixelate & Blur Sensitive Info Online Free",
    url: "https://www.yuliusbox.com/tools/screenshot-blur",
    description:
        "Blur, pixelate, or cover sensitive areas in screenshots in your browser. 100% local, nothing uploaded.",
    applicationCategory: "MultimediaApplication",
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
