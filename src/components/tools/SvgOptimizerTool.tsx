"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
    Shapes,
    Upload,
    Sparkles,
    Copy,
    Check,
    Download,
    AlertTriangle,
    ShieldAlert,
    Eraser,
    Eye,
    Code2,
    Sliders,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";

export interface OptimizerOptions {
    precision: number;
    removeEditorData: boolean;
    removeComments: boolean;
    removeEmptyGroups: boolean;
    removeEmptyAttrs: boolean;
    removeHidden: boolean;
    removeDataAttrs: boolean;
    removeTitleDesc: boolean;
    removeScripts: boolean;
}

export interface SecurityReport {
    hasScript: boolean;
    hasEventHandlers: boolean;
    hasJavascriptUrl: boolean;
    details: string[];
}

export interface OptimizationResult {
    original: string;
    optimized: string;
    originalBytes: number;
    optimizedBytes: number;
    savedBytes: number;
    savedPercent: number;
    security: SecurityReport;
}

const DEFAULT_OPTIONS: OptimizerOptions = {
    precision: 2,
    removeEditorData: true,
    removeComments: true,
    removeEmptyGroups: true,
    removeEmptyAttrs: true,
    removeHidden: true,
    removeDataAttrs: false,
    removeTitleDesc: false,
    removeScripts: false,
};

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" viewBox="0 0 200.0000 200.0000" width="200.0000" height="200.0000">
  <!-- Generator: Adobe Illustrator 27.0, SVG Export Plug-In -->
  <!-- Inkscape Document Metadata -->
  <sodipodi:namedview id="namedview1" pagecolor="#18181b" bordercolor="#666666" showgrid="false" />
  <metadata id="metadata-core">Created with Illustrator</metadata>
  <defs>
    <linearGradient id="emeraldGrad" x1="0.0000%" y1="0.0000%" x2="100.0000%" y2="100.0000%">
      <stop offset="0.0000%" stop-color="#10b981" stop-opacity="1.0000" />
      <stop offset="100.0000%" stop-color="#047857" stop-opacity="1.0000" />
    </linearGradient>
  </defs>
  <g id="draft_layer_hidden" display="none" inkscape:label="Draft Layer">
    <circle cx="100.0000" cy="100.0000" r="90.0000" fill="#ef4444" opacity="0.5000" />
  </g>
  <g id="empty_layer_group"></g>
  <g id="artwork_main" inkscape:groupmode="layer" inkscape:label="Main Artwork" class="" style="">
    <rect x="20.1234" y="20.5678" width="160.0000" height="160.0000" rx="36.4321" ry="36.4321" fill="url(#emeraldGrad)" stroke="#34d399" stroke-width="2.5000" />
    <path d="M 68.1234 102.5678 L 90.4321 124.9876 L 136.8765 76.5432" fill="none" stroke="#ffffff" stroke-width="12.0000" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="100.0000" cy="100.0000" r="68.4321" fill="none" stroke="#a7f3d0" stroke-width="1.8765" opacity="0.3500" />
  </g>
