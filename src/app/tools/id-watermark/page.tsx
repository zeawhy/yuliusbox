import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { FaqSection } from "@/components/seo/FaqSection";
import IdWatermarkClient from "./IdWatermarkClient";

const FAQS = [
    {
        question: "Does watermarking guarantee my ID cannot be stolen or misused?",
        answer: "No. Watermarking acts as a visible deterrent that restricts legitimate organizations from accepting the copy for other purposes (such as applying for a loan with an ID marked 'FOR APARTMENT RENTAL ONLY'). However, sophisticated attackers can attempt manual editing. Watermarking significantly raises the effort and legal liability of unauthorized use, but cannot physically prevent determined forgery.",
    },
    {
        question: "What text should I write in the watermark?",
        answer: "Specify the exact purpose, recipient organization, and current date. For example: 'FOR KYC VERIFICATION AT [COMPANY NAME] ONLY — VALID ON [DATE] — NOT VALID FOR OTHER PURPOSES'. Keeping the purpose specific prevents the copy from being repurposed elsewhere.",
    },
    {
        question: "Is my ID photo uploaded to any server or cloud database?",
        answer: "Never. All watermarking operations are drawn directly on your browser's HTML5 Canvas using client-side JavaScript. Your original image and watermarked copy never leave your local device, and no copies are stored on any server.",
    },
    {
        question: "Where should I position the watermark on the ID card?",
        answer: "Position the watermark across the face or card details at an angle, with moderate opacity (15%–30%). The text should be clearly readable across critical card elements without obscuring essential numbers, names, or expiration dates needed by the verifying party.",
    },
    {
        question: "What image formats are supported for watermarking?",
        answer: "You can load JPG, PNG, and WebP images. When saving, you can export the watermarked image as a JPEG or PNG, or pass it directly into the PDF Kit tool to create a watermarked PDF document.",
    },
];

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

                <FaqSection items={FAQS} className="mt-8" />
            </div>
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="id-watermark" />
            </div>
            <Footer />
        </main>
    );
}
