import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";

export const metadata: Metadata = {
    title: "All Free Online Tools — YuliusBox",
    description:
        "Browse all free YuliusBox tools. Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled.",
    alternates: { canonical: "/tools" },
    openGraph: {
        url: "/tools",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools.png",
                width: 1200,
                height: 630,
                alt: "All Free Online Tools \u2014 YuliusBox",
            },
        ],
    },

};

const SCENARIO_GROUPS = [
    {
        title: "Image Size & Format Presets",
        description: "Pre-tuned browser encoders for strict upload portals, web performance, and email limits.",
        links: [
            { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress Image to 100KB" },
            { href: "/tools/image-compressor/compress-jpg-to-50kb", label: "Compress JPG to 50KB" },
            { href: "/tools/image-compressor/compress-image-to-20kb", label: "Compress Image to 20KB" },
            { href: "/tools/image-compressor/compress-images-for-websites", label: "Compress Images for Websites" },
            { href: "/tools/image-compressor/compress-photos-for-email", label: "Compress Photos for Email" },
            { href: "/tools/image-compressor/compress-png-online", label: "Compress PNG Online" },
            { href: "/tools/image-compressor/convert-image-to-webp", label: "Convert Image to WebP" },
        ],
    },
    {
        title: "PDF & Document Presets",
        description: "Direct entry points for shrinking, splitting, extracting, redacting, or converting Office documents.",
        links: [
            { href: "/tools/pdf-kit/compress-pdf-online", label: "Compress PDF Online" },
            { href: "/tools/pdf-kit/split-pdf-online", label: "Split PDF Online" },
            { href: "/tools/pdf-kit/extract-pages-from-pdf", label: "Extract Pages from PDF" },
            { href: "/tools/pdf-redact-sign/redact-pdf-online-free", label: "Redact PDF Online Free" },
            { href: "/tools/word-to-pdf", label: "Word to PDF Converter (.doc, .docx)" },
        ],
    },
    {
        title: "Video, GIF & Spreadsheet Builders",
        description: "Targeted presets for chat-platform GIF limits, WebM screen captures, and complex spreadsheet logic.",
        links: [
            { href: "/tools/video-to-gif/video-to-gif-for-discord", label: "Video to GIF for Discord (8MB Preset)" },
            { href: "/tools/video-to-gif/webm-to-gif-converter", label: "WebM to GIF Converter" },
            { href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions", label: "Excel IF Formula (Multiple Conditions)" },
            { href: "/tools/excel-formula-bot/sumifs-countifs-builder", label: "SUMIFS & COUNTIFS Formula Builder" },
        ],
    },
];

export default function ToolsIndexPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-7xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools", label: "All Tools" }]} />

            <main className="w-full flex flex-col gap-12 sm:gap-16">
                <div className="text-center space-y-4 pt-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        All Tools
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Every free YuliusBox tool in one place. Most tools run entirely in your
                        browser — a few server-powered tools are the exception, and each one is clearly labeled.
                    </p>
                </div>

                <ToolsDirectory />

                {/* Scenario & Target-Size Presets */}
                <section aria-label="Scenario and target-size presets" className="w-full border-t border-zinc-800/80 pt-12">
                    <div className="max-w-3xl mb-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Scenario &amp; Target-Size Presets
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Working under a strict upload cap or a specific file format requirement? These dedicated preset pages load our core tools with the target byte ceiling, output format, or active tab already configured, alongside step-by-step troubleshooting for that exact scenario.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {SCENARIO_GROUPS.map((group) => (
                            <div
                                key={group.title}
                                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col"
                            >
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {group.title}
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                                    {group.description}
                                </p>
                                <ul className="space-y-2.5 mt-auto">
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                                            >
                                                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Editorial Guide: How to Choose a Tool & Category Overview */}
                <div className="w-full max-w-4xl mx-auto border-t border-zinc-800/80 pt-12 space-y-12">
                    <section aria-label="How the directory is organized" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">
                            What each category in this directory covers
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            The YuliusBox catalog is divided into three functional sections so you can locate the right utility whether you are preparing media assets, assembling administrative paperwork, or debugging application data:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                                <h3 className="text-base font-semibold text-white mb-2">1. Media Tools</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Built for photographers, designers, and documentation authors. Compress JPG, PNG, and WebP images to exact kilobyte targets, remove photo backgrounds using in-browser ONNX segmentation models, convert MP4/MOV/WebM clips into watermark-free GIFs via WebAssembly FFmpeg, strip bloated metadata from SVGs, and generate multi-size favicons.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                                <h3 className="text-base font-semibold text-white mb-2">2. Productivity &amp; Document Tools</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Designed for everyday office, legal, and academic workflows. Merge, split, extract, and compress PDFs locally; apply irreversible rasterized redaction and handwritten signatures; protect ID scans with tiled anti-fraud watermarks; transcribe voice recordings with on-device Whisper AI; generate Excel/Sheets formulas; and convert Word, Excel, PowerPoint, or URLs to PDF.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                                <h3 className="text-base font-semibold text-white mb-2">3. Developer Utilities</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Fast, zero-telemetry inspection tools for software engineers and sysadmins. Validate and tree-view JSON payloads, debug regular expressions with live capture groups, decode JWT headers and claims without leaking production tokens, translate Cron schedules into plain English, compare diffs, and query live RDAP/WHOIS domain records.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section aria-label="Choosing between browser-local and server-assisted tools" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">
                            How to choose the right tool: browser-local vs. server-assisted processing
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Every tool page on YuliusBox displays a clear privacy badge in the header so you know where your data is processed before you select a file. Choosing the right tool depends on both your file format and your confidentiality requirements:
                        </p>
                        <ul className="space-y-3 text-zinc-400 leading-relaxed list-disc pl-5">
                            <li>
                                <strong className="text-zinc-200">100% In-Browser Tools (Local Mode):</strong> Twenty-eight of our thirty-four tools execute entirely inside your browser tab using WebAssembly, the HTML5 Canvas API, Web Audio, or client-side JavaScript libraries (<code className="text-zinc-300">pdf-lib</code>, <code className="text-zinc-300">@ffmpeg/ffmpeg</code>, <code className="text-zinc-300">@xenova/transformers</code>). Your files never cross the network, there are no server queues or daily upload caps, and the tools continue functioning offline once loaded. Always choose these local tools when handling signed contracts, national IDs, medical notes, private audio recordings, or production authentication tokens.
                            </li>
                            <li>
                                <strong className="text-zinc-200">Ephemeral Server-Assisted Tools (API Mode):</strong> Six tools require backend capabilities that a web browser cannot provide natively: <Link href="/tools/word-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">Word to PDF</Link>, <Link href="/tools/excel-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">Excel to PDF</Link>, and <Link href="/tools/ppt-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">PPT to PDF</Link> use an isolated headless LibreOffice container (Gotenberg) for accurate Office pagination; <Link href="/tools/url-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">URL to PDF</Link> uses a headless Chromium renderer; <Link href="/tools/excel-formula-bot" className="text-zinc-200 underline underline-offset-4 hover:text-white">Excel Formula Bot</Link> sends only your plain-English prompt to an AI model; and <Link href="/tools/domain-lookup" className="text-zinc-200 underline underline-offset-4 hover:text-white">Domain Lookup</Link> queries public RDAP/WHOIS registries. Files and prompts sent to these endpoints are processed strictly in volatile memory over HTTPS and are discarded immediately after the response completes.
                            </li>
                        </ul>
                    </section>

                    <section aria-label="Chaining tools together for common tasks" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">
                            Chaining tools together: practical workflows
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Because YuliusBox tools output standard, unwatermarked files directly to your downloads folder, you can chain multiple utilities together in a couple of minutes without registering an account:
                        </p>
                        <div className="space-y-4 text-zinc-400 leading-relaxed">
                            <p>
                                <strong className="text-zinc-200">Preparing an online application packet:</strong> Start in <Link href="/tools/word-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">Word to PDF</Link> to lock the formatting of your cover letter, then switch to <Link href="/tools/pdf-kit" className="text-zinc-200 underline underline-offset-4 hover:text-white">PDF Kit</Link> to merge that PDF with your diploma scans. If the portal requires a separate headshot under 50 KB and a watermarked ID card, run your portrait through <Link href="/tools/image-compressor/compress-jpg-to-50kb" className="text-zinc-200 underline underline-offset-4 hover:text-white">Compress JPG to 50KB</Link> and apply a custom usage notice to your ID scan in <Link href="/tools/id-watermark" className="text-zinc-200 underline underline-offset-4 hover:text-white">ID Watermark Protector</Link>.
                            </p>
                            <p>
                                <strong className="text-zinc-200">Publishing a fast tutorial or bug report:</strong> Trim and convert a screen recording into an inline animation with <Link href="/tools/video-to-gif/video-to-gif-for-discord" className="text-zinc-200 underline underline-offset-4 hover:text-white">Video to GIF for Discord</Link>, convert full-resolution screenshots into lightweight modern assets with <Link href="/tools/image-compressor/convert-image-to-webp" className="text-zinc-200 underline underline-offset-4 hover:text-white">Convert Image to WebP</Link>, and clean up any inline vector icons with <Link href="/tools/svg-optimizer" className="text-zinc-200 underline underline-offset-4 hover:text-white">SVG Optimizer</Link>.
                            </p>
                            <p>
                                <strong className="text-zinc-200">Turning meeting recordings into action items:</strong> Transcribe a recorded voice memo privately on your laptop using <Link href="/tools/audio-to-text" className="text-zinc-200 underline underline-offset-4 hover:text-white">Audio to Text (Whisper)</Link>, build any needed reporting formulas in <Link href="/tools/excel-formula-bot/sumifs-countifs-builder" className="text-zinc-200 underline underline-offset-4 hover:text-white">SUMIFS &amp; COUNTIFS Builder</Link>, and export the final summary sheet via <Link href="/tools/excel-to-pdf" className="text-zinc-200 underline underline-offset-4 hover:text-white">Excel to PDF</Link>.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
