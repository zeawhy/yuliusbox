import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import ImageGridSplitterClient from "../ImageGridSplitterClient";
import { instagram3x3GridMaker } from "@/lib/long-tail/image-grid-splitter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const content = instagram3x3GridMaker;

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
                url: "/og/tools-image-grid-splitter-instagram-3x3-grid-maker.png",
                width: 1200,
                height: 630,
                alt: "Instagram 3x3 Grid Maker Online Free",
            },
        ],
    },
};

const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Instagram 3x3 Grid Maker",
    url: "https://www.yuliusbox.com/tools/image-grid-splitter/instagram-3x3-grid-maker",
    description: "Split photos into 3x3, 3x2, or 3x1 tiles for Instagram profile grids.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function Instagram3x3GridMakerPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/image-grid-splitter", label: "Image Grid Splitter" },
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

                <ImageGridSplitterClient initialRows={3} initialColumns={3} initialInstagramOrder={true} />
            </div>

            <HubBody content={content} />
            <Footer />
        </div>
    );
}
