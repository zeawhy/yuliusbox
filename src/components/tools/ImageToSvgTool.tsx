"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
    Upload,
    Download,
    Copy,
    Check,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Sliders,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Maximize2,
    X,
    Sparkles,
    Image as ImageIcon,
    Grid,
    RefreshCw,
    AlertCircle,
    Info,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
    TRACER_PRESETS,
    TracerPresetId,
    TracerCustomOptions,
    TraceProgress,
    TraceResult,
    VTracerClient,
} from "@/lib/vtracer-client";

interface UploadedFileInfo {
    file?: File;
    name: string;
    url: string;
    sizeBytes: number;
    width: number;
    height: number;
    blob: Blob;
}

export function ImageToSvgTool() {
    const { t, language } = useLanguage();
    const isCn = language === "cn";

    // VTracer Worker Client instance ref
    const clientRef = useRef<VTracerClient | null>(null);

    // Upload & image state
    const [imageInfo, setImageInfo] = useState<UploadedFileInfo | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Preset & options
    const [selectedPreset, setSelectedPreset] = useState<TracerPresetId>("logo");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Advanced options state
    const [mode, setMode] = useState<"spline" | "polygon" | "pixel">("spline");
    const [filterSpeckle, setFilterSpeckle] = useState<number>(4);
    const [colorPrecision, setColorPrecision] = useState<number>(6);
    const [maxColors, setMaxColors] = useState<number | null>(null);
    const [cornerThreshold, setCornerThreshold] = useState<number>(60);
    const [removeBackground, setRemoveBackground] = useState<boolean>(false);

    // Conversion state
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState<TraceProgress | null>(null);
    const [result, setResult] = useState<TraceResult | null>(null);

    // Preview state
    const [zoom, setZoom] = useState(1);
    const [checkerboard, setCheckerboard] = useState(true);
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<"compare" | "svg" | "original">("compare");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Initialize worker client on mount
    useEffect(() => {
        clientRef.current = new VTracerClient();
        return () => {
            clientRef.current?.terminate();
            clientRef.current = null;
        };
    }, []);

    // Preset change handler
    const handlePresetChange = (presetId: TracerPresetId) => {
        setSelectedPreset(presetId);
        const cfg = TRACER_PRESETS[presetId].options;
        setMode(cfg.mode);
        setFilterSpeckle(cfg.filterSpeckle);
        setColorPrecision(cfg.colorPrecision ?? 6);
        setMaxColors(cfg.maxColors ?? null);
        if (presetId === "logo") {
            setCornerThreshold(60);
        } else if (presetId === "pixelart") {
            setCornerThreshold(0);
        } else {
            setCornerThreshold(60);
        }
    };

    // Load file and check constraints
    const processFile = useCallback((fileOrBlob: Blob, filename = "image.png") => {
        setErrorMessage(null);

        // 1. Check size limit: 10MB
        const MAX_BYTES = 10 * 1024 * 1024;
        if (fileOrBlob.size > MAX_BYTES) {
            setErrorMessage(
                isCn
                    ? `文件大小为 ${formatBytes(fileOrBlob.size)}，超过了 10MB 限制。请选择更小的图片。`
                    : `File size is ${formatBytes(fileOrBlob.size)}, exceeding the 10MB limit. Please choose a smaller file.`
            );
            return;
        }

        // 2. Check MIME type
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (fileOrBlob.type && !validTypes.includes(fileOrBlob.type.toLowerCase())) {
            setErrorMessage(
                isCn
                    ? "仅支持 PNG、JPG 或 WebP 格式的图片。"
                    : "Only PNG, JPG, or WebP images are supported."
            );
            return;
        }

        const objectUrl = URL.createObjectURL(fileOrBlob);
        const img = new Image();
        img.onload = () => {
            const uploaded: UploadedFileInfo = {
                file: fileOrBlob instanceof File ? fileOrBlob : undefined,
                name: filename,
                url: objectUrl,
                sizeBytes: fileOrBlob.size,
                width: img.naturalWidth,
                height: img.naturalHeight,
                blob: fileOrBlob,
            };
            setImageInfo(uploaded);
            setResult(null);
            setZoom(1);

            // Automatically start conversion
            runConversion(uploaded, {
                presetId: selectedPreset,
                mode,
                filterSpeckle,
                colorPrecision,
                maxColors,
                cornerThreshold,
                removeBackground,
            });
        };
        img.onerror = () => {
            setErrorMessage(
                isCn
                    ? "无法解析此图片，请确认文件是否损坏。"
                    : "Unable to parse this image file. Please verify it is a valid graphic."
            );
        };
        img.src = objectUrl;
    }, [isCn, selectedPreset, mode, filterSpeckle, colorPrecision, maxColors, cornerThreshold, removeBackground]);

    // Conversion runner
    const runConversion = async (info: UploadedFileInfo, optionsOverride?: TracerCustomOptions) => {
        if (!clientRef.current) return;

        setIsConverting(true);
        setProgress({ phase: "segment", fraction: 0.05, percentage: 5, label: isCn ? "正在初始化 WASM 线程..." : "Initializing WASM worker..." });

        const opts: TracerCustomOptions = optionsOverride ?? {
            presetId: selectedPreset,
            mode,
            filterSpeckle,
            colorPrecision,
            maxColors,
            cornerThreshold,
            removeBackground,
        };

        try {
            const res = await clientRef.current.convertImage(info.blob, opts, (p) => {
                setProgress(p);
            });
            setResult(res);
        } catch (err: unknown) {
            console.error("Vector conversion failed:", err);
            const errStr = err instanceof Error ? err.message : String(err);
            setErrorMessage(
                isCn
                    ? `矢量转换失败：${errStr}`
                    : `Vector conversion failed: ${errStr}`
            );
        } finally {
            setIsConverting(false);
            setProgress(null);
        }
    };

    // Paste event listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith("image/")) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        e.preventDefault();
                        processFile(blob, `pasted-image-${Date.now()}.png`);
                        break;
                    }
                }
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [processFile]);

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            processFile(file, file.name);
        }
    };

    // Sample image loader
    const loadSample = async (sampleName: "logo" | "illustration" | "lineart") => {
        handlePresetChange(sampleName);
        try {
            const resp = await fetch(`/samples/image-to-svg/${sampleName}.png`);
            if (!resp.ok) throw new Error("Sample file not found");
            const blob = await resp.blob();
            processFile(blob, `sample-${sampleName}.png`);
        } catch (err) {
            console.error("Failed to load sample:", err);
            setErrorMessage(isCn ? "加载示例图片失败" : "Failed to load sample image");
        }
    };

    // Download action
    const handleDownload = () => {
        if (!result) return;
        const blob = new Blob([result.svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const baseName = imageInfo?.name ? imageInfo.name.replace(/\.[^.]+$/, "") : "vector";
        link.href = url;
        link.download = `${baseName}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Copy SVG code action
    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.svg);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = result.svg;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Re-run with modified options
    const handleReconvert = () => {
        if (!imageInfo) return;
        runConversion(imageInfo);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Reassurance Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm text-emerald-400">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span>
                        <strong>{isCn ? "100% 浏览器本地运算：" : "100% Client-Side Private: "}</strong>
                        {isCn
                            ? "图片绝不离开您的设备，完全在浏览器内通过 WebAssembly 运行，无服务器上传、不调用任何 AI API。"
                            : "Your images never leave your browser. All vector tracing executes locally via WebAssembly — no uploads, no AI API."}
                    </span>
                </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-sm text-rose-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold">{isCn ? "提示" : "Notice"}</p>
                        <p className="mt-0.5">{errorMessage}</p>
                    </div>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="text-zinc-400 hover:text-white"
                        aria-label="Close error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Area / Dropzone */}
            {!imageInfo ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-blue-500/50",
                        dragActive ? "border-blue-500 bg-blue-500/10 scale-[0.99]" : "border-zinc-800"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                processFile(e.target.files[0], e.target.files[0].name);
                            }
                        }}
                    />

                    <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-blue-500/50 transition-all text-zinc-300 group-hover:text-blue-400">
                        <Upload className="w-8 h-8" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        {isCn ? "拖拽图片至此处，或点击上传" : "Drop your image here, or click to browse"}
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-md mb-4">
                        {isCn
                            ? "支持 PNG、JPG、WebP 格式（最大 10MB），支持快捷键 Ctrl+V / ⌘+V 粘贴剪贴板图片。"
                            : "Supports PNG, JPG, WebP up to 10MB. Or paste from clipboard (Ctrl+V / ⌘+V)."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
                        <span className="px-2.5 py-1 bg-zinc-800/70 rounded-full border border-zinc-700/50">
                            {isCn ? "超 4096px 自动等比优化" : "Auto-downscales > 4096px"}
                        </span>
                        <span className="px-2.5 py-1 bg-zinc-800/70 rounded-full border border-zinc-700/50">
                            {isCn ? "离线可用 · 零上传" : "100% Offline Capable"}
                        </span>
                    </div>

                    {/* Quick Sample Buttons */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-2"
                    >
                        <span className="text-xs text-zinc-400 mr-1">
                            {isCn ? "快速体验示例：" : "Try sample images:"}
                        </span>
                        <button
                            type="button"
                            onClick={() => loadSample("logo")}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
                        >
                            🔷 {isCn ? "几何徽标 (Logo)" : "Logo / Icon"}
                        </button>
                        <button
                            type="button"
                            onClick={() => loadSample("illustration")}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
                        >
                            🎨 {isCn ? "彩色插画 (Illustration)" : "Illustration"}
                        </button>
                        <button
                            type="button"
                            onClick={() => loadSample("lineart")}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
                        >
                            ✒️ {isCn ? "黑白线稿 (Line Art)" : "Line Art"}
                        </button>
                    </div>
                </div>
            ) : (
                /* Main Working Area: Controls + Comparison Preview */
                <div className="flex flex-col gap-6">
                    {/* Control Card */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
                        {/* File status & Reset bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-blue-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                                        {imageInfo.name}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        {imageInfo.width} × {imageInfo.height} px · {formatBytes(imageInfo.sizeBytes)}
                                        {result?.wasScaled && (
                                            <span className="ml-2 text-amber-400">
                                                ({isCn ? "已等比缩小至" : "Scaled to"} {result.scaledWidth}×{result.scaledHeight}px)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setImageInfo(null);
                                        setResult(null);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700 transition-colors"
                                >
                                    {isCn ? "更换图片" : "Change Image"}
                                </button>
                                <button
                                    disabled={isConverting}
                                    onClick={handleReconvert}
                                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors"
                                >
                                    <RefreshCw className={cn("w-3.5 h-3.5", isConverting && "animate-spin")} />
                                    {isCn ? "重新描摹" : "Re-trace"}
                                </button>
                            </div>
                        </div>

                        {/* Preset Selector */}
                        <div className="flex flex-col gap-2.5">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                {isCn ? "预设模式 (Presets)" : "Preset Modes"}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {(Object.keys(TRACER_PRESETS) as TracerPresetId[]).map((key) => {
                                    const preset = TRACER_PRESETS[key];
                                    const isSelected = selectedPreset === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => handlePresetChange(key)}
                                            className={cn(
                                                "p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150",
                                                isSelected
                                                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                                                    : "bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700"
                                            )}
                                        >
                                            <span className="font-semibold text-sm">
                                                {isCn ? preset.label.cn : preset.label.en}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                                                {isCn ? preset.description.cn : preset.description.en}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Collapsible Advanced Parameters */}
                        <div className="border border-zinc-800/80 rounded-xl bg-zinc-950/40 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-zinc-300 hover:bg-zinc-800/40 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-zinc-400" />
                                    {isCn ? "高级微调参数 (可选)" : "Advanced Parameters (Fine-tuning)"}
                                </span>
                                {showAdvanced ? (
                                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                )}
                            </button>

                            {showAdvanced && (
                                <div className="p-4 pt-2 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                    {/* 1. Max Colors */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-zinc-300">
                                            <span>{isCn ? "颜色数量" : "Color Count"}</span>
                                            <span className="font-mono text-zinc-400">
                                                {maxColors === null ? (isCn ? "自动" : "Auto") : `${maxColors} 色`}
                                            </span>
                                        </div>
                                        <select
                                            value={maxColors === null ? "auto" : String(maxColors)}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setMaxColors(val === "auto" ? null : parseInt(val, 10));
                                            }}
                                            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="auto">{isCn ? "自动识别 (全色阶)" : "Auto (Full Colors)"}</option>
                                            <option value="2">2 {isCn ? "色 (纯双色/黑白)" : "Colors (Monochrome)"}</option>
                                            <option value="4">4 {isCn ? "色" : "Colors"}</option>
                                            <option value="8">8 {isCn ? "色" : "Colors"}</option>
                                            <option value="16">16 {isCn ? "色" : "Colors"}</option>
                                            <option value="32">32 {isCn ? "色" : "Colors"}</option>
                                            <option value="64">64 {isCn ? "色" : "Colors"}</option>
                                        </select>
                                    </div>

                                    {/* 2. Detail Level (Filter Speckle) */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-zinc-300">
                                            <span>{isCn ? "噪点过滤 (细节程度)" : "Noise Filter (Detail)"}</span>
                                            <span className="font-mono text-zinc-400">{filterSpeckle} px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="16"
                                            step="1"
                                            value={filterSpeckle}
                                            onChange={(e) => setFilterSpeckle(parseInt(e.target.value, 10))}
                                            className="w-full accent-blue-500 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-zinc-500">
                                            <span>{isCn ? "保留微细节 (0)" : "Fine Detail (0)"}</span>
                                            <span>{isCn ? "强降噪 (16)" : "Smooth (16)"}</span>
                                        </div>
                                    </div>

                                    {/* 3. Geometry Mode & Smoothness */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-zinc-300">
                                            <span>{isCn ? "曲线拟合 (平滑度)" : "Fitting Mode"}</span>
                                            <span className="font-mono text-zinc-400 capitalize">{mode}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80">
                                            {(["spline", "polygon", "pixel"] as const).map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setMode(m)}
                                                    className={cn(
                                                        "py-1 rounded text-[11px] font-medium transition-colors text-center capitalize",
                                                        mode === m
                                                            ? "bg-blue-600 text-white"
                                                            : "text-zinc-400 hover:text-zinc-200"
                                                    )}
                                                >
                                                    {m === "spline" ? (isCn ? "贝塞尔" : "Spline") : m === "polygon" ? (isCn ? "折线" : "Poly") : (isCn ? "像素" : "Pixel")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4. Remove Background Color */}
                                    <div className="flex flex-col justify-center gap-1.5">
                                        <span className="text-zinc-300">{isCn ? "背景处理" : "Background"}</span>
                                        <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                                            <input
                                                type="checkbox"
                                                checked={removeBackground}
                                                onChange={(e) => setRemoveBackground(e.target.checked)}
                                                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
                                            />
                                            <span className="text-zinc-200 font-medium">
                                                {isCn ? "去除背景色 (透明输出)" : "Remove background (Transparent)"}
                                            </span>
                                        </label>
                                        <span className="text-[10px] text-zinc-500">
                                            {isCn ? "剔除最底层铺底背景色块" : "Strips the base bounding background layer"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar when converting */}
                        {isConverting && progress && (
                            <div className="w-full bg-zinc-950 p-4 rounded-xl border border-blue-500/30 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-blue-400 font-medium flex items-center gap-2">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        {progress.label}
                                    </span>
                                    <span className="text-zinc-400 font-mono">{progress.percentage}%</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full transition-all duration-200 ease-out rounded-full"
                                        style={{ width: `${Math.max(5, progress.percentage)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Result Stats & Export Toolbar */}
                    {result && (
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
                            {/* Metrics */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-zinc-300">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-zinc-500">{isCn ? "矢量文件大小:" : "SVG Size:"}</span>
                                    <span className="font-semibold text-emerald-400 font-mono text-sm">
                                        {formatBytes(result.sizeBytes)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-zinc-500">{isCn ? "路径数:" : "Path Count:"}</span>
                                    <span className="font-semibold text-blue-400 font-mono text-sm">
                                        {result.pathCount} {isCn ? "个" : "paths"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-zinc-500">{isCn ? "耗时:" : "Duration:"}</span>
                                    <span className="font-mono text-zinc-300">{result.durationMs} ms</span>
                                </div>
                            </div>

                            {/* Export buttons */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={handleCopy}
                                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700/80 flex items-center gap-1.5 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-400" />
                                            <span className="text-emerald-400">{isCn ? "已复制！" : "Copied!"}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 text-zinc-400" />
                                            <span>{isCn ? "复制代码" : "Copy SVG"}</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>{isCn ? "下载 .SVG 文件" : "Download .SVG"}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile View Toggle */}
                    <div className="lg:hidden flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setMobileTab("compare")}
                            className={cn(
                                "flex-1 py-1.5 text-center rounded-md font-medium transition-colors",
                                mobileTab === "compare" ? "bg-zinc-800 text-white" : "text-zinc-400"
                            )}
                        >
                            {isCn ? "左右并排" : "Side-by-side"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileTab("svg")}
                            className={cn(
                                "flex-1 py-1.5 text-center rounded-md font-medium transition-colors",
                                mobileTab === "svg" ? "bg-blue-600 text-white" : "text-zinc-400"
                            )}
                        >
                            {isCn ? "仅矢量 (SVG)" : "SVG Only"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileTab("original")}
                            className={cn(
                                "flex-1 py-1.5 text-center rounded-md font-medium transition-colors",
                                mobileTab === "original" ? "bg-zinc-800 text-white" : "text-zinc-400"
                            )}
                        >
                            {isCn ? "仅原图" : "Original Only"}
                        </button>
                    </div>

                    {/* Side-by-side Comparison Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 1. Original Image View */}
                        {(mobileTab === "compare" || mobileTab === "original") && (
                            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                                        {isCn ? "原始位图 (PNG / JPG / WebP)" : "Original Bitmap"}
                                    </span>
                                    <span className="text-[11px] font-mono text-zinc-500">
                                        {imageInfo.width}×{imageInfo.height} · {formatBytes(imageInfo.sizeBytes)}
                                    </span>
                                </div>

                                <div className="w-full h-80 sm:h-96 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-center overflow-hidden p-3 relative">
                                    <img
                                        src={imageInfo.url}
                                        alt={imageInfo.name}
                                        className="max-w-full max-h-full object-contain select-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. SVG Vector Preview */}
                        {(mobileTab === "compare" || mobileTab === "svg") && (
                            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                        {isCn ? "矢量化结果 (Scalable Vector)" : "Vector Result (SVG)"}
                                    </span>

                                    {/* Zoom & Canvas controls */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setCheckerboard(!checkerboard)}
                                            title={isCn ? "切换棋盘透明背景" : "Toggle checkerboard background"}
                                            className={cn(
                                                "p-1.5 rounded-lg border text-xs transition-colors",
                                                checkerboard
                                                    ? "bg-zinc-800 border-zinc-700 text-blue-400"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                                            )}
                                        >
                                            <Grid className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100))}
                                            title={isCn ? "缩小" : "Zoom out"}
                                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-300 text-xs"
                                        >
                                            <ZoomOut className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-[11px] font-mono text-zinc-400 w-10 text-center">
                                            {Math.round(zoom * 100)}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setZoom((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                                            title={isCn ? "放大" : "Zoom in"}
                                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-300 text-xs"
                                        >
                                            <ZoomIn className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setZoom(1)}
                                            title={isCn ? "重置缩放 (100%)" : "Reset zoom (100%)"}
                                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-300 text-xs ml-0.5"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(true)}
                                            title={isCn ? "全屏大图查看" : "Full window inspection"}
                                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-300 text-xs ml-0.5"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        "w-full h-80 sm:h-96 rounded-xl border border-zinc-800 flex items-center justify-center overflow-auto p-3 relative",
                                        checkerboard
                                            ? "bg-[linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]"
                                            : "bg-zinc-950"
                                    )}
                                >
                                    {isConverting ? (
                                        <div className="flex flex-col items-center gap-3 text-zinc-400">
                                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                            <p className="text-xs">{progress?.label || (isCn ? "正在生成矢量路径..." : "Generating vector geometry...")}</p>
                                        </div>
                                    ) : result ? (
                                        <div
                                            style={{
                                                transform: `scale(${zoom})`,
                                                transformOrigin: "center center",
                                                transition: "transform 150ms ease-out",
                                            }}
                                            className="max-w-full max-h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:h-auto [&>svg]:w-auto"
                                            dangerouslySetInnerHTML={{ __html: result.svg }}
                                        />
                                    ) : (
                                        <p className="text-xs text-zinc-500">
                                            {isCn ? "等待转换..." : "Waiting for vector rendering..."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for full screen inspection */}
            {modalOpen && result && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="flex items-center justify-between pb-4 border-b border-zinc-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <h4 className="text-white font-semibold text-base sm:text-lg">
                                {isCn ? "高清矢量检查" : "Vector Inspection View"}
                            </h4>
                            <span className="text-xs text-zinc-400">
                                {formatBytes(result.sizeBytes)} · {result.pathCount} paths
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>{isCn ? "下载" : "Download"}</span>
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        className="flex-1 flex items-center justify-center overflow-auto p-4 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="max-w-full max-h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                            dangerouslySetInnerHTML={{ __html: result.svg }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
