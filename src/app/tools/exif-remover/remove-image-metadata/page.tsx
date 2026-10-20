import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { ExifRemoverTool } from "@/components/tools/ExifRemoverTool";
import { removeImageMetadata } from "@/lib/long-tail-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const content = removeImageMetadata;

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
                url: "/og/tools-exif-remover-remove-image-metadata.png",
                width: 1200,
                height: 630,
                alt: "Remove Image Metadata Online Free \u2014 Before You Post",
            },
        ],
    },
};

export default function RemoveImageMetadataPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/exif-remover", label: "EXIF Remover" },
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

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end">
                        <PrivacyBadge mode="local" />
                    </div>
                    <ExifRemoverTool />
                </div>
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
