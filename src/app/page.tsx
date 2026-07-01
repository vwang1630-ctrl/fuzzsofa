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
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: 'auto', minHeight: '65vh', maxHeight: '85vh' }}>
        <Link href={sceneConfig.keys.href} className="block absolute inset-0 z-0" aria-label={t(sceneConfig.keys.title)}>
          <HeroSlideshow current={heroScene} />
        </Link>
        <div className={`absolute inset-0 bg-gradient-to-r ${sceneConfig.overlay} hidden md:block`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/10 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/15 hidden md:block" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16 h-full flex flex-col justify-end pb-[12%] md:pb-[6%] md:pt-[8%] md:justify-start">
          <p className="tracking-[0.3em] uppercase mb-1.5 md:mb-3 text-[8px] md:text-[12px] animate-fade-in" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.accentColor }}>
            Fuzz Sofa Studio
          </p>
          <h1 className="font-light leading-[1.05] tracking-[0.02em] mb-1.5 md:mb-4 animate-fade-in-delay-1 text-[1.5rem] md:text-[3.8rem] lg:text-[4.5rem]" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.textColor }}>
            {t(sceneConfig.keys.title)}
          </h1>
          <p className="font-light text-[10px] md:text-[15px] lg:text-base max-w-[280px] md:max-w-[380px] leading-[1.6] animate-fade-in-delay-2" style={{ color: sceneConfig.textColor + '60' }}>
            Made-to-order, delivered in 1–2 weeks
          </p>
          <div className="mt-4 md:mt-6 animate-fade-in-delay-3 flex flex-col items-start gap-3">
            <button
              onClick={() => {
                const event = new CustomEvent('open-ai-room', { detail: { productSlug: sceneConfig.keys.href.replace('/', '') } });
                window.dispatchEvent(event);
              }}
              className="group inline-flex items-center gap-2.5 px-4 md:px-5 py-2.5 border text-[11px] md:text-[12px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
              style={{ borderColor: sceneConfig.accentColor + '50', color: sceneConfig.accentColor + 'CC', backgroundColor: sceneConfig.accentColor + '0A' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '18'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '80'; e.currentTarget.style.color = sceneConfig.accentColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '0A'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '50'; e.currentTarget.style.color = sceneConfig.accentColor + 'CC'; }}
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 17L16 4L30 17V28H2V17Z" fill={sceneConfig.accentColor} fillOpacity="0.9" />
                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28H7Z" fill="#0A0A0A" />
                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28" stroke={sceneConfig.accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M9.5 20C9.5 18 11 16.5 13 16.5H19C21 16.5 22.5 18 22.5 20" stroke={sceneConfig.accentColor} strokeWidth="1.3" strokeLinecap="round" fill="none" strokeOpacity="0.8" />
                <path d="M12 14V13C12 12.4 12.4 12 13 12H19C19.6 12 20 12.4 20 13V14" stroke={sceneConfig.accentColor} strokeWidth="1.1" strokeLinecap="round" fill="none" strokeOpacity="0.55" />
                <path d="M24 5L24.8 7L27 7.8L24.8 8.6L24 10.6L23.2 8.6L21 7.8L23.2 7Z" fill={sceneConfig.accentColor} fillOpacity="0.95" />
              </svg>
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
      <section className="bg-[#090909] py-5 md:py-10 border-y border-white/[0.03]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 flex flex-wrap items-center justify-center gap-4 md:gap-16 text-center">
          {[
            { icon: '✦', label: 'Studio-Crafted' },
            { icon: '◆', label: 'Quality Guarantee' },
            { icon: '◉', label: '1–2 Week Delivery' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-[#E8B4B8] text-[10px]">{item.icon}</span>
              <span className="text-[10px] md:text-[12px] tracking-[0.08em] text-[#8A8580]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>




      {/* ─── 4. FEATURED WORKS ─── */}
      <section id="featured-works" className="bg-[#090909] py-12 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="mb-8 md:mb-12 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-2">Collection</p>
              <h2 className="font-serif text-2xl md:text-4xl font-light text-[#F5F0EB] tracking-[0.02em]">
                Featured Works
              </h2>
              <p className="mt-2 text-[12px] md:text-sm text-[#8A8580]">Each piece made individually after order confirmation</p>
            </div>
            <Link href="/#featured-works" className="hidden md:flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 group/coll">
              <span>Explore Collection</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover/coll:translate-x-1 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group relative overflow-hidden border-0 md:border md:border-[#1A1A1A] hover:border-[#E8B4B8]/40 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={(product.images ?? [])[0] ?? ''}
                    alt={t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                  {/* Mobile: text overlay on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
                    <h3 className="font-serif text-[13px] font-light text-[#F5F0EB] leading-tight">
                      {t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#F5F0EB]/50">${(product.priceRange.americas[0] ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                {/* Desktop: text below image */}
                <div className="hidden md:block p-5">
                  <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                    {t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                  </h3>
                  <p className="mt-1 text-xs text-[#8A8580]">{t(slugToPrefix[product.slug] + "Tagline" as TranslationKeys)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-[#F5F0EB]/60">${(product.priceRange.americas[0] ?? 0).toLocaleString()}</p>
                    <p className="text-[12px] tracking-[0.08em] text-[#8A8580]/70">Made to order</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ─── INTERIOR WORLDS ─── */}
      <section className="bg-[#090909] py-12 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="flex items-baseline justify-between mb-8 md:mb-12">
            <div>
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-2">Spaces</p>
              <h2 className="font-serif text-2xl md:text-4xl font-light text-[#F5F0EB]">{t("interiorWorldsTitle")}</h2>
              <p className="mt-2 text-[12px] md:text-sm text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-5">
            {[
              { href: "/luxury-villa-interior", title: t("luxuryVillas"), accent: "from-[#1A1510] to-[#0A0A0A]", label: t("luxuryVillaScene") },
              { href: "/boutique-hotel-lobby", title: t("boutiqueHotels"), accent: "from-[#101518] to-[#0A0A0A]", label: t("boutiqueHotelScene") },
              { href: "/statement-furniture", title: t("contemporaryHomes"), accent: "from-[#151015] to-[#0A0A0A]", label: t("statementFurnitureScene") },
              { href: "/meteorite-ring-sofa", title: t("sculpturalTrend"), accent: "from-[#0A0A1A] to-[#0A0A0A]", label: t("sculpturalTrendScene"), image: "/products/meteorite-ring-sofa/sculptural-trend.png" },
            ].map((interior) => (
              <Link key={interior.href} href={interior.href} className="group relative overflow-hidden border-0 md:border md:border-[#1A1A1A] hover:border-[#E8B4B8]/40 hover:-translate-y-0.5 md:hover:-translate-y-1 transition-all duration-300">
                <div className={`h-44 md:h-56 bg-gradient-to-b ${interior.accent} relative`}>
                  {"image" in interior && interior.image ? (
                    <>
                      <img src={interior.image} alt={interior.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }} />
                  )}
                  {/* Mobile: title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
                    <h3 className="font-serif text-[15px] text-[#F5F0EB]">{interior.title}</h3>
                  </div>
                </div>
                {/* Desktop: title below image */}
                <div className="hidden md:block p-6">
                  <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">{interior.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL ─── */}
      <section className="bg-[#050505] py-12 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="flex items-baseline justify-between mb-8 md:mb-12">
            <div>
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-2">Editorial</p>
              <h2 className="font-serif text-2xl md:text-4xl font-light text-[#F5F0EB]">{t("journalTitle")}</h2>
            </div>
            <Link href="/journal" className="text-[11px] md:text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors tracking-[0.1em] uppercase">{t("articles")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {latestArticles.map((article) => (
              <Link key={article.slug} href={`/journal/${article.slug}`} className="group border-l border-[#1A1A1A] hover:border-[#E8B4B8] transition-colors duration-300 pl-4 md:pl-6 py-2">
                <p className="text-[10px] md:text-xs text-[#8A8580] tracking-[0.1em] uppercase">{article.category}</p>
                <h3 className="mt-2 md:mt-3 font-serif text-base md:text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300 leading-snug">{article.title}</h3>
                <p className="mt-1.5 md:mt-2 text-[12px] md:text-sm text-[#8A8580] line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
