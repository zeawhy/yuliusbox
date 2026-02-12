"use client";

import { useState } from "react";
import { Upload, Copy, Check, Info, Palette, ArrowLeft } from "lucide-react";
import ColorThief, { Palette as ColorPalette } from "color-thief-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ColorPaletteGenerator() {
    const { language } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const t = {
        title: language === 'cn' ? "AI 调色板生成器" : "Color Palette Generator",
        subtitle: language === 'cn' ? "从任何图像中提取完美的调色板。" : "Extract perfect color palettes from any image in seconds.",
        upload: language === 'cn' ? "点击或拖拽上传图片" : "Click or drag to upload an image",
        supports: language === 'cn' ? "支持 JPG, PNG, WEBP" : "Supports JPG, PNG, WEBP",
        dominant: language === 'cn' ? "主色调" : "Dominant Color",
        palette: language === 'cn' ? "配色方案" : "Color Palette",
        copyHex: language === 'cn' ? "复制 HEX" : "Copy HEX",
        howTo: language === 'cn' ? "如何使用？" : "How it Works",
        steps: language === 'cn' ? [
            "上传一张您喜欢的照片或设计稿。",
            "AI 自动分析并提取出 5 种最和谐的关键颜色。",
            "点击色块即可复制 HEX 代码，直接用到您的设计中。"
        ] : [
            "Upload any photo or design you love.",
            "Our algorithm analyzes and extracts the 5 most harmonious colors.",
            "Click any color to copy its HEX code instantly."
        ]
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30">
            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-16 space-y-4 relative">
                    <div className="absolute left-0 top-0">
                        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            {language === 'cn' ? "返回工具箱" : "Back to Tools"}
                        </Link>
                    </div>

                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 ring-1 ring-purple-500/20 mt-8 md:mt-0">
                        <Palette className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left: Upload Area */}
                    <div className="space-y-6">
                        <div className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden group
                            ${image ? 'border-purple-500/50 bg-zinc-900/50' : 'border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/50 bg-zinc-900/30'}`}>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {image ? (
                                <Image
                                    src={image}
                                    alt="Uploaded"
                                    fill
                                    className="object-contain p-4"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                                    <Upload className="w-12 h-12 mb-4" />
                                    <p className="font-medium">{t.upload}</p>
                                    <p className="text-sm mt-2 opacity-60">{t.supports}</p>
                                </div>
                            )}
                        </div>

                        {/* How To Section */}
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-200 mb-4">
                                <Info className="w-5 h-5 text-purple-400" />
                                {t.howTo}
                            </h3>
                            <ul className="space-y-3">
                                {t.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-zinc-400 text-sm">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/20">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Palette Results */}
                    {image ? (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <ColorThief src={image} crossOrigin="anonymous" format="hex">
                                {({ data: dominantColor }) => (
                                    <div className="space-y-3">
                                        <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wider">{t.dominant}</h3>
                                        <div
                                            onClick={() => dominantColor && copyToClipboard(dominantColor)}
                                            className="h-32 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 group relative ring-1 ring-white/10"
                                            style={{ backgroundColor: dominantColor }}
                                        >
                                            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg text-white font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                {copiedColor === dominantColor ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                {dominantColor}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ColorThief>

                            <ColorPalette src={image} crossOrigin="anonymous" format="hex" colorCount={5}>
                                {({ data: palette }) => (
                                    <div className="space-y-3">
                                        <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wider">{t.palette}</h3>
                                        <div className="grid grid-cols-5 gap-4">
                                            {palette?.map((color: string, index: number) => (
                                                <div
                                                    key={index}
                                                    onClick={() => copyToClipboard(color)}
                                                    className="aspect-[3/4] rounded-2xl shadow-lg cursor-pointer transition-all hover:-translate-y-1 hover:shadow-purple-500/20 group relative ring-1 ring-white/5"
                                                    style={{ backgroundColor: color }}
                                                >
                                                    <div className="absolute inset-x-0 bottom-0 p-2 text-center">
                                                        <div className="bg-black/20 backdrop-blur-md py-1 rounded-lg text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {copiedColor === color ? "COPIED" : color}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ColorPalette>
                        </div>
                    ) : (
                        // Empty State
                        <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-12 text-center h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                                <Palette className="w-8 h-8 opacity-50" />
                            </div>
                            <p>Upload an image to reveal its color magic</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
