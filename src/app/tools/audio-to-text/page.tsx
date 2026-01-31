"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, FileAudio, Loader2, Copy, Download, Square, Languages } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function AudioToTextPage() {
    const { language } = useLanguage();

    // State
    const [status, setStatus] = useState<"idle" | "loading_model" | "ready" | "processing">("idle");
    const [progress, setProgress] = useState<{ status: string; progress: number } | null>(null);
    const [transcription, setTranscription] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("auto");

    // Refs
    const workerRef = useRef<Worker | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Translations
    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        privacy: { en: "Privacy-First • 100% Local Inference", cn: "隐私优先 • 100% 本地推理" },
        title: { en: "Local AI Audio Transcription", cn: "离线语音转文字" },
        desc: { en: "Transcribe speech to text directly in your browser using OpenAI Whisper. No data leaves your device.", cn: "使用 OpenAI Whisper 模型在浏览器中直接将语音转换为文字。数据绝不上传。" },
        status: {
            idle: { en: "Initialize Model", cn: "加载模型" },
            loading: { en: "Loading Model...", cn: "正在加载模型..." },
            ready: { en: "Ready", cn: "就绪" },
            processing: { en: "Transcribing...", cn: "正在转录..." }
        },
        input: {
            drop: { en: "Drop Audio File Here", cn: "拖放音频文件到此处" },
            drag: { en: "Supports MP3, WAV, M4A", cn: "支持 MP3, WAV, M4A" },
            or: { en: "OR", cn: "或" },
            record: { en: "Start Recording", cn: "开始录音" },
            stop: { en: "Stop Recording", cn: "停止录音" }
        },
        lang: {
            label: { en: "Language", cn: "语言" },
            auto: { en: "Auto Detect", cn: "自动检测" },
            en: { en: "English", cn: "英语" },
            zh: { en: "Chinese", cn: "中文" }
        },
        output: {
            placeholder: { en: "Transcription will appear here...", cn: "转录结果将显示在这里..." },
            copy: { en: "Copy Text", cn: "复制文本" },
            export: { en: "Export TXT", cn: "导出 TXT" }
        }
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // Initialize Worker
        if (!workerRef.current) {
            workerRef.current = new Worker("/whisper.worker.js", { type: "module" });

            workerRef.current.onmessage = (event) => {
                const { type, data, error } = event.data;
                if (type === "progress") {
                    // Check if data has status properties typical for transformers.js
                    // Usually: { status: 'progress', file: '...', progress: 45, ... }
                    // or loading progress
                    if (data.status === "progress" || data.status === "initiate") {
                        // Loading model files
                        setProgress({ status: data.file, progress: data.progress });
                        // setStatus("loading_model"); // Already set by default/effect
                    }
                } else if (type === "ready") {
                    setStatus("ready");
                    setProgress(null);
                } else if (type === "complete") {
                    setTranscription(data.text);
                    setStatus("ready");
                } else if (type === "error") {
                    console.error("Worker error:", error);
                    alert("An error occurred: " + error);
                    setStatus("ready");
                }
            };

            // Start loading model immediately
            setStatus("loading_model");
            workerRef.current.postMessage({ type: "load" });
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const decodeAudio = async (audioBlob: Blob | File) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer.getChannelData(0);
    };

    const startTranscription = async (file: File | Blob) => {
        if (!workerRef.current || status === "loading_model") return;

        try {
            setStatus("processing");
            const audio = await decodeAudio(file);
            workerRef.current.postMessage({
                type: "transcribe",
                audio,
                language: selectedLanguage
            });
        } catch (err) {
            console.error("Decoding error", err);
            alert("Failed to process audio file.");
            setStatus("ready");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setAudioFile(f);
            startTranscription(f);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
                    setAudioFile(file);
                    startTranscription(file);
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Microphone access denied", err);
                alert("Could not access microphone.");
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(transcription);
    };

    const downloadTxt = () => {
        const blob = new Blob([transcription], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transcription-${Date.now()}.txt`;
        a.click();
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <span className="text-zinc-500 font-mono text-xs hidden sm:inline-block">{language === "en" ? t.privacy.en : t.privacy.cn}</span>
            </div>

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {language === "en" ? t.desc.en : t.desc.cn}
                    </p>

                    {/* Progress Bar for Model Loading */}
                    {status === "loading_model" && progress && (
                        <div className="max-w-md mx-auto mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                <span className="truncate max-w-[200px]">{progress.status}</span>
                                <span>{Math.round(progress.progress)}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progress.progress}%` }} />
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 text-center animate-pulse">{language === "en" ? t.status.loading.en : t.status.loading.cn}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-in fade-in slide-in-from-bottom-8">
                    {/* Left: Input */}
                    <div className="space-y-6">
                        {/* File Upload Area */}
                        <div className={cn(
                            "relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group",
                            status === "loading_model" ? "border-zinc-800 bg-zinc-900/20 opacity-50 cursor-not-allowed" : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 cursor-pointer"
                        )}>
                            <input
                                type="file"
                                accept="audio/*"
                                disabled={status === "loading_model"}
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />
                            <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors mb-4 text-zinc-400 group-hover:text-zinc-200">
                                {status === "processing" ? <Loader2 className="w-8 h-8 animate-spin text-emerald-500" /> : <FileAudio className="w-8 h-8" />}
                            </div>
                            {audioFile ? (
                                <p className="text-zinc-200 font-medium truncate max-w-[80%]">{audioFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-zinc-400 font-medium">{language === "en" ? t.input.drop.en : t.input.drop.cn}</p>
                                    <p className="text-xs text-zinc-600 mt-2">{language === "en" ? t.input.drag.en : t.input.drag.cn}</p>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-px bg-zinc-800 flex-1" />
                            <span className="text-xs text-zinc-600 font-medium">{language === "en" ? t.input.or.en : t.input.or.cn}</span>
                            <div className="h-px bg-zinc-800 flex-1" />
                        </div>

                        {/* Recording Button */}
                        <button
                            onClick={toggleRecording}
                            disabled={status === "loading_model" || status === "processing"}
                            className={cn(
                                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                isRecording
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            )}
                        >
                            {isRecording ? (
                                <>
                                    <Square className="w-5 h-5 fill-current" />
                                    {language === "en" ? t.input.stop.en : t.input.stop.cn}
                                </>
                            ) : (
                                <>
                                    <Mic className="w-5 h-5" />
                                    {language === "en" ? t.input.record.en : t.input.record.cn}
                                </>
                            )}
                        </button>

                        {/* Settings */}
                        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <Languages className="w-4 h-4" />
                                {language === "en" ? t.lang.label.en : t.lang.label.cn}
                            </div>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="auto">{language === "en" ? t.lang.auto.en : t.lang.auto.cn}</option>
                                <option value="en">{language === "en" ? t.lang.en.en : t.lang.en.cn}</option>
                                <option value="zh">{language === "en" ? t.lang.zh.en : t.lang.zh.cn}</option>
                            </select>
                        </div>
                    </div>

                    {/* Right: Output */}
                    <div className="flex flex-col h-full min-h-[400px]">
                        <div className="flex-1 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 relative group">
                            {transcription ? (
                                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {transcription}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
                                    {status === "processing" ? (
                                        <div className="flex flex-col items-center animate-pulse">
                                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                                            <p>{language === "en" ? t.status.processing.en : t.status.processing.cn}</p>
                                        </div>
                                    ) : (
                                        <p>{language === "en" ? t.output.placeholder.en : t.output.placeholder.cn}</p>
                                    )}
                                </div>
                            )}

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!transcription}
                                    className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors"
                                    title={language === "en" ? t.output.copy.en : t.output.copy.cn}
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={downloadTxt}
                                    disabled={!transcription}
                                    className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors"
                                    title={language === "en" ? t.output.export.en : t.output.export.cn}
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content Section */}
            <section className="w-full max-w-4xl mt-20 py-10 border-t border-zinc-800">
                <div className="prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">Powered by OpenAI Whisper & WebGPU</h2>
                    <p className="text-zinc-400 mb-6">
                        Experience the power of OpenAI's state-of-the-art speech recognition models running directly in your browser.
                        We use ONNX Runtime and WebAssembly (WASM) to execute the Whisper model on your device's hardware,
                        delivering fast and accurate transcription without server latency.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">Unlimited & Private</h2>
                    <p className="text-zinc-400 mb-6">
                        Because there are no servers involved, there are no limits. Transcribe hours of audio, meetings, or interviews for free.
                        Most importantly, your audio files never leave your computer, guaranteeing 100% privacy for sensitive recordings.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                How accurate is it?
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                We uses the Whisper Tiny/Small models which offer excellent accuracy for English and good performance for 90+ other languages including Chinese.
                            </p>
                        </details>
                        <details className="group bg-zinc-900/50 p-4 rounded-xl cursor-pointer">
                            <summary className="font-medium text-zinc-200 list-none flex items-center justify-between">
                                Support for mobile?
                                <span className="transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-zinc-400 mt-2 text-sm">
                                Yes, but it requires a powerful device. For older phones, we recommend using a desktop computer for faster processing.
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}
