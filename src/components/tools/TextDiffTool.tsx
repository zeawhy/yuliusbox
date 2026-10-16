"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
    GitCompare,
    ArrowLeftRight,
    Copy,
    Check,
    Eraser,
    Upload,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    SlidersHorizontal,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";

export type DiffType = "equal" | "added" | "removed";

export interface CharSpan {
    text: string;
    highlight: boolean;
}

export interface DiffLine {
    type: DiffType;
    text: string;
    originalLineNumber?: number;
    modifiedLineNumber?: number;
    charSpans?: CharSpan[];
}

export interface DiffStats {
    added: number;
    removed: number;
    unchanged: number;
    total: number;
}

interface CharDiffResult {
    oldSpans: CharSpan[];
    newSpans: CharSpan[];
}

/**
 * Character-level diff using trimmed LCS on small strings (< 500 chars).
 * Accurately highlights inserted and deleted character spans within paired lines.
 */
function charDiff(
    oldStr: string,
    newStr: string,
    options: { ignoreCase?: boolean } = {}
): CharDiffResult {
    if (oldStr.length > 500 || newStr.length > 500) {
        return {
            oldSpans: [{ text: oldStr, highlight: false }],
            newSpans: [{ text: newStr, highlight: false }],
        };
    }

    const eq = (c1: string, c2: string) =>
        options.ignoreCase ? c1.toLowerCase() === c2.toLowerCase() : c1 === c2;

    const n = oldStr.length;
    const m = newStr.length;

    // Common character prefix
    let p = 0;
    while (p < n && p < m && eq(oldStr[p], newStr[p])) {
        p++;
    }

    // Common character suffix
    let s = 0;
    while (s < n - p && s < m - p && eq(oldStr[n - 1 - s], newStr[m - 1 - s])) {
        s++;
    }

    const midOld = oldStr.slice(p, n - s);
    const midNew = newStr.slice(p, m - s);

    let oldMidSpans: CharSpan[] = [];
    let newMidSpans: CharSpan[] = [];

    if (midOld.length > 0 && midNew.length === 0) {
        oldMidSpans = [{ text: midOld, highlight: true }];
    } else if (midOld.length === 0 && midNew.length > 0) {
        newMidSpans = [{ text: midNew, highlight: true }];
    } else if (midOld.length > 0 && midNew.length > 0) {
        const on = midOld.length;
        const mn = midNew.length;
        const dp = new Int16Array((on + 1) * (mn + 1));
        const idx = (i: number, j: number) => i * (mn + 1) + j;

        for (let i = 0; i < on; i++) {
            for (let j = 0; j < mn; j++) {
                if (eq(midOld[i], midNew[j])) {
                    dp[idx(i + 1, j + 1)] = dp[idx(i, j)] + 1;
                } else {
                    const up = dp[idx(i, j + 1)];
                    const left = dp[idx(i + 1, j)];
                    dp[idx(i + 1, j + 1)] = up >= left ? up : left;
                }
            }
        }

        const oldMatches = new Uint8Array(on);
        const newMatches = new Uint8Array(mn);
        let i = on;
        let j = mn;
        while (i > 0 && j > 0) {
            if (eq(midOld[i - 1], midNew[j - 1])) {
                oldMatches[i - 1] = 1;
                newMatches[j - 1] = 1;
                i--;
                j--;
            } else if (dp[idx(i - 1, j)] >= dp[idx(i, j - 1)]) {
                i--;
            } else {
                j--;
            }
        }

        const build = (str: string, matches: Uint8Array): CharSpan[] => {
            if (!str) return [];
            const spans: CharSpan[] = [];
            let curr = str[0];
            let hl = matches[0] === 0;
            for (let k = 1; k < str.length; k++) {
                const isHl = matches[k] === 0;
                if (isHl === hl) {
                    curr += str[k];
                } else {
                    spans.push({ text: curr, highlight: hl });
                    curr = str[k];
                    hl = isHl;
                }
            }
            spans.push({ text: curr, highlight: hl });
            return spans;
        };

        oldMidSpans = build(midOld, oldMatches);
        newMidSpans = build(midNew, newMatches);
    }

    const merge = (prefix: string, mid: CharSpan[], suffix: string): CharSpan[] => {
        const list: CharSpan[] = [];
        if (prefix) list.push({ text: prefix, highlight: false });
        list.push(...mid);
        if (suffix) list.push({ text: suffix, highlight: false });

        const out: CharSpan[] = [];
        for (const item of list) {
            if (out.length > 0 && out[out.length - 1].highlight === item.highlight) {
                out[out.length - 1].text += item.text;
            } else if (item.text.length > 0) {
                out.push({ ...item });
            }
        }
        return out;
    };

    return {
        oldSpans: merge(oldStr.slice(0, p), oldMidSpans, oldStr.slice(n - s)),
        newSpans: merge(newStr.slice(0, p), newMidSpans, newStr.slice(m - s)),
    };
}

