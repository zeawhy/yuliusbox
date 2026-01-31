"use client";

import { toolsData } from "@/lib/tools-data";
import { ToolCard } from "@/components/ui/ToolCard";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "Privacy-First Web Tools",
      cn: "隐私优先的 Web 生产力工具箱"
    },
    subtitle: {
      en: "for Productivity.",
      cn: "" // Combined in title for CN or just leave empty part? 
      // User request: "Privacy-First Web Tools for Productivity" -> "隐私优先的 Web 生产力工具箱"
      // My UI splits it: "Privacy-First Web Tools" <br> <span>"for Productivity"</span>
      // Let's adjust for CN.
    },
    description: {
      en: "A collection of free, client-side, and secure utilities. No ads, no tracking, just useful tools that respect your data.",
      cn: "集合了免费、纯本地运行、安全的实用工具。无广告、无追踪，完全保障您的数据隐私。"
    },
    cta: {
      en: "Explore Tools",
      cn: "探索工具"
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-24 max-w-7xl mx-auto">
      <Header />

      {/* Hero Section */}
      <main className="w-full flex-1 flex flex-col items-start gap-16 sm:gap-24">
        <section className="flex flex-col gap-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            {language === "en" ? (
              <>
                Privacy-First Web Tools <br />
                <span className="text-zinc-500">for Productivity.</span>
              </>
            ) : (
              "隐私优先的 Web 生产力工具箱"
            )}
          </h1>
          <p className="text-lg sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {language === "en" && (
              <>
                A collection of free, client-side, and secure utilities. <br className="hidden sm:block" />
                No ads, no tracking, just useful tools that respect your data.
              </>
            )}
            {language === "cn" && (
              "集合了免费、纯本地运行、安全的实用工具。无广告、无追踪，完全保障您的数据隐私。"
            )}
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="#tools"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-zinc-950 bg-white rounded-full hover:bg-zinc-200 hover:scale-105 transition-all duration-300"
            >
              {language === "en" ? t.cta.en : t.cta.cn}
            </Link>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="w-full scroll-mt-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
