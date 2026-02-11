"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Copy, Check, Info, PenTool } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function EmailParaphraserPage() {
    const { language } = useLanguage();
    const [draft, setDraft] = useState("");
    const [tone, setTone] = useState<"professional" | "polite" | "friendly" | "persuasive">("professional");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Polite Email Paraphraser", cn: "职场邮件润色" },
        subtitle: { en: "Rewrite your emails to be professional, polite, and persuasive.", cn: "一键将草稿润色为得体、专业的商务英语邮件。" },
        draftLabel: { en: "Original Draft", cn: "原始草稿" },
        placeholder: {
            en: "Paste your rough email draft here...",
            cn: "在此粘贴您的邮件草稿（中文或英文皆可）..."
        },
        tone: { en: "Select Tone", cn: "选择语调" },
        tones: {
            professional: { en: "Professional", cn: "专业正式" },
            polite: { en: "Polite", cn: "委婉礼貌" },
            friendly: { en: "Friendly", cn: "友好亲切" },
            persuasive: { en: "Persuasive", cn: "有说服力" }
        },
        rewrite: { en: "Rewrite Email", cn: "一键润色" },
        rewriting: { en: "Polishing...", cn: "润色中..." },
        resultLabel: { en: "Polished Version", cn: "润色结果" },
        copy: { en: "Copy", cn: "复制" },
        tipsTitle: { en: "Why Tone Matters?", cn: "为什么语调很重要？" },
        tipsDesc: { en: "Different situations require different communication styles. Being overly formal can distance colleagues, while being too casual might undermine your authority.", cn: "不同的场合需要不同的沟通风格。过于正式可能会疏远同事，而过于随意可能会削弱您的权威。" }
    };

    const handleRewrite = async () => {
        if (!draft.trim()) return;
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
                    type: "email",
                    userInput: `Tone: ${tone}. Original Draft: ${draft}`
                })
            });

            if (!response.ok) {
                throw new Error("Failed to rewrite email");
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data.result);
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
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-6xl mx-auto">
            {/* Header */}
            <div className="w-full mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400 mt-1">{language === "en" ? t.subtitle.en : t.subtitle.cn}</p>
                    </div>
                </div>
            </div>

            <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col gap-8">
                {/* Tone Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <PenTool className="w-4 h-4" /> {language === "en" ? t.tone.en : t.tone.cn}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {(Object.keys(t.tones) as Array<keyof typeof t.tones>).map((key) => (
                            <button
                                key={key}
                                onClick={() => setTone(key)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    tone === key
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                                )}
                            >
                                {language === "en" ? t.tones[key].en : t.tones[key].cn}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 relative">
                    {/* Left: Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-zinc-300">{language === "en" ? t.draftLabel.en : t.draftLabel.cn}</label>
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder={language === "en" ? t.placeholder.en : t.placeholder.cn}
                            className="w-full flex-1 min-h-[300px] bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none leading-relaxed"
                        />
                        <button
                            onClick={handleRewrite}
                            disabled={loading || !draft.trim()}
                            className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-white/5"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Mail className="w-5 h-5 fill-black text-black" />
                            )}
                            {loading ? (language === "en" ? t.rewriting.en : t.rewriting.cn) : (language === "en" ? t.rewrite.en : t.rewrite.cn)}
                        </button>
                    </div>

                    {/* Divider for Mobile */}
                    <div className="lg:hidden h-px bg-zinc-800 w-full" />

                    {/* Right: Output */}
                    <div className="flex flex-col gap-3 relative">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-blue-400">{language === "en" ? t.resultLabel.en : t.resultLabel.cn}</label>
                            {result && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2 py-1 rounded-md"
                                >
                                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    {language === "en" ? t.copy.en : t.copy.cn}
                                </button>
                            )}
                        </div>

                        <div className="relative flex-1 min-h-[300px]">
                            {result ? (
                                <textarea
                                    value={result}
                                    onChange={(e) => setResult(e.target.value)}
                                    className="w-full h-full bg-zinc-900 border border-zinc-700/50 rounded-xl p-5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none leading-relaxed font-serif animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
                                    <Mail className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm">
                                        {language === "en" ? "Your polished email will appear here." : "润色后的邮件将显示在这里。"}
                                    </p>
                                </div>
                            )}

                            {/* Error Overlay */}
                            {error && (
                                <div className="absolute inset-x-0 bottom-4 mx-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center backdrop-blur-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="w-full max-w-2xl mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 text-sm text-blue-200/80">
                <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <div>
                    <h4 className="font-bold text-blue-400 mb-1">{language === "en" ? t.tipsTitle.en : t.tipsTitle.cn}</h4>
                    <p>{language === "en" ? t.tipsDesc.en : t.tipsDesc.cn}</p>
                </div>
            </div>
        </div>
    );
}
