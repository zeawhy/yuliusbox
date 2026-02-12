"use client";

import { useState } from "react";
import { ArrowLeft, Send, Copy, Check, Database, Terminal, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type Dialect = "MySQL" | "PostgreSQL" | "SQLite";

export default function SqlBuilderClient() {
    const { language } = useLanguage();
    const [userInput, setUserInput] = useState("");
    const [dialect, setDialect] = useState<Dialect>("MySQL");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "AI SQL Query Builder", cn: "AI SQL 查询生成器" },
        subtitle: { en: "Generate optimized SQL queries from natural language.", cn: "通过自然语言生成优化的 SQL 查询语句。" },
        placeholder: { en: "e.g., Find all users who ordered more than $100 in the last 30 days...", cn: "例如：查找过去30天内下单超过 100 美元的所有用户..." },
        generate: { en: "Generate SQL", cn: "生成 SQL" },
        copy: { en: "Copy SQL", cn: "复制 SQL" },
    };

    const handleGenerate = async () => {
        if (!userInput.trim() || loading) return;
        setLoading(true);
        setResult("");

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_CF_WORKER_URL!, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "sql",
                    userInput,
                    dialect,
                    language: language === "cn" ? "cn" : "en",
                }),
            });

            const data = await response.json();
            if (data.result) {
                // Clean up any potential markdown code blocks
                const cleaned = data.result.replace(/```sql\n?|```/g, "").trim();
                setResult(cleaned);
            } else {
                setResult("-- Error generating query: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            setResult("-- Worker connection error");
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
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                        <Database className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400 mt-1">{language === "en" ? t.subtitle.en : t.subtitle.cn}</p>
                    </div>
                </div>
            </div>

            {/* Terminal Container */}
            <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                        </div>
                        <span className="ml-4 text-xs font-mono text-zinc-500">yuliusbox @ sql-builder</span>
                    </div>
                    <div className="flex p-0.5 bg-zinc-950 rounded-lg border border-zinc-800">
                        {(["MySQL", "PostgreSQL", "SQLite"] as Dialect[]).map((d) => (
                            <button
                                key={d}
                                onClick={() => setDialect(d)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase tracking-tighter",
                                    dialect === d ? "bg-blue-600 text-white" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Terminal Input Area */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <Terminal className="w-5 h-5 text-zinc-600 mt-1 shrink-0" />
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleGenerate();
                                }
                            }}
                            placeholder={language === "en" ? t.placeholder.en : t.placeholder.cn}
                            className="w-full bg-transparent border-none text-zinc-200 font-mono text-sm focus:outline-none resize-none leading-relaxed placeholder-zinc-800 min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !userInput.trim()}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {language === "en" ? t.generate.en : t.generate.cn}
                        </button>
                    </div>
                </div>

                {/* Terminal Output Area */}
                {(result || loading) && (
                    <div className="bg-zinc-900/30 border-t border-zinc-800 p-6 min-h-[200px] relative animate-in fade-in duration-500">
                        <div className="absolute top-4 right-4">
                            {result && !loading && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800"
                                >
                                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    {language === "en" ? t.copy.en : t.copy.cn}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-zinc-800/50 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-zinc-800/50 rounded animate-pulse" />
                            </div>
                        ) : (
                            <pre className="font-mono text-sm leading-relaxed text-blue-400 overflow-x-auto">
                                {result}
                            </pre>
                        )}

                        {!loading && result && (
                            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                <span className="text-[10px] text-zinc-700 font-mono italic">-- Generated via Qwen-Turbo</span>
                                <span className="text-[10px] text-zinc-700 font-mono">{dialect} Dialect</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
                {[
                    { en: "Natural Language", cn: "自然语言输入" },
                    { en: "High Performance", cn: "高性能查询" },
                    { en: "Multi Dialect", cn: "多方言支持" }
                ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-zinc-500">{language === "en" ? tip.en : tip.cn}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
