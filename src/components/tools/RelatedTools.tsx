import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolsData } from "@/lib/tools-data";

/**
 * Server component: renders link cards for tools in the same category
 * as the tool identified by `slug` (e.g. "word-to-pdf"). External
 * sister-site entries (absolute URLs) are skipped.
 */
export function RelatedTools({ slug, limit = 6 }: { slug: string; limit?: number }) {
    const current = toolsData.find((t) => t.href === `/tools/${slug}`);
    if (!current) return null;

    const related = toolsData
        .filter(
            (t) =>
                t.category === current.category &&
                t.id !== current.id &&
                t.href.startsWith("/tools/") &&
                !t.comingSoon
        )
        .slice(0, limit);

    if (related.length === 0) return null;

    return (
        <section aria-label="Related tools" className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Related tools</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <li key={tool.id}>
                            <Link
                                href={tool.href}
                                className="group flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900 transition-all h-full"
                            >
                                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white shrink-0 mt-0.5" />
                                <span className="flex-1 min-w-0">
                                    <span className="flex items-center justify-between gap-2">
                                        <span className="text-zinc-200 group-hover:text-white font-medium text-[15px]">
                                            {tool.name.en}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 shrink-0" />
                                    </span>
                                    <span className="block text-sm text-zinc-400 mt-1 leading-relaxed">
                                        {tool.description.en}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default RelatedTools;
