"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "cn";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, cn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Initialize with a function to check localStorage if available on client?
    // No, hydration mismatch.
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        // Load persisted language preference
        const savedLang = localStorage.getItem("yuliusbox-lang") as Language;
        if (savedLang) {
            // eslint-disable-next-line
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("yuliusbox-lang", lang);
    };

    const t = (en: string, cn: string) => {
        return language === "en" ? en : cn;
    };

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
