import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck, UserX, BadgeCheck, Image, FileText, Film, Table, Mic, type LucideIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Free Online Tools That Run in Your Browser | YuliusBox",
    description: "Free online tools that run in your browser — compress images, merge PDFs, convert video to GIF, generate Excel formulas, and transcribe audio. No uploads.",
    keywords: [
        "free online tools",
        "compress image online",
        "merge pdf",
        "video to gif",
        "excel formula generator",
        "browser tools no upload",
    ],
    alternates: { canonical: "/" },
    openGraph: {
        url: "/",
        siteName: "YuliusBox",
        type: "website",
        title: "Free Online Tools That Run in Your Browser | YuliusBox",
        description:
            "Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled.",
        images: [
            {
                url: "/og/home.png",
                width: 1200,
                height: 630,
                alt: "Free Online Tools That Run in Your Browser",
            },
        ],
    },
};

/**
 * Homepage tool families — lightweight local data (name, tagline, link, icon,
 * sub-links) instead of importing the full hub-content / tools-data modules.
 * That keeps the homepage's data surface tiny; the full tool catalogue lives
 * on /tools (and in the footer link columns rendered on every page).
 * Sub-link fragments are the slugified hub section headings (see
 * src/lib/hub-content.ts) — update them if those headings ever change.
 */
interface ToolFamily {
    id: string;
    href: string;
    name: string;
    tagline: string;
    icon: LucideIcon;
    sublinks: { href: string; label: string }[];
}

