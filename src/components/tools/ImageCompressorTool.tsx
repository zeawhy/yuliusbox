"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { Upload, Download, FileImage, Trash2, Settings2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { ContinueWith } from "@/components/tools/ContinueWith";
import { trackToolEvent } from "@/lib/analytics";
import { useHandoffReceiver, HandoffButton } from "@/lib/handoff";

function ImageCompressorHandoffSync({ onFiles }: { onFiles: (files: File[]) => void }) {
    useHandoffReceiver(onFiles);
    return null;
}


// Constant outside component to avoid dependency issues
const MAX_WIDTH_OR_HEIGHT = 1920;

interface ImageCompressorToolProps {
    /** When set, each image is iteratively compressed to stay under this size (MB). */
    targetSizeMB?: number;
    /**
     * Byte-exact target (e.g. 100_000 for a strict 100 000-byte limit).
     * When provided, overrides targetSizeMB for compression and display.
     * The library maxSizeMB is derived as targetSizeBytes / 1_048_576 so the
     * internal ceiling stays ≤ targetSizeBytes; a post-pass size check retries
     * at lower quality (up to 2 times) if the result still exceeds the limit.
     */
    targetSizeBytes?: number;
    /** When "webp", the compressed result is re-encoded to WebP via canvas. */
    outputFormat?: "webp";
}

/** Re-encode a compressed image blob to WebP via canvas (keeps alpha channel). */
const toWebp = (blob: Blob, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Canvas unavailable"));
                return;
            }
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error("WebP encoding failed"))),
                "image/webp",
                quality
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not decode image for WebP conversion"));
        };
        img.src = url;
    });

