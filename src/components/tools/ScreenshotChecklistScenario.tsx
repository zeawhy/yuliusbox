"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckSquare,
    Square,
    ShieldAlert,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    Clock,
    Sparkles,
    User,
    MessageSquare,
    MapPin,
    QrCode,
    Bell,
    FileImage,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function ScreenshotChecklistScenario() {
    const { language } = useLanguage();
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const t = {
        checklist: {
            badge: { en: "Privacy Defense", cn: "发布前防泄漏" },
            title: { en: "Pre-Publish Privacy Checklist", cn: "截图发布前 5 项隐私检查清单" },
            subtitle: {
                en: "Check off these 5 high-risk information zones before sharing screenshots to Slack, Discord, GitHub, or social media.",
                cn: "在将截图发送至社交媒体、工作群或开源社区前，逐项排查这 5 类最常被忽略的高危隐私信息。"
            },
            progress: {
                en: (checked: number, total: number) => `${checked} of ${total} verified`,
                cn: (checked: number, total: number) => `已完成排查 ${checked} / ${total} 项`
            },
            allSafe: { en: "All 5 items checked! Safe to share.", cn: "5 项全部排查完毕，可放心公开分享！" },
            items: [
                {
                    id: "avatars",
                    icon: User,
                    title: { en: "Avatars & Usernames", cn: "头像与用户名 / 账号" },
                    desc: {
                        en: "Profile photos, @usernames, email addresses, and phone numbers shown in top bars, comments, or account switchers.",
                        cn: "顶部导航栏的个人头像、@用户名、邮箱账号、手机号及登录身份信息。"
                    }
                },
                {
                    id: "chat",
                    icon: MessageSquare,
                    title: { en: "Chat Names & Mutual Contacts", cn: "聊天记录人名与备注" },
                    desc: {
                        en: "Real names in dialogue threads, contact notes, group member lists, and sensitive message context.",
                        cn: "对话历史中的真实姓名、好友专属备注、群成员列表及涉及第三方的敏感私信内容。"
                    }
                },
                {
                    id: "address",
                    icon: MapPin,
                    title: { en: "Addresses, License Plates & Tracking", cn: "地址、车牌与快递单号" },
                    desc: {
                        en: "Delivery labels, home/office addresses, license plates in window reflections, and courier barcode numbers.",
                        cn: "网购收货地址、门牌号、车牌号、快递物流单号及带有具体地理位置标识的街道门头。"
                    }
                },
                {
                    id: "qr",
                    icon: QrCode,
                    title: { en: "QR Codes & Barcodes", cn: "二维码与条形码" },
                    desc: {
                        en: "Login QR codes, payment receipts, boarding passes, event tickets, and 2FA recovery barcodes.",
                        cn: "登录授权二维码、支付收据条码、电子登机牌、门票条形码及两步验证密钥二维码。"
                    }
                },
                {
                    id: "notifications",
                    icon: Bell,
                    title: { en: "Status Bar & Push Notifications", cn: "状态栏、通知弹窗与浏览器书签" },
                    desc: {
                        en: "System clock, battery/carrier, private notification popups, open browser tabs, and bookmark bar folders.",
                        cn: "屏幕顶部时间、电量、微信/邮件临时通知弹窗、浏览器未关闭标签页与书签栏网址。"
                    }
                }
            ]
        },
        comparison: {
            title: { en: "Redaction Methods Compared", cn: "三种脱敏方式安全性对比" },
            subtitle: {
                en: "Pick the right redaction method for your security requirement.",
                cn: "根据敏感信息的机密等级，选择合适脱敏手段。"
            },
            methods: [
                {
                    title: { en: "Solid Color Block (Pure Blackout)", cn: "纯色色块（彻底涂黑）" },
                    security: { en: "Highest Security • Mathematically Irreversible", cn: "最高安全级别 • 数学级不可逆" },
                    border: "border-emerald-500/50",
                    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    desc: {
                        en: "Replaces original pixel RGB values with 100% uniform solid color. Leaves zero residual trace. Essential for passwords, API tokens, and bank details.",
                        cn: "用纯色完全重写目标像素数据，原始字符信息 100% 丢失，无法被任何 AI 或反卷积算法还原。最适合密码、密钥、身份证号。"
                    }
                },
                {
                    title: { en: "Heavy Gaussian Blur (Radius ≥ 16px)", cn: "强高斯模糊（半径 ≥ 16px）" },
                    security: { en: "High Security • Aesthetic Softening", cn: "高安全级别 • 视觉平滑美观" },
                    border: "border-blue-500/50",
                    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    desc: {
                        en: "Spreads pixel values across a wide Gaussian kernel. Retains layout aesthetics while destroying character legibility.",
                        cn: "大半径模糊将邻近像素高斯平滑混合，保留整体排版结构美感的同时破坏文字笔画，兼顾观感与脱敏。"
                    }
                },
                {
                    title: { en: "Mosaic Pixelation (Block ≥ 16px)", cn: "像素马赛克（尺寸 ≥ 16px）" },
                    security: { en: "Medium Security • Familiar Visual Cue", cn: "中等安全级别 • 习惯性脱敏" },
                    border: "border-amber-500/50",
                    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                    desc: {
                        en: "Downsamples pixels into uniform color tiles. Warning: keep block size large (≥16px) to avoid contour guessing.",
                        cn: "将区域降采样为方块均色。需注意马赛克颗粒必须足够大（建议 16px 以上），颗粒过小易被字典算法推算文本轮廓。"
                    }
                }
            ]
        },
        limitations: {
            title: { en: "Real Limitations & Boundaries", cn: "真实限制与安全认知" },
            subtitle: {
                en: "Understand what visual redaction tools can and cannot protect.",
                cn: "理性了解图像脱敏边界，构筑全方位防线。"
            },
            items: [
                {
                    title: { en: "Avoid weak or micro-blur radiuses", cn: "切忌使用微弱浅模糊或极小马赛克" },
                    desc: {
                        en: "Blurs with radius < 8px or mosaic blocks < 6px can sometimes be partially reconstructed using automated de-blur neural nets or known-font dictionary comparisons.",
                        cn: "若模糊半径低于 8px 或马赛克小于 6px，AI 去模糊或基于字体字典的暴力推算有可能推测出字符长度与大致轮廓。高敏感信息务必拉大强度或使用纯色块。"
                    }
                },
                {
                    title: { en: "Visual redaction does not wipe EXIF headers", cn: "图像像素脱敏不等于清除元数据" },
                    desc: {
                        en: "Drawing blur boxes modifies image pixels, but original photos taken on phones still contain EXIF GPS coordinates and camera models in the file headers. Always strip EXIF before publishing.",
                        cn: "打码只修改画面像素，手机直接拍摄的照片文件中仍可能封装了 GPS 经纬度和相机型号等 EXIF 元数据。发布前务必清除 EXIF。"
                    }
                },
                {
                    title: { en: "Be mindful of operating system clipboard history", cn: "留意操作系统剪贴板历史记录" },
                    desc: {
                        en: "If you copied sensitive passwords or credentials to the clipboard before screenshotting, clear your clipboard history (Win+V / Mac clipboard managers) to prevent accidental pastes.",
                        cn: "若在截图前后曾将敏感账号或密钥复制进剪贴板，建议顺手清理系统剪贴板历史记录，防止在其他应用中误粘贴。"
                    }
                },
                {
                    title: { en: "Lossless PNG export preserves exact pixel data", cn: "纯本地无损 PNG 导出机制" },
                    desc: {
                        en: "Exported PNG files bake redaction directly into the raster bitmap. No layer or vector undo history exists in the exported file.",
                        cn: "导出的 PNG 已经将遮挡直接合成为位图像素，文件内不包含任何图层或撤回历史，任何人均无法通过图层分离还原底层内容。"
                    }
                }
            ]
        },
        guide: {
            title: { en: "Quick 3-Step Operation", cn: "短操作说明" },
            steps: [
                {
                    num: "01",
                    title: { en: "Paste or Drop Screenshot", cn: "粘贴或拖拽截图" },
                    desc: { en: "Press Ctrl+V / Cmd+V directly to paste from clipboard, or drag in an image file. 100% local in your browser.", cn: "支持 Ctrl+V / Cmd+V 剪贴板一键粘贴，或拖拽图片文件，纯本地处理不出设备。" }
                },
                {
                    num: "02",
                    title: { en: "Draw Redaction Boxes", cn: "框选敏感隐私区域" },
                    desc: { en: "Click and drag to cover sensitive texts. Choose Gaussian blur, mosaic, or solid blackout in the toolbar.", cn: "鼠标拖拽拉框即可脱敏，可在顶部工具栏自由切换高斯模糊、马赛克或纯色涂黑。" }
                },
                {
                    num: "03",
                    title: { en: "Export & Strip EXIF", cn: "导出 PNG 并检查 EXIF" },
                    desc: { en: "Download your clean PNG. If publishing camera shots, continue to EXIF Remover below to strip GPS metadata.", cn: "点击保存无损 PNG 图片；若是手机拍摄的原图，可一键前往下方 EXIF 清除工具清除定位。" }
                }
            ]
        },
        nextSteps: {
            title: { en: "Related Next Steps: Zero-Trace Sharing", cn: "相关下一步：零痕迹安全分享" },
            subtitle: {
                en: "Combine visual redaction with metadata removal and file compression for comprehensive creator privacy.",
                cn: "画面脱敏 + 元数据清除 + 规范压缩：创作者全方位隐私发布三部曲。"
            },
            exifCard: {
                badge: { en: "Crucial Companion Tool", cn: "关键后续步骤" },
                title: { en: "Strip Hidden Camera & GPS EXIF Data", cn: "清除拍摄设备与 GPS 定位元数据" },
                desc: {
                    en: "Screenshots taken from photos or cameras contain hidden GPS coordinates, shoot timestamps, and hardware serials. Wipe it all with one click.",
                    cn: "从手机相册中截取的实拍照片可能依然保留拍摄地经纬度、拍摄时间戳与设备序列号。在公开发布前清除 EXIF，杜绝物理定位被深扒。"
                },
                btn: { en: "Open EXIF Remover Tool →", cn: "前往 EXIF 清除工具 →" },
                href: "/tools/exif-remover"
            },
            compressCard: {
                badge: { en: "Publishing Preparation", cn: "发布与分享" },
                title: { en: "Compress Cleaned Image for Fast Sharing", cn: "压缩图片体积，极速秒发" },
                desc: {
                    en: "Need to upload to forum posts, documentation, or email? Compress your sanitized images to <100KB without blurring text edges.",
                    cn: "需要上传到论坛、GitHub Issue、PR 描述或工作群？一键将图片体积压缩到 100KB 内，不卡顿秒上传。"
                },
                btn: { en: "Open 100KB Image Compressor →", cn: "前往 100KB 图片压缩 →" },
                href: "/tools/image-compressor/compress-image-to-100kb"
            }
        }
    };

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = t.checklist.items.length;

    return (
        <div className="w-full max-w-5xl mt-12 space-y-16">
            {/* 1. 发布前检查清单 */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>{language === "en" ? t.checklist.badge.en : t.checklist.badge.cn}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {language === "en" ? t.checklist.title.en : t.checklist.title.cn}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {language === "en" ? t.checklist.subtitle.en : t.checklist.subtitle.cn}
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <span className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            checkedCount === totalCount ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                        )} />
                        <span className="text-xs font-semibold text-zinc-300">
                            {t.checklist.progress[language](checkedCount, totalCount)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.checklist.items.map((item) => {
                        const Icon = item.icon;
                        const isChecked = !!checkedItems[item.id];
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleCheck(item.id)}
                                className={cn(
                                    "rounded-2xl border p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all select-none",
                                    isChecked
                                        ? "bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/20"
                                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                                )}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={cn("w-4 h-4", isChecked ? "text-emerald-400" : "text-zinc-400")} />
                                            <h3 className={cn("font-semibold text-sm", isChecked ? "text-emerald-300" : "text-white")}>
                                                {language === "en" ? item.title.en : item.title.cn}
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            className={cn("p-1 transition-colors", isChecked ? "text-emerald-400" : "text-zinc-600")}
                                        >
                                            {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        {language === "en" ? item.desc.en : item.desc.cn}
                                    </p>
                                </div>

                                <div className="text-[11px] font-medium pt-2 border-t border-zinc-800/60 flex items-center justify-between text-zinc-500">
                                    <span>{isChecked ? (language === "en" ? "✓ Verified" : "✓ 已确认遮挡") : (language === "en" ? "Click to verify" : "点击完成排查")}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {checkedCount === totalCount && (
                    <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 flex items-center gap-3 text-xs sm:text-sm text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{language === "en" ? t.checklist.allSafe.en : t.checklist.allSafe.cn}</span>
                    </div>
                )}
            </section>

            {/* 2. 示例与前后对比 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <EyeOff className="w-4 h-4 text-emerald-400" />
                        <span>{language === "en" ? "Methodology" : "脱敏对比"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.comparison.title.en : t.comparison.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.comparison.subtitle.en : t.comparison.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.comparison.methods.map((m, idx) => (
                        <div
                            key={idx}
                            className={cn("rounded-2xl border bg-zinc-900/60 p-5 space-y-3", m.border)}
                        >
                            <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border", m.badgeBg)}>
                                {language === "en" ? m.security.en : m.security.cn}
                            </span>
                            <h3 className="font-semibold text-white text-base">
                                {language === "en" ? m.title.en : m.title.cn}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {language === "en" ? m.desc.en : m.desc.cn}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. 真实限制 */}
            <section className="space-y-6">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{language === "en" ? "Security Scope" : "安全边界与限制"}</span>
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

            {/* 5. 相关下一步：互相关联指引 */}
            <section className="space-y-6 pt-6 border-t border-zinc-800">
                <div className="text-left space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <ArrowRight className="w-4 h-4" />
                        <span>{language === "en" ? "Creator Privacy Pipeline" : "创作者隐私后续工具"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {language === "en" ? t.nextSteps.title.en : t.nextSteps.title.cn}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {language === "en" ? t.nextSteps.subtitle.en : t.nextSteps.subtitle.cn}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* EXIF Remover Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/40 transition-colors">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {language === "en" ? t.nextSteps.exifCard.badge.en : t.nextSteps.exifCard.badge.cn}
                                </span>
                                <ShieldAlert className="w-5 h-5 text-zinc-500" />
                            </div>
                            <h3 className="font-semibold text-white text-base">
                                {language === "en" ? t.nextSteps.exifCard.title.en : t.nextSteps.exifCard.title.cn}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {language === "en" ? t.nextSteps.exifCard.desc.en : t.nextSteps.exifCard.desc.cn}
                            </p>
                        </div>
                        <Link
                            href={t.nextSteps.exifCard.href}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <span>{language === "en" ? t.nextSteps.exifCard.btn.en : t.nextSteps.exifCard.btn.cn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Compress Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-zinc-700 transition-colors">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
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
                            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <span>{language === "en" ? t.nextSteps.compressCard.btn.en : t.nextSteps.compressCard.btn.cn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
