"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, getPrice, formatPrice, type Region } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";

interface MobileProductDetailProps {
  product: Product;
  region: Region;
  productImages: Record<string, string[]>;
  relatedProducts: Product[];
  spaceImages: { image: string; titleKey?: string; title?: string; descKey: string }[];
  storySketchMap: Record<string, string>;
  materialsCardsMap: Record<string, { titleKey: string; descKey: string; icon: string }[]>;
  colorNameKeyMap: Record<string, string>;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export default function MobileProductDetail({
  product,
  region,
  productImages,
  relatedProducts,
  spaceImages,
  storySketchMap,
  materialsCardsMap,
  colorNameKeyMap,
  onBuyNow,
  onAddToCart,
}: MobileProductDetailProps) {
  const { t } = useLanguage();
  const images = productImages[product.slug] || product.images || [];
  const displayPrice = formatPrice(getPrice(product, region), region);
  const sketchSrc = storySketchMap[product.slug];
  const materialCards = materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"] || [];

  /* ── i18n helpers ── */
  const slugToPrefix: Record<string, string> = {
    "gorilla-sofa": "gorillaSofa",
    "silverback-sofa": "silverbackSofa",
    "owl-sofa": "owlChair",
    "meteorite-ring-sofa": "meteoriteRingSofa",
    "muscle-gorilla-sofa": "muscleGorillaSofa"
  };
  const prefix = slugToPrefix[product.slug] || "";
  const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : product.name;
  const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : product.tagline;
  const productConcept = prefix ? t(`${prefix}Concept` as TranslationKeys) : product.concept;

  const animalKeyMap: Record<string, string> = {
    gorilla: "animalGorilla", silverback: "animalSilverback", owl: "animalOwl",
    "meteorite ring": "animalMeteoriteRing", "muscle gorilla": "animalMuscleGorilla"
  };
  const collectionName = `${t((animalKeyMap[product.animal] || "animalGorilla") as TranslationKeys)} ${t("collection").toUpperCase()}`;

  /* Feature data matching existing product-client.tsx structure */
  const featureData: Record<string, { titleKey: string; descKey: string; fallbackTitle: string; fallbackDesc: string }[]> = {
    "gorilla-sofa": [
      { titleKey: "gorillaFeat1", descKey: "gorillaFeat1Desc", fallbackTitle: "Comfort Support Structure", fallbackDesc: "Ergonomic curved support for long-hour comfortable seating" },
      { titleKey: "gorillaFeat2", descKey: "gorillaFeat2Desc", fallbackTitle: "High Density Shaped Foam", fallbackDesc: "Custom molded foam, no deformation after years of use" },
      { titleKey: "gorillaFeat3", descKey: "gorillaFeat3Desc", fallbackTitle: "Galvanized Steel Frame", fallbackDesc: "Rust-proof solid metal internal support structure" },
      { titleKey: "gorillaFeat4", descKey: "gorillaFeat4Desc", fallbackTitle: "Matches Luxury Living Rooms", fallbackDesc: "Sculptural design fits villa, hotel & minimalist space" },
    ],
    "owl-sofa": [
      { titleKey: "owlFeat1", descKey: "owlFeat1Desc", fallbackTitle: "Owl-Inspired Ergonomic Curve", fallbackDesc: "Wrap-around backrest inspired by owl wings for full support" },
      { titleKey: "owlFeat2", descKey: "owlFeat2Desc", fallbackTitle: "Premium Velvet Upholstery", fallbackDesc: "Stain-resistant velvet with rich texture and color depth" },
      { titleKey: "owlFeat3", descKey: "owlFeat3Desc", fallbackTitle: "Solid Wood Base", fallbackDesc: "Natural walnut wood legs with anti-scratch pads" },
      { titleKey: "owlFeat4", descKey: "owlFeat4Desc", fallbackTitle: "Modular Design", fallbackDesc: "Configurable left/right orientation for any room layout" },
    ],
    "silverback-sofa": [
      { titleKey: "silverbackFeat1", descKey: "silverbackFeat1Desc", fallbackTitle: "Dominant Presence", fallbackDesc: "Oversized sculptural silhouette commands any space" },
      { titleKey: "silverbackFeat2", descKey: "silverbackFeat2Desc", fallbackTitle: "Reinforced Steel Core", fallbackDesc: "Commercial-grade frame for heavy-duty long-term use" },
    ],
    "meteorite-ring-sofa": [
      { titleKey: "meteorFeat1", descKey: "meteorFeat1Desc", fallbackTitle: "Comfort Support Structure", fallbackDesc: "Ergonomic curved support for long-hour comfortable seating" },
      { titleKey: "meteorFeat2", descKey: "meteorFeat2Desc", fallbackTitle: "High Density Shaped Foam", fallbackDesc: "Custom molded foam, no deformation after years of use" },
      { titleKey: "meteorFeat3", descKey: "meteorFeat3Desc", fallbackTitle: "Galvanized Steel Frame", fallbackDesc: "Rust-proof solid metal internal support structure" },
      { titleKey: "meteorFeat4", descKey: "meteorFeat4Desc", fallbackTitle: "Matches Luxury Living Rooms", fallbackDesc: "Sculptural design fits villa, hotel & minimalist space" },
      { titleKey: "meteorFeat5", descKey: "meteorFeat5Desc", fallbackTitle: "Long-Term Anti-Collapse", fallbackDesc: "Multi-layer filling structure to avoid sinking & sagging" },
    ],
    "muscle-gorilla-sofa": [
      { titleKey: "muscleGorillaFeat1", descKey: "muscleGorillaFeat1Desc", fallbackTitle: "Power Ergonomics", fallbackDesc: "Dynamic lumbar support inspired by gorilla posture" },
      { titleKey: "muscleGorillaFeat2", descKey: "muscleGorillaFeat2Desc", fallbackTitle: "High-Density Memory Foam", fallbackDesc: "Pressure-responsive foam for personalized comfort" },
      { titleKey: "muscleGorillaFeat3", descKey: "muscleGorillaFeat3Desc", fallbackTitle: "Carbon Steel Skeleton", fallbackDesc: "Ultra-strong frame with 10-year structural warranty" },
      { titleKey: "muscleGorillaFeat4", descKey: "muscleGorillaFeat4Desc", fallbackTitle: "Statement Sculpture", fallbackDesc: "Museum-worthy design that transforms any interior" },
    ],
  };
  const feats = featureData[product.slug] || [];

  /* ── state ── */
  const [activeIdx, setActiveIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCm, setShowCm] = useState(true);

  /* ── color data ── */
  const allColors: { type: string; opt: string; hex: string; globalIdx: number }[] = [];
  if (product.materialOptions) {
    let gIdx = 0;
    product.materialOptions.forEach(m => {
      m.options.forEach((opt, i) => {
        allColors.push({ type: m.type, opt, hex: m.colors[i], globalIdx: gIdx++ });
      });
    });
  }

  /* ── gallery swipe ── */
  const galleryRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setActiveIdx(prev => {
        const next = diff > 0 ? Math.min(prev + 1, images.length - 1) : Math.max(prev - 1, 0);
        return next;
      });
    }
  }, [images.length]);

  /* ── scroll gallery to active image ── */
  useEffect(() => {
    if (galleryRef.current) {
      const scrollEl = galleryRef.current;
      const target = scrollEl.children[activeIdx] as HTMLElement;
      if (target) {
        scrollEl.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      }
    }
  }, [activeIdx]);

  /* ── specs formatting ── */
  const specs = product.specifications;
  const fmtSpec = (val: string) => showCm ? `${val}cm` : `${(parseFloat(val) / 2.54).toFixed(1)}"`;
  const specItems = [
    { label: "W", value: fmtSpec(specs.width) },
    { label: "D", value: fmtSpec(specs.depth) },
    { label: "H", value: fmtSpec(specs.height) },
    { label: "Seat H", value: fmtSpec(specs.seatHeight) },
  ];

  /* ── share handler ── */
  const handleShare = (platform: string) => {
    const url = `https://fuzzsofa.com/${product.slug}`;
    const text = `${productName} — Fuzz Sofa`;
    switch (platform) {
      case "Pinterest":
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`, "_blank");
        break;
      case "Facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "Instagram":
        window.open(`https://www.instagram.com/`, "_blank");
        break;
      case "YouTube":
        window.open(`https://www.youtube.com/`, "_blank");
        break;
    }
    setShowShare(false);
  };

  return (
    <div className="lg:hidden" style={{ maxWidth: 430, margin: "0 auto", position: "relative" }}>

      {/* ═══════ Hero Image / Gallery ═══════ */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "calc(100% + 40px)",
          marginLeft: -20,
          marginRight: -20,
          aspectRatio: "1/1",
          background: "#0A0A0A",
          touchAction: "pan-y",
          cursor: "grab",
          marginBottom: 24,
        }}
      >
        <div
          ref={galleryRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-full snap-center" style={{ aspectRatio: "1/1" }}>
              <Image src={src} alt={`${productName} ${i + 1}`} width={430} height={430} className="w-full h-full object-cover" draggable={false} />
            </div>
          ))}
        </div>

        {/* Float AI button */}
        <div className="absolute top-4 left-5 z-10">
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(6px)", border: "0.5px solid rgba(232,180,184,0.2)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21L12 3l9 18" /><path d="M7.5 13.5h9" /><circle cx="12" cy="8" r="1.5" strokeDasharray="2 2" />
            </svg>
          </button>
        </div>

        {/* Float share + heart */}
        <div className="absolute top-4 right-5 z-10 flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 40, height: 40, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(6px)", border: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            {showShare && (
              <div
                className="absolute right-0 flex flex-col gap-1"
                style={{ top: 48, background: "#181818", border: "0.5px solid rgba(255,255,255,0.06)", padding: "4px 0", boxShadow: "0 12px 40px rgba(0,0,0,0.6)", minWidth: 120, zIndex: 50 }}
              >
                {[{name:"Pinterest",icon:"M8 12a4 4 0 118 0c0 2.5-1.5 4-3 4s-1.5-1-1.5-1l-1 4"},{name:"Facebook",icon:"M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"},{name:"Instagram",icon:"M2 2h20v20H2z M12 7a5 5 0 100 10 5 5 0 000-10z"},{name:"YouTube",icon:"M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"}].map(p => (
                  <button key={p.name} onClick={() => handleShare(p.name)} className="block w-full text-left px-4 py-2 text-[13px] text-[#8A8580] hover:text-[#F5F0EB] hover:bg-[rgba(232,180,184,0.06)] transition-colors">{p.name}</button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsFav(!isFav)}
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(6px)", border: "0.5px solid rgba(255,255,255,0.06)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "#E8B4B8" : "none"} stroke={isFav ? "#E8B4B8" : "#8A8580"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Image indicator */}
        <div
          className="absolute bottom-4 right-5 z-10"
          style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(245,240,235,0.4)", fontFeatureSettings: '"tnum"' }}
        >
          {String(activeIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
      </div>

      {/* ═══════ Product Info ═══════ */}
      <div style={{ marginBottom: 20 }}>
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#6A6560", marginBottom: 8 }}>
          {collectionName}
        </p>
        <div className="flex items-baseline justify-between">
          <h1
            className="font-medium tracking-[0.03em]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: "#F5F0EB" }}
          >
            {productName}
          </h1>
          <span
            className="font-normal"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "#E8B4B8", letterSpacing: "0.02em" }}
          >
            {displayPrice}
          </span>
        </div>
        {productTagline && (
          <p className="text-[11px] tracking-[0.08em]" style={{ color: "#8A8580", marginTop: 6 }}>{productTagline}</p>
        )}
      </div>

      {/* ═══════ Features ═══════ */}
      {feats.length > 0 && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          {feats.map((feat, i) => {
            const titleVal = t(feat.titleKey as TranslationKeys);
            const descVal = t(feat.descKey as TranslationKeys);
            const title = titleVal === feat.titleKey ? feat.fallbackTitle : titleVal;
            const desc = descVal === feat.descKey ? feat.fallbackDesc : descVal;
            return (
              <div key={i} className="flex gap-3 items-start" style={{ marginBottom: i < feats.length - 1 ? 14 : 0 }}>
                <span
                  className="flex-shrink-0 font-normal"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: "#6A6560", letterSpacing: "0.04em", width: 20, textAlign: "right" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[12px] tracking-[0.04em]" style={{ color: "#F5F0EB", fontWeight: 400 }}>{title}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#8A8580", marginTop: 2 }}>{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════ Color Selector ═══════ */}
      {allColors.length > 0 && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 12 }}>
            COLOR · {t((colorNameKeyMap[allColors[selectedColor]?.opt] || "matTypeFabric") as TranslationKeys)}
          </p>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {allColors.map((c, i) => {
              const isActive = i === selectedColor;
              const colorLabel = t((colorNameKeyMap[c.opt] || "matTypeFabric") as TranslationKeys);
              return (
                <button
                  key={`${c.type}-${c.opt}`}
                  onClick={() => setSelectedColor(i)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                >
                  <div
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: isActive ? 36 : 28,
                      height: isActive ? 36 : 28,
                      background: c.hex,
                      border: isActive ? "2px solid #E8B4B8" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive ? "0 0 0 3px rgba(232,180,184,0.15)" : "none",
                    }}
                  />
                  <span className="text-[8px] tracking-[0.04em] max-w-[48px] truncate" style={{ color: isActive ? "#F5F0EB" : "#6A6560" }}>
                    {colorLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ Description ═══════ */}
      {product.description && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[13px] leading-[1.75]" style={{ color: "#F5F0EB", opacity: 0.7 }}>
            {product.description}
          </p>
          {productConcept && (
            <p className="text-[12px] leading-[1.75] mt-3" style={{ color: "#E8B4B8", opacity: 0.6, fontStyle: "italic" }}>
              {productConcept}
            </p>
          )}
        </div>
      )}

      {/* ═══════ Story / Sketch ═══════ */}
      {sketchSrc && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <div className="flex gap-4">
            <div className="flex-shrink-0 relative" style={{ width: "45%" }}>
              <Image src={sketchSrc} alt="Story sketch" width={180} height={240} className="w-full object-cover" style={{ aspectRatio: "3/4" }} />
              <span
                className="absolute top-2 left-2 text-[8px] tracking-[0.2em] uppercase px-2 py-0.5"
                style={{ background: "rgba(10,10,10,0.7)", color: "#6A6560", border: "0.5px solid rgba(255,255,255,0.06)" }}
              >
                SKETCH
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 8 }}>STORY</p>
              <p
                className="text-[18px] font-light leading-snug tracking-[0.03em]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#F5F0EB" }}
              >
                {productConcept || productTagline}
              </p>
              <p className="text-[11px] leading-relaxed mt-3" style={{ color: "#8A8580" }}>
                {product.interiorContext}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Specs / Dimensions ═══════ */}
      {product.specifications && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560" }}>DIMENSIONS</p>
            <button
              onClick={() => setShowCm(!showCm)}
              className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5"
              style={{ color: "#6A6560", border: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              {showCm ? "CM" : "IN"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {specItems.map((s, i) => (
              <div key={i} className="flex justify-between" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)", paddingBottom: 8 }}>
                <span className="text-[11px] tracking-[0.04em]" style={{ color: "#6A6560" }}>{s.label}</span>
                <span className="text-[11px]" style={{ color: "#F5F0EB", fontFeatureSettings: '"tnum"' }}>{s.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2" style={{ color: "#6A6560" }}>Manual measurement error ±1–3cm</p>
        </div>
      )}

      {/* ═══════ Craft / Materials ═══════ */}
      {materialCards.length > 0 && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 12 }}>CRAFTSMANSHIP</p>
          <div className="flex flex-col">
            {materialCards.map((mat, i) => {
              const matTitle = t(mat.titleKey as TranslationKeys);
              const matDesc = t(mat.descKey as TranslationKeys);
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < materialCards.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <span className="flex-shrink-0" style={{ width: 1, height: 28, background: "rgba(232,180,184,0.2)", marginTop: 2 }} />
                  <div>
                    <p className="text-[12px] tracking-[0.04em]" style={{ color: "#F5F0EB" }}>{matTitle}</p>
                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "#8A8580" }}>{matDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ Scene Inspiration ═══════ */}
      {spaceImages.length > 0 && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 12 }}>INTERIOR LIFESTYLE</p>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {spaceImages.map((space, i) => (
              <div key={i} className="flex-shrink-0 overflow-hidden" style={{ width: "78vw" }}>
                <Image src={space.image} alt={`Interior scene ${i + 1}`} width={600} height={400} className="w-full object-cover" style={{ aspectRatio: "3/2" }} />
                {space.titleKey && (
                  <p className="text-[10px] tracking-[0.08em] mt-1.5" style={{ color: "#8A8580" }}>
                    {t(space.titleKey as TranslationKeys)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ FAQ ═══════ */}
      {product.faq.length > 0 && (
        <div style={{ marginBottom: 28, borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 12 }}>FAQ</p>
          <div className="flex flex-col">
            {product.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: i < product.faq.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <span className="text-[12px] tracking-[0.04em]" style={{ color: "#F5F0EB" }}>{item.question}</span>
                  <span
                    className="flex-shrink-0 ml-3 transition-transform duration-200"
                    style={{ color: "#6A6560", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", fontSize: 16 }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-[11px] leading-relaxed pb-3" style={{ color: "#8A8580" }}>{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ Explore More / Related Products ═══════ */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
          <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6A6560", marginBottom: 12 }}>EXPLORE MORE</p>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {relatedProducts.map((rp) => {
              const rpImages = productImages[rp.slug] || [];
              const rpPrice = formatPrice(getPrice(rp, region), region);
              const rpPrefix = slugToPrefix[rp.slug] || "";
              const rpName = rpPrefix ? t(`${rpPrefix}Name` as TranslationKeys) : rp.name;
              return (
                <Link key={rp.slug} href={`/${rp.slug}`} className="flex-shrink-0 group" style={{ width: "50vw" }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={rpImages[0] || "/products/placeholder.webp"}
                      alt={rpName}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="text-[13px] tracking-[0.03em] mt-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#F5F0EB" }}>
                    {rpName}
                  </p>
                  <p className="text-[12px]" style={{ color: "#8A8580" }}>{rpPrice}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ Bottom CTA ═══════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", background: "#0A0A0A", borderTop: "0.5px solid rgba(255,255,255,0.04)" }}
      >
        <div style={{ padding: "12px 20px" }}>
          {/* Row Top: Brand + Name + AI */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2.5 min-w-0 flex-1">
              <span
                className="font-serif text-[13px] font-normal tracking-[0.15em] flex-shrink-0"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#6A6560" }}
              >
                FUZZ
              </span>
              <span
                className="font-serif text-[22px] font-medium tracking-[0.03em] truncate"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#F5F0EB" }}
              >
                {productName}
              </span>
            </div>
            <button className="flex items-center gap-1.5 flex-shrink-0 text-[#E8B4B8]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21L12 3l9 18" /><path d="M7.5 13.5h9" /><circle cx="12" cy="8" r="1.5" strokeDasharray="2 2" />
              </svg>
              <span className="text-[12px] font-light tracking-[0.04em]">AI</span>
            </button>
          </div>

          {/* Row Bottom: Price + Buy */}
          <div className="flex items-center justify-between">
            <span
              className="font-serif text-[28px] font-normal tracking-[0.02em]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#F5F0EB" }}
            >
              {displayPrice}
              <small
                className="font-serif text-[14px] font-light ml-1.5"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#6A6560" }}
              >
                USD
              </small>
            </span>
            <button
              onClick={onBuyNow}
              className="relative transition-all duration-300"
              style={{
                background: "rgba(232,180,184,0.06)",
                border: "1.5px solid rgba(232,180,184,0.35)",
                padding: "14px 42px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "#E8B4B8",
                minHeight: 54,
                boxShadow: "0 0 30px rgba(232,180,184,0.02), inset 0 0 40px rgba(232,180,184,0.015)",
              }}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
