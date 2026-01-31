"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, Download, Type, RotateCw, Move, Palette, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function IDWatermarkPage() {
    const { language } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Settings
    const [text, setText] = useState("仅供 2026年办理租房业务使用 他用无效");
    const [fontSize, setFontSize] = useState(24);
    const [opacity, setOpacity] = useState(0.3);
    const [rotate, setRotate] = useState(-45);
    const [gap, setGap] = useState(80);
    const [color, setColor] = useState("#808080");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy Protected • 100% Local Processing", cn: "隐私保护 • 100% 本地处理" },
        title: { en: "Secure ID Watermarker", cn: "证件安全水印助手" },
        desc: { en: "Add security watermarks to your ID card / passport photos locally. Prevent unauthorized use.", cn: "为您的身份证/护照照片添加安全水印。纯本地处理，防止被盗用。" },
        upload: {
            title: { en: "Click or Drag ID Photo Here", cn: "点击或拖拽证件照到此处" },
            supported: { en: "Supports JPG, PNG, WebP", cn: "支持 JPG, PNG, WebP" }
        },
        controls: {
            text: { en: "Watermark Text", cn: "水印文字" },
            presets: { en: "Presets:", cn: "快速预设:" },
            style: { en: "Style", cn: "样式设置" },
            color: { en: "Color", cn: "颜色" },
            opacity: { en: "Opacity", cn: "透明度" },
            size: { en: "Size", cn: "大小" },
            rotate: { en: "Rotation", cn: "旋转" },
            density: { en: "Density (Uncheck to manual)", cn: "密度" } // Simplified label
        },
        presets: [
            { label: { en: "Rent", cn: "租房" }, value: "仅供 2026年办理租房业务使用 他用无效" },
            { label: { en: "Sim Card", cn: "办卡" }, value: "仅供 2026年办理手机卡业务使用 他用无效" },
            { label: { en: "Loan", cn: "贷款" }, value: "仅供 2026年办理贷款业务使用 他用无效" },
            { label: { en: "Identity", cn: "验证身份" }, value: "仅供 2026年身份验证使用 他用无效" },
        ],
        download: { en: "Download Image", cn: "下载处理后的图片" }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setFile(f);
            const img = new Image();
            img.src = URL.createObjectURL(f);
            img.onload = () => setImage(img);
        }
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas dimensions to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw original image
        ctx.drawImage(image, 0, 0);

        // Prepare watermark
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // Setup tiling
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        // Calculate diagonal box size to ensure coverage when rotated
        const tileSize = Math.max(textWidth, fontSize * 2) + gap;

        // We need to cover the whole canvas with rotated text.
        // Easiest is to draw a grid larger than canvas and rotate context, 
        // or rotate context at each point. Rotating context at each point is simpler for logic.
        // Actually, improved approach: render pattern or simple loop.

        // Let's loop through the canvas
        const cols = Math.ceil(canvas.width / tileSize) + 2;
        const rows = Math.ceil(canvas.height / tileSize) + 2;

        // To handle rotation correctly without complex bounds, we can draw a larger grid
        // centered on the canvas.

        ctx.save();
        // Move to center to rotate the whole grid (optional, but per-item rotation is standard for this type of tool)
        // Actually standard ID watermark is: text rotated around its own center, tiled.

        for (let i = -1; i < cols; i++) {
            for (let j = -1; j < rows; j++) {
                const x = i * tileSize;
                const y = j * tileSize;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((rotate * Math.PI) / 180);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }

        ctx.restore();

    }, [image, text, fontSize, opacity, rotate, gap, color]);

    useEffect(() => {
        draw();
    }, [draw]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `watermarked_${file?.name || "image.png"}`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-6xl mx-auto">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <span className="text-emerald-500 font-mono text-xs hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    {language === "en" ? t.privacy.en : t.privacy.cn}
                </span>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Canvas / Preview */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="text-left space-y-2 mb-6">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400">{language === "en" ? t.desc.en : t.desc.cn}</p>
                    </div>

                    <div className="relative w-full min-h-[400px] bg-zinc-900/50 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden group">
                        {!image && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 pointer-events-none">
                                <Upload className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium text-lg">{language === "en" ? t.upload.title.en : t.upload.title.cn}</p>
                                <p className="text-sm mt-1">{language === "en" ? t.upload.supported.en : t.upload.supported.cn}</p>
                            </div>
                        )}

                        {/* File Input Overlay */}
                        {!image && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        )}

                        {image && (
                            <div className="relative w-full h-full p-4 overflow-auto flex items-center justify-center bg-repeat" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3UFAYw4g/x+dQD6kG2IGURYOoGnAaxJmCNLuR0iLGFqjxHcsAd8mCcnISsCnAAAAAElFTkSuQmCC')" }}>
                                {/* Ensure we show max-width of container but allow scroll if needed or just fit */}
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-[70vh] shadow-2xl rounded-lg"
                                />
                                <button
                                    onClick={() => { setImage(null); setFile(null); }}
                                    className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit space-y-8 animate-in fade-in slide-in-from-right-4">

                    {/* Text Input */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Type className="w-4 h-4" /> {language === "en" ? t.controls.text.en : t.controls.text.cn}
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                        />

                        {/* Presets */}
                        <div className="space-y-2">
                            <span className="text-xs text-zinc-500">{language === "en" ? t.controls.presets.en : t.controls.presets.cn}</span>
                            <div className="flex flex-wrap gap-2">
                                {t.presets.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setText(preset.value)}
                                        className="px-3 py-1 text-xs rounded-full bg-zinc-800 border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        {language === "en" ? preset.label.en : preset.label.cn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Appearance Controls */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> {language === "en" ? t.controls.style.en : t.controls.style.cn}
                        </h3>

                        {/* Color */}
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-zinc-400">{language === "en" ? t.controls.color.en : t.controls.color.cn}</label>
                            <div className="flex items-center gap-2">
                                {['#ffffff', '#808080', '#000000', '#ff0000'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border border-zinc-700",
                                            color === c && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900"
                                        )}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Opacity */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{language === "en" ? t.controls.opacity.en : t.controls.opacity.cn}</span>
                                <span>{Math.round(opacity * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0.1" max="1" step="0.05"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{language === "en" ? t.controls.size.en : t.controls.size.cn}</span>
                                <span>{fontSize}px</span>
                            </div>
                            <input
                                type="range" min="12" max="100"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Rotation */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> {language === "en" ? t.controls.rotate.en : t.controls.rotate.cn}</span>
                                <span>{rotate}°</span>
                            </div>
                            <input
                                type="range" min="-90" max="90"
                                value={rotate}
                                onChange={(e) => setRotate(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Gap/Density */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><Move className="w-3 h-3" /> {language === "en" ? t.controls.density.en : t.controls.density.cn}</span>
                                <span>{gap}px</span>
                            </div>
                            <input
                                type="range" min="20" max="300"
                                value={gap}
                                onChange={(e) => setGap(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={downloadImage}
                            disabled={!image}
                            className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            <Download className="w-5 h-5" />
                            {language === "en" ? t.download.en : t.download.cn}
                        </button>
                    </div>
                </div>
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-4xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Why you must watermark ID photos?" : "为什么必须给证件照加水印？"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en"
                            ? "Identity theft is rising. Unscrupulous agents or data breaches can expose your clear ID photos, allowing criminals to apply for loans or credit cards in your name. Adding a specific watermark (e.g., \"For Rent Application Only\") invalidates the photo for any other use."
                            : "身份盗窃日益严重。不法中介或数据泄露可能会暴露您的清晰证件照，让不法分子冒用您的名义申请贷款或信用卡。添加特定的水印（例如“仅供租房申请使用”）可以防止照片被挪作他用。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "100% Private Processing" : "100% 隐私保护处理"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en" ? "YuliusBox uses HTML5 Canvas technology to process your images directly in your browser. Your ID card photos are " : "YuliusBox 使用 HTML5 Canvas 技术直接在您的浏览器中处理图片。您的证件照"}
                        <strong>{language === "en" ? "never uploaded" : "从未"}</strong>
                        {language === "en" ? " to our servers. All watermarking happens locally on your device, ensuring maximum security." : "上传到我们的服务器。所有水印处理均在您设备本地完成，确保最高安全性。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Frequently Asked Questions" : "常见问题"}
                    </h2>
                    <div className="space-y-4">
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                {language === "en" ? "Are photos uploaded?" : "照片会被上传吗？"}
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                {language === "en"
                                    ? "Absolutely not. You can disconnect your internet and this tool will still work perfectly. That is the best proof of privacy."
                                    : "绝对不会。您可以断开网络连接，此工具仍能完美运行。这就是隐私保护的最佳证明。"}
                            </p>
                        </details>
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                {language === "en" ? "What text should I write?" : "我应该写什么文字？"}
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                {language === "en"
                                    ? "Be specific. Include the purpose and date. Example: \"Only for House Rental Application 2024. Invalid for other uses.\""
                                    : "请具体一点。包括用途和日期。例如：“仅供 2024 年租房申请使用。他用无效。”"}
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}
