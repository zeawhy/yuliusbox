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
    // Normalize /tools/* trails so every tool and subpage includes the /tools hub
    // and uses consistent naming ("PDF Kit" instead of "PDF Tools").
    const normalized: Crumb[] = [];
    for (let i = 0; i < trail.length; i++) {
        const raw = trail[i];
        const crumb: Crumb =
            raw.href === "/tools/pdf-kit" && raw.label === "PDF Tools"
                ? { href: raw.href, label: "PDF Kit" }
                : raw;
        if (
            i === 1 &&
            trail[0]?.href === "/" &&
            crumb.href.startsWith("/tools/")
        ) {
            normalized.push({ href: "/tools", label: "Tools" });
        }
        normalized.push(crumb);
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: normalized.map((crumb, i) => ({
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
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-400">
                    {normalized.map((crumb, i) => {
                        const isLast = i === normalized.length - 1;
                        return (
                            <li key={crumb.href} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />}
                                {isLast ? (
                                    <span aria-current="page" className="inline-block py-3 -my-3 text-zinc-300 font-medium">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        prefetch={false}
                                        className="inline-block py-3 -my-3 hover:text-white transition-colors"
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
