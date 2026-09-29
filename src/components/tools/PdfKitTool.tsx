"use client";

import { useState, type ReactNode } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import {
    Layers,
    Minimize2,
    Scissors,
    FileOutput,
    ImagePlus,
    Loader2,
    Upload,
    ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DraggableFileList } from "@/components/ui/DraggableFileList";

export type PdfKitMode = "merge" | "compress" | "split" | "extract" | "jpg-to-pdf";

interface PdfKitToolProps {
    /** Which tab the tool opens on. Defaults to "merge". */
    defaultMode?: PdfKitMode;
}

interface PDFFile {
    id: string;
    file: File;
}

const MODES: { id: PdfKitMode; label: string; icon: ReactNode }[] = [
    { id: "merge", label: "Merge PDF", icon: <Layers className="w-4 h-4" /> },
    { id: "compress", label: "Compress PDF", icon: <Minimize2 className="w-4 h-4" /> },
    { id: "split", label: "Split PDF", icon: <Scissors className="w-4 h-4" /> },
    { id: "extract", label: "Extract Pages", icon: <FileOutput className="w-4 h-4" /> },
    { id: "jpg-to-pdf", label: "JPG to PDF", icon: <ImagePlus className="w-4 h-4" /> },
];

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

/** Parse "1-3, 5, 8-10" into sorted unique 1-based page numbers, clamped to [1, max]. */
function parsePageRanges(input: string, max: number): number[] {
    const pages = new Set<number>();
    for (const part of input.split(",")) {
        const t = part.trim();
        if (!t) continue;
        const range = t.match(/^(\d+)\s*-\s*(\d+)$/);
        if (range) {
            let a = parseInt(range[1], 10);
            let b = parseInt(range[2], 10);
            if (a > b) [a, b] = [b, a];
            for (let p = a; p <= b; p++) if (p >= 1 && p <= max) pages.add(p);
        } else {
            const p = parseInt(t, 10);
            if (!isNaN(p) && p >= 1 && p <= max) pages.add(p);
        }
    }
    return [...pages].sort((x, y) => x - y);
}

function UploadZone({
    onFiles,
    multiple,
    accept,
    label,
    fileName,
}: {
    onFiles: (files: File[]) => void;
    multiple?: boolean;
    accept: string;
    label: string;
    fileName?: string;
}) {
    return (
        <div className="relative w-full h-48 border-2 border-dashed border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={(e) => {
                    if (e.target.files) onFiles(Array.from(e.target.files));
                    e.target.value = "";
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="p-4 rounded-full bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors mb-4 text-zinc-400 group-hover:text-zinc-200">
                <Upload className="w-6 h-6" />
            </div>
            <p className="text-zinc-300 font-medium px-4 text-center">
                {fileName ?? label}
            </p>
            <p className="text-sm text-zinc-500 mt-2">PDF files up to 100MB</p>
        </div>
    );
}

function ActionButton({
    onClick,
    disabled,
    loading,
    loadingLabel,
    icon,
    label,
}: {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    loadingLabel: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="w-full py-3.5 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[44px]"
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {loadingLabel}
                </>
            ) : (
                <>
                    {icon} {label}
                </>
            )}
        </button>
    );
}

