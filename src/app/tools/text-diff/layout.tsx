import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Text Diff — Compare Text Online Free, Line & Char Highlight | YuliusBox",
    description:
        "Compare two texts side by side online. Fast line-level diff with character-level intra-line highlights using the Myers algorithm. 100% private in-browser diff.",
    keywords: [
        "text diff",
        "diff",
        "compare text",
        "diff checker",
        "text compare",
        "file diff",
        "diff online",
        "line diff",
        "character diff",
        "online diff tool",
    ],
    alternates: {
        canonical: "/tools/text-diff",
    },
    openGraph: {
        url: "/tools/text-diff",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-text-diff.png",
                width: 1200,
                height: 630,
                alt: "Text Diff — Compare Text Online Free, Line & Char Highlight",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Text Diff — Line & Character Text Comparison",
    url: "https://www.yuliusbox.com/tools/text-diff",
    description:
        "Compare two texts side by side: line-level diff with character-level highlights, fully local.",
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
