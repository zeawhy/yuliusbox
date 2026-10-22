"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { CodecToolboxTool } from "@/components/tools/CodecToolboxTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import Link from "next/link";

const FAQS = [
    {
        q: "What is the difference between standard Base64 and URL-safe Base64?",
        a: "Standard Base64 uses '+' and '/' as characters 62 and 63, and '=' for padding. Because '+', '/', and '=' have reserved syntactic meanings in URLs and query strings, URL-safe Base64 (RFC 4648 §5) substitutes '-' for '+' and '_' for '/', and typically removes '=' padding. This allows the encoded string to be passed safely in URL paths, query parameters, or JWT tokens without escaping.",
    },
    {
        q: "Should I choose MD5 or SHA-256 for hashing?",
        a: "It depends entirely on whether your use case is security-sensitive. MD5 and SHA-1 have known practical collision vulnerabilities — an attacker can generate two different files that produce the exact same MD5 hash. Therefore, MD5 and SHA-1 should ONLY be used for quick non-cryptographic checksums, file deduplication, or legacy cache keys. For passwords, digital signatures, integrity verification, or API auth tokens, always choose SHA-256 or SHA-512.",
    },
    {
        q: "Why does my converted timestamp show an unexpected date or year like 55000+?",
        a: "The most common issue is confusing Unix seconds with Unix milliseconds. Standard Unix epoch timestamps in seconds are 10 digits (e.g. 1799999999 in 2027). Millisecond timestamps (common in JavaScript Date.now()) are 13 digits. If you pass a 13-digit millisecond value into a system expecting seconds, it interprets the value as tens of thousands of years in the future. This tool automatically detects whether your input is in seconds or milliseconds.",
    },
    {
        q: "Is it safe to compute hashes or decode sensitive data on this page?",
        a: "Yes. All computations — Base64 encoding/decoding, SHA/MD5 hashing, and timestamp conversions — execute entirely in your web browser via client-side JavaScript and the Web Crypto API. Zero bytes of your text or files are ever transmitted to our server or any third party. However, remember that if you hash a weak or dictionary password with MD5 or SHA-256, anyone who obtains that hash can reverse it using offline precomputed rainbow tables; production passwords should always use salted slow hashes like Argon2 or bcrypt.",
    },
    {
        q: "Which timezone is used for timestamp conversions?",
        a: "By default, timestamp conversions display in your browser's detected local timezone as well as standard UTC and ISO 8601. You can toggle between Local and UTC in the timezone selector above to view dates and generate timestamps formatted specifically in your preferred zone.",
    },
];

export default function CodecToolboxPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools/codec-toolbox", label: "Codec Toolbox" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                {/* Title area */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Codec Toolbox — Base64, Hash & Timestamp Tools Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        An all-in-one developer utility for Base64 text & file encoding/decoding, MD5/SHA-256/SHA-512 cryptographic hashing, and Unix timestamp epoch conversion. 100% in-browser — 0 bytes uploaded anywhere.
                    </p>
                </div>

                {/* Tool container with Privacy Badge */}
                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <CodecToolboxTool />
                </div>

                {/* Prose documentation */}
                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">
                        Base64 Encoding: Standard vs URL-Safe
                    </h2>
                    <p>
                        Base64 encoding is an encoding scheme that translates binary data or arbitrary text into an ASCII string format using a radix-64 representation. In standard Base64 (RFC 4648), the characters <code>+</code> and <code>/</code> are used for indices 62 and 63, with <code>=</code> used for byte alignment padding. However, when placing Base64 strings inside URLs, filenames, or JSON Web Tokens (JWTs), standard characters like <code>+</code> and <code>/</code> can be misread as path separators or query string delimiters. The URL-safe Base64 variant replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>, and strips the trailing padding <code>=</code>, ensuring seamless transmission without percent-encoding.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        Cryptographic Hash Selection: Integrity vs Security
                    </h2>
                    <p>
                        Cryptographic hash functions generate fixed-length digital fingerprints from arbitrary inputs. Choosing the right algorithm depends on your security model:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                        <li>
                            <strong className="text-zinc-200">MD5 & SHA-1:</strong> Proven vulnerable to collision attacks (where two different inputs yield the same digest). They remain widely used for legacy cache identifiers, file deduplication, and non-adversarial checksums, but should never be deployed for passwords, HMAC tokens, or PKI certificates.
                        </li>
                        <li>
                            <strong className="text-zinc-200">SHA-256 & SHA-512 (SHA-2 family):</strong> Industry standards for data integrity verification, Git commit object identification, blockchain consensus, and TLS certificate signatures. They provide strong collision resistance and preimage resistance.
                        </li>
                    </ul>

                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Dedicated Preset Tool</p>
                        <Link
                            href="/tools/codec-toolbox/unix-timestamp-converter"
                            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <span>Unix Timestamp Converter — Seconds, Milliseconds & ISO 8601</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>

                <FaqSection items={FAQS} />
            </div>

            <Footer />
        </div>
    );
}
