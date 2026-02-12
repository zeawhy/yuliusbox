import { Metadata } from "next";
import BackgroundRemover from "@/components/tools/BackgroundRemover";

export const metadata: Metadata = {
    title: "Free AI Online Background Remover - 100% Private (No Uploads)",
    description: "Remove the background from any image instantly using AI. Local browser-based processing ensures absolute privacy. 100% Free and no sign-up required.",
    keywords: ["background remover", "remove bg", "ai background removal", "remove photo background", "transparent background generator", "free ai tool"],
};

export default function BackgroundRemoverPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Online Background Remover",
        "description": "Automatically remove image backgrounds in the browser using AI.",
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

            <BackgroundRemover />
        </div>
    );
}
