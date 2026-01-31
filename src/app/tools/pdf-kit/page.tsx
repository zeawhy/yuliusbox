"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowLeft, Layers, Settings2, Loader2, Minimize2, Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { DraggableFileList } from "@/components/ui/DraggableFileList";

interface PDFFile {
    id: string;
    file: File;
}

export default function PDFToolkitPage() {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<"merge" | "compress">("merge");

    // Merge State
    const [mergeFiles, setMergeFiles] = useState<PDFFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    // Compress State
    const [compressFile, setCompressFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    // Translations
    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy-First • Local Processing", cn: "隐私优先 • 本地处理" },
        title: { en: "PDF Toolkit", cn: "PDF 工具箱" },
        desc: { en: "Securely merge, split, and optimize PDF files in your browser.", cn: "在浏览器中安全地合并、拆分和优化 PDF 文件。" },
        tabs: {
            merge: { en: "Merge PDF", cn: "合并 PDF" },
            compress: { en: "Compress PDF", cn: "压缩 PDF" }
        },
        merge: {
            drop: { en: "Drop PDFs here", cn: "拖放 PDF 到此处" },
            drag: { en: "Drag & drop or click to upload multiple PDFs", cn: "点击或拖拽上传多个 PDF" },
            action: { en: "Merge Files", cn: "合并文件" },
            empty: { en: "Upload at least 2 files to merge", cn: "请上传至少 2 个文件以进行合并" },
            processing: { en: "Merging...", cn: "正在合并..." }
        },
        compress: {
            drop: { en: "Drop PDF here", cn: "拖放 PDF 到此处" },
            drag: { en: "Drag & drop or click to upload a PDF", cn: "点击或拖拽上传 PDF" },
            action: { en: "Compress (Metadata Cleanup)", cn: "压缩 (清理元数据)" }, // Explicit about what it does
            processing: { en: "Compressing...", cn: "正在压缩..." },
            note: { en: "Note: This performs metadata cleanup. For image compression inside PDFs, check our Image Compressor tool.", cn: "注意：此功能执行元数据清理。如需压缩 PDF 内的图片，请查看我们的图片压缩工具。" }
        },
        common: {
            limit: { en: "PDF files up to 100MB", cn: "支持 PDF (最大 100MB)" },
            download: { en: "Download", cn: "下载" },
            remove: { en: "Remove", cn: "移除" },
            dragHandle: { en: "Drag to reorder", cn: "拖拽排序" }
        }
    };

    // Handlers
    const handleMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(7),
                file
            }));
            setMergeFiles(prev => [...prev, ...newFiles]);
        }
    };

    const mergePDFs = async () => {
        if (mergeFiles.length < 2) return;
        setIsMerging(true);
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
        } catch (error) {
            console.error("Merge failed", error);
            alert("Merge failed. Please check if files are valid PDFs.");
        } finally {
            setIsMerging(false);
        }
    };

    const handleCompressFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCompressFile(e.target.files[0]);
        }
    };

    const compressPDF = async () => {
        if (!compressFile) return;
        setIsCompressing(true);
        try {
            const fileBuffer = await compressFile.arrayBuffer();
            const pdf = await PDFDocument.load(fileBuffer);

            // Metadata cleanup
            pdf.setTitle("");
            pdf.setAuthor("");
            pdf.setSubject("");
            pdf.setKeywords([]);
            pdf.setProducer("YuliusBox PDF Tool");
            pdf.setCreator("YuliusBox");

            const pdfBytes = await pdf.save(); // Default save performs some cleanup
            downloadBlob(pdfBytes, `compressed_${compressFile.name}`, "application/pdf");
        } catch (error) {
            console.error("Compression failed", error);
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadBlob = (data: Uint8Array, filename: string, type: string) => {
        const blob = new Blob([data as unknown as BlobPart], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
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

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setActiveTab("merge")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                activeTab === "merge" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <Layers className="w-4 h-4" /> {language === "en" ? t.tabs.merge.en : t.tabs.merge.cn}
                        </button>
                        <button
                            onClick={() => setActiveTab("compress")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                activeTab === "compress" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <Minimize2 className="w-4 h-4" /> {language === "en" ? t.tabs.compress.en : t.tabs.compress.cn}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === "merge" && (
                        <div className="flex flex-col gap-6">
                            <div className="relative w-full h-48 border-2 border-dashed border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={handleMergeFiles}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="p-4 rounded-full bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors mb-4 text-zinc-400 group-hover:text-zinc-200">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-zinc-300 font-medium">
                                    {language === "en" ? t.merge.drag.en : t.merge.drag.cn}
                                </p>
                                <p className="text-sm text-zinc-500 mt-2">{language === "en" ? t.common.limit.en : t.common.limit.cn}</p>
                            </div>

                            <DraggableFileList
                                files={mergeFiles}
                                onReorder={setMergeFiles}
                                onRemove={(id) => setMergeFiles(prev => prev.filter(f => f.id !== id))}
                                labels={{
                                    dragHandle: language === "en" ? t.common.dragHandle.en : t.common.dragHandle.cn,
                                    remove: language === "en" ? t.common.remove.en : t.common.remove.cn
                                }}
                            />

                            <button
                                onClick={mergePDFs}
                                disabled={mergeFiles.length < 2 || isMerging}
                                className="w-full py-3.5 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isMerging ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> {language === "en" ? t.merge.processing.en : t.merge.processing.cn}
                                    </>
                                ) : (
                                    <>
                                        <Layers className="w-5 h-5" /> {language === "en" ? t.merge.action.en : t.merge.action.cn}
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeTab === "compress" && (
                        <div className="flex flex-col gap-6">
                            <div className="relative w-full h-48 border-2 border-dashed border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleCompressFile}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="p-4 rounded-full bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors mb-4 text-zinc-400 group-hover:text-zinc-200">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-zinc-300 font-medium">
                                    {compressFile ? compressFile.name : (language === "en" ? t.compress.drag.en : t.compress.drag.cn)}
                                </p>
                                <p className="text-sm text-zinc-500 mt-2">{language === "en" ? t.common.limit.en : t.common.limit.cn}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                                {language === "en" ? t.compress.note.en : t.compress.note.cn}
                            </div>

                            <button
                                onClick={compressPDF}
                                disabled={!compressFile || isCompressing}
                                className="w-full py-3.5 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> {language === "en" ? t.compress.processing.en : t.compress.processing.cn}
                                    </>
                                ) : (
                                    <>
                                        <Settings2 className="w-5 h-5" /> {language === "en" ? t.compress.action.en : t.compress.action.cn}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
