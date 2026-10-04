import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Remove EXIF Data from Photos — Free Online Metadata Cleaner | YuliusBox",
    description:
        "See hidden EXIF metadata in your photos (camera, GPS, timestamps) and wipe it clean with one click. Free, unlimited, 100% in-browser — nothing uploaded.",
    keywords: [
        "remove exif data",
        "exif remover online",
        "delete photo metadata",
        "remove gps from photo",
        "exif viewer online",
        "clean image metadata",
    ],
    alternates: {
        canonical: "/tools/exif-remover",
    },
    openGraph: {
        url: "/tools/exif-remover",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "EXIF Remover — Photo Metadata Cleaner",
    url: "https://www.yuliusbox.com/tools/exif-remover",
    description:
        "View hidden EXIF/IPTC/XMP metadata in photos and remove it with one click. Free, unlimited, processed entirely in the browser.",
    applicationCategory: "Utility",
    operatingSystem: "Any",
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
