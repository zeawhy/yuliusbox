import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { RelatedTools } from "@/components/tools/RelatedTools";
import IdWatermarkClient from "./IdWatermarkClient";

export default function IdWatermarkPage() {
    return (
        <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/id-watermark", label: "ID Watermark" },
                ]}
            />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Secure ID Watermarker
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Add a visible purpose label to your ID card / passport photos to deter misuse. Watermarking marks the intended use and raises the cost of misuse, but cannot guarantee against forgery or removal.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" />
                </div>
                <IdWatermarkClient />
            </div>
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="id-watermark" />
            </div>
            <Footer />
        </main>
    );
}
