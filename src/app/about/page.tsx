import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "About | YuliusBox",
    description:
        "YuliusBox is a collection of free, privacy-first online tools that run entirely in your browser. Your files never leave your device.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8">
                About YuliusBox
            </h1>

            <div className="text-zinc-400 leading-relaxed space-y-5 text-[15px]">
                <p>
                    YuliusBox is a collection of <strong className="text-zinc-200">free online
                    tools that run entirely in your browser</strong>: compress images, merge and
                    compress PDFs, convert video to GIF, generate Excel formulas with AI,
                    beautify screenshots, and transcribe audio with on-device AI. There are no
                    accounts to create, no software to install, and no files to upload.
                </p>
                <p>
                    The project started from a simple frustration: every &ldquo;free online
                    tool&rdquo; seemed to require uploading your files to a stranger&apos;s
                    server, waiting in a queue, and hitting a monthly quota. For sensitive
                    material — contracts, ID documents, unreleased work, personal recordings —
                    that trade-off is unacceptable. Modern browsers are powerful enough to do
                    the work locally with WebAssembly, the Canvas API, and on-device machine
                    learning, so YuliusBox simply does it there.
                </p>

                <h2 className="text-xl font-bold text-white pt-4">Why you can trust it</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Verifiable privacy.</strong> You
                        don&apos;t have to take our word for it — open your browser&apos;s
                        network inspector while using any tool and watch: your files never
                        leave your device.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Open source.</strong> The full source
                        code is public on{" "}
                        <a
                            href="https://github.com/zeawhy/yuliusbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-200 underline underline-offset-4 hover:text-white"
                        >
                            GitHub
                        </a>
                        , so anyone can audit exactly what the tools do.
                    </li>
                    <li>
                        <strong className="text-zinc-200">No dark patterns.</strong> No fake
                        download buttons, no countdown timers, no &ldquo;premium unlocks&rdquo;
                        gating basic features. Free means free.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-white pt-4">How it stays free</h2>
                <p>
                    YuliusBox is built and maintained by Yulius as an independent project.
                    Running costs are kept near zero because there is almost no server
                    infrastructure — your browser does the heavy lifting. In the future, the
                    site may show a small number of clearly-labeled display ads to cover
                    domain and maintenance costs. It will never sell data, because it
                    doesn&apos;t collect any.
                </p>

                <h2 className="text-xl font-bold text-white pt-4">Get in touch</h2>
                <p>
                    Feedback, bug reports, and tool requests are welcome at{" "}
                    <a
                        href="mailto:support@yuliusbox.com"
                        className="text-zinc-200 underline underline-offset-4 hover:text-white"
                    >
                        support@yuliusbox.com
                    </a>
                    .
                </p>
            </div>
        </article>
            <Footer />
        </div>
    );
}