/**
 * Myers O(ND) diff algorithm with common prefix & suffix strip optimization.
 * Computes exact minimal edit script between two arrays of lines.
 */
function computeMyersDiff(
    a: string[],
    b: string[],
    options: { ignoreWhitespace?: boolean; ignoreCase?: boolean } = {}
): DiffLine[] {
    const normalize = (line: string): string => {
        let s = line;
        if (options.ignoreWhitespace) s = s.trim().replace(/\s+/g, " ");
        if (options.ignoreCase) s = s.toLowerCase();
        return s;
    };

    const aKeys = a.map(normalize);
    const bKeys = b.map(normalize);

    const N = a.length;
    const M = b.length;

    if (N === 0 && M === 0) return [];
    if (N === 0) {
        return b.map((line, idx) => ({
            type: "added" as const,
            text: line,
            modifiedLineNumber: idx + 1,
        }));
    }
    if (M === 0) {
        return a.map((line, idx) => ({
            type: "removed" as const,
            text: line,
            originalLineNumber: idx + 1,
        }));
    }

    // Strip common prefix
    let prefix = 0;
    while (prefix < N && prefix < M && aKeys[prefix] === bKeys[prefix]) {
        prefix++;
    }

    // Strip common suffix
    let suffix = 0;
    while (
        suffix < N - prefix &&
        suffix < M - prefix &&
        aKeys[N - 1 - suffix] === bKeys[M - 1 - suffix]
    ) {
        suffix++;
    }

    const midA = a.slice(prefix, N - suffix);
    const midB = b.slice(prefix, M - suffix);
    const midAKeys = aKeys.slice(prefix, N - suffix);
    const midBKeys = bKeys.slice(prefix, M - suffix);
    const midN = midA.length;
    const midM = midB.length;

    let midResult: Array<{ type: DiffType; text: string }> = [];

    if (midN === 0) {
        midResult = midB.map((text) => ({ type: "added" as const, text }));
    } else if (midM === 0) {
        midResult = midA.map((text) => ({ type: "removed" as const, text }));
    } else {
        const MAX = midN + midM;
        const offset = MAX;
        const v = new Int32Array(2 * MAX + 1).fill(-1);
        v[offset + 1] = 0;
        const trace: Int32Array[] = [];

        let finalD = -1;
        // Cap max search depth to 15,000 to keep UI responsive
        const maxD = Math.min(MAX, 15000);

        for (let d = 0; d <= maxD; d++) {
            trace.push(new Int32Array(v));
            for (let k = -d; k <= d; k += 2) {
                let x: number;
                if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
                    x = v[offset + k + 1];
                } else {
                    x = v[offset + k - 1] + 1;
                }
                let y = x - k;
                while (x < midN && y < midM && midAKeys[x] === midBKeys[y]) {
                    x++;
                    y++;
                }
                v[offset + k] = x;
                if (x >= midN && y >= midM) {
                    finalD = d;
                    break;
                }
            }
            if (finalD !== -1) break;
        }

        if (finalD !== -1) {
            // Backtrack path
            let x = midN;
            let y = midM;
            const edits: Array<{ type: DiffType; text: string }> = [];

            for (let d = finalD; d > 0; d--) {
                const vPrev = trace[d];
                const k = x - y;
                const prevK =
                    k === -d || (k !== d && vPrev[offset + k - 1] < vPrev[offset + k + 1])
                        ? k + 1
                        : k - 1;
                const prevX = vPrev[offset + prevK];
                const prevY = prevX - prevK;

                while (
                    x > prevX + (prevK < k ? 1 : 0) &&
                    y > prevY + (prevK > k ? 1 : 0)
                ) {
                    edits.push({ type: "equal", text: midA[x - 1] });
                    x--;
                    y--;
                }

                if (prevK < k) {
                    edits.push({ type: "removed", text: midA[x - 1] });
                    x--;
                } else {
                    edits.push({ type: "added", text: midB[y - 1] });
                    y--;
                }
            }

            while (x > 0 && y > 0) {
                edits.push({ type: "equal", text: midA[x - 1] });
                x--;
                y--;
            }

            edits.reverse();
            midResult = edits;
        } else {
            // Fallback if max search depth reached in pathological cases
            midResult = [
                ...midA.map((text) => ({ type: "removed" as const, text })),
                ...midB.map((text) => ({ type: "added" as const, text })),
            ];
        }
    }

    const rawList: Array<{ type: DiffType; text: string }> = [
        ...a.slice(0, prefix).map((text) => ({ type: "equal" as const, text })),
        ...midResult,
        ...a.slice(N - suffix).map((text) => ({ type: "equal" as const, text })),
    ];

    // Number lines correctly
    let origNum = 1;
    let modNum = 1;
    const numberedLines: DiffLine[] = rawList.map((item) => {
        if (item.type === "equal") {
            return {
                ...item,
                originalLineNumber: origNum++,
                modifiedLineNumber: modNum++,
            };
        } else if (item.type === "removed") {
            return {
                ...item,
                originalLineNumber: origNum++,
            };
        } else {
            return {
                ...item,
                modifiedLineNumber: modNum++,
            };
        }
    });

    // Attach character-level diff spans for adjacent removed/added pairs
    let i = 0;
    while (i < numberedLines.length) {
        if (numberedLines[i].type === "removed") {
            const removedIndices: number[] = [];
            while (i < numberedLines.length && numberedLines[i].type === "removed") {
                removedIndices.push(i);
                i++;
            }
            const addedIndices: number[] = [];
            while (i < numberedLines.length && numberedLines[i].type === "added") {
                addedIndices.push(i);
                i++;
            }

            const pairs = Math.min(removedIndices.length, addedIndices.length);
            for (let p = 0; p < pairs; p++) {
                const rIdx = removedIndices[p];
                const aIdx = addedIndices[p];
                const { oldSpans, newSpans } = charDiff(
                    numberedLines[rIdx].text,
                    numberedLines[aIdx].text,
                    { ignoreCase: options.ignoreCase }
                );
                numberedLines[rIdx].charSpans = oldSpans;
                numberedLines[aIdx].charSpans = newSpans;
            }
        } else {
            i++;
        }
    }

    return numberedLines;
}

