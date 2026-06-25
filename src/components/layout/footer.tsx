"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="border-t border-[#1A1A1A] bg-[#050505]" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand + Manufacturing Entity */}
        <div>
          <h3 className="font-serif text-lg tracking-[0.08em] text-[#F5F0EB] mb-1">Fuzz Sofa Studio</h3>
          <p className="text-[11px] tracking-[0.08em] text-[#8A8580] mb-4">Furniture Design &amp; Production Studio</p>
          <p className="text-xs font-light text-[#8A8580]/70 leading-relaxed mb-4">
            Manufactured by XXXX Furniture Co., Ltd.<br />
            Established 2015 · China
          </p>
          <p className="text-xs text-[#8A8580] mb-4">
            <a href="mailto:support@fuzzsofa.com" className="hover:text-[#E8B4B8] transition-colors">support@fuzzsofa.com</a>
          </p>
          <p className="text-[10px] tracking-[0.08em] text-[#8A8580]/50 mb-6">Worldwide Shipping Available</p>
          <div className="flex gap-4">
            <a href="https://instagram.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://pinterest.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Pinterest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
            </a>
            <a href="https://facebook.com/fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="https://youtube.com/@fuzzsofa" target="_blank" rel="noopener noreferrer" className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" /></svg>
            </a>
          </div>
        </div>

        {/* Collection */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("collection")}</h4>
          <ul className="space-y-3">
            <li><Link href="/gorilla-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("gorillaSofaName")}</Link></li>
            <li><Link href="/owl-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("owlChairName")}</Link></li>
            <li><Link href="/silverback-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("silverbackSofaName")}</Link></li>
            <li><Link href="/meteorite-ring-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("meteoriteRingSofaName")}</Link></li>
            <li><Link href="/muscle-gorilla-sofa" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("muscleGorillaSofaName")}</Link></li>
            <li><Link href="/animal-sofa-collection" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("fullCollection")}</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("explore")}</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">About the Studio</Link></li>
            <li><Link href="/workshop" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Workshop</Link></li>
            <li><Link href="/luxury-villa-interior" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("luxuryVillaScene")}</Link></li>
            <li><Link href="/boutique-hotel-lobby" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("boutiqueHotelScene")}</Link></li>
            <li><Link href="/contact" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("contact")}</Link></li>
          </ul>
        </div>

        {/* Support + Legal */}
        <div>
          <h4 className="text-xs font-light tracking-[0.15em] uppercase text-[#F5F0EB] mb-6">{t("support")}</h4>
          <ul className="space-y-3">
            <li><Link href="/shipping-policy" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Shipping Policy</Link></li>
            <li><Link href="/refund-policy" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Refund Policy</Link></li>
            <li><Link href="/warranty" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("warranty")}</Link></li>
            <li><Link href="/privacy" className="text-sm font-light text-[#8A8580] hover:text-[#E8B4B8] transition-colors">{t("privacy")}</Link></li>
          </ul>
        </div>
      </div>

      {/* Payment Trust Bar */}
      <div className="border-t border-[#1A1A1A] px-6 py-5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.08em] text-[#8A8580]/50">
            Payments are securely processed by international payment providers.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.05em] text-[#8A8580]/40">VISA</span>
            <span className="text-[10px] tracking-[0.05em] text-[#8A8580]/40">MC</span>
            <span className="text-[10px] tracking-[0.05em] text-[#8A8580]/40">AMEX</span>
            <span className="text-[10px] tracking-[0.05em] text-[#8A8580]/40">Apple Pay</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A1A1A] px-6 py-5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p className="text-[11px] font-light text-[#8A8580]/50 tracking-[0.03em]">
            &copy; {new Date().getFullYear()} Fuzz Sofa Studio. All rights reserved.
          </p>
          <p className="text-[10px] text-[#8A8580]/30">
            Fuzz Furniture Co., Ltd. · China
          </p>
        </div>
      </div>
    </footer>
  );
}
