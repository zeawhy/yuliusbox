"use client";

import { useState } from "react";
import { ArrowLeft, Send, Copy, Check, Clock, Loader2, Sparkles, HelpCircle, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface CronResult {
    expression: string;
    description: string;
}

export default function CronGeneratorClient() {
    const { language } = useLanguage();
    const [userInput, setUserInput] = useState("");
    const [result, setResult] = useState<CronResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "AI Cron Generator", cn: "AI Cron 表达式生成器" },
        subtitle: { en: "Describe your schedule in plain English/Chinese and get the Cron expression.", cn: "用通俗易懂的语言描述您的调度需求，快速生成 Cron 表达式。" },
        placeholder: { en: "e.g., Every 15 minutes on weekdays...", cn: "例如：工作日每 15 分钟执行一次..." },
        generate: { en: "Generate Expression", cn: "生成表达式" },
        copy: { en: "Copy Cron", cn: "复制表达式" },
        resultLabel: { en: "Generated Cron Expression", cn: "生成的 Cron 表达式" },
    };

    const handleGenerate = async () => {
        if (!userInput.trim() || loading) return;
        setLoading(true);
        setResult(null);
        setError("");

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_CF_WORKER_URL!, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "cron",
                    userInput,
                    language: language === "cn" ? "cn" : "en",
                }),
            });

            const data = await response.json();
            if (data.result) {
                try {
                    // Handle potential markdown backticks in response
                    const cleanedResult = data.result.replace(/```json|```/g, "").trim();
                    const parsed = JSON.parse(cleanedResult);
                    setResult(parsed);
                } catch (e) {
                    // Fallback if AI didn't return valid JSON
                    setResult({ expression: data.result.trim(), description: "" });
                }
            } else {
                setError(data.error || "Generation failed");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result?.expression) return;
        navigator.clipboard.writeText(result.expression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-zinc-800 rounded-2xl border border-zinc-700 mb-6 shadow-xl">
                        <Clock className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        {language === "en" ? t.title.en : t.title.cn}
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-lg font-medium">
                        {language === "en" ? t.subtitle.en : t.subtitle.cn}
                    </p>
                </div>
            </div>

            {/* Input Box */}
            <div className="w-full bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8 shadow-2xl relative overflow-hidden group mb-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-50" />

                <div className="flex flex-col gap-6">
                    <div className="relative">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleGenerate();
                                }
                            }}
                            placeholder={language === "en" ? t.placeholder.en : t.placeholder.cn}
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-2xl p-6 text-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all min-h-[120px] shadow-inner font-medium"
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] text-zinc-600 font-mono flex items-center gap-1">
                            {language === "en" ? "Press CMD+Enter to generate" : "按 CMD+Enter 快速生成"}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !userInput.trim()}
                        className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                        {language === "en" ? t.generate.en : t.generate.cn}
                    </button>
                </div>
            </div>

            {/* Output Result */}
            {(result || loading || error) && (
                <div className="w-full animate-in zoom-in-95 fade-in duration-500">
                    <div className="flex flex-col items-center gap-6">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{language === "en" ? t.resultLabel.en : t.resultLabel.cn}</label>

                        <div className="w-full bg-zinc-950 rounded-[2.5rem] border border-zinc-800 p-8 sm:p-12 flex flex-col items-center text-center relative group shadow-2xl overflow-hidden">
                            {loading ? (
                                <div className="h-24 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center gap-3 text-red-500">
                                    <span className="text-lg font-bold">Error</span>
                                    <p className="text-sm text-zinc-500">{error}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-8 w-full">
                                    <div className="relative group/expr">
                                        <span className="text-2xl sm:text-4xl font-mono font-bold tracking-wider text-emerald-400 break-all bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.1)] transition-all group-hover/expr:border-emerald-500/40">
                                            {result?.expression}
                                        </span>
                                    </div>

                                    {result?.description && (
                                        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
                                            <div className="flex items-center justify-center gap-2 mb-2 text-zinc-500">
                                                <Activity className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{language === "en" ? "Schedule Translation" : "调度释义"}</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                                                {result.description}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-3 px-8 py-3 bg-white text-black hover:bg-zinc-200 transition-all rounded-full font-bold text-sm shadow-lg active:scale-95"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                        {language === "en" ? t.copy.en : t.copy.cn}
                                    </button>
                                </div>
                            )}

                            {/* Decorative Background Glow */}
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                        </div>
                    </div>
                </div>
            )}

            {/* Helper Section */}
            {!result && !loading && !error && (
                <div className="mt-8 flex items-start gap-4 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 max-w-xl mx-auto">
                    <HelpCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold mb-1 text-sm">{language === "en" ? "Tips" : "使用小技巧"}</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                            {language === "en"
                                ? "Cron expressions follow the standard 5-field format: minute, hour, day, month, and day of week. You can also ask for specific timezones or complex intervals like 'last Friday of every month'."
                                : "Cron 表达式遵循标准 5 字段格式：分、时、日、月、周。您可以描述复杂的时间间隔，例如“每月最后一个周五”或“每天早上 8 点到晚上 10 点之间每小时”。"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
