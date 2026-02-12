
import { Metadata } from 'next';
import ColorPaletteGenerator from './ColorPaletteClient';

export const metadata: Metadata = {
    title: "Online Image Color Picker & Palette Generator | Export to CSS/Tailwind",
    description: "Upload any image to extract the dominant color palette. Get HEX, RGB, and Tailwind CSS codes instantly. Free and private.",
    keywords: ["image to hex", "color palette generator", "extract colors from image", "online color picker"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Color Palette Generator",
    "url": "https://www.yuliusbox.com/tools/color-palette",
    "description": "Upload any image to extract the dominant color palette. Get HEX, RGB, and Tailwind CSS codes instantly.",
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColorPaletteGenerator />
        </>
    );
}
