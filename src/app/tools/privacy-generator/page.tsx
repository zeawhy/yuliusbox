import { Metadata } from "next";
import PrivacyPolicyGenerator from "@/components/tools/PrivacyPolicyGenerator";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Free Privacy Policy Generator for Apps & Websites (No Sign-up)",
    description: "Generate standard Privacy Policy and Terms of Service for your iOS/Android app or website instantly. GDPR compliant templates. 100% Free.",
    keywords: ["privacy policy generator", "terms of service generator", "app privacy policy", "gdpr privacy policy template", "free legal document generator"],
};

export default function PrivacyGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free Privacy Policy Generator",
        "description": "Generate standard Privacy Policy and Terms of Service for your iOS/Android app or website instantly.",
        "applicationCategory": "DeveloperApplication",
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

            <PrivacyPolicyGenerator />
        </div>
    );
}
