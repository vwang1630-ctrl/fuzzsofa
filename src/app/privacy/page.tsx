"use client";

import { useLanguage } from "@/lib/language-context";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8580] tracking-[0.2em] uppercase mb-4">{t("support")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("privacyTitle")}
          </h1>
          <p className="mt-6 text-lg text-[#8A8580] font-light max-w-2xl mx-auto">
            {t("privacySubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Data We Collect */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("dataWeCollect")}</h2>
          <ul className="space-y-3 text-[#8A8580]">
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("dataCollect1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("dataCollect2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("dataCollect3")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("dataCollect4")}</span>
            </li>
          </ul>
        </div>

        {/* How We Use */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("howWeUseData")}</h2>
          <p className="text-[#8A8580] leading-relaxed">{t("howWeUseDataDesc")}</p>
        </div>

        {/* Data Protection */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("dataProtection")}</h2>
          <p className="text-[#8A8580] leading-relaxed">{t("dataProtectionDesc")}</p>
        </div>

        {/* Your Rights */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("yourRights")}</h2>
          <ul className="space-y-3 text-[#8A8580]">
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("right1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("right2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("right3")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#E8B4B8] mt-1">—</span>
              <span>{t("right4")}</span>
            </li>
          </ul>
        </div>

        {/* Cookies */}
        <div>
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("cookiesTitle")}</h2>
          <p className="text-[#8A8580] leading-relaxed">{t("cookiesDesc")}</p>
        </div>

        {/* Contact */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-center">
          <p className="text-[#8A8580] text-sm">{t("privacyContact")}</p>
          <a href="mailto:privacy@fuzzsofa.com" className="text-[#E8B4B8] text-sm hover:underline mt-2 inline-block">privacy@fuzzsofa.com</a>
        </div>
      </div>
    </section>
  );
}
