"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Monitor, Download, Smartphone } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

type Platform = "tiktok" | "reels" | "shorts";

export default function SafeZoneOverlay() {
    const { language } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [platform, setPlatform] = useState<Platform>("tiktok");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const t = {
        title: language === 'cn' ? "社交媒体安全区域检测" : "Social Media Safe Zone",
        subtitle: language === 'cn' ? "预览您的内容在不同平台上的显示效果，避免关键信息被遮挡。" : "Preview how your content looks on TikTok, Reels, and Shorts to avoid UI occlusion.",
        upload: language === 'cn' ? "上传视频封面或截图" : "Upload Cover or Screenshot",
        download: language === 'cn' ? "下载带参考线的图片" : "Download with Guides",
        platforms: {
            tiktok: "TikTok",
            reels: "Instagram Reels",
            shorts: "YouTube Shorts"
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    // Draw canvas logic
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new window.Image();
        img.src = image;
        img.onload = () => {
            // Set canvas size to match image aspect ratio (usually 9:16)
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Draw Overlay
            drawUIOverlay(ctx, canvas.width, canvas.height, platform);

            // Update download URL
            setDownloadUrl(canvas.toDataURL("image/png"));
        };
    }, [image, platform]);


    const drawUIOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number, p: Platform) => {
        // Common Overlay Style
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; // Red tint for unsafe zones
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 10]);

        // Define Zones based on Platform (Approximations for 1080x1920)
        // Scaled to actual width/height
        const safeMarginX = w * 0.05;

        let bottomUnsafeHeight = 0;
        let rightUnsafeWidth = 0;
        let topUnsafeHeight = 0;

        if (p === "tiktok") {
            bottomUnsafeHeight = h * 0.20; // Caption + Music + Nav
            rightUnsafeWidth = w * 0.20;   // Like/Share/Profile buttons
            topUnsafeHeight = h * 0.08;    // Search bar / Live status
        } else if (p === "reels") {
            bottomUnsafeHeight = h * 0.22; // Description + Audio + Profile
            rightUnsafeWidth = w * 0.15;   // Interactions
            topUnsafeHeight = h * 0.05;    // Camera status
        } else if (p === "shorts") {
            bottomUnsafeHeight = h * 0.18; // Title + Channel
            rightUnsafeWidth = w * 0.18;   // Like/Dislike/Comment
            topUnsafeHeight = h * 0.05;    // Search/Menu
        }

        // Draw Unsafe Zones (Red Blocks)
        // Bottom
        ctx.fillRect(0, h - bottomUnsafeHeight, w, bottomUnsafeHeight);
        // Right Side (Buttons)
        ctx.fillRect(w - rightUnsafeWidth, h * 0.3, rightUnsafeWidth, h * 0.4);
        // Top
        ctx.fillRect(0, 0, w, topUnsafeHeight);

        // Draw Safe Zone Border
        ctx.strokeRect(
            safeMarginX,
            topUnsafeHeight + (h * 0.02),
            w - (safeMarginX * 2) - (p !== 'shorts' ? 0 : 0), // Shorts is mostly full width except right buttons
            h - bottomUnsafeHeight - topUnsafeHeight - (h * 0.04)
        );

        // Add Label
        ctx.fillStyle = "white";
        ctx.font = `bold ${w * 0.05}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`${t.platforms[p]} Safe Zone`, w / 2, h / 2);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 ring-1 ring-blue-500/20">
                        <Smartphone className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-1 space-y-6 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">

                        {/* Platform Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-400">Select Platform</label>
                            <div className="grid grid-cols-1 gap-2">
                                {(["tiktok", "reels", "shorts"] as Platform[]).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPlatform(p)}
                                        className={`px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center justify-between
                                            ${platform === p
                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-transparent'}`}
                                    >
                                        {t.platforms[p]}
                                        {platform === p && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                                <Upload className="w-5 h-5" />
                                {t.upload}
                            </div>
                        </div>

                        {/* Download Button */}
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download={`safe-zone-${platform}-${Date.now()}.png`}
                                className="block w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                            >
                                <Download className="w-5 h-5" />
                                {t.download}
                            </a>
                        )}
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2 bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 flex items-center justify-center min-h-[600px] relative overflow-hidden">

                        {!image && (
                            <div className="text-center text-zinc-500">
                                <Monitor className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Preview will appear here</p>
                            </div>
                        )}

                        {/* Hidden Canvas for Processing */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Live Preview Image */}
                        {downloadUrl && (
                            <img
                                src={downloadUrl}
                                alt="Safe Zone Preview"
                                className="max-h-[70vh] w-auto shadow-2xl rounded-lg ring-1 ring-zinc-700"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
