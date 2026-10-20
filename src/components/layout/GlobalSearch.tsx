"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { toolsData, type Tool } from "@/lib/tools-data";

/** Synonyms map: search term → canonical search term that will match a tool */
const SYNONYMS: Record<string, string> = {
    "pdf merge": "merge",
    "merge pdf": "merge",
    "combine pdf": "merge",
    "id card": "id watermark",
    "identity card": "id watermark",
    "heic": "heic to jpg",
    "mov to gif": "video to gif",
    "screen recording": "video to gif",
    "transcribe": "transcription",
    "whois": "domain lookup",
    "watermark": "id watermark",
    "compress gif": "video to gif",
    "9 grid": "grid splitter",
    "nine grid": "grid splitter",
    "background remove": "background remover",
    "remove bg": "background remover",
    "bg remove": "background remover",
};

function normalize(s: string): string {
    return s.toLowerCase().trim();
}

function applysynonyms(query: string): string {
    const q = normalize(query);
    return SYNONYMS[q] ?? q;
}

function scoreTool(tool: Tool, query: string): number {
    if (!query) return 0;
    const q = applysynonyms(query);
    const name = normalize(tool.name.en);
    const desc = normalize(tool.description.en);
    const kws = (tool.keywords ?? []).map(normalize);

    // Exact name match
    if (name === q) return 100;
    // Name starts with query
    if (name.startsWith(q)) return 90;
    // Name contains query
    if (name.includes(q)) return 80;
    // Any keyword exact match
    if (kws.some((k) => k === q)) return 75;
    // Any keyword starts with query
    if (kws.some((k) => k.startsWith(q))) return 65;
    // Any keyword contains query
    if (kws.some((k) => k.includes(q))) return 55;
    // Description contains query
    if (desc.includes(q)) return 30;
    return 0;
}

const ACTIVE_TOOLS = toolsData.filter((t) => !t.comingSoon);

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const results = query.trim()
        ? ACTIVE_TOOLS
            .map((t) => ({ tool: t, score: scoreTool(t, query) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((r) => r.tool)
        : [];

    const openSearch = useCallback(() => {
        setOpen(true);
        setQuery("");
        setSelected(0);
    }, []);

    const closeSearch = useCallback(() => {
        setOpen(false);
        setQuery("");
        setSelected(0);
    }, []);

    const navigate = useCallback((tool: Tool) => {
        closeSearch();
        if (tool.href.startsWith("http")) {
            window.open(tool.href, "_blank", "noopener,noreferrer");
        } else {
            router.push(tool.href);
        }
    }, [closeSearch, router]);

    // Global Cmd+K / Ctrl+K listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                if (open) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
            if (e.key === "Escape" && open) {
                closeSearch();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, openSearch, closeSearch]);

    // Focus input when dialog opens
    useEffect(() => {
        if (open) {
            // Small delay to ensure modal is rendered
            const t = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [open]);

    // Arrow key / Enter navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelected((s) => Math.min(s + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelected((s) => Math.max(s - 1, 0));
        } else if (e.key === "Enter" && results[selected]) {
            navigate(results[selected]);
        }
    };

    return (
        <>
            {/* Trigger button in nav */}
            <button
                onClick={openSearch}
                className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all"
                aria-label="Search tools (Cmd+K)"
            >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search tools</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border border-zinc-700 text-zinc-600">
                    ⌘K
                </kbd>
            </button>

            {/* Search modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search tools"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeSearch}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80 overflow-hidden">
                        {/* Input row */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
                            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelected(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search tools… (heic, pdf merge, watermark, jwt…)"
                                className="flex-1 bg-transparent text-white placeholder-zinc-600 text-sm outline-none"
                            />
                            <button
                                onClick={closeSearch}
                                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                                aria-label="Close search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Results */}
                        {results.length > 0 && (
                            <ul className="py-2 max-h-80 overflow-y-auto">
                                {results.map((tool, i) => (
                                    <li key={tool.id}>
                                        <button
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                i === selected
                                                    ? "bg-zinc-800 text-white"
                                                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                            }`}
                                            onClick={() => navigate(tool)}
                                            onMouseEnter={() => setSelected(i)}
                                        >
                                            <tool.icon className="w-4 h-4 shrink-0 text-zinc-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{tool.name.en}</p>
                                                <p className="text-xs text-zinc-500 truncate mt-0.5">{tool.description.en}</p>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {query.trim() && results.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-zinc-600">
                                No tools found for &ldquo;{query}&rdquo;
                            </p>
                        )}

                        {!query.trim() && (
                            <p className="px-4 py-4 text-xs text-zinc-600 text-center">
                                Type to search across {ACTIVE_TOOLS.length} tools — or press{" "}
                                <kbd className="px-1 py-0.5 rounded border border-zinc-700 font-mono">Esc</kbd> to close
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
