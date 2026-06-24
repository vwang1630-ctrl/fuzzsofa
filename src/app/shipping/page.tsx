"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function ShippingPage() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8580] tracking-[0.2em] uppercase mb-4">{t("support")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("shippingTitle")}
          </h1>
          <p className="mt-6 text-lg text-[#8A8580] font-light max-w-2xl mx-auto">
            {t("shippingSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* White Glove Delivery */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("whiteGloveDelivery")}</h2>
          <p className="text-[#8A8580] leading-relaxed mb-6">{t("whiteGloveDesc")}</p>
          <div className="bg-[#111111] border border-[#1A1A1A] p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">01</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("shippingStep1Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("shippingStep1Desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">02</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("shippingStep2Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("shippingStep2Desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">03</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("shippingStep3Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("shippingStep3Desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">04</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("shippingStep4Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("shippingStep4Desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regions */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("shippingRegions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em] mb-2">{t("americasLabel")}</p>
              <p className="text-[#8A8580] text-sm">{t("americasShippingTime")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em] mb-2">{t("europeLabel")}</p>
              <p className="text-[#8A8580] text-sm">{t("europeShippingTime")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em] mb-2">{t("middleEastLabel")}</p>
              <p className="text-[#8A8580] text-sm">{t("middleEastShippingTime")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#F5F0EB] text-sm tracking-[0.05em] mb-2">{t("seAsiaLabel")}</p>
              <p className="text-[#8A8580] text-sm">{t("seAsiaShippingTime")}</p>
            </div>
          </div>
        </div>

        {/* Packaging */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("packagingTitle")}</h2>
          <p className="text-[#8A8580] leading-relaxed">{t("packagingDesc")}</p>
        </div>

        {/* Tracking */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-center">
          <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{t("trackYourOrder")}</h3>
          <p className="text-[#8A8580] text-sm mb-6">{t("trackYourOrderDesc")}</p>
          <Link href="/contact" className="inline-block px-8 py-3 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300">
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
