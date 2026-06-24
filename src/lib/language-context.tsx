"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Locale, type TranslationKeys, translations, locales } from "@/lib/i18n";
import type { Region } from "@/lib/products";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  region: Region;
  t: (key: TranslationKeys) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [region, setRegionState] = useState<Region>("americas");
  const [mounted, setMounted] = useState(false);

  // Restore locale from localStorage + auto-detect region on mount
  useEffect(() => {
    // Restore saved locale
    const savedLocale = localStorage.getItem("fuzzsofa-locale") as Locale | null;
    if (savedLocale && (locales as readonly string[]).includes(savedLocale)) {
      setLocaleState(savedLocale);
      const isRtl = savedLocale === "ar" || savedLocale === "fa";
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = savedLocale;
    }

    // Auto-detect region from IP (only if not already saved)
    const savedRegion = localStorage.getItem("fuzzsofa-region") as Region | null;
    if (savedRegion) {
      setRegionState(savedRegion);
    } else {
      // Detect region from IP
      fetch("/api/detect-region")
        .then((res) => res.json())
        .then((data) => {
          if (data.region) {
            setRegionState(data.region as Region);
            localStorage.setItem("fuzzsofa-region", data.region);
          }
        })
        .catch(() => {
          // Fallback to Americas
          setRegionState("americas");
        });
    }

    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("fuzzsofa-locale", newLocale);
    // Apply RTL direction to document
    const isRtl = newLocale === "ar" || newLocale === "fa";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
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
      value={{ locale, setLocale, region, t, isRtl }}
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
