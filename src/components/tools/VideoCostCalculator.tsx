"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
    VIDEO_MODELS,
    VideoModelPricing,
    calculateAllModels,
    PRICING_LAST_UPDATED,
} from "@/lib/video-model-pricing";
import {
    Clock,
    Sparkles,
    Check,
    Copy,
    Share2,
    Calendar,
    Flame,
    ExternalLink,
    Layers,
    CheckCircle2,
    Sliders,
    Zap,
    TrendingDown,
    Film,
} from "lucide-react";

const DURATION_PRESETS = [5, 10, 15, 30, 60];
const FPS_OPTIONS = [24, 30, 60];
const RESOLUTION_OPTIONS = [
    { label: "All Resolutions", value: "all" },
    { label: "720p", value: "720p" },
    { label: "768p", value: "768p" },
];

export function VideoCostCalculator() {
    const searchParams = useSearchParams();

    // Initialize from URL params or defaults
    const initialDuration = Math.min(
        60,
        Math.max(1, parseInt(searchParams.get("duration") || "10", 10) || 10)
    );
    const initialFps = FPS_OPTIONS.includes(
        parseInt(searchParams.get("fps") || "24", 10)
    )
        ? parseInt(searchParams.get("fps") || "24", 10)
        : 24;
    const initialModel = searchParams.get("model") || "flux-3-max-720p";
    const initialRes = searchParams.get("resolution") || "all";

    const [duration, setDuration] = useState<number>(initialDuration);
    const [fps, setFps] = useState<number>(initialFps);
    const [selectedResolution, setSelectedResolution] = useState<string>(initialRes);
    const [selectedModelId, setSelectedModelId] = useState<string>(initialModel);
    const [copied, setCopied] = useState<boolean>(false);
    const [now, setNow] = useState<Date>(new Date("2026-10-21T12:00:00Z"));

    useEffect(() => {
        setNow(new Date());
    }, []);

    // Filter models
    const filteredModels = useMemo(() => {
        if (selectedResolution === "all") return VIDEO_MODELS;
        return VIDEO_MODELS.filter((m) => m.resolution === selectedResolution);
    }, [selectedResolution]);

    // Calculate all
    const calculationResults = useMemo(() => {
        return calculateAllModels(filteredModels, duration, fps, now);
    }, [filteredModels, duration, fps, now]);

    // Selected model calculation
    const focusedModelResult = useMemo(() => {
        const found = calculationResults.find((r) => r.model.id === selectedModelId);
        if (found) return found;
        return calculationResults[0] || null;
    }, [calculationResults, selectedModelId]);

    // Synchronize state with URL query parameters
    useEffect(() => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        url.searchParams.set("duration", duration.toString());
        url.searchParams.set("fps", fps.toString());
        if (selectedModelId) url.searchParams.set("model", selectedModelId);
        if (selectedResolution !== "all") {
            url.searchParams.set("resolution", selectedResolution);
        } else {
            url.searchParams.delete("resolution");
        }
        window.history.replaceState({}, "", url.toString());
    }, [duration, fps, selectedModelId, selectedResolution]);

    const handleCopyShareLink = async () => {
        if (typeof window === "undefined") return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
            setCopied(false);
        }
    };

    // FLUX 3 Max promotional countdown calculation
    const fluxModel = VIDEO_MODELS.find((m) => m.id === "flux-3-max-720p");
    const fluxPromoEnd = fluxModel?.promo_until
        ? new Date(`${fluxModel.promo_until}T23:59:59Z`)
        : null;
    const fluxRemainingMs = fluxPromoEnd ? fluxPromoEnd.getTime() - now.getTime() : 0;
    const fluxRemainingDays = Math.max(0, Math.ceil(fluxRemainingMs / (1000 * 60 * 60 * 24)));
    const isFluxPromoActive = fluxRemainingMs > 0;

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Promo Countdown Alert Banner */}
            <div className="w-full rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900/80 p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                            <Flame className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-white text-base sm:text-lg">
                                    FLUX 3 Max Launch Promotion: 75% OFF
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {isFluxPromoActive ? "Active Now" : "Promotion Ended"}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                                {isFluxPromoActive ? (
                                    <>
                                        Special launch rate of{" "}
                                        <strong className="text-amber-400 font-mono">$0.0425/sec</strong>{" "}
                                        (standard rate is{" "}
                                        <span className="line-through text-zinc-400 font-mono">$0.1700/sec</span>
                                        ) valid through{" "}
                                        <span className="text-zinc-200 font-medium">November 7, 2026</span>.
                                    </>
                                ) : (
                                    <>
                                        The 75% launch promo ended on November 7, 2026. Generations are now calculated at the standard{" "}
                                        <span className="font-mono text-zinc-200 font-medium">$0.1700/sec</span> rate.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
                        <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/80 min-w-[120px]">
                            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                                {isFluxPromoActive ? "Time Remaining" : "Status"}
                            </span>
                            <span className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                                {isFluxPromoActive ? `${fluxRemainingDays} Days` : "Standard Rate"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Controls & Single Model Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Parameter Sliders & Toggles (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-7 backdrop-blur-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                        <div className="flex items-center gap-2.5">
                            <Sliders className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                Generation Parameters
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyShareLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 hover:border-zinc-500 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                            title="Share this calculation"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Link Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Share Link</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Duration Slider & Presets */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label htmlFor="duration-slider" className="text-sm font-medium text-zinc-300">
                                Video Duration (seconds)
                            </label>
                            <div className="flex items-center gap-1.5">
                                <input
                                    id="duration-input"
                                    type="number"
                                    min={1}
                                    max={60}
                                    value={duration}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!isNaN(v)) setDuration(Math.min(60, Math.max(1, v)));
                                    }}
                                    className="w-16 px-2.5 py-1 text-right font-mono font-bold text-white bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <span className="text-xs text-zinc-400 font-medium">sec</span>
                            </div>
                        </div>

                        <input
                            id="duration-slider"
                            type="range"
                            min={1}
                            max={60}
                            step={1}
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />

                        {/* Presets */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-xs text-zinc-400">Presets:</span>
                            {DURATION_PRESETS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setDuration(p)}
                                    className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors ${
                                        duration === p
                                            ? "bg-blue-600 text-white font-bold"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}
                                >
                                    {p}s
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frame Rate & Resolution Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Frame Rate */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                                <span>Frame Rate (FPS)</span>
                                <span className="text-xs text-zinc-400 font-mono">
                                    {duration * fps} frames total
                                </span>
                            </label>
                            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                                {FPS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setFps(opt)}
                                        className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            fps === opt
                                                ? "bg-blue-600 text-white shadow"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        }`}
                                    >
                                        {opt} FPS
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-zinc-400">
                                Note: fal endpoints bill purely by output seconds.
                            </p>
                        </div>

                        {/* Resolution Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">
                                Filter Resolution
                            </label>
                            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                                {RESOLUTION_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSelectedResolution(opt.value)}
                                        className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            selectedResolution === opt.value
                                                ? "bg-zinc-700 text-white shadow"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-zinc-400">
                                Showing {filteredModels.length} verified video models.
                            </p>
                        </div>
                    </div>

                    {/* Primary Model Selector */}
                    <div className="space-y-2 pt-2">
                        <label htmlFor="model-select" className="text-sm font-medium text-zinc-300">
                            Inspect Model Breakdown
                        </label>
                        <select
                            id="model-select"
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-medium text-sm focus:outline-none focus:border-blue-500"
                        >
                            {VIDEO_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name} — {m.provider} (${m.promo_price_per_second ?? m.price_per_second}/s)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right Column: Selected Model Deep Breakdown Card (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-6 sm:p-7 backdrop-blur-sm">
                    {focusedModelResult ? (
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                        Estimated Generation Cost
                                    </span>
                                    <h3 className="text-xl font-bold text-white mt-0.5">
                                        {focusedModelResult.model.name}
                                    </h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {focusedModelResult.model.provider} · {focusedModelResult.model.resolution}
                                    </p>
                                </div>
                                {focusedModelResult.isCheapest && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        <TrendingDown className="w-3.5 h-3.5" />
                                        Best Value
                                    </span>
                                )}
                            </div>

                            {/* Prominent Price Display (4 decimals) */}
                            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col items-center text-center">
                                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                                    Total for {duration} seconds
                                </span>
                                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight mt-1">
                                    ${focusedModelResult.totalCost.toFixed(4)}
                                </div>
                                <div className="text-xs text-zinc-400 mt-1.5 flex items-center gap-2">
                                    <span>
                                        Effective rate:{" "}
                                        <strong className="text-zinc-200 font-mono">
                                            ${focusedModelResult.effectiveRate.toFixed(4)}/sec
                                        </strong>
                                    </span>
                                    {focusedModelResult.isPromoActive && (
                                        <span className="text-amber-400 font-semibold">
                                            ({focusedModelResult.savingsPercent}% OFF Promo)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Batch Cost Multipliers */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-[11px] text-zinc-400 uppercase">10 Clips Batch</span>
                                    <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">
                                        ${(focusedModelResult.totalCost * 10).toFixed(4)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-[11px] text-zinc-400 uppercase">100 Production Runs</span>
                                    <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">
                                        ${(focusedModelResult.totalCost * 100).toFixed(4)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-[11px] text-zinc-400 uppercase">Cost Per Minute</span>
                                    <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">
                                        ${focusedModelResult.costPerMinute.toFixed(4)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-[11px] text-zinc-400 uppercase">Cost Per Frame</span>
                                    <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">
                                        ${focusedModelResult.costPerFrame.toFixed(4)}
                                    </div>
                                </div>
                            </div>

                            {/* Official Endpoint Link */}
                            <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80">
                                <span>Verified Rate Source</span>
                                <a
                                    href={focusedModelResult.model.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    <span>Official fal.ai Page</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Section: Multi-Model Comparison Matrix */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Compare AI Video Generation Costs Across Frontier Models
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Calculated side-by-side for a <strong>{duration}-second</strong> output. The lowest-cost option is highlighted.
                        </p>
                    </div>
                    <div className="text-xs text-zinc-400 self-start sm:self-auto flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Rates verified: {PRICING_LAST_UPDATED}</span>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {calculationResults.map((item) => {
                        const isSelected = item.model.id === selectedModelId;
                        return (
                            <div
                                key={item.model.id}
                                onClick={() => setSelectedModelId(item.model.id)}
                                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${
                                    item.isCheapest
                                        ? "border-emerald-500/50 bg-gradient-to-b from-emerald-950/20 to-zinc-900/90 shadow-lg shadow-emerald-950/20"
                                        : isSelected
                                        ? "border-blue-500/50 bg-zinc-900/80 shadow"
                                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
                                }`}
                            >
                                {/* Top Badges */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                                            {item.model.resolution}
                                        </span>
                                        {item.isCheapest ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                <TrendingDown className="w-3 h-3" />
                                                Lowest Cost
                                            </span>
                                        ) : item.isPromoActive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                <Flame className="w-3 h-3" />
                                                75% Launch Promo
                                            </span>
                                        ) : item.isPromoExpired ? (
                                            <span className="text-[11px] text-zinc-400">
                                                Promo ended, calculated at standard rate
                                            </span>
                                        ) : null}
                                    </div>

                                    <h3 className="font-bold text-white text-base sm:text-lg">
                                        {item.model.name}
                                    </h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {item.model.provider}
                                    </p>
                                </div>

                                {/* Cost Block */}
                                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xs text-zinc-400">Total ({duration}s):</span>
                                        <span
                                            className={`text-2xl font-extrabold font-mono ${
                                                item.isCheapest ? "text-emerald-400" : "text-white"
                                            }`}
                                        >
                                            ${item.totalCost.toFixed(4)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span>Unit Rate:</span>
                                        <div className="flex items-center gap-1.5 font-mono">
                                            {item.isPromoActive && (
                                                <span className="line-through text-zinc-400">
                                                    ${item.model.price_per_second.toFixed(4)}
                                                </span>
                                            )}
                                            <span className={item.isPromoActive ? "text-amber-400 font-bold" : "text-zinc-200"}>
                                                ${item.effectiveRate.toFixed(4)}/s
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Status Note */}
                                {item.isPromoActive && item.daysRemaining !== null && (
                                    <div className="text-[11px] text-amber-300/90 bg-amber-950/30 rounded-lg p-2 border border-amber-800/40">
                                        Promo ends in <strong>{item.daysRemaining} days</strong> (Nov 7, 2026). Reverts to standard rate afterwards.
                                    </div>
                                )}
                                {item.isPromoExpired && (
                                    <div className="text-[11px] text-zinc-400 bg-zinc-800/40 rounded-lg p-2 border border-zinc-700/40">
                                        Promo ended, calculated at standard rate ($
                                        {item.model.price_per_second.toFixed(4)}/s).
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        isSelected
                                            ? "bg-blue-600 text-white"
                                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                    }`}
                                >
                                    {isSelected ? "Inspecting" : "Select & Inspect"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Official Model Pricing Reference Table */}
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-sm">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Official AI Video Model Pricing Breakdown (Verified Rates)
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        All rates are verified directly against official provider documentation. Unverified rates (including FLUX 3 Max 1080p) are strictly omitted.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-300 border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                <th className="py-3 px-4">Model & Provider</th>
                                <th className="py-3 px-4">Resolution</th>
                                <th className="py-3 px-4">Standard Rate</th>
                                <th className="py-3 px-4">Promotional Rate</th>
                                <th className="py-3 px-4">Promo Expiry</th>
                                <th className="py-3 px-4">Source Type</th>
                                <th className="py-3 px-4">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                            {VIDEO_MODELS.map((m) => {
                                const isPromo = m.promo_price_per_second !== null;
                                return (
                                    <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3.5 px-4 font-sans font-medium text-white">
                                            <div>{m.name}</div>
                                            <div className="text-[11px] text-zinc-400 font-mono">{m.provider}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-zinc-300">{m.resolution}</td>
                                        <td className="py-3.5 px-4 text-zinc-200">
                                            ${m.price_per_second.toFixed(4)}/s
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {isPromo ? (
                                                <span className="text-amber-400 font-bold">
                                                    ${m.promo_price_per_second!.toFixed(4)}/s (-75%)
                                                </span>
                                            ) : (
                                                <span className="text-zinc-400">None</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {m.promo_until ? (
                                                <span className="text-amber-300">{m.promo_until}</span>
                                            ) : (
                                                <span className="text-zinc-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 font-sans">
                                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Official fal.ai
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-sans">
                                            <a
                                                href={m.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <span>Check Endpoint</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                    <p>
                        <strong className="text-zinc-300">Data Integrity Policy:</strong> FLUX 3 Max 1080p is not listed because its official endpoint pricing has not been published by fal.ai on a dedicated rate card. We refuse to present unverified third-party speculations as official data.
                    </p>
                </div>
            </div>

            {/* Cross-Link Card: YuliusWiki Related Research */}
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-blue-950/30 p-6 sm:p-7 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                            Recommended Reading
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                            In-Depth FLUX 3 Max Benchmark & Architecture Guides
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                            Explore comprehensive real-world benchmarks, architecture comparisons, and prompt tests published on YuliusWiki.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
                    <a
                        href="https://yuliuswiki.com/flux-3-max-pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all group flex flex-col justify-between gap-3"
                    >
                        <div>
                            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
                                <span>Pricing Breakdown</span>
                                <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-blue-400 text-sm transition-colors">
                                FLUX 3 Max Pricing Deep Dive
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                Full breakdown of the 75% launch promo, pay-as-you-go economics, and cost-per-minute analysis.
                            </p>
                        </div>
                        <span className="text-[11px] text-blue-400 font-medium">Read on YuliusWiki →</span>
                    </a>

                    <a
                        href="https://yuliuswiki.com/flux-3-max-vs-seedance-minimax-h3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all group flex flex-col justify-between gap-3"
                    >
                        <div>
                            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
                                <span>Model Comparison</span>
                                <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-blue-400 text-sm transition-colors">
                                FLUX 3 Max vs Seedance vs MiniMax H3
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                Motion fluidity, coherence, lip sync, and render speed compared across frontier engines.
                            </p>
                        </div>
                        <span className="text-[11px] text-blue-400 font-medium">Read on YuliusWiki →</span>
                    </a>

                    <a
                        href="https://yuliuswiki.com/flux-3-vs-flux-3-max"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all group flex flex-col justify-between gap-3"
                    >
                        <div>
                            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
                                <span>Architecture Guide</span>
                                <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-blue-400 text-sm transition-colors">
                                FLUX 3 vs FLUX 3 Max Differences
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                Key differences in latent space conditioning, parameter count, and keyframe-to-video capabilities.
                            </p>
                        </div>
                        <span className="text-[11px] text-blue-400 font-medium">Read on YuliusWiki →</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
