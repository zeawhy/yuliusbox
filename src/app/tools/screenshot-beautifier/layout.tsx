
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Screenshot Beautifier - Create Stunning Mockups | YuliusBox",
    description: "Transform boring screenshots into beautiful product showcases. Add 3D tilts, shadows, backgrounds, and social media mockups instantly.",
    keywords: ["screenshot mockup", "product showcase", "beautify screenshot", "social media image maker", "3d screenshot generator"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Screenshot Beautifier",
    "url": "https://www.yuliusbox.com/tools/screenshot-beautifier",
    "description": "Transform boring screenshots into beautiful product showcases with 3D tilts, shadows, and backgrounds.",
    "applicationCategory": "DesignApplication",
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
