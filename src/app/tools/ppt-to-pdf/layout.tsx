import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PowerPoint to PDF Converter - Secure Cloud | YuliusBox",
    description: "Convert PowerPoint presentations (.pptx, .ppt) to PDF securely in the cloud. No files are stored permanently. Fast, free, and precise formatting retention.",
    keywords: ["ppt to pdf", "pptx to pdf", "powerpoint to pdf", "convert ppt to pdf online", "free pdf converter privacy"],
    alternates: {
        canonical: "/tools/ppt-to-pdf",
    },
    openGraph: {
        url: "/tools/ppt-to-pdf",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-ppt-to-pdf.png",
                width: 1200,
                height: 630,
                alt: "PowerPoint to PDF Converter Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PowerPoint to PDF Converter",
    "url": "https://www.yuliusbox.com/tools/ppt-to-pdf",
    "description": "Convert PowerPoint presentations (.pptx, .ppt) to PDF format securely in the cloud. Fast, free, and precise formatting retention.",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
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
