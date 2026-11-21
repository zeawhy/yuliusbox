import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Remove EXIF Data from Photos — Free Online | YuliusBox",
    description:
        "Removes EXIF, GPS, IPTC and XMP metadata from the downloaded copy. View hidden photo metadata first, then clean it in your browser — nothing is uploaded.",
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
        images: [
            {
                url: "/og/tools-exif-remover.png",
                width: 1200,
                height: 630,
                alt: "Remove EXIF Data from Photos \u2014 Free Online Metadata Cleaner",
            },
        ],
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
