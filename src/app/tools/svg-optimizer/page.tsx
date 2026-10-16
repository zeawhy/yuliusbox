"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SvgOptimizerTool } from "@/components/tools/SvgOptimizerTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "Why are SVG files often much larger than they need to be?",
        a: "Vector editing software like Adobe Illustrator, Inkscape, Sketch, and Figma is designed for document preservation, not web performance. These applications routinely save large amounts of proprietary editor metadata (such as <metadata>, <sodipodi:namedview>, and application-specific namespaces), undo histories, comments, empty grouping tags (<g>), and 6-to-8 decimal places of floating-point coordinate precision. This extra bloat typically inflates SVG file sizes by 30% to 70% without adding any visible graphic detail.",
    },
    {
        q: "Is SVG optimization lossless? Will my vector graphic look different?",
        a: "For all standard web applications, our optimization is visually lossless. Removing non-rendering elements (such as XML comments, empty <g> groups, and editor namespaces) changes zero pixels. Rounding numeric coordinates to 2 decimal places provides sub-pixel resolution down to 1/100th of a pixel—far sharper than high-density Retina or 4K screens can differentiate. If your graphic contains elements toggled dynamically with CSS or JavaScript, you can uncheck the 'Remove hidden elements' option to preserve them.",
    },
    {
        q: "Can an SVG file contain viruses, trackers, or malicious scripts?",
        a: "Yes. Because SVG is an XML-based markup language, the SVG specification legally permits <script> elements, inline JavaScript event handlers (like onload or onclick), and external resource references (like javascript: URLs). When untrusted SVGs are inserted directly into an HTML page (for example via dangerouslySetInnerHTML or innerHTML), these scripts can execute and create Cross-Site Scripting (XSS) vulnerabilities. Our tool scans every SVG, highlights detected script content with a security warning, previews the graphic in a strict sandbox, and offers a one-click script stripper.",
    },
    {
        q: "How does coordinate precision affect file size and image quality?",
        a: "In SVG vector paths, every point is written as text numbers in the 'd' attribute. An unoptimized coordinate like '123.456789' uses 10 characters (10 bytes), whereas rounded to '123.46' it uses only 6 bytes. For complex vector illustrations, icons, and fonts containing thousands of coordinates, rounding from 8 decimals down to 2 decimals routinely eliminates up to half of the total file size with zero perceptible distortion.",
    },
    {
        q: "Are my SVG graphics uploaded to any external server?",
        a: "No. All XML parsing, sanitization, precision rounding, live preview rendering, and file generation execute 100% locally in your web browser using the native browser DOMParser and Blob APIs. Zero bytes of your files or vector code are ever uploaded or transmitted across the network.",
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

export default function SvgOptimizerPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/svg-optimizer", label: "SVG Optimizer" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                {/* Title & Headline */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        SVG Optimizer — Compress SVG Online Free, Remove Bloat
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
                        Shrink vector graphics in your browser: strip editor bloat, comments, and hidden layers,
                        round coordinate precision, and compare live previews. 100% private.
                    </p>
                </div>

                {/* Tool Area with Privacy Badge */}
                <div className="relative w-full">
                    <PrivacyBadge mode="local" className="absolute top-3 right-3 z-10" />
                    <SvgOptimizerTool />
                </div>

                {/* Informational Prose */}
                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-5">
                    <h2 className="text-xl font-semibold text-white">Why SVG files need optimization</h2>
                    <p>
                        Scalable Vector Graphics (SVG) are the gold standard for icons, logos, and illustrations on
                        the modern web. Because SVGs are plain text XML documents, they scale infinitely to any screen
                        resolution without losing sharpness. However, when graphics are exported directly from design tools
                        like Illustrator, Inkscape, or Figma, the resulting files are loaded with hidden overhead:
                        application metadata, color swatches, non-standard XML namespaces, and excessive decimal
                        precision that browsers never actually need.
                    </p>

                    <h2 className="text-xl font-semibold text-white">Balancing coordinate precision & visual fidelity</h2>
                    <p>
                        A single curve in an SVG may contain hundreds of anchor points and bezier handles. Storing
                        every coordinate as an 8-decimal float (e.g. <code>d=&quot;M 14.12345678 92.87654321...&quot;</code>)
                        causes path strings to explode in byte size. Rounding to 2 decimal places maintains a precision of
                        0.01 pixels—an increment substantially smaller than a single physical pixel on standard or high-DPI
                        displays—cutting file sizes by 30% to 60% while rendering identically to the human eye.
                    </p>

                    <h2 className="text-xl font-semibold text-white">Active script risks in untrusted SVGs</h2>
                    <p>
                        Because SVG files are parsed as XML, they are capable of containing embedded <code>&lt;script&gt;</code> tags,
                        inline event handlers (such as <code>onclick</code> or <code>onload</code>), and <code>javascript:</code> pseudoprotocol URLs.
                        If an application allows users to upload SVGs and displays them raw via inline HTML or <code>dangerouslySetInnerHTML</code>,
                        an attacker can hijack user sessions via stored Cross-Site Scripting (XSS).
                        Our optimizer automatically inspects markup for script tags and malicious attributes, previews graphics
                        safely inside sandboxed Blob <code>&lt;img&gt;</code> tags, and provides an option to strip all executable code.
                    </p>

                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
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
