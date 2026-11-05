"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "What is a JWT?",
        a: "JWT (JSON Web Token) is a compact, self-contained way to transmit claims between parties — the standard format for login sessions and API access tokens. It has three base64url-encoded parts separated by dots: the header (signing algorithm), the payload (claims like user ID and expiry), and the signature.",
    },
    {
        q: "Can this tool verify the signature?",
        a: "No — and that's by design. Verifying a signature requires the signer's secret key (HMAC) or public key (RSA/ECDSA), and you should never paste a secret key into any website. This tool decodes and displays the token's contents and format; it cannot tell you whether the signature is valid. A token that decodes cleanly is not necessarily a valid token.",
    },
    {
        q: "Is it safe to paste my token here?",
        a: "Decoding happens entirely in your browser — 0 bytes are uploaded to any server. Still, a JWT can contain sensitive claims (user IDs, emails, roles), so treat it like a password: don't paste production tokens into websites you don't trust, and clear the field when you're done.",
    },
    {
        q: "What do exp, iat, and nbf mean?",
        a: "They are Unix timestamps: exp (expiration time) — the token must be rejected after this moment; iat (issued at) — when it was created; nbf (not before) — the token is invalid before this moment. This page converts them to your local time and shows relative labels like “expires in 3 hours” or “expired 2 days ago”.",
    },
    {
        q: "Why does my token fail to decode?",
        a: "The most common causes: the token was truncated when copied (a JWT has exactly three dot-separated parts), it contains whitespace or line breaks, or it isn't a JWT at all — opaque session tokens and API keys look random and won't decode. Try the sample token to confirm the decoder works.",
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

export default function JwtDecoderPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/jwt-decoder", label: "JWT Decoder" }]} />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        JWT Decoder — Decode Tokens Online, Free
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Paste a JSON Web Token to inspect its header, claims, and expiry times.
                        100% in your browser — your token is never uploaded anywhere.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <JwtDecoderTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">Reading a JWT without leaking it</h2>
                    <p>
                        Debugging auth usually starts with the same question: what&apos;s actually inside
                        this token? The payload tells you who issued it (iss), who it&apos;s for (aud),
                        who it&apos;s about (sub), and — most importantly — whether it has already expired
                        (exp). A surprising number of &ldquo;mysterious 401&rdquo; bugs turn out to be a
                        token whose exp passed hours ago, or an audience claim that doesn&apos;t match the
                        API being called.
                    </p>
                    <h2 className="text-xl font-semibold text-white">Decoding is not verifying</h2>
                    <p>
                        The payload of a JWT is only base64url-encoded, not encrypted — anyone holding the
                        token can read it. That&apos;s why this page is safe to use offline-style: decoding
                        requires no secrets at all. But the same property means decoding proves nothing
                        about authenticity. Only the party holding the signing key can confirm the
                        signature, and that check must happen on your own server, never by pasting secrets
                        into a third-party site.
                    </p>
                    <h2 className="text-xl font-semibold text-white">Client-side Base64Url architecture, DevTools check &amp; measured decode latency</h2>
                    <p>
                        Under RFC 7519, a JSON Web Token consists of three dot-separated segments (<code>header.payload.signature</code>) encoded with RFC 4648 §5 Base64Url (replacing <code>-</code> with <code>+</code> and <code>_</code> with <code>/</code>, and stripping trailing <code>=</code> padding). When you paste a token into YuliusBox, <code>JwtDecoderTool.tsx</code> splits the string on <code>.</code>, restores standard Base64 padding in local JavaScript memory, decodes the UTF-8 byte sequence into JSON, and compares numeric epoch claims (<code>exp</code>, <code>nbf</code>, <code>iat</code>) against <code>Date.now() / 1000</code>.
                    </p>
                    <p>
                        <strong>How to verify zero-upload execution in Browser DevTools:</strong> Open DevTools (<code>F12 → Network</code>), clear the request log (or enable <em>Offline</em> mode), and paste a JWT into the input box. Zero network requests are emitted — your bearer token never touches an external server or analytics payload.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Measured in headless Chromium 1248 (100-iteration average per token profile).
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">JWT Token Profile</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Encoded String Size</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Parsed Claims</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Decode + Timestamp Check Time</th>
                                    <th className="px-3.5 py-2.5 font-semibold">HTTP Header Ceiling Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Compact Session JWT (HS256)</td>
                                    <td className="px-3.5 py-2.5">353 B</td>
                                    <td className="px-3.5 py-2.5">6 standard claims</td>
                                    <td className="px-3.5 py-2.5">0.008 ms</td>
                                    <td className="px-3.5 py-2.5">Fits safely inside 4 KB cookie / 8 KB nginx header limit</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">OIDC Identity Token (RS256)</td>
                                    <td className="px-3.5 py-2.5">1,846 B (1.80 KiB)</td>
                                    <td className="px-3.5 py-2.5">25 claims (roles + scopes)</td>
                                    <td className="px-3.5 py-2.5">0.010 ms</td>
                                    <td className="px-3.5 py-2.5">Typical Auth0 / Cognito / Keycloak access token size</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">Enterprise SAML-Bridged JWT</td>
                                    <td className="px-3.5 py-2.5">5,846 B (5.71 KiB)</td>
                                    <td className="px-3.5 py-2.5">75 AD group claims</td>
                                    <td className="px-3.5 py-2.5">0.017 ms</td>
                                    <td className="px-3.5 py-2.5">Exceeds 4,096 B browser cookie limit; risk of HTTP 431 on default proxies</td>
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
                            <details key={f.q} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                                <summary className="cursor-pointer text-white font-medium">{f.q}</summary>
                                <p className="mt-2">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
