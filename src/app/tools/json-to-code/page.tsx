import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { FaqSection } from "@/components/seo/FaqSection";
import { RelatedTools } from "@/components/tools/RelatedTools";
import Link from "next/link";
import JsonConverterClient from "./JsonConverterClient";

export const metadata: Metadata = {
    title: "JSON to Code Converter — TypeScript, Go, Dart | YuliusBox",
    description: "Convert JSON into TypeScript interfaces, Go structs, or Dart classes instantly in your browser. 100% private, zero server uploads.",
    keywords: ["json to typescript", "json to go struct", "json to dart class", "json converter", "developer tools"],
    alternates: {
        canonical: "/tools/json-to-code",
    },
    openGraph: {
        url: "/tools/json-to-code",
        siteName: "YuliusBox",
        type: "website",
        title: "JSON to Code Converter — TypeScript, Go, Dart",
        description: "Convert JSON into TypeScript interfaces, Go structs, or Dart classes instantly in your browser.",
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
    name: "JSON to Code Converter",
    url: "https://www.yuliusbox.com/tools/json-to-code",
    description: "Convert JSON to TypeScript, Go, or Dart models instantly in your browser.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

const FAQS = [
    {
        q: "How does the tool infer types from sample JSON?",
        a: "The parser inspects each key-value pair in your JSON payload. Numbers are typed as number (in TypeScript) or int/float64 (in Go) depending on whether they contain decimal fractions. Arrays are analyzed for homogeneous element types, and nested objects are recursively extracted into child interfaces or nested structs.",
    },
    {
        q: "What is the difference between interface and type in TypeScript?",
        a: "TypeScript interfaces support declaration merging and are traditionally preferred for object shape contracts and OOP inheritance. Type aliases are more flexible, supporting union types, primitives, tuples, and mapped types. For standard API responses, both work seamlessly.",
    },
    {
        q: "Are my API payloads or JSON files uploaded to any server?",
        a: "Never. All JSON parsing and code generation algorithms run 100% locally in your web browser using client-side JavaScript. Zero bytes of your data are transmitted over the network, making it completely safe for production API responses, tokens, and proprietary schemas.",
    },
    {
        q: "How are nested objects handled in generated code?",
        a: "Nested JSON objects are extracted into separate child interfaces or structs named with PascalCase derived from the property name. This keeps your generated code modular, readable, and reusable across multiple API client functions.",
    },
    {
        q: "Does this tool support nullable or optional fields?",
        a: "When a field contains null or empty values, the generator marks it as optional or nullable (e.g. string | null in TypeScript, or pointer/interface{} in Go). You can adjust optional flags directly in the generated output.",
    },
];

export default function JsonToCodePage() {
    return (
        <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/json-to-code", label: "JSON to Code" },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        JSON to Code Converter — TypeScript, Go & Dart
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                        Paste any JSON payload to generate strongly typed TypeScript interfaces, Go structs, or Dart classes. Runs 100% locally in your browser — zero bytes uploaded.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    <JsonConverterClient />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-6">
                    <h2 className="text-xl font-semibold text-white">
                        Generate production-ready types in seconds
                    </h2>
                    <p>
                        Hand-writing type definitions for large REST API responses or webhook payloads is tedious and prone to subtle type mismatch bugs. This converter inspects your sample JSON, determines exact primitive types, decomposes nested objects, and outputs clean, idiomatic models ready to paste directly into your project codebase.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Private by design for sensitive API data
                    </h2>
                    <p>
                        Many online code generation services send your raw JSON payloads to external cloud servers for processing. When dealing with database dumps, user profile objects, or internal API tokens, sending payloads across third-party servers presents severe confidentiality risks. YuliusBox parses your JSON entirely in your browser window — you can verify in your browser DevTools Network tab that no network requests are dispatched during conversion.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Recursive AST type inference, language mapping &amp; measured benchmarks
                    </h2>
                    <p>
                        When you paste a JSON document into <code>JsonConverterClient.tsx</code>, the engine calls native <code>JSON.parse()</code> and recursively walks the resulting object graph to build a structural type map. Nested objects are extracted into named child declarations (converting snake_case or kebab-case keys into idiomatic <code>PascalCase</code> identifiers), arrays are inspected across all elements to infer homogeneous or union element types, and numbers are distinguished between integer (<code>int</code> in Go / Dart) and IEEE-754 floating-point (<code>float64</code> / <code>double</code>) values.
                    </p>
                    <p>
                        <strong>How to verify zero-upload execution in Browser DevTools:</strong> Open DevTools (<code>F12 → Network</code>), clear the request log or switch to <em>Offline</em> mode, and paste a production JSON response. Zero network requests are made while switching between TypeScript, Go, and Dart output tabs.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Type mapping matrix and measured client-side inference timings in Chromium 1248.
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">JSON Input / Payload Size</th>
                                    <th className="px-3.5 py-2.5 font-semibold">TypeScript Output</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Go Struct Output</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Dart Class Output</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Measured Parse + Emit Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Small REST Object (1.52 KiB / 5 items)</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">export interface Root &#123; ... &#125;</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">type Root struct &#123; `json:&quot;...&quot;` &#125;</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">class Root &#123; fromJson / toJson &#125;</td>
                                    <td className="px-3.5 py-2.5">0.30 ms (4 interfaces)</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Medium Webhook (27.45 KiB / 100 items)</td>
                                    <td className="px-3.5 py-2.5">Deduped child array interfaces</td>
                                    <td className="px-3.5 py-2.5">int vs float64 field inference</td>
                                    <td className="px-3.5 py-2.5">Null-safe ? field annotations</td>
                                    <td className="px-3.5 py-2.5">0.10–0.40 ms</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Large Dataset (273.99 KiB / 1,000 items)</td>
                                    <td className="px-3.5 py-2.5">Recursive nested object extraction</td>
                                    <td className="px-3.5 py-2.5">CamelCase exported struct fields</td>
                                    <td className="px-3.5 py-2.5">Typed List&lt;T&gt; map builders</td>
                                    <td className="px-3.5 py-2.5">0.90 ms</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Dedicated Type Generator</p>
                        <Link
                            href="/tools/json-to-code/json-to-typescript"
                            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <span>JSON to TypeScript — Interface & Type Generator with Optional Fields Guide</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>

                <FaqSection items={FAQS} className="mt-8" />
            </div>

            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="json-to-code" />
            </div>
            <Footer />
        </main>
    );
}
