"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ArrowLeft, Scissors, Maximize, Download, Image as ImageIcon, Upload, Save, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type FileFormat = "image/jpeg" | "image/png" | "image/webp";

export default function ImageEditor() {
    const { language } = useLanguage();
    const [imgSrc, setImgSrc] = useState("");
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);

    // Resize settings
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [lockAspect, setLockAspect] = useState(true);
    const [originalAspect, setOriginalAspect] = useState(1);

    // Export settings
    const [format, setFormat] = useState<FileFormat>("image/jpeg");
    const [quality, setQuality] = useState(0.9);
    const [isProcessing, setIsProcessing] = useState(false);

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Image Resizer & Cropper", cn: "图片转换与裁剪" },
        subtitle: { en: "Resize, crop, and convert images instantly. All processing happens locally for maximum privacy.", cn: "快速调整图片大小、裁剪和转换格式。所有处理均在本地进行，确保隐私安全。" },
        upload: { en: "Select Image", cn: "选择图片" },
        resize: { en: "Resize", cn: "调整大小" },
        crop: { en: "Crop", cn: "裁剪" },
        width: { en: "Width", cn: "宽度" },
        height: { en: "Height", cn: "高度" },
        aspect: { en: "Aspect Ratio", cn: "纵横比" },
        format: { en: "Format", cn: "导出格式" },
        quality: { en: "Quality", cn: "质量" },
        download: { en: "Download Processed Image", cn: "下载处理后的图片" },
        presets: {
            free: { en: "Free", cn: "自由" },
            "1:1": "1:1",
            "16:9": "16:9",
            "4:3": "4:3",
        }
    };

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const aspect_ratio = width / height;
        setOriginalAspect(aspect_ratio);
        setWidth(width);
        setHeight(height);

        // Initial crop: center 80%
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: "%", width: 80 }, aspect_ratio, width, height),
            width,
            height
        );
        setCrop(initialCrop);
    }

    useEffect(() => {
        if (lockAspect && width) {
            setHeight(Math.round(width / originalAspect));
        }
    }, [width, lockAspect, originalAspect]);

    useEffect(() => {
        if (lockAspect && height) {
            setWidth(Math.round(height * originalAspect));
        }
    }, [height, lockAspect, originalAspect]);

    async function handleDownload() {
        if (!imgRef.current) return;
        setIsProcessing(true);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Final dimensions
        let finalWidth = width;
        let finalHeight = height;

        // If cropped, we use the cropped area
        if (completedCrop) {
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;

            ctx.drawImage(
                imgRef.current,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Re-apply resizing if the user manually changed width/height after cropping?
            // Actually, in this simple UI, we'll just use the crop as the size if crop is active.
            // Or prioritize explicit dimensions. Let's prioritize explicit dimensions.
            if (width !== imgRef.current.naturalWidth || height !== imgRef.current.naturalHeight) {
                const resizedCanvas = document.createElement("canvas");
                resizedCanvas.width = width;
                resizedCanvas.height = height;
                const rCtx = resizedCanvas.getContext("2d");
                rCtx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
                download(resizedCanvas);
            } else {
                download(canvas);
            }
        } else {
            // Just resizing
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(imgRef.current, 0, 0, width, height);
            download(canvas);
        }

        setIsProcessing(false);
    }

    function download(canvas: HTMLCanvasElement) {
        const dataUrl = canvas.toDataURL(format, quality);
        const link = document.createElement("a");
        link.download = `yuliusbox-edited.${format.split("/")[1]}`;
        link.href = dataUrl;
        link.click();
    }

    function handleAspectChange(newAspect: number | undefined) {
        setAspect(newAspect);
        if (newAspect && imgRef.current) {
            const { width, height } = imgRef.current;
            const newCrop = centerCrop(
                makeAspectCrop({ unit: "%", width: 80 }, newAspect, width, height),
                width,
                height
            );
            setCrop(newCrop);
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>

                <div className="flex flex-col items-start text-left">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6 shadow-xl">
                        <Scissors className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-left">
                        {language === "en" ? "Image Resizer & " : "图片转换与"}
                        <span className="text-zinc-500 font-medium">{language === "en" ? "Cropper" : "裁剪"}</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl text-left">
                        {language === "en" ? t.subtitle.en : t.subtitle.cn}
                    </p>
                </div>
            </div>

            {!imgSrc ? (
                <div className="w-full h-[400px] bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-emerald-500/30 transition-all duration-500">
                    <div className="p-6 bg-zinc-900 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                        <Upload className="w-12 h-12 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <label className="bg-white text-black px-8 py-4 rounded-2xl font-black text-lg hover:bg-zinc-200 transition-all cursor-pointer shadow-xl">
                        {language === "en" ? t.upload.en : t.upload.cn}
                        <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                    </label>
                </div>
            ) : (
                <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Preview & Crop Area */}
                    <div className="lg:col-span-8 w-full bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center relative">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            className="max-h-[70vh]"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                className="max-w-full max-h-[70vh] rounded-lg"
                            />
                        </ReactCrop>
                        <button
                            onClick={() => setImgSrc("")}
                            className="absolute top-4 right-4 p-2 bg-zinc-950/80 text-zinc-400 hover:text-white rounded-full border border-zinc-800 backdrop-blur-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Right: Controls Area */}
                    <div className="lg:col-span-4 w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Resize Section */}
                        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-6">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Maximize className="w-4 h-4" />
                                <h2 className="font-bold uppercase tracking-widest text-[10px]">{language === "en" ? t.resize.en : t.resize.cn}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.width.en : t.width.cn} (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(Number(e.target.value))}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.height.en : t.height.cn} (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                    lockAspect ? "bg-emerald-500 border-emerald-500" : "bg-zinc-950 border-zinc-800 group-hover:border-zinc-700"
                                )}>
                                    {lockAspect && <Check className="w-3 h-3 text-black font-black" />}
                                    <input type="checkbox" className="hidden" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
                                </div>
                                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Lock Aspect Ratio</span>
                            </label>
                        </div>

                        {/* Crop Settings */}
                        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-6">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Scissors className="w-4 h-4" />
                                <h2 className="font-bold uppercase tracking-widest text-[10px]">{language === "en" ? t.crop.en : t.crop.cn}</h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: undefined, label: t.presets.free },
                                    { id: 1, label: t.presets["1:1"] },
                                    { id: 16 / 9, label: t.presets["16:9"] },
                                    { id: 4 / 3, label: t.presets["4:3"] },
                                ].map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAspectChange(p.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                                            aspect === p.id ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                        )}
                                    >
                                        {typeof p.label === "string" ? p.label : (language === "en" ? p.label.en : p.label.cn)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Export Settings */}
                        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-6">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Save className="w-4 h-4" />
                                <h2 className="font-bold uppercase tracking-widest text-[10px]">{language === "en" ? t.format.en : t.format.cn} & {language === "en" ? t.quality.en : t.quality.cn}</h2>
                            </div>

                            <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                                {["image/jpeg", "image/png", "image/webp"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f as FileFormat)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider",
                                            format === f ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                                        )}
                                    >
                                        {f.split("/")[1]}
                                    </button>
                                ))}
                            </div>

                            {format !== "image/png" && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-500">{language === "en" ? t.quality.en : t.quality.cn}</span>
                                        <span className="text-emerald-500">{Math.round(quality * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleDownload}
                                disabled={isProcessing}
                                className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {language === "en" ? t.download.en : t.download.cn}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>
        </div>
    );
}

// Internal helper for icons
function RefreshCw({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}
