"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { HUB_ORDER, hubContent } from "@/lib/hub-content";
import { cn } from "@/lib/utils";

const ABOUT_LINKS = [{ href: "/about", label: "About" }];

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="w-full py-5 mb-10 sm:mb-14 border-b border-zinc-900">
            <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tight text-white select-none">
                    YuliusBox
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            aria-haspopup="true"
                        >
                            Tools <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                            <div className="w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl shadow-black/60">
                                {HUB_ORDER.map((id) => (
                                    <Link
                                        key={id}
                                        href={hubContent[id].href}
                                        className="block px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        {hubContent[id].crumb}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    {ABOUT_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="lg:hidden p-2 -mr-2 text-zinc-300 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu: grouped by tool family */}
            <div
                className={cn(
                    "lg:hidden overflow-hidden transition-all duration-300",
                    mobileOpen ? "max-h-[480px] opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
            >
                <nav aria-label="Mobile" className="flex flex-col gap-1 pb-2">
                    <p className="px-3 pt-2 pb-1 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                        Tools
                    </p>
                    {HUB_ORDER.map((id) => (
                        <Link
                            key={id}
                            href={hubContent[id].href}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-3 rounded-lg text-[15px] text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors min-h-[44px] flex items-center"
                        >
                            {hubContent[id].crumb}
                        </Link>
                    ))}
                    <p className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                        Company
                    </p>
                    {ABOUT_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-3 rounded-lg text-[15px] text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors min-h-[44px] flex items-center"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
