"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("contact")}
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            {t("contactSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-[#111111] border border-[#E8B4B8]/30 p-8">
                <h2 className="font-serif text-2xl text-[#F5F0EB] mb-3">{t("messageReceived")}</h2>
                <p className="text-[#F5F0EB]/60">
                  {t("messageReceivedDesc")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("subject")}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                  >
                    <option value="general">{t("generalInquiry")}</option>
                    <option value="order">{t("orderStatus")}</option>
                    <option value="trade">{t("tradeBulkPricing")}</option>
                    <option value="designer">{t("talkToDesigner")}</option>
                    <option value="custom">{t("customMaterialRequest")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("message")}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  {t("sendMessage")}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-8">{t("getInTouch")}</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("email")}</p>
                <p className="text-[#F5F0EB]/70">hello@fuzzsofa.com</p>
                <p className="text-sm text-[#8A8580] mt-1">{t("generalInquiries")}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("support")}</p>
                <p className="text-[#F5F0EB]/70">support@fuzzsofa.com</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("trade")}</p>
                <p className="text-[#F5F0EB]/70">trade@fuzzsofa.com</p>
                <p className="text-sm text-[#8A8580] mt-1">{t("bulkHospitalityPricing")}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("other")}</p>
                <p className="text-[#F5F0EB]/70">warranty@fuzzsofa.com · privacy@fuzzsofa.com</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("workshop")}</p>
                <p className="text-[#F5F0EB]/70">{t("shanghaiWorkshop")}</p>
                <p className="text-sm text-[#8A8580]">{t("byAppointmentOnly")}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("responseTime")}</p>
                <p className="text-[#F5F0EB]/70">{t("within24Hours")}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("followUs")}</p>
                <div className="flex gap-4 mt-2">
                  {[
                    { href: "https://instagram.com/fuzzsofa", label: "Instagram" },
                    { href: "https://facebook.com/fuzzsofa", label: "Facebook" },
                    { href: "https://pinterest.com/fuzzsofa", label: "Pinterest" },
                    { href: "https://tiktok.com/@fuzzsofa", label: "TikTok" },
                    { href: "https://youtube.com/@fuzzsofa", label: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#F5F0EB]/40 hover:text-[#E8B4B8] transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#111111] border border-[#1A1A1A] p-6">
              <h3 className="font-serif text-lg text-[#F5F0EB] mb-3">{t("forTradeHospitality")}</h3>
              <p className="text-sm text-[#8A8580] leading-relaxed">
                {t("forTradeHospitalityDesc")}
              </p>
            </div>

            <div className="mt-6 border-t border-[#1A1A1A] pt-6">
              <div className="space-y-2 text-xs text-[#8A8580]/70 tracking-wide">
                <p>Brand: Fuzz Sofa Studio</p>
                <p>Operator: Fudehao</p>
                <p>Location: Zhejiang, China</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
