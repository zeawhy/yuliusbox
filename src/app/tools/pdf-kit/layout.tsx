
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free PDF Merger & Splitter - 100% Offline | YuliusBox",
    description: "Merge, split, and organize PDF files directly in your browser. Secure local processing for your sensitive documents.",
    keywords: ["merge pdf", "combine pdf files", "split pdf pages", "offline pdf tool"],
    alternates: {
        canonical: "/tools/pdf-kit",
    },
    openGraph: {
        url: "/tools/pdf-kit",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-pdf-kit.png",
                width: 1200,
                height: 630,
                alt: "Free PDF Merger & Splitter - 100% Offline",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Kit",
    "url": "https://www.yuliusbox.com/tools/pdf-kit",
    "description": "Merge, split, and organize PDF files directly in your browser. Secure local processing for your sensitive documents.",
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
