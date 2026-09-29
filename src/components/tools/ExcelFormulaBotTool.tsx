"use client";

import { useState } from "react";
import { Copy, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExcelFormulaBotToolProps {
    /** Prefills the question textarea (initial state only; user can edit). */
    defaultPrompt?: string;
    /** Preselects the platform tab (initial state only; user can switch). */
    defaultPlatform?: "excel" | "google-sheets";
}

const STRINGS = {
    inputLabel: "What do you want to calculate?",
    placeholder: "Example: Sum column A if column B says 'Sales' and date in column C is today.",
    generate: "Generate Formula",
    generating: "Generating...",
    result: "Your Formula:",
};

export function ExcelFormulaBotTool({ defaultPrompt, defaultPlatform }: ExcelFormulaBotToolProps) {
    const [prompt, setPrompt] = useState(defaultPrompt ?? "");
    const [platform, setPlatform] = useState<"excel" | "google-sheets">(
        defaultPlatform === "google-sheets" ? "google-sheets" : "excel"
    );
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

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
                    userInput: `Platform: ${platform === 'excel' ? 'Excel' : 'Google Sheets'}. Question: ${prompt}`,
                    language: "en"
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
        <div className="w-full space-y-6">
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
                <label className="text-sm font-medium text-zinc-300">{STRINGS.inputLabel}</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={STRINGS.placeholder}
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
                {loading ? STRINGS.generating : STRINGS.generate}
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
                    <label className="text-sm font-medium text-emerald-400">{STRINGS.result}</label>
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
    );
}
