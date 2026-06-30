"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";
import { useSupabaseConfig } from "@/lib/supabase-config-inject";
import type { User } from "@supabase/supabase-js";
import type { TranslationKeys } from "@/lib/i18n";

export function Header() {
  const pathname = usePathname();
  const isProductPage = pathname && /^\/[a-z]+-[a-z]+(-[a-z]+)*$/.test(pathname) && !pathname.startsWith('/journal') && !pathname.startsWith('/animal');
  const { totalItems } = useCart();
  const { locale, setLocale, region, t, isRtl } = useLanguage();
  const otherLocale = locale === 'en' ? 'zh' : 'en';
  const { isLoading: configLoading } = useSupabaseConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection for transparent header
  useEffect(() => {
    if (!isProductPage) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isProductPage]);

  const headerSolid = !isProductPage || scrolled;

  // Load user session
  useEffect(() => {
    async function loadSession() {
      if (configLoading) return;
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch {
        // Supabase not configured or not ready
      }
    }
    loadSession();
  }, [configLoading]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerSolid ? 'bg-[#0A0A0A]/95 backdrop-blur-[8px] border-b border-[#1A1A1A]' : 'bg-transparent border-b border-transparent'}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-[0.08em] text-[#F5F0EB]">
          FUZZ SOFA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-light tracking-[0.1em] uppercase">
          <Link href="/animal-sofa-collection" className={`${isProductPage ? 'text-white/60' : 'text-[#8A8580]'} hover:text-[#E8B4B8] transition-colors duration-300`}>
            {t("collection")}
          </Link>
          <Link href="/luxury-villa-interior" className={`${isProductPage ? 'text-white/60' : 'text-[#8A8580]'} hover:text-[#E8B4B8] transition-colors duration-300`}>
            {t("interiorWorlds")}
          </Link>
          <Link href="/about" className={`${isProductPage ? 'text-white/60' : 'text-[#8A8580]'} hover:text-[#E8B4B8] transition-colors duration-300`}>
            {t("about")}
          </Link>
          <Link href="/contact" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300">
            {t("contact")}
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Region indicator - auto detected */}
          <span className={`hidden md:flex items-center gap-1 text-xs tracking-[0.05em] ${headerSolid ? 'text-[#555]' : 'text-white/40'}`}>
            {region === "europe" ? "EUR" : "USD"} / {region === "americas" ? "Americas" : region === "europe" ? "Europe" : region === "middle_east" ? "Middle East" : "SE Asia"}
          </span>

          {/* Language selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1 transition-colors duration-300 text-[11px] tracking-[0.08em] uppercase px-2 py-1 rounded-sm border ${isProductPage ? 'border-white/20 text-white/70 hover:text-white hover:border-white/40' : 'border-[#1A1A1A] text-[#8A8580] hover:text-[#E8B4B8] hover:border-[#E8B4B8]/30'}`}
              aria-label="Select language"
            >
              {localeNames[locale]}
            </button>
            {langOpen && (
              <div className={`absolute top-full mt-2 right-0 border rounded-[4px] py-1 min-w-[160px] max-h-[300px] overflow-y-auto z-50 ${isProductPage ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-[#111111] border-[#1A1A1A]'}`}>
                {locales.map((loc: Locale) => (
                  <button
                    key={loc}
                    onClick={() => { setLocale(loc); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs tracking-[0.05em] hover:bg-[#1A1A1A] transition-colors ${
                      loc === locale ? "text-[#E8B4B8]" : "text-[#8A8580]"
                    }`}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User / Account */}
          <div ref={userMenuRef} className="relative hidden md:block">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-1 transition-colors duration-300 ${headerSolid ? 'text-[#8A8580] hover:text-[#E8B4B8]' : 'text-white/50 hover:text-white'}`}
                aria-label="Account"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            ) : (
              <Link
                href="/login"
                className={`transition-colors duration-300 ${headerSolid ? 'text-[#8A8580] hover:text-[#E8B4B8]' : 'text-white/50 hover:text-white'}`}
                aria-label="Login"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
            {userMenuOpen && user && (
              <div className="absolute top-full mt-2 right-0 bg-[#111111] border border-[#1A1A1A] rounded-[4px] py-1 min-w-[180px] z-50">
                <div className="px-4 py-3 border-b border-[#1A1A1A]">
                  <p className="text-sm text-[#F5F0EB] truncate">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-[#8A8580] truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-[#8A8580] hover:bg-[#1A1A1A] hover:text-[#F5F0EB] transition-colors"
                >
                  {t("myAccount" as TranslationKeys)}
                </Link>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    // Navigate to account page for logout with confirm
                    window.location.href = "/account";
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400/70 hover:bg-[#1A1A1A] hover:text-red-400 transition-colors"
                >
                  {t("signOut" as TranslationKeys)}
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className={`relative transition-colors duration-300 ${headerSolid ? 'text-[#8A8580] hover:text-[#E8B4B8]' : 'text-white/50 hover:text-white'}`}
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
            className={`lg:hidden transition-colors ${headerSolid ? 'text-[#8A8580] hover:text-[#E8B4B8]' : 'text-white/50 hover:text-white'}`}
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
          <Link href="/animal-sofa-collection" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("collection")}</Link>
          <Link href="/luxury-villa-interior" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("interiorWorlds")}</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("about")}</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("contact")}</Link>
          {user ? (
            <Link href="/account" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("myAccount" as TranslationKeys)}</Link>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("signIn" as TranslationKeys)}</Link>
          )}
          <div className="flex gap-3 pt-2 border-t border-[#1A1A1A] items-center">
            <button onClick={() => { setLocale(otherLocale); setMobileOpen(false); }} className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors text-xs tracking-[0.1em] uppercase">🌐 {localeNames[otherLocale]}</button>
            <span className="text-[#555]">{region === "europe" ? "EUR" : "USD"}</span>
          </div>
        </nav>
      )}
    </header>
  );
}
