
import { Metadata } from 'next';
import ColorPaletteGenerator from './ColorPaletteClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Color Palette Generator from Any Image | YuliusBox",
    description: "Extract the dominant colors from any image and get HEX, RGB, and Tailwind CSS codes instantly. Free, private, and in-browser — your image is never uploaded.",
    keywords: ["image to hex", "color palette generator", "extract colors from image", "online color picker"],
    alternates: {
        canonical: "/tools/color-palette",
    },
    openGraph: {
        url: "/tools/color-palette",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-color-palette.png",
                width: 1200,
                height: 630,
                alt: "Color Palette Generator from Any Image",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Color Palette Generator",
    "url": "https://www.yuliusbox.com/tools/color-palette",
    "description": "Upload any image to extract the dominant color palette. Get HEX, RGB, and Tailwind CSS codes instantly.",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    return (
        <div className="relative w-full pt-12">
            <PrivacyBadge mode="local" className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColorPaletteGenerator />
        </div>
    );
}
