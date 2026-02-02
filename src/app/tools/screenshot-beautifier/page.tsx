"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Download, Upload, Image as ImageIcon, Settings, Maximize, Minus, X, User } from "lucide-react";
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
        showNoise: boolean;
        showHeader: boolean;
        socialName: string;
        socialHandle: string;
        socialAvatar: string;
    }

    const [settings, setSettings] = useState<SettingsState>({
        background: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
        padding: 40,
        borderRadius: 12,
        shadow: 'xl',
        windowType: 'mac',
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        showNoise: true,
        showHeader: false,
        socialName: 'Yulius',
        socialHandle: '@yuliusbox',
        socialAvatar: ''
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
            tiltY: { en: "Tilt Y-Axis", cn: "Y 轴旋转" },
            noise: { en: "Noise Texture", cn: "颗粒质感" },
            social: { en: "Social Mockup", cn: "社交媒体样机" },
            showHeader: { en: "Show Header", cn: "显示头部" },
            name: { en: "Name", cn: "名称" },
            handle: { en: "Handle", cn: "账号" },
            avatar: { en: "Avatar URL", cn: "头像链接" }
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
                backgroundColor: settings.background === 'transparent' ? null : undefined, // Force transparency if selected
            } as any); // Type cast needed for backgroundColor: null in some versions

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
        // Transparent Preset
        'transparent',
        // Preset 1 (Aurora)
        'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
        // Preset 2 (Midnight)
        'radial-gradient(at top left, rgba(37, 38, 44, 0.8), transparent), radial-gradient(at top right, rgba(37, 38, 44, 0.8), transparent), radial-gradient(at bottom left, rgba(72, 74, 85, 0.8), transparent)',
        // Preset 3 (Cotton Candy)
        'linear-gradient(135deg, #FDEB71 10%, #F8D800 40%, #03C8A7 80%, #02735E 100%)',
        // Preset 4 (Sunset Mesh)
        'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
        // Preset 5 (Deep Purple Mesh)
        'radial-gradient(at 74% 94%, hsla(180,91%,71%,1) 0px, transparent 50%), radial-gradient(at 73% 20%, hsla(254,82%,73%,1) 0px, transparent 50%), radial-gradient(at 9% 73%, hsla(343,92%,63%,1) 0px, transparent 50%)',
        // Preset 6 (Oceanic)
        'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
        // Preset 7 (Peach Flow)
        'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)',
        // Preset 8 (Minimal Slate)
        'linear-gradient(135deg, #232526 0%, #414345 100%)',
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
                                        "w-full aspect-square rounded-full border-2 transition-all relative overflow-hidden",
                                        settings.background === bg ? "border-white scale-110" : "border-transparent hover:border-zinc-700"
                                    )}
                                    style={bg === 'transparent' ? {
                                        background: 'repeating-conic-gradient(#3f3f46 0% 25%, #27272a 0% 50%) 50% / 10px 10px'
                                    } : { background: bg }}
                                    onClick={() => setSettings(s => ({ ...s, background: bg }))}
                                    title={bg === 'transparent' ? 'Transparent' : undefined}
                                >
                                    {bg === 'transparent' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-[1px] h-full bg-red-500/50 rotate-45 transform scale-150" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                            <span className="text-xs text-zinc-400">{language === "en" ? t.controls.noise.en : t.controls.noise.cn}</span>
                            <button
                                className={cn(
                                    "w-8 h-4 rounded-full transition-colors relative",
                                    settings.showNoise ? "bg-emerald-500" : "bg-zinc-700"
                                )}
                                onClick={() => setSettings(s => ({ ...s, showNoise: !s.showNoise }))}
                            >
                                <div className={cn(
                                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                    settings.showNoise ? "right-0.5" : "left-0.5"
                                )} />
                            </button>
                        </div>
                    </div>
                    {/* Social Mockup Settings */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{language === "en" ? t.controls.social.en : t.controls.social.cn}</label>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-300">{language === "en" ? t.controls.showHeader.en : t.controls.showHeader.cn}</span>
                                <button
                                    className={cn(
                                        "w-10 h-6 rounded-full transition-colors relative",
                                        settings.showHeader ? "bg-emerald-500" : "bg-zinc-700"
                                    )}
                                    onClick={() => setSettings(s => ({ ...s, showHeader: !s.showHeader }))}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                        settings.showHeader ? "right-1" : "left-1"
                                    )} />
                                </button>
                            </div>

                            {settings.showHeader && (
                                <div className="space-y-3 pt-2 border-t border-zinc-800/50">
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-500">{language === "en" ? t.controls.name.en : t.controls.name.cn}</label>
                                        <input
                                            type="text"
                                            value={settings.socialName}
                                            onChange={(e) => setSettings(s => ({ ...s, socialName: e.target.value }))}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-500">{language === "en" ? t.controls.handle.en : t.controls.handle.cn}</label>
                                        <input
                                            type="text"
                                            value={settings.socialHandle}
                                            onChange={(e) => setSettings(s => ({ ...s, socialHandle: e.target.value }))}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-500">{language === "en" ? t.controls.avatar.en : t.controls.avatar.cn}</label>
                                        <input
                                            type="text"
                                            value={settings.socialAvatar}
                                            onChange={(e) => setSettings(s => ({ ...s, socialAvatar: e.target.value }))}
                                            placeholder="https://..."
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}
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
                <div className="min-w-full min-h-full flex items-center justify-center p-32 lg:p-64" style={{ perspective: '3000px' }}>
                    {image ? (
                        <div
                            className="relative flex-shrink-0 flex items-center justify-center overflow-visible shadow-2xl border border-zinc-800/50"
                            style={{
                                transformStyle: 'preserve-3d',
                                // Show checkerboard in preview if transparent, otherwise keep it clean
                                background: settings.background === 'transparent' ? 'repeating-conic-gradient(#1f1f23 0% 25%, #18181b 0% 50%) 50% / 20px 20px' : undefined
                            }}
                        >
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
                                className="transition-all duration-300 ease-in-out relative overflow-hidden"
                            >
                                {/* Noise Overlay */}
                                {settings.showNoise && (
                                    <div
                                        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                                        }}
                                    />
                                )}
                                {/* Tilted Wrapper for 3D Transforms (Post Card Container) */}
                                <div
                                    className={cn(
                                        "relative flex flex-col transition-all duration-300 ease-out origin-center",
                                        settings.showHeader ? "bg-zinc-950 border border-white/10 p-6 rounded-2xl" : "",
                                        settings.showHeader ? shadowClasses[settings.shadow] : ""
                                    )}
                                    style={{
                                        transform: `perspective(2000px) translate3d(0, 0, 100px) scale(${settings.scale}) rotateX(${settings.rotateX}deg) rotateY(${settings.rotateY}deg)`,
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    {/* Social Header */}
                                    {settings.showHeader && (
                                        <div className="w-full mb-4 flex items-start gap-4 text-white relative z-10" style={{ backfaceVisibility: 'hidden' }}>
                                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border-2 border-zinc-700/50">
                                                {settings.socialAvatar ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={settings.socialAvatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <h3 className="font-bold text-lg leading-tight text-white truncate">{settings.socialName}</h3>
                                                        <p className="text-zinc-500 text-sm mt-0.5 truncate">{settings.socialHandle}</p>
                                                    </div>
                                                    <div className="text-zinc-600">
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform opacity-50">
                                                            <g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Window Container */}
                                    <div
                                        className={cn(
                                            "bg-white relative transition-all duration-300",
                                            settings.showHeader ? "" : shadowClasses[settings.shadow] // Remove shadow if inside Post Card
                                        )}
                                        style={{
                                            borderRadius: `${settings.borderRadius}px`,
                                            // Transform logic moved to parent wrapper
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
        </div >
    );
}
