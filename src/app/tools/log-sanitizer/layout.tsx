import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log Sanitizer — Redact Secrets from Logs | YuliusBox",
    description:
        "Redact Bearer tokens, cookies, phone numbers, resident IDs, emails, and query secrets from HAR files and logs instantly. Free, unlimited, 100% in-browser.",
    keywords: [
        "har sanitizer",
        "redact har",
        "har file redactor",
        "log redactor",
        "mask secrets",
        "pii redaction",
        "脱敏工具",
        "har 脱敏",
        "日志脱敏",
    ],
    alternates: {
        canonical: "/tools/log-sanitizer",
    },
    openGraph: {
        url: "/tools/log-sanitizer",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-log-sanitizer.png",
                width: 1200,
                height: 630,
                alt: "Log Sanitizer — Redact Secrets from HAR Files & Logs Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Log Sanitizer — Redact Secrets from HAR Files & Logs",
    url: "https://www.yuliusbox.com/tools/log-sanitizer",
    description:
        "Redact Bearer tokens, cookies, phone numbers, IDs, and query secrets from HAR files and logs in your browser. 100% client-side.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
