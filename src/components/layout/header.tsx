"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n";

type Region = "americas" | "europe" | "middle_east" | "se_asia";

const regionLabels: Record<Region, string> = {
  americas: "Americas",
  europe: "Europe",
  middle_east: "Middle East",
  se_asia: "SE Asia",
};

const regionIcons: Record<string, string> = {
  americas: "🌎",
  europe: "🌍",
  middle_east: "🌍",
  se_asia: "🌏",
};

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Locale>("en");
  const [currentRegion, setCurrentRegion] = useState<Region>("americas");
  const langRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isRtl = currentLang === "ar" || currentLang === "fa";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-[8px] border-b border-[#1A1A1A]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-[0.08em] text-[#F5F0EB]">
          FUZZ SOFA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-light tracking-[0.1em] uppercase">
          <Link href="/animal-sofa-collection" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300">
            Collection
          </Link>
          <Link href="/luxury-villa-interior" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300">
            Interior Worlds
          </Link>
          <Link href="/about" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300">
            About
          </Link>
          <Link href="/contact" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300">
            Contact
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div ref={langRef} className="relative hidden md:block">
            <button
              onClick={() => { setLangOpen(!langOpen); setRegionOpen(false); }}
              className="flex items-center gap-1 text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 text-xs tracking-[0.05em] uppercase"
              aria-label="Select language"
            >
              🌐 {localeNames[currentLang]}
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 right-0 bg-[#111111] border border-[#1A1A1A] rounded-[4px] py-1 min-w-[160px] max-h-[300px] overflow-y-auto z-50">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setCurrentLang(loc); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs tracking-[0.05em] hover:bg-[#1A1A1A] transition-colors ${
                      loc === currentLang ? "text-[#E8B4B8]" : "text-[#8A8580]"
                    }`}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Region selector */}
          <div ref={regionRef} className="relative hidden md:block">
            <button
              onClick={() => { setRegionOpen(!regionOpen); setLangOpen(false); }}
              className="flex items-center gap-1 text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 text-xs tracking-[0.05em]"
              aria-label="Select region"
            >
              📍 {regionLabels[currentRegion]}
            </button>
            {regionOpen && (
              <div className="absolute top-full mt-2 right-0 bg-[#111111] border border-[#1A1A1A] rounded-[4px] py-1 min-w-[180px] z-50">
                {(Object.entries(regionLabels) as [Region, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setCurrentRegion(key); setRegionOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs tracking-[0.05em] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 ${
                      key === currentRegion ? "text-[#E8B4B8]" : "text-[#8A8580]"
                    }`}
                  >
                    <span>{regionIcons[key]}</span> {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account icon */}
          <button className="hidden md:flex text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E8B4B8] text-[#0A0A0A] text-[10px] rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-[#0A0A0A] border-t border-[#1A1A1A] px-6 py-4 flex flex-col gap-4 text-xs font-light tracking-[0.1em] uppercase">
          <Link href="/animal-sofa-collection" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Collection</Link>
          <Link href="/luxury-villa-interior" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Interior Worlds</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Contact</Link>
          <div className="flex gap-3 pt-2 border-t border-[#1A1A1A]">
            <span className="text-[#8A8580]">🌐 EN</span>
            <span className="text-[#8A8580]">📍 Americas</span>
          </div>
        </nav>
      )}
    </header>
  );
}
