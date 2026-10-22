import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { PdfRedactSignTool } from "@/components/tools/PdfRedactSignTool";
import { redactPdfOnlineFree } from "@/lib/long-tail/pdf-redact-sign";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const content = redactPdfOnlineFree;

export const metadata: Metadata = {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: content.href },
    openGraph: {
        url: content.href,
        siteName: "YuliusBox",
        type: "website",
        title: content.metaTitle,
        description: content.metaDescription,
        images: [
            {
                url: "/og/tools-pdf-redact-sign-redact-pdf-online-free.png",
                width: 1200,
                height: 630,
                alt: "Redact PDF Online Free — Permanent Blackout",
            },
        ],
    },
};

const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Redact PDF Online Free",
    url: "https://www.yuliusbox.com/tools/pdf-redact-sign/redact-pdf-online-free",
    description: "Permanently black out sensitive text in PDF documents with true rasterization.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function RedactPdfOnlineFreePage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/pdf-redact-sign", label: "PDF Redact & Sign" },
                    { href: content.href, label: content.crumb },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {content.h1}
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">{content.subtitle}</p>
                </div>

                <PdfRedactSignTool />
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
