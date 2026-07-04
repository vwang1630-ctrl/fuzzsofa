"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function MaterialsContent() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      {/* Hero */}
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">{t("materialsTitle")}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            {t("ourMaterials")}
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            {t("materialsGuideDesc")}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Cloud Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">{t("cloudTouch")}</h2>
          <p className="text-sm text-[#8A8580] mb-10">{t("cloudTouchDesc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                name: "Bouclé",
                desc: "A textured, looped yarn fabric that creates a soft, inviting surface with visual depth. Ideal for residential spaces where the furniture invites touch.",
                colors: ["Arctic White", "Midnight", "Saddle Tan", "Ivory"],
                use: "Bear Sofa, Gorilla Sofa, Owl Chair",
              },
              {
                name: "Wool",
                desc: "Naturally flame-retardant and exceptionally durable. Wool maintains its appearance over years of use and develops a gentle patina that adds character.",
                colors: ["Charcoal", "Deep Burgundy", "Stone Grey", "Dusty Rose"],
                use: "Bear Sofa, Lion Sofa, Owl Chair",
              },
              {
                name: "Linen Blend",
                desc: "Linen blends combine the cool, breathable quality of natural linen with synthetic fibers for enhanced durability and wrinkle resistance.",
                colors: ["Sand", "Ivory", "Navy", "Storm Grey"],
                use: "Bear Sofa, Lion Sofa, Tiger Sofa",
              },
              {
                name: "Velvet",
                desc: "High-pile construction creates dramatic light-and-shadow effects across the fabric surface. Particularly effective on sculptural pieces.",
                colors: ["Forest Green", "Royal Navy", "Burnt Orange", "Sage Green", "Charcoal"],
                use: "Bear Sofa, Tiger Sofa, Owl Chair",
              },
            ].map((fabric) => (
              <div key={fabric.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{fabric.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{fabric.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fabric.colors.map((c) => (
                    <span key={c} className="text-xs text-[#8A8580] border border-[#1A1A1A] px-2 py-1">{c}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#8A8580]">{t("usedIn")}: {fabric.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wild Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">{t("wildTouch")}</h2>
          <p className="text-sm text-[#8A8580] mb-10">{t("wildTouchDesc")}</p>
          <div className="space-y-6">
            {[
              { name: "Mohair Blend", desc: "Long-fiber mohair creates a subtle sheen with a deep, fuzzy texture. Resistant to crushing and fading." },
              { name: "Chenille", desc: "Woven from spun yarns that create a velvety, iridescent surface. Offers the softness of velvet with greater durability." },
              { name: "Tweed", desc: "Classic tweed weaves combine multiple fiber colors into a heathered, complex surface. Adds visual warmth without sacrificing sophistication." },
            ].map((item) => (
              <div key={item.name} className="border-b border-[#1A1A1A] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-2">{item.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leather Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">{t("leatherTouch")}</h2>
          <p className="text-sm text-[#8A8580] mb-10">{t("leatherTouchDesc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                name: "Aniline Leather",
                desc: "The most natural leather finish. Retains the hide's original surface with minimal treatment. Develops a rich patina with use.",
                colors: ["Cognac", "Desert Tan", "Russet", "Camel"],
                use: "Bear Sofa, Lion Sofa, Tiger Sofa, Gorilla Sofa",
              },
              {
                name: "Full-grain Leather",
                desc: "Uses the complete hide with all natural markings intact. The most durable leather option. Surface breathes naturally.",
                colors: ["Midnight Black", "Black"],
                use: "Gorilla Sofa, Lion Sofa",
              },
              {
                name: "Heritage Leather",
                desc: "Semi-aniline finish balancing natural character with enhanced stain resistance. Offers the warmth of aniline with greater practicality.",
                colors: ["Burgundy", "Oxblood", "Espresso"],
                use: "Bear Sofa, Lion Sofa, Gorilla Sofa",
              },
              {
                name: "Vegetable-tanned Leather",
                desc: "Tanned using traditional plant-based methods without chromium. Ages from light to deep amber over years. Most environmentally conscious option.",
                colors: ["Natural", "Olive"],
                use: "Tiger Sofa, Bear Sofa, Gorilla Sofa",
              },
            ].map((leather) => (
              <div key={leather.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{leather.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{leather.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {leather.colors.map((c) => (
                    <span key={c} className="text-xs text-[#8A8580] border border-[#1A1A1A] px-2 py-1">{c}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#8A8580]">{t("usedIn")}: {leather.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Material Comparison Table */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("comparisonTable")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="text-left py-4 pr-4 text-[#F5F0EB] font-normal">{t("category")}</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">{t("durability")}</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">{t("maintenance")}</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">{t("bestFor")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">{t("cloudTouch")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("mediumHigh")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("cloudMaintenance")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("residentialLowTraffic")}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">{t("wildTouch")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("high")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("wildMaintenance")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("residentialStatement")}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">{t("leatherTouch")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("veryHigh")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("leatherMaintenance")}</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">{t("contractHighTraffic")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Care Guide */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("careGuide")}</h2>
          <div className="space-y-6 max-w-3xl">
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">{t("fabricCare")}</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{t("fabricCareDesc")}</p>
            </div>
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">{t("leatherCare")}</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{t("leatherCareDesc")}</p>
            </div>
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">{t("frameMaintenance")}</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{t("frameMaintenanceDesc")}</p>
            </div>
          </div>
        </div>

        {/* Frame Materials */}
        <div>
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("frameStructure")}</h2>
          <div className="space-y-6">
            {[
              { wood: "Oak", desc: "Used in Bear Sofa and Gorilla Sofa. Dense, strong, with a prominent grain." },
              { wood: "Walnut", desc: "Used in Lion Sofa and Owl Chair. Rich, dark tones with a fine, flowing grain." },
              { wood: "Ash", desc: "Used in Tiger Sofa. Light, strong, and flexible with pale color and bold grain." },
            ].map((item) => (
              <div key={item.wood} className="border-b border-[#1A1A1A] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-2">FSC-Certified {item.wood}</h3>
                <p className="text-sm text-[#F5F0EB]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#1A1A1A] pt-12">
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