const SAMPLE_ORIGINAL = `{
  "name": "yuliusbox-tool",
  "version": "1.0.4",
  "description": "Browser-based developer utilities",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "lucide-react": "^0.300.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "license": "MIT"
}`;

const SAMPLE_MODIFIED = `{
  "name": "yuliusbox-tool",
  "version": "1.1.0",
  "description": "Fast and private browser-based developer utilities",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix"
  },
  "dependencies": {
    "lucide-react": "^0.350.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "license": "Apache-2.0"
}`;

export function TextDiffTool() {
    const { t } = useLanguage();

    const [originalText, setOriginalText] = useState<string>("");
    const [modifiedText, setModifiedText] = useState<string>("");
    const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
    const [ignoreCase, setIgnoreCase] = useState<boolean>(false);

    // Debounced diff state
    const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
    const [isComputing, setIsComputing] = useState<boolean>(false);
    const [copiedDiff, setCopiedDiff] = useState<boolean>(false);

    const fileInputOrigRef = useRef<HTMLInputElement>(null);
    const fileInputModRef = useRef<HTMLInputElement>(null);

    const origLineCount = useMemo(() => {
        if (!originalText) return 0;
        return originalText.split(/\r?\n/).length;
    }, [originalText]);

    const modLineCount = useMemo(() => {
        if (!modifiedText) return 0;
        return modifiedText.split(/\r?\n/).length;
    }, [modifiedText]);

    const totalLines = origLineCount + modLineCount;
    const isOverCap = totalLines > 20000;
    const isLarge = (origLineCount > 5000 || modLineCount > 5000) && !isOverCap;
    const bothEmpty = originalText.trim().length === 0 && modifiedText.trim().length === 0;

    // Debounced computation effect
    useEffect(() => {
        if (bothEmpty || isOverCap) {
            setDiffLines([]);
            setIsComputing(false);
            return;
        }

        setIsComputing(true);
        const timer = setTimeout(() => {
            const a = originalText ? originalText.split(/\r?\n/) : [];
            const b = modifiedText ? modifiedText.split(/\r?\n/) : [];
            const result = computeMyersDiff(a, b, { ignoreWhitespace, ignoreCase });
            setDiffLines(result);
            setIsComputing(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [originalText, modifiedText, ignoreWhitespace, ignoreCase, bothEmpty, isOverCap]);

    // Compute stats
    const stats: DiffStats = useMemo(() => {
        let added = 0;
        let removed = 0;
        let unchanged = 0;
        for (const line of diffLines) {
            if (line.type === "added") added++;
            else if (line.type === "removed") removed++;
            else if (line.type === "equal") unchanged++;
        }
        return { added, removed, unchanged, total: diffLines.length };
    }, [diffLines]);

    const isIdentical =
        !bothEmpty &&
        !isOverCap &&
        !isComputing &&
        stats.added === 0 &&
        stats.removed === 0 &&
        stats.total > 0;

    // Action handlers
    const handleLoadSample = () => {
        setOriginalText(SAMPLE_ORIGINAL);
        setModifiedText(SAMPLE_MODIFIED);
    };

    const handleSwapSides = () => {
        const temp = originalText;
        setOriginalText(modifiedText);
        setModifiedText(temp);
    };

    const handleClearBoth = () => {
        setOriginalText("");
        setModifiedText("");
        setDiffLines([]);
    };

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: "orig" | "mod"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (typeof content === "string") {
                if (side === "orig") {
                    setOriginalText(content);
                } else {
                    setModifiedText(content);
                }
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const handleCopyDiff = async () => {
        if (diffLines.length === 0) return;
        const unified = diffLines
            .map((line) => {
                const prefix =
                    line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
                return `${prefix}${line.text}`;
            })
            .join("\n");

        try {
            await navigator.clipboard.writeText(unified);
            setCopiedDiff(true);
            setTimeout(() => setCopiedDiff(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleLoadSample}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
                        title={t("Load sample comparison", "加载示例对比")}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        {t("Load Sample", "加载示例")}
                    </button>
                    <button
                        onClick={handleSwapSides}
                        disabled={bothEmpty}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title={t("Swap original and modified text", "对调左右文本")}
                    >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        {t("Swap Sides", "交换两侧")}
                    </button>
                    <button
                        onClick={handleClearBoth}
                        disabled={bothEmpty}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title={t("Clear both inputs", "清空两侧内容")}
                    >
                        <Eraser className="w-3.5 h-3.5" />
                        {t("Clear Both", "清空全部")}
                    </button>
                </div>

                {/* Diff Options */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                        <input
                            type="checkbox"
                            checked={ignoreWhitespace}
                            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                        />
                        <span>{t("Ignore Whitespace", "忽略空白差异")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                        <input
                            type="checkbox"
                            checked={ignoreCase}
                            onChange={(e) => setIgnoreCase(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                        />
                        <span>{t("Ignore Case", "忽略大小写")}</span>
                    </label>
                </div>
            </div>

            {/* Warning or Cap Banners */}
            {isOverCap && (
                <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/60 text-red-300 rounded-xl p-4 text-sm">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                        <p className="font-semibold text-red-200">
                            {t("Input Too Large (> 20,000 lines)", "文本过大（超过 20,000 行）")}
                        </p>
                        <p className="text-xs text-red-300/90 mt-0.5">
                            {t(
                                "Total input exceeds 20,000 lines. Please split your files into smaller chunks for optimal in-browser diff performance.",
                                "两侧总行数超过 20,000 行。为保证浏览器响应流畅，请将文件拆分为较小片段分别对比。"
                            )}
                        </p>
                    </div>
                </div>
            )}

            {isLarge && (
                <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-800/60 text-amber-300 rounded-xl p-4 text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                        <p className="font-semibold text-amber-200">
                            {t("Large Input Warning", "大量文本提示")}
                        </p>
                        <p className="text-xs text-amber-300/90 mt-0.5">
                            {t(
                                "Input contains over 5,000 lines — diff computation may take a moment.",
                                "单侧输入超过 5,000 行——Diff 对比计算可能需要少许时间。"
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Input Panels (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Original Text */}
                <div className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-1 border-b border-zinc-800/60">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                                {t("Original (Left / Old)", "原始内容（左 / 旧版本）")}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>
                                {origLineCount} {t("lines", "行")} · {originalText.length} {t("chars", "字符")}
                            </span>
                            <button
                                onClick={() => fileInputOrigRef.current?.click()}
                                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                                title={t("Upload text file", "上传文本文件")}
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{t("Upload", "上传")}</span>
                            </button>
                            <input
                                ref={fileInputOrigRef}
                                type="file"
                                accept=".txt,.md,.json,.log,.csv,.js,.jsx,.ts,.tsx,.html,.css,.xml,.yml,.yaml,.py,.sh,text/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "orig")}
                            />
                        </div>
                    </div>
                    <textarea
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        placeholder={t(
                            "Paste original text or upload file here...",
                            "在此粘贴原始内容或上传文件..."
                        )}
                        className="w-full h-56 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-y leading-relaxed"
                        spellCheck={false}
                    />
                </div>

                {/* Right: Modified Text */}
                <div className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-1 border-b border-zinc-800/60">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                                {t("Modified (Right / New)", "修改后文本（右 / 新版本）")}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>
                                {modLineCount} {t("lines", "行")} · {modifiedText.length} {t("chars", "字符")}
                            </span>
                            <button
                                onClick={() => fileInputModRef.current?.click()}
                                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                                title={t("Upload text file", "上传文本文件")}
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{t("Upload", "上传")}</span>
                            </button>
                            <input
                                ref={fileInputModRef}
                                type="file"
                                accept=".txt,.md,.json,.log,.csv,.js,.jsx,.ts,.tsx,.html,.css,.xml,.yml,.yaml,.py,.sh,text/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "mod")}
                            />
                        </div>
                    </div>
                    <textarea
                        value={modifiedText}
                        onChange={(e) => setModifiedText(e.target.value)}
                        placeholder={t(
                            "Paste modified text or upload file here...",
                            "在此粘贴修改后文本或上传文件..."
                        )}
                        className="w-full h-56 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-y leading-relaxed"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                {/* Stats and Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <GitCompare className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-base font-semibold text-white">
                                {t("Diff Comparison", "Diff 对比结果")}
                            </h2>
                        </div>

                        {!bothEmpty && !isOverCap && (
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold">
                                    +{stats.added} {t("added", "新增")}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/40 font-semibold">
                                    -{stats.removed} {t("removed", "删除")}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                                    {stats.unchanged} {t("unchanged", "未变")}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isComputing && (
                            <span className="text-xs text-zinc-400 animate-pulse">
                                {t("Computing diff...", "正在计算 Diff...")}
                            </span>
                        )}
                        <button
                            onClick={handleCopyDiff}
                            disabled={diffLines.length === 0}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            title={t("Copy diff as unified patch format (+/-)", "复制为统一 Patch 格式 (+/-)")}
                        >
                            {copiedDiff ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    {t("Copied!", "已复制！")}
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    {t("Copy Diff Result", "复制 Diff 结果")}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Diff Viewer Body */}
                {bothEmpty ? (
                    <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center justify-center gap-3">
                        <FileText className="w-10 h-10 text-zinc-700 stroke-[1.5]" />
                        <p>
                            {t(
                                "Paste or upload text in the left and right panels to compare differences.",
                                "在左右两侧粘贴或上传文本，即可自动对比差异。"
                            )}
                        </p>
                        <button
                            onClick={handleLoadSample}
                            className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                        >
                            {t("Or load a sample snippet to try it out", "或加载示例体验")}
                        </button>
                    </div>
                ) : isIdentical ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-base font-semibold text-emerald-400">
                            {t("Texts are identical", "两段文本完全一致")}
                        </p>
                        <p className="text-xs text-zinc-400 max-w-md">
                            {t(
                                "No line or character differences were detected between the original and modified texts.",
                                "原始内容与修改后文本之间没有检测到任何行或字符级差异。"
                            )}
                        </p>
                    </div>
                ) : isOverCap ? (
                    <div className="py-12 text-center text-zinc-500 text-sm">
                        {t(
                            "Diff paused due to file size cap. Please reduce input size to view diff.",
                            "由于文件行数超过上限，已暂停对比。请缩减文本后查看。"
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/90 font-mono text-xs sm:text-sm">
                        {/* Table Header */}
                        <div className="flex items-center text-xs text-zinc-500 bg-zinc-900/90 border-b border-zinc-800 select-none py-1.5 font-semibold">
                            <span className="w-10 sm:w-14 text-right pr-2 shrink-0">
                                {t("Orig", "原行")}
                            </span>
                            <span className="w-10 sm:w-14 text-right pr-2 shrink-0 border-r border-zinc-800">
                                {t("Mod", "新行")}
                            </span>
                            <span className="w-6 text-center shrink-0">±</span>
                            <span className="flex-1 px-2">{t("Content", "文本内容")}</span>
                        </div>

                        {/* Unified Diff Line Rows */}
                        <div className="divide-y divide-zinc-900/30">
                            {diffLines.map((line, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-start leading-relaxed transition-colors",
                                        line.type === "added" &&
                                            "bg-emerald-950/35 border-l-2 border-l-emerald-500 text-emerald-200 hover:bg-emerald-950/50",
                                        line.type === "removed" &&
                                            "bg-red-950/35 border-l-2 border-l-red-500 text-red-200 hover:bg-red-950/50",
                                        line.type === "equal" &&
                                            "text-zinc-300 hover:bg-zinc-900/40 border-l-2 border-l-transparent"
                                    )}
                                >
                                    {/* Original Line Number */}
                                    <span className="w-10 sm:w-14 select-none text-right pr-2 text-zinc-600 text-xs shrink-0 pt-0.5 font-mono">
                                        {line.originalLineNumber ?? ""}
                                    </span>
                                    {/* Modified Line Number */}
                                    <span className="w-10 sm:w-14 select-none text-right pr-2 text-zinc-600 text-xs shrink-0 border-r border-zinc-800/80 pt-0.5 font-mono">
                                        {line.modifiedLineNumber ?? ""}
                                    </span>
                                    {/* +/- Marker */}
                                    <span
                                        className={cn(
                                            "w-6 select-none text-center text-xs shrink-0 font-bold pt-0.5 font-mono",
                                            line.type === "added" && "text-emerald-400",
                                            line.type === "removed" && "text-red-400",
                                            line.type === "equal" && "text-zinc-700"
                                        )}
                                    >
                                        {line.type === "added"
                                            ? "+"
                                            : line.type === "removed"
                                            ? "-"
                                            : " "}
                                    </span>
                                    {/* Line Text Content */}
                                    <div className="flex-1 whitespace-pre-wrap break-all px-2 py-0.5">
                                        {line.charSpans && line.charSpans.length > 0 ? (
                                            line.charSpans.map((span, sIdx) =>
                                                span.highlight ? (
                                                    <span
                                                        key={sIdx}
                                                        className={cn(
                                                            "rounded px-0.5 font-semibold",
                                                            line.type === "added"
                                                                ? "bg-emerald-500/30 text-emerald-100 underline decoration-emerald-400/60"
                                                                : "bg-red-500/30 text-red-100 line-through decoration-red-400/60"
                                                        )}
                                                    >
                                                        {span.text || "\u00A0"}
                                                    </span>
                                                ) : (
                                                    <span key={sIdx}>{span.text || "\u00A0"}</span>
                                                )
                                            )
                                        ) : (
                                            <span>{line.text || "\u00A0"}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <LocalTrustNote />
        </div>
    );
}
