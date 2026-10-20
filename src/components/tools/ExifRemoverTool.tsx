"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import exifr from "exifr";
import JSZip from "jszip";
import { stripJpegMetadata } from "@/lib/jpeg-metadata";
import { useChainFile } from "@/lib/use-chain-file";
import {
    Upload, Download, Trash2, ShieldCheck, ShieldAlert, MapPin,
    Camera, Calendar, FileImage, Loader2, CheckCircle, X, Eye, EyeOff, Package,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";
import { ContinueWith } from "@/components/tools/ContinueWith";

// Logic ported from wipefey (MIT, github.com/seizmann/wipefey):
// canvas re-encode discards EXIF/XMP/IPTC/ICC/PNG text chunks entirely.

type FileStatus = "reading" | "ready" | "cleaning" | "done" | "error";

interface GpsPoint {
    lat: number;
    lng: number;
}

interface MetaSummary {
    camera: string | null;
    software: string | null;
    dateTaken: string | null;
    gps: GpsPoint | null;
    aiMarker: string | null;
    totalFields: number;
}

interface ExifFileItem {
    id: string;
    file: File;
    previewUrl: string;
    status: FileStatus;
    meta: MetaSummary | null;
    cleanedBlob: Blob | null;
    cleanedName: string;
    error?: string;
    showDetails: boolean;
}

const ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

const AI_KEYWORDS = [
    "stable diffusion", "dall-e", "dall·e", "midjourney", "firefly",
    "generative fill", "generative expand", "c2pa", "content credentials",
    "ai generated", "synthetic media", "imagen", "leonardo",
];

function detectAiMarker(tags: Record<string, unknown>): string | null {
    const haystacks: string[] = [];
    for (const key of ["Software", "software", "CreatorTool", "creatorTool", "ImageDescription", "imageDescription"]) {
        const v = tags[key];
        if (typeof v === "string") haystacks.push(v.toLowerCase());
    }
    // XMP often arrives as nested object — stringify it for keyword scan
    const xmp = tags["xmp"];
    if (xmp) {
        try {
            haystacks.push(JSON.stringify(xmp).toLowerCase());
        } catch {
            /* ignore */
        }
    }
    for (const h of haystacks) {
        for (const kw of AI_KEYWORDS) {
            if (h.includes(kw)) return kw;
        }
    }
    return null;
}

async function readMetadata(file: File): Promise<MetaSummary> {
    const buf = new Uint8Array(await file.arrayBuffer());
    const tags = ((await exifr.parse(buf, {
        ifd0: true, exif: true, iptc: true, xmp: true, gps: true,
    } as never).catch(() => null)) ?? {}) as Record<string, unknown>;

    const str = (v: unknown): string | null =>
        v === undefined || v === null ? null : String(v);

    const make = str(tags["Make"] ?? tags["make"]);
    const model = str(tags["Model"] ?? tags["model"]);
    const camera = [make, model].filter(Boolean).join(" ") || null;

    let gps: GpsPoint | null = null;
    const lat = tags["latitude"];
    const lng = tags["longitude"];
    if (typeof lat === "number" && typeof lng === "number") {
        gps = { lat, lng };
    }

    const dateTaken =
        str(tags["DateTimeOriginal"] ?? tags["dateTimeOriginal"] ?? tags["CreateDate"] ?? tags["createDate"]);

    const totalFields = Object.keys(tags).length;

    return {
        camera,
        software: str(tags["Software"] ?? tags["software"]),
        dateTaken,
        gps,
        aiMarker: detectAiMarker(tags),
        totalFields,
    };
}

/**
 * Strip metadata segments (EXIF APP1, XMP APP1, and Photoshop APP13 containing IPTC)
 * from a JPEG binary without re-encoding pixels.
 * Preserves the original compression and image data after SOS 100% byte-for-byte.
 * Returns null if the data is not a valid JPEG or has no metadata segments to strip.
 */
function stripJpegSegments(buffer: ArrayBuffer): ArrayBuffer | null {
    const result = stripJpegMetadata(buffer);
    if (!result || !result.removedAny) return null;
    return result.buffer;
}

/** Strip all metadata by lossless JPEG segment stripping or re-encoding through canvas (pixel data only). */
async function stripImage(file: File): Promise<Blob> {
    // For JPEG: try binary metadata stripping first (lossless, never inflates size)
    if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) {
        try {
            const buffer = await file.arrayBuffer();
            const stripped = stripJpegSegments(buffer);
            if (stripped) {
                return new Blob([stripped], { type: "image/jpeg" });
            }
        } catch {
            // Fall through to canvas re-encode
        }
    }
    return stripImageViaCanvas(file);
}

