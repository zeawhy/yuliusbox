"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { ArrowLeft, Upload, Download, FileImage, Trash2, Settings2, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

// Constant outside component to avoid dependency issues
const MAX_WIDTH_OR_HEIGHT = 1920;

export default function ImageCompressorPage() {
    const { language } = useLanguage();
    // Wait, I should import the interface or redefine it. I'll redefine it here to keep file self-contained as before.
    // Or copy from previous implementation.
    interface CompressedFile {
        id: string;
        originalFile: File;
        compressedBlob: Blob;
        compressedSize: number;
        originalSize: number;
        status: "pending" | "compressing" | "done" | "error";
        compressionRatio: number;
    }

    // Re-declare state with proper type
    const [fileState, setFileState] = useState<CompressedFile[]>([]);
    // To avoid confusion with previous variable name "files", I'll use "files" variable name but typed correctly.

    const [isDragging, setIsDragging] = useState(false);
    const [quality, setQuality] = useState(0.8);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isProcessing, setIsProcessing] = useState(false);

    // Translations
    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy-First • Local Processing", cn: "隐私优先 • 本地处理" },
        title: { en: "Bulk Image Compression", cn: "批量图片压缩" },
        desc: { en: "Compress your images deeply without losing visible quality. All processing happens right here in your browser.", cn: "深度压缩图片体积，保持肉眼无损画质。所有处理均在浏览器本地完成。" },
        drop: { en: "Drop images here", cn: "释放以添加图片" },
        drag: { en: "Drag & drop or click to upload", cn: "点击或拖拽上传图片" },
        limit: { en: "JPG, PNG, WebP up to 50MB", cn: "支持 JPG, PNG, WebP (最大 50MB)" },
        quality: { en: "Quality", cn: "压缩质量" },
        downloadAll: { en: "Download All (ZIP)", cn: "打包下载全部 (ZIP)" },
        open: { en: "Open", cn: "打开" } // Not used
    };

    const processFiles = useCallback(async (fileList: CompressedFile[]) => {
        setIsProcessing(true);

        for (const fileObj of fileList) {
            setFileState(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "compressing" } : f));

            try {
                const options = {
                    maxSizeMB: 1, // Maybe expose this later?
                    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
                    useWebWorker: true,
                    initialQuality: quality,
                };

                const compressedFile = await imageCompression(fileObj.originalFile, options);

                setFileState(prev => prev.map(f => {
                    if (f.id === fileObj.id) {
                        const ratio = ((f.originalSize - compressedFile.size) / f.originalSize) * 100;
                        return {
                            ...f,
                            compressedBlob: compressedFile,
                            compressedSize: compressedFile.size,
                            status: "done",
                            compressionRatio: ratio
                        };
                    }
                    return f;
                }));

            } catch (error) {
                console.error("Compression error:", error);
                setFileState(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "error" } : f));
            }
        }

        setIsProcessing(false);
    }, [quality]);

    const handleFiles = useCallback((newFiles: File[]) => {
        const fileObjs: CompressedFile[] = newFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            originalFile: file,
            compressedBlob: new Blob(),
            compressedSize: 0,
            originalSize: file.size,
            status: "pending",
            compressionRatio: 0
        }));

        setFileState(prev => [...prev, ...fileObjs]);
        processFiles(fileObjs);
    }, [processFiles]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            const acceptedFiles = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith("image/")
            );
            handleFiles(acceptedFiles);
        }
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const downloadFile = (file: CompressedFile) => {
        if (file.status !== "done") return;
        const url = URL.createObjectURL(file.compressedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `compressed-${file.originalFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadAll = async () => {
        const zip = new JSZip();
        const completedFiles = fileState.filter(f => f.status === "done");

        completedFiles.forEach(f => {
            zip.file(`compressed-${f.originalFile.name}`, f.compressedBlob);
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "yuliusbox-compressed-images.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "relative w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden",
                        isDragging ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                            if (e.target.files?.length) {
                                handleFiles(Array.from(e.target.files));
                            }
                        }}
                    />
                    <div className="flex flex-col items-center gap-4 text-zinc-400 pointer-events-none">
                        <div className={cn("p-4 rounded-full bg-zinc-800 transition-colors", isDragging && "bg-indigo-500/20 text-indigo-400")}>
                            <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium">
                            {isDragging ? (language === "en" ? t.drop.en : t.drop.cn) : (language === "en" ? t.drag.en : t.drag.cn)}
                        </p>
                        <p className="text-sm text-zinc-500">{language === "en" ? t.limit.en : t.limit.cn}</p>
                    </div>
                </div>

                {/* Settings & Actions */}
                {fileState.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                <Settings2 className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium text-zinc-300">{language === "en" ? t.quality.en : t.quality.cn}: {Math.round(quality * 100)}%</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.05"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                    className="w-full sm:w-48 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    disabled={false}
                                />
                            </div>
                        </div>

                        {fileState.some(f => f.status === "done") && (
                            <button
                                onClick={downloadAll}
                                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-white text-zinc-950 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" /> {language === "en" ? t.downloadAll.en : t.downloadAll.cn}
                            </button>
                        )}
                    </div>
                )}

                {/* Results List */}
                {fileState.length > 0 && (
                    <div className="grid gap-4 w-full animate-in fade-in slide-in-from-bottom-8">
                        {fileState.map((file) => (
                            <div key={file.id} className="group flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="shrink-0 w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        {file.status === "pending" || file.status === "compressing" ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                                        ) : file.status === "error" ? (
                                            <FileImage className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-zinc-200 truncate max-w-[200px] sm:max-w-md">{file.originalFile.name}</p>
                                        <p className="text-xs text-zinc-500 flex items-center gap-2">
                                            {formatSize(file.originalSize)}
                                            {file.status === "done" && (
                                                <>
                                                    <span className="text-zinc-600">→</span>
                                                    <span className="text-green-400 font-bold">{formatSize(file.compressedSize)}</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20">
                                                        {file.compressionRatio.toFixed(0)}%
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {file.status === "done" && (
                                        <button
                                            onClick={() => downloadFile(file)}
                                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setFileState(prev => prev.filter(f => f.id !== file.id))}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
