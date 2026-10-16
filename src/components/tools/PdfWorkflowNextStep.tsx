"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PdfWorkflowNextStepProps {
    current: "jpg-to-pdf" | "merge";
}

export function PdfWorkflowNextStep({ current }: PdfWorkflowNextStepProps) {
    const { language } = useLanguage();

    const t = {
        "jpg-to-pdf": {
            badge: { en: "Application Workflow • Next Step", cn: "材料整理流程 • 下一步指引" },
            title: { en: "Need to combine multiple documents into one dossier?", cn: "需要将多份证明材料合并为一份 PDF？" },
            desc: {
                en: "Converted your images to PDF? The next step is usually merging them with your application form, resume, or transcripts.",
                cn: "证件照片已转成 PDF？多数考务与申报系统要求将证明材料与报名表、个人履历合并为一份统一的 PDF 提交。"
            },
            nextBtn: { en: "Next Step: Merge PDF Online →", cn: "下一步：合并 PDF 文件 →" },
            nextHref: "/tools/pdf-kit/merge-pdf-online",
            prevBtn: { en: "← Compress Photos to <100KB First", cn: "← 先压缩单张照片至 100KB 内" },
            prevHref: "/tools/image-compressor/compress-image-to-100kb",
        },
        merge: {
            badge: { en: "Application Workflow • Next Step", cn: "材料整理流程 • 下一步指引" },
            title: { en: "Merged PDF too large for email or upload?", cn: "合并后的 PDF 体积过大无法上传？" },
            desc: {
                en: "After merging multiple document pages, file size might exceed strict email or web portal limits (e.g. 10MB or 20MB).",
                cn: "合并多页证件与材料后，整份 PDF 文件体积可能超出邮箱附件或政务系统的上传上限（如 10MB/20MB）。"
            },
            nextBtn: { en: "Next Step: Compress PDF Online →", cn: "下一步：在线压缩 PDF →" },
            nextHref: "/tools/pdf-kit/compress-pdf-online",
            prevBtn: { en: "← Convert More Photos to PDF", cn: "← 继续转换其他图片为 PDF" },
            prevHref: "/tools/pdf-kit/jpg-to-pdf-converter",
        }
    };

    const c = t[current];

    return (
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {language === "en" ? c.badge.en : c.badge.cn}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                        {language === "en" ? c.title.en : c.title.cn}
                    </h3>
                </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
                {language === "en" ? c.desc.en : c.desc.cn}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                    href={c.nextHref}
                    className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors flex items-center gap-2"
                >
                    <span>{language === "en" ? c.nextBtn.en : c.nextBtn.cn}</span>
                </Link>
                <Link
                    href={c.prevHref}
                    className="py-2.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                    <span>{language === "en" ? c.prevBtn.en : c.prevBtn.cn}</span>
                </Link>
            </div>
        </div>
    );
}
