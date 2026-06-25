"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { products } from "@/lib/products";
import { journalArticles } from "@/lib/journal";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { websiteJsonLd } from "@/lib/seo";
import { AiRoomCompositeModal } from "@/components/ai-room-composite-modal";

const slugToPrefix: Record<string, string> = {
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  "muscle-gorilla-sofa": "muscleGorillaSofa",
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
      aiCta: "aiRoomTitle" as const,
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
      aiCta: "aiRoomTitle" as const,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroScene((prev) => (prev + 1) % heroScenes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <AiRoomCompositeModal
        isOpen={aiRoomOpen}
        onClose={() => setAiRoomOpen(false)}
        productSlug={aiRoomProduct}
      />

      {/* ─── 1. HERO ─── */}
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7', maxHeight: '82vh' }}>
        <Link href={sceneConfig.keys.href} className="block absolute inset-0 z-0" aria-label={t(sceneConfig.keys.title)}>
          <HeroSlideshow current={heroScene} />
        </Link>
        <div className={`absolute inset-0 bg-gradient-to-r ${sceneConfig.overlay}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/15" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pb-[6%] pt-[8%] flex flex-col justify-end md:justify-start">
          <p className="tracking-[0.35em] uppercase mb-3 text-[10px] md:text-[11px] animate-fade-in" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.accentColor }}>
            Fuzz Sofa Studio
          </p>
          <h1 className="font-light leading-[1.05] tracking-[0.02em] mb-4 md:mb-5 animate-fade-in-delay-1 text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem]" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.textColor }}>
            {t(sceneConfig.keys.title)}
          </h1>
          <p className="font-light text-sm md:text-[15px] lg:text-base max-w-[420px] leading-[1.75] animate-fade-in-delay-2" style={{ color: sceneConfig.textColor + '80' }}>
            Sculptural Sofas for Contemporary Interiors
          </p>
          {/* Trust line */}
          <p className="mt-3 text-[11px] tracking-[0.1em] text-[#8A8580] animate-fade-in-delay-2">
            10+ years of studio-based furniture production experience
          </p>
          <p className="mt-1 text-[10px] tracking-[0.1em] text-[#8A8580]/50 animate-fade-in-delay-2">
            Made-to-order · Designed &amp; crafted in China
          </p>
          <div className="mt-5 md:mt-6 animate-fade-in-delay-3 flex flex-col items-start gap-3">
            <button
              onClick={() => {
                const event = new CustomEvent('open-ai-room', { detail: { productSlug: sceneConfig.keys.href.replace('/', '') } });
                window.dispatchEvent(event);
              }}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 border text-[11px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ borderColor: sceneConfig.accentColor + '50', color: sceneConfig.accentColor + 'CC', backgroundColor: sceneConfig.accentColor + '0A' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '18'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '80'; e.currentTarget.style.color = sceneConfig.accentColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '0A'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '50'; e.currentTarget.style.color = sceneConfig.accentColor + 'CC'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              {t(sceneConfig.keys.aiCta as TranslationKeys)}
            </button>
          </div>
        </div>

        {heroScenes.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            {heroScenes.map((scene, idx) => (
              <button key={scene.src} onClick={() => setHeroScene(idx)} className="w-8 h-px transition-all duration-500" style={{ backgroundColor: idx === heroScene ? sceneConfig.accentColor : sceneConfig.textColor + '30' }} aria-label={`Scene ${idx + 1}`} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 2. TRUST BAR ─── */}
      <section className="bg-[#090909] py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {[
            { icon: '✦', label: 'Made-to-order production only' },
            { icon: '◆', label: 'Studio-crafted furniture pieces' },
            { icon: '◉', label: 'International shipping available' },
            { icon: '✧', label: 'Custom dimensions supported' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="text-[#E8B4B8] text-[10px]">{item.icon}</span>
              <span className="text-[11px] tracking-[0.08em] text-[#8A8580]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. STUDIO STATEMENT ─── */}
      <section className="bg-[#050505] py-20 md:py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <p className="text-[#F5F0EB] leading-[1.7]">
            We design sculptural furniture pieces through a studio-based production system, where each object is made individually after order confirmation.
          </p>
        </div>
      </section>

      {/* ─── 4. FEATURED WORKS ─── */}
      <section className="bg-[#090909] py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB] tracking-[0.02em]">
              Featured Works
            </h2>
            <p className="mt-2 text-sm text-[#8A8580]">Each piece made individually after order confirmation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={(product.images ?? [])[0] ?? ''}
                    alt={t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                    {t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                  </h3>
                  <p className="mt-1 text-xs text-[#8A8580]">{t(slugToPrefix[product.slug] + "Tagline" as TranslationKeys)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-[#F5F0EB]/60">${(product.priceRange.americas[0] ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] tracking-[0.08em] text-[#8A8580]/70">Made to order (3–6 weeks)</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ─── INTERIOR WORLDS ─── */}
      <section className="bg-[#090909] py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("interiorWorldsTitle")}</h2>
              <p className="mt-2 text-sm text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { href: "/luxury-villa-interior", title: t("luxuryVillas"), accent: "from-[#1A1510] to-[#0A0A0A]", label: t("luxuryVillaScene") },
              { href: "/boutique-hotel-lobby", title: t("boutiqueHotels"), accent: "from-[#101518] to-[#0A0A0A]", label: t("boutiqueHotelScene") },
              { href: "/statement-furniture", title: t("contemporaryHomes"), accent: "from-[#151015] to-[#0A0A0A]", label: t("statementFurnitureScene") },
              { href: "/meteorite-ring-sofa", title: t("sculpturalTrend"), accent: "from-[#0A0A1A] to-[#0A0A0A]", label: t("sculpturalTrendScene"), image: "/products/meteorite-ring-sofa/sculptural-trend.png" },
            ].map((interior) => (
              <Link key={interior.href} href={interior.href} className="group relative overflow-hidden border border-[#1A1A1A] hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300">
                <div className={`h-56 bg-gradient-to-b ${interior.accent} relative`}>
                  {"image" in interior && interior.image ? (
                    <>
                      <img src={interior.image} alt={interior.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <div className="absolute bottom-0 right-0 w-[30%] h-[15%] bg-gradient-to-tl from-[#0A0A0A] to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }} />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">{interior.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL ─── */}
      <section className="bg-[#050505] py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">{t("journalTitle")}</h2>
            <Link href="/journal" className="text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors">{t("articles")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Link key={article.slug} href={`/journal/${article.slug}`} className="group border-l-2 border-[#1A1A1A] pl-6 py-2 hover:border-[#E8B4B8] transition-colors duration-300">
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{article.category}</p>
                <h3 className="mt-3 font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300 leading-snug">{article.title}</h3>
                <p className="mt-2 text-sm text-[#8A8580] line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
