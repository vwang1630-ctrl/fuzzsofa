"use client";

import { useState, useEffect } from "react";
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
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
};

const heroScenes = [
  { src: "/hero-scene-1.jpg", alt: "Gorilla sofa in cinematic billionaire library interior" },
  { src: "/hero-scene-2.jpg", alt: "Pink owl chair in dark contemporary interior" },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroScenes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroScenes.map((scene, idx) => (
        <img
          key={scene.src}
          src={scene.src}
          alt={scene.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

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

      {/* HERO: Immersive Scene Banner */}
      <section className="relative w-full flex items-start justify-center overflow-hidden" style={{ aspectRatio: '16/7', maxHeight: '82vh' }}>
        {/* Background: AI-generated luxury interior scene */}
        <HeroSlideshow />

        {/* Dark overlay — only top portion for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/15 to-[#0A0A0A]/70" />

        {/* Hero content — top area, leaving product visible below */}
        <div className="relative z-10 text-center px-6 pt-[8%] max-w-4xl">
          <p className="text-xs text-[#E8B4B8] tracking-[0.25em] uppercase mb-5 animate-fade-in">
            {t("heroSubtitle")}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-[5rem] font-light tracking-[0.08em] leading-[1.05] text-[#F5F0EB] animate-fade-in-delay-1">
            {t("siteTitle")}
          </h1>
          <p className="mt-5 text-sm md:text-base font-light text-[#F5F0EB]/50 max-w-xl mx-auto leading-[1.7] animate-fade-in-delay-2">
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Link
              href="/animal-sofa-collection"
              className="inline-flex items-center px-8 py-3 border border-[#F5F0EB] text-[#F5F0EB] text-xs tracking-[0.15em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
            >
              {t("exploreCollection")}
            </Link>
            <Link
              href="/luxury-villa-interior"
              className="inline-flex items-center px-8 py-3 border border-[#333] text-[#F5F0EB]/50 text-xs tracking-[0.15em] uppercase hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
            >
              {t("viewInteriors")}
            </Link>
          </div>
        </div>
      </section>

      {/* SCENE-BASED PRODUCT SHOWCASE */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">
                {t("animalCollectionTitle")}
              </h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("animalCollectionSubtitle")}</p>
            </div>
            <Link
              href="/animal-sofa-collection"
              className="hidden md:block text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors"
            >
              {t("viewAll")} &rarr;
            </Link>
          </div>

          {/* Scene cards: each product in its ideal interior setting */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Bear Sofa — Luxury Villa scene */}
            <Link
              href="/bear-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-b from-[#1A1510] via-[#12100C] to-[#0A0A0A] relative">
                <div className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700"
                  style={{ background: "radial-gradient(ellipse at 50% 40%, #E8B4B8, transparent 60%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-[12rem] text-[#F5F0EB]/[0.04] group-hover:text-[#E8B4B8]/[0.08] transition-all duration-700 select-none">
                    B
                  </span>
                </div>
                {/* Scene label */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("luxuryVillas")}
                  </span>
                </div>
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-1/3" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("bearSofaName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("bearSofaTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$8,200</p>
              </div>
            </Link>

            {/* Lion Sofa — Boutique Hotel scene */}
            <Link
              href="/lion-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-b from-[#101518] via-[#0C1012] to-[#0A0A0A] relative">
                <div className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700"
                  style={{ background: "radial-gradient(ellipse at 50% 40%, #E8B4B8, transparent 60%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-[12rem] text-[#F5F0EB]/[0.04] group-hover:text-[#E8B4B8]/[0.08] transition-all duration-700 select-none">
                    L
                  </span>
                </div>
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("boutiqueHotels")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-1/3" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("lionSofaName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("lionSofaTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$7,500</p>
              </div>
            </Link>

            {/* Owl Chair — Contemporary Home scene (with real image) */}
            <Link
              href="/owl-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="/products/owl/snowy-white.png"
                  alt={t("owlChairName")}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("contemporaryHomes")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("owlChairName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("owlChairTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$3,500</p>
              </div>
            </Link>

            {/* Tiger Sofa — Statement Furniture scene */}
            <Link
              href="/tiger-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-b from-[#151015] via-[#100C10] to-[#0A0A0A] relative">
                <div className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700"
                  style={{ background: "radial-gradient(ellipse at 50% 40%, #E8B4B8, transparent 60%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-[12rem] text-[#F5F0EB]/[0.04] group-hover:text-[#E8B4B8]/[0.08] transition-all duration-700 select-none">
                    T
                  </span>
                </div>
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("statementFurnitureScene")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-1/3" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("tigerSofaName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("tigerSofaTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$7,200</p>
              </div>
            </Link>

            {/* Gorilla Sofa — Sculptural Trend scene */}
            <Link
              href="/gorilla-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="/products/gorilla-sofa/gray.jpg"
                  alt={t("gorillaSofaName")}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("sculpturalTrendScene")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("gorillaSofaName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("gorillaSofaTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$7,800</p>
              </div>
            </Link>

            {/* Silverback Sofa — Boutique Hotel scene */}
            <Link
              href="/silverback-sofa"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="/products/silverback-sofa/gray.jpg"
                  alt={t("silverbackSofaName")}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] text-[#8A8580]/60 tracking-[0.15em] uppercase">
                    {t("boutiqueHotelScene")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("silverbackSofaName")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("silverbackSofaTagline")}</p>
                <p className="mt-3 text-sm text-[#F5F0EB]/60">$7,800</p>
              </div>
            </Link>

            {/* Interior Worlds card */}
            <Link
              href="/luxury-villa-interior"
              className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-[#111111] via-[#0D0D0D] to-[#0A0A0A] relative">
                <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700"
                  style={{ background: "radial-gradient(circle at 30% 70%, #E8B4B8, transparent 50%), radial-gradient(circle at 70% 30%, #E8B4B8, transparent 50%)" }}
                />
                {/* Decorative lines evoking interior architecture */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[60%] h-[1px] bg-[#F5F0EB]/[0.04] group-hover:bg-[#E8B4B8]/[0.08] transition-all duration-700" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[60%] w-[1px] bg-[#F5F0EB]/[0.04] group-hover:bg-[#E8B4B8]/[0.08] transition-all duration-700" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-1/3" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("interiorWorldsTitle")}
                </h3>
                <p className="mt-1 text-xs text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
                <p className="mt-3 text-xs tracking-[0.1em] uppercase text-[#E8B4B8]/60 group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("viewAll")} &rarr;
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* INTERIOR WORLDS */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">
                {t("interiorWorldsTitle")}
              </h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                href: "/luxury-villa-interior",
                title: t("luxuryVillas"),
                accent: "from-[#1A1510] to-[#0A0A0A]",
                label: t("luxuryVillaScene"),
              },
              {
                href: "/boutique-hotel-lobby",
                title: t("boutiqueHotels"),
                accent: "from-[#101518] to-[#0A0A0A]",
                label: t("boutiqueHotelScene"),
              },
              {
                href: "/statement-furniture",
                title: t("contemporaryHomes"),
                accent: "from-[#151015] to-[#0A0A0A]",
                label: t("statementFurnitureScene"),
              },
              {
                href: "/sculptural-furniture-trend",
                title: t("sculpturalTrend"),
                accent: "from-[#101218] to-[#0A0A0A]",
                label: t("sculpturalTrendScene"),
              },
            ].map((interior) => (
              <Link
                key={interior.href}
                href={interior.href}
                className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-56 bg-gradient-to-b ${interior.accent} relative`}>
                  <div
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                  {/* Scene label inside image area */}
                  <span className="absolute top-4 left-4 text-[10px] text-[#8A8580]/50 tracking-[0.15em] uppercase">
                    {interior.label}
                  </span>
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
      </section>

      {/* FURNITURE CONCEPTS */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">
                {t("furnitureConceptsTitle")}
              </h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("furnitureConceptsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </section>

      {/* JOURNAL PREVIEW */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">
              {t("journalTitle")}
            </h2>
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

      {/* DELIVERY BANNER */}
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