</svg>`;

const PROTECTED_TAGS = new Set([
    "defs",
    "clippath",
    "mask",
    "pattern",
    "lineargradient",
    "radialgradient",
    "symbol",
    "style",
    "marker",
    "filter",
]);

const NON_NUMERIC_ATTRS = new Set([
    "id",
    "class",
    "style",
    "href",
    "xlink:href",
    "clip-path",
    "mask",
    "filter",
    "xmlns",
    "target",
    "fill",
    "stroke",
    "color",
    "font-family",
    "lang",
    "xml:lang",
    "xml:space",
    "type",
    "media",
]);

const EDITOR_PREFIXES = ["inkscape", "sodipodi", "sketch", "adobe", "i", "ai", "bx", "vectornator"];

function isInsideProtected(el: Element): boolean {
    let curr: Element | null = el.parentElement;
    while (curr) {
        if (PROTECTED_TAGS.has(curr.localName.toLowerCase())) {
            return true;
        }
        curr = curr.parentElement;
    }
    return false;
}

function isElementHidden(el: Element): boolean {
    if (el.localName.toLowerCase() === "svg") return false;
    if (isInsideProtected(el)) return false;

    const display = el.getAttribute("display")?.trim().toLowerCase();
    if (display === "none") return true;

    const visibility = el.getAttribute("visibility")?.trim().toLowerCase();
    if (visibility === "hidden") return true;

    const opacity = el.getAttribute("opacity")?.trim();
    if (opacity && parseFloat(opacity) === 0) return true;

    const style = el.getAttribute("style") || "";
    if (/display\s*:\s*none/i.test(style)) return true;
    if (/visibility\s*:\s*hidden/i.test(style)) return true;
    if (/opacity\s*:\s*0(\.0+)?(?![0-9])/i.test(style)) return true;

    return false;
}

function isEditorElement(el: Element): boolean {
    const localName = el.localName.toLowerCase();
    const prefix = (el.prefix || "").toLowerCase();
    if (EDITOR_PREFIXES.includes(prefix)) return true;
    if (localName === "namedview" || localName === "metadata" || localName === "perspective" || localName === "grid") {
        return true;
    }
    return false;
}

function roundNumericString(str: string, precision: number): string {
    return str.replace(/-?\d*\.\d+(?:[eE][+-]?\d+)?/g, (m) => {
        const n = parseFloat(m);
        if (Number.isNaN(n)) return m;
        if (Math.abs(n) < 10 ** -precision / 2) return "0";
        const fixed = n.toFixed(precision);
        const cleaned = fixed.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
        return cleaned === "-0" ? "0" : cleaned;
    });
}

function detectActiveScripts(svgDoc: Document): SecurityReport {
    const report: SecurityReport = {
        hasScript: false,
        hasEventHandlers: false,
        hasJavascriptUrl: false,
        details: [],
    };

    const scripts = svgDoc.querySelectorAll("script");
    if (scripts.length > 0) {
        report.hasScript = true;
        report.details.push(`Found ${scripts.length} <script> tag${scripts.length > 1 ? "s" : ""}`);
    }

    const allEls = svgDoc.querySelectorAll("*");
    const eventHandlerNames = new Set<string>();
    let jsUrlCount = 0;

    for (const el of allEls) {
        for (let i = 0; i < el.attributes.length; i++) {
            const attr = el.attributes[i];
            const name = attr.name.toLowerCase();
            const val = attr.value.trim().toLowerCase();

            if (name.startsWith("on") && name.length > 2) {
                report.hasEventHandlers = true;
                eventHandlerNames.add(name);
            }

            if (/^\s*javascript\s*:/i.test(val)) {
                report.hasJavascriptUrl = true;
                jsUrlCount++;
            }
        }
    }

    if (eventHandlerNames.size > 0) {
        report.details.push(`Inline event handlers: ${Array.from(eventHandlerNames).join(", ")}`);
    }
    if (jsUrlCount > 0) {
        report.details.push(`Found ${jsUrlCount} javascript: URL${jsUrlCount > 1 ? "s" : ""}`);
    }

    return report;
}

function removeCommentsRecursive(node: Node) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.COMMENT_NODE) {
            node.removeChild(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            removeCommentsRecursive(child);
        }
    }
}

function pruneEmptyGroups(svgEl: Element) {
    let removedAny = true;
    while (removedAny) {
        removedAny = false;
        const groups = svgEl.querySelectorAll("g");
        for (let i = groups.length - 1; i >= 0; i--) {
            const g = groups[i];
            if (g.children.length === 0 && (!g.textContent || g.textContent.trim() === "")) {
                g.remove();
                removedAny = true;
            }
        }
    }
}

function collapseWhitespace(xml: string): string {
    const placeholders: string[] = [];
    let preserved = xml.replace(/<(text|tspan|style)[\s\S]*?<\/\1>/gi, (match) => {
        placeholders.push(match);
        return `___SVG_PRESERVE_${placeholders.length - 1}___`;
    });
    preserved = preserved.replace(/>\s+</g, "><");
    preserved = preserved.replace(/___SVG_PRESERVE_(\d+)___/g, (_, idx) => placeholders[Number(idx)]);
    return preserved.trim();
}

function formatByteSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`;
}

