import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Video Cost Calculator | YuliusBox",
    description: "Calculate and compare AI video generation costs for FLUX 3 Max, Seedance 2.5, MiniMax H3, and Veo. Real-time pricing with promo countdowns.",
    keywords: [
        "ai video cost calculator",
        "flux 3 max pricing",
        "seedance 2.5 cost",
        "minimax h3 video price",
        "fal ai video cost",
        "ai video generation pricing",
        "flux 3 max promo",
    ],
    alternates: {
        canonical: "/ai-video-cost-calculator",
    },
    openGraph: {
        title: "AI Video Cost Calculator | YuliusBox",
        description: "Calculate and compare AI video generation costs for FLUX 3 Max, Seedance 2.5, MiniMax H3, and Veo. Real-time pricing with promo countdowns.",
        url: "/ai-video-cost-calculator",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/ai-video-cost-calculator.png",
                width: 1200,
                height: 630,
                alt: "AI Video Generation Cost Calculator",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Video Generation Cost Calculator",
    url: "https://www.yuliusbox.com/ai-video-cost-calculator",
    description:
        "Free client-side calculator comparing video generation rates for FLUX 3 Max, Seedance 2.5, MiniMax H3, and Veo with promo countdowns.",
    applicationCategory: "UtilityApplication",
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
