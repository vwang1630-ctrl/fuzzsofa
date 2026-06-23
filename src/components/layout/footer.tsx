"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer
      className="border-t border-[#1A1A1A] bg-[#0A0A0A]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand + Social */}
        <div>
          <h3 className="font-serif text-lg tracking-[0.08em] text-[#F5F0EB] mb-4">FUZZ SOFA</h3>
          <p className="text-sm font-light text-[#8A8580] leading-relaxed mb-6">
            {t("footerBrandDesc")}
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://facebook.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="https://tiktok.com/@fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-3.77-1.73v-3.31z" /></svg>
            </a>
            <a href="https://pinterest.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Pinterest">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
            </a>
            <a href="https://youtube.com/@fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" /></svg>
            </a>
          </div>
        </div>

        {/* Collection */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("collection")}</h4>
          <ul className="space-y-3">
            <li><Link href="/bear-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Bear Sofa</Link></li>
            <li><Link href="/lion-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Lion Sofa</Link></li>
            <li><Link href="/tiger-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Tiger Sofa</Link></li>
            <li><Link href="/gorilla-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Gorilla Sofa</Link></li>
            <li><Link href="/owl-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Owl Chair</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("explore")}</h4>
          <ul className="space-y-3">
            <li><Link href="/luxury-villa-interior" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Luxury Villa Interior</Link></li>
            <li><Link href="/boutique-hotel-lobby" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Boutique Hotel Lobby</Link></li>
            <li><Link href="/statement-furniture" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Statement Furniture</Link></li>
            <li><Link href="/sculptural-furniture-trend" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Sculptural Furniture Trend</Link></li>
            <li><Link href="/process" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("ourProcess")}</Link></li>
            <li><Link href="/materials" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("materialsGuide")}</Link></li>
            <li><Link href="/animal-sofa-collection" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("fullCollection")}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("support")}</h4>
          <ul className="space-y-3">
            <li><a href="mailto:hello@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("contact")}</a></li>
            <li><a href="mailto:support@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("shipping")}</a></li>
            <li><a href="mailto:warranty@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("returns")}</a></li>
            <li><a href="mailto:trade@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("trade")}</a></li>
            <li><a href="mailto:privacy@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("privacy")}</a></li>
            <li><a href="mailto:warranty@fuzzsofa.com" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("warranty")}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A1A1A] px-6 py-6 text-center">
        <p className="text-xs font-light text-[#8A8580] tracking-[0.05em]">
          &copy; 2025 Fuzz Sofa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
