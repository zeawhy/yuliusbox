"use client";

import Link from "next/link";
import {
    MapPin,
    Camera,
    Calendar,
    ShieldAlert,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Clock,
    Sparkles,
    FileImage,
    EyeOff,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function ExifRemoverScenario() {
    const { language } = useLanguage();

    const t = {
        why: {
            badge: { en: "Privacy Breakdown", cn: "深度解析" },
            title: { en: "Why You Must Strip EXIF Before Publishing", cn: "为什么要清除照片 EXIF 拍照元数据？" },
            subtitle: {
                en: "Every photo taken on modern smartphones embeds invisible digital forensics in the file headers. Posting original photos exposes your real-world identity.",
                cn: "现代智能手机拍摄的每张照片都在文件头部暗藏了详尽的数字足迹。直接发原图等于向互联网公开你的物理行踪。"
            },
            categories: [
                {
                    icon: MapPin,
                    color: "text-red-400",
                    border: "border-red-900/40 hover:border-red-700/60",
                    badge: { en: "Highest Risk • GPS", cn: "最高风险 • GPS 经纬度" },
                    title: { en: "Precise Geographic Coordinates", cn: "精确物理位置 GPS" },
                    desc: {
                        en: "Records latitude, longitude, altitude, and compass direction accurate to 3~5 meters. Anyone downloading your photo can plot your home, bedroom window, office, or school directly on Google or Apple Maps.",
                        cn: "记录精确到 3~5 米的经纬度、海拔与拍摄朝向。任何下载原图的人都能在地图软件上直接导航到你的居住地、办公室或孩子的学校。"
                    }
                },
                {
                    icon: Camera,
                    color: "text-blue-400",
                    border: "border-blue-900/40 hover:border-blue-700/60",
                    badge: { en: "Hardware Fingerprint", cn: "硬件指纹 • 相机型号" },
                    title: { en: "Camera Model & Lens Specifications", cn: "拍摄设备与硬件参数" },
                    desc: {
                        en: "Embeds exact device manufacturer (Apple, Sony, Canon), model name, lens focal length, aperture, serial number, and firmware build, allowing cross-platform device fingerprinting.",
                        cn: "记录具体的手机或相机品牌型号（如 iPhone 15 Pro、Sony A7M4）、镜头焦段、光圈快门、设备唯一序列号及固件版本，易被用于跨账号设备指纹关联。"
                    }
                },
                {
                    icon: Calendar,
                    color: "text-amber-400",
                    border: "border-amber-900/40 hover:border-amber-700/60",
                    badge: { en: "Timeline Tracking", cn: "生活作息 • 拍摄时间" },
                    title: { en: "Exact Timestamp & Chronology", cn: "拍摄时间与数字时间线" },
                    desc: {
                        en: "Stores creation year, month, day, hour, minute, second, and local timezone offset. Combined with location, it maps your daily commute, vacation schedules, and living routine.",
                        cn: "精确记录拍摄年月日、时分秒及本地时区偏移。结合地理位置，可轻而易举拼凑出你的日常通勤作息、出差轨迹与空巢时段。"
                    }
                }
            ]
        },
        comparison: {
            title: { en: "Before vs After EXIF Wiping", cn: "清除前后文件状态对比" },
            subtitle: {
                en: "How browser canvas re-encoding provides complete privacy guarantee.",
                cn: "基于 Canvas 纯像素重构机制，物理切断一切元数据传递可能。"
            },
            beforeTag: { en: "Raw Photo File • Before", cn: "清理前：手机直出原图" },
            beforePoints: [
                { en: "Contains 40~100+ hidden metadata tags (EXIF, IPTC, XMP, ICC color profiles, maker notes).", cn: "封装 40~100+ 个隐藏元数据字段（EXIF、IPTC、XMP 描述、厂商专属私有字段）。" },
                { en: "Embedded GPS coordinates expose exact shooting location on satellite maps.", cn: "携带真实 GPS 坐标，直接暴露出差、旅游及家庭住址。" },
                { en: "Contains camera serial and editing software timestamps that can identify the author.", cn: "包含相机机身序列号及后期修图软件标识，具备司法鉴识级溯源特征。" }
            ],
            afterTag: { en: "Cleaned Pixel Copy • After", cn: "清理后：纯净像素版本" },
            afterPoints: [
                { en: "100% metadata-free: canvas re-encoding copies pure RGB pixel data only, leaving zero file headers.", cn: "0 元数据残留：纯像素重新编码，物理丢弃所有文件头部元数据与隐藏字典。" },
                { en: "Completely anonymous digital identity: zero device fingerprints or timestamps survive.", cn: "完全匿名的数字身份：没有任何设备型号、拍摄时间戳或序列号留存。" },
                { en: "Visually identical quality: JPEG at 95% fidelity, PNG mathematically lossless.", cn: "画面画质完全无损：JPEG 保持 95% 高保真，PNG 格式绝对无损导出。" }
            ]
        },
        limitations: {
            title: { en: "Real Limitations & Boundaries", cn: "真实限制与安全边界" },
            subtitle: {
                en: "Understand the clear difference between metadata stripping and visual redaction.",
                cn: "清晰区分元数据清除与画面打码，确保综合隐私安全。"
            },
            items: [
                {
                    title: { en: "Cannot remove visual text stamped on image pixels", cn: "无法去除画面本身已经印制的水印文字" },
                    desc: {
                        en: "EXIF cleaner wipes hidden header data. If your camera stamped visible date numbers, license plates, or names directly onto the pixels, use Screenshot Blur to redact them visually.",
                        cn: "EXIF 清除的是文件头部的不可见元数据。若照片画面本身已被相机印上了时间水印、或者画面中拍到了人脸、车牌，需配合使用“截图打码”进行视觉遮挡。"
                    }
                },
                {
                    title: { en: "Always keep original files archived safely", cn: "建议自行归档保留珍贵原片" },
                    desc: {
                        en: "Cleaning removes photography parameters (ISO, shutter, aperture). If you need these for personal photography archives or RAW processing, save your originals in a private folder.",
                        cn: "清除后将不再包含快门、感光度 ISO 等摄影参数。摄影爱好者若需要保留参数作摄影参考，请在自己离线硬盘中妥善保留原始底片。"
                    }
                },
                {
                    title: { en: "Zero server storage guarantee", cn: "纯本地离线处理承诺" },
                    desc: {
                        en: "All EXIF reading and pixel re-encoding occur purely in your web browser. You can even disconnect your internet after loading the page and the tool works 100%.",
                        cn: "所有读取与清理均在您设备本地浏览器内存完成，照片从未上传到任何云端服务器，断开网络仍可顺畅运行。"
                    }
                },
                {
                    title: { en: "Format retention behavior", cn: "格式保持与透明底处理" },
                    desc: {
                        en: "Cleaned copies match the original file format (PNG stays PNG, WebP stays WebP, JPEG stays JPEG) to ensure broad platform compatibility.",
                        cn: "导出的纯净版本将保持与原始输入一致的图像格式（PNG 保持 PNG，WebP 保持 WebP，JPEG 保持 JPEG），确保无缝兼容各大社交平台。"
                    }
                }
            ]
        },
        guide: {
            title: { en: "3-Step Fast Operation", cn: "短操作说明" },
            steps: [
                {
                    num: "01",
                    title: { en: "Inspect Metadata", cn: "拖入照片查看隐藏信息" },
                    desc: { en: "Drop one or multiple photos above. The parser instantly reveals embedded camera, time, and GPS pins.", cn: "拖入单张或多张照片，工具立即展示隐藏的 GPS 定位、拍摄时间和设备型号。" }
                },
                {
                    num: "02",
                    title: { en: "One-Click Wipe", cn: "一键清除元数据" },
                    desc: { en: "Click 'Remove metadata' to redraw pure pixels onto an isolated canvas, physically stripping all tags.", cn: "点击“清除元数据”，在浏览器 Canvas 中仅提取像素重新编码，彻底丢弃元数据。" }
                },
                {
                    num: "03",
                    title: { en: "Download or Compress", cn: "下载干净照片或压缩分享" },
                    desc: { en: "Download clean files singly or in a single ZIP. Continue to our 100KB compressor to shrink size before sharing.", cn: "单张下载或一键打包 ZIP。若需要对外发送，可通过下方流转至图片压缩工具。" }
                }
            ]
        },
        nextSteps: {
            title: { en: "Related Next Steps: Clean & Share", cn: "相关下一步：创作者分享推荐流程" },
            subtitle: {
                en: "After clearing hidden EXIF trails, prepare your photos for fast, secure social sharing.",
                cn: "元数据清除后的推荐流转流程：压缩体积，或遮挡画面敏感区域。"
            },
            compressCard: {
                badge: { en: "Recommended Workflow", cn: "推荐流程" },
                title: { en: "Compress Cleaned Photos for Fast Sharing", cn: "压缩图片体积，规避上传限制" },
                desc: {
                    en: "Phone cameras shoot 5MB~20MB files. Compress your cleaned photos to <100KB for rapid sending via WeChat, Slack, Discord, or email without upload timeouts.",
                    cn: "手机直出的照片普遍在 5MB~20MB 以上。在清除 EXIF 后，一键将图片压缩至 100KB 内，发微信、发邮件、发论坛秒发不卡顿。"
                },
                btn: { en: "Open 100KB Image Compressor →", cn: "前往 100KB 图片压缩 →" },
                href: "/tools/image-compressor/compress-image-to-100kb"
            },
            blurCard: {
                badge: { en: "Visual Privacy", cn: "视觉脱敏" },
                title: { en: "Blur Sensitive Areas on Photos & Screenshots", cn: "照片画面打码与敏感区域脱敏" },
                desc: {
                    en: "Need to redact faces, house numbers, license plates, or names visible on the photo? Use Screenshot Blur to apply Gaussian blur or blackout boxes.",
                    cn: "照片画面里不慎拍到了路人人脸、门牌号、车牌或私密文字？前往截图打码工具添加高斯模糊或纯黑块遮挡。"
                },
                btn: { en: "Open Screenshot Blur →", cn: "前往截图打码脱敏 →" },
                href: "/tools/screenshot-blur"
            }
        }
    };

    return (
        <div className="w-full max-w-5xl mt-12 space-y-16">
            {/* 1. 为什么要清除说明区 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{language === "en" ? t.why.badge.en : t.why.badge.cn}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.why.title.en : t.why.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.why.subtitle.en : t.why.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.why.categories.map((c, idx) => {
                        const Icon = c.icon;
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "rounded-2xl border bg-zinc-900/60 p-6 flex flex-col justify-between gap-4 transition-colors",
                                    c.border
                                )}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-zinc-950/80", c.color)}>
                                            {language === "en" ? c.badge.en : c.badge.cn}
                                        </span>
                                        <Icon className={cn("w-5 h-5", c.color)} />
                                    </div>
                                    <h3 className="font-semibold text-white text-base">
                                        {language === "en" ? c.title.en : c.title.cn}
                                    </h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        {language === "en" ? c.desc.en : c.desc.cn}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 2. 清除前后对比 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{language === "en" ? "Forensic Evidence" : "对比说明"}</span>
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
                            <span className="text-xs text-zinc-500">Uncleaned</span>
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
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {language === "en" ? t.comparison.afterTag.en : t.comparison.afterTag.cn}
                            </span>
                            <span className="text-xs text-zinc-500">Pure Pixels</span>
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
                        <ShieldAlert className="w-4 h-4" />
                        <span>{language === "en" ? "Technical Scope" : "边界与限制"}</span>
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
                        <span>{language === "en" ? "Workflow" : "简易流程"}</span>
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
                            <div className="text-2xl font-black font-mono text-zinc-700">
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

            {/* 5. 相关下一步：清除 EXIF 后 → 压缩分享 */}
            <section className="space-y-6 pt-6 border-t border-zinc-800">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <ArrowRight className="w-4 h-4" />
                        <span>{language === "en" ? "Creator Pipeline" : "后续推荐操作"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.nextSteps.title.en : t.nextSteps.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.nextSteps.subtitle.en : t.nextSteps.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Compress Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/40 transition-colors">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {language === "en" ? t.nextSteps.compressCard.badge.en : t.nextSteps.compressCard.badge.cn}
                                </span>
                                <FileImage className="w-5 h-5 text-zinc-500" />
                            </div>
                            <h3 className="font-semibold text-white text-base">
                                {language === "en" ? t.nextSteps.compressCard.title.en : t.nextSteps.compressCard.title.cn}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {language === "en" ? t.nextSteps.compressCard.desc.en : t.nextSteps.compressCard.desc.cn}
                            </p>
                        </div>
                        <Link
                            href={t.nextSteps.compressCard.href}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <span>{language === "en" ? t.nextSteps.compressCard.btn.en : t.nextSteps.compressCard.btn.cn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Screenshot Blur Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-zinc-700 transition-colors">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                    {language === "en" ? t.nextSteps.blurCard.badge.en : t.nextSteps.blurCard.badge.cn}
                                </span>
                                <EyeOff className="w-5 h-5 text-zinc-500" />
                            </div>
                            <h3 className="font-semibold text-white text-base">
                                {language === "en" ? t.nextSteps.blurCard.title.en : t.nextSteps.blurCard.title.cn}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {language === "en" ? t.nextSteps.blurCard.desc.en : t.nextSteps.blurCard.desc.cn}
                            </p>
                        </div>
                        <Link
                            href={t.nextSteps.blurCard.href}
                            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <span>{language === "en" ? t.nextSteps.blurCard.btn.en : t.nextSteps.blurCard.btn.cn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
