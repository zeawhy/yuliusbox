import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "URL to PDF Converter - High Quality Render | YuliusBox",
    description: "Convert any public website or URL into a high-quality PDF document. Powered by Chromium for accurate CSS and JavaScript rendering. Free and secure.",
    keywords: ["url to pdf", "website to pdf", "webpage to pdf converter", "save website as pdf", "html to pdf url"],
    alternates: {
        canonical: "/tools/url-to-pdf",
    },
    openGraph: {
        url: "/tools/url-to-pdf",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-url-to-pdf.png",
                width: 1200,
                height: 630,
                alt: "Website URL to PDF Converter",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "URL to PDF Converter",
    "url": "https://www.yuliusbox.com/tools/url-to-pdf",
    "description": "Convert any public website or URL into a high-quality PDF document.",
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
