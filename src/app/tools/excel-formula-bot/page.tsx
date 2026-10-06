import { Metadata } from 'next';
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { hubContent } from "@/lib/hub-content";
import { longTailPages } from "@/lib/long-tail-content";
import { ExcelFormulaBotTool } from "@/components/tools/ExcelFormulaBotTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Free Excel Formula Generator & AI Bot | YuliusBox",
    description: "Describe your problem in plain English, and AI will generate the formula. Supports Microsoft Excel and Google Sheets.",
    keywords: ["excel formula generator", "spreadsheet ai", "google sheets formula maker", "excel bot"],
    alternates: {
        canonical: "/tools/excel-formula-bot",
    },
    openGraph: {
        url: "/tools/excel-formula-bot",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-excel-formula-bot.png",
                width: 1200,
                height: 630,
                alt: "Free Excel Formula Generator & AI Bot",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Excel Formula Bot",
    "url": "https://www.yuliusbox.com/tools/excel-formula-bot",
    "description": "Convert plain English to Excel and Google Sheets formulas instantly with AI.",
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function Page() {
    const content = hubContent["excel-formula-bot"];

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: content.href, label: content.crumb }]} />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{content.h1}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                <ExcelFormulaBotTool />
            </div>

            <HubBody
                content={content}
                longTailLinks={longTailPages
                    .filter((p) => p.hubId === "excel-formula-bot")
                    .map((p) => ({ href: p.href, label: p.crumb }))}
            />
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </div>
    );
}
