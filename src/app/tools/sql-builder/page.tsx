
import { Metadata } from "next";
import SqlBuilderClient from "./SqlBuilderClient";

export const metadata: Metadata = {
    title: "AI SQL Query Builder - Natural Language to SQL | YuliusBox",
    description: "Generate MySQL, PostgreSQL, and SQLite queries instantly using AI. Convert natural language into optimized SQL code.",
    keywords: ["sql builder", "natural language to sql", "ai sql generator", "mysql query maker", "postgresql query generator"],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI SQL Query Builder",
    "url": "https://www.yuliusbox.com/tools/sql-builder",
    "description": "Generate optimized SQL queries from natural language for MySQL, PostgreSQL, and SQLite.",
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
            <SqlBuilderClient />
        </>
    );
}
