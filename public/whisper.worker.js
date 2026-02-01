
import { pipeline, env } from '/transformers.min.js';

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
            // Upgraded to whisper-base for better quality in Chinese
            this.instance = await pipeline("automatic-speech-recognition", "Xenova/whisper-base", { progress_callback });
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
