import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Contact | YuliusBox",
    description: "Contact YuliusBox for feedback, bug reports, and tool requests. Email support@yuliusbox.com — a small independent project, and real replies from the maker.",
    alternates: { canonical: "/contact" },
    openGraph: {
        url: "/contact",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/contact.png",
                width: 1200,
                height: 630,
                alt: "Contact",
            },
        ],
    },

};

export default function ContactPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8">
                Contact &amp; Feedback
            </h1>

            <div className="text-zinc-400 leading-relaxed space-y-6 text-[15px]">
                <p>
                    Whether you have discovered a technical bug, have an idea for a new client-side
                    utility, or want to suggest an improvement to an existing workflow, we welcome
                    your input. YuliusBox is maintained by an independent creator, and direct user
                    feedback plays a vital role in shaping upcoming features and stability updates.
                </p>

                <div className="my-6">
                    <a
                        href="mailto:support@yuliusbox.com"
                        className="flex items-center gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-all group"
                    >
                        <span className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                            <Mail className="w-6 h-6 text-zinc-200" />
                        </span>
                        <span>
                            <span className="block text-white font-semibold text-lg group-hover:underline underline-offset-4">
                                support@yuliusbox.com
                            </span>
                            <span className="block text-sm text-zinc-500 mt-1">
                                Primary contact email for bug reports, tool suggestions, and inquiries.
                            </span>
                        </span>
                    </a>
                </div>

                <h2 className="text-xl font-bold text-white pt-2">What you can contact us about</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Bug reports &amp; edge cases:</strong> If an image
                        fails to compress, a video throws a WebAssembly error, an audio transcript stalls, or a
                        particular PDF structure breaks rendering, please let us know so we can fix it.
                    </li>
                    <li>
                        <strong className="text-zinc-200">New tool proposals:</strong> Do you have a recurring
                        file conversion or editing workflow that currently requires uploading private files to
                        the cloud? If the task can be executed in-browser using WebAssembly, Canvas, or Web Audio,
                        we would love to hear your proposal.
                    </li>
                    <li>
                        <strong className="text-zinc-200">UI &amp; accessibility suggestions:</strong> Feedback on
                        keyboard navigation, screen reader compatibility, color contrast, or mobile layout quirks
                        is always appreciated.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Open-source &amp; security disclosures:</strong> If you
                        identify potential security vulnerabilities or want to collaborate on GitHub, please email
                        us with your findings.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-white pt-2">How to write an effective bug report</h2>
                <p>
                    To help us reproduce and resolve technical issues quickly, please consider including the following
                    details in your message:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">The specific tool URL:</strong> For example,
                        <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-xs mx-1">/tools/video-to-gif</code> or
                        <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-xs mx-1">/tools/audio-to-text</code>.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Your browser and platform:</strong> Your browser name and version
                        (e.g., Chrome 124, Safari 17.4, Firefox 125) and operating system (macOS, Windows, Linux, iOS, or Android).
                    </li>
                    <li>
                        <strong className="text-zinc-200">Expected vs. actual behavior:</strong> What did you expect to happen,
                        and what actually occurred? Did an error banner appear?
                    </li>
                    <li>
                        <strong className="text-zinc-200">Console errors (if comfortable):</strong> If you know how to open
                        browser Developer Tools (F12 or Cmd+Option+I), copying red error messages from the Console tab is
                        immensely helpful.
                    </li>
                </ol>

                <h2 className="text-xl font-bold text-white pt-2">Response time &amp; expectations</h2>
                <p>
                    YuliusBox is an independent project without a round-the-clock call center. We read every message
                    carefully and prioritize replies on a best-effort basis. Critical bug reports and security
                    disclosures are addressed first, typically within one to three business days. Feature suggestions
                    are compiled into the project roadmap.
                </p>

                <h2 className="text-xl font-bold text-white pt-2">Important privacy reminder</h2>
                <p>
                    Because YuliusBox tools are built specifically to prevent private files from leaving your machine,
                    <strong className="text-zinc-200"> please never attach sensitive, classified, or confidential documents
                    (such as real passports, unredacted contracts, or private financial records) to an email</strong>.
                    If demonstrating an issue requires a test file, please create a dummy file with simulated, non-sensitive data.
                </p>
            </div>
        </article>
            <Footer />
        </div>
    );
}
