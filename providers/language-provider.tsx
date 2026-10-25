"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { deepMerge } from "@/lib/utils";
import type { DictionaryType, ContentLanguageType, SharedDataType } from "@/lib/loaders";

export type ContentType = SharedDataType & ContentLanguageType;

interface LanguageContextType {
    language: Locale;
    dict: DictionaryType;
    content: ContentType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: React.ReactNode;
    lang: Locale;
    dictionary: DictionaryType;
    contents: ContentLanguageType;
    shared: SharedDataType;
}

export function LanguageProvider({ children, lang, dictionary, contents, shared }: LanguageProviderProps) {
    const content = useMemo(
        () => deepMerge(shared, contents),
        [contents, shared],
    );

    return (
        <LanguageContext.Provider value={{ language: lang, dict: dictionary, content }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
