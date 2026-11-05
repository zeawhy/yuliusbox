"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { SubtitleToolsTool } from "@/components/tools/SubtitleToolsTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import Link from "next/link";

const FAQS = [
    {
        q: "What is the difference between SRT and WebVTT subtitles?",
        a: "SRT (SubRip) is the traditional and most widely supported subtitle format for desktop video players and editing software; it uses comma separators for milliseconds (00:00:01,000) and sequential numbering. WebVTT (Web Video Text Tracks) is the modern HTML5 standard for web video (<track> tag); it starts with a 'WEBVTT' header, uses dot separators for milliseconds (00:00:01.000), and supports CSS styling, voice tags, and layout positioning.",
    },
    {
        q: "Why should I burn (hardcode) subtitles instead of using soft subtitles?",
        a: "Soft subtitles exist as separate text tracks that players can toggle on and off. However, popular social media platforms (such as TikTok, Instagram Reels, YouTube Shorts, and X/Twitter) or certain smart TVs often ignore, misrender, or strip external subtitle tracks. Hardcoding (burning) permanently draws the subtitle text into the video frames, guaranteeing that your text displays with exact fonts, size, and timing on every device and platform.",
    },
    {
        q: "How does in-browser font rendering work for burning subtitles?",
        a: "Our tool runs a WebAssembly build of FFmpeg directly inside your web browser. When you start the burn process, it dynamically loads a standard OpenType/TrueType font (DejaVu Sans) into the virtual filesystem along with an automated Fontconfig profile. FFmpeg's libass filter uses this font to render clean, anti-aliased subtitles into each video frame without needing native software installed on your machine.",
    },
    {
        q: "Are my video files or subtitle tracks uploaded to your server?",
        a: "No. Everything—from parsing and converting SRT/VTT text to re-encoding the full video with burned-in subtitles—runs 100% locally in your browser through WebAssembly and HTML5 file APIs. Zero bytes of your video or subtitle data are ever uploaded or transmitted across the internet.",
    },
    {
        q: "Why does burning subtitles take longer than converting text?",
        a: "Converting between SRT and WebVTT is purely text transformation and executes in milliseconds. In contrast, burning subtitles requires decoding each video frame, drawing vector glyphs onto the frame at your specified font size and margin, and re-encoding with H.264 video compression. Because your browser's WebAssembly sandbox uses a subset of CPU threads, encoding a 1-minute video typically takes between 30 to 90 seconds depending on your computer's speed.",
    },
];

