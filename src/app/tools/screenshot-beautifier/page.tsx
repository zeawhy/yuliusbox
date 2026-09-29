import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { hubContent } from "@/lib/hub-content";
import { longTailPages } from "@/lib/long-tail-content";
import { ScreenshotBeautifierTool } from "@/components/tools/ScreenshotBeautifierTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ScreenshotBeautifierPage() {
    const content = hubContent["screenshot-beautifier"];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-8">
                <Header />
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4 sm:pt-8">
                <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: content.href, label: content.crumb }]} />
                <div className="text-center space-y-4 mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{content.h1}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">{content.subtitle}</p>
                </div>
            </div>
            <ScreenshotBeautifierTool />
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
                <HubBody
                    content={content}
                    longTailLinks={longTailPages
                        .filter((p) => p.hubId === "screenshot-beautifier")
                        .map((p) => ({ href: p.href, label: p.crumb }))}
                />
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-8">
                <Footer />
            </div>
        </div>
    );
}
