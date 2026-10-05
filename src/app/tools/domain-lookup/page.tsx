"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DomainLookupTool } from "@/components/tools/DomainLookupTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

                <DomainLookupTool />

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
                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
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
