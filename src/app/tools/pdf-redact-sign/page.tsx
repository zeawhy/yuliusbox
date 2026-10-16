"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PdfRedactSignTool } from "@/components/tools/PdfRedactSignTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "What is the difference between Thorough Mode and visual cover?",
        a: "Thorough Mode (enabled by default) rasterizes any page containing redactions into a flattened high-resolution image with the blackout rectangles baked into the raw pixel data, discarding the original text streams and vector objects entirely. In contrast, visual cover mode merely draws black boxes on top of the existing PDF page; the underlying text characters remain intact in the document stream and can still be searched, selected, or copied by anyone opening the file.",
    },
    {
        q: "Is an electronic signature added here legally binding?",
        a: "Signatures created here are simple electronic signatures (SES) — graphical stamps of your handwritten signature or uploaded image. Under laws such as the US ESIGN Act and EU eIDAS regulation, simple electronic signatures are generally valid for everyday commercial agreements, purchase orders, approval forms, and NDAs. However, they do not provide cryptographic certificate-based non-repudiation (such as Advanced or Qualified Electronic Signatures). Legal enforceability depends on your jurisdiction, governing law, and document requirements.",
    },
    {
        q: "Does this tool upload my PDF or signature to your servers?",
        a: "No, never. All document parsing, rendering, redaction, signature stamping, and final PDF generation take place entirely within your browser using WebAssembly and client-side JavaScript (pdf-lib and PDF.js). Zero bytes of your document or signature leave your machine.",
    },
    {
        q: "Why does rasterization permanently remove underlying text?",
        a: "Standard PDFs store textual information as coordinates and font character codes in a content stream. When a page is rasterized, the PDF rendering engine flattens all fonts, vectors, and layers into a single grid of pixels (bitmap), and the black redaction rectangles paint over those exact pixels. Because the original PDF content stream is replaced with the flattened image, the text data is physically destroyed and cannot be retrieved.",
    },
    {
        q: "What happens to pages that do not have any redactions?",
        a: "Pages without any redaction marks are copied directly from the original PDF as lossless vector pages. Their crisp fonts, selectable text, internal links, and compact file size are preserved 100% intact. Only pages containing redactions undergo rasterization when Thorough Mode is active.",
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

export default function PdfRedactSignPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/pdf-redact-sign", label: "PDF Redact & Sign" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        PDF Redact & Sign — Black Out Sensitive Text & Add Signature Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                        Black out sensitive personal data, financial numbers, and confidential notes in
                        PDFs with true rasterized redaction, then sign with a handwritten or uploaded
                        signature. 100% in your browser — zero bytes uploaded.
                    </p>
                </div>

                <div className="relative w-full">
                    <PrivacyBadge mode="local" className="absolute top-3 right-3 z-10" />
                    <PdfRedactSignTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-6">
                    <h2 className="text-xl font-semibold text-white">
                        Why most PDF redaction tools fail (and leak your secrets)
                    </h2>
                    <p>
                        A notorious mistake in document security is drawing a black rectangle over sensitive text
                        in a standard PDF editor or presentation software. While visually covered, the underlying
                        characters remain fully embedded in the PDF&apos;s text stream. Anyone can press{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                            Ctrl+A
                        </kbd>{" "}
                        and{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">
                            Ctrl+C
                        </kbd>{" "}
                        or search with <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">Ctrl+F</kbd> to copy the &ldquo;hidden&rdquo; Social Security Numbers, addresses, or confidential prices.
                    </p>
                    <p>
                        Our tool solves this through <strong>Thorough Mode</strong>: any page that contains
                        redaction boxes is rendered at 2x high resolution and converted into a flattened
                        raster image with the black boxes painted directly over the pixels. The original vector
                        text streams, hidden metadata, and font glyphs are completely eliminated.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Sign documents without cloud exposure
                    </h2>
                    <p>
                        Many online PDF signers require you to upload confidential contracts, employee agreements,
                        or financial records to their remote cloud servers. With YuliusBox, your document never
                        leaves your device. You can draw your signature naturally with a mouse, trackpad, or touch
                        stylus, or upload a scanned signature image. The signature is rendered directly into the
                        PDF stream at crisp native resolution.
                    </p>

                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                    />
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details
                                key={f.q}
                                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors"
                            >
                                <summary className="cursor-pointer text-white font-medium hover:text-emerald-400 transition-colors">
                                    {f.q}
                                </summary>
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
