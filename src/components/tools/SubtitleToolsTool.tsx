"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import {
    Captions,
    FileText,
    Flame,
    ArrowLeftRight,
    Download,
    Copy,
    Check,
    Upload,
    Play,
    Sliders,
    AlertCircle,
    Loader2,
    Sparkles,
    RefreshCw,
    Film,
    X,
    Clock,
    FileCheck2,
    Info,
} from "lucide-react";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { setToolComputeStatus } from "@/lib/tool-compute-status";
import { useLanguage } from "@/context/LanguageContext";
import { cn, formatBytes } from "@/lib/utils";
import { trackToolEvent } from "@/lib/analytics";

export interface SubtitleCue {
    index: number;
    id?: string;
    startMs: number;
    endMs: number;
    startStr: string;
    endStr: string;
    text: string;
    settings?: string;
}

export interface ParseResult {
    format: "srt" | "vtt";
    cues: SubtitleCue[];
    stats: {
        cueCount: number;
        spanFormatted: string;
        speechFormatted: string;
    };
}

const SAMPLE_SRT = `1
00:00:01,000 --> 00:00:04,500
Welcome to YuliusBox Subtitle Tools.

2
00:00:05,200 --> 00:00:09,800
Convert between SRT and WebVTT formats instantly in your browser.

3
00:00:10,500 --> 00:00:15,000
Or burn hardcoded subtitles directly into video with custom fonts!`;

const FONT_URL = "https://unpkg.com/dejavu-fonts-ttf/ttf/DejaVuSans.ttf";
// Noto Sans SC: fallback font for CJK glyphs (DejaVu Sans has no CJK coverage,
// so Chinese subtitles render as boxes without it). Only downloaded when the
// subtitle text actually contains CJK characters.
const CJK_FONT_URL = "https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-sc@0.2.3/NotoSansSC_400Regular.ttf";
const CJK_FONT_FILENAME = "NotoSansSC.ttf";
const CJK_DETECT_RE = /[一-鿿㐀-䶿豈-﫿]/u;

/** Returns true if the text contains any CJK characters (Han, incl. extensions and compatibility). */
export function containsCjk(text: string): boolean {
    return CJK_DETECT_RE.test(text);
}

function formatMs(ms: number, sep: "," | "." | ":" = "."): string {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    const millis = ms % 1000;
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const mmm = String(millis).padStart(3, "0");
    return `${hh}:${mm}:${ss}${sep}${mmm}`;
}

function formatDurationHuman(ms: number): string {
    const totalSecs = Math.round(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

export function detectFormat(text: string): "srt" | "vtt" | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("WEBVTT") || /^WEBVTT(\s|$)/m.test(trimmed)) {
        return "vtt";
    }
    return "srt";
}

