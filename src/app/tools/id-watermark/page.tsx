import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { RelatedTools } from "@/components/tools/RelatedTools";
import IdWatermarkClient from "./IdWatermarkClient";

export default function IdWatermarkPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/id-watermark", label: "ID Watermark" }]} />
            <div className="w-full flex justify-center sm:justify-end mb-6">
                <PrivacyBadge mode="local" />
            </div>
            <IdWatermarkClient />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="id-watermark" />
            </div>
            <Footer />
        </div>
    );
}
