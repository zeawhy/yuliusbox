"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
    Binary,
    Hash,
    Clock3,
    Copy,
    Check,
    Eraser,
    AlertTriangle,
    Upload,
    FileCode,
    RefreshCw,
    ShieldCheck,
    ArrowRightLeft,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";

/* -------------------------------------------------------------------------
 * MD5 Pure TypeScript Implementation
 * Passes standard RFC 1321 test vectors:
 * MD5("") = d41d8cd98f00b204e9800998ecf8427e
 * MD5("abc") = 900150983cd24fb0d6963f7d28e17f72
 * MD5("The quick brown fox jumps over the lazy dog") = 9e107d9d372bb6826bd81d3542a419d6
 * ------------------------------------------------------------------------- */
const S_MD5 = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const K_MD5 = new Uint32Array(64);
for (let i = 0; i < 64; i++) {
    K_MD5[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
}

export function md5(input: Uint8Array | string): string {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    const len = bytes.length;
    const nBlocks = ((len + 8) >> 6) + 1;
    const totalLen = nBlocks << 6;
    const padded = new Uint8Array(totalLen);
    padded.set(bytes);
    padded[len] = 0x80;

    const bitLen = len * 8;
    const view = new DataView(padded.buffer);
    view.setUint32(totalLen - 8, bitLen >>> 0, true);
    view.setUint32(totalLen - 4, Math.floor(len / 0x20000000), true);

    let a0 = 0x67452301,
        b0 = 0xefcdab89,
        c0 = 0x98badcfe,
        d0 = 0x10325476;

    for (let i = 0; i < totalLen; i += 64) {
        let A = a0,
            B = b0,
            C = c0,
            D = d0;
        for (let j = 0; j < 64; j++) {
            let F: number, g: number;
            if (j < 16) {
                F = (B & C) | (~B & D);
                g = j;
            } else if (j < 32) {
                F = (D & B) | (~D & C);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                F = B ^ C ^ D;
                g = (3 * j + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * j) % 16;
            }
            const Mg = view.getUint32(i + g * 4, true);
            const temp = D;
            D = C;
            C = B;
            const sum = (A + F + K_MD5[j] + Mg) >>> 0;
            const rot = (sum << S_MD5[j]) | (sum >>> (32 - S_MD5[j]));
            B = (B + rot) >>> 0;
            A = temp;
        }
        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
    }

    const res = new Uint8Array(16);
    const resView = new DataView(res.buffer);
    resView.setUint32(0, a0, true);
    resView.setUint32(4, b0, true);
    resView.setUint32(8, c0, true);
    resView.setUint32(12, d0, true);

    return Array.from(res)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/* -------------------------------------------------------------------------
 * Base64 Encoding & Decoding Helpers
 * ------------------------------------------------------------------------- */
function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
    let binary = "";
    const len = bytes.byteLength;
    const CHUNK_SIZE = 0x8000;
    for (let i = 0; i < len; i += CHUNK_SIZE) {
        const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, len));
        binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    let b64 = btoa(binary);
    if (urlSafe) {
        b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return b64;
}

function base64ToBytes(b64: string, urlSafe = false): Uint8Array {
    let normalized = b64.trim();
    if (urlSafe || normalized.includes("-") || normalized.includes("_")) {
        normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
        const pad = (4 - (normalized.length % 4)) % 4;
        normalized += "=".repeat(pad);
    }
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/* -------------------------------------------------------------------------
 * Relative Time Helper
 * ------------------------------------------------------------------------- */
function formatRelativeTime(
    tsSeconds: number,
    nowSeconds: number,
    t: (en: string, cn: string) => string
): string {
    const diff = tsSeconds - nowSeconds;
    const abs = Math.abs(diff);
    if (abs < 5) {
        return diff >= 0 ? t("in a few seconds", "几秒内") : t("just now", "刚刚");
    }
    const units: Array<[number, string, string]> = [
        [31536000, "year", "年"],
        [2592000, "month", "个月"],
        [86400, "day", "天"],
        [3600, "hour", "小时"],
        [60, "minute", "分钟"],
        [1, "second", "秒"],
    ];
    for (const [secs, enName, cnName] of units) {
        if (abs >= secs) {
            const n = Math.floor(abs / secs);
            if (diff >= 0) {
                const enLabel = n === 1 ? `in ${n} ${enName}` : `in ${n} ${enName}s`;
                const cnLabel = `${n} ${cnName}后`;
                return t(enLabel, cnLabel);
            } else {
                const enLabel = n === 1 ? `${n} ${enName} ago` : `${n} ${enName}s ago`;
                const cnLabel = `${n} ${cnName}前`;
                return t(enLabel, cnLabel);
            }
        }
    }
    return t("just now", "刚刚");
}

/* -------------------------------------------------------------------------
 * Copy Button Component
 * ------------------------------------------------------------------------- */
function CopyButton({
    text,
    label,
    className,
}: {
    text: string;
    label?: string;
    className?: string;
}) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <button
            onClick={copy}
            disabled={!text}
            title={t("Copy to clipboard", "复制到剪贴板")}
            className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors select-none",
                copied
                    ? "text-emerald-400 bg-emerald-950/50 border border-emerald-800/60"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed",
                className
            )}
        >
            {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
                <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? t("Copied", "已复制") : label || t("Copy", "复制")}</span>
        </button>
    );
}

