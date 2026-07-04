"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
};

interface ScenePageContentProps {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  whyThisSpaceContent: React.ReactNode;
  recommendedProducts: Product[];
  designPrinciplesContent: React.ReactNode;
  relatedScenes: { href: string; label: string }[];
  accent?: string;
}

export function ScenePageContent({
  heroLabel,
  heroTitle,
  heroSubtitle,
  whyThisSpaceContent,
  recommendedProducts,
  designPrinciplesContent,
  relatedScenes,
  accent = "from-[#151015] to-[#0A0A0A]",
}: ScenePageContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className={`aspect-square md:aspect-[21/7] bg-gradient-to-b ${accent} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 30% 60%, #E8B4B8, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">{heroLabel}</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                {heroTitle}
              </h1>
              <p className="mt-3 text-lg text-[#F5F0EB]/50 font-light max-w-2xl">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Space */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-8">{t("whyThisSpace")}</h2>
        <div className="max-w-3xl">
          {whyThisSpaceContent}
        </div>
      </section>

      {/* Recommended Pieces */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            {t("recommendedPieces")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group bg-[#111111] border border-[#1A1A1A] p-6 hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square mb-4 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                  {product.slug === "owl-sofa" ? (
                    <img src="/products/owl/snowy-white.png" alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                        style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                      />
                      <span className="font-serif text-6xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                        {product.animal.charAt(0)}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                </h3>
                <p className="text-xs text-[#8A8580] mt-1">{slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Tagline` as TranslationKeys) : product.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("designPrinciples")}</h2>
          {designPrinciplesContent}
        </div>
      </section>

      {/* Related Scenes */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("relatedScenes")}</h2>
          <div className="flex flex-wrap gap-3">
            {relatedScenes.map((scene) => (
              <Link
                key={scene.href}
                href={scene.href}
                className="text-xs tracking-[0.1em] uppercase border border-[#333] px-4 py-2 text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
              >
                {scene.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
