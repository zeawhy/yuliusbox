
import { pipeline, env } from '/transformers.min.js';

// ---- 可调配置 ----
// 模型三档（切换需 R2 上有对应目录）：
//   "Xenova/whisper-tiny"  ~40MB  手机/省流量档（中文错误率明显更高，不建议做默认）
//   "Xenova/whisper-base"  ~75MB  当前默认
//   "Xenova/whisper-small" ~244MB 高精度档（建议用 *_quantized 量化版）
const MODEL_ID = "Xenova/whisper-base";
// 注意：本站用的 @xenova/transformers v2 默认 quantized=true，
// 即默认加载 *_quantized.onnx（q8 动态量化），R2 上也只有量化版文件。此处显式写出，仅作说明。
const USE_QUANTIZED = true;

// Skip local model checks
// Configure as "local" model to bypass Hugging Face URL structure (resolve/main/...)
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = "https://assets.zypass.dpdns.org/";
env.backends.onnx.wasm.wasmPaths = "https://assets.zypass.dpdns.org/wasm/";

class Whisper {
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            // whisper-base q8：在中文质量和体积/速度之间折中；tiny 中文错误率明显更高，不建议做默认
            this.instance = await pipeline("automatic-speech-recognition", MODEL_ID, { quantized: USE_QUANTIZED, progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const { type, audio, language } = event.data;

    if (type === "load") {
        try {
            await Whisper.getInstance((data) => {
                self.postMessage({ type: "progress", data });
            });
            self.postMessage({ type: "ready" });
        } catch (error) {
            self.postMessage({ type: "error", error: error.message });
        }
    } else if (type === "transcribe") {
        try {
            const transcriber = await Whisper.getInstance();

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
