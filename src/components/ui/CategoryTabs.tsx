"use client";

import { cn } from "@/lib/utils";
import { ToolCategory } from "@/lib/tools-data";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutGrid, Code, Image, Activity } from "lucide-react";

interface CategoryTabsProps {
    activeCategory: ToolCategory | "all";
    onCategoryChange: (category: ToolCategory | "all") => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
    const { language } = useLanguage();

    const categories = [
        { id: "all", label: { en: "All", cn: "全部" }, icon: LayoutGrid },
        { id: "developer", label: { en: "Developer", cn: "开发者工具" }, icon: Code },
        { id: "media", label: { en: "Media", cn: "媒体设计" }, icon: Image },
        { id: "productivity", label: { en: "Productivity", cn: "效率工具" }, icon: Activity },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 w-fit">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                            isActive
                                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-black" : "text-zinc-500")} />
                        {language === "en" ? cat.label.en : cat.label.cn}
                    </button>
                );
            })}
        </div>
    );
}
