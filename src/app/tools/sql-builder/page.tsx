
import { Metadata } from "next";
import SqlBuilderClient from "./SqlBuilderClient";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export const metadata: Metadata = {
    title: "AI SQL Query Builder - Natural Language to SQL | YuliusBox",
    description: "Generate MySQL, PostgreSQL, and SQLite queries instantly using AI. Convert natural language into optimized SQL code.",
    keywords: ["sql builder", "natural language to sql", "ai sql generator", "mysql query maker", "postgresql query generator"],
    alternates: {
        canonical: "/tools/sql-builder",
    },
    openGraph: {
        url: "/tools/sql-builder",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI SQL Query Builder",
    "url": "https://www.yuliusbox.com/tools/sql-builder",
    "description": "Generate optimized SQL queries from natural language for MySQL, PostgreSQL, and SQLite.",
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
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-wrap justify-end px-4 pt-4 sm:px-8 sm:pt-8"><PrivacyBadge mode="api" /></div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SqlBuilderClient />
        </div>
    );
}
