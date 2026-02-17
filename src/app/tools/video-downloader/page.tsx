"use client";

import { useState } from "react";
import { Download, Link2, Loader2, AlertCircle, FileVideo, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function VideoDownloader() {
    const { language } = useLanguage();
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [downloading, setDownloading] = useState(false);

    const t = {
        title: { en: "Social Media Video Downloader", cn: "全网无水印视频下载" },
        subtitle: { en: "Download videos from YouTube, TikTok, Instagram, Twitter, and more without watermarks.", cn: "支持 YouTube, TikTok, Instagram, Twitter 等全平台无水印视频解析下载。" },
        placeholder: { en: "Paste video link here...", cn: "在此粘贴视频链接..." },
        button: { en: "Extract Video", cn: "解析视频" },
        download: { en: "Download Video", cn: "下载视频" },
        downloading: { en: "Downloading...", cn: "下载中..." },
        cacheHit: { en: "⚡ Served from Cache", cn: "⚡ 秒级缓存命中" },
        error: { en: "Failed to extract video. Please check the link.", cn: "解析失败，请检查链接是否有效。" }
    };

    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/extract-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Extraction failed");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || t.error[language]);
        } finally {
            setIsLoading(false);
        }
    };

    // 客户端强制下载逻辑
    const handleDownload = async () => {
        if (!result?.videoUrl) return;

        setDownloading(true);
        const videoUrl = result.videoUrl;
        const filename = `yuliusbox_video_${Date.now()}.mp4`;

        try {
            // 1. 优先尝试 fetch blob 方案 (能强制下载并重命名)
            // 注意：这要求目标 CDN 支持 CORS (Access-Control-Allow-Origin: *)
            const response = await fetch(videoUrl);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // 清理
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (e) {
            console.error("Blob download failed (likely CORS), falling back to direct link:", e);

            // 2. 降级方案：直接创建 <a> 标签点击
            // 对于跨域链接，download 属性会被忽略，浏览器可能会直接播放视频
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = filename;
            link.target = "_blank"; // 在新标签页打开，防止当前页被覆盖
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    {t.title[language]}
                </h1>
                <p className="text-zinc-400 text-lg">{t.subtitle[language]}</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                <form onSubmit={handleExtract} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Link2 className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t.placeholder[language]}
                            className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-xl leading-5 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justifying-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto min-w-[120px]"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <>{t.button[language]}</>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                            {/* Result Header */}
                            <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Success
                                </div>
                                {result.fromCache && (
                                    <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                                        {t.cacheHit[language]}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                {/* Thumbnail */}
                                {result.thumbnail && (
                                    <div className="relative w-full md:w-64 aspect-video bg-zinc-800 rounded-lg overflow-hidden shrink-0 group">
                                        <img
                                            src={result.thumbnail}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                )}

                                {/* Info & Action */}
                                <div className="flex-1 flex flex-col justify-between gap-4">
                                    <div>
                                        {result.title && <h3 className="text-lg font-semibold text-zinc-100 line-clamp-2 mb-2">{result.title}</h3>}
                                        {result.uploader && <p className="text-zinc-400 text-sm">By {result.uploader}</p>}
                                        {result.duration && <p className="text-zinc-500 text-xs mt-1">Duration: {result.duration}</p>}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleDownload}
                                            disabled={downloading}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                        >
                                            {downloading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Download className="h-5 w-5" />
                                            )}
                                            {downloading ? t.downloading[language] : t.download[language]}
                                        </button>
                                        <p className="text-xs text-zinc-500 text-center">
                                            If download doesn't start, right click button and "Save Link As..."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Raw JSON Debug (Optional, remove in prod) */}
                        {/* <pre className="mt-4 p-4 bg-black/50 rounded-lg text-xs text-zinc-500 overflow-auto max-h-40">
                {JSON.stringify(result, null, 2)}
            </pre> */}
                    </div>
                )}
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
                {[
                    { icon: <FileVideo className="h-6 w-6 text-blue-400" />, title: "No Watermark", desc: "Get clean videos without platform logos." },
                    { icon: <Download className="h-6 w-6 text-purple-400" />, title: "Highest Quality", desc: "Downloads the best available resolution automatically." },
                    { icon: <Link2 className="h-6 w-6 text-emerald-400" />, title: "Universal Support", desc: "Works with major social platforms." },
                ].map((item, i) => (
                    <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl hover:bg-zinc-900/50 transition-colors">
                        <div className="bg-zinc-950 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-zinc-800">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-200 mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
