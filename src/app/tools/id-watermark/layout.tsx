
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add Watermark to ID Card - Protect Your Identity | YuliusBox",
    description: "Safely add watermarks to ID cards, passports, and driver licenses locally. Prevent identity theft and unauthorized use.",
    keywords: ["id card watermark", "protect id photo", "add watermark online", "身份证加水印"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ID Card Watermark Tool",
    "url": "https://www.yuliusbox.com/tools/id-watermark",
    "description": "Safely add watermarks to ID cards, passports, and driver licenses locally to prevent unauthorized use.",
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
