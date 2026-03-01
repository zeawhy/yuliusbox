"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function WordToPdfPage() {
    const { language } = useLanguage();

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Word to PDF Converter", cn: "Word 转 PDF 工具" },
        desc: { en: "Fast, precise, and secure conversion of Word documents (.doc, .docx) to PDF format.", cn: "快速、精准、安全地将 Word 文档 (.doc, .docx) 转换为 PDF 格式。" },
        drop: { en: "Drop document here", cn: "释放以添文加档" },
        drag: { en: "Drag & drop or click to upload", cn: "点击或拖拽上传文档" },
        limit: { en: "Supported formats: .doc, .docx (Max 50MB)", cn: "支持格式: .doc, .docx (最大 50MB)" },
        secure: { en: "Secure Cloud Processing. Files are never stored.", cn: "云端安全处理。文件阅后即焚，绝不永久存储。" },
        converting: { en: "Converting to PDF...", cn: "正在转换为 PDF..." },
        success: { en: "Conversion Successful! Download starting...", cn: "转换成功！即将开始下载..." },
        btnConvert: { en: "Convert to PDF", cn: "转换为 PDF" },
        btnNew: { en: "Convert Another File", cn: "转换新文件" }
    };

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.name.match(/\.(doc|docx)$/i)) {
            setStatus("error");
            setErrorMessage(language === "en" ? "Only .doc and .docx files are supported." : "仅支持 .doc 和 .docx 格式。");
            return;
        }
        if (selectedFile.size > 50 * 1024 * 1024) {
            setStatus("error");
            setErrorMessage(language === "en" ? "File size exceeds 50MB limit." : "文件大小超过 50MB 限制。");
            return;
        }

        setFile(selectedFile);
        setStatus("idle");
        setErrorMessage("");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [language]); // eslint-disable-line

    const convertFile = async () => {
        if (!file) return;

        setStatus("converting");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/tools/word-to-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Programmatically download
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus("success");

        } catch (error: any) {
            console.error("Conversion failed:", error);
            setStatus("error");
            setErrorMessage(error.message || (language === "en" ? "Conversion failed. Please try again." : "转换失败，请重试。"));
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-4xl mx-auto">
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

                {/* Upload or Status Area */}
                {!file || status === "success" ? (
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                        {/* Mobile Secure Badge (visible only on small screens) */}
                        <div className="sm:hidden flex items-center text-green-500/80 text-xs gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {language === "en" ? t.secure.en : t.secure.cn}
                        </div>

                        {status === "success" && (
                            <div className="w-full p-6 text-center bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <p className="text-green-400 font-medium">
                                    {language === "en" ? t.success.en : t.success.cn}
                                </p>
                            </div>
                        )}

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            className={cn(
                                "relative w-full h-72 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group",
                                isDragging ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-zinc-900"
                            )}
                        >
                            <input
                                type="file"
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                    if (e.target.files?.length) handleFile(e.target.files[0]);
                                }}
                            />
                            <div className="flex flex-col items-center gap-4 text-zinc-400 pointer-events-none data-active:text-indigo-400 transition-colors">
                                <div className={cn("p-4 rounded-full bg-zinc-800 transition-colors group-hover:bg-indigo-500/20 group-hover:text-indigo-400", isDragging && "bg-indigo-500/20 text-indigo-400")}>
                                    <Upload className="w-8 h-8" />
                                </div>
                                <p className="text-lg font-medium">
                                    {isDragging ? (language === "en" ? t.drop.en : t.drop.cn) : (language === "en" ? t.drag.en : t.drag.cn)}
                                </p>
                                <p className="text-sm text-zinc-500">{language === "en" ? t.limit.en : t.limit.cn}</p>
                            </div>
                        </div>

                        {status === "success" && (
                            <button
                                onClick={() => { setFile(null); setStatus("idle"); }}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium"
                            >
                                {language === "en" ? t.btnNew.en : t.btnNew.cn}
                            </button>
                        )}
                    </div>
                ) : (
                    // Processing State (File Selected / Converting)
                    <div className="w-full max-w-xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-8">
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-zinc-200 font-medium truncate text-lg">{file.name}</h3>
                                <p className="text-zinc-500 text-sm mt-1">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>

                        {status === "error" && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">{errorMessage}</div>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            {status === "idle" || status === "error" ? (
                                <>
                                    <button
                                        onClick={convertFile}
                                        className="flex-1 py-3 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-xl transition-colors text-center"
                                    >
                                        {language === "en" ? t.btnConvert.en : t.btnConvert.cn}
                                    </button>
                                    <button
                                        onClick={() => { setFile(null); setStatus("idle"); }}
                                        className="p-3 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-xl transition-colors"
                                    >
                                        <Upload className="w-6 h-6" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex-1 py-3 bg-indigo-500/20 text-indigo-400 font-semibold rounded-xl flex items-center justify-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {language === "en" ? t.converting.en : t.converting.cn}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-3xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "How it works" : "工作原理"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en"
                            ? "This tool is powered by a secure, containerized LibreOffice engine (Gotenberg). When you upload a Word document, it is securely transmitted to our isolated cloud worker. The worker performs a high-fidelity conversion preserving all fonts, layouts, and tables, returns the PDF, and immediately destroys the original file from memory."
                            : "本工具底层的转换引擎基于安全的容器化 LibreOffice (Gotenberg)。您上传 Word 文档后，会通过加密传输发送至我们独立的云节点。云节点将进行高保真转换（完美保留字体、排版和表格），并将 PDF 返回给您，随后立即从内存中销毁原始文件。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Data Privacy First" : "数据隐私至上"}
                    </h2>
                    <ul className="text-zinc-400 mb-6 list-disc pl-5">
                        <li>
                            <strong>{language === "en" ? "No Storage: " : "不存储文件："}</strong>
                            {language === "en" ? "We do not store your documents. All data is processed in ephemeral memory and discarded upon completion." : "我们绝对不会存储您的任何文档。所有处理均在内存中进行，完成后即刻销毁数据。"}
                        </li>
                        <li>
                            <strong>{language === "en" ? "Format Retention: " : "完美保留格式："}</strong>
                            {language === "en" ? "State-of-the-art rendering engine guarantees identical pagination and styling as Microsoft Word." : "行业顶尖的渲染引擎，保证 PDF 的分页和排版与 Microsoft Word 中的效果如出一辙。"}
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
