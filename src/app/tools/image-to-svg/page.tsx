"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ImageToSvgTool } from "@/components/tools/ImageToSvgTool";
import { ShieldCheck, Sparkles, ExternalLink, ArrowRight, CheckCircle2, Shapes, Image as ImageIcon } from "lucide-react";

const FAQS = [
    {
        q: "Is this Image to SVG converter completely free to use?",
        a: "Yes, 100% free with unlimited conversions. There are no daily usage caps, watermarks, mandatory accounts, or hidden subscriptions. All computation runs directly inside your web browser on your device.",
    },
    {
        q: "Are my uploaded photos or graphics sent to a remote server?",
        a: "No. Never. Vectorization executes entirely on your computer or smartphone using a WebAssembly build of VTracer inside an isolated Web Worker thread. Zero bytes of your image data or output SVG files are uploaded, stored, or transmitted across the network.",
    },
    {
        q: "Can I open and edit the exported SVG in Figma, Illustrator, or Inkscape?",
        a: "Yes. The generated SVG follows standard W3C SVG 1.1 syntax with cleanly layered <path> elements and bezier curves. You can import the .svg file into Figma, Adobe Illustrator, Inkscape, Sketch, or CorelDRAW to edit individual anchor points, adjust color fills, or rescale without any loss of sharpness.",
    },
    {
        q: "Why do real-world photographs or portraits look stylized or posterized?",
        a: "Deterministic geometric vectorizers (such as VTracer) work by clustering color regions and fitting polynomial curves to contrast edges. Photographs contain continuous lighting gradients, optical noise, and microscopic skin/hair textures, which naturally quantize into stepping color bands (posterization). Local tracing is ideal for logos, icons, graphic art, and line drawings. For complex photographic scenes, consider exploring generative AI models like Ideogram Vector ($0.10/image).",
    },
    {
        q: "What image formats and file dimensions are supported?",
        a: "You can upload PNG, JPG/JPEG, and WebP files up to 10MB. To ensure smooth browser performance and protect device memory from crashing, graphics wider or taller than 4096px are automatically downscaled proportionally before vector fitting.",
    },
];

