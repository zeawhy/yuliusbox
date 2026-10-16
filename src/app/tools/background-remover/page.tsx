import { Metadata } from "next";
import BackgroundRemoverWrapper from "@/components/tools/BackgroundRemoverWrapper";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "Free AI Online Background Remover - 100% Private (No Uploads)",
    description: "Remove the background from any image instantly using AI. Local browser-based processing ensures absolute privacy. 100% Free and no sign-up required.",
    keywords: ["background remover", "remove bg", "ai background removal", "remove photo background", "transparent background generator", "free ai tool"],
    alternates: {
        canonical: "/tools/background-remover",
    },
    openGraph: {
        url: "/tools/background-remover",
        siteName: "YuliusBox",
        type: "website",
    },
};

export default function BackgroundRemoverPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Online Background Remover",
        "description": "Automatically remove image backgrounds in the browser using AI.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
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

            <div className="relative w-full">
                <PrivacyBadge mode="local" toolId="background-remover" className="absolute top-3 right-3 z-10" />
                <BackgroundRemoverWrapper />
            </div>
        </div>
    );
}
