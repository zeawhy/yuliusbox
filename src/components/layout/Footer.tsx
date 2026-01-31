"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Twitter, Mail, Coffee } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const { language } = useLanguage();

    const t = {
        support: { en: "Support the Developer", cn: "支持开发者" },
        kofi: { en: "Buy me a Coffee", cn: "请我喝杯咖啡" },
        built: { en: "Built by Yulius.", cn: "由 Yulius 构建。" }
    };

    return (
        <footer className="w-full py-12 mt-24 border-t border-zinc-900 flex flex-col items-center gap-8 text-zinc-500">
            {/* Support / Donation Section */}
            <div className="flex flex-col items-center gap-4">
                <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
                    {language === "en" ? t.support.en : t.support.cn}
                </p>
                <div className="flex gap-4">
                    <a
                        href="https://ko-fi.com/yuliuslux"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5E5B] text-white rounded-full text-sm font-bold hover:bg-[#FF5E5B]/90 hover:scale-105 transition-all shadow-lg shadow-[#FF5E5B]/20"
                    >
                        <Coffee className="w-4 h-4" />
                        <span>{language === "en" ? t.kofi.en : t.kofi.cn}</span>
                    </a>

                    <a
                        href="https://paypal.me/yuliuslux"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0070BA] text-white rounded-full text-sm font-bold hover:bg-[#0070BA]/90 hover:scale-105 transition-all shadow-lg shadow-[#0070BA]/20"
                    >
                        <span>PayPal</span>
                    </a>
                </div>
            </div>

            {/* Copyright & Socials */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900/50">
                <p className="text-sm">
                    © 2026 YuliusBox. {language === "en" ? t.built.en : t.built.cn}
                </p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                        <Twitter className="w-5 h-5" />
                    </Link>
                    <Link href="mailto:hello@example.com" className="hover:text-white transition-colors" aria-label="Email">
                        <Mail className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
