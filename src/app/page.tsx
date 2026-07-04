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
    objectPosition: "center 20%",
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
    objectPosition: "center 25%",
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
          style={{ objectPosition: scene.objectPosition }}
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
      <section className="relative w-full overflow-hidden">
        {/* ── Mobile Hero (aspect 3/4, editorial overlay) ── */}
        <div className="sm:hidden relative aspect-[3/4]">
          <Link href={sceneConfig.keys.href} className="block absolute inset-0" aria-label={t(sceneConfig.keys.title)}>
            <HeroSlideshow current={heroScene} />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-16 z-20">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-[#E8B4B8]/70" style={{ fontFamily: 'var(--font-serif)' }}>
              Fuzz Sofa Studio
            </p>
            <h1 className="text-[1.5rem] font-light leading-[1.15] tracking-[0.02em] mb-3 max-w-[280px]" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.textColor }}>
              {t(sceneConfig.keys.title)}
            </h1>
            <p className="text-[11px] font-light leading-[1.5] mb-5 max-w-[260px]" style={{ color: sceneConfig.textColor, opacity: 0.5 }}>
              Made-to-order, delivered in 1–2 weeks
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent('open-ai-room', { detail: { productSlug: sceneConfig.keys.href.replace('/', '') } });
                window.dispatchEvent(event);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E8B4B8]/25 text-[9px] tracking-[0.18em] uppercase text-[#E8B4B8]/70 transition-all duration-300 cursor-pointer hover:bg-[#E8B4B8]/10 hover:border-[#E8B4B8]/45 active:scale-[0.97]"
            >
              <svg width="13" height="13" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 17L16 4L30 17V28H2V17Z" fill="#E8B4B8" fillOpacity="0.9" />
                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28H7Z" fill="#0A0A0A" />
                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28" stroke="#E8B4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M24 5L24.8 7L27 7.8L24.8 8.6L24 10.6L23.2 8.6L21 7.8L23.2 7Z" fill="#E8B4B8" fillOpacity="0.95" />
              </svg>
              {t(sceneConfig.keys.aiCta as TranslationKeys)}
            </button>
          </div>
        </div>

        {/* ── Desktop Hero (exact 021a54d version) ── */}
        <div className="hidden sm:block relative aspect-[16/10] lg:aspect-[16/9] xl:aspect-[16/8]" style={{ maxHeight: '90vh' }}>
          <Link href={sceneConfig.keys.href} className="block absolute inset-0 z-0" aria-label={t(sceneConfig.keys.title)}>
            <HeroSlideshow current={heroScene} />
          </Link>
          <div className={`absolute inset-0 bg-gradient-to-r ${sceneConfig.overlay}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/15" />

          <div className="relative z-10 w-full h-full flex flex-col justify-center items-start pl-[8%] md:pl-[20%] lg:pl-[28%] xl:pl-[34%]">
            <div className="max-w-[460px]">
              <p className="tracking-[0.35em] uppercase mb-3 text-[12px] animate-fade-in" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.accentColor }}>
                Fuzz Sofa Studio
              </p>
              <h1 className="font-light leading-[1.08] tracking-[0.02em] mb-4 md:mb-5 animate-fade-in-delay-1 text-[2.2rem] md:text-[2.8rem] xl:text-[3.5rem]" style={{ fontFamily: 'var(--font-serif)', color: sceneConfig.textColor }}>
                {t(sceneConfig.keys.title)}
              </h1>
              <p className="font-light text-sm md:text-base max-w-[380px] leading-[1.75] animate-fade-in-delay-2" style={{ color: sceneConfig.textColor + '80' }}>
                Made-to-order, delivered in 1–2 weeks
              </p>
              <div className="mt-5 md:mt-6 animate-fade-in-delay-3 flex flex-col items-start gap-3">
                <button
                  onClick={() => {
                    const event = new CustomEvent('open-ai-room', { detail: { productSlug: sceneConfig.keys.href.replace('/', '') } });
                    window.dispatchEvent(event);
                  }}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 border text-[12px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
                  style={{ borderColor: sceneConfig.accentColor + '50', color: sceneConfig.accentColor + 'CC', backgroundColor: sceneConfig.accentColor + '0A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '18'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '80'; e.currentTarget.style.color = sceneConfig.accentColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sceneConfig.accentColor + '0A'; e.currentTarget.style.borderColor = sceneConfig.accentColor + '50'; e.currentTarget.style.color = sceneConfig.accentColor + 'CC'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                  {t(sceneConfig.keys.aiCta as TranslationKeys)}
                </button>
              </div>
            </div>
          </div>

          {heroScenes.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
              {heroScenes.map((scene, idx) => (
                <button key={scene.src} onClick={() => setHeroScene(idx)} className="w-8 h-px transition-all duration-500" style={{ backgroundColor: idx === heroScene ? sceneConfig.accentColor : sceneConfig.textColor + '30' }} aria-label={`Scene ${idx + 1}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 2. TRUST BAR ─── */}
      <section className="bg-[#090909] py-4 md:py-5 border-y border-white/[0.03] md:border-0">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 flex flex-wrap items-center justify-center gap-5 md:gap-16 text-center">
          {[
            { icon: '✦', label: 'Studio-Crafted', labelDesktop: 'Studio-Crafted Furniture' },
            { icon: '◆', label: 'Quality Guarantee', labelDesktop: 'Made-to-Order Quality Guarantee' },
            { icon: '◉', label: '1–2 Week Delivery', labelDesktop: '1–2 Week Delivery' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 md:gap-2.5">
              <span className="text-[#E8B4B8] text-[11px] md:text-[12px]">{item.icon}</span>
              <span className="text-[11px] md:text-[12px] tracking-[0.1em] md:tracking-[0.08em] text-[#8A8580]">
                <span className="sm:hidden">{item.label}</span>
                <span className="hidden sm:inline">{item.labelDesktop}</span>
              </span>
            </div>
          ))}
        </div>
      </section>




      {/* ─── 4. FEATURED WORKS ─── */}
      <section id="featured-works" className="bg-[#090909] pt-8 md:pt-14 pb-10 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="mb-6 md:mb-12 flex items-end justify-between">
            <div>
              <p className="sm:hidden text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-1.5 md:mb-2">Collection</p>
              <h2 className="font-serif text-xl md:text-4xl font-light text-[#F5F0EB] tracking-[0.02em]">
                Featured Works
              </h2>
              <p className="mt-1.5 md:mt-2 text-[11px] md:text-sm text-[#8A8580]">Each piece made individually after order confirmation</p>
            </div>
            <Link href="/#featured-works" className="hidden sm:flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 group/coll">
              <span>Explore Collection</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover/coll:translate-x-1 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group relative overflow-hidden"
              >
                {/* Mobile: image + text below with breathing room */}
                <div className="sm:hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={(product.images ?? [])[0] ?? ''}
                      alt={t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-3 pb-2">
                    <h3 className="font-serif text-[13px] font-light text-[#F5F0EB] leading-snug tracking-[0.02em] group-hover:text-[#E8B4B8] transition-colors duration-300">
                      {t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                    </h3>
                    <p className="mt-1 text-[12px] text-[#8A8580] tracking-[0.04em]">${(product.priceRange.americas[0] ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                {/* Desktop: image + text below */}
                <div className="hidden sm:block">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={(product.images ?? [])[0] ?? ''}
                      alt={t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-4 pb-2">
                    <h3 className="font-serif text-xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                      {t(slugToPrefix[product.slug] + "Name" as TranslationKeys)}
                    </h3>
                    <p className="mt-1 text-xs text-[#8A8580]">{t(slugToPrefix[product.slug] + "Tagline" as TranslationKeys)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-[#F5F0EB]/60">${(product.priceRange.americas[0] ?? 0).toLocaleString()}</p>
                      <p className="text-[12px] tracking-[0.08em] text-[#8A8580]/70">Made to order (1–2 weeks)</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ─── INTERIOR WORLDS ─── */}
      <section className="bg-[#090909] py-10 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="flex items-baseline justify-between mb-6 md:mb-12">
            <div>
              <p className="sm:hidden text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-1.5 md:mb-2">Spaces</p>
              <h2 className="font-serif text-xl md:text-4xl font-light text-[#F5F0EB]">{t("interiorWorldsTitle")}</h2>
              <p className="mt-1.5 md:mt-2 text-[11px] md:text-sm text-[#8A8580]">{t("interiorWorldsSubtitle")}</p>
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
                <div className="overflow-hidden">
                  <div className={`h-36 md:h-56 bg-gradient-to-b ${interior.accent} relative overflow-hidden`}>
                    {"image" in interior && interior.image ? (
                      <img src={interior.image} alt={interior.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }} />
                    )}
                  </div>
                  <div className="p-3 md:p-6">
                    <h3 className="font-serif text-[13px] md:text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">{interior.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL ─── */}
      <section className="bg-[#050505] py-10 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="flex items-baseline justify-between mb-6 md:mb-12">
            <div>
              <p className="sm:hidden text-[10px] text-[#E8B4B8]/60 tracking-[0.25em] uppercase mb-1.5 md:mb-2">Editorial</p>
              <h2 className="font-serif text-xl md:text-4xl font-light text-[#F5F0EB]">{t("journalTitle")}</h2>
            </div>
            <Link href="/journal" className="text-[10px] md:text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors">{t("articles")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {latestArticles.map((article) => (
              <Link key={article.slug} href={`/journal/${article.slug}`} className="group border-l md:border-l-2 border-[#1A1A1A] hover:border-[#E8B4B8] transition-colors duration-300 pl-4 md:pl-6 py-2">
                <p className="text-[10px] md:text-xs text-[#8A8580] tracking-[0.1em] uppercase">{article.category}</p>
                <h3 className="mt-2 md:mt-3 font-serif text-[15px] md:text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300 leading-snug">{article.title}</h3>
                <p className="mt-1.5 md:mt-2 text-[11px] md:text-sm text-[#8A8580] line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
