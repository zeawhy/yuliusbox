import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { VideoCostCalculator } from "@/components/tools/VideoCostCalculator";
import { Calendar, HelpCircle, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import { PRICING_LAST_UPDATED } from "@/lib/video-model-pricing";

const FAQS = [
    {
        question: "How is AI video generation billed across different model providers?",
        answer: "Most modern AI video models hosted on serverless platforms like fal.ai bill strictly on a pay-as-you-go, per-second basis for the generated video output. For instance, FLUX 3 Max (720p) and MiniMax H3 charge a fixed price per second of rendered footage. ByteDance's Seedance 2.5 uses latent video tokens scaled to resolution and duration (approximating ~$0.4730/s at 720p 24fps). There are no mandatory monthly subscriptions, credit expirations, or minimum seat fees.",
    },
    {
        question: "What is the FLUX 3 Max launch promotional pricing?",
        answer: "Through November 7, 2026, Black Forest Labs and fal.ai offer a 75% launch discount on FLUX 3 Max 720p generations. The rate is reduced from the standard $0.1700 per second down to $0.0425 per second. Once the promotional deadline passes, pricing automatically reverts to standard rates. This calculator dynamically tracks the remaining days and adjusts calculations automatically.",
    },
    {
        question: "Why is FLUX 3 Max 1080p excluded from this calculator?",
        answer: "We strictly uphold data integrity by only presenting pricing directly verified on official model rate cards. While various third-party blogs speculate on FLUX 3 Max 1080p upscaling costs, fal.ai has not yet published an official dedicated rate card for native 1080p inference on this endpoint. Unverified figures are excluded rather than presented as official facts.",
    },
    {
        question: "Does audio generation or frame rate (FPS) increase the cost?",
        answer: "For FLUX 3 Max, synchronized audio generation is generated natively in the latent space and is included at no additional surcharge. Furthermore, fal.ai endpoints bill purely by output duration in seconds rather than total rendered frames. Whether you configure 24 FPS or 30 FPS, the duration in seconds determines the generation fee.",
    },
    {
        question: "How does MiniMax H3 compare with Seedance 2.5 and FLUX 3 Max?",
        answer: "During the promotional window, FLUX 3 Max (720p at $0.0425/s) is the most budget-friendly frontier option. Once standard pricing resumes, MiniMax H3 (768p at $0.0800/s) offers the lowest sustained unit cost, while Seedance 2.5 ($0.4730/s) caters to complex multi-subject interactions and director-level camera transitions with native audio.",
    },
];

export default function VideoCostCalculatorPage() {
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <Header />

            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/ai-video-cost-calculator", label: "AI Video Cost Calculator" },
                ]}
            />

            {/* Page Header / Hero */}
            <div className="w-full flex flex-col gap-6 text-center mb-8">
                {/* Date Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 backdrop-blur-sm">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Pricing updated on {PRICING_LAST_UPDATED}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        AI video generation cost calculator
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Compare real-time generation costs for FLUX 3 Max, Seedance 2.5, MiniMax H3, Google Veo 3.1, and Kling. Calculate per-second rendering expenses with active promotional discounts and countdown timers.
                    </p>
                </div>

                {/* Privacy Badge */}
                <div className="flex justify-center">
                    <PrivacyBadge mode="local" />
                </div>
            </div>

            {/* Main Interactive Tool */}
            <div className="w-full mb-16">
                <Suspense
                    fallback={
                        <div className="w-full h-96 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse flex items-center justify-center text-zinc-500 text-sm">
                            Loading AI Video Cost Calculator...
                        </div>
                    }
                >
                    <VideoCostCalculator />
                </Suspense>
            </div>

            {/* FAQs Section */}
            <div className="w-full flex flex-col gap-6 mb-16 pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Frequently Asked Questions About AI Video Generation Costs
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex flex-col gap-2.5"
                        >
                            <h3 className="font-semibold text-white text-base">
                                {faq.question}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer & Unaffiliated Statement */}
            <div className="w-full p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950 text-xs text-zinc-400 space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
                    <ShieldAlert className="w-4 h-4 text-zinc-400" />
                    <h2>Disclaimer & Independent Valuation Statement</h2>
                </div>
                <p className="leading-relaxed">
                    YuliusBox is an independent developer utility and cost estimation tool. This calculator is not affiliated with, endorsed by, sponsored by, or operated in partnership with fal.ai, Black Forest Labs, ByteDance, MiniMax, Google DeepMind, Kuaishou, or any other commercial model developer. All product names, trademarks, and registered brand identities cited on this page are the property of their respective owners.
                </p>
                <p className="leading-relaxed">
                    Inference prices, promotional periods, and billing mechanics are subject to real-time adjustments by their respective API providers. While all rates displayed are verified as of {PRICING_LAST_UPDATED}, users should review active endpoints on provider dashboards before executing massive production workloads.
                </p>
            </div>

            <Footer />
        </div>
    );
}
