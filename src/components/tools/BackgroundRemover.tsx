"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Eraser, Download, Upload, RefreshCw, Layers, Zap, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function BackgroundRemover() {
    const { language } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [originalImg, setOriginalImg] = useState<string | null>(null);
    const [resultImg, setResultImg] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "AI Background Remover", cn: "AI 智能抠图" },
        subtitle: { en: "Remove backgrounds instantly using AI. 100% private, processing happens entirely in your browser.", cn: "超强 AI 自动抠图。100% 隐私保护，所有处理均在您的浏览器本地进行。" },
        upload: { en: "Select Image", cn: "选择图片" },
        processing: { en: "Removing Background...", cn: "正在智能抠图..." },
        download: { en: "Download PNG", cn: "下载透明 PNG" },
        tips: { en: "Note: The first run may take a few seconds to download the AI models (~20MB).", cn: "说明：首次运行需要下载 AI 模型（约 20MB），可能需要几秒钟时间。" },
        compare: { en: "Drag to Compare", cn: "拖动滑块对比" }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOriginalImg(URL.createObjectURL(file));
            setResultImg(null);
            handleRemoveBackground(file);
        }
    };

    const handleRemoveBackground = async (image: File | string) => {
        setIsProcessing(true);
        setProgress(0);

        try {
            // Use esm.sh which automatically resolves deep dependencies like onnxruntime-web
            // Doungraded to v1.4.5 because data package on npm only goes up to 1.4.5
            // @ts-ignore
            const module = await (import(/* webpackIgnore: true */ 'https://esm.sh/@imgly/background-removal@1.4.5') as any);
            const removeBackground = module.removeBackground;

            const config: any = {
                // Use absolute path for local assets to avoid "Invalid base URL" errors
                publicPath: `${window.location.protocol}//${window.location.host}/models/`,
                progress: (p: any) => {
                    if (typeof p === 'number') setProgress(Math.round((p as number) * 100));
                },
                output: {
                    format: "image/png",
                    quality: 0.8
                }
            };

            const blob = await removeBackground(image, config);
            const url = URL.createObjectURL(blob);
            setResultImg(url);
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Failed to remove background. Please try again with a different image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (!resultImg) return;
        const link = document.createElement("a");
        link.href = resultImg;
        link.download = "yuliusbox-no-bg.png";
        link.click();
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPos(Number(e.target.value));
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>

                <div className="flex flex-col items-start text-left">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6 shadow-xl">
                        <Eraser className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        {language === "en" ? "AI Background " : "AI 智能"}
                        <span className="text-zinc-500 font-medium">{language === "en" ? "Remover" : "抠图"}</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        {language === "en" ? t.subtitle.en : t.subtitle.cn}
                    </p>
                </div>
            </div>

            {!originalImg ? (
                <div className="w-full h-[400px] bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-blue-500/30 transition-all duration-500">
                    <div className="p-6 bg-zinc-900 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                        <Upload className="w-12 h-12 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <label className="bg-white text-black px-8 py-4 rounded-2xl font-black text-lg hover:bg-zinc-200 transition-all cursor-pointer shadow-xl">
                        {language === "en" ? t.upload.en : t.upload.cn}
                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                    </label>
                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <Info className="w-4 h-4" /> {language === "en" ? t.tips.en : t.tips.cn}
                    </p>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-8">
                    {/* Main Area */}
                    <div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-950 rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden group">
                        {isProcessing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-zinc-950/80 backdrop-blur-sm z-20">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor" strokeWidth="8"
                                            fill="transparent" className="text-zinc-800"
                                        />
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor" strokeWidth="8"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 * (1 - progress / 100)}
                                            strokeLinecap="round"
                                            fill="transparent" className="text-blue-500 transition-all duration-300"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                                        {progress}%
                                    </div>
                                </div>
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                                    {language === "en" ? t.processing.en : t.processing.cn}
                                </p>
                            </div>
                        ) : resultImg ? (
                            /* Comparison Slider */
                            <div className="relative w-full h-full cursor-col-resize" ref={containerRef}>
                                {/* Result (Background) */}
                                <div
                                    className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-zinc-900"
                                    style={{
                                        backgroundImage: `url(${resultImg})`,
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />

                                {/* Original (Overlay) */}
                                <div
                                    className="absolute inset-0 w-full h-full overflow-hidden"
                                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url(${originalImg})`,
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                </div>

                                {/* Slider Handle */}
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={sliderPos}
                                    onChange={handleSliderChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-col-resize"
                                />
                                <div
                                    className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] pointer-events-none z-10"
                                    style={{ left: `${sliderPos}%` }}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                                        <div className="flex gap-0.5">
                                            <div className="w-1 h-3 bg-zinc-200 rounded-full" />
                                            <div className="w-1 h-3 bg-zinc-200 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest">Original</div>
                                <div className="absolute bottom-6 right-6 px-4 py-2 bg-blue-500/50 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest">AI Result</div>
                            </div>
                        ) : (
                            /* Just Original */
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: `url(${originalImg})`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <label className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all cursor-pointer shadow-xl flex items-center gap-3">
                            <Upload className="w-5 h-5" />
                            {language === "en" ? t.upload.en : t.upload.cn}
                            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                        </label>

                        {resultImg && (
                            <button
                                onClick={downloadResult}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl flex items-center gap-3 active:scale-95"
                            >
                                <Download className="w-5 h-5" />
                                {language === "en" ? t.download.en : t.download.cn}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">Local Processing</h3>
                        <p className="text-zinc-500 text-sm">Everything runs in your browser using WebAssembly. No data ever leaves your device.</p>
                    </div>
                </div>
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Layers className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">High Quality</h3>
                        <p className="text-zinc-500 text-sm">Advanced AI models ensure clean edges and details are preserved.</p>
                    </div>
                </div>
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <RefreshCw className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">Free Forever</h3>
                        <p className="text-zinc-500 text-sm">Free unlimited background removals with no subscription or account needed.</p>
                    </div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>
        </div>
    );
}
