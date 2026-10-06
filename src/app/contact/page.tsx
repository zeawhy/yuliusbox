import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Contact | YuliusBox",
    description:
        "Contact YuliusBox: feedback, bug reports, and tool requests via support@yuliusbox.com.",
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
                Contact
            </h1>

            <div className="text-zinc-400 leading-relaxed space-y-5 text-[15px]">
                <p>
                    Feedback, bug reports, and requests for new tools are all welcome. The
                    fastest way to reach us is email — we read everything and reply to as
                    much as we can.
                </p>

                <a
                    href="mailto:support@yuliusbox.com"
                    className="flex items-center gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-all group"
                >
                    <span className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                        <Mail className="w-6 h-6 text-zinc-200" />
                    </span>
                    <span>
                        <span className="block text-white font-semibold group-hover:underline underline-offset-4">
                            support@yuliusbox.com
                        </span>
                        <span className="block text-sm text-zinc-500 mt-0.5">
                            We usually reply within a few days.
                        </span>
                    </span>
                </a>

                <h2 className="text-xl font-bold text-white pt-4">Before you write</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Bug reports:</strong> tell us which
                        tool, your browser and version, and what you expected vs. what
                        happened. A sample file (with sensitive data removed) helps a lot.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Tool requests:</strong> describe what
                        you want to accomplish. If it can run 100% in the browser, it&apos;s
                        a strong candidate.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Privacy note:</strong> please
                        don&apos;t send sensitive files by email. Describe the problem in
                        words instead.
                    </li>
                </ul>
            </div>
        </article>
            <Footer />
        </div>
    );
}
