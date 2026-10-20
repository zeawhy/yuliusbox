import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { hubContent } from "@/lib/hub-content";
import { longTailPages } from "@/lib/long-tail-content";
import { PdfKitTool } from "@/components/tools/PdfKitTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

export default function PDFToolkitPage() {
    const content = hubContent["pdf-kit"];

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

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <PdfKitTool />
                </div>
            </div>

            <HubBody
                content={content}
                longTailLinks={longTailPages
                    .filter((p) => p.hubId === "pdf-kit")
                    .map((p) => ({ href: p.href, label: p.crumb }))}
            />
            <Footer />
        </div>
    );
}
