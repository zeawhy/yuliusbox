import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SVG Optimizer — Compress & Minify SVG Free | YuliusBox",
    description:
        "Shrink SVG files instantly in your browser. Remove editor bloat, comments, and hidden layers, round decimal precision, and preview before/after. 100% private.",
    keywords: [
        "svg",
        "optimize svg",
        "compress svg",
        "minify svg",
        "svg minifier",
        "remove svg bloat",
        "svg cleaner",
        "inkscape",
        "svg optimizer online",
    ],
    alternates: {
        canonical: "/tools/svg-optimizer",
    },
    openGraph: {
        url: "/tools/svg-optimizer",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-svg-optimizer.png",
                width: 1200,
                height: 630,
                alt: "SVG Optimizer — Compress & Minify SVG Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SVG Optimizer — Compress & Minify SVG Online",
    url: "https://www.yuliusbox.com/tools/svg-optimizer",
    description:
        "Shrink SVG files: remove editor bloat, comments, hidden elements, round precision with live before/after preview.",
    applicationCategory: "DeveloperApplication",
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
