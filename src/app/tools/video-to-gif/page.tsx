"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { ArrowLeft, Film, Play, Settings2, Download, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function VideoToGifPage() {
    const { language } = useLanguage();
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Settings
    const [fps, setFps] = useState(10);
    const [width, setWidth] = useState(480);

    const ffmpegRef = useRef<FFmpeg | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    // Translations
    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy-First • Local FFmpeg WASM", cn: "隐私优先 • 本地 FFmpeg WASM" },
        title: { en: "Video to GIF Converter", cn: "视频转 GIF 工具" },
        desc: { en: "Convert MP4/MOV videos to GIF animations entirely in your browser. Powered by FFmpeg WASM.", cn: "在浏览器中将 MP4/MOV 视频转换为 GIF 动图。由 FFmpeg WASM 驱动。" },
        loading: { en: "Loading FFmpeg Core... (This may take a moment)", cn: "正在加载 FFmpeg Core... (初次加载可能需要一点时间)" },
        drop: { en: "Drop Video Here", cn: "拖放视频到此处" },
        drag: { en: "Drag & drop or click to upload MP4/MOV", cn: "点击或拖拽上传 MP4/MOV" },
        convert: { en: "Convert to GIF", cn: "转换为 GIF" },
        download: { en: "Download GIF", cn: "下载 GIF" },
        settings: {
            fps: { en: "FPS (Frames Per Second)", cn: "帧率 (FPS)" },
            width: { en: "Width (px)", cn: "宽度 (px)" }
        },
        status: {
            converting: { en: "Converting...", cn: "转换中..." },
            done: { en: "Done!", cn: "完成!" }
        },
        error: {
            load: { en: "Failed to load FFmpeg. Your browser might not support SharedArrayBuffer. Please check if you are using a modern browser.", cn: "FFmpeg 加载失败。您的浏览器可能不支持 SharedArrayBuffer。请检查是否使用了现代浏览器。" }
        }
    };

    const load = async () => {
        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current as FFmpeg;
        ffmpeg.on("log", ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });

        ffmpeg.on("progress", ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            // Use default CDN or local path if configured
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setLoaded(true);
        } catch (err) {
            console.error("FFmpeg load failed", err);
            setError(t.error.load[language]);
        }
    };

    const toBlobURL = async (url: string, mimeType: string) => {
        const resp = await fetch(url);
        const buf = await resp.arrayBuffer();
        const blob = new Blob([buf], { type: mimeType });
        return URL.createObjectURL(blob);
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setVideoFile(e.target.files[0]);
            setGifUrl(null);
            setProgress(0);
        }
    };

    const convertToGif = async () => {
        if (!videoFile || !loaded || !ffmpegRef.current) return;
        setIsProcessing(true);
        setGifUrl(null);
        setProgress(0);

        const ffmpeg = ffmpegRef.current;

        try {
            await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

            // Command: -i input.mp4 -vf "fps=10,scale=480:-1:flags=lanczos" -c:v gif output.gif
            // Command: Using simple default GIF encoder for stability
            // -t 10: Limit to 10 seconds to avoid WASM OOM crashes
            const exitCode = await ffmpeg.exec([
                "-i", "input.mp4",
                "-t", "10",
                "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos`,
                "output.gif"
            ]);

            if (exitCode !== 0) {
                throw new Error(`FFmpeg exited with code ${exitCode}`);
            }

            const data = await ffmpeg.readFile("output.gif");
            // data is Uint8Array or similar
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blob = new Blob([(data as any).buffer || data], { type: "image/gif" });
            setGifUrl(URL.createObjectURL(blob));
        } catch (err) {
            console.error("Conversion failed", err);
            setError("Conversion failed. Video might be too long or complex for browser. Try < 10s video.");

            // Force reload FFmpeg on crash
            if (ffmpegRef.current) {
                try {
                    ffmpegRef.current.terminate();
                } catch (e) { console.error("Term failed", e); }
                ffmpegRef.current = null;
                setLoaded(false);
                setTimeout(load, 1000); // Try to reload
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <span className="text-zinc-500 font-mono text-xs hidden sm:inline-block">{language === "en" ? t.privacy.en : t.privacy.cn}</span>
            </div>

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {language === "en" ? t.desc.en : t.desc.cn}
                        <br />
                        <span className="text-yellow-500 text-sm">
                            {language === "en" ? "(Max 10 seconds to prevent browser crash)" : "(为防止浏览器崩溃，限制转换前 10 秒)"}
                        </span>
                    </p>
                </div>

                {/* Loading State */}
                {!loaded && !error && (
                    <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <p className="text-zinc-400">{language === "en" ? t.loading.en : t.loading.cn}</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                        <p className="text-red-400 max-w-md text-center">{error}</p>
                    </div>
                )}

                {/* Editor Area */}
                {loaded && (
                    <>
                        {typeof window !== 'undefined' && !window.crossOriginIsolated && (
                            <div className="w-full p-4 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm text-center">
                                ⚠ <strong>Security Requirement Missing</strong><br />
                                Your browser environment does not support `SharedArrayBuffer` (required for WASM).<br />
                                If testing on mobile via local network (e.g. 192.168.x.x), this will NOT work because it is not HTTPS.<br />
                                Please use <strong>localhost</strong> on computer or deploy to <strong>Vercel (HTTPS)</strong>.
                            </div>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-in fade-in slide-in-from-bottom-8">
                            {/* Left Column: Input */}
                            <div className="space-y-6">
                                <div className="relative w-full aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col items-center justify-center group">
                                    {videoFile ? (
                                        <video
                                            src={URL.createObjectURL(videoFile)}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <>
                                            <div className="p-4 rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-700 text-zinc-400 group-hover:text-zinc-200 mb-4">
                                                <Film className="w-8 h-8" />
                                            </div>
                                            <p className="text-zinc-400 font-medium">{language === "en" ? t.drop.en : t.drop.cn}</p>
                                            <p className="text-xs text-zinc-600 mt-2">{language === "en" ? t.drag.en : t.drag.cn}</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="video/mp4,video/quicktime"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>

                                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-300 font-medium">
                                        <Settings2 className="w-5 h-5" /> {language === "en" ? "Settings" : "设置"}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-400 flex justify-between">
                                            {language === "en" ? t.settings.fps.en : t.settings.fps.cn}
                                            <span className="text-indigo-400">{fps}</span>
                                        </label>
                                        <input
                                            type="range" min="1" max="30" value={fps}
                                            onChange={(e) => setFps(parseInt(e.target.value))}
                                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-400">
                                            {language === "en" ? t.settings.width.en : t.settings.width.cn}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number" value={width}
                                                onChange={(e) => setWidth(parseInt(e.target.value))}
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="text-zinc-600 text-sm">px</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={convertToGif}
                                    disabled={!videoFile || isProcessing}
                                    className="w-full py-3.5 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {language === "en" ? t.status.converting.en : t.status.converting.cn} {progress}%
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" /> {language === "en" ? t.convert.en : t.convert.cn}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Right Column: Output */}
                            <div className="flex flex-col gap-4">
                                <div className="relative w-full aspect-video bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                                    {gifUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={gifUrl} alt="GIF Output" className="w-full h-full object-contain" />
                                    ) : (
                                        <p className="text-zinc-600 text-sm">GIF Preview</p>
                                    )}
                                </div>

                                {gifUrl && (
                                    <a
                                        href={gifUrl}
                                        download={`output-${Date.now()}.gif`}
                                        className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> {language === "en" ? t.download.en : t.download.cn}
                                    </a>
                                )}

                                {/* Log Output (Optional, hidden by default or small) */}
                                <div className="p-4 rounded-xl bg-black font-mono text-xs text-zinc-500 h-32 overflow-y-auto hidden">
                                    <p ref={messageRef}></p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-3xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">Create GIFs from any video</h2>
                    <p className="text-zinc-400 mb-6">
                        Convert your MP4, MOV, or WEBM videos into high-quality GIFs in seconds.
                        Whether you need a reaction GIF for social media or a quick animation for a presentation,
                        YuliusBox Video to GIF converter delivers professional results directly in your browser.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">Why use WASM?</h2>
                    <p className="text-zinc-400 mb-6">
                        We use FFmpeg WASM (WebAssembly) to bring desktop-grade video processing power to the web.
                        This means:
                    </p>
                    <ul className="text-zinc-400 mb-6 list-disc pl-5">
                        <li><strong>Zero Uploads:</strong> Your private videos are processed on your computer, never sent to the cloud.</li>
                        <li><strong>Fast performance:</strong> Leverages your device's CPU for conversion.</li>
                        <li><strong>No server limits:</strong> Convert as many videos as you want without waiting in queues.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                Is there a watermark?
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                No. Unlike many "free" tools, we do not add any watermarks to your generated GIFs. The tool is completely free and clean.
                            </p>
                        </details>
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                Why is there a 10-second limit?
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                Processing video in the browser is memory-intensive. We limit input to 10 seconds to prevent your browser tab from crashing due to memory exhaustion (OOM).
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div >
    );
}
