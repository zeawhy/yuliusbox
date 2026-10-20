import Link from "next/link";
import { Twitter, Mail, Coffee, ExternalLink } from "lucide-react";
import { toolsData } from "@/lib/tools-data";

const LEGAL_LINKS = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const FOOTER_CATEGORIES: { key: "media" | "productivity" | "developer"; label: string }[] = [
    { key: "media", label: "Media" },
    { key: "productivity", label: "Productivity" },
    { key: "developer", label: "Developer" },
];

export function Footer() {
    const activeTools = toolsData.filter((t) => !t.comingSoon);

    return (
        <footer className="w-full py-12 mt-24 border-t border-zinc-900 text-zinc-400">
            {/* Tool link columns by category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                {FOOTER_CATEGORIES.map(({ key, label }) => {
                    const tools = activeTools.filter((t) => t.category === key);
                    return (
                        <div key={key}>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                                {label}
                            </p>
                            <ul className="space-y-2.5">
                                {tools.map((tool) => (
                                    <li key={tool.id}>
                                        {tool.href.startsWith("http") ? (
                                            <a
                                                href={tool.href}
                                                target="_blank"
                                                rel="noopener nofollow"
                                                className="inline-flex items-center gap-1 text-sm hover:text-white transition-colors"
                                            >
                                                {tool.name.en}
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <Link
                                                href={tool.href}
                                                className="text-sm hover:text-white transition-colors"
                                            >
                                                {tool.name.en}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}

                {/* Company + Support column */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        Company
                    </p>
                    <ul className="space-y-2.5 mb-6">
                        {LEGAL_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        Support the Developer
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://ko-fi.com/yuliuslux"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[#FF5E5B] text-white rounded-full text-sm font-bold hover:bg-[#FF5E5B]/90 transition-all"
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Buy me a Coffee</span>
                        </a>
                        <a
                            href="https://paypal.me/yuliuslux"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[#0070BA] text-white rounded-full text-sm font-bold hover:bg-[#0070BA]/90 transition-all"
                        >
                            <span>PayPal</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900/50">
                <p className="text-sm">© 2026 YuliusBox. Built by Yulius.</p>
                <div className="flex items-center gap-6">
                    <a
                        href="https://x.com/yuliuslux"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-3 hover:text-white transition-colors"
                        aria-label="X (Twitter)"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a
                        href="mailto:support@yuliusbox.com"
                        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-3 hover:text-white transition-colors"
                        aria-label="Email support@yuliusbox.com"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
