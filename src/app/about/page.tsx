import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "About | YuliusBox",
    description: "About YuliusBox: free online tools that run in your browser, built for files that should never be uploaded. Open source, no accounts, and nothing to install.",
    alternates: { canonical: "/about" },
    openGraph: {
        url: "/about",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/about.png",
                width: 1200,
                height: 630,
                alt: "About",
            },
        ],
    },

};

export default function AboutPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8">
                About YuliusBox
            </h1>

            <div className="text-zinc-400 leading-relaxed space-y-6 text-[15px]">
                <p>
                    YuliusBox is a collection of free online utility tools built around a simple principle:
                    your files belong to you, and the tools you use to process them should not take them away.
                    Most utilities on this site run entirely inside your browser tab — a few server-powered
                    tools are the exception, and each one is clearly labeled with its processing mode.
                    Whether you are compressing images, watermarking identification documents, merging PDF
                    contracts, converting videos to animated GIFs, transcribing audio recordings with
                    on-device AI, or generating spreadsheet formulas, YuliusBox gives you fast, private
                    tools with zero account registration, no paywalls, and nothing to install.
                </p>

                <h2 className="text-xl font-bold text-white pt-2">Who is behind YuliusBox</h2>
                <p>
                    YuliusBox was created and is independently maintained by <strong className="text-zinc-200">Yulius Zhang</strong>,
                    an independent software developer who builds open-source developer utilities and web applications.
                    You can view the complete source code, inspect recent commits, and follow ongoing development
                    on GitHub at{" "}
                    <a
                        href="https://github.com/zeawhy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-200 underline underline-offset-4 hover:text-white"
                    >
                        github.com/zeawhy
                    </a>
                    .
                </p>
                <p>
                    As an independent builder who works daily with media files, code repositories, and documentation,
                    Yulius frequently encountered a frustrating pattern across traditional online utility websites:
                    even the most basic tasks — like trimming a short video clip, adding purpose text to an ID photo,
                    or shrinking an oversized image — required uploading files to an unfamiliar third-party server,
                    waiting in arbitrary processing queues, and hitting artificial daily quotas.
                    For personal documents, confidential work files, and unreleased client assets, sending sensitive
                    data across the internet to an untrusted backend is an unnecessary privacy risk.
                </p>

                <h2 className="text-xl font-bold text-white pt-2">Why we build client-side first</h2>
                <p>
                    Modern web browsers are remarkably capable application runtime environments. Through technologies
                    such as WebAssembly (Wasm), the HTML5 Canvas 2D API, Web Audio processing, and on-device machine
                    learning runtimes (such as ONNX Runtime Web via Transformers.js), personal computers and smartphones
                    can execute demanding computational workloads locally.
                </p>
                <p>
                    By leveraging these client-side capabilities, YuliusBox flips the conventional software-as-a-service
                    model. Instead of transmitting your megabytes of image, audio, or document data to our infrastructure,
                    our web server simply delivers the lightweight application code to your browser. Your local CPU
                    and memory do the actual conversion work. This architecture provides immediate practical advantages:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Zero network upload wait times:</strong> Processing starts
                        instantly because files do not need to traverse residential broadband or mobile uplinks.
                    </li>
                    <li>
                        <strong className="text-zinc-200">No arbitrary file quotas:</strong> Because your own hardware
                        powers the computations, you are not capped by artificial monthly limits or forced upgrades.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Uncompromising data confidentiality:</strong> Sensitive
                        materials — such as passport scans, legal agreements, and internal voice recordings — never
                        touch an external hard drive.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-white pt-2">Our core principles</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Verifiable transparency:</strong> Every client-side claim
                        we make can be independently verified. You can open your browser&apos;s Developer Tools
                        (Network tab) during any operation and confirm that zero file bytes are transmitted.
                        Furthermore, the repository is public on{" "}
                        <a
                            href="https://github.com/zeawhy/yuliusbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-200 underline underline-offset-4 hover:text-white"
                        >
                            GitHub (zeawhy/yuliusbox)
                        </a>
                        , allowing anyone to inspect and audit the implementation.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Clear labeling of exceptions:</strong> When a task genuinely
                        requires cloud computing — such as converting complex proprietary Office documents (Word, Excel,
                        PowerPoint to PDF) or generating formulas via large language models — the tool displays an
                        explicit API badge. Files sent to conversion workers are held strictly in temporary memory and
                        destroyed immediately after delivery.
                    </li>
                    <li>
                        <strong className="text-zinc-200">No dark patterns:</strong> We do not deploy fake download
                        buttons, misleading countdown timers, forced account registrations, or deceptive affiliate traps.
                        The download button gives you your file, period.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Responsible privacy analytics:</strong> We do not track you
                        across the internet or sell behavioral profiles. We use self-hosted, cookieless Umami analytics
                        solely to measure aggregate page visits and discover which tools need technical improvements.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-white pt-2">How the project stays sustainable</h2>
                <p>
                    Because client-side architecture offloads data processing from our servers to visitors&apos; devices,
                    our operational infrastructure overhead remains minimal. To offset ongoing costs for domain
                    registration, content delivery networks (CDNs), and maintenance, YuliusBox displays unobtrusive,
                    clearly identified advertisements through Google AdSense. We do not gate features behind subscriptions
                    or sell private user data.
                </p>

                <h2 className="text-xl font-bold text-white pt-2">Get in touch</h2>
                <p>
                    YuliusBox improves through real community feedback. If you discover a bug, have a feature suggestion,
                    or would like to propose a new in-browser utility, please reach out directly at{" "}
                    <a
                        href="mailto:support@yuliusbox.com"
                        className="text-zinc-200 underline underline-offset-4 hover:text-white"
                    >
                        support@yuliusbox.com
                    </a>
                    . Every email is personally read and answered on a best-effort basis.
                </p>
            </div>
        </article>
            <Footer />
        </div>
    );
}