export function parseSrt(raw: string): SubtitleCue[] {
    const lines = raw.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("WEBVTT")) {
            throw new Error(`Line ${i + 1}: WEBVTT header found; expected SRT format without WEBVTT`);
        }
    }

    const cues: SubtitleCue[] = [];
    let i = 0;

    while (i < lines.length) {
        while (i < lines.length && lines[i].trim() === "") i++;
        if (i >= lines.length) break;

        const numLine = lines[i];
        const numLineNum = i + 1;
        if (!/^\d+$/.test(numLine.trim())) {
            throw new Error(`Line ${numLineNum}: expected cue number, got '${numLine}'`);
        }
        i++;

        while (i < lines.length && lines[i].trim() === "") i++;
        if (i >= lines.length) {
            throw new Error(`Line ${numLineNum + 1}: expected timestamp range 'HH:MM:SS,mmm --> HH:MM:SS,mmm', got end of file`);
        }

        const tsLine = lines[i];
        const tsLineNum = i + 1;
        const srtTimeRegex = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2}),(\d{3})$/;
        const match = tsLine.trim().match(srtTimeRegex);
        if (!match) {
            throw new Error(`Line ${tsLineNum}: expected timestamp range 'HH:MM:SS,mmm --> HH:MM:SS,mmm', got '${tsLine}'`);
        }

        const [, sH, sM, sS, sMs, eH, eM, eS, eMs] = match;
        const smNum = parseInt(sM, 10);
        const emNum = parseInt(eM, 10);
        const ssNum = parseInt(sS, 10);
        const esNum = parseInt(eS, 10);

        if (smNum > 59) throw new Error(`Line ${tsLineNum}: minutes must be between 00 and 59, got '${sM}'`);
        if (emNum > 59) throw new Error(`Line ${tsLineNum}: minutes must be between 00 and 59, got '${eM}'`);
        if (ssNum > 59) throw new Error(`Line ${tsLineNum}: seconds must be between 00 and 59, got '${sS}'`);
        if (esNum > 59) throw new Error(`Line ${tsLineNum}: seconds must be between 00 and 59, got '${eS}'`);

        const startMs = (parseInt(sH, 10) * 3600 + smNum * 60 + ssNum) * 1000 + parseInt(sMs, 10);
        const endMs = (parseInt(eH, 10) * 3600 + emNum * 60 + esNum) * 1000 + parseInt(eMs, 10);
        const startStr = `${sH}:${sM}:${sS},${sMs}`;
        const endStr = `${eH}:${eM}:${eS},${eMs}`;

        if (startMs >= endMs) {
            throw new Error(`Line ${tsLineNum}: start time (${startStr}) must be before end time (${endStr})`);
        }
        i++;

        const textLines: string[] = [];
        const textLineNum = i + 1;
        while (i < lines.length && lines[i].trim() !== "") {
            textLines.push(lines[i]);
            i++;
        }

        if (textLines.length === 0) {
            throw new Error(`Line ${textLineNum}: expected subtitle text after timestamp`);
        }

        cues.push({
            index: cues.length + 1,
            startMs,
            endMs,
            startStr,
            endStr,
            text: textLines.join("\n"),
        });
    }

    if (cues.length === 0) {
        throw new Error("No subtitle cues found in file");
    }

    return cues;
}

export function parseVtt(raw: string): SubtitleCue[] {
    const lines = raw.split(/\r?\n/);
    let i = 0;

    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length || !lines[i].trim().startsWith("WEBVTT")) {
        const lineNum = i < lines.length ? i + 1 : 1;
        const got = i < lines.length ? lines[i] : "end of file";
        throw new Error(`Line ${lineNum}: VTT file must start with 'WEBVTT', got '${got}'`);
    }
    i++; // skip WEBVTT line

    // Header metadata lines up to first blank line
    while (i < lines.length && lines[i].trim() !== "") {
        i++;
    }

    const cues: SubtitleCue[] = [];

    while (i < lines.length) {
        while (i < lines.length && lines[i].trim() === "") i++;
        if (i >= lines.length) break;

        // Skip NOTE, STYLE, REGION blocks
        if (lines[i].startsWith("NOTE") || lines[i].startsWith("STYLE") || lines[i].startsWith("REGION")) {
            while (i < lines.length && lines[i].trim() !== "") i++;
            continue;
        }

        let cueId: string | undefined;
        let tsLine = lines[i];
        let tsLineNum = i + 1;

        if (!tsLine.includes("-->")) {
            // Optional cue identifier line
            cueId = tsLine.trim();
            i++;
            while (i < lines.length && lines[i].trim() === "") i++;
            if (i >= lines.length) {
                throw new Error(`Line ${tsLineNum + 1}: expected timestamp range 'HH:MM:SS.mmm --> HH:MM:SS.mmm', got end of file`);
            }
            tsLine = lines[i];
            tsLineNum = i + 1;
        }

        // WebVTT timestamp: (HH:)?MM:SS.mmm --> (HH:)?MM:SS.mmm [settings]
        const vttRegex = /^(?:(\d{2}):)?(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(?:(\d{2}):)?(\d{2}):(\d{2})\.(\d{3})(?:[ \t]+(.*))?$/;
        const match = tsLine.trim().match(vttRegex);

        if (!match) {
            throw new Error(`Line ${tsLineNum}: expected timestamp range 'HH:MM:SS.mmm --> HH:MM:SS.mmm', got '${tsLine}'`);
        }

        const [, sH, sM, sS, sMs, eH, eM, eS, eMs, settings] = match;
        const startH = sH ?? "00";
        const endH = eH ?? "00";
        const smNum = parseInt(sM, 10);
        const emNum = parseInt(eM, 10);
        const ssNum = parseInt(sS, 10);
        const esNum = parseInt(eS, 10);

        if (smNum > 59) throw new Error(`Line ${tsLineNum}: minutes must be between 00 and 59, got '${sM}'`);
        if (emNum > 59) throw new Error(`Line ${tsLineNum}: minutes must be between 00 and 59, got '${eM}'`);
        if (ssNum > 59) throw new Error(`Line ${tsLineNum}: seconds must be between 00 and 59, got '${sS}'`);
        if (esNum > 59) throw new Error(`Line ${tsLineNum}: seconds must be between 00 and 59, got '${eS}'`);

        const startMs = (parseInt(startH, 10) * 3600 + smNum * 60 + ssNum) * 1000 + parseInt(sMs, 10);
        const endMs = (parseInt(endH, 10) * 3600 + emNum * 60 + esNum) * 1000 + parseInt(eMs, 10);
        const startStr = `${startH}:${sM}:${sS}.${sMs}`;
        const endStr = `${endH}:${eM}:${eS}.${eMs}`;

        if (startMs >= endMs) {
            throw new Error(`Line ${tsLineNum}: start time (${startStr}) must be before end time (${endStr})`);
        }
        i++;

        const textLines: string[] = [];
        const textLineNum = i + 1;
        while (i < lines.length && lines[i].trim() !== "") {
            textLines.push(lines[i]);
            i++;
        }

        if (textLines.length === 0) {
            throw new Error(`Line ${textLineNum}: expected subtitle text after timestamp`);
        }

        cues.push({
            index: cues.length + 1,
            id: cueId,
            startMs,
            endMs,
            startStr,
            endStr,
            text: textLines.join("\n"),
            settings: settings?.trim(),
        });
    }

    if (cues.length === 0) {
        throw new Error("No subtitle cues found in file");
    }

    return cues;
}

