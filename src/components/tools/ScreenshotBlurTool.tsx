"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Upload,
    RotateCcw,
    Trash2,
    Download,
    EyeOff,
    Grid3X3,
    Square,
    AlertTriangle,
    Sliders,
    X,
    Check,
    Image as ImageIcon,
    ZoomIn,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";
import { ContinueWith } from "@/components/tools/ContinueWith";
import { HandoffButton } from "@/lib/handoff";

export interface BlurBox {
    id: string;
    x: number; // 0..1 relative coords
    y: number; // 0..1
    w: number; // 0..1
    h: number; // 0..1
}

type BlurMethod = "blur" | "pixelate" | "solid";

const COLOR_PRESETS = [
    { label: "Black", value: "#000000", border: "border-zinc-700" },
    { label: "White", value: "#ffffff", border: "border-zinc-300" },
    { label: "Red", value: "#ef4444", border: "border-red-500" },
];

/**
 * Apply Gaussian blur to a region on ctx using an offscreen canvas and ctx.filter.
 * Reused and adapted from the canvas redaction architecture in /tmp/beautifier-ref.tsx.
 */
function applyBlurRegion(
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    blurPx: number
) {
    if (rw <= 0 || rh <= 0) return;
    const pad = Math.ceil(blurPx * 2);
    try {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = rw + pad * 2;
        offCanvas.height = rh + pad * 2;
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
            offCtx.filter = `blur(${blurPx}px)`;
            const sx = Math.max(0, rx - pad);
            const sy = Math.max(0, ry - pad);
            const sw = Math.min(sourceCanvas.width - sx, rw + pad * 2);
            const sh = Math.min(sourceCanvas.height - sy, rh + pad * 2);

            const dx = rx - pad < 0 ? pad - rx : 0;
            const dy = ry - pad < 0 ? pad - ry : 0;

            offCtx.drawImage(sourceCanvas, sx, sy, sw, sh, dx, dy, sw, sh);

            ctx.save();
            ctx.drawImage(offCanvas, pad, pad, rw, rh, rx, ry, rw, rh);
            ctx.restore();
            return;
        }
    } catch {
        // Fallback to direct clip + filter
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();
    ctx.filter = `blur(${blurPx}px)`;
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.restore();
}

/**
 * Apply pixelate / mosaic to a region by drawing tiny then scaling up without smoothing.
 */
function applyPixelateRegion(
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    blockSize: number
) {
    if (rw <= 0 || rh <= 0) return;
    const safeBlock = Math.max(2, blockSize);
    const tinyW = Math.max(1, Math.round(rw / safeBlock));
    const tinyH = Math.max(1, Math.round(rh / safeBlock));

    const offCanvas = document.createElement("canvas");
    offCanvas.width = tinyW;
    offCanvas.height = tinyH;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = true;
    offCtx.drawImage(sourceCanvas, rx, ry, rw, rh, 0, 0, tinyW, tinyH);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    (ctx as any).mozImageSmoothingEnabled = false;
    (ctx as any).webkitImageSmoothingEnabled = false;
    (ctx as any).msImageSmoothingEnabled = false;
    ctx.drawImage(offCanvas, 0, 0, tinyW, tinyH, rx, ry, rw, rh);
    ctx.restore();
}

/**
 * Apply solid color block fill.
 */
function applySolidRegion(
    ctx: CanvasRenderingContext2D,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    color: string
) {
    if (rw <= 0 || rh <= 0) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.restore();
}

