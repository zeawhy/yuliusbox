import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { slugifyHeading, type HubContent, type RelatedLink } from "@/lib/hub-content";

/**
 * Shared body for tool-family hub pages, rendered AFTER the interactive
 * tool widget. Order: trust note -> How to use -> content sections ->
 * FAQ (with FAQPage structured data) -> long-tail scenario links
 * (hub pages only) -> Related tools.
 */
export function HubBody({
    content,
    longTailLinks,
    trustMode = "local",
}: {
    content: HubContent;
    /** Hub pages pass their indexed long-tail pages; long-tail pages omit this. */
    longTailLinks?: RelatedLink[];
    /**
     * Controls the trust badge shown below the tool.
     * - "local"  (default): tool runs 100% in the browser — no upload.
     * - "api": tool calls a secure backend API — prompts/files are never stored.
     */
    trustMode?: "local" | "api";
}) {
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <div className="w-full flex flex-col gap-12 sm:gap-16 mt-12 sm:mt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            {/* Trust note */}
            <p className="flex items-center justify-center gap-2 text-sm text-zinc-500 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                {trustMode === "api"
                    ? "Processed via secure API — prompts and files are never stored."
                    : "Processed 100% locally in your browser — files never leave your device."}
            </p>

            {/* Quick-jump preset bar for hub child scenarios */}
            {longTailLinks && longTailLinks.length > 0 && (
                <section aria-label="Preset scenario shortcuts" className="w-full max-w-3xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                        Popular {content.crumb} Presets &amp; Scenarios
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {longTailLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-zinc-800 bg-zinc-900/70 text-xs sm:text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                                >
                                    <span>{link.label}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Content sections */}
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
                {content.sections.map((section) => (
                    <section key={section.heading} id={slugifyHeading(section.heading)} aria-label={section.heading} className="scroll-mt-6">
                        <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
                        {section.paragraphs.map((p, i) => (
                            <p key={i} className="text-zinc-400 leading-relaxed mb-4 last:mb-0">
                                {p}
                            </p>
                        ))}
                        {section.table && (
                            <div className="mt-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
                                <table className="w-full text-left border-collapse text-sm">
                                    {section.table.caption && (
                                        <caption className="px-4 py-2.5 text-xs text-zinc-500 text-left border-b border-zinc-800/80 bg-zinc-900/60">
                                            {section.table.caption}
                                        </caption>
                                    )}
                                    <thead>
                                        <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-200">
                                            {section.table.headers.map((h, hi) => (
                                                <th key={hi} className="px-4 py-3 font-semibold whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                                        {section.table.rows.map((row, ri) => (
                                            <tr key={ri} className="hover:bg-zinc-800/30">
                                                {row.map((cell, ci) => (
                                                    <td key={ci} className="px-4 py-2.5 align-top">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {/* How to use */}
            <section aria-label="How to use" className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">How to use</h2>
                <ol className="space-y-4">
                    {content.howTo.map((step, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <span className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-200">
                                {i + 1}
                            </span>
                            <p className="text-zinc-400 leading-relaxed pt-1">{step}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* FAQ */}
            <section aria-label="Frequently asked questions" className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently asked questions</h2>
                <div className="space-y-3">
                    {content.faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group bg-zinc-900/50 border border-zinc-800/60 p-4 sm:p-5 rounded-xl cursor-pointer open:bg-zinc-900"
                        >
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span aria-hidden="true" className="transition-transform group-open:rotate-180 text-zinc-500 shrink-0">
                                    ▼
                                </span>
                            </summary>
                            <p className="text-zinc-400 mt-3 text-[15px] leading-relaxed">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Long-tail scenario pages (hub pages only) */}
            {longTailLinks && longTailLinks.length > 0 && (
                <section aria-label="Popular guides" className="w-full max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        More {content.crumb} guides
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {longTailLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
                                >
                                    <span className="text-zinc-300 group-hover:text-white font-medium text-[15px]">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Related tools */}
            <section aria-label="Related tools" className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Related tools</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.related.map((link) => (
                        <li key={link.href}>
                            {link.external ? (
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
                                >
                                    <span className="text-zinc-300 group-hover:text-white font-medium text-[15px]">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </a>
                            ) : (
                                <Link
                                    href={link.href}
                                    className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
                                >
                                    <span className="text-zinc-300 group-hover:text-white font-medium text-[15px]">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
