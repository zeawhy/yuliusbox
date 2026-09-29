import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Terms of Service | YuliusBox",
    description: "The terms of service for using YuliusBox's free online tools.",
    alternates: { canonical: "/terms" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
            <div className="text-zinc-400 leading-relaxed space-y-3 text-[15px]">{children}</div>
        </section>
    );
}

export default function TermsPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                Terms of Service
            </h1>
            <p className="text-sm text-zinc-500 mb-10">Last updated: September 29, 2026</p>

            <Section title="1. What YuliusBox provides">
                <p>
                    YuliusBox (&ldquo;the Service&rdquo;) provides free, browser-based utility
                    tools. The tools process your files locally on your device. The Service is
                    provided &ldquo;as is,&rdquo; without warranties of any kind, express or
                    implied.
                </p>
            </Section>

            <Section title="2. Acceptable use">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Process content you do not have the right to use.</li>
                    <li>
                        Attempt to disrupt the Service, probe its infrastructure, or abuse
                        rate-limited features (such as the AI-powered Excel Formula Bot).
                    </li>
                    <li>Misrepresent the output of the tools as certified or official documents.</li>
                </ul>
            </Section>

            <Section title="3. Your content stays yours">
                <p>
                    Because processing happens in your browser, we never receive your files in
                    the first place. Whatever you create with the tools belongs to you. You are
                    responsible for ensuring you have the rights to process the content you use.
                </p>
            </Section>

            <Section title="4. AI-generated content">
                <p>
                    The Excel Formula Bot generates formulas using artificial intelligence.
                    AI output can be incorrect — always verify generated formulas against
                    sample data before relying on them. We are not liable for errors in
                    AI-generated content.
                </p>
            </Section>

            <Section title="5. Limitation of liability">
                <p>
                    To the maximum extent permitted by law, YuliusBox and its operator shall not
                    be liable for any indirect, incidental, or consequential damages arising
                    from your use of the Service, including data loss. Always keep backups of
                    important files before processing them with any tool, on any site.
                </p>
            </Section>

            <Section title="6. Changes to the Service">
                <p>
                    We may modify, suspend, or discontinue any tool at any time. We may update
                    these terms; continued use of the Service after changes constitutes
                    acceptance of the new terms.
                </p>
            </Section>

            <Section title="7. Contact">
                <p>
                    Questions about these terms:{" "}
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
