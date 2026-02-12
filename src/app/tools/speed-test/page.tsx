import { Metadata } from "next";
import SpeedTest from "@/components/tools/SpeedTest";

export const metadata: Metadata = {
    title: "Free Online Internet Speed Test - Check Your Connection Speed",
    description: "Fast and accurate internet speed test. Measure your ping, download, and upload speeds in seconds. 100% free and private.",
    keywords: ["speed test", "internet speed test", "check internet speed", "ping test", "download speed", "upload speed"],
};

export default function SpeedTestPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Online Internet Speed Test",
        "description": "Measure your internet speed including download, upload, and latency.",
        "applicationCategory": "UtilityApplication",
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

            <SpeedTest />
        </div>
    );
}
