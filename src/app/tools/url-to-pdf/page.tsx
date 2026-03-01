"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck, CheckCircle, Loader2, AlertCircle, Globe, Link2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function UrlToPdfPage() {
    const { language } = useLanguage();

    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Website to PDF Converter", cn: "网页转 PDF 工具" },
        desc: { en: "Convert any public URL or website into a high-quality PDF document securely.", cn: "将任何公开的网页链接快速转换并保存为高质量的 PDF 文档。" },
        secure: { en: "Secure Cloud Processing", cn: "云端安全处理" },
        inputPlaceholder: { en: "https://example.com", cn: "https://example.com" },
        converting: { en: "Converting to PDF...", cn: "正在转换为 PDF..." },
        success: { en: "Conversion Successful! Download starting...", cn: "转换成功！即将开始下载..." },
        btnConvert: { en: "Convert to PDF", cn: "转换为 PDF" },
        btnNew: { en: "Convert Another URL", cn: "转换新网页" }
    };

    const convertUrl = async (e: React.FormEvent) => {
        e.preventDefault();

        let validUrl = url.trim();
        if (!validUrl) return;

        // Auto prepend https if missing
        if (!/^https?:\/\//i.test(validUrl)) {
            validUrl = `https://${validUrl}`;
            setUrl(validUrl);
        }

        setStatus("converting");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("url", validUrl);

        try {
            const response = await fetch("/api/tools/url-to-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));

                if (response.status === 429) {
                    throw new Error(language === "en"
                        ? "You have reached the conversion limit (5 per minute). Please wait a moment."
                        : "转换已达上限 (每分钟 5 次)。请稍后再试。");
                }

                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            // Extract a safe filename from the URL domain
            let baseName = "website";
            try {
                const parsedUrl = new URL(validUrl);
                baseName = parsedUrl.hostname.replace(/[^a-zA-Z0-9_-]/g, '_');
            } catch (e) { /* ignore invalid url parse error for filename */ }

            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `${baseName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);

            setStatus("success");

        } catch (error: any) {
            console.error("Conversion failed:", error);
            setStatus("error");
            setErrorMessage(error.message || (language === "en" ? "Conversion failed. Please verify the URL." : "转换失败，请检查链接是否正确公开。"));
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-4xl mx-auto">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="hidden sm:flex items-center text-green-500/80 font-mono text-xs gap-1.5 border border-green-500/20 bg-green-500/10 px-3 py-1.5 rounded-full">
                    <Globe className="w-3.5 h-3.5" />
                    {language === "en" ? t.secure.en : t.secure.cn}
                </div>
            </div>

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {language === "en" ? t.desc.en : t.desc.cn}
                    </p>
                </div>

                {/* Mobile Secure Badge */}
                <div className="sm:hidden flex items-center justify-center mb-4 text-green-500/80 text-xs gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {language === "en" ? t.secure.en : t.secure.cn}
                </div>

                {/* Input Area */}
                <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                    {status === "success" ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-full p-6 text-center bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <p className="text-green-400 font-medium truncate max-w-sm">
                                    {language === "en" ? t.success.en : t.success.cn}
                                </p>
                            </div>
                            <button
                                onClick={() => { setUrl(""); setStatus("idle"); }}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium"
                            >
                                {language === "en" ? t.btnNew.en : t.btnNew.cn}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
                            <form onSubmit={convertUrl} className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Link2 className="h-5 w-5 text-zinc-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder={language === "en" ? t.inputPlaceholder.en : t.inputPlaceholder.cn}
                                            className="block w-full pl-11 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-zinc-100 placeholder-zinc-600 outline-none transition-all"
                                            disabled={status === "converting"}
                                            required
                                        />
                                    </div>
                                </div>

                                {status === "error" && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div className="text-sm">{errorMessage}</div>
                                    </div>
                                )}

                                <div>
                                    {status === "converting" ? (
                                        <div className="w-full py-4 bg-indigo-500/20 text-indigo-400 font-semibold rounded-xl flex items-center justify-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {language === "en" ? t.converting.en : t.converting.cn}
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={!url.trim()}
                                            className="w-full py-4 bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white font-semibold rounded-xl transition-colors flex items-center justify-center"
                                        >
                                            {language === "en" ? t.btnConvert.en : t.btnConvert.cn}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-3xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "How it works" : "工作原理"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en"
                            ? "This tool is powered by a secure, containerized Chromium engine (Gotenberg). When you submit a URL, our cloud worker fetches the webpage, renders all CSS and JavaScript just like a real browser, prints the fully loaded page to a PDF, and delivers it to you."
                            : "本工具底层的转换引擎基于安全的容器化 Chromium (Gotenberg)。当您提交链接时，我们的云节点会像真实的浏览器一样抓取网页、渲染所有 CSS 和 JavaScript，然后将完整加载的页面导出为 PDF 并传送给您。"}
                    </p>
                </div>
            </section>
        </div>
    );
}
