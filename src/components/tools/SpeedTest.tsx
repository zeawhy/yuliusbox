"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Zap, Download, Upload, Activity, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic";

// Dynamic import for GaugeChart to avoid SSR issues
const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });

export default function SpeedTest() {
    const { language } = useLanguage();
    const [status, setStatus] = useState<"idle" | "pinging" | "downloading" | "uploading" | "complete">("idle");
    const [ping, setPing] = useState<number | null>(null);
    const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
    const [uploadSpeed, setUploadSpeed] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "Internet Speed Test", cn: "网速测试" },
        subtitle: { en: "Measure your actual connection speed to our Cloudflare-optimized nodes.", cn: "测量您到 Cloudflare 节点的实际网络连接速度。" },
        start: { en: "Start Speed Test", cn: "开始测试" },
        reset: { en: "Test Again", cn: "重新测试" },
        ping: { en: "Latency (Ping)", cn: "延迟 (Ping)" },
        download: { en: "Download Speed", cn: "下载速度" },
        upload: { en: "Upload Speed", cn: "上传速度" },
        unit: "Mbps",
        ms: "ms",
        processing: {
            pinging: { en: "Testing Ping...", cn: "正在测试延迟..." },
            downloading: { en: "Testing Download...", cn: "正在测试下载..." },
            uploading: { en: "Testing Upload...", cn: "正在测试上传..." }
        }
    };

    const workerUrl = process.env.NEXT_PUBLIC_CF_WORKER_URL || "";

    const runPingTest = async () => {
        setStatus("pinging");
        const start = performance.now();
        try {
            const resp = await fetch(`${workerUrl}/api/speed/ping`, { cache: "no-store" });
            if (!resp.ok) throw new Error("Ping failed");
            setPing(Math.round(performance.now() - start));
        } catch (err) {
            setError("Connection failed. Please check your network.");
            throw err;
        }
    };

    const runDownloadTest = async () => {
        setStatus("downloading");
        const start = performance.now();
        try {
            const resp = await fetch(`${workerUrl}/api/speed/download`, { cache: "no-store" });
            const blob = await resp.blob();
            const end = performance.now();
            const durationSec = (end - start) / 1000;
            const sizeBits = blob.size * 8;
            const mbps = (sizeBits / 1024 / 1024) / durationSec;
            setDownloadSpeed(parseFloat(mbps.toFixed(2)));
        } catch (err) {
            setError("Download test failed.");
            throw err;
        }
    };

    const runUploadTest = async () => {
        setStatus("uploading");
        const data = new Uint8Array(2 * 1024 * 1024).fill(65); // 2MB upload
        const start = performance.now();
        try {
            const resp = await fetch(`${workerUrl}/api/speed/upload`, {
                method: "POST",
                body: data,
                headers: { "Content-Type": "application/octet-stream" }
            });
            if (!resp.ok) throw new Error("Upload failed");
            const end = performance.now();
            const durationSec = (end - start) / 1000;
            const sizeBits = data.length * 8;
            const mbps = (sizeBits / 1024 / 1024) / durationSec;
            setUploadSpeed(parseFloat(mbps.toFixed(2)));
        } catch (err) {
            setError("Upload test failed.");
            throw err;
        }
    };

    const startTest = async () => {
        setError(null);
        setPing(null);
        setDownloadSpeed(0);
        setUploadSpeed(0);

        try {
            await runPingTest();
            await runDownloadTest();
            await runUploadTest();
            setStatus("complete");
        } catch (err) {
            setStatus("idle");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>

                <div className="flex flex-col items-start text-left">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6 shadow-xl">
                        <Zap className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        {language === "en" ? "Internet Speed " : "网速"}
                        <span className="text-zinc-500 font-medium">{language === "en" ? "Test" : "测试"}</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        {language === "en" ? t.subtitle.en : t.subtitle.cn}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Latency Card */}
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8 flex flex-col items-center justify-center gap-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{language === "en" ? t.ping.en : t.ping.cn}</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{ping !== null ? ping : "--"}</span>
                        <span className="text-zinc-600 font-bold">{t.ms}</span>
                    </div>
                </div>

                {/* Download Card */}
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8 flex flex-col items-center justify-center gap-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <Download className="w-8 h-8 text-emerald-500" />
                    <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{language === "en" ? t.download.en : t.download.cn}</span>
                    <div className="w-full max-w-[240px]">
                        <GaugeChart
                            id="download-gauge"
                            nrOfLevels={20}
                            colors={["#065f46", "#10b981"]}
                            arcWidth={0.3}
                            percent={downloadSpeed / 100}
                            formatTextValue={() => ""}
                            hideText={true}
                        />
                    </div>
                    <div className="flex items-baseline gap-2 mt-[-40px]">
                        <span className="text-5xl font-black text-white">{downloadSpeed || "--"}</span>
                        <span className="text-zinc-600 font-bold">{t.unit}</span>
                    </div>
                </div>

                {/* Upload Card */}
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8 flex flex-col items-center justify-center gap-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <Upload className="w-8 h-8 text-blue-400" />
                    <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{language === "en" ? t.upload.en : t.upload.cn}</span>
                    <div className="w-full max-w-[240px]">
                        <GaugeChart
                            id="upload-gauge"
                            nrOfLevels={20}
                            colors={["#1e3a8a", "#3b82f6"]}
                            arcWidth={0.3}
                            percent={uploadSpeed / 50}
                            formatTextValue={() => ""}
                            hideText={true}
                        />
                    </div>
                    <div className="flex items-baseline gap-2 mt-[-40px]">
                        <span className="text-5xl font-black text-white">{uploadSpeed || "--"}</span>
                        <span className="text-zinc-600 font-bold">{t.unit}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                {status === "idle" || status === "complete" ? (
                    <button
                        onClick={startTest}
                        className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                    >
                        <RefreshCw className={cn("w-6 h-6", status === "idle" ? "" : "animate-spin")} />
                        {status === "idle" ? (language === "en" ? t.start.en : t.start.cn) : (language === "en" ? t.reset.en : t.reset.cn)}
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-12 h-12 text-zinc-500 animate-spin" />
                        <p className="text-zinc-400 font-bold text-lg animate-pulse uppercase tracking-wider">
                            {language === "en" ? t.processing[status as keyof typeof t.processing].en : t.processing[status as keyof typeof t.processing].cn}
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-red-500 font-medium bg-red-500/10 px-6 py-3 rounded-xl border border-red-500/20 shadow-lg">
                        {error}
                    </p>
                )}
            </div>

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 blur-[120px] rounded-full" />
                <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>
        </div>
    );
}
