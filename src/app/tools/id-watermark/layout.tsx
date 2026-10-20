
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watermark Your ID Copy Before Sending | YuliusBox",
    description: "Add a purpose-only watermark to a photo of your ID before you send it for rentals, SIM cards or verification. It runs in your browser — no upload at all.",
    keywords: ["id card watermark", "protect id photo", "add watermark online", "身份证加水印"],
    alternates: {
        canonical: "/tools/id-watermark",
    },
    openGraph: {
        url: "/tools/id-watermark",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-id-watermark.png",
                width: 1200,
                height: 630,
                alt: "Watermark Your ID Copy Before Sending",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ID Card Watermark Tool",
    "url": "https://www.yuliusbox.com/tools/id-watermark",
    "description": "Safely add watermarks to ID cards, passports, and driver licenses locally to deter unauthorized use.",
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
