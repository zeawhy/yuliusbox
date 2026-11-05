"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TextDiffTool } from "@/components/tools/TextDiffTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "How does this diff algorithm work?",
        a: "This tool implements Eugene Myers' O(ND) difference algorithm — the same core algorithm used by Git. It finds the shortest edit script (the minimum number of line insertions and deletions) required to transform the original text into the modified text. For edited line pairs, an intra-line character-level LCS (Longest Common Subsequence) diff is executed to highlight specific word and character changes.",
    },
    {
        q: "Is it safe to compare sensitive files, tokens, or logs here?",
        a: "Yes, 100%. The entire comparison runs directly inside your web browser via client-side JavaScript. Zero bytes of your text or files are uploaded to any server or external API. You can safely compare proprietary source code, private configuration files, SQL dumps, or server error logs.",
    },
    {
        q: "What does the 'Ignore Whitespace' option do?",
        a: "When 'Ignore Whitespace' is enabled, the algorithm strips leading and trailing whitespace and collapses consecutive spaces into a single space before comparison. This helps identify actual code or content changes without being distracted by indentation adjustments, trailing spaces, or line ending conversions (CRLF vs LF). The original spacing is still preserved in the rendered output.",
    },
    {
        q: "What are the file size and line count limits?",
        a: "Inputs under 5,000 lines compare instantly. If either side exceeds 5,000 lines, a warning banner is displayed because Myers' worst-case complexity scales with the number of edits. For inputs exceeding 20,000 total lines, comparison is paused to prevent your browser tab from freezing — we recommend splitting extremely large files into smaller sections.",
    },
    {
        q: "How can I export or share the diff result?",
        a: "Click 'Copy Diff Result' to copy the entire unified diff into your clipboard. The output is formatted with standard '+' (added) and '-' (removed) prefixes, identical to a Git unified patch, making it easy to paste into bug trackers, pull requests, code reviews, or email threads.",
    },
];

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
        },
    })),
};

export default function TextDiffPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/text-diff", label: "Text Diff" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Text Diff — Compare Text Online Free, Line & Char Highlight
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Compare two text files or snippets side by side. Accurate line-level diff
                        with intra-line character highlights using Myers algorithm. 100% private in your browser.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <TextDiffTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-6 pt-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Accurate line and character-level text comparison
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Spotting subtle changes between two configurations, JSON payloads, or code snippets
                            can be tedious and error-prone. Traditional online diff checkers often upload your data
                            to third-party servers or only show whole-line differences without indicating which
                            exact characters, variables, or punctuation marks were modified. YuliusBox Text Diff
                            combines line-level Myers diffing with intra-line character analysis to clearly
                            highlight exact inline changes in red and emerald.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            100% Client-Side Privacy: No Server Uploads
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Developers and engineers frequently need to compare sensitive data: API tokens,
                            SSH configurations, proprietary algorithms, database schemas, or customer logs.
                            With YuliusBox Text Diff, all computation is executed locally inside your browser
                            thread. You can inspect the Network tab in DevTools at any time — zero bytes of your
                            text are ever transmitted over the network.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Myers O(ND) Algorithm Architecture, Memory Guardrails &amp; Measured Benchmarks
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Under the hood, <code>TextDiffTool.tsx</code> executes a two-stage comparison pipeline in local JavaScript memory: first, Eugene Myers&apos; <em>O(ND)</em> shortest-edit-script algorithm compares line arrays (where <em>N</em> is the sum of line counts and <em>D</em> is the minimum number of inserted/deleted lines); second, adjacent removed/added line pairs under 500 characters are passed through a trimmed dynamic-programming Longest Common Subsequence (LCS) matrix (<code>Int16Array</code>) to highlight exact character-level edits after stripping shared prefixes and suffixes. To prevent quadratic browser freezes on massive dumps, the tool displays a performance advisory above 5,000 lines and enforces a hard circuit breaker at 20,000 total lines.
                        </p>
                        <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                    Measured in headless Chromium 1248 (Linux x86_64, 4-vCPU AMD EPYC 9D25).
                                </caption>
                                <thead>
                                    <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                        <th className="px-3.5 py-2.5 font-semibold">Input Text Profile</th>
                                        <th className="px-3.5 py-2.5 font-semibold">Lines / Byte Size per Side</th>
                                        <th className="px-3.5 py-2.5 font-semibold">Edit Distance (D)</th>
                                        <th className="px-3.5 py-2.5 font-semibold">Execution Time</th>
                                        <th className="px-3.5 py-2.5 font-semibold">Guardrail Behavior</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                    <tr>
                                        <td className="px-3.5 py-2.5 font-medium text-white">100-Line Config Snippet</td>
                                        <td className="px-3.5 py-2.5">100 lines (5.45 KiB)</td>
                                        <td className="px-3.5 py-2.5">18 line edits</td>
                                        <td className="px-3.5 py-2.5">2.90 ms</td>
                                        <td className="px-3.5 py-2.5">Full Myers line diff + intra-line char LCS</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3.5 py-2.5 font-medium text-white">1,000-Line JSON Schema</td>
                                        <td className="px-3.5 py-2.5">1,000 lines (56.42 KiB)</td>
                                        <td className="px-3.5 py-2.5">92 line edits</td>
                                        <td className="px-3.5 py-2.5">4.90 ms</td>
                                        <td className="px-3.5 py-2.5">Instant real-time re-diff on option toggle</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3.5 py-2.5 font-medium text-white">5,000-Line Server Log</td>
                                        <td className="px-3.5 py-2.5">5,000 lines (290.80 KiB)</td>
                                        <td className="px-3.5 py-2.5">250 line edits</td>
                                        <td className="px-3.5 py-2.5">2.30 ms</td>
                                        <td className="px-3.5 py-2.5">Triggers 5,000-line advisory; paused above 20,000 lines</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                        />
                        <div className="space-y-3 mt-4">
                            {FAQS.map((f) => (
                                <details
                                    key={f.q}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors"
                                >
                                    <summary className="cursor-pointer text-white font-medium hover:text-emerald-400">
                                        {f.q}
                                    </summary>
                                    <p className="mt-2 leading-relaxed text-zinc-400">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