const HOW_TO_STEPS = [
    {
        step: 1,
        title: "Upload your raster graphic",
        desc: "Drag and drop any PNG, JPG, or WebP image, click to browse your files, or press Ctrl+V / ⌘+V to paste directly from your clipboard.",
    },
    {
        step: 2,
        title: "Select a tuning preset",
        desc: "Choose between Logo / Icon (crisp sharp corners), Illustration (rich layered colors), Line Art (pure black-and-white ink drawings), or Pixel Art.",
    },
    {
        step: 3,
        title: "Adjust optional fine-tuning parameters",
        desc: "Expand the advanced panel to tweak color count, noise suppression, curve smoothness, or toggle background removal for transparent output.",
    },
    {
        step: 4,
        title: "Inspect side-by-side and export",
        desc: "Compare your original image against the scalable vector rendering with zoom controls, then download the .svg file or copy SVG code in one click.",
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

export default function ImageToSvgPage() {
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
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/image-to-svg", label: "Image to SVG" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                {/* Title & Headline */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Free Image to SVG Converter
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
                        Convert JPG, PNG, and WebP into clean, scalable vector graphics (SVG) right in your browser.
                        Processed in your browser — images are never uploaded.
                    </p>
                </div>

                {/* Privacy Badge & Interactive Tool Area */}
                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end">
                        <PrivacyBadge mode="local" />
                    </div>

                    <ImageToSvgTool />
                </div>

                {/* Informational Prose & SEO Sections */}
                <div className="w-full flex flex-col gap-10 mt-6 text-zinc-300">
                    {/* How to use */}
                    <section aria-labelledby="how-to-heading" className="w-full">
                        <h2 id="how-to-heading" className="text-2xl font-bold text-white mb-6">
                            How to convert images to SVG in 4 steps
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {HOW_TO_STEPS.map((s) => (
                                <div
                                    key={s.step}
                                    className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col gap-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                                            {s.step}
                                        </span>
                                        <h3 className="font-semibold text-white text-base">{s.title}</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed pl-10">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quality Guidance: When Local Tracing Works vs AI Vectorization */}
                    <section
                        aria-labelledby="quality-heading"
                        className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5"
                    >
                        <h2 id="quality-heading" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                            Not getting the vector result you expected?
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                            Client-side vector tracing (powered by the open-source VTracer WebAssembly engine)
                            is optimized for <strong>logos, flat icons, geometric brand marks, stickers, and black-and-white line art</strong>.
                            Because it analyzes color borders geometrically, it produces razor-sharp bezier splines with tiny file sizes in under a second—completely offline.
                        </p>
                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                            However, complex photographs, detailed landscapes, and continuous face lighting have subtle color gradations
                            that deterministic contour algorithms naturally break into stepping posterized color bands. If you need semantic reconstruction of complex photographic subjects or intricate digital paintings into multi-layered vectors, you might explore AI vectorization models such as{" "}
                            <a
                                href="https://ideogram.ai/models/vector/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline font-semibold inline-flex items-center gap-1"
                            >
                                Ideogram Vector
                                <ExternalLink className="w-3.5 h-3.5 inline" />
                            </a>{" "}
                            (official pricing around $0.10 per image). Generative AI models re-interpret imagery semantically, complementing traditional edge-tracing when photographic realism is needed.
                        </p>

                        {/* YuliusWiki In-Depth Guides */}
                        <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                            <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                                Related AI Vector Guides on YuliusWiki
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <a
                                    href="https://yuliuswiki.com/en/ideogram-vector-vs-recraft"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all group flex flex-col justify-between gap-3"
                                >
                                    <div>
                                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
                                            <span className="text-blue-400 font-medium">Model Comparison</span>
                                            <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <h4 className="font-semibold text-white group-hover:text-blue-400 text-sm transition-colors">
                                            Ideogram Vector vs Recraft
                                        </h4>
                                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                            Pricing models, free tiers, typography support, and commercial licensing compared for AI-generated editable SVGs.
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-blue-400 font-medium inline-flex items-center gap-1">
                                        Read on YuliusWiki <ArrowRight className="w-3 h-3" />
                                    </span>
                                </a>

                                <a
                                    href="https://yuliuswiki.com/en/ideogram-vector-guide"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all group flex flex-col justify-between gap-3"
                                >
                                    <div>
                                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
                                            <span className="text-emerald-400 font-medium">In-Depth Guide</span>
                                            <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <h4 className="font-semibold text-white group-hover:text-blue-400 text-sm transition-colors">
                                            What Is Ideogram Vector? Pricing, How to Use &amp; Limitations
                                        </h4>
                                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                            Detailed analysis of text-to-vector vs image-to-vector modes, official &amp; fal.ai pricing ($0.10/image), and how it compares to local geometric tracing.
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-blue-400 font-medium inline-flex items-center gap-1">
                                        Read on YuliusWiki <ArrowRight className="w-3 h-3" />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section aria-labelledby="faq-heading" className="w-full space-y-4">
                        <h2 id="faq-heading" className="text-2xl font-bold text-white">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                            {FAQS.map((faq) => (
                                <details
                                    key={faq.q}
                                    className="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 transition-colors open:bg-zinc-900/80 cursor-pointer"
                                >
                                    <summary className="font-semibold text-white list-none flex items-center justify-between gap-4 text-base [&::-webkit-details-marker]:hidden">
                                        <span>{faq.q}</span>
                                        <span aria-hidden="true" className="transition-transform group-open:rotate-180 text-zinc-500 shrink-0">
                                            ▼
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* Related Tools */}
                    <section aria-labelledby="related-heading" className="w-full pt-4 border-t border-zinc-800">
                        <h3 id="related-heading" className="text-lg font-semibold text-white mb-4">
                            Related Vector & Image Tools
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/tools/svg-optimizer"
                                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        <Shapes className="w-4 h-4 text-blue-400" />
                                        SVG Optimizer
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                                        Compress and minify SVG files: strip editor bloat, clean namespaces, and round coordinate precision.
                                    </p>
                                </div>
                                <span className="text-xs text-blue-400 font-medium mt-3 flex items-center gap-1">
                                    Open Tool <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </Link>

                            <Link
                                href="/tools/image-compressor"
                                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                                        Image Compressor
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                                        Shrink JPG, PNG, and WebP images by up to 80% with live quality control and zero server uploads.
                                    </p>
                                </div>
                                <span className="text-xs text-blue-400 font-medium mt-3 flex items-center gap-1">
                                    Open Tool <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </Link>

                            <Link
                                href="/tools/background-remover"
                                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        Background Remover
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                                        Erase image backgrounds automatically in your browser with AI models running locally.
                                    </p>
                                </div>
                                <span className="text-xs text-blue-400 font-medium mt-3 flex items-center gap-1">
                                    Open Tool <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
