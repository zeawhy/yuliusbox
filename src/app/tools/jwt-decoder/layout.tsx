import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JWT Decoder — Decode & Inspect Tokens Free | YuliusBox",
    description: "Paste a JWT to decode its header, claims, and expiry times instantly. Free, unlimited, 100% in-browser — your token never leaves your device or gets logged.",
    keywords: [
        "jwt decoder",
        "jwt decode online",
        "decode jwt token",
        "jwt parser",
        "jwt claims viewer",
        "json web token decoder",
    ],
    alternates: {
        canonical: "/tools/jwt-decoder",
    },
    openGraph: {
        url: "/tools/jwt-decoder",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-jwt-decoder.png",
                width: 1200,
                height: 630,
                alt: "JWT Decoder \u2014 Decode & Inspect JSON Web Tokens Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JWT Decoder — Decode & Inspect JSON Web Tokens",
    url: "https://www.yuliusbox.com/tools/jwt-decoder",
    description:
        "Decode JWT header, payload claims, and expiry times in the browser. Free, unlimited, nothing uploaded.",
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
