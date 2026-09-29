import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { HubBody } from "@/components/seo/HubBody";
import { hubContent } from "@/lib/hub-content";
import { longTailPages } from "@/lib/long-tail-content";
import { AudioToTextTool } from "@/components/tools/AudioToTextTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AudioToTextPage() {
    const content = hubContent["audio-to-text"];

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

                <AudioToTextTool />
            </div>

            <HubBody
                content={content}
                longTailLinks={longTailPages
                    .filter((p) => p.hubId === "audio-to-text")
                    .map((p) => ({ href: p.href, label: p.crumb }))}
            />
            <Footer />
        </div>
    );
}
