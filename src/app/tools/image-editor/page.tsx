import { Metadata } from "next";
import ImageEditor from "@/components/tools/ImageEditor";

export const metadata: Metadata = {
    title: "AI Online Image Resizer & Cropper - Edit Photos Instantly",
    description: "Resize, crop, and convert images (JPG, PNG, WebP) online. Fast, private, and free. No uploads to servers.",
    keywords: ["image resizer", "image cropper", "edit photo online", "convert jpg to webp", "resize png", "crop image"],
};

export default function ImageEditorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Online Image Resizer & Cropper",
        "description": "Resize and crop images directly in your browser.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ImageEditor />
        </div>
    );
}
