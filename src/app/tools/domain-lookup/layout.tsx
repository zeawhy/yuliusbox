import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Domain WHOIS Lookup & Availability Checker | YuliusBox",
    description:
        "Look up any domain's WHOIS/RDAP data — registrar, creation & expiry dates, name servers — or check availability across .com, .io, .ai and more. Free, no sign-up.",
    keywords: [
        "domain whois lookup",
        "rdap lookup",
        "domain availability checker",
        "check if domain is available",
        "whois checker online",
        "domain expiry checker",
    ],
    alternates: {
        canonical: "/tools/domain-lookup",
    },
    openGraph: {
        url: "/tools/domain-lookup",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-domain-lookup.png",
                width: 1200,
                height: 630,
                alt: "Free Domain WHOIS Lookup & Availability Checker",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Domain Lookup — WHOIS & Availability Checker",
    url: "https://www.yuliusbox.com/tools/domain-lookup",
    description:
        "Free domain WHOIS/RDAP lookup: registrar, creation and expiry dates, name servers, plus bulk availability checks across popular extensions.",
    applicationCategory: "Utility",
    operatingSystem: "Any",
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
