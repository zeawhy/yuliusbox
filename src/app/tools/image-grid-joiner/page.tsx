"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, ShieldCheck, Upload, Download, Grid3X3, Settings, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadedImage {
    id: string;
    file: File;
    previewUrl: string;
    width: number;
    height: number;
}

export default function ImageGridJoinerPage() {
    const { language } = useLanguage();

    // Core State
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [rows, setRows] = useState(2);
    const [columns, setColumns] = useState(2);
    const [isProcessing, setIsProcessing] = useState(false);

    // UI State
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Image Grid Joiner", cn: "图片拼图与网格拼接器" },
        desc: { en: "Combine multiple images into a seamless grid instantly. 100% private, processed locally on your device.", cn: "瞬间将多张图片拼接到无缝网格中。100% 隐私，所有处理均在您的本地设备完成。" },
        secure: { en: "100% Local Processing. Your images never leave your device.", cn: "100% 本地处理。您的图片永远不会离开您的设备。" },
        uploadBtn: { en: "Add Images (Drag & Drop)", cn: "添加图片 (拖拽上传)" },
        clearAll: { en: "Clear All", cn: "清空全部" },
        settings: { en: "Grid Layout", cn: "网格布局" },
        rows: { en: "Rows", cn: "行数" },
        columns: { en: "Columns", cn: "列数" },
        stitchBtn: { en: "Stitch Images & Download", cn: "拼接并下载" },
        processing: { en: "Processing...", cn: "处理中..." },
        errorMismatch: {
            en: (needed: number, actual: number) => `Grid needs ${needed} images (${rows}x${columns}), but you have ${actual}.`,
            cn: (needed: number, actual: number) => `当前网格需要 ${needed} 张图片 (${rows}x${columns})，您已上传 ${actual} 张。`
        }
    };

    // Load image dimensions helper
    const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFiles = async (files: FileList | File[]) => {
        setErrorMsg("");
        const newImagesConfigs: UploadedImage[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith("image/")) continue;

            const dimensions = await getImageDimensions(file);
            newImagesConfigs.push({
                id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                previewUrl: URL.createObjectURL(file),
                width: dimensions.width,
                height: dimensions.height
            });
        }

        setImages(prev => [...prev, ...newImagesConfigs]);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files?.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]); // eslint-disable-line

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setImages(items);
    };

    const removeImage = (idToRemove: string) => {
        setImages(images.filter(img => img.id !== idToRemove));
    };

    const clearAll = () => {
        images.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setImages([]);
        setErrorMsg("");
    };

    // Auto-adjust layout recommendations based on count
    useEffect(() => {
        if (images.length === 0) return;

        // Very basic auto-layout logic for UX
        const count = images.length;
        if (count === 1) { setRows(1); setColumns(1); }
        else if (count === 2) { setRows(1); setColumns(2); }
        else if (count === 3) { setRows(1); setColumns(3); }
        else if (count === 4) { setRows(2); setColumns(2); }
        else if (count > 4 && count <= 6) { setRows(2); setColumns(3); }
        else if (count > 6 && count <= 9) { setRows(3); setColumns(3); }
    }, [images.length]);

    const stitchImages = async () => {
        setErrorMsg("");
        const totalNeeded = rows * columns;

        if (images.length !== totalNeeded) {
            setErrorMsg(language === "en" ? t.errorMismatch.en(totalNeeded, images.length) : t.errorMismatch.cn(totalNeeded, images.length));
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load all native Image objects
            const loadedNativeImages = await Promise.all(
                images.map((imgConfig) => {
                    return new Promise<HTMLImageElement>((resolve, reject) => {
                        const img = new window.Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = imgConfig.previewUrl;
                    });
                })
            );

            // 2. Determine optimal cell size
            // For simplicity and high resolution, we will use the maximum width and height found
            let maxWidth = 0;
            let maxHeight = 0;
            loadedNativeImages.forEach(img => {
                if (img.width > maxWidth) maxWidth = img.width;
                if (img.height > maxHeight) maxHeight = img.height;
            });

            // 3. Setup Canvas
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas not available");
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) throw new Error("Could not get 2D context");

            canvas.width = maxWidth * columns;
            canvas.height = maxHeight * rows;

            // Fill background with white (or transparent if preferred, but white is safer for JPEGs)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 4. Draw sequence
            let currentImageIndex = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    if (currentImageIndex >= loadedNativeImages.length) break;

                    const img = loadedNativeImages[currentImageIndex];
                    const destX = c * maxWidth;
                    const destY = r * maxHeight;

                    // Draw image centered and scaled to cover the cell (Object-Fit: Contain equivalent logic for simplicity here)
                    // We will just draw it in the center without cropping to preserve full image

                    // Ratio adjustment
                    const hRatio = maxWidth / img.width;
                    const vRatio = maxHeight / img.height;
                    const ratio = Math.min(hRatio, vRatio);

                    const centerShiftX = (maxWidth - img.width * ratio) / 2;
                    const centerShiftY = (maxHeight - img.height * ratio) / 2;

                    ctx.drawImage(img, 0, 0, img.width, img.height,
                        destX + centerShiftX, destY + centerShiftY, img.width * ratio, img.height * ratio);

                    currentImageIndex++;
                }
            }

            // 5. Export and Download
            canvas.toBlob((blob) => {
                if (!blob) throw new Error("Blob creation failed");
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stitched-grid-${columns}x${rows}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setIsProcessing(false);
            }, "image/jpeg", 0.95);

        } catch (error) {
            console.error("Stitching error:", error);
            setErrorMsg(language === "en" ? "Failed to stitch images." : "图片拼接失败。");
            setIsProcessing(false);
        }
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
                                        min="1" max="10"
                                        value={columns}
                                        onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1.5 block">{language === "en" ? t.rows.en : t.rows.cn}</label>
                                    <input
                                        type="number"
                                        min="1" max="10"
                                        value={rows}
                                        onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-zinc-800/50 flex flex-col gap-3">
                                <div className="text-sm text-center text-zinc-500 font-mono">
                                    {language === "en" ? `Target: ${columns * rows} images` : `目标: ${columns * rows} 张图片`}
                                </div>
                                <div className={cn("text-xs text-center font-mono", images.length === (columns * rows) ? "text-green-500" : "text-amber-500")}>
                                    {language === "en" ? `Current: ${images.length} uploaded` : `已传: ${images.length} 张图片`}
                                </div>

                                <button
                                    onClick={stitchImages}
                                    disabled={isProcessing || images.length === 0}
                                    className="w-full mt-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Download className="w-4 h-4 animate-bounce" /> : <Grid3X3 className="w-4 h-4" />}
                                    {isProcessing ? (language === "en" ? t.processing.en : t.processing.cn) : (language === "en" ? t.stitchBtn.en : t.stitchBtn.cn)}
                                </button>

                                {errorMsg && (
                                    <div className="mt-2 text-xs text-red-400 p-2 bg-red-400/10 rounded-lg text-center border border-red-400/20">
                                        {errorMsg}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden Canvas required for rendering */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[500px]">

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
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files) handleFiles(e.target.files);
                                        // Reset input so same file can be triggered again if removed
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                />

                                {images.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors"
                                    >
                                        {language === "en" ? t.clearAll.en : t.clearAll.cn}
                                    </button>
                                )}
                            </div>

                            {/* DND Area */}
                            {images.length === 0 ? (
                                <div
                                    className={cn(
                                        "w-full h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all bg-zinc-950/50 text-zinc-500",
                                        isDraggingOver ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                                    )}
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                                    onDragLeave={() => setIsDraggingOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="w-10 h-10 mb-4 opacity-50" />
                                    <p>{language === "en" ? "Drag and drop your images here" : "将您的图片拖拽至此放入"}</p>
                                </div>
                            ) : (
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="grid" direction="horizontal">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                // Dynamic visual grid matching user settings
                                                className="grid gap-2 outline outline-1 outline-dashed outline-zinc-800 p-2 rounded-xl bg-zinc-950/50"
                                                style={{
                                                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
                                                }}
                                            >
                                                {images.map((img, index) => (
                                                    <Draggable key={img.id} draggableId={img.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={cn(
                                                                    "relative aspect-square rounded-lg overflow-hidden border bg-zinc-900 group",
                                                                    snapshot.isDragging ? "border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105 z-50" : "border-zinc-800 hover:border-zinc-600"
                                                                )}
                                                            >
                                                                <Image
                                                                    src={img.previewUrl}
                                                                    alt={`Grid piece ${index + 1}`}
                                                                    fill
                                                                    className="object-contain" // object-contain ensures we see whole image in preview
                                                                />

                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="p-2 bg-zinc-800/80 hover:bg-indigo-500 text-white rounded-md cursor-grab active:cursor-grabbing transition-colors"
                                                                    >
                                                                        <GripVertical className="w-4 h-4" />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeImage(img.id)}
                                                                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="absolute top-2 left-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-xs font-mono text-white pointer-events-none">
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
