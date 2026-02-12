"use client";

import { useState } from "react";
import { Youtube, Sparkles, Copy, Loader2, Hash, Type } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface OptimizationResult {
    titles: string[];
    tags: string[];
}

export default function YoutubeOptimizer() {
    const { language } = useLanguage();
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const t = {
        title: language === 'cn' ? "YouTube 爆款标题生成器" : "YouTube Title Optimizer",
        subtitle: language === 'cn' ? "利用 AI 生成高点击率的标题和 SEO 标签。" : "Generate viral, high-CTR titles and SEO tags powered by AI.",
        inputLabel: language === 'cn' ? "您的视频主题是什么？" : "What is your video about?",
        placeholder: language === 'cn' ? "例如：如何在家做正宗的意大利面..." : "e.g., How to cook authentic pasta at home...",
        button: language === 'cn' ? "一键优化" : "Optimize Now",
        titles: language === 'cn' ? "推荐标题" : "Viral Titles",
        tags: language === 'cn' ? "SEO 标签" : "SEO Tags",
        copy: language === 'cn' ? "复制" : "Copy",
        copied: language === 'cn' ? "已复制" : "Copied"
    };

    const handleOptimize = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const workerUrl = process.env.NEXT_PUBLIC_CF_WORKER_URL;
            if (!workerUrl) throw new Error("Backend URL not configured");

            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "youtube",
                    userInput: topic,
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

            // Parse the result which should be a JSON string from AI
            let parsedResult;
            try {
                // The AI returns a JSON string, we need to parse it
                // We'll sanitise it first just in case there are markdown blocks
                const jsonStr = data.result.replace(/```json/g, "").replace(/```/g, "").trim();
                parsedResult = JSON.parse(jsonStr);
            } catch (e) {
                // Fallback if AI didn't return strict JSON
                console.error("Failed to parse JSON from AI", e);
                throw new Error("AI response format error. Please try again.");
            }

            setResult(parsedResult);

        } catch (err: any) {
            setError(err.message || "Failed to generate optimization.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
            <div className="container mx-auto px-4 py-12 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-red-600/10 rounded-2xl mb-4 ring-1 ring-red-600/20">
                        <Youtube className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8 shadow-2xl mb-8">
                    <label className="block text-sm font-medium text-zinc-400 mb-3 ml-1">
                        {t.inputLabel}
                    </label>
                    <div className="relative">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={t.placeholder}
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-2xl p-4 text-zinc-100 text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none h-32"
                        />
                        <button
                            onClick={handleOptimize}
                            disabled={loading || !topic.trim()}
                            className="absolute bottom-4 right-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            {t.button}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {result && (
                    <div className="grid md:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-500">
                        {/* Titles - taking up 2 columns */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                                <Type className="w-6 h-6 text-red-500" />
                                {t.titles}
                            </h3>
                            <div className="space-y-4">
                                {result.titles.map((title, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => copyToClipboard(title, idx)}
                                        className="group bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-red-500/30 rounded-2xl p-4 cursor-pointer transition-all flex items-start justify-between gap-4"
                                    >
                                        <p className="text-zinc-200 font-medium leading-relaxed group-hover:text-white transition-colors">{title}</p>
                                        <div className="text-zinc-500 group-hover:text-red-400 transition-colors pt-1">
                                            {copiedIndex === idx ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags - taking up 1 column */}
                        <div className="space-y-6">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                                <Hash className="w-6 h-6 text-orange-500" />
                                {t.tags}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.tags.map((tag, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => copyToClipboard(tag, idx + 100)} // Offset details index
                                        className="bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white text-sm px-3 py-1.5 rounded-full transition-all"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500 text-xs leading-relaxed">
                                Tip: Mix broad tags (e.g., #cooking) with specific tags (e.g., #authenticpasta) for best reach.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icon
function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
