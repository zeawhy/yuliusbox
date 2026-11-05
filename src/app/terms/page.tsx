import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Terms of Service | YuliusBox",
    description: "The terms of service for YuliusBox's free online tools: what the tools do, acceptable use, availability, and liability for files you process in your browser.",
    alternates: { canonical: "/terms" },
    openGraph: {
        url: "/terms",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/terms.png",
                width: 1200,
                height: 630,
                alt: "Terms of Service",
            },
        ],
    },

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
            <p className="text-sm text-zinc-500 mb-10">Last updated: November 5, 2026</p>

            <Section title="1. Agreement to terms">
                <p>
                    By accessing or using YuliusBox (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo;
                    or &ldquo;the Site&rdquo;), you agree to be legally bound by these Terms of Service. If you do not
                    agree with these terms, you should not access or use the tools provided on this website.
                </p>
            </Section>

            <Section title="2. Description of service and local execution">
                <p>
                    YuliusBox provides a collection of free, accessible web utilities including image compression,
                    video-to-GIF conversion, speech-to-text transcription, document watermarking, PDF manipulation,
                    and developer utilities.
                </p>
                <p>
                    The majority of our tools execute client-side within your web browser using HTML5 Canvas, WebAssembly,
                    and on-device machine learning runtimes. A limited number of tools (such as Office-to-PDF conversion
                    and AI formula generation) utilize cloud workers or external AI APIs; each such tool is clearly
                    identified on its respective page. The Service is provided free of charge on an &ldquo;as is&rdquo;
                    and &ldquo;as available&rdquo; basis.
                </p>
            </Section>

            <Section title="3. Content ownership and user responsibility">
                <p>
                    You retain full, exclusive ownership and all intellectual property rights in any files, images, videos,
                    audio recordings, documents, and text you process using YuliusBox. Because client-side tools run in your
                    local browser session, we do not acquire any license, copyright, or ownership interest in your content.
                </p>
                <p>
                    You represent and warrant that you own or possess the necessary rights, licenses, and permissions to
                    process any content you input into the Service. You are solely responsible for ensuring that your use
                    of the tools complies with applicable copyright, privacy, and data protection laws.
                </p>
            </Section>

            <Section title="4. Acceptable use policy">
                <p>You agree to use YuliusBox solely for lawful purposes. You agree not to:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        Process, upload, or generate content that is unlawful, defamatory, infringing, fraudulent,
                        or violates the privacy rights of others.
                    </li>
                    <li>
                        Misrepresent watermarked identification documents or generated materials as officially certified,
                        notarized, or legally authenticated government records.
                    </li>
                    <li>
                        Interfere with, disrupt, or compromise the integrity or security of the Service, its servers,
                        or its hosting network infrastructure.
                    </li>
                    <li>
                        Abuse, flood, or circumvent rate limits applied to backend endpoints (including the AI-powered
                        Excel Formula Bot and cloud conversion workers).
                    </li>
                    <li>
                        Deploy automated bots, scrapers, or scripts to systematically access or extract data from the
                        Site without our prior written authorization.
                    </li>
                </ul>
            </Section>

            <Section title="5. AI-generated output and machine transcription disclaimer">
                <p>
                    Certain features — including the Excel Formula Bot, SQL Builder, and Whisper Audio-to-Text transcriber —
                    utilize artificial intelligence and machine learning models. AI-generated formulas, code suggestions,
                    and speech transcripts are automated approximations and should always be treated as preliminary drafts:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        AI models may occasionally produce inaccurate, incomplete, or functionally erroneous results.
                    </li>
                    <li>
                        You are solely responsible for independently verifying all generated formulas, code snippets,
                        and transcripts on non-production test data before deploying them in business or financial workflows.
                    </li>
                    <li>
                        YuliusBox disclaims any liability for financial discrepancies, calculations, data corruption,
                        or business disruptions resulting from reliance on AI-generated outputs.
                    </li>
                </ul>
            </Section>

            <Section title="6. Service availability and no warranties">
                <p>
                    YuliusBox is provided without warranties of any kind, whether express, implied, statutory, or otherwise.
                    To the maximum extent permitted under applicable law, we expressly disclaim all implied warranties,
                    including warranties of merchantability, fitness for a particular purpose, non-infringement, and title.
                </p>
                <p>
                    We do not guarantee that: (a) the tools will meet your specific technical requirements; (b) the Service
                    will be uninterrupted, timely, secure, or completely error-free; or (c) any defects in the software
                    will be immediately corrected. We reserve the right to modify, suspend, or discontinue any feature,
                    tool, or page at any time without notice.
                </p>
            </Section>

            <Section title="7. Limitation of liability">
                <p>
                    To the fullest extent permitted by applicable law, in no event shall YuliusBox, its creator, or its
                    contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages,
                    including but not limited to loss of profits, data loss, business interruption, loss of goodwill, or
                    device malfunction, arising out of or related to your use of, or inability to use, the Service.
                </p>
                <p>
                    <strong className="text-zinc-200">Always maintain independent backups:</strong> Because file
                    transformations are performed dynamically in your browser&apos;s volatile memory, you should always
                    maintain untouched copies of all original documents and media before processing them with any tool.
                </p>
            </Section>

            <Section title="8. Third-party services and advertising">
                <p>
                    The Service may display advertisements served by Google AdSense and may contain hyperlinks to external
                    third-party websites or open-source repositories (such as GitHub). We do not control, endorse, or assume
                    responsibility for the content, privacy policies, or operational practices of any third-party websites
                    or advertising partners.
                </p>
            </Section>

            <Section title="9. Modifications to these terms">
                <p>
                    We may revise and update these Terms of Service from time to time. The &ldquo;Last updated&rdquo; date
                    at the beginning of this document reflects the effective date of the latest revisions. Your continued
                    use of the Service following any modifications signifies your acceptance of the updated terms.
                </p>
            </Section>

            <Section title="10. Contact">
                <p>
                    If you have questions, comments, or legal inquiries concerning these Terms of Service, please contact us at:{" "}
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
