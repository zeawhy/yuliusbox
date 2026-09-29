"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, FileAudio, Loader2, Copy, Download, Square, Languages, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function AudioToTextTool() {
    // State
    const [status, setStatus] = useState<"idle" | "loading_model" | "ready" | "processing">("idle");
    const [progress, setProgress] = useState<{ status: string; progress: number } | null>(null);
    const [transcription, setTranscription] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    // Default language: prefer the user's last choice, else infer from the browser language
    // (auto-detect misfires easily on short clips)
    const getInitialLang = () => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("yuliusbox-audio-lang");
            if (saved) return saved;
            const nav = (navigator.language || "").toLowerCase();
            if (nav.startsWith("zh")) return "zh";
            if (nav.startsWith("en")) return "en";
        }
        return "auto";
    };
    const [selectedLanguage, setSelectedLanguage] = useState<string>(getInitialLang);
    const [shortWarn, setShortWarn] = useState<string | null>(null);
    // Model tiers: tiny = fast / base = balanced (default) / small = high accuracy; remembers user choice
    const TIER_LABEL: Record<string, string> = { tiny: "Fast", base: "Balanced", small: "High accuracy" };
    const [modelTier, setModelTier] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("yuliusbox-audio-model") || "base";
        }
        return "base";
    });
    const [modelNotice, setModelNotice] = useState<string | null>(null);

    // Refs
    const workerRef = useRef<Worker | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordStartRef = useRef<number>(0);
    const audioChunksRef = useRef<Blob[]>([]);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // Initialize Worker
        if (!workerRef.current) {
            workerRef.current = new Worker("/whisper.worker.js?v=models_v1_tiers", { type: "module" });

            workerRef.current.onmessage = (event) => {
                const { type, data, error, requested, used } = event.data;
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
                } else if (type === "model_fallback") {
                    setModelNotice(`The "${TIER_LABEL[requested] || requested}" model files are not uploaded yet — fell back to "${TIER_LABEL[used] || used}" for this transcription.`);
                } else if (type === "error") {
                    console.error("Worker error:", error);
                    alert("An error occurred: " + error);
                    setStatus("ready");
                }
            };

            // Start loading model immediately (with user's saved tier)
            setStatus("loading_model");
            workerRef.current.postMessage({ type: "load", model: modelTier });
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // Simple energy VAD: trim leading/trailing silence (keep ~250ms margin on each side),
    // reducing hallucinations on silent segments;
    // if the effective speech is shorter than 0.5s, don't trim, to avoid hurting very short clips
    const trimSilence = (data: Float32Array, sampleRate = 16000): Float32Array => {
        const margin = Math.floor(sampleRate * 0.25);
        const win = Math.floor(sampleRate * 0.02);
        const threshold = 0.02;
        const active = (start: number) => {
            const end = Math.min(start + win, data.length);
            let sum = 0;
            for (let i = start; i < end; i++) sum += Math.abs(data[i]);
            return sum / (end - start) > threshold;
        };
        let s = 0;
        while (s + win < data.length && !active(s)) s += win;
        let e = data.length;
        while (e - win > s && !active(e - win)) e -= win;
        s = Math.max(0, s - margin);
        e = Math.min(data.length, e + margin);
        if (e - s < sampleRate * 0.5) return data;
        return data.slice(s, e);
    };

    const decodeAudio = async (audioBlob: Blob | File) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return trimSilence(audioBuffer.getChannelData(0));
    };

    const startTranscription = async (file: File | Blob) => {
        if (!workerRef.current || status === "loading_model") return;

        try {
            setStatus("processing");
            const audio = await decodeAudio(file);
            workerRef.current.postMessage({
                type: "transcribe",
                audio,
                language: selectedLanguage,
                model: modelTier
            });
        } catch (err) {
            console.error("Decoding error", err);
            alert("Failed to process audio file.");
            setStatus("ready");
        }
    };

    const changeTier = (tier: string) => {
        if (tier === modelTier || !workerRef.current || status === "loading_model" || status === "processing") return;
        setModelTier(tier);
        try { localStorage.setItem("yuliusbox-audio-model", tier); } catch { /* ignore */ }
        setModelNotice(null);
        setProgress(null);
        setStatus("loading_model");
        workerRef.current.postMessage({ type: "load", model: tier });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setAudioFile(f);
            setShortWarn(null);
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
                    const durSec = (Date.now() - recordStartRef.current) / 1000;
                    // Label with the recorder's actual output format instead of hardcoding audio/wav
                    const mimeType = mediaRecorder.mimeType || "audio/webm";
                    const ext = mimeType.includes("mp4") ? "m4a" : mimeType.includes("wav") ? "wav" : "webm";
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    const file = new File([audioBlob], `recording.${ext}`, { type: mimeType });
                    setAudioFile(file);
                    if (durSec < 3) {
                        setShortWarn(`Recording is only ${durSec.toFixed(1)}s: very short clips transcribe poorly. Try speaking one complete sentence for much better accuracy.`);
                    } else {
                        setShortWarn(null);
                    }
                    startTranscription(file);
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                recordStartRef.current = Date.now();
                setShortWarn(null);
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
        <div className="w-full flex flex-col gap-8">
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
                    <p className="text-xs text-zinc-500 mt-2 text-center animate-pulse">Loading Model...</p>
                </div>
            )}

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
                                <p className="text-zinc-400 font-medium">Drop Audio File Here</p>
                                <p className="text-xs text-zinc-600 mt-2">Supports MP3, WAV, M4A</p>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <span className="text-xs text-zinc-600 font-medium">OR</span>
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
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic className="w-5 h-5" />
                                Start Recording
                            </>
                        )}
                    </button>

                    {/* Model tier */}
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                            <Cpu className="w-4 h-4" />
                            Model
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {["tiny", "base", "small"].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => changeTier(id)}
                                    disabled={status === "loading_model" || status === "processing"}
                                    className={cn(
                                        "rounded-lg border px-2 py-2 text-center transition-all disabled:opacity-50",
                                        modelTier === id
                                            ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                                    )}
                                >
                                    <div className="text-sm font-medium">{TIER_LABEL[id]}</div>
                                    <div className="text-[11px] text-zinc-500 font-mono">{id}</div>
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-2">
                            &quot;Balanced by default. Fast saves data, Accurate is best on desktop.&quot;
                        </p>
                        {modelNotice && (
                            <p className="text-xs text-amber-400 mt-2">{modelNotice}</p>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Languages className="w-4 h-4" />
                            Language
                        </div>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                try { localStorage.setItem("yuliusbox-audio-lang", e.target.value); } catch { /* ignore */ }
                            }}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="auto">Auto Detect</option>
                            <option value="en">English</option>
                            <option value="zh">Chinese</option>
                        </select>
                    </div>
                </div>

                {/* Right: Output */}
                <div className="flex flex-col h-full min-h-[400px]">
                    <div className="flex-1 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 relative group">
                        {shortWarn && (
                            <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                                {shortWarn}
                            </div>
                        )}
                        {transcription ? (
                            <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {transcription}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
                                {status === "processing" ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                                        <p>Transcribing...</p>
                                    </div>
                                ) : (
                                    <p>Transcription will appear here...</p>
                                )}
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={copyToClipboard}
                                disabled={!transcription}
                                className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors"
                                title="Copy Text"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={downloadTxt}
                                disabled={!transcription}
                                className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors"
                                title="Export TXT"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
