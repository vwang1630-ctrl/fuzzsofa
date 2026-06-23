"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Locale, type TranslationKeys, translations } from "@/lib/i18n";
import type { Region } from "@/lib/products";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  region: Region;
  setRegion: (region: Region) => void;
  t: (key: TranslationKeys) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [region, setRegionState] = useState<Region>("americas");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Apply RTL direction to document
    const isRtl = newLocale === "ar" || newLocale === "fa";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  }, []);

  const setRegion = useCallback((newRegion: Region) => {
    setRegionState(newRegion);
  }, []);

  const t = useCallback(
    (key: TranslationKeys): string => {
      const translation = translations[locale]?.[key];
      if (translation) return translation;
      // Fallback to English
      const fallback = translations.en[key];
      if (fallback) return fallback;
      return key;
    },
    [locale]
  );

  const isRtl = locale === "ar" || locale === "fa";

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, region, setRegion, t, isRtl }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
