"use client";

import { Tool } from "@/lib/tools-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function ToolCard({ tool }: { tool: Tool }) {
    const { language } = useLanguage();
    const isComingSoon = tool.comingSoon;
    const Icon = tool.icon;

    const content = (
        <>
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl transition-colors",
                        !isComingSoon ? "bg-zinc-800 group-hover:bg-zinc-700" : "bg-zinc-800/50"
                    )}>
                        <Icon className={cn(
                            "w-6 h-6",
                            !isComingSoon ? "text-indigo-400" : "text-zinc-500"
                        )} />
                    </div>
                    {tool.popular && (
                        <span className="px-2.5 py-0.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                            {language === "en" ? "Popular" : "热门"}
                        </span>
                    )}
                    {tool.comingSoon && (
                        <span className="px-2.5 py-0.5 text-xs font-medium text-zinc-400 bg-zinc-800 rounded-full border border-zinc-700">
                            {language === "en" ? "Soon" : "即将推出"}
                        </span>
                    )}
                </div>

                <h3 className={cn(
                    "text-lg font-semibold mb-2 transition-colors",
                    !isComingSoon ? "text-zinc-100 group-hover:text-white" : "text-zinc-400"
                )}>
                    {language === "en" ? tool.name.en : tool.name.cn}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                    {language === "en" ? tool.description.en : tool.description.cn}
                </p>
            </div>

            {!isComingSoon && (
                <div className="mt-4 flex items-center text-sm font-medium text-zinc-400 group-hover:text-indigo-400 transition-colors">
                    {language === "en" ? "Open Tool" : "打开工具"} <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
            )}
        </>
    );

    const containerClasses = cn(
        "group relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300",
        !isComingSoon
            ? "hover:border-zinc-700 hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            : "opacity-60 cursor-not-allowed border-zinc-800/50"
    );

    if (isComingSoon) {
        return (
            <div className={containerClasses}>
                {content}
            </div>
        );
    }

    return (
        <Link
            href={tool.href}
            target={tool.href.startsWith("http") ? "_blank" : undefined}
            className={containerClasses}
        >
            {content}
        </Link>
    );
}
