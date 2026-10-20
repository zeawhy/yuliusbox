
import { Metadata } from 'next';
import ColorPaletteGenerator from './ColorPaletteClient';
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Online Image Color Picker & Palette Generator | Export to CSS/Tailwind",
    description: "Upload any image to extract the dominant color palette. Get HEX, RGB, and Tailwind CSS codes instantly. Free and private.",
    keywords: ["image to hex", "color palette generator", "extract colors from image", "online color picker"],
    alternates: {
        canonical: "/tools/color-palette",
    },
    openGraph: {
        url: "/tools/color-palette",
        siteName: "YuliusBox",
        type: "website",
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
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-wrap justify-end px-4 pt-4 sm:px-8 sm:pt-8"><PrivacyBadge mode="local" /></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColorPaletteGenerator />
        </div>
    );
}