export function cuesToVtt(cues: SubtitleCue[]): string {
    let out = "WEBVTT\n\n";
    cues.forEach((cue, idx) => {
        out += `${idx + 1}\n`;
        out += `${formatMs(cue.startMs, ".")} --> ${formatMs(cue.endMs, ".")}`;
        if (cue.settings) {
            out += ` ${cue.settings}`;
        }
        out += "\n";
        out += `${cue.text}\n\n`;
    });
    return out.trimEnd() + "\n";
}

export function cuesToSrt(cues: SubtitleCue[]): string {
    let out = "";
    cues.forEach((cue, idx) => {
        out += `${idx + 1}\n`;
        out += `${formatMs(cue.startMs, ",")} --> ${formatMs(cue.endMs, ",")}\n`;
        // Strip voice tags or WebVTT-only tags while keeping readable text
        const cleanText = cue.text
            .replace(/<v(?:\.[^>]+)?\s+([^>]+)>/g, "$1: ")
            .replace(/<\/v>/g, "")
            .replace(/<c(?:\.[^>]+)?>|<\/c>/g, "");
        out += `${cleanText}\n\n`;
    });
    return out.trimEnd() + "\n";
}

function computeStats(cues: SubtitleCue[]) {
    const cueCount = cues.length;
    const startMs = cues[0].startMs;
    const endMs = cues[cues.length - 1].endMs;
    const totalSpanMs = Math.max(0, endMs - startMs);
    const speechMs = cues.reduce((sum, c) => sum + (c.endMs - c.startMs), 0);

    return {
        cueCount,
        spanFormatted: `${formatMs(startMs, ":").slice(0, 8)} \u2192 ${formatMs(endMs, ":").slice(0, 8)} (${formatDurationHuman(totalSpanMs)})`,
        speechFormatted: formatDurationHuman(speechMs),
    };
}

