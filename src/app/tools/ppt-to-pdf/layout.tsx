import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PowerPoint to PDF Converter - Secure Cloud Processing | YuliusBox",
    description: "Convert PowerPoint presentations (.pptx, .ppt) to PDF format securely in the cloud. No files are stored permanently. Fast, free, and precise formatting retention.",
    keywords: ["ppt to pdf", "pptx to pdf", "powerpoint to pdf", "convert ppt to pdf online", "free pdf converter privacy"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PowerPoint to PDF Converter",
    "url": "https://www.yuliusbox.com/tools/ppt-to-pdf",
    "description": "Convert PowerPoint presentations (.pptx, .ppt) to PDF format securely in the cloud. Fast, free, and precise formatting retention.",
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
