"use client";

import { useState } from "react";
import { ArrowLeft, Code, Copy, Check, Eye, BookOpen, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function RegexGeneratorPage() {
    const { language } = useLanguage();
    const [mode, setMode] = useState<"generate" | "explain">("generate");
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "AI Regex Tool", cn: "正则生成器 & 解释器" },
        subtitle: { en: "Generate or explain complex regular expressions instantly.", cn: "瞬间生成或解释复杂的正则表达式。" },
        modeGenerate: { en: "Generate Regex", cn: "生成正则" },
        modeExplain: { en: "Explain Regex", cn: "解释正则" },
        placeholderGenerate: {
            en: "Describe what you want to match: e.g., 'Extract email addresses ending with .com'...",
            cn: "描述你想匹配的内容：例如“提取所有以 .com 结尾的邮箱地址”..."
        },
        placeholderExplain: {
            en: "Paste a regex pattern here to understand what it does...",
            cn: "在此粘贴一段正则表达式，AI 帮您解释它的含义..."
        },
        labelInput: { en: "Your Input", cn: "输入内容" },
        actionGenerate: { en: "Generate Pattern", cn: "生成正则表达式" },
        actionExplain: { en: "Explain Pattern", cn: "解释正则表达式" },
        processing: { en: "Processing...", cn: "处理中..." },
        result: { en: "Result", cn: "结果" },
        copy: { en: "Copy", cn: "复制" },
        explainWarning: { en: "Note: Explanation may be concise due to system limits.", cn: "注意：受系统限制，解释内容可能较为精简。" }

    };

    const handleAction = async () => {
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

            // Construct prompt based on mode
            const finalPrompt = mode === 'generate'
                ? `Generate a regex for: ${prompt}`
                : `Explain this regex in detail: ${prompt}`;

            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "regex",
                    userInput: finalPrompt,
                    language: language
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error(`Server Error: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                throw new Error(data.error || `Request failed: ${response.status} ${response.statusText}`);
            }

            if (data.error) throw new Error(data.error);

            // Clean up result (remove markdown blocks if present for generation mode, keep for explain)
            let cleanResult = data.result;
            if (mode === 'generate') {
                cleanResult = cleanResult.replace(/^```(regex)?/, '').replace(/```$/, '').trim();
            }

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
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-4xl mx-auto">
            {/* Header */}
            <div className="w-full mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500 text-center sm:text-left">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6 mx-auto sm:mx-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center sm:justify-start">
                    <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]">
                        <Code className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400 mt-1 max-w-lg">{language === "en" ? t.subtitle.en : t.subtitle.cn}</p>
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-8 w-full max-w-md">
                <button
                    onClick={() => { setMode("generate"); setResult(""); setPrompt(""); }}
                    className={cn(
                        "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                        mode === "generate" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <Code className="w-4 h-4" />
                    {language === "en" ? t.modeGenerate.en : t.modeGenerate.cn}
                </button>
                <button
                    onClick={() => { setMode("explain"); setResult(""); setPrompt(""); }}
                    className={cn(
                        "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                        mode === "explain" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <BookOpen className="w-4 h-4" />
                    {language === "en" ? t.modeExplain.en : t.modeExplain.cn}
                </button>
            </div>

            <div className="w-full space-y-8">
                {/* Input Area */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 relative group focus-within:border-purple-500/50 transition-colors">
                    <label className="text-sm font-medium text-purple-400 mb-3 block uppercase tracking-wider">{language === "en" ? t.labelInput.en : t.labelInput.cn}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={mode === "generate"
                            ? (language === "en" ? t.placeholderGenerate.en : t.placeholderGenerate.cn)
                            : (language === "en" ? t.placeholderExplain.en : t.placeholderExplain.cn)
                        }
                        className="w-full min-h-[120px] bg-transparent text-white placeholder-zinc-600 focus:outline-none resize-none text-lg font-light"
                    />
                    <div className="absolute right-4 bottom-4">
                        <button
                            onClick={handleAction}
                            disabled={loading || !prompt.trim()}
                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                mode === "generate" ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />
                            )}
                            {loading
                                ? (language === "en" ? t.processing.en : t.processing.cn)
                                : (mode === "generate" ? (language === "en" ? t.actionGenerate.en : t.actionGenerate.cn) : (language === "en" ? t.actionExplain.en : t.actionExplain.cn))
                            }
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Warning for Explain Mode */}
                {mode === "explain" && !result && !error && (
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                        <Info className="w-3 h-3" />
                        {language === "en" ? t.explainWarning.en : t.explainWarning.cn}
                    </div>
                )}

                {/* Result Area */}
                {result && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-sm font-medium text-zinc-400">{language === "en" ? t.result.en : t.result.cn}</label>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-full"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {language === "en" ? t.copy.en : t.copy.cn}
                            </button>
                        </div>

                        <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl overflow-x-auto relative group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
                            <pre className="font-mono text-base text-purple-300 whitespace-pre-wrap leading-relaxed">
                                {result}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
