"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import { journalArticles } from "@/lib/journal";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-chair": "owlChair",
};

export default function HomePage() {
  const { t } = useLanguage();
  const latestArticles = journalArticles.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #E8B4B8 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E8B4B8 0%, transparent 50%)`,
        }} />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[0.05em] md:tracking-[0.2em] leading-[1.1] text-[#F5F0EB]">
            {t("siteTitle")}
          </h1>
          <p className="mt-6 text-lg md:text-xl font-light text-[#F5F0EB]/60 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/animal-sofa-collection"
              className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
            >
              {t("exploreCollection")}
            </Link>
            <Link
              href="/luxury-villa-interior"
              className="inline-flex items-center px-8 py-3 border border-[#333] text-[#F5F0EB]/50 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
            >
              {t("viewInteriors")}
            </Link>
          </div>
        </div>
      </section>

      {/* THREE WORLDS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* Animal Collection */}
        <div className="mb-24">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("animalCollectionTitle")}</h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("animalCollectionSubtitle")}</p>
            </div>
            <Link href="/animal-sofa-collection" className="hidden md:block text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors">
              {t("viewAll")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group relative bg-[#111111] border border-[#1A1A1A] p-6 hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[3/4] mb-4 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at center, #E8B4B8 0%, transparent 70%)`,
                      }}
                    />
                    <span className="font-serif text-5xl md:text-4xl lg:text-3xl text-[#F5F0EB]/10 group-hover:text-[#E8B4B8]/20 transition-colors duration-500">
                      {product.animal.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Tagline` as TranslationKeys) : product.tagline}</p>
                <p className="mt-2 text-sm text-[#F5F0EB]/50">
                  ${product.priceRange.americas[0].toLocaleString()}
                </p>
                <p className="mt-1 text-[10px] text-[#8A8580] tracking-[0.05em] uppercase">
                  {t("freeDelivery")}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Interior Worlds */}
        <div className="mb-24">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("interiorWorldsTitle")}</h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                href: "/luxury-villa-interior",
                title: t("luxuryVillas"),
                accent: "from-[#1A1510] to-[#0A0A0A]",
              },
              {
                href: "/boutique-hotel-lobby",
                title: t("boutiqueHotels"),
                accent: "from-[#101518] to-[#0A0A0A]",
              },
              {
                href: "/statement-furniture",
                title: t("contemporaryHomes"),
                accent: "from-[#151015] to-[#0A0A0A]",
              },
              {
                href: "/sculptural-furniture-trend",
                title: t("sculpturalTrend"),
                accent: "from-[#101218] to-[#0A0A0A]",
              },
            ].map((interior) => (
              <Link
                key={interior.href}
                href={interior.href}
                className="group relative bg-[#111111] border border-[#1A1A1A] overflow-hidden hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-48 bg-gradient-to-b ${interior.accent} relative`}>
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                    {interior.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Furniture Concepts */}
        <div className="mb-24">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("furnitureConceptsTitle")}</h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("furnitureConceptsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: "/process",
                title: t("ourProcess"),
                desc: t("ourProcessDesc"),
              },
              {
                href: "/materials",
                title: t("materialsGuide"),
                desc: t("materialsGuideDesc"),
              },
              {
                href: "/animal-sofa-collection",
                title: t("fullCollection"),
                desc: t("fullCollectionDesc"),
              },
            ].map((concept, i) => (
              <Link
                key={i}
                href={concept.href}
                className="group border-l-2 border-[#1A1A1A] pl-6 py-2 hover:border-[#E8B4B8] transition-colors duration-300"
              >
                <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {concept.title}
                </h3>
                <p className="mt-2 text-sm text-[#8A8580]">{concept.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Pieces */}
        <div className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB] mb-12">{t("featuredPieces")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.slice(0, 2).map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group relative bg-[#111111] border border-[#1A1A1A] overflow-hidden hover:border-[#E8B4B8]/40 transition-all duration-300"
              >
                <div className="aspect-[16/10] bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] relative">
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] to-transparent">
                    <p className="text-xs text-[#E8B4B8]/60 tracking-[0.1em] uppercase">{slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                    {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#8A8580]">{slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Tagline` as TranslationKeys) : product.tagline}</p>
                  <p className="mt-3 text-[#F5F0EB]/70">${product.priceRange.americas[0].toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Journal Preview */}
        <div>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("journalTitle")}</h2>
            <p className="text-sm text-[#8A8580]">{t("journalSubtitle")}</p>
            <Link href="/journal" className="text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors">
              {t("articles")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group border-t border-[#1A1A1A] pt-6 hover:border-[#E8B4B8] transition-colors duration-300"
              >
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{article.category}</p>
                <h3 className="mt-3 font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300 leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-[#8A8580] line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="border-t border-b border-[#1A1A1A] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
          <p className="text-sm text-[#F5F0EB]/60">
            <span className="text-[#E8B4B8]">&#10003;</span> {t("freeDelivery")}
          </p>
          <p className="text-sm text-[#F5F0EB]/60">
            <span className="text-[#E8B4B8]">&#10003;</span> {t("qualityGuarantee")}
          </p>
          <p className="text-sm text-[#F5F0EB]/60">
            <span className="text-[#E8B4B8]">&#10003;</span> {t("madeToOrder")}
          </p>
        </div>
      </section>
    </>
  );
}
