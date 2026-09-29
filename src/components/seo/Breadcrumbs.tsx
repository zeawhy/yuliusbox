import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
    href: string;
    label: string;
}

/**
 * Breadcrumb navigation with BreadcrumbList structured data.
 * Place at the top of hub and long-tail pages.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            item: `https://www.yuliusbox.com${crumb.href}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="w-full mb-6 sm:mb-8">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
                    {trail.map((crumb, i) => {
                        const isLast = i === trail.length - 1;
                        return (
                            <li key={crumb.href} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />}
                                {isLast ? (
                                    <span aria-current="page" className="text-zinc-300 font-medium">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-white transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
