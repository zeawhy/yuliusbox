"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Film, Play, Settings2, Download, Loader2, AlertCircle } from "lucide-react";

interface VideoToGifToolProps {
    /** Starting FPS value; falls back to 10 when unset. */
    defaultFps?: number;
    /** Starting width (px) value; falls back to 480 when unset. */
    defaultWidth?: number;
    /** Advisory size target (MB). Renders a sharing advisory line; no re-encoding is performed. */
    maxSizeMB?: number;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function VideoToGifTool({ defaultFps, defaultWidth, maxSizeMB }: VideoToGifToolProps) {
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [gifSize, setGifSize] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Settings (props are initial values only)
    const [fps, setFps] = useState(defaultFps ?? 10);
    const [width, setWidth] = useState(defaultWidth ?? 480);

    const ffmpegRef = useRef<FFmpeg | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

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
            setError("Failed to load FFmpeg. Your browser might not support SharedArrayBuffer. Please check if you are using a modern browser.");
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
            setGifSize(null);
            setProgress(0);
        }
    };

    const convertToGif = async () => {
        if (!videoFile || !loaded || !ffmpegRef.current) return;
        setIsProcessing(true);
        setGifUrl(null);
        setGifSize(null);
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
            setGifSize(blob.size);
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
        <div className="w-full flex flex-col gap-8">
            {/* Loading State */}
            {!loaded && !error && (
                <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-zinc-400">Loading FFmpeg Core... (This may take a moment)</p>
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
                                        <p className="text-zinc-400 font-medium">Drop Video Here</p>
                                        <p className="text-xs text-zinc-600 mt-2">Drag &amp; drop or click to upload MP4, MOV, WebM or GIF</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/webm,image/gif"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                                <div className="flex items-center gap-2 mb-2 text-zinc-300 font-medium">
                                    <Settings2 className="w-5 h-5" /> Settings
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 flex justify-between">
                                        FPS (Frames Per Second)
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
                                        Width (px)
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

                                <p className="text-[11px] text-zinc-600">
                                    Max 10 seconds per conversion to prevent browser crashes.
                                </p>
                            </div>

                            <button
                                onClick={convertToGif}
                                disabled={!videoFile || isProcessing}
                                className="w-full py-3.5 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Converting... {progress}%
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" /> Convert to GIF
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
                                <div className="flex items-center gap-3">
                                    <a
                                        href={gifUrl}
                                        download={`output-${Date.now()}.gif`}
                                        className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> Download GIF
                                    </a>
                                    {gifSize != null && (
                                        <span className="shrink-0 px-3 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-300">
                                            {formatBytes(gifSize)}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Log Output (Optional, hidden by default or small) */}
                            <div className="p-4 rounded-xl bg-black font-mono text-xs text-zinc-500 h-32 overflow-y-auto hidden">
                                <p ref={messageRef}></p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {maxSizeMB != null && (
                <p className="text-center text-sm text-emerald-400 font-medium">
                    Tuned for sharing under {maxSizeMB} MB — check the output size above before posting.
                </p>
            )}
        </div>
    );
}
