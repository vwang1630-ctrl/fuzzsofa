"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function ProcessContent() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">{t("ourProcess")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("howFuzzSofaIsMade")}
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            {t("ourProcessDesc")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Step 1 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">01</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">{t("frameConstruction")}</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("frameConstructionDesc")}
          </p>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">02</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">{t("cushionEngineering")}</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("cushionEngineeringDesc")}
          </p>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">03</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">{t("upholsteryPhase")}</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("upholsteryDesc")}
          </p>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">04</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">{t("finishingQC")}</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("finillingQCDesc")}
          </p>
        </div>

        {/* Step 5 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">05</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">{t("documentationDelivery")}</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("documentationDeliveryDesc")}
          </p>
        </div>

        <div className="border-t border-[#1A1A1A] pt-12">
          <Link
            href="/animal-sofa-collection"
            className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            {t("exploreCollection")}
          </Link>
        </div>
      </div>
    </section>
  );
}