const FAMILIES: ToolFamily[] = [
    {
        id: "image-compressor",
        href: "/tools/image-compressor",
        name: "Image Compressor",
        tagline: "Shrink JPG, PNG & WebP photos with no visible quality loss.",
        icon: Image,
        sublinks: [
            { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
            { href: "/tools/image-compressor#jpg-vs-png-vs-webp-which-format-to-pick", label: "JPG vs PNG vs WebP guide" },
        ],
    },
    {
        id: "pdf-kit",
        href: "/tools/pdf-kit",
        name: "PDF Tools",
        tagline: "Merge multiple PDFs into one, or shrink oversized files.",
        icon: FileText,
        sublinks: [
            { href: "/tools/pdf-kit#everyday-situations-that-call-for-pdf-merging", label: "Merge PDF files online" },
            { href: "/tools/pdf-kit#why-pdf-files-get-so-big-and-how-compression-helps", label: "Why PDFs get so big" },
        ],
    },
    {
        id: "video-to-gif",
        href: "/tools/video-to-gif",
        name: "Video to GIF",
        tagline: "Turn MP4 and MOV clips into GIFs — no watermark.",
        icon: Film,
        sublinks: [
            { href: "/tools/video-to-gif", label: "MP4 to GIF converter" },
            { href: "/tools/video-to-gif#dialing-in-frame-rate-size-and-length", label: "Frame rate & size guide" },
        ],
    },
    {
        id: "excel-formula-bot",
        href: "/tools/excel-formula-bot",
        name: "Excel Formula Bot",
        tagline: "Describe the calculation in plain English; AI writes the formula.",
        icon: Table,
        sublinks: [
            { href: "/tools/excel-formula-bot#what-it-handles-well-and-what-to-double-check", label: "Formulas it handles well" },
            { href: "/tools/excel-formula-bot#excel-vs-google-sheets-why-the-platform-toggle-matters", label: "Excel vs Google Sheets" },
        ],
    },
    {
        id: "audio-to-text",
        href: "/tools/audio-to-text",
        name: "Audio to Text",
        tagline: "Whisper AI transcription that runs 100% on your device.",
        icon: Mic,
        sublinks: [
            { href: "/tools/audio-to-text#choosing-a-model-tier-tiny-base-or-small", label: "Choosing a Whisper model tier" },
            { href: "/tools/audio-to-text#getting-accurate-transcripts-recording-matters-more-than-settings", label: "Recording tips for accuracy" },
        ],
    },
];

const POPULAR_LINKS: { href: string; label: string; external?: boolean }[] = [
    { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
    { href: "/tools/pdf-kit", label: "Merge PDF files online" },
    { href: "/tools/video-to-gif", label: "Convert video to GIF" },
    { href: "/tools/excel-formula-bot", label: "AI Excel formula generator *" },
    { href: "/tools/id-watermark", label: "ID photo watermark protector" },
    { href: "/tools/domain-lookup", label: "Domain lookup" },
    { href: "/tools/audio-to-text", label: "Free audio to text transcriber" },
    { href: "https://www.heic2jpg-free.com", label: "Convert HEIC to JPG free", external: true },
];

const TRUST_POINTS = [
    { icon: ShieldCheck, title: "Private by default", text: "Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled." },
    { icon: UserX, title: "No signup", text: "Every tool works instantly. No accounts, no email walls." },
    { icon: BadgeCheck, title: "Free", text: "All core tools are free to use, with no watermarks." },
];

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center px-4 sm:px-8 max-w-7xl mx-auto">
            <Header />

            <main className="w-full flex-1 flex flex-col gap-16 sm:gap-24">
                {/* Hero */}
                <section className="flex flex-col gap-6 max-w-3xl pt-4 sm:pt-8">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                        Free online tools that run{" "}
                        <span className="text-zinc-500">in your browser.</span>
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
                        Most tools run entirely in your browser — a few server-powered tools
                        are the exception, and each one is clearly labeled. Compress images,
                        merge PDFs, convert video to GIF, and transcribe audio —
                        no uploads, no accounts.
                    </p>
                    <Link
                        href="/tools/id-watermark"
                        className="group inline-flex items-center gap-3 self-start rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 hover:border-amber-500/60 hover:bg-amber-500/15 transition-all"
                    >
                        <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
                        <span className="text-left">
                            <span className="block text-sm font-semibold text-amber-200">
                                Most visited: ID Watermark Protector
                            </span>
                            <span className="block text-xs text-zinc-400 mt-0.5">
                                Add anti-misuse watermarks to ID photos before sharing — free, in your browser.
                            </span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                </section>

                {/* Tool family cards */}
                <section aria-label="Tool families">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FAMILIES.map((family) => {
                            const Icon = family.icon;
                            return (
                                <article
                                    key={family.id}
                                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-600 hover:bg-zinc-900 transition-all flex flex-col"
                                >
                                    <Link href={family.href} className="flex items-start gap-4 mb-3">
                                        <span className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0">
                                            <Icon className="w-5 h-5 text-zinc-200" />
                                        </span>
                                        <span>
                                            <h2 className="text-lg font-semibold text-white group-hover:underline underline-offset-4">
                                                {family.name}
                                            </h2>
                                            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                                                {family.tagline}
                                            </p>
                                        </span>
                                    </Link>
                                    <ul className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-zinc-800/70">
                                        {family.sublinks.map((sub) => (
                                            <li key={sub.label}>
                                                <Link
                                                    href={sub.href}
                                                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Popular tools */}
                <section aria-label="Popular tools">
                    <h2 className="text-2xl font-bold text-white mb-6">Popular tools</h2>
                    <ul className="flex flex-wrap gap-3">
                        {POPULAR_LINKS.map((link) =>
                            link.external ? (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all min-h-[44px]"
                                    >
                                        {link.label}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                            ) : (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all min-h-[44px]"
                                    >
                                        {link.label}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                    <p className="text-xs text-zinc-500 mt-4 max-w-2xl">
                        * The AI Excel formula generator is an exception to our on-device
                        rule: it sends only your typed description to an AI service —
                        never your files. Our Office-to-PDF converters (Word, Excel,
                        PowerPoint, URL) also run on our secure servers: files are
                        converted and never stored.
                    </p>
                </section>

                {/* All tools — the full categorized grid lives on /tools (and in
                    the footer below) instead of being rendered twice on the
                    homepage; that duplication was the main driver of the
                    homepage's ~153KB HTML (grid markup + its RSC flight copy). */}
                <section aria-label="All tools">
                    <h2 className="text-2xl font-bold text-white mb-4">All tools</h2>
                    <p className="text-zinc-400 leading-relaxed max-w-2xl mb-6">
                        Looking for something specific? The full directory lists every
                        YuliusBox tool grouped by category — media, productivity, and
                        developer tools.
                    </p>
                    <Link
                        href="/tools"
                        className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-zinc-800 bg-zinc-900/40 text-sm font-medium text-zinc-200 hover:text-white hover:border-zinc-600 transition-all min-h-[44px]"
                    >
                        Browse all tools
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>

                {/* How it works */}
                <section aria-label="How it works" className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        Every YuliusBox file tool runs on your device using modern browser
                        technology — WebAssembly, the Canvas API, and on-device AI models
                        like Whisper. When you drop a file into a tool, it is processed by
                        your own CPU and GPU; nothing is sent to a server, stored in a
                        database, or logged — and your files are never touched by ads or
                        analytics. That means no queues, no file-size quotas imposed by
                        server costs, and no privacy trade-offs — most tools even keep
                        working offline once the page has loaded. The one exception is the
                        AI Excel formula generator: it sends only your typed description
                        to an AI service, and our Office-to-PDF converters (Word, Excel,
                        PowerPoint, URL) run on our secure servers — files are converted,
                        never stored. Verify the on-device tools yourself — open the
                        DevTools Network
                        tab and watch your files go nowhere. YuliusBox is open source
                        (MIT) —{" "}
                        <a
                            href="https://github.com/zeawhy/yuliusbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-white transition-colors"
                        >
                            view the code on GitHub
                        </a>
                        .
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {TRUST_POINTS.map((point) => (
                            <div
                                key={point.title}
                                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                            >
                                <point.icon className="w-6 h-6 text-emerald-500 mb-3" />
                                <h3 className="font-semibold text-white mb-1.5">{point.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{point.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Made for sensitive files */}
                <section aria-label="Made for sensitive files" className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Made for sensitive files</h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        Some files should never be uploaded anywhere. Client contracts
                        before they are signed, resumes with home addresses, unreleased
                        product screenshots, interview recordings — YuliusBox exists for
                        exactly these. Because processing happens on your device, there
                        is no server that could leak, subpoena, or train on your data.
                        Freelancers can compress client assets without breaking NDAs,
                        HR teams can merge resumes without a third party ever seeing
                        them, and anyone on a metered or unreliable connection can keep
                        working: once a tool page has loaded, most tools run fully
                        offline.
                    </p>
                    <p className="text-zinc-400 leading-relaxed">
                        This is also why there are no accounts. An account is a database
                        of who processed what — we would rather not have it. If you
                        ever doubt the claim, the proof is one click away: open your
                        browser&rsquo;s DevTools Network tab while using any on-device tool
                        and watch your files go nowhere.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
