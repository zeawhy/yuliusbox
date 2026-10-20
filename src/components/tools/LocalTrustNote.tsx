"use client";

import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Geek-oriented trust note for purely client-side tools.
 *
 * ONLY render this on tools verified to upload zero bytes of user data
 * (no fetch/POST of files or input anywhere in the tool's code path).
 *
 * Deliberately scoped: it claims nothing about site analytics (Umami) or
 * CDN asset downloads (e.g. transformers.js / Whisper models) — only that
 * YOUR files and input never leave the browser.
 */
export function LocalTrustNote() {
    const { t } = useLanguage();
    return (
        <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {t(
                "Geek check: open DevTools \u2192 Network tab \u2014 0 bytes of your data uploaded.",
                "极客验证：打开 DevTools \u2192 Network 面板——你的数据 0 字节上传。"
            )}
        </p>
    );
}
