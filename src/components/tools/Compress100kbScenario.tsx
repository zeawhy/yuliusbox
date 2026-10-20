"use client";

import Link from "next/link";
import {
    Table,
    Layers,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    FileCheck,
    Clock,
    Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function Compress100kbScenario() {
    const { language } = useLanguage();

    const t = {
        examples: {
            badge: { en: "Tested Benchmarks", cn: "实测参考" },
            title: { en: "Real-World File Size Examples", cn: "真实体积压缩示例" },
            subtitle: {
                en: "Common application scenarios tested with our browser compression algorithm (*illustrative figures; final size varies by image complexity).",
                cn: "常见报名与申报场景的实测体积变化（标注为参考示例，实际压缩大小取决于照片原始分辨率与色彩复杂度）。"
            },
            headers: {
                scenario: { en: "Scenario / Material", cn: "使用场景 / 材料类型" },
                original: { en: "Original", cn: "原始体积" },
                compressed: { en: "Compressed (<100KB)", cn: "压缩后体积" },
                reduction: { en: "Reduction", cn: "体积缩减" },
                requirement: { en: "Typical Portal Limit", cn: "常见系统要求" }
            },
            rows: [
                {
                    name: { en: "ID Card / Passport Scan", cn: "身份证 / 护照高清扫描件" },
                    original: "2.4 MB",
                    compressed: "86 KB",
                    reduction: "-96%",
                    limit: { en: "≤ 100 KB (Gov & visa portals)", cn: "≤ 100 KB（政务及签证系统）" }
                },
                {
                    name: { en: "Civil Service / Exam Registration Photo", cn: "公务员 / 教师资格证报名寸照" },
                    original: "5.1 MB",
                    compressed: "74 KB",
                    reduction: "-98%",
                    limit: { en: "20 KB ~ 100 KB (Strict limit)", cn: "20 KB ~ 100 KB（严格校验）" }
                },
                {
                    name: { en: "Diploma / Degree Certificate Photo", cn: "毕业证 / 学位证手机翻拍照" },
                    original: "3.8 MB",
                    compressed: "92 KB",
                    reduction: "-97%",
                    limit: { en: "≤ 100 KB / 200 KB", cn: "≤ 100 KB / 200 KB" }
                },
                {
                    name: { en: "Bank Statement / Financial Proof", cn: "银行流水单 / 财力证明截图" },
                    original: "4.5 MB",
                    compressed: "89 KB",
                    reduction: "-98%",
                    limit: { en: "≤ 100 KB per page", cn: "≤ 100 KB 单页" }
                }
            ],
            footnote: {
                en: "*Illustrative figures. Processing is 100% browser-side without uploading to any remote server.",
                cn: "*以上为常见场景示例数据。所有压缩运算均在浏览器本地完成，绝不会上传照片到服务器。"
            }
        },
        comparison: {
            title: { en: "Submission Before & After", cn: "材料提交前后对比" },
            subtitle: {
                en: "Avoid last-minute upload rejection during critical registration windows.",
                cn: "告别因图片体积超标被报名系统频频弹窗退件的困扰。"
            },
            beforeTag: { en: "Before Compression", cn: "压缩前：直接翻拍原图" },
            beforePoints: [
                { en: "File size exceeds limit (2MB~8MB), blocked immediately by upload portals with 'File too large' errors.", cn: "体积动辄 2MB~8MB，报名系统直接报错“文件大小超出限制（必须小于 100KB）”。" },
                { en: "Slow upload speeds and timeout crashes over congested mobile networks or public campus Wi-Fi.", cn: "原图体积大，在报名高峰期或弱网环境下极易遭遇网络超时、上传卡死中断。" },
                { en: "Blind resizing with generic paint apps degrades critical text and document legibility.", cn: "使用粗糙修图软件暴力压缩可能导致文字边缘模糊发虚，影响人工资质审核。" }
            ],
            afterTag: { en: "After Compression", cn: "压缩后：精准达标版本" },
            afterPoints: [
                { en: "Guaranteed under 100KB target size, ensuring 100% first-pass acceptance on submission portals.", cn: "严格收敛在 100KB 限额内，系统核验绿标一次性顺利通过。" },
                { en: "Smart adaptive compression preserves high-contrast document edges and stamp clarity.", cn: "智能针对证件文本优化，印章、字迹边缘依然清晰分明、易于辨识。" },
                { en: "Fast instant upload and seamless chaining to PDF compilation tools.", cn: "上传秒级完成，且可直接一键流转到 JPG 转 PDF 进行多材料归档。" }
            ]
        },
        limitations: {
            title: { en: "Real Limitations & Submission Advice", cn: "真实限制与填报建议" },
            subtitle: {
                en: "Understand technical trade-offs to ensure your documents pass both automatic and manual reviews.",
                cn: "理解技术边界，兼顾系统自动校验与人工审核要求。"
            },
            items: [
                {
                    title: { en: "Extreme detail preservation limits", cn: "高密集文字的极限压缩折损" },
                    desc: {
                        en: "Compressing dense 4K documents down to 100KB requires aggressive quantization. If your scan contains very small footnote font sizes, verify legibility before final submission.",
                        cn: "若材料包含极其密集的超小号附注文字，压缩到 100KB 内时微小笔画可能会产生轻微伪影，下载后建议放大至 100% 确认文字辨识度。"
                    }
                },
                {
                    title: { en: "Pixel dimension requirements", cn: "注意像素宽高比与分辨率要求" },
                    desc: {
                        en: "Many government or exam websites enforce strict pixel dimensions (e.g. 295×413 px for 1-inch photos) alongside file size caps. Compressing bytes does not alter crop aspect ratio.",
                        cn: "部分考务系统除了对文件体积（<100KB）有限制外，还对像素宽高（如 295×413 像素）有固定要求，请按报考简章要求结合使用。"
                    }
                },
                {
                    title: { en: "Strict format restrictions (JPG vs PNG)", cn: "系统文件格式类型限制" },
                    desc: {
                        en: "Most 100KB upload portals exclusively accept .jpg / .jpeg files. Double check whether your portal accepts PNG or WebP before uploading.",
                        cn: "绝大多数考务系统仅接受 .jpg / .jpeg 格式，若报名系统不兼容 PNG 或 WebP，请确保导出格式选择 JPG。"
                    }
                },
                {
                    title: { en: "Color profile & transparency", cn: "透明通道与色彩模式" },
                    desc: {
                        en: "Converting PNGs with transparency to JPG will automatically replace transparent backgrounds with clean white or black.",
                        cn: "带有透明背景的证件或公章图片转为 JPG 时会自动填充底色，建议提前确认报考背景色要求（红底/蓝底/白底）。"
                    }
                }
            ]
        },
        guide: {
            title: { en: "3-Step Fast Operation", cn: "短操作说明" },
            steps: [
                {
                    num: "01",
                    title: { en: "Drag or Select Photo", cn: "上传证件照片" },
                    desc: { en: "Drag your high-res photo into the tool above. No file leaves your device.", cn: "拖拽或点击上方工具区选择照片，纯本地运行，不出设备。" }
                },
                {
                    num: "02",
                    title: { en: "Auto-Compress to 100KB", cn: "自动智能压缩" },
                    desc: { en: "The tool automatically optimizes image quality to fit safely below 100,000 bytes.", cn: "算法自动寻找在 100KB 阈值下的最佳画质平衡点，秒级完成。" }
                },
                {
                    num: "03",
                    title: { en: "Download or Chain to PDF", cn: "保存或一键转 PDF" },
                    desc: { en: "Download the compressed JPG or proceed to Step 2 in our one-stop application flow.", cn: "点击下载压缩图，或直接进入下方一站式材料整理流程转为 PDF。" }
                }
            ]
        },
        pipeline: {
            badge: { en: "One-Stop Workflow", cn: "一站式材料整理流程" },
            title: { en: "Application Materials Assembly Pipeline", cn: "申请材料整理一站式指引" },
            subtitle: {
                en: "From raw photo to organized PDF dossier in 3 linked steps. Each step runs 100% locally.",
                cn: "从零散手机照片到标准单份申报 PDF 材料包：三步直通，全程本地免上传。"
            },
            steps: [
                {
                    step: "Step 1",
                    title: { en: "Compress to <100KB", cn: "压缩至 100KB 内" },
                    desc: {
                        en: "Shrink certificate photos, passport scans, and ID images below the strict 100KB upload threshold.",
                        cn: "将单张身份证照、证明扫描件压缩到 100KB 内，满足各类报名系统严格的单张体积上限。"
                    },
                    status: { en: "Current Tool", cn: "当前工具" },
                    btn: { en: "You are here", cn: "当前页面" },
                    href: "/tools/image-compressor/compress-image-to-100kb",
                    isCurrent: true,
                },
                {
                    step: "Step 2",
                    title: { en: "Convert JPG to PDF", cn: "JPG 转为 PDF 页面" },
                    desc: {
                        en: "Package single or multiple photo files into standard PDF pages without distortion or quality loss.",
                        cn: "将压缩好的单张或正反面证件照一键生成为标准的 PDF 文件，避免格式不兼容。"
                    },
                    status: { en: "Next Step", cn: "下一步" },
                    btn: { en: "Open JPG to PDF →", cn: "前往 JPG 转 PDF →" },
                    href: "/tools/pdf-kit/jpg-to-pdf-converter",
                    isCurrent: false,
                },
                {
                    step: "Step 3",
                    title: { en: "Merge All PDFs", cn: "合并申报材料 PDF" },
                    desc: {
                        en: "Combine resume, ID PDF, transcripts, and certificates into a single organized dossier for submission.",
                        cn: "将申请表、身份证明 PDF、成绩单及各项资质证明按考官要求的顺序合并为单一完整 PDF。"
                    },
                    status: { en: "Final Archive", cn: "最终合并" },
                    btn: { en: "Open Merge PDF →", cn: "前往合并 PDF →" },
                    href: "/tools/pdf-kit/merge-pdf-online",
                    isCurrent: false,
                }
            ]
        }
    };

    return (
        <div className="w-full max-w-5xl mt-12 space-y-16">
            {/* 1. 真实体积示例表格 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <Table className="w-4 h-4" />
                        <span>{language === "en" ? t.examples.badge.en : t.examples.badge.cn}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.examples.title.en : t.examples.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.examples.subtitle.en : t.examples.subtitle.cn}
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="py-3.5 px-4 sm:px-6">{language === "en" ? t.examples.headers.scenario.en : t.examples.headers.scenario.cn}</th>
                                <th className="py-3.5 px-4">{language === "en" ? t.examples.headers.original.en : t.examples.headers.original.cn}</th>
                                <th className="py-3.5 px-4">{language === "en" ? t.examples.headers.compressed.en : t.examples.headers.compressed.cn}</th>
                                <th className="py-3.5 px-4">{language === "en" ? t.examples.headers.reduction.en : t.examples.headers.reduction.cn}</th>
                                <th className="py-3.5 px-4 sm:px-6">{language === "en" ? t.examples.headers.requirement.en : t.examples.headers.requirement.cn}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {t.examples.rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="py-3 px-4 sm:px-6 font-medium text-white flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>{language === "en" ? row.name.en : row.name.cn}</span>
                                    </td>
                                    <td className="py-3 px-4 text-zinc-400 font-mono">{row.original}</td>
                                    <td className="py-3 px-4 text-emerald-400 font-bold font-mono">{row.compressed}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                            {row.reduction}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 sm:px-6 text-zinc-400 text-xs">
                                        {language === "en" ? row.limit.en : row.limit.cn}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed italic">
                    {language === "en" ? t.examples.footnote.en : t.examples.footnote.cn}
                </p>
            </section>

            {/* 2. 使用前后对比 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>{language === "en" ? "Efficiency Impact" : "过审效率对比"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.comparison.title.en : t.comparison.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.comparison.subtitle.en : t.comparison.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="rounded-2xl border border-red-900/40 bg-gradient-to-b from-red-950/20 to-zinc-900/60 p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-red-900/30">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {language === "en" ? t.comparison.beforeTag.en : t.comparison.beforeTag.cn}
                            </span>
                            <span className="text-xs text-zinc-500">Exceeds Limits</span>
                        </div>
                        <ul className="space-y-3">
                            {t.comparison.beforePoints.map((pt, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                                    <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                        ×
                                    </span>
                                    <span>{language === "en" ? pt.en : pt.cn}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* After */}
                    <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/20 to-zinc-900/60 p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {language === "en" ? t.comparison.afterTag.en : t.comparison.afterTag.cn}
                            </span>
                            <span className="text-xs text-zinc-500">Verified &lt;100KB</span>
                        </div>
                        <ul className="space-y-3">
                            {t.comparison.afterPoints.map((pt, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{language === "en" ? pt.en : pt.cn}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. 真实限制 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === "en" ? "Technical Scope" : "填报技术考量"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.limitations.title.en : t.limitations.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.limitations.subtitle.en : t.limitations.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.limitations.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                <h3 className="font-semibold text-white text-sm">
                                    {language === "en" ? item.title.en : item.title.cn}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed pl-4.5">
                                {language === "en" ? item.desc.en : item.desc.cn}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. 短操作说明 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{language === "en" ? "How-To" : "三步操作"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.guide.title.en : t.guide.title.cn}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.guide.steps.map((st) => (
                        <div
                            key={st.num}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3 relative overflow-hidden"
                        >
                            <div className="text-2xl font-black font-mono text-zinc-500">
                                {st.num}
                            </div>
                            <h3 className="font-semibold text-white text-sm">
                                {language === "en" ? st.title.en : st.title.cn}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {language === "en" ? st.desc.en : st.desc.cn}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. 一站式流程指引区 */}
            <section className="space-y-6 pt-6 border-t border-zinc-800">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <Layers className="w-4 h-4" />
                        <span>{language === "en" ? t.pipeline.badge.en : t.pipeline.badge.cn}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.pipeline.title.en : t.pipeline.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.pipeline.subtitle.en : t.pipeline.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.pipeline.steps.map((s, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "rounded-2xl border p-6 flex flex-col justify-between gap-5 transition-all",
                                s.isCurrent
                                    ? "bg-zinc-900 border-emerald-500/80 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/20"
                                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                            )}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                                        s.isCurrent
                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    )}>
                                        {language === "en" ? s.status.en : s.status.cn}
                                    </span>
                                    <span className="text-xs font-mono font-semibold text-zinc-500">{s.step}</span>
                                </div>
                                <h3 className="font-semibold text-white text-base">
                                    {language === "en" ? s.title.en : s.title.cn}
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {language === "en" ? s.desc.en : s.desc.cn}
                                </p>
                            </div>

                            {s.isCurrent ? (
                                <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{language === "en" ? s.btn.en : s.btn.cn}</span>
                                </div>
                            ) : (
                                <Link
                                    href={s.href}
                                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>{language === "en" ? s.btn.en : s.btn.cn}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
