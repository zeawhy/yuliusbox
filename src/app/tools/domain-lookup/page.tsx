"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { DomainLookupTool } from "@/components/tools/DomainLookupTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "What is RDAP, and how is it different from WHOIS?",
        a: "RDAP (Registration Data Access Protocol) is the modern replacement for the 40-year-old WHOIS protocol. Instead of raw text over TCP port 43, RDAP serves structured JSON over HTTPS, which makes it faster, machine-readable, and consistent across registries. This tool queries the authoritative RDAP servers listed in IANA's official bootstrap registry.",
    },
    {
        q: "What does “No record found” mean? Can I register the domain?",
        a: "It means no registration record exists in the RDAP directory — but that is not a guarantee the name is available. Registries can reserve names, mark them premium, or block them for policy reasons without publishing a record. Always confirm availability and pricing on a registrar's website before assuming a domain is purchasable.",
    },
    {
        q: "Why did a lookup return “Unknown”?",
        a: "“Unknown” means we couldn't get a definitive answer: the registry rate-limited us, its server errored, the query timed out, or the TLD has no RDAP server listed. We deliberately never report these as available — a wrong “available” is worse than no answer. Wait a moment and retry.",
    },
    {
        q: "Is my query private?",
        a: "Your search terms are sent to our server, which forwards them to public RDAP directory servers — the same public records anyone could look up. We don't require an account and we don't sell query data. Note that RDAP itself is a public-record protocol, so lookups are inherently not anonymous to the registries.",
    },
    {
        q: "Which domain extensions are supported?",
        a: "Any TLD with an RDAP server in IANA's bootstrap registry — that covers .com, .net, .org, .io, .ai, .dev and hundreds more. If a TLD has no RDAP endpoint (some country-code registries still don't), the tool will tell you instead of guessing.",
    },
    {
        q: "How frequently is RDAP registry data updated?",
        a: "RDAP queries fetch records directly from the registry or registrar's authoritative servers in real time. However, changes made at a registrar (such as DNS nameserver updates or renewal grace periods) may take anywhere from a few minutes to 24–48 hours to propagate across global DNS and registry caches.",
    },
];

export default function DomainLookupPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/domain-lookup", label: "Domain Lookup" }]} />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Domain WHOIS Lookup — Free RDAP Checker
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Look up any domain&apos;s registration details — registrar, creation and expiry
                        dates, name servers — or check availability across popular extensions. Free,
                        no sign-up.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="api" /></div>
                    
                    <DomainLookupTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">Check any domain in seconds</h2>
                    <p>
                        Every registered domain leaves a public paper trail: which registrar manages it,
                        when it was created, when it expires, and which name servers it points to. This
                        tool reads that trail through RDAP, the modern successor to WHOIS, pulling data
                        straight from each registry&apos;s authoritative server via IANA&apos;s official
                        directory. No accounts, no API keys, no per-query fees.
                    </p>
                    <h2 className="text-xl font-semibold text-white">Finding an available name</h2>
                    <p>
                        The Availability tab checks your idea across .com, .net, .org, .io, .ai and .dev
                        in one shot, and the Bulk Check tab handles up to 50 domains at once — handy when
                        you&apos;re brainstorming brand names. If your first choice is taken, the tool
                        suggests get-/try-/app- prefixed variants and alternate extensions to keep the
                        search moving. One honest caveat: &ldquo;no record found&rdquo; means exactly that —
                        some names are registry-reserved or premium even without a public record, so always
                        confirm on a registrar before celebrating.
                    </p>
                    <h2 className="text-xl font-semibold text-white">RDAP vs. Legacy Port-43 WHOIS: Protocol Architecture &amp; DevTools Inspection</h2>
                    <p>
                        Traditional WHOIS (RFC 3912) operates over unencrypted TCP port 43 and returns unstructured, registry-specific plain text that lacks standardized field names or character encoding. By contrast, this tool queries the IETF <strong>Registration Data Access Protocol (RDAP, RFC 7480–7484)</strong>. When you submit a domain, our server resolves the authoritative registry endpoint from IANA&apos;s official JSON bootstrap file (<code>data.iana.org/rdap/dns.json</code>), performs an HTTPS <code>GET /domain/&lt;name&gt;</code> request, and parses the standardized JSON response (<code>events</code> for creation/expiration ISO-8601 timestamps, <code>nameservers</code> for delegated DNS hosts, and <code>status</code> codes such as <code>clientTransferProhibited</code>).
                    </p>
                    <p>
                        <strong>How to inspect the lookup in Browser DevTools:</strong> Open DevTools (<code>F12 → Network</code>) and run a domain check. Because several TLD registries omit browser CORS headers or enforce per-IP rate limits, your browser sends a compact JSON request to our stateless proxy route, which queries the authoritative RDAP server and returns the normalized registration status without storing your search history.
                    </p>
                    <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <caption className="px-4 py-2 text-xs text-zinc-400 bg-zinc-900/70 border-b border-zinc-800 text-left">
                                Authoritative RDAP registry endpoints and HTTP status semantics used by YuliusBox Domain Lookup.
                            </caption>
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                                    <th className="px-3.5 py-2.5 font-semibold">TLD Extension</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Registry Operator</th>
                                    <th className="px-3.5 py-2.5 font-semibold">Authoritative RDAP Endpoint</th>
                                    <th className="px-3.5 py-2.5 font-semibold">HTTP 200 vs. 404 Meaning</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">.com / .net</td>
                                    <td className="px-3.5 py-2.5">Verisign</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">rdap.verisign.com/com/v1/</td>
                                    <td className="px-3.5 py-2.5">200 = Registered JSON record; 404 = No registry record found</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">.org</td>
                                    <td className="px-3.5 py-2.5">Public Interest Registry</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">rdap.publicinterestregistry.org/rdap/</td>
                                    <td className="px-3.5 py-2.5">Returns EPP status flags, registrar IANA ID &amp; DNSSEC state</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">.dev / .app</td>
                                    <td className="px-3.5 py-2.5"> Charleston Road Registry (Google)</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">pubapi.registry.google/rdap/</td>
                                    <td className="px-3.5 py-2.5">HSTS-preloaded TLD; HTTP 429/5xx reported honestly as Unknown</td>
                                </tr>
                                <tr>
                                    <td className="px-3.5 py-2.5 font-medium text-white">.io / .ai</td>
                                    <td className="px-3.5 py-2.5">Identity Digital / NIC.ai</td>
                                    <td className="px-3.5 py-2.5 font-mono text-xs">rdap.identitydigital.services/rdap/</td>
                                    <td className="px-3.5 py-2.5">Queries IANA bootstrap server; respects registry rate limits</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <FaqSection items={FAQS} />
            </div>

            <Footer />
        </div>
    );
}
