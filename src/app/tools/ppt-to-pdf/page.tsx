"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { FileUploadZone } from "@/components/FileUploadZone";

export default function PptToPdfPage() {
    const { language } = useLanguage();

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "PowerPoint to PDF Converter", cn: "PPT 转 PDF 工具" },
        desc: { en: "Fast, precise, and secure conversion of PowerPoint presentations (.pptx, .ppt) to PDF format.", cn: "快速、精准、安全地将幻灯片 (.pptx, .ppt) 转换为 PDF 格式。" },
        secure: { en: "Secure Cloud Processing. Files are never stored.", cn: "云端安全处理。文件阅后即焚，绝不永久存储。" },
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

                {/* Mobile Secure Badge (visible only on small screens) */}
                <div className="sm:hidden flex items-center justify-center mb-4 text-green-500/80 text-xs gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === "en" ? t.secure.en : t.secure.cn}
                </div>

                <FileUploadZone
                    acceptedFileTypes=".pptx,.ppt,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    apiEndpoint="/api/tools/ppt-to-pdf"
                    maxSizeMB={50}
                    titleEn="PowerPoint Presentation"
                    titleCn="PPT 演示文稿"
                />
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-3xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "How it works" : "工作原理"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en"
                            ? "This tool is powered by a secure, containerized LibreOffice engine (Gotenberg). When you upload a PowerPoint presentation, it is securely transmitted to our isolated cloud worker. The worker performs a high-fidelity conversion preserving all slides, fonts, and layouts, returns the PDF, and immediately destroys the original file from memory."
                            : "本工具底层的转换引擎基于安全的容器化 LibreOffice (Gotenberg)。您上传 PPT 幻灯片后，会通过加密传输发送至我们独立的云节点。云节点将进行高保真转换（完美保留页面、排版和字体），并将 PDF 返回给您，随后立即从内存中销毁原始文件。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Data Privacy First" : "数据隐私至上"}
                    </h2>
                    <ul className="text-zinc-400 mb-6 list-disc pl-5">
                        <li>
                            <strong>{language === "en" ? "No Storage: " : "不存储文件："}</strong>
                            {language === "en" ? "We do not store your documents. All data is processed in ephemeral memory and discarded upon completion." : "我们绝对不会存储您的任何文档。所有处理均在内存中进行，完成后即刻销毁数据。"}
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
