import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Word to PDF Converter - Secure Cloud Processing | YuliusBox",
    description: "Convert Word documents (.doc, .docx) to PDF format securely in the cloud. No files are stored permanently. Fast, free, and precise formatting retention.",
    keywords: ["word to pdf", "doc to pdf", "docx to pdf", "convert document to pdf online", "free pdf converter privacy"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Word to PDF Converter",
    "url": "https://www.yuliusbox.com/tools/word-to-pdf",
    "description": "Convert Word documents (.doc, .docx) to PDF format securely in the cloud. Fast, free, and precise formatting retention.",
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
