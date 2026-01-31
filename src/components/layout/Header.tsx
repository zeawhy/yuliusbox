"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
    const { language, setLanguage } = useLanguage();

    return (
        <header className="w-full flex justify-between items-center py-6 mb-16 sm:mb-24">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white select-none">YuliusBox</h1>
            </div>
            <nav className="flex items-center gap-4">
                <button
                    onClick={() => setLanguage(language === "en" ? "cn" : "en")}
                    className="px-3 py-1.5 rounded-full bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                    aria-label="Switch Language"
                >
                    {language === "en" ? "🇺🇸 English" : "🇨🇳 中文"}
                </button>

                <Link
                    href="https://github.com/zeawhy/yuliusbox"
                    target="_blank"
                    className="p-2 text-zinc-400 hover:text-white transition-colors block"
                    aria-label="GitHub"
                >
                    <Github className="w-6 h-6" />
                </Link>
            </nav>
        </header>
    );
}
