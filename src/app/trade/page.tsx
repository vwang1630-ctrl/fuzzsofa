"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function TradePage() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8580] tracking-[0.2em] uppercase mb-4">{t("support")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("tradeTitle")}
          </h1>
          <p className="mt-6 text-lg text-[#8A8580] font-light max-w-2xl mx-auto">
            {t("tradeSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Who we work with */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("whoWeWorkWith")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 text-center">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("hospitality")}</p>
              <p className="text-[#8A8580] text-xs mt-2">{t("hotelsResorts")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 text-center">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("interiorDesign")}</p>
              <p className="text-[#8A8580] text-xs mt-2">{t("studiosFirms")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 text-center">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("retailCommercial")}</p>
              <p className="text-[#8A8580] text-xs mt-2">{t("showroomsSpaces")}</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("tradeBenefits")}</h2>
          <div className="space-y-4">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">01</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("tradeBenefit1Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("tradeBenefit1Desc")}</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">02</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("tradeBenefit2Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("tradeBenefit2Desc")}</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">03</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("tradeBenefit3Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("tradeBenefit3Desc")}</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">04</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("tradeBenefit4Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("tradeBenefit4Desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to apply */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("howToApply")}</h2>
          <p className="text-[#8A8580] leading-relaxed mb-6">{t("howToApplyDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:trade@fuzzsofa.com" className="inline-block px-8 py-3 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase text-center hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300">
              {t("emailUs")}
            </a>
            <Link href="/contact" className="inline-block px-8 py-3 border border-[#1A1A1A] text-[#8A8580] text-sm tracking-[0.1em] uppercase text-center hover:border-[#F5F0EB] hover:text-[#F5F0EB] transition-all duration-300">
              {t("contactForm")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
