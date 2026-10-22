import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { ImageCompressorTool } from "@/components/tools/ImageCompressorTool";
import { compressImageTo20kb } from "@/lib/long-tail/image-compressor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const content = compressImageTo20kb;

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
                url: "/og/tools-image-compressor-compress-image-to-20kb.png",
                width: 1200,
                height: 630,
                alt: "Compress Image to 20KB Online Free",
            },
        ],
    },
};

const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "20KB Image Compressor",
    url: "https://www.yuliusbox.com/tools/image-compressor/compress-image-to-20kb",
    description: "Compress photos and signatures under 20KB for portal uploads.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function CompressImageTo20kbPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/image-compressor", label: "Image Compressor" },
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

                <ImageCompressorTool
                    targetSizeBytes={20000}
                    targetSizeMB={content.preset?.targetSizeMB}
                />
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