export function PdfKitTool({ defaultMode = "merge" }: PdfKitToolProps) {
    const [activeTab, setActiveTab] = useState<PdfKitMode>(defaultMode);

    // Merge state
    const [mergeFiles, setMergeFiles] = useState<PDFFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    // Compress state
    const [compressFile, setCompressFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    // Split state
    const [splitFile, setSplitFile] = useState<File | null>(null);
    const [isSplitting, setIsSplitting] = useState(false);

    // Extract state
    const [extractFile, setExtractFile] = useState<File | null>(null);
    const [extractRanges, setExtractRanges] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    // JPG to PDF state
    const [jpgFiles, setJpgFiles] = useState<PDFFile[]>([]);
    const [isConverting, setIsConverting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const mergePDFs = async () => {
        if (mergeFiles.length < 2) return;
        setIsMerging(true);
        setError(null);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const fileObj of mergeFiles) {
                const fileBuffer = await fileObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const pdfBytes = await mergedPdf.save();
            downloadBlob(pdfBytes, "merged_yuliusbox.pdf", "application/pdf");
        } catch {
            setError("Merge failed. Please check that all files are valid PDFs.");
        } finally {
            setIsMerging(false);
        }
    };

    const compressPDF = async () => {
        if (!compressFile) return;
        setIsCompressing(true);
        setError(null);
        try {
            const fileBuffer = await compressFile.arrayBuffer();
            const pdf = await PDFDocument.load(fileBuffer);
            // Metadata cleanup — honest scope: no image recompression.
            pdf.setTitle("");
            pdf.setAuthor("");
            pdf.setSubject("");
            pdf.setKeywords([]);
            pdf.setProducer("YuliusBox PDF Tool");
            pdf.setCreator("YuliusBox");
            const pdfBytes = await pdf.save();
            downloadBlob(pdfBytes, `compressed_${compressFile.name}`, "application/pdf");
        } catch {
            setError("Compression failed. Please check that the file is a valid PDF.");
        } finally {
            setIsCompressing(false);
        }
    };

    const splitPDF = async () => {
        if (!splitFile) return;
        setIsSplitting(true);
        setError(null);
        try {
            const fileBuffer = await splitFile.arrayBuffer();
            const src = await PDFDocument.load(fileBuffer);
            const pageCount = src.getPageCount();
            const zip = new JSZip();
            for (let i = 0; i < pageCount; i++) {
                const out = await PDFDocument.create();
                const [page] = await out.copyPages(src, [i]);
                out.addPage(page);
                const bytes = await out.save();
                zip.file(`page-${i + 1}.pdf`, bytes);
            }
            const blob = await zip.generateAsync({ type: "blob" });
            downloadBlob(blob, `split_${splitFile.name.replace(/\.pdf$/i, "")}.zip`, "application/zip");
        } catch {
            setError("Split failed. Please check that the file is a valid PDF.");
        } finally {
            setIsSplitting(false);
        }
    };

    const extractPages = async () => {
        if (!extractFile || !extractRanges.trim()) return;
        setIsExtracting(true);
        setError(null);
        try {
            const fileBuffer = await extractFile.arrayBuffer();
            const src = await PDFDocument.load(fileBuffer);
            const pages = parsePageRanges(extractRanges, src.getPageCount());
            if (pages.length === 0) {
                setError("No valid pages found. Use page numbers like 1-3, 5, 8-10.");
                setIsExtracting(false);
                return;
            }
            const out = await PDFDocument.create();
            // pdf-lib page indices are 0-based.
            const copied = await out.copyPages(src, pages.map((p) => p - 1));
            copied.forEach((page) => out.addPage(page));
            const pdfBytes = await out.save();
            downloadBlob(pdfBytes, `extracted_${extractFile.name}`, "application/pdf");
        } catch {
            setError("Extraction failed. Please check that the file is a valid PDF.");
        } finally {
            setIsExtracting(false);
        }
    };

    const jpgToPdf = async () => {
        if (jpgFiles.length === 0) return;
        setIsConverting(true);
        setError(null);
        try {
            const out = await PDFDocument.create();
            for (const fileObj of jpgFiles) {
                const buf = await fileObj.file.arrayBuffer();
                let img;
                try {
                    img = await out.embedJpg(buf);
                } catch {
                    throw new Error(`"${fileObj.file.name}" is not a valid JPG file.`);
                }
                // One full-size page per image.
                const page = out.addPage([img.width, img.height]);
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
            }
            const pdfBytes = await out.save();
            downloadBlob(pdfBytes, "images_yuliusbox.pdf", "application/pdf");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Conversion failed.");
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="flex flex-wrap justify-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 gap-1">
                    {MODES.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => {
                                setActiveTab(mode.id);
                                setError(null);
                            }}
                            className={cn(
                                "px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 min-h-[44px]",
                                activeTab === mode.id
                                    ? "bg-zinc-800 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {mode.icon} {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {activeTab === "merge" && (
                    <div className="flex flex-col gap-6">
                        <UploadZone
                            onFiles={(files) =>
                                setMergeFiles((prev) => [
                                    ...prev,
                                    ...files.map((file) => ({
                                        id: Math.random().toString(36).substring(7),
                                        file,
                                    })),
                                ])
                            }
                            multiple
                            accept=".pdf"
                            label="Drag & drop or click to upload multiple PDFs"
                        />
                        <DraggableFileList
                            files={mergeFiles}
                            onReorder={setMergeFiles}
                            onRemove={(id) => setMergeFiles((prev) => prev.filter((f) => f.id !== id))}
                            labels={{ dragHandle: "Drag to reorder", remove: "Remove" }}
                        />
                        <ActionButton
                            onClick={mergePDFs}
                            disabled={mergeFiles.length < 2}
                            loading={isMerging}
                            loadingLabel="Merging..."
                            icon={<Layers className="w-5 h-5" />}
                            label="Merge Files"
                        />
                    </div>
                )}

                {activeTab === "compress" && (
                    <div className="flex flex-col gap-6">
                        <UploadZone
                            onFiles={(files) => setCompressFile(files[0] ?? null)}
                            accept=".pdf"
                            label="Drag & drop or click to upload a PDF"
                            fileName={compressFile?.name}
                        />
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                            Note: this performs metadata cleanup. For image compression inside PDFs, check our Image Compressor tool.
                        </div>
                        <ActionButton
                            onClick={compressPDF}
                            disabled={!compressFile}
                            loading={isCompressing}
                            loadingLabel="Compressing..."
                            icon={<Minimize2 className="w-5 h-5" />}
                            label="Compress (Metadata Cleanup)"
                        />
                    </div>
                )}

                {activeTab === "split" && (
                    <div className="flex flex-col gap-6">
                        <UploadZone
                            onFiles={(files) => setSplitFile(files[0] ?? null)}
                            accept=".pdf"
                            label="Drag & drop or click to upload a PDF"
                            fileName={splitFile?.name}
                        />
                        <p className="text-sm text-zinc-500">
                            Every page becomes its own PDF, bundled into a single ZIP download.
                        </p>
                        <ActionButton
                            onClick={splitPDF}
                            disabled={!splitFile}
                            loading={isSplitting}
                            loadingLabel="Splitting..."
                            icon={<Scissors className="w-5 h-5" />}
                            label="Split into Pages"
                        />
                    </div>
                )}

                {activeTab === "extract" && (
                    <div className="flex flex-col gap-6">
                        <UploadZone
                            onFiles={(files) => setExtractFile(files[0] ?? null)}
                            accept=".pdf"
                            label="Drag & drop or click to upload a PDF"
                            fileName={extractFile?.name}
                        />
                        <div>
                            <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                Pages to extract
                            </label>
                            <input
                                type="text"
                                value={extractRanges}
                                onChange={(e) => setExtractRanges(e.target.value)}
                                placeholder="e.g. 1-3, 5, 8-10"
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                            />
                            <p className="text-sm text-zinc-500 mt-2">
                                The selected pages are combined into one new PDF, in the order you list them.
                            </p>
                        </div>
                        <ActionButton
                            onClick={extractPages}
                            disabled={!extractFile || !extractRanges.trim()}
                            loading={isExtracting}
                            loadingLabel="Extracting..."
                            icon={<FileOutput className="w-5 h-5" />}
                            label="Extract Pages"
                        />
                    </div>
                )}

                {activeTab === "jpg-to-pdf" && (
                    <div className="flex flex-col gap-6">
                        <UploadZone
                            onFiles={(files) =>
                                setJpgFiles((prev) => [
                                    ...prev,
                                    ...files.map((file) => ({
                                        id: Math.random().toString(36).substring(7),
                                        file,
                                    })),
                                ])
                            }
                            multiple
                            accept="image/jpeg"
                            label="Drag & drop or click to upload JPG images"
                        />
                        <DraggableFileList
                            files={jpgFiles}
                            onReorder={setJpgFiles}
                            onRemove={(id) => setJpgFiles((prev) => prev.filter((f) => f.id !== id))}
                            labels={{ dragHandle: "Drag to reorder", remove: "Remove" }}
                        />
                        <p className="text-sm text-zinc-500">
                            Each JPG becomes one full-size page in the PDF, in the order shown above.
                        </p>
                        <ActionButton
                            onClick={jpgToPdf}
                            disabled={jpgFiles.length === 0}
                            loading={isConverting}
                            loadingLabel="Converting..."
                            icon={<ImagePlus className="w-5 h-5" />}
                            label="Convert to PDF"
                        />
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    All processing happens locally in your browser — files are never uploaded.
                </div>
            </div>
        </div>
    );
}