/* -------------------------------------------------------------------------
 * Tab 1: Base64 Tool
 * ------------------------------------------------------------------------- */
function Base64Tab() {
    const { t } = useLanguage();
    const [textInput, setTextInput] = useState("");
    const [urlSafe, setUrlSafe] = useState(false);
    const [textOutput, setTextOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    // File mode
    const [fileB64, setFileB64] = useState("");
    const [fileInfo, setFileInfo] = useState<{
        name: string;
        size: number;
        type: string;
    } | null>(null);
    const [includeDataUrl, setIncludeDataUrl] = useState(true);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleEncode = () => {
        if (!textInput) {
            setTextOutput("");
            setError(null);
            return;
        }
        trackToolEvent("process_started", { tool: "codec-toolbox", detail: "action:encode_base64" });
        try {
            const bytes = new TextEncoder().encode(textInput);
            const encoded = bytesToBase64(bytes, urlSafe);
            setTextOutput(encoded);
            setError(null);
            trackToolEvent("process_success", { tool: "codec-toolbox", detail: "action:encode_base64" });
        } catch (e) {
            trackToolEvent("process_error", { tool: "codec-toolbox", errorCode: "base64_encode_failed", detail: "action:encode_base64" });
            setError(e instanceof Error ? e.message : "Encoding failed");
            setTextOutput("");
        }
    };

    const handleDecode = () => {
        if (!textInput.trim()) {
            setTextOutput("");
            setError(null);
            return;
        }
        trackToolEvent("process_started", { tool: "codec-toolbox", detail: "action:decode_base64" });
        try {
            const bytes = base64ToBytes(textInput, urlSafe);
            const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
            setTextOutput(decoded);
            setError(null);
            trackToolEvent("process_success", { tool: "codec-toolbox", detail: "action:decode_base64" });
        } catch {
            trackToolEvent("process_error", { tool: "codec-toolbox", errorCode: "base64_decode_failed", detail: "action:decode_base64" });
            setError(
                t(
                    "Invalid Base64 or UTF-8 sequence. Please ensure the input is valid Base64 encoded text.",
                    "无效的 Base64 或 UTF-8 字符序列。请确认输入是合法的 Base64 文本。"
                )
            );
            setTextOutput("");
        }
    };

    const handleSwap = () => {
        if (!textOutput) return;
        setTextInput(textOutput);
        setTextOutput("");
        setError(null);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "codec-toolbox", detail: "count:1" });
        setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
        });
        trackToolEvent("process_started", { tool: "codec-toolbox", detail: "action:file_base64" });
        try {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const b64 = bytesToBase64(bytes, false);
            setFileB64(b64);
            trackToolEvent("process_success", { tool: "codec-toolbox", detail: "action:file_base64" });
        } catch (err) {
            trackToolEvent("process_error", { tool: "codec-toolbox", errorCode: "file_read_failed", detail: "action:file_base64" });
            console.error("Failed to read file", err);
        }
    };

    const clearFile = () => {
        setFileB64("");
        setFileInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fileFinalOutput = useMemo(() => {
        if (!fileB64) return "";
        if (includeDataUrl && fileInfo) {
            return `data:${fileInfo.type};base64,${fileB64}`;
        }
        return fileB64;
    }, [fileB64, includeDataUrl, fileInfo]);

    return (
        <div className="space-y-6">
            {/* Text ↔ Base64 */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm">
                        <Binary className="w-4 h-4 text-emerald-400" />
                        {t("Text ↔ Base64 Conversion", "文本 ↔ Base64 编解码")}
                    </span>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={urlSafe}
                            onChange={(e) => setUrlSafe(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/40"
                        />
                        <span>{t("URL-safe variant (- and _, no =)", "URL 安全变体（- 与 _，无填充 =）")}</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium">
                        {t("Input Text or Base64", "输入文本或 Base64 字符串")}
                    </label>
                    <textarea
                        value={textInput}
                        onChange={(e) => {
                            setTextInput(e.target.value);
                            setError(null);
                        }}
                        rows={4}
                        placeholder={t(
                            "Type plain text to encode, or paste Base64 to decode (UTF-8 supported)...",
                            "输入普通文本进行编码，或粘贴 Base64 字符串进行解码（完整支持 UTF-8 中文）..."
                        )}
                        spellCheck={false}
                        className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 resize-y"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleEncode}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                    >
                        {t("Encode", "编码")}
                    </button>
                    <button
                        onClick={handleDecode}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                    >
                        {t("Decode", "解码")}
                    </button>
                    {textOutput && (
                        <button
                            onClick={handleSwap}
                            className="px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors flex items-center gap-1.5"
                            title={t("Swap input and output", "交换输入与输出")}
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                            {t("Swap", "交换")}
                        </button>
                    )}
                    {(textInput || textOutput || error) && (
                        <button
                            onClick={() => {
                                setTextInput("");
                                setTextOutput("");
                                setError(null);
                            }}
                            className="px-3 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors flex items-center gap-1.5 ml-auto"
                        >
                            <Eraser className="w-4 h-4" />
                            {t("Clear", "清空")}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-4 flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-300">
                            <p className="font-semibold">{t("Decode Error", "解码错误")}</p>
                            <p className="mt-0.5 text-red-400/90">{error}</p>
                        </div>
                    </div>
                )}

                {textOutput && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 font-medium">
                                {t("Output Result", "输出结果")} ({textOutput.length}{" "}
                                {t("chars", "字符")})
                            </span>
                            <CopyButton text={textOutput} />
                        </div>
                        <pre className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-300/95 whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                            {textOutput}
                        </pre>
                    </div>
                )}
            </div>

            {/* File → Base64 */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        {t("File → Base64 Conversion", "文件 → Base64 转换")}
                    </span>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={includeDataUrl}
                            onChange={(e) => setIncludeDataUrl(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/40"
                        />
                        <span>{t("Include Data URL prefix (data:mime;base64,...)", "包含 Data URL 前缀 (data:mime;base64,...)")}</span>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="b64-file-picker"
                    />
                    <label
                        htmlFor="b64-file-picker"
                        className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-500/60 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Upload className="w-4 h-4 text-emerald-400" />
                        {t("Choose File to Encode", "选择文件转换为 Base64")}
                    </label>
                    {fileInfo && (
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                            <span className="text-zinc-200 font-medium truncate max-w-xs">
                                {fileInfo.name}
                            </span>
                            <span>({formatBytes(fileInfo.size)})</span>
                            <button
                                onClick={clearFile}
                                className="text-zinc-500 hover:text-zinc-300 ml-1"
                                title={t("Remove file", "移除文件")}
                            >
                                <Eraser className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {fileFinalOutput && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 font-medium">
                                {t("Base64 Encoded Output", "Base64 编码结果")} ({fileFinalOutput.length}{" "}
                                {t("chars", "字符")})
                            </span>
                            <CopyButton text={fileFinalOutput} />
                        </div>
                        <pre className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-300/95 whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                            {fileFinalOutput}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------
 * Tab 2: Hash Tool
 * ------------------------------------------------------------------------- */
type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
const ALL_ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

function HashTab() {
    const { t } = useLanguage();
    const [inputMode, setInputMode] = useState<"text" | "file">("text");
    const [textInput, setTextInput] = useState("");
    const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
    const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
    const [selectedAlgs, setSelectedAlgs] = useState<Record<HashAlgorithm, boolean>>({
        MD5: true,
        "SHA-1": true,
        "SHA-256": true,
        "SHA-512": true,
    });
    const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>({});
    const [isComputing, setIsComputing] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const toggleAlg = (alg: HashAlgorithm) => {
        setSelectedAlgs((prev) => ({ ...prev, [alg]: !prev[alg] }));
    };

    const computeHashes = useCallback(
        async (bytes: Uint8Array | null) => {
            if (!bytes || bytes.length === 0) {
                setHashes({});
                return;
            }
            setIsComputing(true);
            trackToolEvent("process_started", { tool: "codec-toolbox", detail: "action:compute_hash" });
            const results: Partial<Record<HashAlgorithm, string>> = {};

            try {
                if (selectedAlgs.MD5) {
                    results.MD5 = md5(bytes);
                }
                if (selectedAlgs["SHA-1"]) {
                    const buf = await crypto.subtle.digest(
                        "SHA-1",
                        bytes as unknown as BufferSource
                    );
                    results["SHA-1"] = Array.from(new Uint8Array(buf))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                }
                if (selectedAlgs["SHA-256"]) {
                    const buf = await crypto.subtle.digest(
                        "SHA-256",
                        bytes as unknown as BufferSource
                    );
                    results["SHA-256"] = Array.from(new Uint8Array(buf))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                }
                if (selectedAlgs["SHA-512"]) {
                    const buf = await crypto.subtle.digest(
                        "SHA-512",
                        bytes as unknown as BufferSource
                    );
                    results["SHA-512"] = Array.from(new Uint8Array(buf))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                }
                setHashes(results);
                trackToolEvent("process_success", { tool: "codec-toolbox", detail: "action:compute_hash" });
            } catch (err) {
                trackToolEvent("process_error", { tool: "codec-toolbox", errorCode: "hash_failed", detail: "action:compute_hash" });
                console.error("Hash calculation failed", err);
            } finally {
                setIsComputing(false);
            }
        },
        [selectedAlgs]
    );

    useEffect(() => {
        if (inputMode === "text") {
            if (textInput) {
                const bytes = new TextEncoder().encode(textInput);
                computeHashes(bytes);
            } else {
                setHashes({});
            }
        } else {
            if (fileBytes) {
                computeHashes(fileBytes);
            } else {
                setHashes({});
            }
        }
    }, [inputMode, textInput, fileBytes, computeHashes]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "codec-toolbox", detail: "count:1" });
        setFileMeta({ name: file.name, size: file.size });
        try {
            const buf = await file.arrayBuffer();
            setFileBytes(new Uint8Array(buf));
        } catch (err) {
            console.error("Failed to read file", err);
        }
    };

    const clearFile = () => {
        setFileBytes(null);
        setFileMeta(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    return (
        <div className="space-y-6">
            {/* Input Card */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm">
                        <Hash className="w-4 h-4 text-emerald-400" />
                        {t("Cryptographic Hash Generator", "哈希校验和生成器")}
                    </span>

                    {/* Mode switcher: Text vs File */}
                    <div className="inline-flex rounded-lg bg-zinc-950/80 p-0.5 border border-zinc-800">
                        <button
                            onClick={() => setInputMode("text")}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                inputMode === "text"
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {t("Text Input", "文本输入")}
                        </button>
                        <button
                            onClick={() => setInputMode("file")}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                inputMode === "file"
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {t("File Input", "文件输入")}
                        </button>
                    </div>
                </div>

                {inputMode === "text" ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-zinc-400 font-medium">
                                {t("Enter text to hash (UTF-8 encoded)", "输入待计算哈希的文本（UTF-8 编码）")}
                            </label>
                            {textInput && (
                                <button
                                    onClick={() => setTextInput("")}
                                    className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                                >
                                    <Eraser className="w-3.5 h-3.5" />
                                    {t("Clear", "清空")}
                                </button>
                            )}
                        </div>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            rows={3}
                            placeholder={t(
                                "Type or paste string here (e.g. password, API payload, message)...",
                                "在此输入字符串（如密码、API 载荷、文本内容）..."
                            )}
                            spellCheck={false}
                            className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 resize-y"
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input
                            ref={fileRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="hash-file-picker"
                        />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <label
                                htmlFor="hash-file-picker"
                                className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-500/60 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <Upload className="w-4 h-4 text-emerald-400" />
                                {t("Choose File to Hash", "选择待计算哈希的文件")}
                            </label>
                            {fileMeta && (
                                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                    <span className="text-zinc-200 font-medium truncate max-w-xs">
                                        {fileMeta.name}
                                    </span>
                                    <span>({formatBytes(fileMeta.size)})</span>
                                    <button
                                        onClick={clearFile}
                                        className="text-zinc-500 hover:text-zinc-300 ml-1"
                                        title={t("Remove file", "移除文件")}
                                    >
                                        <Eraser className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Algorithm checkboxes */}
                <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                    <span className="text-xs text-zinc-400 font-medium">
                        {t("Select Hash Algorithms", "选择哈希算法")}
                    </span>
                    <div className="flex flex-wrap gap-4">
                        {ALL_ALGORITHMS.map((alg) => (
                            <label
                                key={alg}
                                className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none font-mono"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedAlgs[alg]}
                                    onChange={() => toggleAlg(alg)}
                                    className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/40"
                                />
                                <span>{alg}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Card */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="text-white font-semibold text-sm">
                        {t("Digests & Checksums", "哈希摘要结果")}
                    </span>
                    {isComputing && (
                        <span className="text-xs text-emerald-400 animate-pulse">
                            {t("Computing...", "计算中...")}
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    {ALL_ALGORITHMS.filter((alg) => selectedAlgs[alg]).map((alg) => {
                        const val = hashes[alg] || "";
                        return (
                            <div
                                key={alg}
                                className="rounded-xl bg-black/40 border border-zinc-800/80 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                                        {alg}
                                    </span>
                                    <span className="font-mono text-xs sm:text-sm text-emerald-300/90 break-all select-all">
                                        {val || (
                                            <span className="text-zinc-600 italic font-sans text-xs">
                                                {t("Awaiting input...", "等待输入...")}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="sm:shrink-0 self-end sm:self-auto">
                                    <CopyButton text={val} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Security Warning */}
            <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4 sm:p-5 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                    <p className="text-amber-300 font-semibold">
                        {t("Security Notice: MD5 & SHA-1 Collision Risks", "安全提示：MD5 与 SHA-1 碰撞风险")}
                    </p>
                    <p className="text-zinc-400">
                        {t(
                            "MD5 and SHA-1 have known cryptographic collision vulnerabilities. They are suitable only as non-security checksums, file deduplication keys, or legacy cache identifiers. Never use them for password storage, HMAC tokens, or digital signatures. Use SHA-256 or SHA-512 instead.",
                            "MD5 与 SHA-1 已被证实不抗碰撞，仅适合做文件去重、非安全性校验和或旧系统缓存键，严禁用于密码存储或数字签名等安全场景。安全场景请选用 SHA-256 或 SHA-512。"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------
 * Tab 3: Timestamp Tool
 * ------------------------------------------------------------------------- */
function TimestampTab() {
    const { t } = useLanguage();

    // Live clock state
    const [nowMs, setNowMs] = useState<number | null>(null);
    const [timeZone, setTimeZone] = useState<"local" | "utc">("local");
    const [localTzName, setLocalTzName] = useState("Local");

    // Timestamp -> Date
    const [tsInput, setTsInput] = useState("");

    // Date -> Timestamp
    const [dateInput, setDateInput] = useState("");

    // Mount & clock ticks
    useEffect(() => {
        setNowMs(Date.now());
        try {
            setLocalTzName(Intl.DateTimeFormat().resolvedOptions().timeZone || "Local");
        } catch {
            /* ignore */
        }
        const clockTimer = setInterval(() => {
            setNowMs(Date.now());
        }, 1000);
        return () => clearInterval(clockTimer);
    }, []);

    // Timestamp -> Date calculation
    const tsConversion = useMemo(() => {
        const raw = tsInput.trim();
        if (!raw) return null;
        const num = Number(raw);
        if (!Number.isFinite(num)) {
            return {
                success: false as const,
                error: t("Please enter a valid numeric timestamp", "请输入有效的数字时间戳"),
            };
        }
        const isMs = Math.abs(num) >= 1e12;
        const ms = isMs ? num : num * 1000;
        const date = new Date(ms);
        if (Number.isNaN(date.getTime())) {
            return {
                success: false as const,
                error: t("Timestamp value out of valid date range", "时间戳数值超出合法日期范围"),
            };
        }
        const sec = Math.floor(ms / 1000);
        const iso = date.toISOString();
        const utcStr = date.toUTCString();
        const formatted =
            timeZone === "utc"
                ? utcStr
                : date.toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                  });

        return {
            success: true as const,
            isMs,
            sec,
            ms,
            date,
            formatted,
            utcStr,
            iso,
        };
    }, [tsInput, timeZone, t]);

    // Date -> Timestamp calculation
    const dateConversion = useMemo(() => {
        const raw = dateInput.trim();
        if (!raw) return null;
        try {
            let ms: number;
            if (timeZone === "utc") {
                // Parse as UTC
                ms = new Date(`${raw}:00Z`).getTime();
                if (Number.isNaN(ms)) {
                    ms = new Date(raw).getTime();
                }
            } else {
                ms = new Date(raw).getTime();
            }
            if (Number.isNaN(ms)) {
                return { success: false as const, error: t("Invalid date format", "无效的日期格式") };
            }
            const sec = Math.floor(ms / 1000);
            return { success: true as const, sec, ms };
        } catch {
            return { success: false as const, error: t("Invalid date", "无效日期") };
        }
    }, [dateInput, timeZone, t]);

    const setNowToInput = () => {
        if (!nowMs) return;
        setTsInput(String(Math.floor(nowMs / 1000)));
    };

    const setCurrentDateToInput = () => {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        if (timeZone === "utc") {
            const yr = d.getUTCFullYear();
            const mo = pad(d.getUTCMonth() + 1);
            const da = pad(d.getUTCDate());
            const hr = pad(d.getUTCHours());
            const mi = pad(d.getUTCMinutes());
            setDateInput(`${yr}-${mo}-${da}T${hr}:${mi}`);
        } else {
            const yr = d.getFullYear();
            const mo = pad(d.getMonth() + 1);
            const da = pad(d.getDate());
            const hr = pad(d.getHours());
            const mi = pad(d.getMinutes());
            setDateInput(`${yr}-${mo}-${da}T${hr}:${mi}`);
        }
    };

    const nowSeconds = nowMs ? Math.floor(nowMs / 1000) : 0;

    return (
        <div className="space-y-6">
            {/* Live Clock Card */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm">
                        <Clock3 className="w-4 h-4 text-emerald-400" />
                        {t("Current Epoch Timestamp (Live)", "当前 Unix 时间戳（实时）")}
                    </span>

                    {/* Timezone toggle */}
                    <div className="inline-flex rounded-lg bg-zinc-950/80 p-0.5 border border-zinc-800">
                        <button
                            onClick={() => setTimeZone("local")}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                timeZone === "local"
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            {t("Local", "本地")} ({localTzName.split("/").pop() || "Local"})
                        </button>
                        <button
                            onClick={() => setTimeZone("utc")}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                timeZone === "utc"
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            UTC
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/40 border border-zinc-800 p-3.5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-400 font-medium">
                                {t("Unix Seconds (10 digits)", "Unix 秒 (10 位)")}
                            </p>
                            <p className="font-mono text-lg font-bold text-emerald-400 mt-0.5">
                                {nowMs ? Math.floor(nowMs / 1000) : "—"}
                            </p>
                        </div>
                        <CopyButton
                            text={nowMs ? String(Math.floor(nowMs / 1000)) : ""}
                            label={t("Copy", "复制")}
                        />
                    </div>
                    <div className="rounded-xl bg-black/40 border border-zinc-800 p-3.5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-400 font-medium">
                                {t("Unix Milliseconds (13 digits)", "Unix 毫秒 (13 位)")}
                            </p>
                            <p className="font-mono text-lg font-bold text-emerald-400 mt-0.5">
                                {nowMs ? nowMs : "—"}
                            </p>
                        </div>
                        <CopyButton text={nowMs ? String(nowMs) : ""} label={t("Copy", "复制")} />
                    </div>
                </div>
            </div>

            {/* Section 1: Timestamp → Date */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <span className="text-white font-semibold text-sm">
                        {t("Timestamp → Human Date", "时间戳 → 可读日期")}
                    </span>
                    <button
                        onClick={setNowToInput}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3 h-3 text-emerald-400" />
                        {t("Paste Now", "填入当前时间")}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400 font-medium">
                            {t("Enter Unix Timestamp (Seconds or Milliseconds)", "输入 Unix 时间戳（秒或毫秒）")}
                        </label>
                        {tsConversion && tsConversion.success && (
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded-full">
                                {tsConversion.isMs
                                    ? t("Detected: Milliseconds (ms)", "识别为：毫秒 (ms)")
                                    : t("Detected: Seconds (s)", "识别为：秒 (s)")}
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={tsInput}
                        onChange={(e) => setTsInput(e.target.value)}
                        placeholder="e.g. 1799999999 or 1799999999000"
                        className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600"
                    />
                </div>

                {tsConversion && !tsConversion.success && (
                    <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3.5 flex gap-2.5 items-start text-xs text-red-300">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{tsConversion.error}</span>
                    </div>
                )}

                {tsConversion && tsConversion.success && (
                    <div className="space-y-2.5 pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                            <span>{t("Conversion Results", "转换结果")}</span>
                            <span className="text-emerald-400 font-medium">
                                · {formatRelativeTime(tsConversion.sec, nowSeconds, t)}
                            </span>
                        </div>

                        {/* Local / Selected Timezone */}
                        <div className="rounded-xl bg-black/40 border border-zinc-800 p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <span className="text-xs text-zinc-500 block">
                                    {timeZone === "utc"
                                        ? t("UTC Time", "UTC 时间")
                                        : `${t("Local Time", "本地时间")} (${localTzName})`}
                                </span>
                                <span className="font-mono text-xs sm:text-sm text-emerald-300/90 break-all select-all font-medium">
                                    {tsConversion.formatted}
                                </span>
                            </div>
                            <CopyButton text={tsConversion.formatted} />
                        </div>

                        {/* UTC String */}
                        {timeZone !== "utc" && (
                            <div className="rounded-xl bg-black/40 border border-zinc-800 p-3 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <span className="text-xs text-zinc-500 block">UTC (GMT)</span>
                                    <span className="font-mono text-xs sm:text-sm text-zinc-300 break-all select-all">
                                        {tsConversion.utcStr}
                                    </span>
                                </div>
                                <CopyButton text={tsConversion.utcStr} />
                            </div>
                        )}

                        {/* ISO 8601 */}
                        <div className="rounded-xl bg-black/40 border border-zinc-800 p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <span className="text-xs text-zinc-500 block">ISO 8601</span>
                                <span className="font-mono text-xs sm:text-sm text-zinc-300 break-all select-all">
                                    {tsConversion.iso}
                                </span>
                            </div>
                            <CopyButton text={tsConversion.iso} />
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: Date → Timestamp */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <span className="text-white font-semibold text-sm">
                        {t("Human Date → Timestamp", "可读日期 → 时间戳")}
                    </span>
                    <button
                        onClick={setCurrentDateToInput}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3 h-3 text-emerald-400" />
                        {t("Current Time", "填入当前时间")}
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium">
                        {t("Pick or enter date and time", "选择或输入日期时间")} (
                        {timeZone === "utc" ? "UTC" : localTzName})
                    </label>
                    <input
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        step="1"
                        className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs sm:text-sm text-zinc-200"
                    />
                </div>

                {dateConversion && !dateConversion.success && (
                    <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3.5 flex gap-2.5 items-start text-xs text-red-300">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{dateConversion.error}</span>
                    </div>
                )}

                {dateConversion && dateConversion.success && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
                        <div className="rounded-xl bg-black/40 border border-zinc-800 p-3.5 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-zinc-400 block font-medium">
                                    {t("Seconds", "秒")} (s)
                                </span>
                                <span className="font-mono text-base font-bold text-emerald-400">
                                    {dateConversion.sec}
                                </span>
                                <span className="block text-xs text-zinc-500 mt-0.5">
                                    {formatRelativeTime(dateConversion.sec, nowSeconds, t)}
                                </span>
                            </div>
                            <CopyButton text={String(dateConversion.sec)} />
                        </div>

                        <div className="rounded-xl bg-black/40 border border-zinc-800 p-3.5 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-zinc-400 block font-medium">
                                    {t("Milliseconds", "毫秒")} (ms)
                                </span>
                                <span className="font-mono text-base font-bold text-emerald-400">
                                    {dateConversion.ms}
                                </span>
                                <span className="block text-xs text-zinc-500 mt-0.5">
                                    {formatRelativeTime(dateConversion.sec, nowSeconds, t)}
                                </span>
                            </div>
                            <CopyButton text={String(dateConversion.ms)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------
 * Main CodecToolboxTool Component
 * ------------------------------------------------------------------------- */
export function CodecToolboxTool({ defaultTab = "base64" }: { defaultTab?: "base64" | "hash" | "timestamp" } = {}) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"base64" | "hash" | "timestamp">(defaultTab);
    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "codec-toolbox" });
        }
    }, []);

    const tabs: Array<{
        id: "base64" | "hash" | "timestamp";
        name: string;
        icon: React.ReactNode;
    }> = [
        {
            id: "base64",
            name: t("Base64", "Base64 编解码"),
            icon: <Binary className="w-4 h-4" />,
        },
        {
            id: "hash",
            name: t("Hash", "哈希计算"),
            icon: <Hash className="w-4 h-4" />,
        },
        {
            id: "timestamp",
            name: t("Timestamp", "时间戳转换"),
            icon: <Clock3 className="w-4 h-4" />,
        },
    ];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Privacy Banner */}
            <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-4 sm:p-5 flex gap-3 items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                    <p className="text-emerald-300 font-semibold">
                        {t("Your data never leaves this browser.", "数据只在你的浏览器本地处理。")}
                    </p>
                    <p className="text-zinc-400">
                        {t(
                            "Encoding, decoding, hashing, and timestamp conversions happen 100% locally — 0 bytes uploaded to any server. Completely safe for private keys, tokens, and files.",
                            "编解码、哈希计算与时间戳转换均 100% 在本地完成——0 字节上传到任何服务器。安全放心处理私钥、Token 与文件。"
                        )}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-xl bg-zinc-950/80 p-1 border border-zinc-800 gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                isActive
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            {tab.icon}
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Tab View */}
            {activeTab === "base64" && <Base64Tab />}
            {activeTab === "hash" && <HashTab />}
            {activeTab === "timestamp" && <TimestampTab />}

            <LocalTrustNote />
        </div>
    );
}

export default CodecToolboxTool;
