import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Privacy Policy | YuliusBox",
    description: "How YuliusBox handles your data: tools run locally in your browser, files are never uploaded, and how cookies, analytics, and advertising work on this site.",
    alternates: { canonical: "/privacy" },
    openGraph: {
        url: "/privacy",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/privacy.png",
                width: 1200,
                height: 630,
                alt: "Privacy Policy",
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

export default function PrivacyPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500 mb-10">Last updated: November 5, 2026</p>

            <Section title="The short version">
                <p>
                    YuliusBox tools run <strong className="text-zinc-200">entirely in your
                    browser</strong> wherever technically possible. When you compress an image, watermark
                    an ID copy, merge PDF documents, convert a video to GIF, or transcribe an audio memo,
                    the computation happens on your own device — your files are never uploaded to our servers,
                    because we do not operate backend servers that accept or store them. We do not require accounts,
                    we do not sell user data, and we do not track your personal identity. We only collect
                    anonymous, cookieless website visit statistics (using self-hosted Umami) to monitor traffic
                    trends and fix broken pages.
                </p>
            </Section>

            <Section title="Local processing architecture">
                <p>
                    The vast majority of file operations on YuliusBox are performed client-side using modern web
                    standards including WebAssembly (Wasm), the HTML5 Canvas 2D API, Web Audio processing, and
                    on-device machine learning runtimes (ONNX Runtime Web via Transformers.js).
                </p>
                <p>
                    When you drop a file onto a client-side tool, your browser loads the file data into local device
                    memory using temporary blob URLs or array buffers. Your machine&apos;s CPU and GPU execute the
                    decoding, processing, and re-encoding. When you download the finished output, the file is saved
                    directly from your browser&apos;s memory to your storage disk. Your original files and the generated
                    results never cross the network.
                </p>
            </Section>

            <Section title="Tool-by-tool data processing breakdown">
                <p>
                    To ensure absolute transparency, the table below lists our primary tools, their execution
                    architecture, and their exact data-handling behavior:
                </p>
                <div className="overflow-x-auto my-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900/80 text-zinc-200 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                            <tr>
                                <th className="p-3 sm:p-4">Tool</th>
                                <th className="p-3 sm:p-4">Architecture</th>
                                <th className="p-3 sm:p-4">Data Handling &amp; Network Behavior</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">ID Watermark</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Processed entirely via HTML5 Canvas in browser memory. Photos, text overlays, and watermarked outputs never touch any server.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Video to GIF</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">FFmpeg runs locally via WebAssembly inside your browser tab. Video frames are decoded and encoded on-device. Zero upload.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Audio to Text</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">OpenAI Whisper runs locally via ONNX Runtime Web in a Web Worker. Audio is decoded with Web Audio API. Audio bytes never leave your device.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Image Compressor</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Canvas API and client-side compression re-encode JPG, PNG, and WebP images locally. Batch compression runs offline in browser memory.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">PDF Kit</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">pdf-lib parses, merges, compresses, splits, and converts JPG to PDF in local JavaScript. Documents never leave your computer.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Background Remover</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Machine learning segmentation runs locally in your browser via WebAssembly. Images never leave your computer.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">EXIF Remover</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Extracts and strips GPS coordinates, camera serials, and timestamps locally using client-side binary parsers.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">File Encryptor</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Uses the browser&apos;s native Web Crypto API (AES-GCM 256-bit). Encryption and decryption keys exist solely in your local session.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">PDF Redact &amp; Sign</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Redactions and signatures are permanently burned into PDF page streams using client-side canvas and pdf-lib.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Image to SVG / SVG Optimizer</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Vector tracing (ImageTracer) and SVG cleanup (SVGO) run 100% in browser memory.</td>
                            </tr>
                            <tr>
                                <td className="p-3 sm:p-4 font-medium text-white">Developer Utilities (Diff, JSON, Codec, Log Sanitizer)</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% Local</span></td>
                                <td className="p-3 sm:p-4">Text diffing, code generation, Base64/JWT decoding, regex log sanitization, and screenshot blur run entirely in client JavaScript.</td>
                            </tr>
                            <tr className="bg-amber-500/5">
                                <td className="p-3 sm:p-4 font-medium text-amber-300">Excel Formula Bot</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">API Powered</span></td>
                                <td className="p-3 sm:p-4">Sends the plain-text description you type to our secure AI backend to generate the formula. Your spreadsheet files and actual data rows are NEVER sent.</td>
                            </tr>
                            <tr className="bg-amber-500/5">
                                <td className="p-3 sm:p-4 font-medium text-amber-300">Office to PDF (Word, Excel, PPT)</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Cloud Worker</span></td>
                                <td className="p-3 sm:p-4">Converts proprietary Office documents on an isolated cloud worker (because browsers cannot render Office formats natively). Files are processed in volatile memory and destroyed immediately after PDF generation. No files are retained.</td>
                            </tr>
                            <tr className="bg-amber-500/5">
                                <td className="p-3 sm:p-4 font-medium text-amber-300">URL to PDF</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Cloud Renderer</span></td>
                                <td className="p-3 sm:p-4">A headless cloud browser navigates to the public URL you request to capture the page PDF. Only the target URL is transmitted.</td>
                            </tr>
                            <tr className="bg-amber-500/5">
                                <td className="p-3 sm:p-4 font-medium text-amber-300">AI Assistants (Cron, Regex, SQL, Paraphraser, YouTube)</td>
                                <td className="p-3 sm:p-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">API Powered</span></td>
                                <td className="p-3 sm:p-4">Sends the typed prompt or schema description to our backend AI service to generate code or text suggestions. Prompts are ephemeral and never used for model training.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-zinc-400 mt-3">
                    <strong className="text-zinc-200">How to independently verify:</strong> You do not have to take our word for it.
                    At any time, press <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-xs">F12</code> (or
                    <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-xs ml-1">Cmd + Option + I</code> on macOS)
                    to open your browser&apos;s Developer Tools, navigate to the <strong className="text-zinc-200">Network</strong> tab, and select or process
                    any file in any tool marked &ldquo;100% Local&rdquo;. You can inspect every outbound HTTP request and observe that zero file bytes,
                    thumbnails, or document contents are ever transmitted across the network.
                </p>
            </Section>

            <Section title="Cookies and local browser storage">
                <p>
                    We use a minimal set of local storage mechanisms, strictly intended to deliver
                    the specific tool functionalities you actively use:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">User configuration storage (localStorage):</strong> We
                        store minimal, non-identifying user settings — such as your preferred transcription model
                        tier (&ldquo;tiny&rdquo;, &ldquo;base&rdquo;, or &ldquo;small&rdquo;) and chosen spoken language
                        in the Audio to Text tool. This prevents you from having to reconfigure preferences each visit.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Persistent model cache (CacheStorage &amp; IndexedDB):</strong> When
                        you load an on-device machine learning model (such as Whisper speech recognition or background
                        removal), the binary weights are cached in your browser&apos;s native CacheStorage. Subsequent visits
                        load the model directly from your hard drive without consuming additional network bandwidth, enabling
                        complete offline usage.
                    </li>
                    <li>
                        <strong className="text-zinc-200">No cross-site tracking cookies:</strong> YuliusBox does not set
                        first-party advertising cookies, fingerprinting tokens, or cross-site tracking beacons.
                    </li>
                </ul>
            </Section>

            <Section title="Third-party advertising and Google AdSense">
                <p>
                    To maintain YuliusBox as a free resource without requiring paid user subscriptions, this website
                    may display display advertisements managed by Google AdSense and certified third-party ad networks.
                </p>
                <p>
                    When advertising is active, Google and its third-party advertising partners may use cookies,
                    web beacons, and device identifiers to serve advertisements based on your prior visits to this
                    website or other websites across the internet:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit
                        to YuliusBox and other sites on the internet.
                    </li>
                    <li>
                        Users may opt out of personalized advertising by visiting{" "}
                        <a
                            href="https://www.google.com/settings/ads"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-200 underline underline-offset-4 hover:text-white"
                        >
                            Google Ads Settings
                        </a>
                        . Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising
                        by visiting the{" "}
                        <a
                            href="https://www.aboutads.info/choices/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-200 underline underline-offset-4 hover:text-white"
                        >
                            AboutAds.info choices page
                        </a>
                        .
                    </li>
                    <li>
                        Advertisements served on pages with Cross-Origin Embedder Policy (COEP) are isolated using
                        credentialless sandboxed iframes to prevent ad scripts from accessing your local documents or memory.
                    </li>
                </ul>
            </Section>

            <Section title="Consent management for EEA, UK, and Swiss visitors">
                <p>
                    If you are accessing YuliusBox from the European Economic Area (EEA), the United Kingdom, or
                    Switzerland, regulatory frameworks (including the General Data Protection Regulation and the
                    ePrivacy Directive) require your explicit consent before advertising or analytics cookies can be
                    placed on your device.
                </p>
                <p>
                    We deploy a Google-certified Consent Management Platform (CMP) conforming to the Interactive
                    Advertising Bureau (IAB) Europe Transparency and Consent Framework (TCF v2.2). When you first visit
                    from these jurisdictions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>No non-essential cookies or personalized ad tags are initialized prior to your explicit consent.</li>
                    <li>You can choose to accept all, reject all, or configure granular preferences per vendor and purpose.</li>
                    <li>
                        You can modify or revoke your consent choices at any time via the consent settings link available
                        in the footer of every page.
                    </li>
                </ul>
            </Section>

            <Section title="Privacy-first analytics">
                <p>
                    We use Umami — an open-source, privacy-preserving website analytics solution hosted on our own
                    server infrastructure. Umami does not use cookies, does not store persistent device identifiers,
                    does not track visitors across different domains, and does not build longitudinal user profiles.
                </p>
                <p>
                    Umami collects only high-level, aggregate operational metrics: page URLs visited, referring websites,
                    operating system and browser family, and coarse geographic origin (country level). All IP addresses
                    are immediately anonymized in memory and are never persisted in our database. We use this aggregate
                    information exclusively to understand which tools are actively utilized and to debug broken features.
                </p>
            </Section>

            <Section title="Data subject rights (GDPR, CCPA, and CPRA)">
                <p>
                    Under data protection regulations such as the European GDPR and the California Consumer Privacy Act
                    (CCPA/CPRA), users possess specific statutory rights regarding their personal data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-zinc-200">Right to know &amp; access:</strong> You have the right to request
                        confirmation of whether personal data concerning you is processed. Because YuliusBox does not
                        operate user accounts or maintain persistent file records, we hold no identifiable files or data.
                    </li>
                    <li>
                        <strong className="text-zinc-200">Right to deletion:</strong> Because client-side tools run in your
                        browser and server-assisted tools destroy files immediately after processing, your content is already
                        deleted from our systems upon request completion.
                    </li>
                    <li>
                        <strong className="text-zinc-200">No sale or sharing of personal data:</strong> YuliusBox does not sell,
                        rent, or trade your personal information or file contents to third parties for monetary or other
                        valuable consideration.
                    </li>
                </ul>
            </Section>

            <Section title="Data security and cloud isolation">
                <p>
                    For the few tools that interact with backend services (such as Office-to-PDF conversion and AI formula
                    generation), all network transmissions are encrypted in transit using industry-standard Transport Layer
                    Security (TLS 1.3 / HTTPS).
                </p>
                <p>
                    Server-side conversion workers operate in ephemeral, isolated execution sandboxes. Files sent for
                    conversion exist only in temporary RAM during the active process and are permanently purged immediately
                    once the generated PDF response is streamed back to your client. No intermediate files are written
                    to permanent disk storage or retained in server logs.
                </p>
            </Section>

            <Section title="Children's privacy">
                <p>
                    YuliusBox provides general-audience utility tools and is not directed at children under the age of 13
                    (or under 16 in certain jurisdictions). We do not knowingly collect, solicit, or maintain personal
                    information from children. If you believe a child has provided us with personal information, please
                    contact us immediately so we can take appropriate steps.
                </p>
            </Section>

            <Section title="Changes to this policy">
                <p>
                    We may update this Privacy Policy periodically to reflect new browser capabilities, legal requirements,
                    or additions to our utility collection. The &ldquo;Last updated&rdquo; timestamp at the top of this
                    page indicates when the latest revisions took effect. We encourage visitors to review this page
                    periodically to stay informed of our privacy practices.
                </p>
            </Section>

            <Section title="Contact">
                <p>
                    If you have questions, concerns, or technical inquiries regarding this Privacy Policy or our data
                    handling practices, please contact us at:{" "}
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
