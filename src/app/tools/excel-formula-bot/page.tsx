"use client";

import { useState } from "react";
import { ArrowLeft, Table, Copy, Check, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function ExcelFormulaBotPage() {
    const { language } = useLanguage();
    const [prompt, setPrompt] = useState("");
    const [platform, setPlatform] = useState<"excel" | "google-sheets">("excel");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Excel Formula Bot", cn: "Excel 公式生成器" },
        subtitle: { en: "Describe your problem in plain English, and AI will generate the formula.", cn: "用大白话描述你的需求，AI 帮你搞定复杂的 Excel 公式。" },
        inputLabel: { en: "What do you want to calculate?", cn: "你想计算什么？" },
        placeholder: {
            en: "Example: Sum column A if column B says 'Sales' and date in column C is today.",
            cn: "例如：如果 B 列是“销售”，且 C 列是今天的日期，则对 A 列求和。"
        },
        generate: { en: "Generate Formula", cn: "生成公式" },
        generating: { en: "Generating...", cn: "生成中..." },
        result: { en: "Your Formula:", cn: "生成的公式：" },
        copy: { en: "Copy", cn: "复制" },
        copied: { en: "Copied!", cn: "已复制！" },
        tips: { en: "Pro Tips", cn: "使用技巧" },
        tip1: { en: "Be specific about column names (e.g., Column A, Cell B2).", cn: "尽量具体指明列名（如 A 列，B2 单元格）。" },
        tip2: { en: "Mention special conditions like 'dates', 'text', or 'errors'.", cn: "提及特殊条件，如“日期”、“文本”或“错误处理”。" },
        affiliateTitle: { en: "Master Excel with ease", cn: "轻松精通 Excel" },
        affiliateDesc: { en: "Learn advanced Excel formulas and become a pro data analyst.", cn: "学习高级 Excel 公式，成为专业数据分析师。" },
        affiliateBtn: { en: "View Best Courses", cn: "查看精选课程" }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError("");
        setResult("");
        setCopied(false);

        try {
            const workerUrl = process.env.NEXT_PUBLIC_CF_WORKER_URL;
            if (!workerUrl) {
                throw new Error("Backend URL not configured");
            }

            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "excel",
                    userInput: `Platform: ${platform === 'excel' ? 'Excel' : 'Google Sheets'}. Question: ${prompt}`
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate formula");
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Clean up the result to remove markdown code blocks if present
            let cleanResult = data.result.trim();
            cleanResult = cleanResult.replace(/^```(excel|csv)?/, '').replace(/```$/, '').trim();

            setResult(cleanResult);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            {/* Header */}
            <div className="w-full mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Table className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400 mt-1">{language === "en" ? t.subtitle.en : t.subtitle.cn}</p>
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Platform Selector */}
                    <div className="flex gap-4 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-fit">
                        <button
                            onClick={() => setPlatform("excel")}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                platform === "excel" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            Microsoft Excel
                        </button>
                        <button
                            onClick={() => setPlatform("google-sheets")}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                platform === "google-sheets" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            Google Sheets
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-300">{language === "en" ? t.inputLabel.en : t.inputLabel.cn}</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={language === "en" ? t.placeholder.en : t.placeholder.cn}
                            className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <Zap className="w-5 h-5 fill-black" />
                        )}
                        {loading ? (language === "en" ? t.generating.en : t.generating.cn) : (language === "en" ? t.generate.en : t.generate.cn)}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Result Area */}
                    {result && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <label className="text-sm font-medium text-emerald-400">{language === "en" ? t.result.en : t.result.cn}</label>
                            <div className="relative group">
                                <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-lg text-emerald-400 break-all shadow-xl">
                                    {result}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-3 right-3 p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Tips Card */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {language === "en" ? t.tips.en : t.tips.cn}
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex gap-2">
                                <span className="text-emerald-500">•</span>
                                {language === "en" ? t.tip1.en : t.tip1.cn}
                            </li>
                            <li className="flex gap-2">
                                <span className="text-emerald-500">•</span>
                                {language === "en" ? t.tip2.en : t.tip2.cn}
                            </li>
                        </ul>
                    </div>

                    {/* Affiliate Card (Placeholder) */}
                    <div className="bg-gradient-to-br from-emerald-900/50 to-zinc-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors cursor-pointer">
                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-lg mb-2">{language === "en" ? t.affiliateTitle.en : t.affiliateTitle.cn}</h3>
                            <p className="text-sm text-zinc-300 mb-4">{language === "en" ? t.affiliateDesc.en : t.affiliateDesc.cn}</p>
                            <div className="flex items-center text-emerald-400 text-sm font-bold group-hover:gap-2 transition-all">
                                {language === "en" ? t.affiliateBtn.en : t.affiliateBtn.cn} <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
