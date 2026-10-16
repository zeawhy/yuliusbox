"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import {
    Upload,
    FileText,
    PenTool,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    AlertTriangle,
    Check,
    Loader2,
    Plus,
    Minus,
    Download,
    Eye,
    RotateCcw,
    Sparkles,
    Move,
    Maximize2,
    Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";

// Configure pdfjs worker in the browser
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
        ).toString();
    } catch {
        // Fallback or bundling environment handling
    }
}

export interface RedactionBox {
    id: string;
    page: number; // 1-indexed
    x: number; // 0..1, top-left origin
    y: number; // 0..1
    w: number; // 0..1
    h: number; // 0..1
}

export interface PlacedSignature {
    id: string;
    page: number; // 1-indexed
    dataUrl: string; // PNG base64
    x: number; // 0..1
    y: number; // 0..1
    w: number; // 0..1
    h: number; // 0..1
    aspect: number; // naturalHeight / naturalWidth
}

type Step = 1 | 2 | 3 | 4;
type ToolMode = "redact" | "sign";
type SigMethod = "draw" | "upload";

function downloadBlob(data: Uint8Array | Blob, filename: string, type: string) {
    const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function PdfRedactSignTool() {
    const { t } = useLanguage();

    // Step state
    const [step, setStep] = useState<Step>(1);
    const [toolMode, setToolMode] = useState<ToolMode>("redact");

    // PDF document state
    const [file, setFile] = useState<File | null>(null);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
    const [pdfjsDoc, setPdfjsDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageDims, setPageDims] = useState<{ width: number; height: number }>({ width: 600, height: 800 });

    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const [isRenderingPage, setIsRenderingPage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Canvas references
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

    // Redaction state
    const [redactionBoxes, setRedactionBoxes] = useState<RedactionBox[]>([]);
    const [thoroughMode, setThoroughMode] = useState<boolean>(true);
    const [isDrawingBox, setIsDrawingBox] = useState<boolean>(false);
    const [boxStart, setBoxStart] = useState<{ x: number; y: number } | null>(null);
    const [tempBox, setTempBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

    // Signature creation state
    const [sigMethod, setSigMethod] = useState<SigMethod>("draw");
    const [activeSigDataUrl, setActiveSigDataUrl] = useState<string | null>(null);
    const [activeSigAspect, setActiveSigAspect] = useState<number>(0.35); // default height/width ratio
    const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
    const [selectedSigId, setSelectedSigId] = useState<string | null>(null);

    // Pad drawing state
    const sigPadRef = useRef<HTMLCanvasElement | null>(null);
    const [isPadDrawing, setIsPadDrawing] = useState(false);
    const [hasDrawnOnPad, setHasDrawnOnPad] = useState(false);

    // Dragging placed signature on page
    const [dragSigState, setDragSigState] = useState<{
        sigId: string;
        startX: number;
        startY: number;
        origX: number;
        origY: number;
    } | null>(null);

    // Exporting state
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportProgress, setExportProgress] = useState<string>("");

    // Current page redaction boxes & signatures
    const currentPageBoxes = redactionBoxes.filter((b) => b.page === currentPage);
    const currentPageSignatures = placedSignatures.filter((s) => s.page === currentPage);
    const selectedSig = placedSignatures.find((s) => s.id === selectedSigId) || null;

    // Handle initial PDF upload
    const handlePdfUpload = useCallback(async (selectedFile: File) => {
        setIsLoadingPdf(true);
        setError(null);
        try {
            const buffer = await selectedFile.arrayBuffer();
            // Verify with pdf-lib
            await PDFDocument.load(buffer.slice(0));

            // Load with pdfjs-dist
            const loadingTask = pdfjsLib.getDocument({
                data: new Uint8Array(buffer.slice(0)),
            });
            const loadedDoc = await loadingTask.promise;

            setFile(selectedFile);
            setFileBuffer(buffer);
            setPdfjsDoc(loadedDoc);
            setNumPages(loadedDoc.numPages);
            setCurrentPage(1);
            setRedactionBoxes([]);
            setPlacedSignatures([]);
            setSelectedSigId(null);
            setStep(2);
            setToolMode("redact");
        } catch {
            setError(
                t(
                    "Failed to open PDF. The file may be password-protected or corrupted.",
                    "无法打开此 PDF。文件可能受密码保护或已损坏。"
                )
            );
        } finally {
            setIsLoadingPdf(false);
        }
    }, [t]);

    // Render current page onto preview canvas
    useEffect(() => {
        if (!pdfjsDoc || currentPage < 1) return;

        let isCancelled = false;
        setIsRenderingPage(true);

        const renderPage = async () => {
            try {
                if (renderTaskRef.current) {
                    try {
                        renderTaskRef.current.cancel();
                    } catch {
                        // ignore cancelled task error
                    }
                    renderTaskRef.current = null;
                }

                const page = await pdfjsDoc.getPage(currentPage);
                if (isCancelled) return;

                // Scale for crispness
                const scale = 1.75;
                const viewport = page.getViewport({ scale });
                const canvas = previewCanvasRef.current;
                if (!canvas || isCancelled) return;

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext("2d");
                if (!ctx || isCancelled) return;

                const task = page.render({
                    canvas,
                    canvasContext: ctx,
                    viewport,
                });
                renderTaskRef.current = task;
                await task.promise;

                if (!isCancelled) {
                    setPageDims({ width: viewport.width, height: viewport.height });
                    setIsRenderingPage(false);
                }
            } catch (err: unknown) {
                // Ignore normal cancellation errors during fast navigation
                if (err instanceof Error && err.name !== "RenderingCancelledException") {
                    console.error("Page render error:", err);
                }
                if (!isCancelled) {
                    setIsRenderingPage(false);
                }
            }
        };

        renderPage();

        return () => {
            isCancelled = true;
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch {
                    // ignore
                }
            }
        };
    }, [pdfjsDoc, currentPage]);

    // Redaction drag handlers on overlay
    const getRelativeCoords = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!overlayRef.current) return { x: 0, y: 0 };
        const rect = overlayRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        return { x, y };
    };

    const handleOverlayPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Redaction box drawing
        if (toolMode === "redact") {
            const { x, y } = getRelativeCoords(e);
            e.currentTarget.setPointerCapture(e.pointerId);
            setIsDrawingBox(true);
            setBoxStart({ x, y });
            setTempBox(null);
            return;
        }

        // Signature placement mode: clicking empty canvas area drops active signature
        if (toolMode === "sign" && activeSigDataUrl && !dragSigState) {
            const { x, y } = getRelativeCoords(e);
            const w = 0.25; // default 25% width
            const pageRatio = pageDims.height / (pageDims.width || 1);
            const h = (w * activeSigAspect) / (pageRatio || 1.414);

            const newSig: PlacedSignature = {
                id: Math.random().toString(36).substring(7),
                page: currentPage,
                dataUrl: activeSigDataUrl,
                x: Math.max(0, Math.min(1 - w, x - w / 2)),
                y: Math.max(0, Math.min(1 - h, y - h / 2)),
                w,
                h,
                aspect: activeSigAspect,
            };

            setPlacedSignatures((prev) => [...prev, newSig]);
            setSelectedSigId(newSig.id);
        }
    };

    const handleOverlayPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (toolMode === "redact" && isDrawingBox && boxStart) {
            const { x, y } = getRelativeCoords(e);
            const minX = Math.min(boxStart.x, x);
            const minY = Math.min(boxStart.y, y);
            const w = Math.abs(x - boxStart.x);
            const h = Math.abs(y - boxStart.y);
            setTempBox({ x: minX, y: minY, w, h });
            return;
        }

        if (toolMode === "sign" && dragSigState) {
            const { x, y } = getRelativeCoords(e);
            const dx = x - dragSigState.startX;
            const dy = y - dragSigState.startY;

            setPlacedSignatures((prev) =>
                prev.map((s) => {
                    if (s.id !== dragSigState.sigId) return s;
                    const nextX = Math.max(0, Math.min(1 - s.w, dragSigState.origX + dx));
                    const nextY = Math.max(0, Math.min(1 - s.h, dragSigState.origY + dy));
                    return { ...s, x: nextX, y: nextY };
                })
            );
        }
    };

    const handleOverlayPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (toolMode === "redact" && isDrawingBox) {
            setIsDrawingBox(false);
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
            if (tempBox && tempBox.w > 0.005 && tempBox.h > 0.005) {
                setRedactionBoxes((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substring(7),
                        page: currentPage,
                        x: tempBox.x,
                        y: tempBox.y,
                        w: tempBox.w,
                        h: tempBox.h,
                    },
                ]);
            }
            setBoxStart(null);
            setTempBox(null);
        }

        if (toolMode === "sign" && dragSigState) {
            setDragSigState(null);
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
        }
    };

    // Delete single redaction box
    const deleteBox = (id: string) => {
        setRedactionBoxes((prev) => prev.filter((b) => b.id !== id));
    };

    // Clear current page boxes
    const clearCurrentPageBoxes = () => {
        setRedactionBoxes((prev) => prev.filter((b) => b.page !== currentPage));
    };

    // Clear all boxes
    const clearAllBoxes = () => {
        setRedactionBoxes([]);
    };

    // Hand-drawn signature pad functions
    const startPadDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = sigPadRef.current;
        if (!canvas) return;
        canvas.setPointerCapture(e.pointerId);
        setIsPadDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setHasDrawnOnPad(true);
    };

    const drawOnPad = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isPadDrawing) return;
        const canvas = sigPadRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000000";
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const endPadDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isPadDrawing) return;
        setIsPadDrawing(false);
        const canvas = sigPadRef.current;
        if (canvas && e.pointerId) {
            try {
                canvas.releasePointerCapture(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    const clearPad = () => {
        const canvas = sigPadRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawnOnPad(false);
    };

    const savePadSignature = () => {
        const canvas = sigPadRef.current;
        if (!canvas || !hasDrawnOnPad) return;
        const dataUrl = canvas.toDataURL("image/png");
        setActiveSigDataUrl(dataUrl);
        setActiveSigAspect(canvas.height / canvas.width);
        setToolMode("sign");
    };

    const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const imgFile = e.target.files?.[0];
        if (!imgFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
                setActiveSigDataUrl(dataUrl);
                setActiveSigAspect(img.naturalHeight / (img.naturalWidth || 1));
                setToolMode("sign");
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(imgFile);
        e.target.value = "";
    };

    // Resize selected signature
    const updateSelectedSigWidth = (newW: number) => {
        if (!selectedSig) return;
        const clampedW = Math.max(0.08, Math.min(0.65, newW));
        const pageRatio = pageDims.height / (pageDims.width || 1);
        const newH = (clampedW * selectedSig.aspect) / (pageRatio || 1.414);

        setPlacedSignatures((prev) =>
            prev.map((s) => {
                if (s.id !== selectedSig.id) return s;
                return {
                    ...s,
                    w: clampedW,
                    h: newH,
                    x: Math.min(s.x, 1 - clampedW),
                    y: Math.min(s.y, 1 - newH),
                };
            })
        );
    };

    const deleteSignature = (id: string) => {
        setPlacedSignatures((prev) => prev.filter((s) => s.id !== id));
        if (selectedSigId === id) setSelectedSigId(null);
    };

    // Export PDF
    const exportDocument = async () => {
        if (!fileBuffer || !file || !pdfjsDoc) return;
        setIsExporting(true);
        setError(null);
        setExportProgress(t("Preparing document export...", "正在准备文档导出..."));

        try {
            const origPdf = await PDFDocument.load(fileBuffer.slice(0));
            const outPdf = await PDFDocument.create();
            const total = origPdf.getPageCount();

            for (let i = 0; i < total; i++) {
                const pageNum = i + 1;
                setExportProgress(
                    t(`Processing page ${pageNum} of ${total}...`, `正在处理第 ${pageNum}/${total} 页...`)
                );

                const pageBoxes = redactionBoxes.filter((b) => b.page === pageNum);
                const pageSigs = placedSignatures.filter((s) => s.page === pageNum);

                if (pageBoxes.length > 0 && thoroughMode) {
                    // Thorough Mode: Rasterize page at 2x scale via pdf.js
                    const page = await pdfjsDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 2.0 });

                    const offscreenCanvas = document.createElement("canvas");
                    offscreenCanvas.width = Math.floor(viewport.width);
                    offscreenCanvas.height = Math.floor(viewport.height);

                    const ctx = offscreenCanvas.getContext("2d");
                    if (!ctx) throw new Error("Could not create canvas context");

                    // White base for PDF
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

                    await page.render({
                        canvas: offscreenCanvas,
                        canvasContext: ctx,
                        viewport,
                    }).promise;

                    // Paint opaque black rectangles over redaction boxes
                    ctx.fillStyle = "#000000";
                    for (const box of pageBoxes) {
                        const bx = box.x * offscreenCanvas.width;
                        const by = box.y * offscreenCanvas.height;
                        const bw = box.w * offscreenCanvas.width;
                        const bh = box.h * offscreenCanvas.height;
                        ctx.fillRect(bx, by, bw, bh);
                    }

                    // Embed rasterized JPEG into new PDF
                    const jpegDataUrl = offscreenCanvas.toDataURL("image/jpeg", 0.92);
                    const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
                    const embeddedJpg = await outPdf.embedJpg(jpegBytes);

                    const origSize = origPdf.getPage(i).getSize();
                    const newPage = outPdf.addPage([origSize.width, origSize.height]);

                    newPage.drawImage(embeddedJpg, {
                        x: 0,
                        y: 0,
                        width: origSize.width,
                        height: origSize.height,
                    });

                    // Draw signatures onto this page
                    for (const sig of pageSigs) {
                        const sigBytes = await fetch(sig.dataUrl).then((r) => r.arrayBuffer());
                        const embeddedSig = await outPdf.embedPng(sigBytes);
                        const pW = origSize.width;
                        const pH = origSize.height;
                        const sigW = sig.w * pW;
                        const sigH = sig.h * pH;
                        const sigX = sig.x * pW;
                        const sigY = pH - sig.y * pH - sigH;

                        newPage.drawImage(embeddedSig, {
                            x: sigX,
                            y: sigY,
                            width: sigW,
                            height: sigH,
                        });
                    }
                } else {
                    // Copy untouched page or visual cover mode
                    const [copiedPage] = await outPdf.copyPages(origPdf, [i]);
                    outPdf.addPage(copiedPage);

                    const pW = copiedPage.getWidth();
                    const pH = copiedPage.getHeight();

                    // If visual cover mode: draw black rectangles on top
                    if (pageBoxes.length > 0 && !thoroughMode) {
                        for (const box of pageBoxes) {
                            const bw = box.w * pW;
                            const bh = box.h * pH;
                            const bx = box.x * pW;
                            const by = pH - box.y * pH - bh;

                            copiedPage.drawRectangle({
                                x: bx,
                                y: by,
                                width: bw,
                                height: bh,
                                color: rgb(0, 0, 0),
                            });
                        }
                    }

                    // Draw signatures onto this page
                    for (const sig of pageSigs) {
                        const sigBytes = await fetch(sig.dataUrl).then((r) => r.arrayBuffer());
                        const embeddedSig = await outPdf.embedPng(sigBytes);
                        const sigW = sig.w * pW;
                        const sigH = sig.h * pH;
                        const sigX = sig.x * pW;
                        const sigY = pH - sig.y * pH - sigH;

                        copiedPage.drawImage(embeddedSig, {
                            x: sigX,
                            y: sigY,
                            width: sigW,
                            height: sigH,
                        });
                    }
                }
            }

            setExportProgress(t("Saving and downloading...", "正在打包下载..."));
            const finalBytes = await outPdf.save();
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            downloadBlob(finalBytes, `${baseName}-redacted-signed.pdf`, "application/pdf");
        } catch (err) {
            console.error("Export error:", err);
            setError(
                t(
                    "Export failed. Please try again with thorough mode or check for corrupted pages.",
                    "导出失败，请重试或检查文件是否有异常页面。"
                )
            );
        } finally {
            setIsExporting(false);
            setExportProgress("");
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Step Indicator Header */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-3 sm:p-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm font-medium">
                    {[
                        { num: 1, label: t("1. Upload", "1. 上传") },
                        { num: 2, label: t("2. Redact", "2. 脱敏涂黑") },
                        { num: 3, label: t("3. Sign", "3. 签名") },
                        { num: 4, label: t("4. Export", "4. 导出") },
                    ].map((s) => {
                        const isCurrent = step === s.num;
                        const isPassed = file ? step > s.num : false;
                        const isAccessible = file !== null || s.num === 1;

                        return (
                            <button
                                key={s.num}
                                disabled={!isAccessible}
                                onClick={() => {
                                    if (isAccessible) {
                                        setStep(s.num as Step);
                                        if (s.num === 2) setToolMode("redact");
                                        if (s.num === 3) setToolMode("sign");
                                    }
                                }}
                                className={cn(
                                    "py-2 sm:py-2.5 px-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[42px]",
                                    isCurrent
                                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold"
                                        : isPassed
                                          ? "text-zinc-300 hover:bg-zinc-800/60"
                                          : isAccessible
                                            ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                                            : "text-zinc-600 cursor-not-allowed"
                                )}
                            >
                                {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                <span>{s.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 flex gap-3 items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}

            {/* STEP 1: Upload View */}
            {!file && (
                <div className="relative w-full border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                            const selected = e.target.files?.[0];
                            if (selected) handlePdfUpload(selected);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-4 rounded-2xl bg-zinc-800/60 group-hover:bg-zinc-800 transition-colors mb-4 text-emerald-400">
                        {isLoadingPdf ? (
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                        ) : (
                            <Upload className="w-8 h-8" />
                        )}
                    </div>
                    <p className="text-white font-semibold text-base sm:text-lg text-center">
                        {isLoadingPdf
                            ? t("Loading PDF...", "正在解析 PDF...")
                            : t("Drag & drop your PDF here or click to browse", "拖拽 PDF 到这里，或点击选择文件")}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-2 text-center">
                        {t(
                            "PDF documents up to 100MB · 100% processed locally on your device",
                            "支持最大 100MB 的 PDF 文件 · 纯本地浏览器处理"
                        )}
                    </p>
                    <div className="mt-6">
                        <LocalTrustNote />
                    </div>
                </div>
            )}

            {/* Main Interactive Workspace (Steps 2, 3, 4) */}
            {file && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left / Top Controls Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        {/* File summary card */}
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <p className="text-sm font-medium text-white truncate max-w-[180px]">
                                        {file.name}
                                    </p>
                                </div>
                                <label className="text-xs text-zinc-400 hover:text-emerald-400 cursor-pointer px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-800 transition-colors">
                                    {t("Replace", "更换")}
                                    <input
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handlePdfUpload(f);
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-800/60">
                                <span>{t(`Total ${numPages} pages`, `共 ${numPages} 页`)}</span>
                                <span>
                                    {redactionBoxes.length} {t("redactions", "处涂黑")} · {placedSignatures.length}{" "}
                                    {t("signatures", "处签名")}
                                </span>
                            </div>
                        </div>

                        {/* Mode Switcher */}
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-1.5 flex gap-1">
                            <button
                                onClick={() => {
                                    setToolMode("redact");
                                    setStep(2);
                                }}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
                                    toolMode === "redact"
                                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                                        : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <PenTool className="w-3.5 h-3.5 text-red-400" />
                                {t("Redact Mode", "涂黑模式")}
                            </button>
                            <button
                                onClick={() => {
                                    setToolMode("sign");
                                    setStep(3);
                                }}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
                                    toolMode === "sign"
                                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                                        : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                                {t("Sign Mode", "签名模式")}
                            </button>
                        </div>

                        {/* REDACTION CONTROLS */}
                        {toolMode === "redact" && (
                            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 flex flex-col gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                        <PenTool className="w-4 h-4 text-red-400" />
                                        {t("Black Out Sensitive Content", "涂黑脱敏工具")}
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {t(
                                            "Click and drag directly on the preview to draw blackout rectangles over confidential text or images.",
                                            "在右侧预览页面上按住鼠标拖动，即可框选涂黑区域。"
                                        )}
                                    </p>
                                </div>

                                {/* Thorough mode toggle */}
                                <div className="rounded-xl border border-zinc-800 bg-black/30 p-3 flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="thorough-toggle"
                                        checked={thoroughMode}
                                        onChange={(e) => setThoroughMode(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded accent-emerald-500 bg-zinc-800 border-zinc-700 cursor-pointer"
                                    />
                                    <label htmlFor="thorough-toggle" className="text-xs space-y-1 cursor-pointer">
                                        <p className="font-medium text-white flex items-center gap-1.5">
                                            <span>{t("Thorough Mode (Permanent)", "彻底脱敏（推荐）")}</span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                                                {t("Secure", "真删除")}
                                            </span>
                                        </p>
                                        <p className="text-zinc-400 leading-normal">
                                            {thoroughMode
                                                ? t(
                                                      "Rasterizes redacted pages to flat images. Underlying text streams are 100% destroyed.",
                                                      "将脱敏页光栅化为图片，彻底销毁底层文本，无法被反选或复制。"
                                                  )
                                                : t(
                                                      "Warning: Visual cover only. Underlying text remains selectable/searchable in PDF viewers.",
                                                      "警告：仅画黑色图层遮盖，底层文字依然可能被搜索或选中复制。"
                                                  )}
                                        </p>
                                    </label>
                                </div>

                                {/* Box counts & actions */}
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <span className="text-zinc-400">
                                        {t("On this page:", "本页涂黑：")}{" "}
                                        <strong className="text-white">{currentPageBoxes.length}</strong>
                                    </span>
                                    <div className="flex gap-2">
                                        {currentPageBoxes.length > 0 && (
                                            <button
                                                onClick={clearCurrentPageBoxes}
                                                className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                                            >
                                                {t("Clear Page", "清空本页")}
                                            </button>
                                        )}
                                        {redactionBoxes.length > 0 && (
                                            <button
                                                onClick={clearAllBoxes}
                                                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                                            >
                                                {t("Clear All", "全部清空")}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Redaction Boxes List */}
                                {currentPageBoxes.length > 0 && (
                                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                        {currentPageBoxes.map((box, index) => (
                                            <div
                                                key={box.id}
                                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-300"
                                            >
                                                <span>
                                                    {t("Blackout Box", "涂黑区块")} #{index + 1}
                                                </span>
                                                <button
                                                    onClick={() => deleteBox(box.id)}
                                                    className="p-1 hover:text-red-400 text-zinc-500 transition-colors"
                                                    title={t("Delete box", "删除区块")}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SIGNATURE CONTROLS */}
                        {toolMode === "sign" && (
                            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 flex flex-col gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                        <PenTool className="w-4 h-4 text-emerald-400" />
                                        {t("Create & Place Signature", "创建并放置签名")}
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {t(
                                            "Draw or upload your signature, then click anywhere on the page to stamp it.",
                                            "手写或上传签名后，点击预览页面任意位置即可盖章。"
                                        )}
                                    </p>
                                </div>

                                {/* Method tabs: Draw / Upload */}
                                <div className="flex rounded-xl bg-black/40 p-1 border border-zinc-800 text-xs">
                                    <button
                                        onClick={() => setSigMethod("draw")}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-lg font-medium transition-colors",
                                            sigMethod === "draw"
                                                ? "bg-zinc-800 text-white"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        )}
                                    >
                                        {t("Draw Signature", "手写签名")}
                                    </button>
                                    <button
                                        onClick={() => setSigMethod("upload")}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-lg font-medium transition-colors",
                                            sigMethod === "upload"
                                                ? "bg-zinc-800 text-white"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        )}
                                    >
                                        {t("Upload Image", "上传图片")}
                                    </button>
                                </div>

                                {/* Hand Draw Pad */}
                                {sigMethod === "draw" && (
                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-zinc-800 bg-white overflow-hidden">
                                            <canvas
                                                ref={sigPadRef}
                                                width={360}
                                                height={140}
                                                onPointerDown={startPadDrawing}
                                                onPointerMove={drawOnPad}
                                                onPointerUp={endPadDrawing}
                                                onPointerCancel={endPadDrawing}
                                                className="w-full h-32 touch-none cursor-crosshair bg-white"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <button
                                                onClick={clearPad}
                                                disabled={!hasDrawnOnPad}
                                                className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
                                            >
                                                {t("Clear Pad", "清空手写板")}
                                            </button>
                                            <button
                                                onClick={savePadSignature}
                                                disabled={!hasDrawnOnPad}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:opacity-40 transition-colors"
                                            >
                                                {t("Use This Signature", "使用此签名")}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Image Upload */}
                                {sigMethod === "upload" && (
                                    <div className="space-y-3">
                                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
                                            <Upload className="w-5 h-5 text-zinc-400 mb-2" />
                                            <span className="text-xs text-zinc-300 font-medium">
                                                {t("Upload PNG, JPG or WebP", "上传 PNG / JPG / WebP")}
                                            </span>
                                            <span className="text-[11px] text-zinc-500 mt-1">
                                                {t("Transparent PNG recommended", "推荐透明背景 PNG")}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={handleSignatureImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* Active signature badge & instructions */}
                                {activeSigDataUrl ? (
                                    <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                                {t("Active Signature Ready", "当前就绪签名")}
                                            </span>
                                        </div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <div className="h-12 bg-white/90 rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={activeSigDataUrl}
                                                alt="Active Signature"
                                                className="max-h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-[11px] text-zinc-400">
                                            👉{" "}
                                            {t(
                                                "Click anywhere on the preview page to place it.",
                                                "点击右侧预览页面任意位置盖章。"
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-400/80">
                                        {t(
                                            "Draw or upload a signature above to enable page stamping.",
                                            "请先在上方手写或上传签名，然后点击页面放置。"
                                        )}
                                    </p>
                                )}

                                {/* Selected placed signature controls (Resize / Delete) */}
                                {selectedSig && (
                                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 space-y-3 pt-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-white flex items-center gap-1">
                                                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                                                {t("Selected Signature Size", "已选中签名尺寸")}
                                            </span>
                                            <button
                                                onClick={() => deleteSignature(selectedSig.id)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                                title={t("Delete signature", "删除签名")}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateSelectedSigWidth(selectedSig.w - 0.04)}
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <input
                                                type="range"
                                                min={0.1}
                                                max={0.55}
                                                step={0.01}
                                                value={selectedSig.w}
                                                onChange={(e) => updateSelectedSigWidth(parseFloat(e.target.value))}
                                                className="flex-1 accent-emerald-500 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => updateSelectedSigWidth(selectedSig.w + 0.04)}
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* EXPORT ACTION CARD */}
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                <Download className="w-4 h-4 text-emerald-400" />
                                {t("Export & Download", "导出与下载")}
                            </h3>
                            <p className="text-xs text-zinc-400">
                                {t(
                                    "Builds the final sanitized and signed PDF document entirely inside your browser.",
                                    "在浏览器本地完成脱敏处理与盖章合并，生成最终 PDF。"
                                )}
                            </p>
                            <button
                                onClick={exportDocument}
                                disabled={isExporting}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/10 min-h-[44px]"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{exportProgress || t("Exporting...", "正在导出...")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>{t("Download Sanitized & Signed PDF", "下载已脱敏与签名 PDF")}</span>
                                    </>
                                )}
                            </button>
                            <div className="pt-2 border-t border-zinc-800/60">
                                <LocalTrustNote />
                            </div>
                        </div>
                    </div>

                    {/* Right / Main Preview Canvas Area */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {/* Page Navigation Toolbar */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1 || isRenderingPage}
                                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
                                    title={t("Previous Page", "上一页")}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs sm:text-sm font-medium text-zinc-300 px-2">
                                    {t("Page", "第")} <strong className="text-white">{currentPage}</strong> / {numPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                                    disabled={currentPage >= numPages || isRenderingPage}
                                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
                                    title={t("Next Page", "下一页")}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                {isRenderingPage && (
                                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                        {t("Rendering...", "渲染中...")}
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        "text-xs px-2.5 py-1 rounded-full font-medium border",
                                        toolMode === "redact"
                                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                    )}
                                >
                                    {toolMode === "redact"
                                        ? t("✏️ Drag to Black Out", "✏️ 框选涂黑")
                                        : t("✍️ Click / Drag Signatures", "✍️ 放置 / 拖动签名")}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Page Viewport Container */}
                        <div className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-2 sm:p-4 flex justify-center items-center overflow-hidden min-h-[500px]">
                            {/* Canvas Wrapper */}
                            <div className="relative max-w-full select-none shadow-2xl rounded-lg overflow-hidden bg-white">
                                <canvas
                                    ref={previewCanvasRef}
                                    className="w-full h-auto block max-h-[78vh] object-contain"
                                />

                                {/* Interactive Overlay */}
                                <div
                                    ref={overlayRef}
                                    onPointerDown={handleOverlayPointerDown}
                                    onPointerMove={handleOverlayPointerMove}
                                    onPointerUp={handleOverlayPointerUp}
                                    onPointerCancel={handleOverlayPointerUp}
                                    className={cn(
                                        "absolute inset-0 z-10 touch-none",
                                        toolMode === "redact" ? "cursor-crosshair" : "cursor-default"
                                    )}
                                >
                                    {/* Placed Redaction Boxes on Current Page */}
                                    {currentPageBoxes.map((box) => (
                                        <div
                                            key={box.id}
                                            style={{
                                                left: `${box.x * 100}%`,
                                                top: `${box.y * 100}%`,
                                                width: `${box.w * 100}%`,
                                                height: `${box.h * 100}%`,
                                            }}
                                            className="absolute bg-black border border-red-500/60 group pointer-events-auto"
                                        >
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteBox(box.id);
                                                }}
                                                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                title={t("Delete redaction", "删除涂黑")}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}

                                    {/* Active Drawing Box Preview */}
                                    {isDrawingBox && tempBox && (
                                        <div
                                            style={{
                                                left: `${tempBox.x * 100}%`,
                                                top: `${tempBox.y * 100}%`,
                                                width: `${tempBox.w * 100}%`,
                                                height: `${tempBox.h * 100}%`,
                                            }}
                                            className="absolute bg-black/80 border-2 border-dashed border-red-500 pointer-events-none"
                                        />
                                    )}

                                    {/* Placed Signatures on Current Page */}
                                    {currentPageSignatures.map((sig) => {
                                        const isSelected = selectedSigId === sig.id;
                                        return (
                                            <div
                                                key={sig.id}
                                                onPointerDown={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedSigId(sig.id);
                                                    setDragSigState({
                                                        sigId: sig.id,
                                                        startX: getRelativeCoords(e).x,
                                                        startY: getRelativeCoords(e).y,
                                                        origX: sig.x,
                                                        origY: sig.y,
                                                    });
                                                    overlayRef.current?.setPointerCapture(e.pointerId);
                                                }}
                                                style={{
                                                    left: `${sig.x * 100}%`,
                                                    top: `${sig.y * 100}%`,
                                                    width: `${sig.w * 100}%`,
                                                    height: `${sig.h * 100}%`,
                                                }}
                                                className={cn(
                                                    "absolute pointer-events-auto cursor-move group select-none transition-shadow",
                                                    isSelected
                                                        ? "ring-2 ring-emerald-500 bg-emerald-500/10 shadow-lg"
                                                        : "hover:ring-1 hover:ring-zinc-400"
                                                )}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={sig.dataUrl}
                                                    alt="Signature stamp"
                                                    draggable={false}
                                                    className="w-full h-full object-contain pointer-events-none"
                                                />
                                                {/* Delete button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteSignature(sig.id);
                                                    }}
                                                    className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-red-400 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
