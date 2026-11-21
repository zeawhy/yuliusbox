import type { Metadata } from "next";
import { ToolSchemaScript } from "@/lib/schema";

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

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ToolSchemaScript
                path="/ai-video-cost-calculator"
                name="AI Video Generation Cost Calculator"
                description="Free client-side calculator comparing video generation rates for FLUX 3 Max, Seedance 2.5, MiniMax H3, and Veo with promo countdowns."
                applicationCategory="UtilitiesApplication"
            />
            {children}
        </>
    );
}
