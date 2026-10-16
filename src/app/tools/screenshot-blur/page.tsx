"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ScreenshotBlurTool } from "@/components/tools/ScreenshotBlurTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "Does blur truly hide info vs weak partial blur?",
        a: "Yes, provided the blur radius is sufficiently wide. Weak blurs or low-strength filters can sometimes be partially reversed or reconstructed through automated deblur algorithms or dictionary-based guessing against known typography fonts. In our tool, blur and pixelation are calculated and baked into raw pixel data at the image's original full resolution upon export. For maximum security, solid black fill completely overwrites the underlying image data, with heavy Gaussian blur ranking second.",
    },
    {
        q: "Blur vs Pixelate vs Solid color block — which is safest?",
        a: "Solid color block (pure blackout) is mathematically the safest redaction method because the original pixel RGB values are 100% replaced with a uniform color, leaving zero trace of the underlying characters or gradients. Heavy Gaussian blur is the next safest when set to a wide radius. Pixelation (mosaic) is visually familiar, but if the block size is set too small, automated de-pixelation scripts can occasionally infer text lengths and contours.",
    },
    {
        q: "Is my screenshot uploaded to any server?",
        a: "No, never. All image parsing, canvas manipulation, Gaussian blur filtering, mosaic pixelation, and PNG file encoding happen entirely on your device inside your web browser via HTML5 Canvas. Zero bytes of your screenshots or clipboard data are ever uploaded to or stored on any remote server.",
    },
    {
        q: "What image formats are supported?",
        a: "You can upload screenshots and images in PNG, JPG/JPEG, and WebP formats (as well as paste directly from your clipboard using Ctrl+V or Cmd+V). The final redacted screenshot is exported as a clean, lossless PNG preserving your original image dimensions.",
    },
    {
        q: "Can I move, adjust, or undo blur boxes after drawing?",
        a: "Yes! You can draw multiple selection boxes across your screenshot. Click on any existing box to select it, then drag it to reposition. To delete an individual box, click its red × button or press the Delete key. You can also use the “Undo” button to step backwards or “Clear All” to remove all boxes at once.",
    },
];

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
        },
    })),
};

export default function ScreenshotBlurPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/screenshot-blur", label: "Screenshot Blur" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Screenshot Blur — Blur & Pixelate Sensitive Areas Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                        Blur, pixelate, or cover sensitive areas in screenshots before sharing.
                        Protect usernames, tokens, credentials, and private messages — 100% in your browser.
                    </p>
                </div>

                <div className="relative w-full">
                    <PrivacyBadge mode="local" className="absolute top-3 right-3 z-10" />
                    <ScreenshotBlurTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-6">
                    <h2 className="text-xl font-semibold text-white">
                        Why you should sanitize screenshots before sharing
                    </h2>
                    <p>
                        Screenshots are the fastest way to communicate bugs, celebrate milestones, or ask for help in Slack,
                        Discord, GitHub, or social media. However, modern desktop and browser screenshots routinely capture
                        high-risk confidential data without you noticing: session cookies, authorization headers, private API keys,
                        customer email addresses, phone numbers, server IP addresses, internal project URLs, and bank transactions.
                    </p>
                    <p>
                        Once an unredacted screenshot is uploaded to an issue tracker, public forum, or chat room,
                        it is indexed, archived, and often impossible to completely revoke. Taking ten seconds to blur or
                        blackout sensitive rectangles eliminates accidental data leaks before they happen.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        True client-side privacy: zero server uploads
                    </h2>
                    <p>
                        Many &ldquo;free image blur&rdquo; websites secretly upload your screenshots to their cloud storage,
                        creating the exact data privacy risk you were trying to prevent. With YuliusBox Screenshot Blur,
                        your image is loaded into local browser memory via standard HTML5 Canvas APIs. All image filters
                        (Gaussian blur, mosaic downsampling, and solid color fill) execute directly on your CPU/GPU.
                        You can even disconnect your internet connection after the page loads and continue editing and
                        exporting seamlessly.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Frequently asked questions
                    </h2>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                    />
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details key={f.q} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                                <summary className="cursor-pointer text-white font-medium">{f.q}</summary>
                                <p className="mt-2 text-zinc-400 leading-relaxed">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
