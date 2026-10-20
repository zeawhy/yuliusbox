"use client";

import { useState } from "react";
import { toolsData, ToolCategory } from "@/lib/tools-data";
import { ToolCard } from "@/components/ui/ToolCard";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORY_SECTIONS: { key: ToolCategory; label: { en: string; cn: string } }[] = [
    { key: "media", label: { en: "Media", cn: "媒体设计" } },
    { key: "productivity", label: { en: "Productivity", cn: "效率工具" } },
    { key: "developer", label: { en: "Developer", cn: "开发者工具" } },
];

export function ToolsDirectory() {
    const { language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

    const visible = toolsData.filter(
        (tool) => activeCategory === "all" || tool.category === activeCategory
    );

    return (
        <>
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            {activeCategory === "all" ? (
                // "All" view: every tool, grouped by category with headings so
                // the full catalogue is scannable (and crawlable) in one pass.
                <div className="flex flex-col gap-12 w-full">
                    {CATEGORY_SECTIONS.map(({ key, label }) => {
                        const tools = toolsData.filter((tool) => tool.category === key);
                        if (tools.length === 0) return null;
                        return (
                            <section key={key} aria-label={label.en}>
                                <h2 className="text-xl font-bold text-white mb-5">
                                    {language === "en" ? label.en : label.cn}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                                    {tools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {visible.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            )}
            <p className="text-sm text-zinc-500 text-center mt-2">
                {language === "en"
                    ? `Showing ${visible.length} of ${toolsData.length} tools.`
                    : `共 ${toolsData.length} 个工具，当前显示 ${visible.length} 个。`}
            </p>
        </>
    );
}