export function ScreenshotBlurTool() {
    const { t } = useLanguage();

    // Image state
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
    const [fileName, setFileName] = useState<string>("screenshot");
    const [naturalDims, setNaturalDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [isOversized, setIsOversized] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportedFile, setExportedFile] = useState<{ blob: Blob; name: string } | null>(null);

    // Blur / redaction parameters
    const [method, setMethod] = useState<BlurMethod>("blur");
    const [blurRadius, setBlurRadius] = useState<number>(16);
    const [blockSize, setBlockSize] = useState<number>(16);
    const [solidColor, setSolidColor] = useState<string>("#000000");

    // Box collection state
    const [boxes, setBoxes] = useState<BlurBox[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Interactive drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [tempBox, setTempBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const drawStartRef = useRef<{ x: number; y: number } | null>(null);

    // Interactive box moving state
    const [isMovingBox, setIsMovingBox] = useState(false);
    const movingBoxIdRef = useRef<string | null>(null);
    const moveStartPointerRef = useRef<{ x: number; y: number } | null>(null);
    const moveStartBoxRef = useRef<{ x: number; y: number } | null>(null);

    // Sizing and refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    const [containerWidth, setContainerWidth] = useState<number>(800);

    // Measure container size dynamically
    useEffect(() => {
        if (!containerRef.current) return;
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        updateWidth();
        const ro = new ResizeObserver(updateWidth);
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Display scale computation (fits within container width & max 65vh)
    const { displayWidth, displayHeight, displayScale } = (() => {
        if (!naturalDims.width || !naturalDims.height) {
            return { displayWidth: 0, displayHeight: 0, displayScale: 1 };
        }
        const maxW = Math.max(280, containerWidth - 32);
        const maxH = typeof window !== "undefined" ? Math.min(window.innerHeight * 0.65, 620) : 600;
        const scale = Math.min(1, maxW / naturalDims.width, maxH / naturalDims.height);
        return {
            displayWidth: Math.max(1, Math.round(naturalDims.width * scale)),
            displayHeight: Math.max(1, Math.round(naturalDims.height * scale)),
            displayScale: scale,
        };
    })();

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const hasTrackedView = useRef(false);
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "screenshot-blur" });
        }
    }, []);

    // Load image from File
    const loadImageFile = useCallback((file: File) => {
        setErrorMessage(null);
        if (!file.type.startsWith("image/")) {
            setErrorMessage(t("Please upload an image file (PNG, JPG, WebP).", "请上传图片格式文件（PNG、JPG、WebP）。"));
            return;
        }

        trackToolEvent("file_selected", { tool: "screenshot-blur", detail: "count:1" });

        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const nw = img.naturalWidth;
            const nh = img.naturalHeight;
            const mp = (nw * nh) / 1_000_000;
            setIsOversized(mp > 50);
            setNaturalDims({ width: nw, height: nh });
            setImageElement(img);
            setFileName(file.name.replace(/\.[^/.]+$/, ""));
            setBoxes([]);
            setSelectedId(null);
            setTempBox(null);
            setExportedFile(null);
        };
        img.onerror = () => {
            trackToolEvent("process_error", { tool: "screenshot-blur", errorCode: "image_load_failed" });
            setErrorMessage(t("Failed to load image. Please try another file.", "加载图片失败，请尝试其他文件。"));
        };
        img.src = url;
    }, [t]);

    // Handle drag & drop on upload area
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadImageFile(e.dataTransfer.files[0]);
        }
    };

    // Handle global paste for screenshots
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (!e.clipboardData) return;
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        loadImageFile(file);
                        break;
                    }
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [loadImageFile]);

    // Keyboard delete listener for selected box
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedId) return;
            const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
            if (targetTag === "input" || targetTag === "textarea") return;

            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                setBoxes((prev) => prev.filter((b) => b.id !== selectedId));
                setSelectedId(null);
            } else if (e.key === "Escape") {
                setSelectedId(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId]);

    // Re-render canvas display preview whenever image, dimensions, boxes, or blur params change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageElement || !displayWidth || !displayHeight) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // 1. Draw original image onto display canvas fresh
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        ctx.drawImage(imageElement, 0, 0, displayWidth, displayHeight);

        // 2. Apply effects per box in sequence
        for (const box of boxes) {
            const rx = Math.round(box.x * displayWidth);
            const ry = Math.round(box.y * displayHeight);
            const rw = Math.round(box.w * displayWidth);
            const rh = Math.round(box.h * displayHeight);

            if (rw <= 0 || rh <= 0) continue;

            if (method === "blur") {
                applyBlurRegion(ctx, canvas, rx, ry, rw, rh, blurRadius);
            } else if (method === "pixelate") {
                applyPixelateRegion(ctx, canvas, rx, ry, rw, rh, blockSize);
            } else {
                applySolidRegion(ctx, rx, ry, rw, rh, solidColor);
            }
        }
    }, [imageElement, displayWidth, displayHeight, boxes, method, blurRadius, blockSize, solidColor]);

    // Drawing new boxes on overlay
    const handleOverlayPointerDown = (e: React.PointerEvent) => {
        if (!overlayRef.current || !displayWidth || !displayHeight) return;
        // Deselect any active box when clicking outside
        setSelectedId(null);

        const rect = overlayRef.current.getBoundingClientRect();
        const startX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const startY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        setIsDrawing(true);
        drawStartRef.current = { x: startX, y: startY };
        setTempBox({ x: startX, y: startY, w: 0, h: 0 });
        try {
            overlayRef.current.setPointerCapture(e.pointerId);
        } catch {}
    };

    const handleOverlayPointerMove = (e: React.PointerEvent) => {
        if (!isDrawing || !drawStartRef.current || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const curX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const curY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        const minX = Math.min(drawStartRef.current.x, curX);
        const minY = Math.min(drawStartRef.current.y, curY);
        const w = Math.abs(curX - drawStartRef.current.x);
        const h = Math.abs(curY - drawStartRef.current.y);

        setTempBox({ x: minX, y: minY, w, h });
    };

    const handleOverlayPointerUp = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        try {
            overlayRef.current?.releasePointerCapture(e.pointerId);
        } catch {}

        if (tempBox && displayWidth && displayHeight) {
            const pxW = tempBox.w * displayWidth;
            const pxH = tempBox.h * displayHeight;
            if (pxW >= 5 && pxH >= 5) {
                const newBox: BlurBox = {
                    id: Math.random().toString(36).substring(2, 9),
                    x: tempBox.x,
                    y: tempBox.y,
                    w: tempBox.w,
                    h: tempBox.h,
                };
                setBoxes((prev) => [...prev, newBox]);
                setSelectedId(newBox.id);
            }
        }
        setTempBox(null);
        drawStartRef.current = null;
    };

    // Moving existing box
    const handleBoxPointerDown = (e: React.PointerEvent, boxId: string) => {
        e.stopPropagation();
        setSelectedId(boxId);
        const box = boxes.find((b) => b.id === boxId);
        if (!box) return;

        setIsMovingBox(true);
        movingBoxIdRef.current = boxId;
        moveStartPointerRef.current = { x: e.clientX, y: e.clientY };
        moveStartBoxRef.current = { x: box.x, y: box.y };
        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {}
    };

    const handleBoxPointerMove = (e: React.PointerEvent) => {
        if (
            !isMovingBox ||
            !movingBoxIdRef.current ||
            !moveStartPointerRef.current ||
            !moveStartBoxRef.current ||
            !displayWidth ||
            !displayHeight
        ) {
            return;
        }

        const dx = (e.clientX - moveStartPointerRef.current.x) / displayWidth;
        const dy = (e.clientY - moveStartPointerRef.current.y) / displayHeight;
        const boxId = movingBoxIdRef.current;

        setBoxes((prev) =>
            prev.map((b) => {
                if (b.id !== boxId) return b;
                const newX = Math.max(0, Math.min(1 - b.w, moveStartBoxRef.current!.x + dx));
                const newY = Math.max(0, Math.min(1 - b.h, moveStartBoxRef.current!.y + dy));
                return { ...b, x: newX, y: newY };
            })
        );
    };

    const handleBoxPointerUp = (e: React.PointerEvent) => {
        if (isMovingBox) {
            setIsMovingBox(false);
            movingBoxIdRef.current = null;
            moveStartPointerRef.current = null;
            moveStartBoxRef.current = null;
            try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
        }
    };

    const deleteBox = (boxId: string) => {
        setBoxes((prev) => prev.filter((b) => b.id !== boxId));
        if (selectedId === boxId) setSelectedId(null);
    };

    const handleUndo = () => {
        setBoxes((prev) => {
            const next = prev.slice(0, -1);
            if (selectedId && !next.some((b) => b.id === selectedId)) {
                setSelectedId(null);
            }
            return next;
        });
    };

    const handleClearAll = () => {
        setBoxes([]);
        setSelectedId(null);
    };

    // Export PNG at natural full-resolution
    const handleExport = async () => {
        if (!imageElement || !naturalDims.width || !naturalDims.height) return;
        setIsExporting(true);
        trackToolEvent("process_started", { tool: "screenshot-blur", detail: `method:${method}` });

        try {
            const nw = naturalDims.width;
            const nh = naturalDims.height;
            const exportCanvas = document.createElement("canvas");
            exportCanvas.width = nw;
            exportCanvas.height = nh;
            const exportCtx = exportCanvas.getContext("2d", { willReadFrequently: true });
            if (!exportCtx) throw new Error("Could not initialize export context");

            // 1. Draw original at full resolution
            exportCtx.drawImage(imageElement, 0, 0, nw, nh);

            // 2. Scale effects proportionally to natural resolution
            const scaleFactor = displayWidth > 0 ? nw / displayWidth : 1;
            const exportBlur = Math.max(1, Math.round(blurRadius * scaleFactor));
            const exportBlockSize = Math.max(2, Math.round(blockSize * scaleFactor));

            // 3. Render each box onto exportCanvas
            for (const box of boxes) {
                const rx = Math.round(box.x * nw);
                const ry = Math.round(box.y * nh);
                const rw = Math.round(box.w * nw);
                const rh = Math.round(box.h * nh);

                if (rw <= 0 || rh <= 0) continue;

                if (method === "blur") {
                    applyBlurRegion(exportCtx, exportCanvas, rx, ry, rw, rh, exportBlur);
                } else if (method === "pixelate") {
                    applyPixelateRegion(exportCtx, exportCanvas, rx, ry, rw, rh, exportBlockSize);
                } else {
                    applySolidRegion(exportCtx, rx, ry, rw, rh, solidColor);
                }
            }

            // 4. Download PNG
            exportCanvas.toBlob((blob) => {
                if (!blob) {
                    setIsExporting(false);
                    trackToolEvent("process_error", { tool: "screenshot-blur", errorCode: "blob_create_failed" });
                    return;
                }
                trackToolEvent("process_success", { tool: "screenshot-blur" });
                trackToolEvent("download_clicked", { tool: "screenshot-blur", detail: "format:png" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const outName = `${fileName || "screenshot"}-blurred.png`;
                link.download = outName;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setExportedFile({ blob, name: outName });
                setIsExporting(false);
            }, "image/png");
        } catch (err: any) {
            console.error("Export error:", err);
            trackToolEvent("process_error", { tool: "screenshot-blur", errorCode: "export_failed" });
            setErrorMessage(t("Export failed: " + (err.message || "Unknown error"), "导出失败：" + (err.message || "未知错误")));
            setIsExporting(false);
        }
    };

    return (
        <div ref={containerRef} className="w-full flex flex-col gap-6">
            {/* Error banner */}
            {errorMessage && (
                <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 flex items-center justify-between text-sm text-red-300">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="text-red-400 hover:text-white p-1 rounded-lg"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Oversized warning */}
            {isOversized && (
                <div className="rounded-xl border border-amber-900/60 bg-amber-950/40 p-3.5 flex items-start gap-3 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>
                        {t(
                            `High-resolution image (${((naturalDims.width * naturalDims.height) / 1_000_000).toFixed(1)} MP). Display is scaled to fit smoothly; export will be processed at full original resolution.`,
                            `超高清图片（${((naturalDims.width * naturalDims.height) / 1_000_000).toFixed(1)} MP）。预览已平滑自适应缩放；最终导出将以原始完整分辨率生成。`
                        )}
                    </p>
                </div>
            )}

            {!imageElement ? (
                /* Initial Upload State */
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "w-full aspect-[16/9] max-h-[460px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 transition-all cursor-pointer group bg-zinc-900/40",
                        isDraggingFile
                            ? "border-emerald-500 bg-emerald-950/20 scale-[0.99]"
                            : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70"
                    )}
                >
                    <div className="w-16 h-16 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-950/40 group-hover:border group-hover:border-emerald-800/50 transition-all">
                        <Upload className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {t("Drop screenshot here or click to browse", "拖放截图至此处或点击浏览")}
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-md mb-2">
                        {t(
                            "Paste from clipboard (Ctrl+V / Cmd+V) also works. Supports PNG, JPG, and WebP.",
                            "支持直接从剪贴板粘贴截图（Ctrl+V / Cmd+V），兼容 PNG、JPG、WebP。"
                        )}
                    </p>
                    <p className="text-xs text-zinc-500 mb-6">
                        {t("All editing & blurring executes 100% locally in your browser.", "所有打码脱敏处理 100% 在本地浏览器完成。")}
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                loadImageFile(e.target.files[0]);
                            }
                        }}
                    />

                    <LocalTrustNote />
                </div>
            ) : (
                /* Active Editor Workspace */
                <div className="flex flex-col gap-5">
                    {/* Toolbar & Controls Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5 flex flex-col gap-5 shadow-xl">
                        {/* Top row: Method selection & Primary Actions */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                            {/* Blur Method Selector */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 sm:mr-1">
                                    {t("Redaction Method", "脱敏方式")}:
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Gaussian Blur */}
                                    <button
                                        type="button"
                                        onClick={() => setMethod("blur")}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
                                            method === "blur"
                                                ? "bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm"
                                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                        )}
                                    >
                                        <EyeOff className="w-4 h-4 shrink-0 text-emerald-400" />
                                        <span>{t("Gaussian Blur", "高斯模糊")}</span>
                                    </button>

                                    {/* Pixelate (Mosaic) */}
                                    <button
                                        type="button"
                                        onClick={() => setMethod("pixelate")}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
                                            method === "pixelate"
                                                ? "bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm"
                                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                        )}
                                    >
                                        <Grid3X3 className="w-4 h-4 shrink-0 text-emerald-400" />
                                        <span>{t("Pixelate", "像素化")}</span>
                                    </button>

                                    {/* Solid Color Block */}
                                    <button
                                        type="button"
                                        onClick={() => setMethod("solid")}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
                                            method === "solid"
                                                ? "bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm"
                                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                        )}
                                    >
                                        <Square className="w-4 h-4 shrink-0 text-emerald-400" />
                                        <span>{t("Solid Block", "纯色块")}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons: Undo, Clear, Replace, Export */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleUndo}
                                    disabled={boxes.length === 0}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs sm:text-sm text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title={t("Undo last box", "撤销上一个选区")}
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{t("Undo", "撤销")}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    disabled={boxes.length === 0}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs sm:text-sm text-zinc-300 hover:text-red-400 hover:border-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title={t("Clear all boxes", "清空所有选区")}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{t("Clear All", "清空")}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs sm:text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                                    title={t("Upload a different image", "更换图片")}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>{t("New Image", "换图")}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{t("Exporting...", "导出中...")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            <span>{t("Export PNG", "导出 PNG")}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Bottom row: Sliders / Color pickers depending on chosen method */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
                            {method === "blur" && (
                                <div className="flex-1 flex items-center gap-3">
                                    <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="text-xs text-zinc-300 shrink-0">
                                        {t("Blur Radius", "模糊强度")}:
                                    </span>
                                    <input
                                        type="range"
                                        min="4"
                                        max="45"
                                        step="1"
                                        value={blurRadius}
                                        onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                                        className="w-full max-w-xs accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                    />
                                    <span className="text-xs font-mono text-emerald-400 shrink-0 w-10 text-right">
                                        {blurRadius}px
                                    </span>
                                </div>
                            )}

                            {method === "pixelate" && (
                                <div className="flex-1 flex items-center gap-3">
                                    <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="text-xs text-zinc-300 shrink-0">
                                        {t("Block Size", "马赛克尺寸")}:
                                    </span>
                                    <input
                                        type="range"
                                        min="4"
                                        max="36"
                                        step="1"
                                        value={blockSize}
                                        onChange={(e) => setBlockSize(parseInt(e.target.value))}
                                        className="w-full max-w-xs accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                    />
                                    <span className="text-xs font-mono text-emerald-400 shrink-0 w-10 text-right">
                                        {blockSize}px
                                    </span>
                                </div>
                            )}

                            {method === "solid" && (
                                <div className="flex-1 flex flex-wrap items-center gap-3">
                                    <span className="text-xs text-zinc-300 shrink-0">
                                        {t("Block Color", "色块颜色")}:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {COLOR_PRESETS.map((preset) => (
                                            <button
                                                key={preset.value}
                                                type="button"
                                                onClick={() => setSolidColor(preset.value)}
                                                className={cn(
                                                    "w-6 h-6 rounded-full border-2 transition-transform flex items-center justify-center",
                                                    preset.border,
                                                    solidColor === preset.value ? "scale-115 ring-2 ring-emerald-500" : "opacity-80 hover:opacity-100"
                                                )}
                                                style={{ backgroundColor: preset.value }}
                                                title={preset.label}
                                            >
                                                {solidColor === preset.value && (
                                                    <Check
                                                        className={cn(
                                                            "w-3.5 h-3.5",
                                                            preset.value === "#ffffff" ? "text-zinc-900" : "text-white"
                                                        )}
                                                    />
                                                )}
                                            </button>
                                        ))}

                                        {/* Custom color input */}
                                        <div className="relative flex items-center ml-1">
                                            <input
                                                type="color"
                                                value={solidColor}
                                                onChange={(e) => setSolidColor(e.target.value)}
                                                className="w-7 h-7 rounded-lg border border-zinc-700 bg-transparent cursor-pointer p-0 overflow-hidden"
                                                title={t("Custom color", "自定义颜色")}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400 ml-1">{solidColor}</span>
                                </div>
                            )}

                            {/* Status info: Box count & Help tip */}
                            <div className="flex items-center gap-3 text-xs text-zinc-400 ml-auto">
                                <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                                    {t("Regions", "已选区域")}: <strong className="text-emerald-400">{boxes.length}</strong>
                                </span>
                                {selectedId && (
                                    <span className="text-zinc-500 hidden md:inline">
                                        {t("(Press Delete to remove selected)", "（按 Delete 键可删除选中框）")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Canvas Stage Area */}
                    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-inner overflow-hidden">
                        {displayWidth > 0 && displayHeight > 0 && (
                            <div
                                className="relative select-none overflow-hidden rounded-lg shadow-2xl border border-zinc-800 bg-zinc-900"
                                style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
                            >
                                {/* Rendered Canvas */}
                                <canvas
                                    ref={canvasRef}
                                    width={displayWidth}
                                    height={displayHeight}
                                    className="block"
                                />

                                {/* Interactive Overlay */}
                                <div
                                    ref={overlayRef}
                                    onPointerDown={handleOverlayPointerDown}
                                    onPointerMove={handleOverlayPointerMove}
                                    onPointerUp={handleOverlayPointerUp}
                                    className="absolute inset-0 cursor-crosshair touch-none"
                                >
                                    {/* Existing boxes */}
                                    {boxes.map((box) => {
                                        const isSelected = box.id === selectedId;
                                        return (
                                            <div
                                                key={box.id}
                                                onPointerDown={(e) => handleBoxPointerDown(e, box.id)}
                                                onPointerMove={handleBoxPointerMove}
                                                onPointerUp={handleBoxPointerUp}
                                                className={cn(
                                                    "group absolute transition-colors",
                                                    isSelected
                                                        ? "border-2 border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-500/10 cursor-move z-20 shadow-md"
                                                        : "border border-dashed border-white/60 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer z-10"
                                                )}
                                                style={{
                                                    left: `${box.x * 100}%`,
                                                    top: `${box.y * 100}%`,
                                                    width: `${box.w * 100}%`,
                                                    height: `${box.h * 100}%`,
                                                }}
                                            >
                                                {/* Delete button on hover or selection */}
                                                <button
                                                    type="button"
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteBox(box.id);
                                                    }}
                                                    className={cn(
                                                        "absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white items-center justify-center shadow-lg transition-transform hover:scale-110 hover:bg-red-500 z-30",
                                                        isSelected ? "flex" : "hidden group-hover:flex"
                                                    )}
                                                    title={t("Delete this box", "删除该区域")}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {/* Active drawing box preview */}
                                    {tempBox && (
                                        <div
                                            className="absolute border-2 border-dashed border-emerald-400 bg-emerald-500/20 pointer-events-none z-30"
                                            style={{
                                                left: `${tempBox.x * 100}%`,
                                                top: `${tempBox.y * 100}%`,
                                                width: `${tempBox.w * 100}%`,
                                                height: `${tempBox.h * 100}%`,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata & Zoom-to-fit Note */}
                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 px-1 gap-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                                {t(
                                    "Drag mouse over sensitive details to blur. Click a box to move or hit Delete.",
                                    "鼠标框选拖拽即可对敏感信息打码；点击已有选区可拖动或按 Delete 键删除。"
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500">
                            <span>
                                {naturalDims.width} × {naturalDims.height} px
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <ZoomIn className="w-3 h-3 text-zinc-400" />
                                {t("Display fit", "画面自适应")}: {Math.round(displayScale * 100)}%
                            </span>
                        </div>
                    </div>

                    {exportedFile && (
                        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                <Check className="w-4 h-4 shrink-0" />
                                <span>
                                    {t(
                                        `Exported ${exportedFile.name}. Ready for publishing or metadata removal:`,
                                        `已导出 ${exportedFile.name}。可直接发布，或继续清除元数据：`
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <HandoffButton
                                    targetUrl="/tools/image-compressor"
                                    label="Compress"
                                    getItems={() => [{ blob: exportedFile.blob, name: exportedFile.name, type: "image/png" }]}
                                />
                                <ContinueWith
                                    links={[
                                        { label: t("Strip EXIF Metadata →", "清除 EXIF 元数据 →"), href: "/tools/exif-remover" },
                                        { label: t("Compress Image →", "压缩图片体积 →"), href: "/tools/image-compressor/compress-image-to-100kb" },
                                    ]}
                                    getFile={() => exportedFile}
                                    toolId="screenshot-blur"
                                />
                            </div>
                        </div>
                    )}

                    {/* Local processing note */}
                    <div className="pt-2">
                        <LocalTrustNote />
                    </div>

                    {/* Hidden file input for replacing image */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                loadImageFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
