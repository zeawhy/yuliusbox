import Link from "next/link";
import { Twitter, Mail, Coffee } from "lucide-react";
import { HUB_ORDER, hubContent } from "@/lib/hub-content";

const LEGAL_LINKS = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Footer() {
    return (
        <footer className="w-full py-12 mt-24 border-t border-zinc-900 text-zinc-500">
            {/* Link columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
                <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        Tools
                    </p>
                    <ul className="space-y-2.5">
                        {HUB_ORDER.map((id) => (
                            <li key={id}>
                                <Link
                                    href={hubContent[id].href}
                                    className="text-sm hover:text-white transition-colors"
                                >
                                    {hubContent[id].crumb}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        Company
                    </p>
                    <ul className="space-y-2.5">
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
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        Support the Developer
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://ko-fi.com/yuliuslux"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF5E5B] text-white rounded-full text-sm font-bold hover:bg-[#FF5E5B]/90 transition-all"
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Buy me a Coffee</span>
                        </a>
                        <a
                            href="https://paypal.me/yuliuslux"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#0070BA] text-white rounded-full text-sm font-bold hover:bg-[#0070BA]/90 transition-all"
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
                        className="hover:text-white transition-colors"
                        aria-label="X (Twitter)"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a
                        href="mailto:support@yuliusbox.com"
                        className="hover:text-white transition-colors"
                        aria-label="Email support@yuliusbox.com"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
