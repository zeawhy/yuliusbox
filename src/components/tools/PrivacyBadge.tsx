"use client";

import { ShieldCheck, Cloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToolComputeStatus, type ComputeStatus } from "@/lib/tool-compute-status";

export interface PrivacyBadgeProps {
    /**
     * Controls the trust mode shown in the badge:
     * - "local": tool runs 100% in the browser — no upload.
     * - "api": tool calls a secure backend API — prompts/files are never stored.
     */
    mode: "local" | "api";
    /**
     * Optional computation / WASM loading status:
     * - "idle": default state before loading model/wasm.
     * - "loading": loading model/wasm with a spinner.
     * - "ready": model/wasm loaded and ready for offline use.
     */
    computeStatus?: ComputeStatus;
    /**
     * Optional tool identifier to automatically sync compute status from the tool
     */
    toolId?: string;
    /**
     * Additional CSS classes for spacing/layout tweaks. The badge is an
     * inline element meant to sit in normal document flow (e.g. in a flex
     * row above the tool) — do not position it absolutely over tool UI.
     */
    className?: string;
}

export function PrivacyBadge({
    mode,
    computeStatus: propComputeStatus,
    toolId,
    className,
}: PrivacyBadgeProps) {
    const subscribedStatus = useToolComputeStatus(toolId, "idle");
    const status = propComputeStatus ?? (toolId ? subscribedStatus : "idle");

    if (mode === "api") {
        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-sky-500/20 bg-sky-500/10 text-sky-400 select-none backdrop-blur-sm",
                    className
                )}
            >
                <Cloud className="w-3 h-3 shrink-0 text-sky-400" />
                <span>via secure API — never stored</span>
            </span>
        );
    }

    // Local mode
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 select-none backdrop-blur-sm",
                className
            )}
        >
            {status === "loading" ? (
                <Loader2 className="w-3 h-3 shrink-0 animate-spin text-emerald-400" />
            ) : (
                <ShieldCheck className="w-3 h-3 shrink-0 text-emerald-400" />
            )}
            <span>
                {status === "ready"
                    ? "Works offline now — try airplane mode ✈️"
                    : "Offline-ready · 0 B uploaded"}
            </span>
        </span>
    );
}

export default PrivacyBadge;
