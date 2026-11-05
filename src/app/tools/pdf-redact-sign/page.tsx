"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { PdfRedactSignTool } from "@/components/tools/PdfRedactSignTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import Link from "next/link";

const FAQS = [
    {
        q: "How does true redaction work, and are there any side effects?",
        a: "Redacted pages are flattened to high-resolution images, so the original text is removed, not just covered. All underlying vector text streams, fonts, annotations, and metadata are permanently destroyed. The trade-offs: text on treated pages can no longer be selected or searched, and the output file size for those pages may increase compared to pure vector text.",
    },
    {
        q: "Why do simple black boxes in standard PDF editors fail?",
        a: "Drawing a black rectangle in a typical PDF viewer merely adds an annotation or vector shape on top of the text. The underlying characters remain intact in the document stream and can still be searched (Ctrl+F) or copied (Ctrl+C). Our tool completely rasterizes redacted pages to bitmaps, eliminating the text stream at the byte level.",
    },
    {
        q: "Does this tool upload my PDF or signature to your servers?",
        a: "No, never. All document parsing, rendering, redaction, signature stamping, and final PDF generation take place entirely within your browser using WebAssembly and client-side JavaScript (pdf-lib and PDF.js). Zero bytes of your document or signature leave your machine.",
    },
    {
        q: "Is an electronic signature added here legally binding?",
        a: "Signatures created here are simple electronic signatures (SES) — graphical stamps of your handwritten signature or uploaded image. Under laws such as the US ESIGN Act and EU eIDAS regulation, simple electronic signatures are generally valid for everyday commercial agreements, purchase orders, approval forms, and NDAs. However, they do not provide cryptographic certificate-based non-repudiation (such as Advanced or Qualified Electronic Signatures). Legal enforceability depends on your jurisdiction, governing law, and document requirements.",
    },
    {
        q: "What happens to pages that do not have any redactions?",
        a: "Pages without any redaction marks are copied directly from the original PDF as lossless vector pages. Their crisp fonts, selectable text, internal links, and compact file size are preserved 100% intact. Only pages containing redactions undergo image rasterization.",
    },
];

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

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
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

                    <h2 className="text-xl font-semibold text-white">
                        Selective 2x page rasterization architecture &amp; DevTools verification
                    </h2>
                    <p>
                        <code>PdfRedactSignTool.tsx</code> combines Mozilla&apos;s <code>pdfjs-dist</code> renderer with <code>pdf-lib</code> 1.17.1 to balance byte-level security with document fidelity. When you export a document, the engine inspects each page index: pages that contain <strong>redaction rectangles</strong> are rendered onto an off-screen HTML5 Canvas at 2x resolution, the solid blackout boxes and any signatures on that page are painted directly into the bitmap pixels, and the flattened image replaces the page&apos;s vector content stream—destroying all underlying selectable text glyphs, font tables, and hidden annotations on that page. Pages that contain <strong>only signatures or no marks at all</strong> bypass rasterization and are copied via <code>pdf-lib</code> as lossless vector pages with the PNG signature stamp overlaid at exact coordinates.
                    </p>
                    <p>
                        <strong>How to verify irreversible redaction &amp; zero upload yourself:</strong> (1) Open Browser DevTools (<code>F12 → Network</code>), clear the log, and click Export Redacted &amp; Signed PDF to confirm zero outbound file requests occur. (2) Open the downloaded PDF in Chrome, Adobe Acrobat, or Preview, press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">Ctrl+F</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs">Ctrl+A</kbd> on the redacted page, and verify that the underlying text stream no longer exists.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Page treatment behavior and byte impact across redaction vs. signature-only pages.
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">Page Modification Type</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Client-Side Pipeline</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Underlying Text Stream</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Typical Output Size Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Page with Redaction Boxes</td>
                                    <td className="px-3.5 py-2.5">PDF.js 2x Canvas rasterization + pixel blackout</td>
                                    <td className="px-3.5 py-2.5 text-emerald-400">100% destroyed (bitmap only)</td>
                                    <td className="px-3.5 py-2.5">~150–450 KiB per rasterized A4 page</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Page with Signature Stamp Only</td>
                                    <td className="px-3.5 py-2.5">pdf-lib vector copyPages() + embedPng() stamp</td>
                                    <td className="px-3.5 py-2.5">Preserved (selectable vector text)</td>
                                    <td className="px-3.5 py-2.5">+8–25 KiB for embedded transparent PNG signature</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Unmodified Page in Packet</td>
                                    <td className="px-3.5 py-2.5">Direct pdf-lib copyPages() pass-through</td>
                                    <td className="px-3.5 py-2.5">Preserved 100% lossless</td>
                                    <td className="px-3.5 py-2.5">0 B overhead (original vector stream retained)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 space-y-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Dedicated Scenario &amp; Companion PDF Tools</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none pl-0">
                            <li>
                                <Link
                                    href="/tools/pdf-redact-sign/redact-pdf-online-free"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Redact PDF Online Free — Dedicated Redaction Preset</span>
                                    <span>→</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/pdf-kit/compress-pdf-online"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Compress PDF Online — Shrink Rasterized Redacted PDFs</span>
                                    <span>→</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/pdf-kit/extract-pages-from-pdf"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Extract Pages from PDF — Pull Specific Exhibits Only</span>
                                    <span>→</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/pdf-kit/split-pdf-online"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Split PDF Online — Separate Multi-Document Packets</span>
                                    <span>→</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/word-to-pdf"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Word to PDF Converter — Convert .docx Contracts Before Signing</span>
                                    <span>→</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <FaqSection items={FAQS} />
            </div>

            <Footer />
        </div>
    );
}
