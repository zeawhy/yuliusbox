"use client";

import { useRouter } from "next/navigation";
import { putChainFile, type ChainFile } from "@/lib/tool-chain";
import { cn } from "@/lib/utils";

export interface ContinueWithLink {
    label: string;
    href: string;
}

export interface ContinueWithProps {
    links: ContinueWithLink[];
    getFile: () => ChainFile | null | Promise<ChainFile | null>;
    className?: string;
}

export function ContinueWith({ links, getFile, className }: ContinueWithProps) {
    const router = useRouter();

    const handleClick = async (link: ContinueWithLink) => {
        try {
            const file = await getFile();
            if (!file) {
                router.push(link.href);
                return;
            }
            const chainId = putChainFile(file);
            const separator = link.href.includes("?") ? "&" : "?";
            router.push(`${link.href}${separator}chain=${chainId}`);
        } catch {
            router.push(link.href);
        }
    };

    if (!links || links.length === 0) return null;

    return (
        <div
            className={cn(
                "inline-flex flex-wrap items-center gap-2 p-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-xs",
                className
            )}
        >
            <span className="text-zinc-400 font-medium pl-1 select-none">
                Continue with →
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
                {links.map((link) => (
                    <button
                        key={link.href}
                        type="button"
                        onClick={() => handleClick(link)}
                        className="px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                    >
                        {link.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ContinueWith;
