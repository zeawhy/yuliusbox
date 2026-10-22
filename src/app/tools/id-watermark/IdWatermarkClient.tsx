"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import {
    Upload,
    Download,
    Type,
    RotateCw,
    Move,
    Palette,
    ShieldCheck,
    RefreshCw,
    Home,
    CreditCard,
    Coins,
    ShieldAlert,
    CheckCircle2,
    ArrowRight,
    FileText,
    AlertTriangle,
    Sparkles,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { ContinueWith } from "@/components/tools/ContinueWith";
import { useChainFile } from "@/lib/use-chain-file";
import { trackToolEvent } from "@/lib/analytics";
import { HandoffButton } from "@/lib/handoff";


function IDWatermarkChainSync({ onChainFile }: { onChainFile: (file: File) => void }) {
    const chainFile = useChainFile();
    const handledRef = useRef(false);
    useEffect(() => {
        if (!chainFile || handledRef.current) return;
        handledRef.current = true;
        onChainFile(new File([chainFile.blob], chainFile.name, { type: chainFile.blob.type || "image/png" }));
    }, [chainFile, onChainFile]);
    return null;
}

function IDWatermarkContent() {
    const { language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Settings
    // Default watermark text is language-sensitive; set once on mount / language change.
    const [text, setText] = useState("");
    const [textInitialized, setTextInitialized] = useState(false);
    const [fontSize, setFontSize] = useState(24);
    const [opacity, setOpacity] = useState(0.3);
    const [rotate, setRotate] = useState(-45);
    const [gap, setGap] = useState(80);
    const [color, setColor] = useState("#808080");
    const [appliedTemplateKey, setAppliedTemplateKey] = useState<string | null>(null);
    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "id-watermark" });
        }
    }, []);

    const handleApplyScenarioTemplate = (item: (typeof t.scenarioTemplates.items)[0]) => {
        const val = language === "en" ? item.watermark.en : item.watermark.cn;
        setText(val);
        setAppliedTemplateKey(item.key);
    };

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy Protected • 100% Local Processing", cn: "隐私保护 • 100% 本地处理" },
        title: { en: "Secure ID Watermarker", cn: "证件安全水印助手" },
        desc: { en: "Add a visible purpose label to your ID card / passport photos to deter misuse. Watermarking marks the intended use and raises the cost of misuse, but cannot guarantee against forgery or removal.", cn: "为证件照标注用途、增加盗用成本，但无法完全防止伪造或去除水印。纯本地处理，照片不会离开您的设备。" },
        upload: {
            title: { en: "Click or Drag ID Photo Here", cn: "点击或拖拽证件照到此处" },
            supported: { en: "Supports JPG, PNG, WebP", cn: "支持 JPG, PNG, WebP" }
        },
        controls: {
            text: { en: "Watermark Text", cn: "水印文字" },
            presets: { en: "Presets:", cn: "快速预设:" },
            style: { en: "Style", cn: "样式设置" },
            color: { en: "Color", cn: "颜色" },
            opacity: { en: "Opacity", cn: "透明度" },
            size: { en: "Size", cn: "大小" },
            rotate: { en: "Rotation", cn: "旋转" },
            density: { en: "Density", cn: "密度" }
        },
        presets: [
            {
                label: { en: "Rental", cn: "租房" },
                value: { en: `For rental application only - ${currentYear}`, cn: `仅供 ${currentYear}年办理租房业务使用 他用无效` }
            },
            {
                label: { en: "SIM Card", cn: "办卡" },
                value: { en: `For SIM card application only - ${currentYear}`, cn: `仅供 ${currentYear}年办理手机卡业务使用 他用无效` }
            },
            {
                label: { en: "Loan", cn: "贷款" },
                value: { en: `For loan application only - ${currentYear}`, cn: `仅供 ${currentYear}年办理贷款业务使用 他用无效` }
            },
            {
                label: { en: "Identity", cn: "验证身份" },
                value: { en: `For identity verification only - ${currentYear}`, cn: `仅供 ${currentYear}年身份验证使用 他用无效` }
            },
        ],
        download: { en: "Download Image", cn: "下载处理后的图片" },
        reminder: {
            en: "Please confirm the receiving institution accepts a watermarked copy, and avoid covering essential information on the ID.",
            cn: "请确认接收机构接受带水印的版本，并避免遮挡证件必要信息。"
        },
        scenarioTemplates: {
            title: { en: "Use Case Templates", cn: "用途模板示例" },
            subtitle: {
                en: "Recommended watermark phrasing for common scenarios. Click to apply directly.",
                cn: "高频真实生活场景推荐文案，点击即可一键填入上方水印输入框。"
            },
            apply: { en: "Apply Template", cn: "一键填入" },
            applied: { en: "Applied ✓", cn: "已填入 ✓" },
            items: [
                {
                    key: "rent",
                    title: { en: "Rental Application", cn: "租房签约" },
                    subtitle: { en: "For lease signing, agency filing, and tenant verification", cn: "用于租房合同签署、中介备案与房东身份核验" },
                    watermark: {
                        en: `For rental application only - ${currentYear}. Invalid for other uses.`,
                        cn: `仅供 ${currentYear}年办理租房业务使用 他用无效`
                    }
                },
                {
                    key: "card",
                    title: { en: "Card Application", cn: "办理业务 / 办卡" },
                    subtitle: { en: "For SIM cards, bank services, and membership registrations", cn: "用于营业厅办手机卡、银行非核心业务与会员登记" },
                    watermark: {
                        en: `For card application only - ${currentYear}. Invalid for other uses.`,
                        cn: `仅供 ${currentYear}年办理开卡业务使用 他用无效`
                    }
                },
                {
                    key: "loan",
                    title: { en: "Loan / Credit Check", cn: "贷款审批" },
                    subtitle: { en: "For loan applications, credit reviews, and mortgage audits", cn: "用于抵押贷款、个人信贷审核与资质初审递交" },
                    watermark: {
                        en: `For loan application only - ${currentYear}. Invalid for other uses.`,
                        cn: `仅供 ${currentYear}年办理贷款审核使用 他用无效`
                    }
                }
            ]
        },
        comparison: {
            title: { en: "Before vs After Watermarking", cn: "使用前后对比" },
            subtitle: {
                en: "Adding a purpose watermark raises the barrier against unauthorized misuse and identity theft.",
                cn: "标注用途水印显著提高了黑产冒用成本，遏制证件外流二次滥用。"
            },
            beforeTag: { en: "High Risk • Before", cn: "高风险 • 加水印前" },
            beforeTitle: { en: "Pristine Unmarked ID Photo", cn: "原始无水印证件照" },
            beforePoints: [
                { en: "No purpose restriction: can be silently repurposed for unauthorized accounts or micro-loans.", cn: "无用途约束：极易被不法分子挪用去批量注册违规账户、黑灰产网贷。" },
                { en: "Zero audit trail: impossible to prove which agency or third-party leaked your document.", cn: "泄露无法定责：一旦外流，无法溯源是哪家中介或服务方泄露了你的原件。" },
                { en: "Low fraud cost: passes easily as freshly provided primary identification.", cn: "冒用门槛极低：可直接冒充持证人本人的实时认证材料提交。" }
            ],
            afterTag: { en: "Protected • After", cn: "有效防御 • 加水印后" },
            afterTitle: { en: "Watermarked with Specific Purpose", cn: "标明用途与时效的水印件" },
            afterPoints: [
                { en: "Strictly limited purpose: prominently states recipient and purpose (e.g. 'For rental only').", cn: "严格限定用途：满屏平铺业务专用水印（如“仅供租房使用 他用无效”）。" },
                { en: "Time-bounded protection: includes year/date, defeating stale archive exploitation.", cn: "限定有效期与时效：标注使用年份，使过期挪用在风控人工审核时直接作废。" },
                { en: "Deters secondary circulation: third-party platforms reject mismatched purpose documents.", cn: "提高盗用门槛：第三方平台人工及 OCR 审核发现用途不符会直接退件。" }
            ]
        },
        limitations: {
            title: { en: "Real Limitations & Boundaries", cn: "真实限制说明" },
            subtitle: {
                en: "Watermarking is a powerful deterrent layer, but it is not absolute cryptographic defense.",
                cn: "清晰认识安全边界：水印是一道强威慑防线，但无法代替官方实质审核。"
            },
            items: [
                {
                    title: { en: "Cannot prevent advanced AI removal or forgery", cn: "无法绝对防止恶意 AI 擦除或伪造" },
                    desc: {
                        en: "Watermarking creates significant friction and visual tampering evidence, but determined bad actors with specialized generative AI tools might attempt removal. It acts as a deterrence layer, not cryptographic encryption.",
                        cn: "水印大幅增加了篡改与挪用成本，但掌握专业 AI 图像擦除工具的不法分子仍可能尝试抹除。水印是防君子的防护层，而非绝对防伪密码。"
                    }
                },
                {
                    title: { en: "Cannot replace official identity verification", cn: "不能替代官方机构的合法实名核验" },
                    desc: {
                        en: "Adding a watermark does not turn an invalid document into a valid one, nor does it replace official biometric face verification, chip verification, or in-person KYC audits.",
                        cn: "水印不能替代官方的人脸活体检测、二代证芯片物理读取或公安系统数据库核验，它仅用于保护你主动交由第三方的电子副本。"
                    }
                },
                {
                    title: { en: "Must not obscure essential identification text", cn: "切勿遮挡证件核心文字与人像" },
                    desc: {
                        en: "Always adjust watermark opacity, font size, and rotation so full name, ID number, validity dates, and portrait remain clearly legible. Otherwise, receiving institutions will reject your submission.",
                        cn: "请适当调整透明度与文字间距，确保姓名、身份证号、签发机关及人像五官清晰可辨，避免因信息无法辨识被审批机构退单。"
                    }
                },
                {
                    title: { en: "Confirm receiving party policies in advance", cn: "提交前请务必确认接收方政策" },
                    desc: {
                        en: "Certain government agencies, visa offices, or strict financial risk-control portals require pristine scans. Check whether watermarked electronic copies are permitted before filing.",
                        cn: "部分公证处、使领馆签证中心或金融核心系统可能要求无标注的原件扫描件，提交前建议咨询对方是否接受带水印复印件。"
                    }
                }
            ]
        },
        guide: {
            title: { en: "Quick 3-Step Guide", cn: "短操作说明" },
            steps: [
                {
                    num: "01",
                    title: { en: "Upload ID Photo", cn: "上传证件照" },
                    desc: { en: "Drag & drop ID card, passport, or license. 100% processed locally in your browser.", cn: "拖拽或点击上传身份证、护照或驾照照片，纯本地浏览器离线处理不出设备。" }
                },
                {
                    num: "02",
                    title: { en: "Pick Template & Fine-Tune", cn: "选择模板与微调" },
                    desc: { en: "Click a scenario template above or customize text. Adjust opacity and angle for clarity.", cn: "点击上方场景模板或输入自定义用途，调整透明度与旋转角度，确保不遮挡主要信息。" }
                },
                {
                    num: "03",
                    title: { en: "Download or Package to PDF", cn: "保存或转为 PDF" },
                    desc: { en: "Download the protected image, or click Next Steps below to package front & back into a single PDF.", cn: "一键下载加好水印的图片，或通过下方相关下一步将正反面整合为一份 PDF 文件提交。" }
                }
            ]
        },
        nextSteps: {
            title: { en: "Related Next Steps", cn: "相关下一步" },
            subtitle: { en: "Complete your document preparation with recommended companion tools", cn: "推荐的证件与材料整理后续步骤" },
            pdfCard: {
                badge: { en: "Recommended Workflow", cn: "推荐流程" },
                title: { en: "Package ID into Single PDF", cn: "证件照转 PDF 打包" },
                desc: { en: "Most institutions require front and back ID photos merged into a standard single PDF document.", cn: "多数审批机构要求将身份证正反面或护照页面整合成一份标准的 PDF 文件提交。" },
                btn: { en: "Convert to PDF →", cn: "前往 JPG 转 PDF →" },
                href: "/tools/pdf-kit/jpg-to-pdf-converter"
            },
            exifCard: {
                badge: { en: "Privacy Hardening", cn: "隐私加固" },
                title: { en: "Strip GPS & Camera EXIF", cn: "清除拍摄位置与设备信息" },
                desc: { en: "Remove hidden GPS coordinates, shoot timestamps, and camera serial numbers before sharing.", cn: "在对外发送前，清除照片中隐藏的拍摄地点经纬度、时间戳和手机型号等敏感元数据。" },
                btn: { en: "Strip EXIF Data →", cn: "前往清除 EXIF →" },
                href: "/tools/exif-remover"
            }
        }
    };

    // Initialize (and re-initialize on language switch) the default watermark text.
    useEffect(() => {
        if (!textInitialized) {
            setText(
                language === "en"
                    ? `For rental application only - ${currentYear}`
                    : `仅供 ${currentYear}年办理租房业务使用 他用无效`
            );
            setTextInitialized(true);
        }
    }, [language, textInitialized]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            trackToolEvent("file_selected", { tool: "id-watermark", detail: "count:1" });
            setFile(f);
            trackToolEvent("process_started", { tool: "id-watermark" });
            const img = new Image();
            img.src = URL.createObjectURL(f);
            img.onload = () => {
                setImage(img);
                // Scale watermark font size and gap proportionally to image width,
                // so small ID photos get the same watermark density as large ones.
                // Reference: 1000px wide -> 24px font, 80px gap.
                const scale = img.width / 1000;
                setFontSize(Math.max(10, Math.round(24 * scale)));
                setGap(Math.max(24, Math.round(80 * scale)));
                trackToolEvent("process_success", { tool: "id-watermark" });
            };
            img.onerror = () => {
                trackToolEvent("process_error", { tool: "id-watermark", errorCode: "image_decode_failed" });
            };
        }
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        try {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                trackToolEvent("process_error", { tool: "id-watermark", errorCode: "canvas_context_failed" });
                return;
            }

            // Set canvas dimensions to match image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw original image
            ctx.drawImage(image, 0, 0);

            // Prepare watermark
            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            // Setup tiling
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            // Calculate diagonal box size to ensure coverage when rotated
            const tileSize = Math.max(textWidth, fontSize * 2) + gap;

            // Let's loop through the canvas
            const cols = Math.ceil(canvas.width / tileSize) + 2;
            const rows = Math.ceil(canvas.height / tileSize) + 2;

            ctx.save();

            for (let i = -1; i < cols; i++) {
                for (let j = -1; j < rows; j++) {
                    const x = i * tileSize;
                    const y = j * tileSize;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate((rotate * Math.PI) / 180);
                    ctx.fillText(text, 0, 0);
                    ctx.restore();
                }
            }

            ctx.restore();
        } catch {
            trackToolEvent("process_error", { tool: "id-watermark", errorCode: "watermark_render_failed" });
        }

    }, [image, text, fontSize, opacity, rotate, gap, color]);

    useEffect(() => {
        draw();
    }, [draw]);

    // Chain file integration: useSearchParams lives in a tiny child that is
    // only rendered after mount, so it never bails the page out of SSR.
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const handleChainFile = useCallback((f: File) => {
        const isImage = f.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(f.name);
        if (isImage) {
            trackToolEvent("file_selected", { tool: "id-watermark", detail: "count:1" });
            setFile(f);
            trackToolEvent("process_started", { tool: "id-watermark" });
            const img = new Image();
            img.src = URL.createObjectURL(f);
            img.onload = () => {
                setImage(img);
                // Scale watermark font size and gap proportionally to image width,
                // so small ID photos get the same watermark density as large ones.
                const scale = img.width / 1000;
                setFontSize(Math.max(10, Math.round(24 * scale)));
                setGap(Math.max(24, Math.round(80 * scale)));
                trackToolEvent("process_success", { tool: "id-watermark" });
            };
            img.onerror = () => {
                trackToolEvent("process_error", { tool: "id-watermark", errorCode: "image_decode_failed" });
            };
        }
    }, []);

    const getWatermarkedBlob = async (): Promise<{ blob: Blob; name: string } | null> => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return null;
        return new Promise((resolve) => {
            const mime = file?.type === "image/jpeg" ? "image/jpeg" : "image/png";
            const ext = mime === "image/jpeg" ? "jpg" : "png";
            canvas.toBlob((b) => {
                if (!b) return resolve(null);
                const originalBase = file?.name ? file.name.replace(/\.[^.]+$/, "") : "image";
                resolve({ blob: b, name: `watermarked_${originalBase}.${ext}` });
            }, mime, 0.95);
        });
    };

    const downloadImage = async () => {
        const item = await getWatermarkedBlob();
        if (!item) return;
        trackToolEvent("download_clicked", { tool: "id-watermark" });
        const url = URL.createObjectURL(item.blob);
        const link = document.createElement("a");
        link.download = item.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {mounted && (
                <Suspense fallback={null}>
                    <IDWatermarkChainSync onChainFile={handleChainFile} />
                </Suspense>
            )}
            <div className="w-full grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
                {/* Left Column: Canvas / Preview (sticky so it stays visible while adjusting controls) */}
                <div className="lg:sticky lg:top-6 space-y-4 min-w-0">
                    <div className={cn(
                        "relative w-full min-h-[400px] bg-zinc-900/50 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden group",
                        image && "sticky top-0 z-20 lg:static"
                    )}>
                        {!image && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 pointer-events-none">
                                <Upload className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium text-lg">{language === "en" ? t.upload.title.en : t.upload.title.cn}</p>
                                <p className="text-sm mt-1">{language === "en" ? t.upload.supported.en : t.upload.supported.cn}</p>
                            </div>
                        )}

                        {/* File Input Overlay */}
                        {!image && (
                            <input
                                type="file"
                                aria-label="Upload ID photo"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        )}

                        {image && (
                            <div className="relative w-full h-full p-4 overflow-auto flex items-center justify-center bg-repeat" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3UFAYw4g/x+dQD6kG2IGURYOoGnAaxJmCNLuR0iLGFqjxHcsAd8mCcnISsCnAAAAAElFTkSuQmCC')" }}>
                                {/* Ensure we show max-width of container but allow scroll if needed or just fit */}
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-[45vh] lg:max-h-[70vh] object-contain shadow-2xl rounded-lg"
                                />
                                <button
                                    onClick={() => { setImage(null); setFile(null); }}
                                    className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <LocalTrustNote />
                </div>

                {/* Right Column: Controls */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit space-y-8 animate-in fade-in slide-in-from-right-4">

                    {/* Text Input */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Type className="w-4 h-4" /> {language === "en" ? t.controls.text.en : t.controls.text.cn}
                        </label>
                        <textarea
                            aria-label={language === "en" ? t.controls.text.en : t.controls.text.cn}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                        />

                        {/* Presets */}
                        <div className="space-y-2">
                            <span className="text-xs text-zinc-400">{language === "en" ? t.controls.presets.en : t.controls.presets.cn}</span>
                            <div className="flex flex-wrap gap-2">
                                {t.presets.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setText(language === "en" ? preset.value.en : preset.value.cn)}
                                        className="px-3 py-1 text-xs rounded-full bg-zinc-800 border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        {language === "en" ? preset.label.en : preset.label.cn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Appearance Controls */}
                    <div className="space-y-6">
                        <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> {language === "en" ? t.controls.style.en : t.controls.style.cn}
                        </p>

                        {/* Color */}
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-zinc-400">{language === "en" ? t.controls.color.en : t.controls.color.cn}</label>
                            <div className="flex items-center gap-2">
                                {['#ffffff', '#808080', '#000000', '#ff0000'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        aria-label={`Watermark color ${c}`}
                                        aria-pressed={color === c}
                                        className={cn(
                                            "w-6 h-6 rounded-full border border-zinc-700 relative after:absolute after:-inset-2.5 after:content-['']",
                                            color === c && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900"
                                        )}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    aria-label="Custom watermark color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Opacity */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{language === "en" ? t.controls.opacity.en : t.controls.opacity.cn}</span>
                                <span>{Math.round(opacity * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0.1" max="1" step="0.05"
                                aria-label={language === "en" ? t.controls.opacity.en : t.controls.opacity.cn}
                                aria-valuetext={`${Math.round(opacity * 100)}%`}
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{language === "en" ? t.controls.size.en : t.controls.size.cn}</span>
                                <span>{fontSize}px</span>
                            </div>
                            <input
                                type="range" min="12" max="100"
                                aria-label={language === "en" ? t.controls.size.en : t.controls.size.cn}
                                aria-valuetext={`${fontSize}px`}
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Rotation */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> {language === "en" ? t.controls.rotate.en : t.controls.rotate.cn}</span>
                                <span>{rotate}°</span>
                            </div>
                            <input
                                type="range" min="-90" max="90"
                                aria-label={language === "en" ? t.controls.rotate.en : t.controls.rotate.cn}
                                aria-valuetext={`${rotate} degrees`}
                                value={rotate}
                                onChange={(e) => setRotate(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Gap/Density */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><Move className="w-3 h-3" /> {language === "en" ? t.controls.density.en : t.controls.density.cn}</span>
                                <span>{gap}px</span>
                            </div>
                            <input
                                type="range" min="20" max="300"
                                aria-label={language === "en" ? t.controls.density.en : t.controls.density.cn}
                                aria-valuetext={`${gap}px`}
                                value={gap}
                                onChange={(e) => setGap(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300/90 leading-relaxed">
                            {language === "en" ? t.reminder.en : t.reminder.cn}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={downloadImage}
                                disabled={!image}
                                className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                            >
                                <Download className="w-5 h-5" />
                                {language === "en" ? t.download.en : t.download.cn}
                            </button>
                            {image && (
                                <HandoffButton
                                    targetUrl="/tools/pdf-kit?tab=jpg-to-pdf"
                                    label="Turn into PDF"
                                    className="py-3.5 px-6 font-bold"
                                    getItems={async () => {
                                        const item = await getWatermarkedBlob();
                                        if (!item) throw new Error("No image generated");
                                        return [item];
                                    }}
                                />
                            )}
                        </div>

                        {image && (
                            <ContinueWith
                                links={[
                                    {
                                        label: language === "en" ? "JPG to PDF" : "证件照转 PDF",
                                        href: "/tools/pdf-kit/jpg-to-pdf-converter",
                                    },
                                    {
                                        label: language === "en" ? "EXIF Remover" : "清除拍摄元数据",
                                        href: "/tools/exif-remover",
                                    },
                                ]}
                                getFile={getWatermarkedBlob}
                                className="w-full justify-between"
                                toolId="id-watermark"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Scenario Content Section */}
            <div className="w-full max-w-5xl mt-16 space-y-16">
                {/* 1. 用途模板示例 */}
                <section className="space-y-6">
                    <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>{language === "en" ? "Recommended Presets" : "常用场景推荐"}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {language === "en" ? t.scenarioTemplates.title.en : t.scenarioTemplates.title.cn}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {language === "en" ? t.scenarioTemplates.subtitle.en : t.scenarioTemplates.subtitle.cn}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {t.scenarioTemplates.items.map((item) => {
                            const isApplied =
                                appliedTemplateKey === item.key ||
                                text === (language === "en" ? item.watermark.en : item.watermark.cn);
                            return (
                                <div
                                    key={item.key}
                                    onClick={() => handleApplyScenarioTemplate(item)}
                                    className={cn(
                                        "group rounded-2xl border p-5 bg-zinc-900/60 hover:bg-zinc-900 transition-all cursor-pointer flex flex-col justify-between gap-4",
                                        isApplied
                                            ? "border-emerald-500/80 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/30"
                                            : "border-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {item.key === "rent" && <Home className="w-4 h-4 text-emerald-400" />}
                                                {item.key === "card" && <CreditCard className="w-4 h-4 text-emerald-400" />}
                                                {item.key === "loan" && <Coins className="w-4 h-4 text-emerald-400" />}
                                                <p className="font-semibold text-white text-base">
                                                    {language === "en" ? item.title.en : item.title.cn}
                                                </p>
                                            </div>
                                            {isApplied && (
                                                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                                    {language === "en" ? t.scenarioTemplates.applied.en : t.scenarioTemplates.applied.cn}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 leading-relaxed">
                                            {language === "en" ? item.subtitle.en : item.subtitle.cn}
                                        </p>
                                        <div className="rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 text-xs text-zinc-300 font-mono break-all leading-relaxed">
                                            &ldquo;{language === "en" ? item.watermark.en : item.watermark.cn}&rdquo;
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplyScenarioTemplate(item);
                                        }}
                                        className={cn(
                                            "w-full py-2 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                            isApplied
                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                                        )}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>
                                            {isApplied
                                                ? (language === "en" ? t.scenarioTemplates.applied.en : t.scenarioTemplates.applied.cn)
                                                : (language === "en" ? t.scenarioTemplates.apply.en : t.scenarioTemplates.apply.cn)}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. 使用前后对比 */}
                <section className="space-y-6">
                    <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>{language === "en" ? "Risk Assessment" : "安全防御对比"}</span>
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
                                <span className="text-xs text-zinc-500">Unrestricted</span>
                            </div>
                            <p className="font-semibold text-white text-lg">
                                {language === "en" ? t.comparison.beforeTitle.en : t.comparison.beforeTitle.cn}
                            </p>
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
                                <span className="text-xs text-zinc-500">Targeted</span>
                            </div>
                            <p className="font-semibold text-white text-lg">
                                {language === "en" ? t.comparison.afterTitle.en : t.comparison.afterTitle.cn}
                            </p>
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
                            <span>{language === "en" ? "Security Boundaries" : "安全边界"}</span>
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
                                    <p className="font-semibold text-white text-sm">
                                        {language === "en" ? item.title.en : item.title.cn}
                                    </p>
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
                                <p className="font-semibold text-white text-sm">
                                    {language === "en" ? st.title.en : st.title.cn}
                                </p>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {language === "en" ? st.desc.en : st.desc.cn}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. 相关下一步 */}
                <section className="space-y-6 pt-4 border-t border-zinc-800">
                    <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <ArrowRight className="w-4 h-4" />
                            <span>{language === "en" ? "Next Steps" : "后续推荐操作"}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {language === "en" ? t.nextSteps.title.en : t.nextSteps.title.cn}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {language === "en" ? t.nextSteps.subtitle.en : t.nextSteps.subtitle.cn}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* PDF Card */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/40 transition-colors">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                        {language === "en" ? t.nextSteps.pdfCard.badge.en : t.nextSteps.pdfCard.badge.cn}
                                    </span>
                                    <FileText className="w-5 h-5 text-zinc-500" />
                                </div>
                                <p className="font-semibold text-white text-base">
                                    {language === "en" ? t.nextSteps.pdfCard.title.en : t.nextSteps.pdfCard.title.cn}
                                </p>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {language === "en" ? t.nextSteps.pdfCard.desc.en : t.nextSteps.pdfCard.desc.cn}
                                </p>
                            </div>
                            <Link
                                href={t.nextSteps.pdfCard.href}
                                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                            >
                                <span>{language === "en" ? t.nextSteps.pdfCard.btn.en : t.nextSteps.pdfCard.btn.cn}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* EXIF Card */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/40 transition-colors">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                        {language === "en" ? t.nextSteps.exifCard.badge.en : t.nextSteps.exifCard.badge.cn}
                                    </span>
                                    <ShieldAlert className="w-5 h-5 text-zinc-500" />
                                </div>
                                <p className="font-semibold text-white text-base">
                                    {language === "en" ? t.nextSteps.exifCard.title.en : t.nextSteps.exifCard.title.cn}
                                </p>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {language === "en" ? t.nextSteps.exifCard.desc.en : t.nextSteps.exifCard.desc.cn}
                                </p>
                            </div>
                            <Link
                                href={t.nextSteps.exifCard.href}
                                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                            >
                                <span>{language === "en" ? t.nextSteps.exifCard.btn.en : t.nextSteps.exifCard.btn.cn}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {image && (
                        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>
                                    {language === "en"
                                        ? "Current watermarked image is ready for chaining to next tools:"
                                        : "当前处理好的水印证件照可直接一键流转至后续工具："}
                                </span>
                            </div>
                            <ContinueWith
                                links={[
                                    {
                                        label: language === "en" ? "JPG to PDF" : "证件照转 PDF",
                                        href: "/tools/pdf-kit/jpg-to-pdf-converter",
                                    },
                                    {
                                        label: language === "en" ? "EXIF Remover" : "清除拍摄元数据",
                                        href: "/tools/exif-remover",
                                    },
                                ]}
                                getFile={getWatermarkedBlob}
                                toolId="id-watermark"
                            />
                        </div>
                    )}
                </section>
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-4xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Why you must watermark ID photos?" : "为什么必须给证件照加水印？"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en"
                            ? "Identity theft is rising. Unscrupulous agents or data breaches can expose your clear ID photos, allowing criminals to apply for loans or credit cards in your name. Adding a specific watermark (e.g., \"For Rent Application Only\") invalidates the photo for any other use."
                            : "身份盗窃日益严重。不法中介或数据泄露可能会暴露您的清晰证件照，让不法分子冒用您的名义申请贷款或信用卡。添加特定的水印（例如“仅供租房申请使用”）可以防止照片被挪作他用。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "100% Private Processing" : "100% 隐私保护处理"}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        {language === "en" ? "YuliusBox uses HTML5 Canvas technology to process your images directly in your browser. Your ID card photos are " : "YuliusBox 使用 HTML5 Canvas 技术直接在您的浏览器中处理图片。您的证件照"}
                        <strong>{language === "en" ? "never uploaded" : "从未"}</strong>
                        {language === "en" ? " to our servers. All watermarking happens locally on your device, ensuring maximum security." : "上传到我们的服务器。所有水印处理均在您设备本地完成，确保最高安全性。"}
                    </p>

                    <h2 className="text-2xl font-bold mb-4">
                        {language === "en" ? "Frequently Asked Questions" : "常见问题"}
                    </h2>
                    <div className="space-y-4">
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                {language === "en" ? "Are photos uploaded?" : "照片会被上传吗？"}
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                {language === "en"
                                    ? "Absolutely not. You can disconnect your internet and this tool will still work perfectly. That is the best proof of privacy."
                                    : "绝对不会。您可以断开网络连接，此工具仍能完美运行。这就是隐私保护的最佳证明。"}
                            </p>
                        </details>
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                {language === "en" ? "What text should I write?" : "我应该写什么文字？"}
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                {language === "en"
                                    ? "Be specific. Include the purpose and date. Example: \"Only for House Rental Application 2024. Invalid for other uses.\""
                                    : "请具体一点。包括用途和日期。例如：“仅供 2024 年租房申请使用。他用无效。”"}
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default IDWatermarkContent;
