import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { ImageCompressorTool } from "@/components/tools/ImageCompressorTool";
import { longTailPages } from "@/lib/long-tail-content";
import { hubContent } from "@/lib/hub-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const content = longTailPages.find((p) => p.slug === "convert-image-to-webp")!;
const hub = hubContent[content.hubId];

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
                url: "/og/tools-image-compressor-convert-image-to-webp.png",
                width: 1200,
                height: 630,
                alt: "Convert Image to WebP Online Free \u2014 Real .webp Output",
            },
        ],
    },
};

export default function ConvertImageToWebpPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: hub.href, label: hub.crumb },
                    { href: content.href, label: content.crumb },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {content.h1}
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">{content.subtitle}</p>
                </div>

                <ImageCompressorTool
                    targetSizeMB={content.preset?.targetSizeMB}
                    outputFormat={content.preset?.outputFormat}
                />
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