export function SubtitleToolsTool() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"converter" | "burn">("converter");

    // ==========================================
    // TAB 1: CONVERTER STATE
    // ==========================================
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [currentFormat, setCurrentFormat] = useState<"srt" | "vtt" | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [stats, setStats] = useState<{
        cueCount: number;
        spanFormatted: string;
        speechFormatted: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const autoDetected = useMemo(() => detectFormat(inputText), [inputText]);

    const hasTrackedView = useRef(false);
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "subtitle-tools" });
        }
    }, []);

    const handleLoadSample = () => {
        setInputText(SAMPLE_SRT);
        setParseError(null);
        setOutputText("");
        setStats(null);
        setCurrentFormat(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "subtitle-tools", detail: "count:1" });
        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target?.result as string;
            setInputText(text);
            setParseError(null);
            setOutputText("");
            setStats(null);
            setCurrentFormat(null);
        };
        reader.readAsText(file);
        // reset input
        e.target.value = "";
    };

    const handleConvertToVtt = () => {
        if (!inputText.trim()) return;
        setParseError(null);
        trackToolEvent("process_started", { tool: "subtitle-tools", detail: "mode:convert_to_vtt" });
        try {
            // Auto-parse: if user entered VTT or SRT, parse accordingly
            const isVtt = autoDetected === "vtt";
            const cues = isVtt ? parseVtt(inputText) : parseSrt(inputText);
            const result = cuesToVtt(cues);
            setOutputText(result);
            setCurrentFormat("vtt");
            setStats(computeStats(cues));
            trackToolEvent("process_success", { tool: "subtitle-tools" });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setParseError(msg);
            setOutputText("");
            setStats(null);
            trackToolEvent("process_error", { tool: "subtitle-tools", errorCode: "parse_vtt_failed" });
        }
    };

    const handleConvertToSrt = () => {
        if (!inputText.trim()) return;
        setParseError(null);
        trackToolEvent("process_started", { tool: "subtitle-tools", detail: "mode:convert_to_srt" });
        try {
            const isVtt = autoDetected === "vtt";
            const cues = isVtt ? parseVtt(inputText) : parseSrt(inputText);
            const result = cuesToSrt(cues);
            setOutputText(result);
            setCurrentFormat("srt");
            setStats(computeStats(cues));
            trackToolEvent("process_success", { tool: "subtitle-tools" });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setParseError(msg);
            setOutputText("");
            setStats(null);
            trackToolEvent("process_error", { tool: "subtitle-tools", errorCode: "parse_srt_failed" });
        }
    };

    const handleCopy = async () => {
        if (!outputText) return;
        try {
            await navigator.clipboard.writeText(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard failed */
        }
    };

    const handleDownloadSub = () => {
        if (!outputText || !currentFormat) return;
        trackToolEvent("download_clicked", { tool: "subtitle-tools", detail: `format:${currentFormat}` });
        const ext = currentFormat === "vtt" ? "vtt" : "srt";
        const mime = currentFormat === "vtt" ? "text/vtt" : "application/x-subrip";
        const blob = new Blob([outputText], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subtitles.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ==========================================
    // TAB 2: BURN INTO VIDEO STATE
    // ==========================================
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [subFile, setSubFile] = useState<File | null>(null);
    const [fontSize, setFontSize] = useState(24);
    const [marginV, setMarginV] = useState(35);
    const [burnProgress, setBurnProgress] = useState(0);
    const [burnStage, setBurnStage] = useState<string | null>(null);
    const [isBurning, setIsBurning] = useState(false);
    const [burnError, setBurnError] = useState<string | null>(null);
    const [burnedVideoUrl, setBurnedVideoUrl] = useState<string | null>(null);
    const [burnedVideoSize, setBurnedVideoSize] = useState<number | null>(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    const ffmpegRef = useRef<FFmpeg | null>(null);
    const cancelRequestedRef = useRef(false);

    const toBlobURL = async (url: string, mimeType: string) => {
        const resp = await fetch(url);
        const buf = await resp.arrayBuffer();
        const blob = new Blob([buf], { type: mimeType });
        return URL.createObjectURL(blob);
    };

    const handleStartBurn = async () => {
        if (!videoFile || !subFile || isBurning) return;

        setIsBurning(true);
        cancelRequestedRef.current = false;
        setBurnProgress(0);
        setBurnError(null);
        setBurnedVideoUrl(null);
        setBurnedVideoSize(null);
        trackToolEvent("process_started", { tool: "subtitle-tools", detail: "mode:burn" });

        // Security check
        if (typeof window !== "undefined" && !window.crossOriginIsolated) {
            trackToolEvent("process_error", { tool: "subtitle-tools", errorCode: "cross_origin_isolation_required" });
            setBurnError(
                t(
                    "SharedArrayBuffer is disabled in this browser context (requires HTTPS and Cross-Origin-Opener-Policy). If running locally, please use localhost or test on a secure HTTPS server.",
                    "当前浏览器环境未启用 SharedArrayBuffer（需 HTTPS 及跨域隔离头）。本地测试请访问 localhost，或部署到 HTTPS 生产环境。"
                )
            );
            setIsBurning(false);
            return;
        }

        try {
            // Lazy FFmpeg load
            if (!ffmpegRef.current) {
                ffmpegRef.current = new FFmpeg();
            }
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on("progress", ({ progress }) => {
                const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
                setBurnProgress(pct);
            });

            if (!ffmpegLoaded) {
                setBurnStage(t("Loading FFmpeg engine (~30MB, cached after first load)...", "正在加载 FFmpeg 引擎（首次约 30MB，后续自动缓存）..."));
                setToolComputeStatus("subtitle-tools", "loading");
                const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
                });
                setFfmpegLoaded(true);
                setToolComputeStatus("subtitle-tools", "ready");
            }

            if (cancelRequestedRef.current) throw new Error("Cancelled by user");

            // Setup subtitle font
            setBurnStage(t("Downloading and configuring subtitle font (DejaVuSans)...", "正在加载并配置字幕字体 (DejaVuSans)..."));
            const fontResp = await fetch(FONT_URL);
            if (!fontResp.ok) {
                throw new Error("Failed to load subtitle font DejaVuSans.ttf from CDN");
            }
            const fontBuf = await fontResp.arrayBuffer();
            await ffmpeg.writeFile("DejaVuSans.ttf", new Uint8Array(fontBuf));

            const fontsConf = '<?xml version="1.0"?><fontconfig><dir>/</dir></fontconfig>';
            await ffmpeg.writeFile("fonts.conf", fontsConf);

            if (cancelRequestedRef.current) throw new Error("Cancelled by user");

            // Read and parse subtitle
            setBurnStage(t("Parsing subtitle track...", "正在解析字幕轨道..."));
            const subContent = await subFile.text();
            let srtContent: string;
            const trimmed = subContent.trim();
            if (trimmed.startsWith("WEBVTT") || subFile.name.toLowerCase().endsWith(".vtt")) {
                const cues = parseVtt(subContent);
                srtContent = cuesToSrt(cues);
            } else {
                const cues = parseSrt(subContent);
                srtContent = cuesToSrt(cues);
            }

            await ffmpeg.writeFile("input_sub.srt", srtContent);

            // CJK fallback font: only downloaded when the subtitle text contains
            // CJK characters. fontconfig (via fonts.conf above, dir=/) picks up
            // both fonts, so libass falls back to Noto Sans SC for glyphs
            // DejaVu Sans doesn't cover. Pure-English flows skip this download.
            if (containsCjk(srtContent)) {
                setBurnStage(t("Downloading CJK subtitle font (NotoSansSC)...", "正在加载中文字幕字体 (NotoSansSC)..."));
                const cjkFontResp = await fetch(CJK_FONT_URL);
                if (!cjkFontResp.ok) {
                    throw new Error("Failed to load CJK subtitle font NotoSansSC.ttf from CDN");
                }
                const cjkFontBuf = await cjkFontResp.arrayBuffer();
                await ffmpeg.writeFile(CJK_FONT_FILENAME, new Uint8Array(cjkFontBuf));
            }

            if (cancelRequestedRef.current) throw new Error("Cancelled by user");

            // Write video file
            setBurnStage(t("Loading video into memory...", "正在将视频装入内存..."));
            await ffmpeg.writeFile("input_video.mp4", await fetchFile(videoFile));

            if (cancelRequestedRef.current) throw new Error("Cancelled by user");

            // Execute FFmpeg burn-in
            setBurnStage(t("Burning subtitles into video (browser re-encoding is intensive)...", "正在将字幕烧录入视频（浏览器本地重编码耗费算力，请耐心等待）..."));

            const vfArg = `subtitles=input_sub.srt:fontsdir=/:force_style='FontSize=${fontSize},MarginV=${marginV}'`;

            let exitCode = await ffmpeg.exec([
                "-i", "input_video.mp4",
                "-vf", vfArg,
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-crf", "23",
                "-c:a", "copy",
                "output.mp4"
            ]);

            if (exitCode !== 0) {
                // Fallback attempt without explicit libx264
                console.warn("libx264 returned non-zero code, attempting default encoder fallback...");
                exitCode = await ffmpeg.exec([
                    "-i", "input_video.mp4",
                    "-vf", vfArg,
                    "-c:a", "copy",
                    "output.mp4"
                ]);
            }

            if (exitCode !== 0) {
                throw new Error(`FFmpeg exited with error code ${exitCode}. Please verify video file format.`);
            }

            setBurnStage(t("Exporting burned MP4 video...", "正在导出烧录后的 MP4 视频..."));
            const data = await ffmpeg.readFile("output.mp4");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blob = new Blob([(data as any).buffer || data], { type: "video/mp4" });
            setBurnedVideoSize(blob.size);
            setBurnedVideoUrl(URL.createObjectURL(blob));
            trackToolEvent("process_success", { tool: "subtitle-tools" });

            // Clean up temporary files
            try {
                await ffmpeg.deleteFile("input_video.mp4");
                await ffmpeg.deleteFile("input_sub.srt");
                await ffmpeg.deleteFile("output.mp4");
            } catch {
                /* non-critical cleanup */
            }
        } catch (err: unknown) {
            console.error("Subtitle burn error:", err);
            trackToolEvent("process_error", { tool: "subtitle-tools", errorCode: "burn_failed" });
            const msg = err instanceof Error ? err.message : String(err);
            setBurnError(msg);

            // Terminate on error so user can retry safely
            if (ffmpegRef.current) {
                try {
                    ffmpegRef.current.terminate();
                } catch {
                    /* ignore */
                }
                ffmpegRef.current = null;
                setFfmpegLoaded(false);
                setToolComputeStatus("subtitle-tools", "idle");
            }
        } finally {
            setIsBurning(false);
            setBurnStage(null);
        }
    };

    const handleCancelBurn = () => {
        cancelRequestedRef.current = true;
        if (ffmpegRef.current) {
            try {
                ffmpegRef.current.terminate();
            } catch {
                /* ignore */
            }
            ffmpegRef.current = null;
            setFfmpegLoaded(false);
            setToolComputeStatus("subtitle-tools", "idle");
        }
        setIsBurning(false);
        setBurnStage(null);
        setBurnProgress(0);
        setBurnError(t("Burning cancelled.", "烧录已取消。"));
    };

    const handleResetBurn = () => {
        setVideoFile(null);
        setSubFile(null);
        setBurnedVideoUrl(null);
        setBurnedVideoSize(null);
        setBurnError(null);
        setBurnProgress(0);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/60 p-1.5 rounded-2xl gap-2">
                <button
                    onClick={() => setActiveTab("converter")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all",
                        activeTab === "converter"
                            ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    )}
                >
                    <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                    <span>{t("SRT \u2194 VTT Converter", "SRT \u2194 VTT 字幕互转")}</span>
                </button>
                <button
                    onClick={() => setActiveTab("burn")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all",
                        activeTab === "burn"
                            ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    )}
                >
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <span>{t("Burn Subtitles into Video", "视频烧录硬字幕")}</span>
                </button>
            </div>

            {/* TAB 1: CONVERTER */}
            {activeTab === "converter" && (
                <div className="flex flex-col gap-6">
                    {/* Input card */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Captions className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-base font-semibold text-white">
                                    {t("Input Subtitles", "输入字幕内容")}
                                </h2>
                                {autoDetected && (
                                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {t(`Detected: ${autoDetected.toUpperCase()}`, `检测到: ${autoDetected.toUpperCase()}`)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLoadSample}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    {t("Load sample", "载入范例")}
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                                >
                                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                    {t("Upload file (.srt, .vtt)", "上传字幕文件")}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".srt,.vtt,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {inputText && (
                                    <button
                                        onClick={() => {
                                            setInputText("");
                                            setOutputText("");
                                            setParseError(null);
                                            setStats(null);
                                        }}
                                        className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                                        title={t("Clear", "清空")}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setParseError(null);
                            }}
                            placeholder={t(
                                "Paste your SRT or WebVTT content here, or upload a subtitle file...",
                                "在此粘贴 SRT 或 WebVTT 字幕文本，或直接上传字幕文件..."
                            )}
                            rows={9}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-xs sm:text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y"
                        />

                        {/* Error message */}
                        {parseError && (
                            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-mono">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <div className="flex-1 break-words">
                                    <p className="font-semibold">{t("Validation Error", "解析校验失败")}:</p>
                                    <p className="mt-0.5">{parseError}</p>
                                </div>
                            </div>
                        )}

                        {/* Convert action buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                                onClick={handleConvertToVtt}
                                disabled={!inputText.trim()}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:opacity-40 disabled:hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                                {t("Convert to VTT", "转换为 VTT")}
                            </button>
                            <button
                                onClick={handleConvertToSrt}
                                disabled={!inputText.trim()}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-40 border border-zinc-700/60 transition-colors"
                            >
                                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                                {t("Convert to SRT", "转换为 SRT")}
                            </button>
                        </div>
                    </div>

                    {/* Output card & Stats */}
                    {outputText && (
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-base font-semibold text-white">
                                        {t(`Converted Output (${currentFormat?.toUpperCase()})`, `转换结果 (${currentFormat?.toUpperCase()})`)}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? t("Copied", "已复制") : t("Copy result", "复制结果")}
                                    </button>
                                    <button
                                        onClick={handleDownloadSub}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        {t(`Download .${currentFormat}`, `下载 .${currentFormat}`)}
                                    </button>
                                </div>
                            </div>

                            {/* Subtitle Stats */}
                            {stats && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500">{t("Total Cues", "字幕总条数")}</span>
                                        <span className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">
                                            {stats.cueCount} {t("cues", "条")}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500">{t("Timeline Span", "时间轴跨度")}</span>
                                        <span className="text-sm font-semibold text-zinc-200 font-mono mt-0.5">
                                            {stats.spanFormatted}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500">{t("Total Speech Duration", "实际语音总时长")}</span>
                                        <span className="text-sm font-semibold text-zinc-200 font-mono mt-0.5">
                                            {stats.speechFormatted}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <textarea
                                readOnly
                                value={outputText}
                                rows={10}
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-xs sm:text-sm font-mono text-emerald-300/90 focus:outline-none resize-y"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: BURN INTO VIDEO */}
            {activeTab === "burn" && (
                <div className="flex flex-col gap-6">
                    {/* File Selection Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Video Input */}
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Film className="w-4 h-4 text-emerald-400" />
                                    {t("1. Video File", "1. 选择视频文件")}
                                </span>
                                {videoFile && (
                                    <span className="text-xs text-zinc-500 font-mono">
                                        {formatBytes(videoFile.size)}
                                    </span>
                                )}
                            </div>

                            <label className={cn(
                                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                                videoFile
                                    ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
                                    : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950"
                            )}>
                                <Film className={cn("w-8 h-8 mb-2", videoFile ? "text-emerald-400" : "text-zinc-500")} />
                                <span className="text-xs sm:text-sm font-medium text-zinc-300 text-center truncate max-w-full px-2">
                                    {videoFile ? videoFile.name : t("Click or drop video (MP4, MOV, WebM)", "点击或拖拽视频文件 (MP4, MOV, WebM)")}
                                </span>
                                <span className="text-[11px] text-zinc-600 mt-1">
                                    {videoFile ? t("Click to change file", "点击更换视频") : t("Recommended: < 100MB for faster browser processing", "建议小于 100MB 以获得更快的网页端处理速度")}
                                </span>
                                <input
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
                                    disabled={isBurning}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            trackToolEvent("file_selected", { tool: "subtitle-tools", detail: "count:1" });
                                            setVideoFile(e.target.files[0]);
                                            setBurnedVideoUrl(null);
                                            setBurnError(null);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Subtitle Input */}
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Captions className="w-4 h-4 text-emerald-400" />
                                    {t("2. Subtitle File (.srt or .vtt)", "2. 选择字幕文件 (.srt 或 .vtt)")}
                                </span>
                                {subFile && (
                                    <span className="text-xs text-zinc-500 font-mono">
                                        {formatBytes(subFile.size)}
                                    </span>
                                )}
                            </div>

                            <label className={cn(
                                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                                subFile
                                    ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
                                    : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950"
                            )}>
                                <Captions className={cn("w-8 h-8 mb-2", subFile ? "text-emerald-400" : "text-zinc-500")} />
                                <span className="text-xs sm:text-sm font-medium text-zinc-300 text-center truncate max-w-full px-2">
                                    {subFile ? subFile.name : t("Click or drop subtitle (.srt, .vtt)", "点击或拖拽字幕文件 (.srt, .vtt)")}
                                </span>
                                <span className="text-[11px] text-zinc-600 mt-1">
                                    {subFile ? t("Click to change file", "点击更换字幕") : t("SRT & WebVTT formats supported", "支持 SRT 及 WebVTT 格式")}
                                </span>
                                <input
                                    type="file"
                                    accept=".srt,.vtt,.txt"
                                    disabled={isBurning}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            trackToolEvent("file_selected", { tool: "subtitle-tools", detail: "count:1" });
                                            setSubFile(e.target.files[0]);
                                            setBurnedVideoUrl(null);
                                            setBurnError(null);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Style Configuration Card */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-5">
                        <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-sm font-semibold text-white">
                                {t("Subtitle Style Settings", "硬字幕外观设置")}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Font Size */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-zinc-400">{t("Font Size (FontSize)", "字体大小 (FontSize)")}</span>
                                    <span className="text-emerald-400 font-mono">{fontSize} px</span>
                                </div>
                                <input
                                    type="range"
                                    min={16}
                                    max={48}
                                    step={1}
                                    value={fontSize}
                                    disabled={isBurning}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                                    <span>16px</span>
                                    <span>24px (default)</span>
                                    <span>48px</span>
                                </div>
                            </div>

                            {/* Bottom Margin */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-zinc-400">{t("Bottom Margin (MarginV)", "底部间距 (MarginV)")}</span>
                                    <span className="text-emerald-400 font-mono">{marginV} px</span>
                                </div>
                                <input
                                    type="range"
                                    min={10}
                                    max={150}
                                    step={5}
                                    value={marginV}
                                    disabled={isBurning}
                                    onChange={(e) => setMarginV(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                                    <span>10px</span>
                                    <span>35px (default)</span>
                                    <span>150px</span>
                                </div>
                            </div>
                        </div>

                        {/* Notice on speed */}
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-400">
                            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p>
                                {t(
                                    "Note: Browser-based subtitle burning re-encodes video locally via WebAssembly. For longer videos (e.g. > 1 minute), encoding may take several minutes depending on CPU performance.",
                                    "说明：网页端烧录字幕基于 WebAssembly 纯本地逐帧重编码。较长视频（超过 1 分钟）因浏览器算力限制可能需耗时数分钟，请耐心等待。"
                                )}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {!isBurning ? (
                                <button
                                    onClick={handleStartBurn}
                                    disabled={!videoFile || !subFile}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:opacity-40 disabled:hover:bg-emerald-500 transition-colors shadow-sm"
                                >
                                    <Flame className="w-4 h-4" />
                                    {t("Start Burn Subtitles", "开始烧录字幕")}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCancelBurn}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    {t("Cancel Processing", "取消烧录")}
                                </button>
                            )}

                            {(videoFile || subFile || burnedVideoUrl) && !isBurning && (
                                <button
                                    onClick={handleResetBurn}
                                    className="px-4 py-3 rounded-xl font-medium text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
                                >
                                    {t("Reset", "重置")}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar & Status */}
                    {isBurning && (
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                    {burnStage || t("Processing...", "处理中...")}
                                </span>
                                <span className="text-emerald-400 font-mono font-bold text-sm">
                                    {burnProgress}%
                                </span>
                            </div>
                            <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                                <div
                                    className="bg-emerald-500 h-2.5 transition-all duration-300 ease-out"
                                    style={{ width: `${burnProgress}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-zinc-500 text-center">
                                {t("Please keep this tab open while encoding completes.", "编码期间请勿关闭或切换掉此浏览器标签页。")}
                            </p>
                        </div>
                    )}

                    {/* Error display */}
                    {burnError && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">{t("Burn-in Failed", "烧录失败")}</p>
                                <p className="mt-1">{burnError}</p>
                            </div>
                        </div>
                    )}

                    {/* Burned Result Player & Download */}
                    {burnedVideoUrl && (
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-base font-semibold text-white">
                                        {t("Subtitled Video Ready!", "字幕烧录完成！")}
                                    </h3>
                                    {burnedVideoSize && (
                                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                                            {formatBytes(burnedVideoSize)}
                                        </span>
                                    )}
                                </div>
                                <a
                                    href={burnedVideoUrl}
                                    download="video-subtitled.mp4"
                                    onClick={() => trackToolEvent("download_clicked", { tool: "subtitle-tools", detail: "format:mp4" })}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    {t("Download Burned MP4", "下载烧录好的 MP4")}
                                </a>
                            </div>

                            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                                <video
                                    src={burnedVideoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Privacy Trust Footer Note */}
            <div className="pt-2">
                <LocalTrustNote />
            </div>
        </div>
    );
}
