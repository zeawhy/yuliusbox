/**
 * vtracer client runner for YuliusBox Image to SVG converter.
 * Runs vtracer WebAssembly inside a dedicated Web Worker so the main UI thread never stutters.
 * 100% in-browser, privacy-preserving.
 */

export type TracerPresetId = "logo" | "illustration" | "lineart" | "pixelart";

export interface TracerPresetConfig {
    id: TracerPresetId;
    label: {
        en: string;
        cn: string;
    };
    description: {
        en: string;
        cn: string;
    };
    options: {
        preset: "poster" | "photo" | "bw";
        mode: "spline" | "polygon" | "pixel";
        filterSpeckle: number;
        colorPrecision?: number;
        maxColors?: number | null;
        hierarchical?: "stacked" | "cutout";
    };
}

export const TRACER_PRESETS: Record<TracerPresetId, TracerPresetConfig> = {
    logo: {
        id: "logo",
        label: {
            en: "Logo / Icon",
            cn: "徽标 / 图标",
        },
        description: {
            en: "Few colors, crisp sharp edges & smooth bezier curves",
            cn: "纯色几何、边缘锐利、适合矢量 Logo 与扁平图标",
        },
        options: {
            preset: "poster",
            mode: "spline",
            filterSpeckle: 4,
            colorPrecision: 6,
            hierarchical: "stacked",
        },
    },
    illustration: {
        id: "illustration",
        label: {
            en: "Illustration",
            cn: "彩色插画",
        },
        description: {
            en: "Rich color gradients & organic painterly shapes",
            cn: "色彩丰富、图层细腻、适合复杂手绘与数码插画",
        },
        options: {
            preset: "photo",
            mode: "spline",
            filterSpeckle: 4,
            colorPrecision: 7,
            maxColors: 32,
        },
    },
    lineart: {
        id: "lineart",
        label: {
            en: "B&W Line Art",
            cn: "黑白线稿",
        },
        description: {
            en: "High-contrast line drawing with clean compound paths",
            cn: "单色轮廓、素描签名、转为连贯的高保真复合路径",
        },
        options: {
            preset: "bw",
            mode: "spline",
            filterSpeckle: 2,
            hierarchical: "stacked",
        },
    },
    pixelart: {
        id: "pixelart",
        label: {
            en: "Pixel Art",
            cn: "复古像素",
        },
        description: {
            en: "Exact pixel grid preservation without blur or rounding",
            cn: "严格保持像素阶梯网格，无平滑模糊，适合图标与像素图",
        },
        options: {
            preset: "poster",
            mode: "pixel",
            filterSpeckle: 0,
        },
    },
};

export interface TracerCustomOptions {
    presetId: TracerPresetId;
    mode: "spline" | "polygon" | "pixel";
    filterSpeckle: number;
    colorPrecision: number;
    maxColors: number | null; // null for auto
    cornerThreshold: number; // 0..180
    removeBackground: boolean;
    maxWidth?: number;
    maxHeight?: number;
}

export interface TraceProgress {
    phase: "segment" | "compose" | "optimize";
    fraction: number;
    percentage: number;
    label: string;
}

export interface TraceResult {
    svg: string;
    pathCount: number;
    sizeBytes: number;
    durationMs: number;
    originalWidth: number;
    originalHeight: number;
    scaledWidth: number;
    scaledHeight: number;
    wasScaled: boolean;
}

/**
 * Remove full-canvas background rect/path from SVG if requested.
 */
export function stripSvgBackground(svgString: string): string {
    if (!svgString) return svgString;
    // Fast regex matching the base rectangular path starting at 0,0
    const stripped = svgString.replace(/<path\s+d="M\s*0\s*[, ]\s*0[^"]+"[^>]*\/>\s*/i, "");
    if (stripped !== svgString) {
        return stripped;
    }
    // Also remove first <rect width="100%" height="100%" .../> or <rect width="[0-9]+" height="[0-9]+" .../>
    return svgString.replace(/<rect\s+[^>]*fill="[^"]+"[^>]*\/>\s*/i, "");
}

/**
 * Helper to count total <path> and vector elements.
 */
export function countSvgPaths(svgString: string): number {
    const matches = svgString.match(/<path[\s>]/gi);
    return matches ? matches.length : 0;
}

export class VTracerClient {
    private worker: Worker | null = null;
    private nextId = 0;
    private tasks = new Map<
        number,
        {
            resolve: (svg: string) => void;
            reject: (err: Error) => void;
            onProgress?: (progress: TraceProgress) => void;
        }
    >();

