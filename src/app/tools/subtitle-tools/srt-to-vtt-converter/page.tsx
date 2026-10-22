import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { SubtitleToolsTool } from "@/components/tools/SubtitleToolsTool";
import { srtToVttConverter } from "@/lib/long-tail/subtitle-tools";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const content = srtToVttConverter;

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
                url: "/og/tools-subtitle-tools-srt-to-vtt-converter.png",
                width: 1200,
                height: 630,
                alt: "SRT to VTT Converter Online Free",
            },
        ],
    },
};

const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SRT to VTT Converter",
    url: "https://www.yuliusbox.com/tools/subtitle-tools/srt-to-vtt-converter",
    description: "Convert SRT subtitles to WebVTT format for HTML5 video and web players.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function SrtToVttConverterPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/subtitle-tools", label: "Subtitle Tools" },
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

                <SubtitleToolsTool defaultTab="converter" />
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
