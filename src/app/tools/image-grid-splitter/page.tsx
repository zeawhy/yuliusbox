"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, ShieldCheck, Upload, Download, Grid3X3, Settings, AlertCircle, FileImage, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

export default function ImageGridSplitterPage() {
    const { language } = useLanguage();

    // Core State
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [rows, setRows] = useState(3);
    const [columns, setColumns] = useState(3);
    const [insetPercent, setInsetPercent] = useState(1);
    const [status, setStatus] = useState<"idle" | "splitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // UI State
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Image Grid Splitter", cn: "图片网格切分器" },
        desc: { en: "Split a single image into a grid of smaller pieces (e.g., 3x3 for Instagram). 100% private, processed locally on your device.", cn: "将单张图片切分为九宫格等多个等分小图（如社交媒体常用的 3x3）。100% 隐私，所有处理均在您的本地设备完成。" },
        secure: { en: "100% Local Processing. Your image never leaves your device.", cn: "100% 本地处理。您的图片永远不会离开您的设备。" },
        uploadBtn: { en: "Select Image", cn: "选择图片" },
        clearAll: { en: "Clear Image", cn: "清除图片" },
        settings: { en: "Grid Layout", cn: "网格布局" },
        rows: { en: "Rows", cn: "行数" },
        columns: { en: "Columns", cn: "列数" },
        splitBtn: { en: "Split Image & Download ZIP", cn: "切分图片并下载 ZIP" },
        splitting: { en: "Splitting Image...", cn: "正在切分图片..." },
        success: { en: "Image split successfully! ZIP downloaded.", cn: "图片切分成功！ZIP 已下载。" },
        startNew: { en: "Split Another Image", cn: "切分新图片" },
        dragHint: { en: "Drag and drop your image here", cn: "将您的图片拖拽至此放入" },
        invalidType: { en: "Please upload a valid image file (JPG, PNG, WebP).", cn: "请上传有效的图片文件 (JPG, PNG, WebP)。" }
    };

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            setErrorMessage(language === "en" ? t.invalidType.en : t.invalidType.cn);
            setStatus("error");
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setPreviewUrl(objectUrl);
        setStatus("idle");
        setErrorMessage("");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files?.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]); // eslint-disable-line react-hooks/exhaustive-deps

    const clearImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl("");
        setStatus("idle");
        setErrorMessage("");
    };

    const splitImage = async () => {
        if (!file || !previewUrl || rows < 1 || columns < 1) return;

        setStatus("splitting");
        setErrorMessage("");

        try {
            // 1. Load native Image object
            const img = new window.Image();
            img.crossOrigin = "anonymous";

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error("Failed to load image"));
                img.src = previewUrl;
            });

            // 2. Calculate slice dimensions
            const sliceWidth = Math.floor(img.naturalWidth / columns);
            const sliceHeight = Math.floor(img.naturalHeight / rows);

            if (sliceWidth === 0 || sliceHeight === 0) {
                throw new Error("Grid dimensions are too large for this image.");
            }

            // 3. Setup JSZip
            const zip = new JSZip();
            const originalBaseName = file.name.replace(/\.[^/.]+$/, "");

            // 4. Create Master Canvas to read actual pixels
            const masterCanvas = document.createElement("canvas");
            masterCanvas.width = img.naturalWidth;
            masterCanvas.height = img.naturalHeight;
            const masterCtx = masterCanvas.getContext("2d", { willReadFrequently: true });
            if (!masterCtx) throw new Error("Could not get 2D context for master image");

            // Draw original image exactly 1:1
            masterCtx.drawImage(img, 0, 0);

            // Calculate active area inside the slice based on inset (Edge Trim)
            const insetX = Math.floor(sliceWidth * (insetPercent / 100));
            const insetY = Math.floor(sliceHeight * (insetPercent / 100));

            const activeWidth = Math.floor(sliceWidth - insetX * 2);
            const activeHeight = Math.floor(sliceHeight - insetY * 2);

            if (activeWidth <= 0 || activeHeight <= 0) {
                throw new Error("Edge Trim is too large, image area is zero.");
            }

            // Temporary Canvas for slicing
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = activeWidth;
            sliceCanvas.height = activeHeight;
            const sliceCtx = sliceCanvas.getContext("2d", { willReadFrequently: true });
            if (!sliceCtx) throw new Error("Could not get 2D context for slice");

            // Maintain input format dynamically for smaller exports, force PNG if transparent
            const isPngOrWebp = file.type === "image/png" || file.type === "image/webp";
            const outputMime = isPngOrWebp ? "image/png" : "image/jpeg";
            const outputExt = isPngOrWebp ? "png" : "jpg";

            // 5. Loop and extract exact pixel slices
            const blobPromises: Promise<void>[] = [];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    const sourceX = Math.floor(c * sliceWidth + insetX);
                    const sourceY = Math.floor(r * sliceHeight + insetY);

                    // Extract exact pixel data from the calculated inner region
                    const pixelData = masterCtx.getImageData(sourceX, sourceY, activeWidth, activeHeight);

                    // Put exact pixels directly into the slice
                    sliceCtx.putImageData(pixelData, 0, 0);

                    // Convert to Blob (1.0 Quality for JPEG, lossless for PNG)
                    const promise = new Promise<void>((resolve, reject) => {
                        sliceCanvas.toBlob((blob) => {
                            if (blob) {
                                const index = (r * columns) + c + 1;
                                const filename = `${originalBaseName}_part_${index.toString().padStart(2, '0')}.${outputExt}`;
                                zip.file(filename, blob);
                                resolve();
                            } else {
                                reject(new Error(`Failed to create blob for slice ${r}, ${c}`));
                            }
                        }, outputMime, outputMime === "image/jpeg" ? 1.0 : undefined);
                    });

                    blobPromises.push(promise);
                }
            }

            await Promise.all(blobPromises);

            // 6. Generate and download zip
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, `${originalBaseName}_split_${columns}x${rows}_lossless.zip`);

            setStatus("success");

        } catch (error: any) {
            console.error("Splitting error:", error);
            setErrorMsg(language === "en" ? "Failed to split image." : "图片切分失败。");
            setStatus("error");
        }
    };

    const setErrorMsg = (msg: string) => {
        setErrorMessage(msg);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-7xl mx-auto">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="hidden sm:flex items-center text-green-500/80 font-mono text-xs gap-1.5 border border-green-500/20 bg-green-500/10 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === "en" ? t.secure.en : t.secure.cn}
                </div>
            </div>

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {language === "en" ? t.desc.en : t.desc.cn}
                    </p>
                </div>

                {/* Mobile Secure Badge */}
                <div className="sm:hidden flex items-center justify-center mb-4 text-green-500/80 text-xs gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === "en" ? t.secure.en : t.secure.cn}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Toolbar / Config Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-indigo-400" />
                                {language === "en" ? t.settings.en : t.settings.cn}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1.5 block">{language === "en" ? t.columns.en : t.columns.cn}</label>
                                    <input
                                        type="number"
                                        min="1" max="20"
                                        value={columns}
                                        onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        disabled={!file}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1.5 block">{language === "en" ? t.rows.en : t.rows.cn}</label>
                                    <input
                                        type="number"
                                        min="1" max="20"
                                        value={rows}
                                        onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        disabled={!file}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1.5 flex justify-between">
                                        <span>{language === "en" ? "Edge Trim (Remove Border)" : "边界内缩 (去白边/黑框)"}</span>
                                        <span className="text-zinc-500">{insetPercent}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0" max="10" step="0.5"
                                        value={insetPercent}
                                        onChange={(e) => setInsetPercent(parseFloat(e.target.value) || 0)}
                                        className="w-full accent-indigo-500"
                                        disabled={!file}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-zinc-800/50 flex flex-col gap-3">
                                {status === "success" ? (
                                    <button
                                        onClick={clearImage}
                                        className="w-full mt-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {language === "en" ? t.startNew.en : t.startNew.cn}
                                    </button>
                                ) : (
                                    <button
                                        onClick={splitImage}
                                        disabled={status === "splitting" || !file || rows < 1 || columns < 1}
                                        className="w-full mt-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {status === "splitting" ? <Download className="w-4 h-4 animate-bounce" /> : <Grid3X3 className="w-4 h-4" />}
                                        {status === "splitting" ? (language === "en" ? t.splitting.en : t.splitting.cn) : (language === "en" ? t.splitBtn.en : t.splitBtn.cn)}
                                    </button>
                                )}

                                {errorMessage && (
                                    <div className="mt-2 text-xs text-red-400 p-2 border border-red-500/20 bg-red-500/10 rounded-lg flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[500px] flex flex-col">

                            {/* Upload Header */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/50">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 font-medium rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                                >
                                    <Upload className="w-4 h-4" />
                                    {language === "en" ? t.uploadBtn.en : t.uploadBtn.cn}
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                />

                                {file && (
                                    <button
                                        onClick={clearImage}
                                        className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors"
                                    >
                                        {language === "en" ? t.clearAll.en : t.clearAll.cn}
                                    </button>
                                )}
                            </div>

                            {/* DND / Visual Area */}
                            {!file ? (
                                <div
                                    className={cn(
                                        "w-full flex-grow min-h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all bg-zinc-950/50 text-zinc-500",
                                        isDraggingOver ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                                    )}
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                                    onDragLeave={() => setIsDraggingOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="font-medium">{language === "en" ? t.dragHint.en : t.dragHint.cn}</p>
                                </div>
                            ) : (
                                <div className="w-full flex-grow flex flex-col items-center justify-center">
                                    {status === "success" && (
                                        <div className="w-full p-4 mb-6 text-center bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-3 animate-in zoom-in-95">
                                            <ShieldCheck className="w-5 h-5 text-green-400" />
                                            <p className="text-green-400 font-medium">
                                                {language === "en" ? t.success.en : t.success.cn}
                                            </p>
                                        </div>
                                    )}

                                    {/* Visual Grid Preview */}
                                    <div className="relative inline-block max-w-full max-h-[600px] rounded-lg overflow-hidden border border-zinc-700 group">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            width={800}
                                            height={800}
                                            className="w-auto h-auto max-h-[600px] object-contain block opacity-80"
                                            unoptimized
                                        />

                                        {/* CSS Grid Overlay to visualize cuts */}
                                        <div
                                            className="absolute inset-0 grid pointer-events-none"
                                            style={{
                                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                                                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
                                            }}
                                        >
                                            {Array.from({ length: rows * columns }).map((_, i) => (
                                                <div key={i} className="border border-white/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] flex items-center justify-center">
                                                    <span className="text-white/50 font-bold text-2xl drop-shadow-md bg-black/30 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {i + 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-zinc-500">
                                        {language === "en" ? `Previewing ${columns}x${rows} split grid.` : `预览 ${columns}x${rows} 切分网格`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
