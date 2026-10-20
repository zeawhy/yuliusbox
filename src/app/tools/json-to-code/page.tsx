
import { Metadata } from "next";
import JsonConverterClient from "./JsonConverterClient";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "JSON to Code Converter - TypeScript, Go, Dart | YuliusBox",
    description: "Convert JSON into TypeScript interfaces, Go structs, or Dart classes instantly. A local, secure, and fast developer tool that runs entirely in your browser.",
    keywords: ["json to typescript", "json to go struct", "json to dart class", "json converter", "developer tools"],
    alternates: {
        canonical: "/tools/json-to-code",
    },
    openGraph: {
        url: "/tools/json-to-code",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-json-to-code.png",
                width: 1200,
                height: 630,
                alt: "JSON to Code Converter - TypeScript, Go, Dart",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JSON to Code Converter",
    "url": "https://www.yuliusbox.com/tools/json-to-code",
    "description": "Convert JSON to TypeScript, Go, or Dart models instantly.",
    "applicationCategory": "DeveloperApplication",
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
            <JsonConverterClient />
        </div>
    );
}