/** Fallback: re-encode through canvas (pixel data only). */
function stripImageViaCanvas(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Canvas unavailable"));
                return;
            }
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            const mime =
                file.type === "image/png" ? "image/png"
                : file.type === "image/webp" ? "image/webp"
                : "image/jpeg";
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
                mime,
                0.95
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not decode this image"));
        };
        img.src = url;
    });
}

function cleanName(name: string, mime: string): string {
    const base = name.replace(/\.[^.]+$/, "");
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    return `${base}-clean.${ext}`;
}

function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function ExifRemoverTool() {
    const { t } = useLanguage();
    const [items, setItems] = useState<ExifFileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [zipping, setZipping] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "exif-remover" });
        }
    }, []);

    const addFiles = useCallback((files: FileList | File[]) => {
        const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
        if (arr.length === 0) return;
        trackToolEvent("file_selected", { tool: "exif-remover", detail: `count:${arr.length}` });
        const newcomers: ExifFileItem[] = arr.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            previewUrl: URL.createObjectURL(file),
            status: "reading",
            meta: null,
            cleanedBlob: null,
            cleanedName: "",
            showDetails: false,
        }));
        setItems((prev) => [...prev, ...newcomers]);
        // Read metadata for each new file
        newcomers.forEach(async (item) => {
            try {
                const meta = await readMetadata(item.file);
                setItems((prev) =>
                    prev.map((p) => (p.id === item.id ? { ...p, meta, status: "ready" } : p))
                );
            } catch {
                setItems((prev) =>
                    prev.map((p) =>
                        p.id === item.id
                            ? { ...p, status: "error", error: t("Could not read metadata from this file.", "无法读取该文件的元数据。") }
                            : p
                    )
                );
            }
        });
    }, [t]);

