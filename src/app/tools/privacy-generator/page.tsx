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
        <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-24 max-w-7xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header Section */}
            <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6 shadow-xl">
                        <Shield className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Privacy & Terms <span className="text-zinc-500 font-medium">Generator</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        Create standard, professional legal documents for your indie apps or websites in seconds. Completely free and no sign-up required.
                    </p>
                </div>
            </div>

            <PrivacyPolicyGenerator />
        </div>
    );
}
