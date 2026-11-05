export interface ToolSeoTable {
    caption?: string;
    headers: string[];
    rows: string[][];
}

export interface ToolSeoSection {
    heading: string;
    paragraphs: string[];
    table?: ToolSeoTable;
}

export interface ToolFaq {
    question: string;
    answer: string;
}

/**
 * Server-rendered body copy for a tool page: intro sections, step-by-step
 * "How to use", real-world use cases, and an FAQ block. The FAQPage
 * JSON-LD is generated from the exact same `faqs` data that is rendered
 * visibly, so structured data always matches on-page text.
 */
export function ToolSeoBody({
    sections,
    howTo,
    useCases,
    faqs,
}: {
    sections: ToolSeoSection[];
    howTo: string[];
    useCases: string[];
    faqs: ToolFaq[];
}) {
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <div className="w-full flex flex-col gap-12 sm:gap-14 mt-12 sm:mt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            {/* Intro / explainer sections */}
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
                {sections.map((section) => (
                    <section key={section.heading} aria-label={section.heading}>
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
                    {howTo.map((step, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <span className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-200">
                                {i + 1}
                            </span>
                            <p className="text-zinc-400 leading-relaxed pt-1">{step}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Use cases */}
            <section aria-label="Common use cases" className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">When people use this tool</h2>
                <ul className="space-y-3">
                    {useCases.map((item, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <span className="shrink-0 w-2 h-2 rounded-full bg-zinc-600 mt-2.5" />
                            <p className="text-zinc-400 leading-relaxed">{item}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* FAQ */}
            <section aria-label="Frequently asked questions" className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently asked questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group bg-zinc-900/50 border border-zinc-800/60 p-4 sm:p-5 rounded-xl cursor-pointer open:bg-zinc-900"
                        >
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span className="transition-transform group-open:rotate-180 text-zinc-500 shrink-0">
                                    ▼
                                </span>
                            </summary>
                            <p className="text-zinc-400 mt-3 text-[15px] leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ToolSeoBody;