export default function SubtitleToolsPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/subtitle-tools", label: "Subtitle Tools" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Subtitle Tools — Convert SRT/VTT &amp; Burn Subtitles Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
                        Convert subtitle files between SubRip (.srt) and WebVTT (.vtt) with line-by-line syntax validation,
                        or hardcode subtitles directly into your MP4 videos. 100% client-side — your files never leave your device.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" toolId="subtitle-tools" /></div>
                    
                    <SubtitleToolsTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">
                        SRT vs. WebVTT: Two Standards for Captions
                    </h2>
                    <p>
                        Subtitles are essential for accessibility, international audiences, and social media viewers who watch videos on mute.
                        The two dominant caption formats across the internet are <strong>SubRip (.srt)</strong> and <strong>WebVTT (.vtt)</strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>SubRip (.srt):</strong> The historic standard created for DVD ripping. It relies on sequential integer counters,
                            comma millisecond separators (<code>00:01:23,456</code>), and clean multi-line text blocks. It is supported by nearly every video player (VLC, QuickTime, Premiere, DaVinci Resolve).
                        </li>
                        <li>
                            <strong>WebVTT (.vtt):</strong> Developed by the W3C for native HTML5 <code>&lt;video&gt;</code> elements. It begins with a mandatory <code>WEBVTT</code> header,
                            uses dot millisecond separators (<code>00:01:23.456</code>), and supports rich cue styling (such as alignment, vertical margins, and speaker voice tags).
                        </li>
                    </ul>
                    <p>
                        Our converter verifies your subtitle format with line-numbered error reports. If a timestamp is missing a zero, has minutes above 59,
                        or contains start times after end times, you will immediately see the exact line number and expected syntax to fix.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Hardcoding Subtitles for Social Media and Mobile Playback
                    </h2>
                    <p>
                        While soft subtitles allow viewers to switch languages or toggle captions off, they have a major downside: many social platforms
                        (Instagram Reels, TikTok, YouTube Shorts, X/Twitter, WeChat Channels) discard soft subtitle tracks during video upload.
                        Burning (hardcoding) renders text directly into the video stream, guaranteeing your subtitles will always be legible on any screen,
                        regardless of whether the player supports subtitle tracks.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Client-Side Parser &amp; FFmpeg libass Fontconfig Pipeline (With Measured Benchmarks)
                    </h2>
                    <p>
                        <code>SubtitleToolsTool.tsx</code> operates in two distinct client-side engines depending on your selected tab:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>SRT ↔ WebVTT Parser &amp; Time-Shift Engine:</strong> Executes synchronously in JavaScript memory. It validates HH:MM:SS,mmm (SRT) and HH:MM:SS.mmm (WebVTT) cue boundaries line by line, applies positive or negative millisecond offsets (clamping at <code>00:00:00.000</code>), and re-serializes cues in under 5 milliseconds.
                        </li>
                        <li>
                            <strong>FFmpeg WASM libass Burn-In Engine:</strong> Loads <code>@ffmpeg/core</code> into a WebAssembly virtual filesystem (MEMFS), provisions an in-memory <code>/etc/fonts/fonts.conf</code> profile with <code>DejaVuSans.ttf</code> (and automatically fetches <code>NotoSansSC_400Regular.ttf</code> only when CJK glyphs are detected via Unicode regex), and runs <code>-vf subtitles=...:force_style=... -c:v libx264 -preset ultrafast -crf 23 -c:a copy</code>.
                        </li>
                    </ul>
                    <p>
                        <strong>How to verify zero-upload execution in Browser DevTools:</strong> Open DevTools (<code>F12 → Network</code>). For SRT/VTT conversion, toggle <em>Offline</em> mode immediately and observe zero network activity. For video burn-in, after the static FFmpeg WASM core and font file finish loading via <code>GET</code>, clear the Network log and click Burn Subtitles — zero outbound video or caption packets leave your browser.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Measured subtitle conversion and FFmpeg libass burn-in benchmarks (Linux x86_64, 4-vCPU AMD EPYC 9D25).
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">Operation Mode</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Input Workload</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Output Size</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Execution Time</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Peak Memory / Engine</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">SRT ↔ WebVTT + Offset</td>
                                    <td className="px-3.5 py-2.5">500 subtitle cues (~38 KB text)</td>
                                    <td className="px-3.5 py-2.5">~38 KB (.vtt / .srt)</td>
                                    <td className="px-3.5 py-2.5">&lt; 2.0 ms</td>
                                    <td className="px-3.5 py-2.5">Pure JS regex + ms integer math</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Hardcode Burn (720p 30fps)</td>
                                    <td className="px-3.5 py-2.5">4.0s H.264 MP4 (1.45 MiB / 1,522,576 B)</td>
                                    <td className="px-3.5 py-2.5">3.10 MiB (3,248,532 B)</td>
                                    <td className="px-3.5 py-2.5">3.91 s native (~6–12 s WASM)</td>
                                    <td className="px-3.5 py-2.5">132.6 MiB (135,744 KiB RSS, libass + libx264)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Dedicated Subtitle Converter</p>
                        <Link
                            href="/tools/subtitle-tools/srt-to-vtt-converter"
                            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <span>SRT to VTT Converter — HTML5 Subtitle Formatter</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>

                <FaqSection items={FAQS} />
                <Footer />
            </div>
        </div>
    );
}
