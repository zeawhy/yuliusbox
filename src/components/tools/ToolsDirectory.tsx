"use client";

import { useState } from "react";
import { toolsData, ToolCategory } from "@/lib/tools-data";
import { ToolCard } from "@/components/ui/ToolCard";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { useLanguage } from "@/context/LanguageContext";

export function ToolsDirectory() {
    const { language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

    const visible = toolsData.filter(
        (tool) => activeCategory === "all" || tool.category === activeCategory
    );

    return (
        <>
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {visible.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
            <p className="text-sm text-zinc-500 text-center mt-2">
                {language === "en"
                    ? `Showing ${visible.length} of ${toolsData.length} tools.`
                    : `共 ${toolsData.length} 个工具，当前显示 ${visible.length} 个。`}
            </p>
        </>
    );
}
