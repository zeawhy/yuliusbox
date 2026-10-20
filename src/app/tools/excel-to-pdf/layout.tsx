import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Excel to PDF Converter - Secure Cloud Processing | YuliusBox",
    description: "Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF securely in the cloud. No files are stored permanently. Fast, free, and precise formatting retention.",
    keywords: ["excel to pdf", "xlsx to pdf", "csv to pdf", "convert spreadsheet to pdf online", "free pdf converter privacy"],
    alternates: {
        canonical: "/tools/excel-to-pdf",
    },
    openGraph: {
        url: "/tools/excel-to-pdf",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-excel-to-pdf.png",
                width: 1200,
                height: 630,
                alt: "Excel to PDF Converter Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Excel to PDF Converter",
    "url": "https://www.yuliusbox.com/tools/excel-to-pdf",
    "description": "Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format securely in the cloud. Fast, free, and precise formatting retention.",
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
