interface FaqItem {
    question?: string;
    q?: string;
    answer?: string;
    a?: string;
}

interface FaqSectionProps {
    items: FaqItem[];
    title?: string;
    className?: string;
}

/**
 * Reusable FAQ section component that renders both visible accordions
 * and identical FAQPage JSON-LD structured data from a single source of truth.
 */
export function FaqSection({
    items,
    title = "Frequently asked questions",
    className = "",
}: FaqSectionProps) {
    const normalized = items.map((item) => ({
        question: (item.question || item.q || "").trim(),
        answer: (item.answer || item.a || "").trim(),
    }));

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: normalized.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <section aria-label={title} className={`w-full max-w-3xl mx-auto ${className}`.trim()}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="space-y-3">
                {normalized.map((item) => (
                    <details
                        key={item.question}
                        className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 transition-colors open:bg-zinc-900 cursor-pointer"
                    >
                        <summary className="font-medium text-zinc-200 list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                            <span>{item.question}</span>
                            <span
                                aria-hidden="true"
                                className="transition-transform group-open:rotate-180 text-zinc-500 shrink-0 text-xs"
                            >
                                ▼
                            </span>
                        </summary>
                        <p className="text-zinc-400 mt-3 text-[15px] leading-relaxed">
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}