    constructor() {
        this.initWorker();
    }

    private initWorker() {
        if (typeof window === "undefined") return;
        try {
            this.worker = new Worker("/wasm/vtracer.worker.js", { type: "module" });

            this.worker.addEventListener("message", (e) => {
                const res = e.data;
                if (!res || typeof res.id !== "number") return;

                const task = this.tasks.get(res.id);
                if (!task) return;

                if (res.type === "progress") {
                    if (task.onProgress) {
                        const phaseNames: Record<string, string> = {
                            segment: "Clustering colors & regions...",
                            compose: "Composing vector shapes...",
                            optimize: "Fitting curves & paths...",
                        };
                        const fraction = Math.min(1, Math.max(0, res.fraction || 0));
                        const pct = Math.round(fraction * 100);
                        task.onProgress({
                            phase: res.phase,
                            fraction,
                            percentage: pct,
                            label: phaseNames[res.phase] || "Processing vector paths...",
                        });
                    }
                    return;
                }

                this.tasks.delete(res.id);

                if (res.type === "success") {
                    task.resolve(res.svg);
                } else {
                    task.reject(new Error(res.error || "VTracer worker execution failed"));
                }
            });

            this.worker.addEventListener("error", (e) => {
                console.error("VTracer worker error event:", e);
                for (const t of this.tasks.values()) {
                    t.reject(new Error("Worker thread failed or crashed."));
                }
                this.tasks.clear();
            });
        } catch (err) {
            console.error("Unable to instantiate VTracer worker:", err);
        }
    }

    public async convertImage(
        fileOrBlob: Blob,
        customOptions: TracerCustomOptions,
        onProgress?: (p: TraceProgress) => void
    ): Promise<TraceResult> {
        if (!this.worker) {
            this.initWorker();
            if (!this.worker) {
                throw new Error("Web Worker could not be created in this browser.");
            }
        }

        const startTime = performance.now();

        // 1. Create ImageBitmap to measure dimensions & prepare zero-copy transfer
        const bitmap = await createImageBitmap(fileOrBlob);
        const originalWidth = bitmap.width;
        const originalHeight = bitmap.height;

        // Auto-downscale if exceeding 4096px
        const MAX_DIM = 4096;
        let scale = 1;
        if (originalWidth > MAX_DIM || originalHeight > MAX_DIM) {
            scale = Math.min(MAX_DIM / originalWidth, MAX_DIM / originalHeight);
        }
        const scaledWidth = Math.round(originalWidth * scale);
        const scaledHeight = Math.round(originalHeight * scale);
        const wasScaled = scale < 1;

        // Build vtracer options
        const presetConf = TRACER_PRESETS[customOptions.presetId];
        const vtracerConfig: Record<string, unknown> = {
            preset: presetConf.options.preset,
            mode: customOptions.mode,
            filterSpeckle: customOptions.filterSpeckle,
            colorPrecision: customOptions.colorPrecision,
            cornerThreshold: customOptions.cornerThreshold,
            hierarchical: presetConf.options.hierarchical ?? "stacked",
        };

        if (customOptions.maxColors !== null && customOptions.maxColors > 0) {
            vtracerConfig.maxColors = customOptions.maxColors;
        }

        const id = ++this.nextId;

        const rawSvg = await new Promise<string>((resolve, reject) => {
            this.tasks.set(id, { resolve, reject, onProgress });

            try {
                this.worker?.postMessage(
                    {
                        id,
                        type: "convert",
                        bitmap,
                        maxWidth: scaledWidth,
                        maxHeight: scaledHeight,
                        options: vtracerConfig,
                        reportProgress: !!onProgress,
                    },
                    [bitmap]
                );
            } catch (err) {
                this.tasks.delete(id);
                bitmap.close();
                reject(err instanceof Error ? err : new Error(String(err)));
            }
        });

        // Background removal post-pass if enabled
        const finalSvg = customOptions.removeBackground ? stripSvgBackground(rawSvg) : rawSvg;
        const durationMs = Math.round(performance.now() - startTime);
        const pathCount = countSvgPaths(finalSvg);
        const sizeBytes = new Blob([finalSvg], { type: "image/svg+xml" }).size;

        return {
            svg: finalSvg,
            pathCount,
            sizeBytes,
            durationMs,
            originalWidth,
            originalHeight,
            scaledWidth,
            scaledHeight,
            wasScaled,
        };
    }

    public terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        for (const t of this.tasks.values()) {
            t.reject(new Error("VTracer client was terminated."));
        }
        this.tasks.clear();
    }
}