function optimizeSvg(rawSvg: string, options: OptimizerOptions): { result?: OptimizationResult; error?: string } {
    const trimmed = rawSvg.trim();
    if (!trimmed) {
        return { error: "Please enter or upload SVG markup." };
    }

    if (typeof window === "undefined") {
        return { error: "DOMParser is only available in browser." };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");

    const parserError = doc.querySelector("parsererror");
    if (parserError) {
        const errMessage = parserError.textContent || "Invalid XML / SVG markup";
        return { error: errMessage.replace(/Below is a rendering of the page.*$/i, "").trim() };
    }

    const svgEl = doc.querySelector("svg");
    if (!svgEl) {
        return { error: "No root <svg> element found in the provided markup." };
    }

    const security = detectActiveScripts(doc);

    // 1. Comments removal from DOM
    if (options.removeComments) {
        removeCommentsRecursive(doc);
    }

    // 2. Editor elements removal
    if (options.removeEditorData) {
        const allElements = doc.querySelectorAll("*");
        for (let i = allElements.length - 1; i >= 0; i--) {
            const el = allElements[i];
            if (isEditorElement(el)) {
                el.remove();
            }
        }
    }

    // 3. Remove <title> and <desc> if requested
    if (options.removeTitleDesc) {
        const descs = svgEl.querySelectorAll("title, desc");
        descs.forEach((d) => d.remove());
    }

    // 4. Remove scripts if requested
    if (options.removeScripts) {
        const scripts = svgEl.querySelectorAll("script");
        scripts.forEach((s) => s.remove());
    }

    // 5. Remove hidden elements
    if (options.removeHidden) {
        const allElements = svgEl.querySelectorAll("*");
        for (let i = allElements.length - 1; i >= 0; i--) {
            const el = allElements[i];
            if (isElementHidden(el)) {
                el.remove();
            }
        }
    }

    // 6. Clean attributes on all remaining elements
    const elements = svgEl.querySelectorAll("*");
    const allTree = [svgEl, ...Array.from(elements)];

    for (const el of allTree) {
        const toRemove: { name: string; ns: string | null; localName: string }[] = [];
        const toUpdate: { name: string; value: string }[] = [];

        for (let i = 0; i < el.attributes.length; i++) {
            const attr = el.attributes[i];
            const name = attr.name;
            const lowerName = name.toLowerCase();
            const val = attr.value;
            const prefix = (attr.prefix || "").toLowerCase();

            // Strip editor namespaces and editor attributes
            if (options.removeEditorData) {
                if (lowerName.startsWith("xmlns:") && EDITOR_PREFIXES.some((p) => lowerName.startsWith(`xmlns:${p}`))) {
                    toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                    continue;
                }
                if (EDITOR_PREFIXES.includes(prefix) || EDITOR_PREFIXES.some((p) => lowerName.startsWith(`${p}:`))) {
                    toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                    continue;
                }
            }

            // Strip data-* attributes if requested
            if (options.removeDataAttrs && lowerName.startsWith("data-")) {
                toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                continue;
            }

            // Strip scripts / event handlers if requested
            if (options.removeScripts) {
                if (lowerName.startsWith("on") && lowerName.length > 2) {
                    toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                    continue;
                }
                if (/^\s*javascript\s*:/i.test(val)) {
                    toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                    continue;
                }
            }

            // Strip empty attributes if requested
            if (options.removeEmptyAttrs && val.trim() === "") {
                toRemove.push({ name, ns: attr.namespaceURI, localName: attr.localName });
                continue;
            }

            // Round numeric precision
            if (!NON_NUMERIC_ATTRS.has(lowerName) && !lowerName.startsWith("data-")) {
                const rounded = roundNumericString(val, options.precision);
                if (rounded !== val) {
                    toUpdate.push({ name, value: rounded });
                }
            }
        }

        for (const rem of toRemove) {
            el.removeAttribute(rem.name);
            if (rem.ns) {
                try {
                    el.removeAttributeNS(rem.ns, rem.localName);
                } catch {
                    /* ignore namespace mismatch */
                }
            }
        }

        for (const upd of toUpdate) {
            el.setAttribute(upd.name, upd.value);
        }
    }

    // 7. Prune empty groups recursively
    if (options.removeEmptyGroups) {
        pruneEmptyGroups(svgEl);
    }

    // 8. Ensure root SVG has xmlns
    if (!svgEl.getAttribute("xmlns")) {
        svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    // 9. Serialize
    const serializer = new XMLSerializer();
    let optimized = serializer.serializeToString(svgEl);

    // 10. Post-processing
    if (options.removeComments) {
        optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");
    }
    optimized = optimized.replace(/<\?xml[\s\S]*?\?>/gi, "");
    optimized = optimized.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
    optimized = collapseWhitespace(optimized);

    const encoder = new TextEncoder();
    const originalBytes = encoder.encode(trimmed).length;
    const optimizedBytes = encoder.encode(optimized).length;
    const savedBytes = Math.max(0, originalBytes - optimizedBytes);
    const savedPercent = originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0;

    return {
        result: {
            original: trimmed,
            optimized,
            originalBytes,
            optimizedBytes,
            savedBytes,
            savedPercent,
            security,
        },
    };
}

export function SvgOptimizerTool() {
    const { t } = useLanguage();
    const [input, setInput] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [options, setOptions] = useState<OptimizerOptions>(DEFAULT_OPTIONS);
    const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
    const [copied, setCopied] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasTrackedView = useRef(false);
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "svg-optimizer" });
        }
    }, []);

    const prevInputRef = useRef("");
    useEffect(() => {
        if (!input.trim() || input === prevInputRef.current) return;
        const timer = setTimeout(() => {
            prevInputRef.current = input;
            trackToolEvent("process_started", { tool: "svg-optimizer", detail: `precision:${options.precision}` });
            const out = optimizeSvg(input, options);
            if (out.error) {
                trackToolEvent("process_error", { tool: "svg-optimizer", errorCode: "svg_parse_failed" });
            } else {
                trackToolEvent("process_success", { tool: "svg-optimizer" });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [input, options]);

    // Compute optimization output synchronously with useMemo
    const { result, error } = useMemo(() => {
        if (!input.trim() || typeof window === "undefined") {
            return { result: null, error: null };
        }
        const out = optimizeSvg(input, options);
        if (out.error) {
            return { result: null, error: out.error };
        }
        return { result: out.result || null, error: null };
    }, [input, options]);

    // Data URLs for safe sandboxed preview rendering in <img>
    const originalPreviewUrl = useMemo(() => {
        if (!result?.original) return null;
        return `data:image/svg+xml;utf8,${encodeURIComponent(result.original)}`;
    }, [result]);

    const optimizedPreviewUrl = useMemo(() => {
        if (!result?.optimized) return null;
        return `data:image/svg+xml;utf8,${encodeURIComponent(result.optimized)}`;
    }, [result]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "svg-optimizer", detail: "count:1" });
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setInput(content);
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type === "image/svg+xml" || file.name.endsWith(".svg"))) {
            trackToolEvent("file_selected", { tool: "svg-optimizer", detail: "count:1" });
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                if (content) {
                    setInput(content);
                }
            };
            reader.readAsText(file);
        }
    };

    const loadSample = () => {
        setFileName("sample-badge.svg");
        setInput(SAMPLE_SVG);
    };

    const clearAll = () => {
        setInput("");
        setFileName("");
    };

    const copyOptimized = async () => {
        if (!result?.optimized) return;
        try {
            await navigator.clipboard.writeText(result.optimized);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };

    const downloadOptimized = () => {
        if (!result?.optimized) return;
        trackToolEvent("download_clicked", { tool: "svg-optimizer", detail: "format:svg" });
        const blob = new Blob([result.optimized], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const baseName = fileName ? fileName.replace(/\.svg$/i, "") : "vector";
        a.download = `${baseName}.optimized.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Input & Upload Card */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "rounded-2xl bg-zinc-900 border p-4 sm:p-5 transition-colors",
                    isDragging ? "border-emerald-500 bg-emerald-950/10" : "border-zinc-800"
                )}
            >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <label htmlFor="svg-input" className="flex items-center gap-2 text-white font-semibold text-sm">
                        <Shapes className="w-4 h-4 text-emerald-400" />
                        {t("Paste or upload SVG markup", "粘贴或上传 SVG 代码")}
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".svg,image/svg+xml"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            {t("Upload .svg", "上传 .svg 文件")}
                        </button>
                        <button
                            type="button"
                            onClick={loadSample}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {t("Load sample", "加载示例")}
                        </button>
                        {input && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                                <Eraser className="w-3.5 h-3.5" />
                                {t("Clear", "清空")}
                            </button>
                        )}
                    </div>
                </div>

                <textarea
                    id="svg-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t(
                        "Paste raw SVG code here (<svg ...>...</svg>) or drag & drop a .svg file...",
                        "在此粘贴 SVG 代码（<svg ...>...</svg>）或直接拖拽 .svg 文件到此处..."
                    )}
                    spellCheck={false}
                    rows={6}
                    className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 resize-y"
                />

                {fileName && (
                    <p className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t("Loaded file:", "已加载文件:")}</span>
                        <span className="font-mono text-zinc-400">{fileName}</span>
                    </p>
                )}
            </div>

            {/* Optimization Settings Card */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>{t("Optimization Settings", "优化参数配置")}</span>
                </div>

                <div className="space-y-4">
                    {/* Precision Slider */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-zinc-300 font-medium">
                                {t("Decimal coordinate precision", "数值与坐标保留小数位")}
                            </span>
                            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                                {options.precision} {t("decimals", "位小数")}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="1"
                            value={options.precision}
                            onChange={(e) =>
                                setOptions((prev) => ({ ...prev, precision: parseInt(e.target.value, 10) }))
                            }
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                            <span>1 {t("(Aggressive, smallest)", "(激进，极小)")}</span>
                            <span>2 {t("(Recommended, balanced)", "(推荐，均衡)")}</span>
                            <span>3 {t("(Ultra precision)", "(高精度)")}</span>
                        </div>
                    </div>

                    {/* Toggles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeEditorData}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeEditorData: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Strip editor metadata & namespaces", "清除编辑器元数据与命名空间")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Removes Inkscape, Illustrator, Sodipodi, Sketch bloat", "移除 Inkscape、Illustrator 等专有标签与属性")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeComments}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeComments: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Remove XML comments", "清除所有 XML 注释")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Strips <!-- ... --> generator notices and remarks", "删除生成器署名及注释文本")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeEmptyGroups}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeEmptyGroups: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Remove empty <g> groups & empty attrs", "清除空 <g> 分组与空属性")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Prunes empty containers, id=\"\", class=\"\", style=\"\"", "清理无内容的嵌套分组与空样式/类名")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeHidden}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeHidden: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Remove hidden elements", "清除隐藏元素")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Deletes display:none, visibility:hidden, opacity:0 (risk: dynamic toggle)", "删除不可见图层（若通过 JS 动态切换显隐请谨慎开启）")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeTitleDesc}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeTitleDesc: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Remove <title> and <desc> elements", "删除 <title> 与 <desc> 说明标签")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Default off: helps screen readers and accessibility", "默认关闭：保留有利于屏幕阅读器无障碍访问")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={options.removeDataAttrs}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeDataAttrs: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-zinc-200">
                                    {t("Remove data-* custom attributes", "删除 data-* 自定义属性")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Default off: keeps application state or UI library hooks", "默认关闭：保留前端框架绑定的数据属性")}
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors sm:col-span-2">
                            <input
                                type="checkbox"
                                checked={options.removeScripts}
                                onChange={(e) =>
                                    setOptions((prev) => ({ ...prev, removeScripts: e.target.checked }))
                                }
                                className="mt-0.5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <div>
                                <p className="font-medium text-amber-300">
                                    {t("Remove scripts & inline event handlers (safer for embedding)", "清除脚本与事件处理器（网页内联更安全）")}
                                </p>
                                <p className="text-zinc-500 text-[11px] mt-0.5">
                                    {t("Strips <script>, on* (onclick, onload), and javascript: URLs", "移除所有 <script>、onclick、onload 及 javascript: 伪协议")}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <LocalTrustNote />

            {/* Error Message */}
            {error && (
                <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-red-300">{t("Invalid SVG or XML Syntax", "SVG 或 XML 语法解析错误")}</p>
                        <p className="text-red-400/90 font-mono text-xs mt-1 whitespace-pre-wrap break-all">{error}</p>
                    </div>
                </div>
            )}

            {/* Security Warning Alert */}
            {result?.security &&
                (result.security.hasScript ||
                    result.security.hasEventHandlers ||
                    result.security.hasJavascriptUrl) && (
                    <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-4 sm:p-5 flex gap-3 items-start">
                        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1.5 text-sm">
                            <p className="font-semibold text-amber-300">
                                {t(
                                    "Security Notice: Active script content detected",
                                    "安全提示：检测到活动脚本内容"
                                )}
                            </p>
                            <p className="text-zinc-300 text-xs sm:text-sm">
                                {t(
                                    "This SVG contains active script content — it will NOT run in the preview (sandboxed), and you should not embed untrusted SVGs directly in HTML.",
                                    "此 SVG 包含活动脚本或事件处理器——预览中已被沙箱隔离（不会执行）。切勿在网页中直接以 HTML 形式嵌入未经信任的 SVG。"
                                )}
                            </p>
                            <div className="text-xs text-amber-400/90 font-mono space-y-0.5 mt-1">
                                {result.security.details.map((detail, idx) => (
                                    <div key={idx}>• {detail}</div>
                                ))}
                            </div>
                            {!options.removeScripts && (
                                <button
                                    type="button"
                                    onClick={() => setOptions((prev) => ({ ...prev, removeScripts: true }))}
                                    className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    {t("Strip scripts & event handlers now", "立即清除脚本与事件处理器")}
                                </button>
                            )}
                        </div>
                    </div>
                )}

            {/* Results Panel */}
            {result && !error && (
                <div className="space-y-6">
                    {/* Stats Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                {t("Original Size", "原始大小")}
                            </p>
                            <p className="text-2xl font-bold text-white mt-1 font-mono">
                                {formatByteSize(result.originalBytes)}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">{result.originalBytes.toLocaleString()} bytes</p>
                        </div>

                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                {t("Optimized Size", "优化后大小")}
                            </p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                                {formatByteSize(result.optimizedBytes)}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">{result.optimizedBytes.toLocaleString()} bytes</p>
                        </div>

                        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-900/60 p-4 sm:p-5">
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                {t("Total Savings", "缩减比例")}
                            </p>
                            <p className="text-2xl font-bold text-emerald-300 mt-1 font-mono">
                                -{result.savedPercent.toFixed(1)}%
                            </p>
                            <p className="text-xs text-emerald-500/90 mt-1">
                                {t("Saved", "节省了")} {formatByteSize(result.savedBytes)}
                            </p>
                        </div>
                    </div>

                    {/* View Switcher & Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                                    viewMode === "preview"
                                        ? "bg-zinc-800 text-white shadow-sm"
                                        : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                {t("Side-by-side Preview", "前后对比预览")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("code")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                                    viewMode === "code"
                                        ? "bg-zinc-800 text-white shadow-sm"
                                        : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <Code2 className="w-3.5 h-3.5" />
                                {t("Code View", "代码查看")}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={copyOptimized}
                                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">{t("Copied!", "已复制!")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>{t("Copy SVG", "复制 SVG")}</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={downloadOptimized}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>{t("Download .svg", "下载 .svg")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Preview View */}
                    {viewMode === "preview" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Original Preview */}
                            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 font-medium">{t("Original Graphic", "原始图像")}</span>
                                    <span className="font-mono text-zinc-500">{formatByteSize(result.originalBytes)}</span>
                                </div>
                                <div className="p-6 flex-1 flex items-center justify-center min-h-[240px] bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950">
                                    {originalPreviewUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={originalPreviewUrl}
                                            alt="Original SVG preview"
                                            className="max-h-56 max-w-full object-contain select-none"
                                        />
                                    ) : (
                                        <p className="text-xs text-zinc-600">{t("Rendering...", "渲染中...")}</p>
                                    )}
                                </div>
                            </div>

                            {/* Optimized Preview */}
                            <div className="rounded-2xl bg-zinc-900 border border-emerald-900/40 overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs bg-emerald-950/20">
                                    <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                        {t("Optimized Graphic", "优化后图像")}
                                    </span>
                                    <span className="font-mono text-emerald-400 font-semibold">
                                        {formatByteSize(result.optimizedBytes)} (-{result.savedPercent.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex items-center justify-center min-h-[240px] bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950">
                                    {optimizedPreviewUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={optimizedPreviewUrl}
                                            alt="Optimized SVG preview"
                                            className="max-h-56 max-w-full object-contain select-none"
                                        />
                                    ) : (
                                        <p className="text-xs text-zinc-600">{t("Rendering...", "渲染中...")}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Code View */}
                    {viewMode === "code" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Original Code */}
                            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 font-medium">{t("Original Code", "原始代码")}</span>
                                    <span className="font-mono text-zinc-500">{result.originalBytes} B</span>
                                </div>
                                <pre className="p-4 text-xs font-mono text-zinc-400 overflow-auto max-h-96 whitespace-pre-wrap break-all bg-black/40">
                                    {result.original}
                                </pre>
                            </div>

                            {/* Optimized Code */}
                            <div className="rounded-2xl bg-zinc-900 border border-emerald-900/40 overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs bg-emerald-950/20">
                                    <span className="text-emerald-300 font-medium">{t("Optimized Code", "优化后代码")}</span>
                                    <span className="font-mono text-emerald-400">{result.optimizedBytes} B</span>
                                </div>
                                <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-auto max-h-96 whitespace-pre-wrap break-all bg-black/40">
                                    {result.optimized}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