export function ImageCompressorTool({ targetSizeMB, targetSizeBytes, outputFormat }: ImageCompressorToolProps) {
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
        /** Set when status==="error" to show a user-visible reason. */
        errorMsg?: string;
    }

    // Re-declare state with proper type
    const [fileState, setFileState] = useState<CompressedFile[]>([]);
    // To avoid confusion with previous variable name "files", I'll use "files" variable name but typed correctly.

    const [isDragging, setIsDragging] = useState(false);
    const [quality, setQuality] = useState(0.8);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isProcessing, setIsProcessing] = useState(false);
    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "image-compressor" });
        }
    }, []);

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

    /**
     * Resolve the effective byte limit and the maxSizeMB to pass to the library.
     * - targetSizeBytes takes priority over targetSizeMB.
     * - We use targetSizeBytes / 1_048_576 as maxSizeMB so the library's internal
     *   ceiling is always ≤ targetSizeBytes (the library uses 1024*1024 = 1_048_576).
     */
    const effectiveLimitBytes: number | undefined =
        targetSizeBytes ?? (targetSizeMB != null ? Math.round(targetSizeMB * 1_048_576) : undefined);

    const effectiveMaxSizeMB: number =
        targetSizeBytes != null
            ? targetSizeBytes / 1_048_576      // exact byte ceiling for the library
            : (targetSizeMB ?? 1);

    /** Human-readable label shown in the UI (e.g. "100 KB" or "0.5 MB"). */
    const targetLabel: string | null = (() => {
        if (targetSizeBytes != null) {
            // Show as KB (decimal) — e.g. 100,000 bytes → "100 KB"
            return `${Math.round(targetSizeBytes / 1000)} KB`;
        }
        if (targetSizeMB != null) {
            return targetSizeMB < 1 ? `${Math.round(targetSizeMB * 1024)} KB` : `${targetSizeMB} MB`;
        }
        return null;
    })();

    const processFiles = useCallback(async (fileList: CompressedFile[]) => {
        setIsProcessing(true);
        trackToolEvent("process_started", { tool: "image-compressor" });

        for (const fileObj of fileList) {
            setFileState(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "compressing" } : f));

            try {
                const baseOptions = {
                    maxSizeMB: effectiveMaxSizeMB,
                    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
                    useWebWorker: true,
                    initialQuality: quality,
                };

                let compressedFile = await imageCompression(fileObj.originalFile, baseOptions);

                // Optional WebP re-encode (e.g. the "Convert Images to WebP" long-tail page).
                let finalFile: Blob =
                    outputFormat === "webp" ? await toWebp(compressedFile, quality) : compressedFile;

                // ── Post-compression byte-exact validation (only when targetSizeBytes is set) ──
                // The browser-image-compression library uses 1_048_576 bytes per MB internally,
                // so 0.1 MB → 104,858 bytes which may exceed a strict 100,000-byte portal limit.
                // We retry with progressively lower quality (up to 2 passes) to get under the cap.
                if (effectiveLimitBytes != null && finalFile.size > effectiveLimitBytes) {
                    const retryQualities = [0.6, 0.4];
                    for (const retryQ of retryQualities) {
                        const retryOptions = {
                            maxSizeMB: effectiveMaxSizeMB,
                            maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
                            useWebWorker: true,
                            initialQuality: retryQ,
                        };
                        compressedFile = await imageCompression(fileObj.originalFile, retryOptions);
                        finalFile = outputFormat === "webp" ? await toWebp(compressedFile, retryQ) : compressedFile;
                        if (finalFile.size <= effectiveLimitBytes) break;
                    }
                }

                // If still over the limit after retries, mark as error.
                if (effectiveLimitBytes != null && finalFile.size > effectiveLimitBytes) {
                    const limitKb = Math.round(effectiveLimitBytes / 1000);
                    trackToolEvent("process_error", {
                        tool: "image-compressor",
                        errorCode: "size_limit_exceeded",
                    });
                    setFileState(prev => prev.map(f =>
                        f.id === fileObj.id
                            ? {
                                ...f,
                                status: "error",
                                errorMsg: `Could not compress under ${limitKb} KB — try a smaller image`,
                            }
                            : f
                    ));
                    continue;
                }

                trackToolEvent("process_success", { tool: "image-compressor" });
                setFileState(prev => prev.map(f => {
                    if (f.id === fileObj.id) {
                        const ratio = ((f.originalSize - finalFile.size) / f.originalSize) * 100;
                        return {
                            ...f,
                            compressedBlob: finalFile,
                            compressedSize: finalFile.size,
                            status: "done",
                            compressionRatio: ratio
                        };
                    }
                    return f;
                }));

            } catch (error) {
                console.error("Compression error:", error);
                trackToolEvent("process_error", {
                    tool: "image-compressor",
                    errorCode: "compression_failed",
                });
                setFileState(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "error", errorMsg: "Compression failed — please try again" } : f));
            }
        }

        setIsProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality, effectiveMaxSizeMB, effectiveLimitBytes, outputFormat]);

    const handleFiles = useCallback((newFiles: File[]) => {
        if (newFiles.length > 0) {
            trackToolEvent("file_selected", {
                tool: "image-compressor",
                detail: `count:${newFiles.length}`,
            });
        }
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

    const outputName = (originalName: string) =>
        outputFormat === "webp"
            ? `compressed-${originalName.replace(/\.[^.]+$/, "")}.webp`
            : `compressed-${originalName}`;

    const downloadFile = (file: CompressedFile) => {
        if (file.status !== "done") return;
        trackToolEvent("download_clicked", {
            tool: "image-compressor",
            detail: outputFormat === "webp" ? "format:webp" : "format:single",
        });
        const url = URL.createObjectURL(file.compressedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = outputName(file.originalFile.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadAll = async () => {
        trackToolEvent("download_clicked", {
            tool: "image-compressor",
            detail: "format:zip",
        });
        const zip = new JSZip();
        const completedFiles = fileState.filter(f => f.status === "done");

        completedFiles.forEach(f => {
            zip.file(outputName(f.originalFile.name), f.compressedBlob);
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
        <div className="w-full flex flex-col gap-8">
            <Suspense fallback={null}>
                <ImageCompressorHandoffSync onFiles={handleFiles} />
            </Suspense>
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

            <LocalTrustNote />

            {outputFormat === "webp" && (
                <p className="text-center text-sm text-emerald-400 font-medium -mt-4">
                    Output format: WebP — downloads will be .webp files.
                </p>
            )}
            {targetLabel != null && (
                <p className="text-center text-sm text-emerald-400 font-medium -mt-4">
                    Target size: {targetLabel} per image — quality adjusts automatically.
                </p>
            )}
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
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={downloadAll}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-white text-zinc-950 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" /> {language === "en" ? t.downloadAll.en : t.downloadAll.cn}
                                </button>
                                <HandoffButton
                                    targetUrl="/tools/pdf-kit?tab=jpg-to-pdf"
                                    label="Convert to PDF"
                                    getItems={() => fileState.filter(f => f.status === "done").map(f => ({
                                        blob: f.compressedBlob,
                                        name: outputName(f.originalFile.name),
                                        type: "image/jpeg"
                                    }))}
                                />
                            </div>
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
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-zinc-200 truncate max-w-[200px] sm:max-w-md">{file.originalFile.name}</p>
                                        {file.status === "error" ? (
                                            <p className="text-xs text-red-400 flex items-center gap-1">
                                                <span>✗</span>
                                                <span>{file.errorMsg ?? "Compression failed"}</span>
                                            </p>
                                        ) : (
                                            <p className="text-xs text-zinc-500 flex items-center gap-2">
                                                {formatBytes(file.originalSize)}
                                                {file.status === "done" && (
                                                    <>
                                                        <span className="text-zinc-600">→</span>
                                                        <span className="text-green-400 font-bold">{formatBytes(file.compressedSize)}</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20">
                                                            {file.compressionRatio.toFixed(0)}%
                                                        </span>
                                                        {/* ✓/✗ target compliance indicator */}
                                                        {effectiveLimitBytes != null && (
                                                            <span className={cn(
                                                                "px-1.5 py-0.5 rounded text-[10px] border font-semibold",
                                                                file.compressedSize <= effectiveLimitBytes
                                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                                            )}>
                                                                {file.compressedSize <= effectiveLimitBytes ? "✓ Under limit" : "✗ Over limit"}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {file.status === "done" && (
                                        <>
                                            <HandoffButton
                                                targetUrl="/tools/pdf-kit?tab=jpg-to-pdf"
                                                label="Convert to PDF"
                                                className="py-1 px-3 text-xs"
                                                getItems={() => [{
                                                    blob: file.compressedBlob,
                                                    name: outputName(file.originalFile.name),
                                                    type: "image/jpeg"
                                                }]}
                                            />
                                            <button
                                                onClick={() => downloadFile(file)}
                                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                                title="Download"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </>
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
    );
}
