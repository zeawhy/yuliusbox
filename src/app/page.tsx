import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, UserX, BadgeCheck, Image, FileText, Film, Table, MonitorSmartphone, Mic, type LucideIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HUB_ORDER, hubContent, slugifyHeading } from "@/lib/hub-content";

export const metadata: Metadata = {
    title: "Free Online Tools That Run in Your Browser | YuliusBox",
    description:
        "Compress images, merge PDFs, convert video to GIF, beautify screenshots, and transcribe audio — right in your browser. Your files never leave your device.",
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
            "Compress images, merge PDFs, convert video to GIF, and more — right in your browser. Your files never leave your device.",
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

const FAMILY_ICONS: Record<string, LucideIcon> = {
    "image-compressor": Image,
    "pdf-kit": FileText,
    "video-to-gif": Film,
    "excel-formula-bot": Table,
    "screenshot-beautifier": MonitorSmartphone,
    "audio-to-text": Mic,
};

const FAMILY_TAGLINES: Record<string, string> = {
    "image-compressor": "Shrink JPG, PNG & WebP photos with no visible quality loss.",
    "pdf-kit": "Merge multiple PDFs into one, or shrink oversized files.",
    "video-to-gif": "Turn MP4 and MOV clips into GIFs — no watermark.",
    "excel-formula-bot": "Describe the calculation in plain English; AI writes the formula.",
    "screenshot-beautifier": "Browser frames, gradients, and shadows for your screenshots.",
    "audio-to-text": "Whisper AI transcription that runs 100% on your device.",
};

/**
 * Card sub-links: descriptive anchors to hub sections and long-tail pages.
 * Fragments are derived from the actual section headings, so they cannot drift.
 */
const frag = (hubId: keyof typeof hubContent, sectionIndex: number) =>
    `${hubContent[hubId].href}#${slugifyHeading(hubContent[hubId].sections[sectionIndex].heading)}`;

const FAMILY_SUBLINKS: Record<string, { href: string; label: string }[]> = {
    "image-compressor": [
        { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
        { href: frag("image-compressor", 2), label: "JPG vs PNG vs WebP guide" },
    ],
    "pdf-kit": [
        { href: frag("pdf-kit", 0), label: "Merge PDF files online" },
        { href: frag("pdf-kit", 1), label: "Why PDFs get so big" },
    ],
    "video-to-gif": [
        { href: "/tools/video-to-gif", label: "MP4 to GIF converter" },
        { href: frag("video-to-gif", 1), label: "Frame rate & size guide" },
    ],
    "excel-formula-bot": [
        { href: frag("excel-formula-bot", 1), label: "Formulas it handles well" },
        { href: frag("excel-formula-bot", 2), label: "Excel vs Google Sheets" },
    ],
    "screenshot-beautifier": [
        { href: frag("screenshot-beautifier", 2), label: "Styles for different audiences" },
        { href: frag("screenshot-beautifier", 3), label: "Export tips" },
    ],
    "audio-to-text": [
        { href: frag("audio-to-text", 1), label: "Choosing a Whisper model tier" },
        { href: frag("audio-to-text", 2), label: "Recording tips for accuracy" },
    ],
};

const POPULAR_LINKS: { href: string; label: string; external?: boolean }[] = [
    { href: "/tools/image-compressor/compress-image-to-100kb", label: "Compress image to 100KB" },
    { href: "/tools/pdf-kit", label: "Merge PDF files online" },
    { href: "/tools/video-to-gif", label: "Convert video to GIF" },
    { href: "/tools/excel-formula-bot", label: "AI Excel formula generator *" },
    { href: "/tools/screenshot-beautifier", label: "Screenshot beautifier" },
    { href: "/tools/domain-lookup", label: "Domain lookup" },
    { href: "/tools/audio-to-text", label: "Free audio to text transcriber" },
    { href: "https://www.heic2jpg-free.com", label: "Convert HEIC to JPG free", external: true },
];

const TRUST_POINTS = [
    { icon: ShieldCheck, title: "No upload", text: "Files are processed on your device and never sent to a server." },
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
                        Your files never leave your device. Compress images, merge PDFs,
                        convert video to GIF, beautify screenshots, and transcribe audio —
                        no uploads, no accounts. A few server-powered tools are the
                        exception, and each one is clearly labeled.
                    </p>
                </section>

                {/* Tool family cards */}
                <section aria-label="Tool families">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {HUB_ORDER.map((id) => {
                            const hub = hubContent[id];
                            const Icon = FAMILY_ICONS[id];
                            return (
                                <article
                                    key={id}
                                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-600 hover:bg-zinc-900 transition-all flex flex-col"
                                >
                                    <Link href={hub.href} className="flex items-start gap-4 mb-3">
                                        <span className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0">
                                            <Icon className="w-5 h-5 text-zinc-200" />
                                        </span>
                                        <span>
                                            <h2 className="text-lg font-semibold text-white group-hover:underline underline-offset-4">
                                                {hub.crumb}
                                            </h2>
                                            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                                                {FAMILY_TAGLINES[id]}
                                            </p>
                                        </span>
                                    </Link>
                                    <ul className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-zinc-800/70">
                                        {FAMILY_SUBLINKS[id].map((sub) => (
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
                                        <ArrowRight className="w-3.5 h-3.5" />
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
