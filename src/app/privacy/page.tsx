import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Privacy Policy | YuliusBox",
    description:
        "How YuliusBox handles your data: tools run locally in your browser, files are never uploaded, and how cookies and advertising work.",
    alternates: { canonical: "/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
            <div className="text-zinc-400 leading-relaxed space-y-3 text-[15px]">{children}</div>
        </section>
    );
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500 mb-10">Last updated: September 29, 2026</p>

            <Section title="The short version">
                <p>
                    YuliusBox tools run <strong className="text-zinc-200">entirely in your
                    browser</strong>. When you compress an image, merge a PDF, or transcribe
                    audio, the processing happens on your own device — your files are never
                    uploaded to our servers, because we don&apos;t operate servers that receive
                    them. We don&apos;t ask for accounts, and we don&apos;t sell data, because
                    there is no data to sell.
                </p>
            </Section>

            <Section title="Local processing">
                <p>
                    All file processing (image compression, PDF merging, video conversion,
                    audio transcription, and similar operations) is performed client-side
                    using browser technologies such as WebAssembly, the Canvas API, and
                    on-device machine-learning models. Your files stay on your device from
                    the moment you select them until you download the result. You can verify
                    this yourself by monitoring network activity while using any tool.
                </p>
                <p>
                    The one exception is the Excel Formula Bot, which sends the plain-text
                    description you type to an AI backend to generate a formula. Your
                    spreadsheet files and their contents are never transmitted — only the
                    description you enter.
                </p>
                <p>
                    A second exception is the Office-to-PDF converters (Word, Excel, and
                    PowerPoint to PDF). These run on our isolated cloud worker because
                    browsers cannot faithfully render Office documents on their own. Your
                    file is transmitted securely, converted, and immediately destroyed
                    from memory once the PDF is returned — it is never stored or used
                    for any other purpose.
                </p>
            </Section>

            <Section title="Cookies">
                <p>
                    We use a minimal set of cookies and browser storage, strictly for
                    functionality you asked for:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Remembering tool preferences (e.g., your chosen transcription model or language).</li>
                    <li>Caching downloaded AI models so repeat visits load faster.</li>
                </ul>
                <p>
                    We do not use cookies to build advertising profiles or track you across
                    other websites.
                </p>
            </Section>

            <Section title="Third-party advertising">
                <p>
                    In the future, YuliusBox may display ads served by Google AdSense to keep
                    the tools free. When advertising is enabled, Google and its partners may
                    use cookies to serve ads based on your visits to this and other sites.
                    You can opt out of personalized advertising at Google&apos;s Ads Settings
                    page. We will update this policy before any advertising goes live.
                </p>
            </Section>

            <Section title="Consent management (EEA / UK visitors)">
                <p>
                    If you visit from the European Economic Area or the United Kingdom, you
                    will be asked for consent before any advertising or measurement cookies
                    are set, through a Google-certified Consent Management Platform. You can
                    change or withdraw your consent at any time via the consent settings
                    link shown on the site once advertising is enabled.
                </p>
            </Section>

            <Section title="Analytics">
                <p>
                    We use Umami — a privacy-focused, cookieless analytics tool that we
                    host on our own server — to understand which tools are popular and
                    to fix broken pages. It records aggregate page views, referrers,
                    and device types only: no cookies, no cross-site tracking, and
                    nothing linked to your identity or your files.
                </p>
            </Section>

            <Section title="Contact">
                <p>
                    Questions about this policy:{" "}
                    <a href="mailto:support@yuliusbox.com" className="text-zinc-200 underline underline-offset-4 hover:text-white">
                        support@yuliusbox.com
                    </a>
                    .
                </p>
            </Section>
        </article>
            <Footer />
        </div>
    );
}
