import { pipeline, env } from '/transformers.min.js';

// ---- 可调配置 ----
// R2 版本化模型目录：升级/更换模型时，把新文件传到新版本目录（如 models/v2/），只改这一处。
// 老 URL 内容永不变化，可放心配长缓存；老版本文件保留一段时间再删（已有打开的旧页面仍在用）。
const MODELS_BASE = "https://assets.zypass.dpdns.org/models/v1/";
// 模型三档（均为 q8 量化版）：tiny 快速/省流量，base 均衡（默认），small 高精度（桌面）
const MODEL_TIERS = {
    tiny: "Xenova/whisper-tiny",
    base: "Xenova/whisper-base",
    small: "Xenova/whisper-small",
};
const DEFAULT_TIER = "base";
// 注意：本站用的 @xenova/transformers v2 默认 quantized=true，
// 即默认加载 *_quantized.onnx（q8 动态量化），R2 上也只有量化版文件。此处显式写出，仅作说明。
const USE_QUANTIZED = true;

// Skip local model checks
// Configure as "local" model to bypass Hugging Face URL structure (resolve/main/...)
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = MODELS_BASE;
env.backends.onnx.wasm.wasmPaths = "https://assets.zypass.dpdns.org/wasm/";

class Whisper {
    static tier = null;
    static instance = null;

    static async getInstance(tier, progress_callback = null) {
        const validTier = MODEL_TIERS[tier] ? tier : DEFAULT_TIER;
        if (this.instance === null || this.tier !== validTier) {
            this.tier = validTier;
            // 存 promise：并发调用复用同一个加载过程
            this.instance = pipeline("automatic-speech-recognition", MODEL_TIERS[validTier], {
                quantized: USE_QUANTIZED,
                progress_callback,
            });
        }
        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const { type, audio, language, model } = event.data;
    const tier = MODEL_TIERS[model] ? model : DEFAULT_TIER;
    const onProgress = (data) => self.postMessage({ type: "progress", data });

    if (type === "load") {
        try {
            await Whisper.getInstance(tier, onProgress);
            self.postMessage({ type: "ready", model: Whisper.tier });
        } catch (error) {
            self.postMessage({ type: "error", error: error.message });
        }
    } else if (type === "transcribe") {
        let transcriber;
        try {
            transcriber = await Whisper.getInstance(tier, onProgress);
        } catch (error) {
            // 所选档位模型文件缺失（如 R2 还没上传）时回退到 base，保证页面不断
            if (tier !== DEFAULT_TIER) {
                self.postMessage({ type: "model_fallback", requested: tier, used: DEFAULT_TIER });
                try {
                    transcriber = await Whisper.getInstance(DEFAULT_TIER, onProgress);
                } catch (e2) {
                    self.postMessage({ type: "error", error: e2.message });
                    return;
                }
            } else {
                self.postMessage({ type: "error", error: error.message });
                return;
            }
        }

        try {
            const output = await transcriber(audio, {
                // Explicitly set task to 'transcribe' to prevent translation to English
                task: 'transcribe',
                language: language === "auto" ? null : language,
                chunk_length_s: 30,
                stride_length_s: 5,
                callback_function: () => {
                    // Send partial results if needed
                }
            });

            self.postMessage({ type: "complete", data: output });
        } catch (error) {
            self.postMessage({ type: "error", error: error.message });
        }
    }
});