function ExifChainSync({ onChainFile }: { onChainFile: (file: File) => void }) {
    const chainFile = useChainFile();
    useEffect(() => {
        if (!chainFile) return;
        const isImage = chainFile.blob.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(chainFile.name);
        if (isImage) {
            const f = new File([chainFile.blob], chainFile.name, { type: chainFile.blob.type || "image/jpeg" });
            onChainFile(f);
        }
    }, [chainFile, onChainFile]);
    return null;
}

    const cleanOne = useCallback(async (id: string) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: "cleaning" } : p)));
        const item = items.find((p) => p.id === id);
        if (!item) return;
        trackToolEvent("process_started", { tool: "exif-remover" });
        try {
            const blob = await stripImage(item.file);
            const cleanedName = cleanName(item.file.name, blob.type);
            trackToolEvent("process_success", { tool: "exif-remover" });
            setItems((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "done", cleanedBlob: blob, cleanedName } : p
                )
            );
        } catch {
            trackToolEvent("process_error", { tool: "exif-remover", errorCode: "exif_clean_failed" });
            setItems((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "error", error: t("Cleaning failed.", "清理失败。") } : p
                )
            );
        }
    }, [items, t]);

    const cleanAll = useCallback(async () => {
        for (const item of items) {
            if (item.status === "ready") {
                await cleanOne(item.id);
            }
        }
    }, [items, cleanOne]);

    const downloadZip = useCallback(async () => {
        const done = items.filter((p) => p.status === "done" && p.cleanedBlob);
        if (done.length === 0) return;
        trackToolEvent("download_clicked", { tool: "exif-remover", detail: "format:zip" });
        setZipping(true);
        try {
            const zip = new JSZip();
            done.forEach((p) => zip.file(p.cleanedName, p.cleanedBlob as Blob));
            const blob = await zip.generateAsync({ type: "blob" });
            downloadBlob(blob, "exif-cleaned-images.zip");
        } finally {
            setZipping(false);
        }
    }, [items]);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((p) => p.id !== id);
        });
    }, []);

    const toggleDetails = useCallback((id: string) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, showDetails: !p.showDetails } : p)));
    }, []);

    const readyCount = items.filter((p) => p.status === "ready").length;
    const doneCount = items.filter((p) => p.status === "done").length;
    const gpsCount = items.filter((p) => p.meta?.gps).length;
    const totalFields = items.reduce((s, p) => s + (p.meta?.totalFields ?? 0), 0);

    return (
        <div className="w-full flex flex-col gap-6">
            <Suspense fallback={null}>
                <ExifChainSync onChainFile={(file) => addFiles([file])} />
            </Suspense>
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors",
                    isDragging ? "border-emerald-400 bg-emerald-400/5" : "border-zinc-700 hover:border-zinc-500"
                )}
            >
                <Upload className="w-10 h-10 mx-auto text-zinc-500 mb-3" />
                <p className="text-lg text-white font-medium">{t("Drop photos here", "把照片拖到这里")}</p>
                <p className="text-sm text-zinc-400 mt-1">
                    {t("JPG, PNG, WebP — see what's hidden inside, then remove it. Runs locally in your browser.", "支持 JPG、PNG、WebP——先看看里面藏了什么，再一键清除。全程在本地浏览器处理。")}
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple
                    className="hidden"
                    onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                />
            </div>

            <LocalTrustNote />

            {/* Stats bar */}
            {items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-center">
                        <p className="text-2xl font-bold text-white">{items.length}</p>
                        <p className="text-xs text-zinc-500">{t("Photos", "照片")}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-center">
                        <p className="text-2xl font-bold text-amber-400">{totalFields}</p>
                        <p className="text-xs text-zinc-500">{t("Metadata fields found", "发现的元数据字段")}</p>
                    </div>
                    <div className={cn("rounded-xl border p-3 text-center", gpsCount > 0 ? "bg-red-950/40 border-red-900" : "bg-zinc-900 border-zinc-800")}>
                        <p className={cn("text-2xl font-bold", gpsCount > 0 ? "text-red-400" : "text-white")}>{gpsCount}</p>
                        <p className="text-xs text-zinc-500">{t("With GPS location", "含 GPS 定位")}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{doneCount}</p>
                        <p className="text-xs text-zinc-500">{t("Cleaned", "已清理")}</p>
                    </div>
                </div>
            )}

            {/* Actions */}
            {readyCount > 0 && (
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={cleanAll}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors"
                    >
                        {t(`Clean all (${readyCount})`, `全部清理 (${readyCount})`)}
                    </button>
                    {doneCount > 1 && (
                        <button
                            onClick={downloadZip}
                            disabled={zipping}
                            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {zipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                            {t("Download all as ZIP", "打包下载 ZIP")}
                        </button>
                    )}
                </div>
            )}

            {/* File cards */}
            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col sm:flex-row gap-4">
                        <img src={item.previewUrl} alt={item.file.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-white font-medium truncate">{item.file.name}</p>
                                    <p className="text-xs text-zinc-500">
                                        {formatBytes(item.file.size)}
                                        {item.cleanedBlob && (
                                            <span className="text-zinc-600"> → {formatBytes(item.cleanedBlob.size)}</span>
                                        )}
                                    </p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-400 transition-colors" aria-label="Remove">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {item.status === "reading" && (
                                <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />{t("Reading metadata…", "正在读取元数据…")}
                                </p>
                            )}
                            {item.status === "cleaning" && (
                                <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />{t("Wiping metadata…", "正在清除元数据…")}
                                </p>
                            )}
                            {item.status === "error" && (
                                <p className="text-sm text-red-400 mt-2">{item.error}</p>
                            )}

                            {item.meta && (item.status === "ready" || item.status === "done") && (
                                <div className="mt-2 flex flex-col gap-1.5 text-sm">
                                    {item.meta.gps && item.status === "ready" && (
                                        <p className="flex items-center gap-1.5 text-red-400 font-medium">
                                            <MapPin className="w-4 h-4" />
                                            {t("GPS location embedded", "含 GPS 定位")}
                                            <span className="text-red-400/70 font-normal">
                                                ({item.meta.gps.lat.toFixed(4)}, {item.meta.gps.lng.toFixed(4)})
                                            </span>
                                        </p>
                                    )}
                                    {item.status === "ready" && item.meta.camera && (
                                        <p className="flex items-center gap-1.5 text-zinc-400">
                                            <Camera className="w-4 h-4 text-zinc-600" />{item.meta.camera}
                                        </p>
                                    )}
                                    {item.status === "ready" && item.meta.dateTaken && (
                                        <p className="flex items-center gap-1.5 text-zinc-400">
                                            <Calendar className="w-4 h-4 text-zinc-600" />{item.meta.dateTaken}
                                        </p>
                                    )}
                                    {item.status === "ready" && item.meta.aiMarker && (
                                        <p className="flex items-center gap-1.5 text-violet-400">
                                            <ShieldAlert className="w-4 h-4" />
                                            {t(`AI-generation marker detected ("${item.meta.aiMarker}")`, `检测到 AI 生成标记（"${item.meta.aiMarker}"）`)}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => toggleDetails(item.id)}
                                        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs mt-1 transition-colors w-fit"
                                    >
                                        {item.showDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        {item.showDetails
                                            ? t("Hide details", "收起详情")
                                            : t(`${item.meta.totalFields} metadata fields found — view`, `发现 ${item.meta.totalFields} 个元数据字段——查看`)}
                                    </button>
                                    {item.showDetails && (
                                        <div className="mt-1 rounded-lg bg-black/40 border border-zinc-800 p-3 text-xs text-zinc-400 space-y-1">
                                            <p>{t("Software:", "软件：")} {item.meta.software ?? t("—", "—")}</p>
                                            <p>{t("Total embedded fields (EXIF / IPTC / XMP):", "嵌入字段总数（EXIF / IPTC / XMP）：")} {item.meta.totalFields}</p>
                                            <p className="text-zinc-600">
                                                {t("The cleaned copy keeps zero of these — pixel data only.", "清理后的文件将不保留其中任何一项——只剩像素数据。")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {item.status === "done" && (
                                <div className="mt-2 flex flex-col gap-1">
                                    <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                                        <CheckCircle className="w-4 h-4" />
                                        {t("Cleaned — 0 metadata fields in the downloaded copy", "已清理——下载副本中不含元数据字段")}
                                    </p>
                                    {item.meta && (item.meta.gps || item.meta.camera || item.meta.dateTaken || item.meta.software || item.meta.aiMarker) && (
                                        <p className="text-xs text-zinc-500">
                                            {t("Original file had: ", "原文件包含：")}
                                            {[
                                                item.meta.gps ? t("GPS", "GPS") : null,
                                                item.meta.camera ? t("device", "设备信息") : null,
                                                item.meta.dateTaken ? t("timestamp", "拍摄时间") : null,
                                                item.meta.software ? t("software", "软件信息") : null,
                                                item.meta.aiMarker ? t("AI marker", "AI 标记") : null,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    )}
                                    {item.cleanedBlob && item.cleanedBlob.size > item.file.size && (
                                        <p className="text-xs text-zinc-500">
                                            {t("File size may change because the image is re-encoded.", "文件大小可能因图片被重新编码而变化。")}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                                {item.status === "ready" && (
                                    <button
                                        onClick={() => cleanOne(item.id)}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-colors flex items-center gap-1.5"
                                    >
                                        <ShieldCheck className="w-4 h-4" />{t("Remove metadata", "清除元数据")}
                                    </button>
                                )}
                                {item.status === "done" && item.cleanedBlob && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => {
                                                trackToolEvent("download_clicked", { tool: "exif-remover", detail: "format:single" });
                                                downloadBlob(item.cleanedBlob as Blob, item.cleanedName);
                                            }}
                                            className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                                        >
                                            <Download className="w-4 h-4" />{t("Download clean copy", "下载干净版本")}
                                        </button>
                                        <ContinueWith
                                            links={[
                                                {
                                                    label: t("Compress Image →", "压缩图片分享 →"),
                                                    href: "/tools/image-compressor/compress-image-to-100kb",
                                                },
                                                {
                                                    label: t("Screenshot Blur →", "截图脱敏打码 →"),
                                                    href: "/tools/screenshot-blur",
                                                },
                                            ]}
                                            getFile={() => ({ blob: item.cleanedBlob as Blob, name: item.cleanedName })}
                                            toolId="exif-remover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex gap-4 items-start">
                    <FileImage className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
                    <div className="text-sm text-zinc-400 space-y-1.5">
                        <p className="text-white font-medium">{t("Why this matters", "为什么这很重要")}</p>
                        <p>{t("Every photo from your phone carries hidden EXIF data: camera model, shooting time, and sometimes precise GPS coordinates. Posting the original online publishes all of it.", "手机拍的每张照片都藏着 EXIF 数据：相机型号、拍摄时间，有时还有精确的 GPS 坐标。直接发原图等于把这些信息一起公开。")}</p>
                        <p>{t("This tool shows you what's inside — then produces a copy with the metadata removed. It can't hide landmarks, faces or text visible in the photo itself. Nothing ever leaves your browser.", "这个工具先让你看清里面藏了什么，再生成一张移除了元数据的副本。它无法遮挡照片画面中可见的地标、人脸或文字。全程不离开你的浏览器。")}</p>
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                {t("Cleaning strips metadata without touching pixels (JPEG keeps original quality; WebP at 95%, PNG lossless). No server, no upload, no account.", "清理只移除元数据、不碰像素（JPEG 保持原始画质；WebP 95% 质量，PNG 无损）。无服务器、无上传、无需账号。")}
            </p>
        </div>
    );
}
