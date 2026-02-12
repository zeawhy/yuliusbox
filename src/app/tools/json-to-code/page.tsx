
import { Metadata } from "next";
import JsonConverterClient from "./JsonConverterClient";

export const metadata: Metadata = {
    title: "JSON to Code Converter - TypeScript, Go, Dart | YuliusBox",
    description: "Convert JSON to TypeScript Interfaces, Go Structs, or Dart Classes instantly. Local, secure, and fast developer tool.",
    keywords: ["json to typescript", "json to go struct", "json to dart class", "json converter", "developer tools"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON to Code Converter",
    "url": "https://www.yuliusbox.com/tools/json-to-code",
    "description": "Convert JSON to TypeScript, Go, or Dart models instantly.",
    "applicationCategory": "DeveloperApplication",
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
            <JsonConverterClient />
        </>
    );
}
