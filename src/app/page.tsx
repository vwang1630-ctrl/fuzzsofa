"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { products } from "@/lib/products";
import { journalArticles } from "@/lib/journal";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { AiRoomCompositeModal } from "@/components/ai-room-composite-modal";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
};

const heroScenes = [
  {
    src: "/hero-scene-1.jpg",
    alt: "Gorilla sofa in cinematic billionaire library interior",
    keys: {
      subtitle: "heroSubtitle" as const,
      title: "heroTitle" as const,
      description: "heroDescription" as const,
      cta: "exploreCollection" as const,
      aiCta: "hero2AiCta" as const,
      href: "/gorilla-sofa",
    },
    overlay: "from-[#0A0A0A]/70 via-[#0A0A0A]/25 to-transparent",
    accentColor: "#E8B4B8",
    textColor: "#F5F0EB",
    compact: false,
  },
  {
    src: "/hero-scene-2.jpg",
    alt: "Pink owl chair in dark punk concrete interior with neon lighting",
    keys: {
      subtitle: "hero2Subtitle" as const,
      title: "hero2Title" as const,
      description: "hero2Description" as const,
      cta: "hero2Cta" as const,
      aiCta: "hero2AiCta" as const,
      href: "/owl-sofa",
    },
    overlay: "from-[#0A0A0A]/85 via-[#0A0A0A]/40 to-transparent",
    accentColor: "#FF69B4",
    textColor: "#F5F0EB",
    compact: true,
  },
];

function HeroSlideshow({ current }: { current: number }) {
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
  const [heroScene, setHeroScene] = useState(0);
  const sceneConfig = heroScenes[heroScene];
  const [aiRoomOpen, setAiRoomOpen] = useState(false);
  const [aiRoomProduct, setAiRoomProduct] = useState("");

  // Auto-advance hero scenes
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroScene((prev) => (prev + 1) % heroScenes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Listen for AI room composite events
  const handleOpenAiRoom = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    setAiRoomProduct(detail?.productSlug || "");
    setAiRoomOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("open-ai-room", handleOpenAiRoom);
    return () => window.removeEventListener("open-ai-room", handleOpenAiRoom);
  }, [handleOpenAiRoom]);

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

      {/* AI Room Composite Modal */}
      <AiRoomCompositeModal
        isOpen={aiRoomOpen}
        onClose={() => setAiRoomOpen(false)}
        productSlug={aiRoomProduct}
      />

      {/* HERO: Immersive Scene Banner */}
      <section className="relative w-full flex items-end overflow-hidden" style={{ aspectRatio: '16/7', maxHeight: '82vh' }}>
        {/* Background: cinematic interior scenes */}
        <HeroSlideshow current={heroScene} />

        {/* Left-side vignette for text readability */}
        <div className={`absolute inset-0 bg-gradient-to-r ${sceneConfig.overlay}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/15" />

        {/* Hero content — editorial gallery layout */}
        <div className={`relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pb-[6%] pt-[12%] flex flex-col justify-end md:justify-center ${sceneConfig.compact ? 'max-w-[560px]' : ''}`}>

          {/* Category label — accent, uppercase, wide tracking */}
          <p
            className={`tracking-[0.35em] uppercase mb-4 md:mb-5 animate-fade-in ${sceneConfig.compact ? 'text-[9px] md:text-[10px]' : 'text-[10px] md:text-[11px]'}`}
            style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.accentColor }}
          >
            {t(sceneConfig.keys.subtitle)}
          </p>

          {/* Display title — large serif, the visual anchor */}
          <h1
            className={`font-light leading-[1.05] tracking-[0.02em] mb-4 md:mb-5 animate-fade-in-delay-1 ${sceneConfig.compact ? 'text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem]' : 'text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem]'}`}
            style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.textColor }}
          >
            {t(sceneConfig.keys.title)}
          </h1>

          {/* Thin decorative line */}
          <div className={`w-12 h-px mb-4 md:mb-5 animate-fade-in-delay-2 ${sceneConfig.compact ? '' : 'md:w-16'}`} style={{ backgroundColor: sceneConfig.accentColor + '66' }} />

          {/* Description — quiet, airy */}
          <p className={`font-light max-w-[380px] leading-[1.75] animate-fade-in-delay-2 ${sceneConfig.compact ? 'text-xs md:text-sm' : 'text-sm md:text-[15px] lg:text-base'}`} style={{ color: sceneConfig.textColor + '80' }}>
            {t(sceneConfig.keys.description)}
          </p>

          {/* CTA buttons */}
          <div className="mt-6 md:mt-7 animate-fade-in-delay-3 flex flex-wrap items-center gap-4">
            {/* Primary CTA — editorial style, hover fills with accent */}
            <Link
              href={sceneConfig.keys.href}
              className="group inline-flex items-center gap-3"
            >
              <span
                className="inline-flex items-center gap-3 px-6 py-2.5 border text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:border-transparent"
                style={{
                  borderColor: sceneConfig.textColor + '80',
                  color: sceneConfig.textColor + 'CC',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = sceneConfig.accentColor;
                  e.currentTarget.style.borderColor = sceneConfig.accentColor;
                  e.currentTarget.style.color = '#0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = sceneConfig.textColor + '80';
                  e.currentTarget.style.color = sceneConfig.textColor + 'CC';
                }}
              >
                {t(sceneConfig.keys.cta)}
              </span>
              <span className="flex items-center transition-all duration-300 group-hover:translate-x-1" style={{ color: sceneConfig.textColor + '66' }}>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 6h18M13 1l5 5-5 5" />
                </svg>
              </span>
            </Link>

            {/* AI Room Composite CTA — neon icon style */}
            {sceneConfig.keys.aiCta && (
              <button
                onClick={() => {
                  const event = new CustomEvent('open-ai-room', { detail: { productSlug: sceneConfig.keys.href.replace('/', '') } });
                  window.dispatchEvent(event);
                }}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 border text-[11px] tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                  borderColor: sceneConfig.accentColor + '50',
                  color: sceneConfig.accentColor + 'CC',
                  backgroundColor: sceneConfig.accentColor + '0A',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '18';
                  e.currentTarget.style.borderColor = sceneConfig.accentColor + '80';
                  e.currentTarget.style.color = sceneConfig.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '0A';
                  e.currentTarget.style.borderColor = sceneConfig.accentColor + '50';
                  e.currentTarget.style.color = sceneConfig.accentColor + 'CC';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                {t(sceneConfig.keys.aiCta as TranslationKeys)}
              </button>
            )}
          </div>
        </div>

        {/* Scene indicators */}
        {heroScenes.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            {heroScenes.map((scene, idx) => (
              <button
                key={scene.src}
                onClick={() => setHeroScene(idx)}
                className="w-8 h-px transition-all duration-500"
                style={{
                  backgroundColor: idx === heroScene ? sceneConfig.accentColor : sceneConfig.textColor + '30',
                }}
                aria-label={`Scene ${idx + 1}`}
              />
            ))}
          </div>
        )}
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
