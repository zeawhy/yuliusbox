"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Download, Upload, Image as ImageIcon, Settings, Maximize, Minus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { toPng } from "html-to-image";

export default function ScreenshotBeautifierPage() {
    const { language } = useLanguage();
    const exportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [image, setImage] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    interface SettingsState {
        background: string;
        padding: number;
        borderRadius: number;
        shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
        windowType: 'mac' | 'win' | 'none';
        scale: number;
        rotateX: number;
        rotateY: number;
    }

    const [settings, setSettings] = useState<SettingsState>({
        background: 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)',
        padding: 40,
        borderRadius: 12,
        shadow: 'xl',
        windowType: 'mac',
        scale: 1,
        rotateX: 0,
        rotateY: 0
    });

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Screenshot Beautifier", cn: "截图美化工具" },
        desc: { en: "Create stunning product showcases in seconds.", cn: "几秒钟内创建令人惊叹的产品截图展示。" },
        upload: {
            title: { en: "Drop Screenshot Here", cn: "拖放截图到这里" },
            subtitle: { en: "or click to upload (Paste also works)", cn: "或点击上传 (支持粘贴)" }
        },
        controls: {
            bg: { en: "Background", cn: "背景" },
            padding: { en: "Padding", cn: "边距" },
            radius: { en: "Roundness", cn: "圆角" },
            shadow: { en: "Shadow", cn: "阴影" },
            window: { en: "Window Style", cn: "窗口样式" },
            scale: { en: "Image Scale", cn: "图片缩放" },
            perspective: { en: "3D Perspective", cn: "3D 视角" },
            tiltX: { en: "Tilt X-Axis", cn: "X 轴旋转" },
            tiltY: { en: "Tilt Y-Axis", cn: "Y 轴旋转" }
        },
        download: { en: "Download Image", cn: "下载图片" },
        processing: { en: "Processing...", cn: "处理中..." }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setImage(url);
                }
            }
        }
    };

    const handleDownload = async () => {
        if (!exportRef.current || !image) return;
        setIsExporting(true);
        try {
            // Using html-to-image which uses SVG foreignObject
            // This is generally more robust for modern CSS than html2canvas
            // Disable cacheBust because it breaks Blob URLs (adds query param -> 404)
            const dataUrl = await toPng(exportRef.current, {
                cacheBust: false,
                pixelRatio: 2, // Retina quality
            });

            const link = document.createElement('a');
            link.download = `beautified-screenshot-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err: any) {
            console.error("Export failed:", err);
            alert("Export Failed: " + (err.message || err));
        } finally {
            setIsExporting(false);
        }
    };

    const presets = [
        'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
        'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
        'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
        '#18181b', // zinc-900 like
    ];

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl'
    };

    return (
        <div
            className="flex flex-col lg:flex-row h-screen bg-zinc-950 text-white overflow-hidden"
            onPaste={handlePaste}
        >
            {/* Mobile Header / Sidebar on Desktop */}
            <div className="w-full lg:w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-20 overflow-y-auto">
                <div className="p-6 border-b border-zinc-800">
                    <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                    </Link>
                    <h1 className="text-xl font-bold">{language === "en" ? t.title.en : t.title.cn}</h1>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Background Settings */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.bg.en : t.controls.bg.cn}</label>
                        <div className="grid grid-cols-4 gap-2">
                            {presets.map((bg, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "w-full aspect-square rounded-full border-2 transition-all",
                                        settings.background === bg ? "border-white scale-110" : "border-transparent hover:border-zinc-700"
                                    )}
                                    style={{ background: bg }}
                                    onClick={() => setSettings(s => ({ ...s, background: bg }))}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Window Style */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.window.en : t.controls.window.cn}</label>
                        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                            {(['mac', 'win', 'none'] as const).map((type) => (
                                <button
                                    key={type}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors",
                                        settings.windowType === type ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                    onClick={() => setSettings(s => ({ ...s, windowType: type }))}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.padding.en : t.controls.padding.cn}</label>
                                <span className="text-xs text-zinc-400">{settings.padding}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={settings.padding}
                                onChange={(e) => setSettings(s => ({ ...s, padding: parseInt(e.target.value) }))}
                                className="w-full accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.radius.en : t.controls.radius.cn}</label>
                                <span className="text-xs text-zinc-400">{settings.borderRadius}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={settings.borderRadius}
                                onChange={(e) => setSettings(s => ({ ...s, borderRadius: parseInt(e.target.value) }))}
                                className="w-full accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.scale.en : t.controls.scale.cn}</label>
                                <span className="text-xs text-zinc-400">{settings.scale}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={settings.scale}
                                onChange={(e) => setSettings(s => ({ ...s, scale: parseFloat(e.target.value) }))}
                                className="w-full accent-emerald-500"
                            />
                        </div>

                        {/* 3D Perspective Controls */}
                        <div className="pt-4 border-t border-zinc-800 space-y-6">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">{language === "en" ? t.controls.perspective.en : t.controls.perspective.cn}</label>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-xs text-zinc-400">{language === "en" ? t.controls.tiltX.en : t.controls.tiltX.cn}</label>
                                    <span className="text-xs text-zinc-500">{settings.rotateX}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-30"
                                    max="30"
                                    value={settings.rotateX}
                                    onChange={(e) => setSettings(s => ({ ...s, rotateX: parseInt(e.target.value) }))}
                                    className="w-full accent-emerald-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-xs text-zinc-400">{language === "en" ? t.controls.tiltY.en : t.controls.tiltY.cn}</label>
                                    <span className="text-xs text-zinc-500">{settings.rotateY}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-30"
                                    max="30"
                                    value={settings.rotateY}
                                    onChange={(e) => setSettings(s => ({ ...s, rotateY: parseInt(e.target.value) }))}
                                    className="w-full accent-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.shadow.en : t.controls.shadow.cn}</label>
                            <select
                                value={settings.shadow}
                                onChange={(e) => setSettings(s => ({ ...s, shadow: e.target.value as any }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="none">None</option>
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                                <option value="xl">Extra Large</option>
                                <option value="2xl">2XL</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800">
                    <button
                        onClick={handleDownload}
                        disabled={!image || isExporting}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? t.processing[language as keyof typeof t.processing] : (
                            <>
                                <Download className="w-4 h-4" /> {language === "en" ? t.download.en : t.download.cn}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 bg-[url('/grid.svg')] bg-zinc-950 overflow-auto relative">
                {/* 3D Stage: A large area to allow the 3D projection to breath */}
                <div className="min-w-full min-h-full flex items-center justify-center p-20 lg:p-40" style={{ perspective: '2000px' }}>
                    {image ? (
                        <div className="relative flex-shrink-0 flex items-center justify-center overflow-visible shadow-2xl border border-zinc-800/50" style={{ transformStyle: 'preserve-3d' }}>
                            {/* The Export Container */}
                            <div
                                ref={exportRef}
                                style={{
                                    background: settings.background,
                                    padding: `${settings.padding}px`,
                                    minWidth: '400px',
                                    perspective: '1200px',
                                    transformStyle: 'preserve-3d',
                                    // Hardware acceleration and overflow safety
                                    backfaceVisibility: 'hidden',
                                }}
                                className="transition-all duration-300 ease-in-out"
                            >
                                {/* Window Container */}
                                <div
                                    className={cn("bg-white relative transition-all duration-300", shadowClasses[settings.shadow])}
                                    style={{
                                        borderRadius: `${settings.borderRadius}px`,
                                        transform: `scale(${settings.scale}) rotateX(${settings.rotateX}deg) rotateY(${settings.rotateY}deg)`,
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.3s ease-out',
                                    }}
                                >
                                    {/* Window Header */}
                                    {settings.windowType !== 'none' && (
                                        <div
                                            className="h-8 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-2"
                                            style={{ borderTopLeftRadius: `${settings.borderRadius}px`, borderTopRightRadius: `${settings.borderRadius}px` }}
                                        >
                                            {settings.windowType === 'mac' ? (
                                                <>
                                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                                                </>
                                            ) : (
                                                // Windows Style
                                                <div className="flex gap-4 ml-auto text-zinc-400">
                                                    <Minus className="w-3 h-3" />
                                                    <Maximize className="w-3 h-3" />
                                                    <X className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Image Wrapper with Border Radius (since we removed overflow-hidden from parent) */}
                                    <div
                                        className="relative overflow-hidden"
                                        style={{
                                            borderBottomLeftRadius: settings.windowType === 'none' ? `${settings.borderRadius}px` : '0',
                                            borderBottomRightRadius: settings.windowType === 'none' ? `${settings.borderRadius}px` : '0',
                                            borderRadius: settings.windowType === 'none' ? `${settings.borderRadius}px` : '0'
                                        }}
                                    >
                                        {/* Image */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image}
                                            alt="Screenshot preview"
                                            className="block max-w-full h-auto"
                                            style={{
                                                // Specific max dimensions to prevent huge images from overflowing viewport too much during edit
                                                maxHeight: '70vh',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Clear Button (Floating) */}
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-4 right-4 p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-colors z-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        /* Initial Upload State */
                        <div
                            className="w-full max-w-xl aspect-video border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{language === "en" ? t.upload.title.en : t.upload.title.cn}</h3>
                            <p className="text-zinc-500">{language === "en" ? t.upload.subtitle.en : t.upload.subtitle.cn}</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
