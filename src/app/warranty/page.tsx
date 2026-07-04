"use client";

import { useLanguage } from "@/lib/language-context";

export default function WarrantyPage() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8580] tracking-[0.2em] uppercase mb-4">{t("support")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("warrantyTitle")}
          </h1>
          <p className="mt-6 text-lg text-[#8A8580] font-light max-w-2xl mx-auto">
            {t("warrantySubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Coverage */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("warrantyCoverage")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#E8B4B8] font-serif text-lg mb-2">{t("frameStructure")}</p>
              <p className="text-[#8A8580] text-sm">{t("frameStructureDesc")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#E8B4B8] font-serif text-lg mb-2">{t("upholsteryCraft")}</p>
              <p className="text-[#8A8580] text-sm">{t("upholsteryCraftDesc")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#E8B4B8] font-serif text-lg mb-2">{t("mechanisms")}</p>
              <p className="text-[#8A8580] text-sm">{t("mechanismsDesc")}</p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <p className="text-[#E8B4B8] font-serif text-lg mb-2">{t("surfaceMaterials")}</p>
              <p className="text-[#8A8580] text-sm">{t("surfaceMaterialsDesc")}</p>
            </div>
          </div>
        </div>

        {/* What's not covered */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("notCovered")}</h2>
          <ul className="space-y-3 text-[#8A8580]">
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("notCovered1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("notCovered2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("notCovered3")}</span>
            </li>
          </ul>
        </div>

        {/* How to claim */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("howToClaim")}</h2>
          <div className="space-y-4">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">01</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("claimStep1Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("claimStep1Desc")}</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">02</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("claimStep2Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("claimStep2Desc")}</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 flex items-start gap-4">
              <span className="text-[#E8B4B8] font-serif text-lg">03</span>
              <div>
                <p className="text-[#F5F0EB] text-sm tracking-[0.05em]">{t("claimStep3Title")}</p>
                <p className="text-[#8A8580] text-sm mt-1">{t("claimStep3Desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-[#111111] border border-[#E8B4B8]/20 p-8">
          <h3 className="font-serif text-lg text-[#F5F0EB] mb-3">{t("constructionDoc")}</h3>
          <p className="text-[#8A8580] text-sm leading-relaxed">{t("constructionDocDesc")}</p>
        </div>
      </div>
    </section>
  );
}
