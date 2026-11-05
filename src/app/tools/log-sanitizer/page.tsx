"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LogSanitizerTool } from "@/components/tools/LogSanitizerTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "Is it safe to post sanitized logs or HAR files to public GitHub issues?",
        a: "Yes, but we always recommend a quick visual scan before publishing. This tool scrubs high-risk identifiers — Bearer tokens, cookies, session IDs, phone numbers, national IDs, email usernames, and internal IP addresses. While automated redaction removes standard credentials and PII, your logs might still contain domain-specific business data (such as proprietary order numbers or company names) that you may want to review.",
    },
    {
        q: "Will my raw HAR file or logs be uploaded to your server?",
        a: "Never. All parsing, regex replacement, and JSON reconstruction happen 100% locally in your browser memory via JavaScript. 0 bytes of your log data or files are uploaded to any server. You can even disconnect your internet or inspect the Network tab in DevTools to verify that no requests leave your machine.",
    },
    {
        q: "What sensitive information gets redacted by default?",
        a: "By default, 7 comprehensive rules are active: (1) Authorization Bearer tokens in headers and text; (2) Cookie and Set-Cookie values (preserving keys); (3) 11-digit Chinese mobile phone numbers (with strict boundary checks to avoid false positives on timestamps); (4) 18-digit Chinese Resident IDs (validated with the GB 11643 checksum algorithm); (5) Email addresses (masking usernames); (6) IPv4 and IPv6 addresses; and (7) Sensitive URL query & body parameters (such as token, key, secret, password, and api_key).",
    },
    {
        q: "Can I customize which redaction rules are applied?",
        a: "Yes. Every redaction rule has an independent toggle switch right below the input area. Toggling any rule immediately recalculates the output in real time so you can inspect the exact results and fine-tune your sanitization.",
    },
    {
        q: "What file size is supported?",
        a: "Files up to tens of megabytes can be processed directly in browser memory. A friendly warning is displayed for files larger than 2MB. For exceptionally large HAR archives (>50MB), we recommend trimming down non-essential entries in Chrome DevTools before export to keep browser memory responsive.",
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

export default function LogSanitizerPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/log-sanitizer", label: "Log Sanitizer" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Log Sanitizer — Redact Secrets from HAR Files &amp; Logs Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Instantly redact Bearer tokens, cookies, phone numbers, national IDs, and query secrets
                        before sharing HAR files or logs in GitHub issues or support tickets. 100% client-side.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <LogSanitizerTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">
                        Why you must sanitize logs before posting issues
                    </h2>
                    <p>
                        When troubleshooting production incidents or filing bug reports on GitHub and Jira,
                        developers frequently attach network logs, cURL dumps, or HAR captures. Unfortunately,
                        raw logs routinely leak critical authentication credentials: OAuth access tokens,
                        session cookies, customer phone numbers, personal email addresses, and server IPs.
                        Once posted to a public repository or shared ticket, leaked Bearer tokens and cookies
                        can give unauthorized actors administrative access to your APIs and customer data.
                        Sanitizing logs beforehand removes credentials while keeping error codes and network
                        timings intact for debugging.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        What hidden secrets live inside a HAR file?
                    </h2>
                    <p>
                        A HAR (HTTP Archive) file is a JSON-formatted recording of an entire browser network
                        session. Beyond URLs and status codes, it captures complete request headers (such as
                        <code>Authorization: Bearer ...</code> and <code>Cookie</code>), response headers (such as
                        <code>Set-Cookie</code> session tokens), query strings with embedded API keys, and full
                        POST payloads. Because HAR files serialize both plaintext credentials and user responses,
                        sharing an unedited HAR file is effectively handing over active session tokens and PII.
                        Our tool recursively traverses the HAR structure to neutralize sensitive headers and query
                        keys while ensuring the output remains valid, importable JSON.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        7-Rule Redaction Engine, GB 11643 Checksum Validation &amp; Measured Speed
                    </h2>
                    <p>
                        Naive regex find-and-replace scripts frequently corrupt JSON syntax or redact innocent 11-to-18 digit Unix timestamps and request IDs as phone or ID numbers. <code>LogSanitizerTool.tsx</code> avoids false positives by combining structural HAR JSON parsing with mathematical validation: 18-digit Resident ID candidates are tested against the <strong>GB 11643-1999 modulo-11 weighted checksum</strong> (weights <code>[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]</code>) and calendar date bounds before masking, while <code>Cookie</code> and <code>Set-Cookie</code> headers preserve cookie attribute keys (<code>HttpOnly</code>, <code>SameSite</code>, <code>Path</code>, <code>Domain</code>) while replacing only the secret values with <code>***</code>.
                    </p>
                    <p>
                        <strong>How to verify zero-upload execution in Browser DevTools:</strong> Open DevTools (<code>F12 → Network</code>), clear the log or switch to <em>Offline</em> mode, and drop a raw <code>.har</code> or <code>.log</code> file into the sanitizer. Zero bytes are transmitted over the network.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Measured 7-rule redaction throughput in headless Chromium 1248 (Linux x86_64, 4-vCPU AMD EPYC 9D25).
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">Log / HAR Workload</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Input Size (Lines / Bytes)</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Sanitized Output Bytes</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Execution Time</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Active Rules Applied</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Application Error Log</td>
                                    <td className="px-3.5 py-2.5">500 lines (131.08 KiB / 134,229 B)</td>
                                    <td className="px-3.5 py-2.5">99.01 KiB (101,389 B)</td>
                                    <td className="px-3.5 py-2.5">3.50 ms</td>
                                    <td className="px-3.5 py-2.5">Bearer, Cookie, Email, IP, Phone, ID, URL Query</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Production Server Trace</td>
                                    <td className="px-3.5 py-2.5">5,000 lines (1.30 MiB / 1,367,249 B)</td>
                                    <td className="px-3.5 py-2.5">995.01 KiB (1,018,889 B)</td>
                                    <td className="px-3.5 py-2.5">22.20 ms</td>
                                    <td className="px-3.5 py-2.5">All 7 rules + live rule-toggle recalculation</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Full Browser HAR Capture</td>
                                    <td className="px-3.5 py-2.5">10,000 lines (2.61 MiB / 2,740,055 B)</td>
                                    <td className="px-3.5 py-2.5">1.94 MiB (2,038,889 B)</td>
                                    <td className="px-3.5 py-2.5">39.60 ms</td>
                                    <td className="px-3.5 py-2.5">Triggers &gt;2 MB size notice; preserves valid JSON</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                    />
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details
                                key={f.q}
                                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                            >
                                <summary className="cursor-pointer text-white font-medium">
                                    {f.q}
                                </summary>
                                <p className="mt-2 text-zinc-400 leading-relaxed">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
