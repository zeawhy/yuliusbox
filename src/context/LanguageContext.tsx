"use client";

import React, { createContext, useContext, useEffect } from "react";

type Language = "en" | "cn";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, cn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Site copy is English-only (SEO/AdSense information-architecture decision,
    // 2026-09-29). The context shape is kept so existing tool components keep
    // working unchanged; language is pinned to "en" and any legacy
    // localStorage preference is ignored and cleaned up.
    const language: Language = "en";

    useEffect(() => {
        try {
            localStorage.removeItem("yuliusbox-lang");
        } catch {
            // storage unavailable — nothing to clean
        }
    }, []);

    const setLanguage = (_lang: Language) => {
        // no-op: the language switcher was removed; the site is English-only
    };

    const t = (en: string, _cn: string) => en;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
