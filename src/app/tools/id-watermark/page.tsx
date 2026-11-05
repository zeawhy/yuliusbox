import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { HubBody } from "@/components/seo/HubBody";
import { hubContent } from "@/lib/hub-content";
import IdWatermarkClient from "./IdWatermarkClient";

export default function IdWatermarkPage() {
    const content = hubContent["id-watermark"];

    return (
        <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: content.href, label: content.crumb },
                ]}
            />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {content.h1}
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" toolId="id-watermark" />
                </div>
                <IdWatermarkClient />
            </div>

            <HubBody content={content} />
            <Footer />
        </main>
    );
}
