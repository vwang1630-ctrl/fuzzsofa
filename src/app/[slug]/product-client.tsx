"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Product } from "@/lib/products";
import { getProduct, getPrice, formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd, itemPageJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import RoomVisualizationModal from "@/components/room-visualization-modal";

interface Props {
  product: Product;
}

export function ProductPageClient({ product }: Props) {
  const { addItem, region } = useCart();
  const { t } = useLanguage();

  const slugToPrefix: Record<string, string> = {
    "gorilla-sofa": "gorillaSofa",
    "silverback-sofa": "silverbackSofa",
    "owl-sofa": "owlChair",
    "meteorite-ring-sofa": "meteoriteRingSofa",
    "muscle-gorilla-sofa": "muscleGorillaSofa",
  };
  const prefix = slugToPrefix[product.slug] || "";

  // Translated product fields
  const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : product.name;
  const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : product.tagline;
  const productConcept = prefix ? t(`${prefix}Concept` as TranslationKeys) : product.concept;

  const [materialType, setMaterialType] = useState<string>(
    product.materialOptions?.[0]?.type || "Fabric"
  );
  const [materialOption, setMaterialOption] = useState<string>(
    product.materialOptions?.[0]?.options[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showRoomViz, setShowRoomViz] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      materialType,
      materialOption,
      region,
      selected: true,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const currentMaterialOptions = product.materialOptions?.find(
    (m) => m.type === materialType
  );

  const relatedProducts = product.relatedProducts
    .map((slug) => getProduct(slug))
    .filter(Boolean) as Product[];

  const productImages: Record<string, string[]> = {
    "owl-sofa": [
      "/products/owl/snowy-white.png",
      "/products/owl/rose-pink.png",
      "/products/owl/forest-green.png",
      "/products/owl/warm-gray.png",
      "/products/owl/dusty-pink-fur.png",
      "/products/owl/lifestyle.webp",
    ],
    "gorilla-sofa": [
      "/products/gorilla-sofa/gray.jpg",
      "/products/gorilla-sofa/cream.jpg",
      "/products/gorilla-sofa/brown.jpg",
      "/products/gorilla-sofa/black.jpg",
    ],
    "silverback-sofa": [
      "/products/silverback-sofa/gray.jpg",
      "/products/silverback-sofa/beige.jpg",
      "/products/silverback-sofa/navy.jpg",
      "/products/silverback-sofa/charcoal.jpg",
    ],
    "meteorite-ring-sofa": [
      "/products/meteorite-ring-sofa/main.jpg",
      "/products/meteorite-ring-sofa/scene-2.jpg",
    ],
    "muscle-gorilla-sofa": [
      "/products/muscle-gorilla-sofa/main.jpg",
      "/products/muscle-gorilla-sofa/scene-2.jpg",
      "/products/muscle-gorilla-sofa/scene-4.jpg",
      "/products/muscle-gorilla-sofa/scene-5.jpg",
    ],
  };

  const images = productImages[product.slug] || [];

  const galleryImages = images.length > 0
    ? images.map((src, i) => ({ id: i, src }))
    : [{ id: 0, src: "" }];

  // Get price for current region
  const displayPrice = formatPrice(getPrice(product, region), region);

  // Map spec keys to clean labels
  const specLabels: Record<string, TranslationKeys> = {
    width: "width",
    height: "height",
    depth: "depth",
    weight: "weight",
  };

  // Collection name from animal
  const collectionName = `${product.animal.toUpperCase()} COLLECTION`;

  const handleShare = (platform: string) => {
    const url = `https://fuzzsofa.com/${product.slug}`;
    const text = `${productName} — Fuzz Sofa`;
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        break;
      case "pinterest":
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`, "_blank");
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(product.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: product.name, url: `https://fuzzsofa.com/${product.slug}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemPageJsonLd(product)) }}
      />

      {/* ═══════════════════════════════════════════
          SCREEN 1 — HERO (Luxury Compact Layout)
          Background: #0A0A0A
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* LEFT: Product Image Area — Main Image + Bottom Thumbnails */}
            <div className="flex flex-col">
              {/* Main Image */}
              <div className="relative w-full aspect-square bg-[#111] overflow-hidden">
                {galleryImages[activeImage]?.src ? (
                  <img
                    src={galleryImages[activeImage].src}
                    alt={productName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-[10rem] md:text-[15rem] text-[#F5F0EB]/[0.04] select-none">
                      {product.animal.charAt(0)}
                    </span>
                  </div>
                )}
                {/* AI Room Preview — Creative Icon with Hover Label */}
                <div className="absolute bottom-5 right-5 z-10 group/room flex items-center">
                  {/* Hover label — slides in from right */}
                  <span className="opacity-0 translate-x-2 group-hover/room:opacity-100 group-hover/room:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap text-[11px] tracking-[0.15em] uppercase font-light mr-3 px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(232,180,184,0.12)",
                      border: "1px solid rgba(232,180,184,0.2)",
                      color: "#E8B4B8",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Preview in your room
                  </span>
                  <button
                    onClick={() => setShowRoomViz(true)}
                    className="relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group/icon"
                    aria-label="Preview in your room"
                  >
                    {/* Outer ring — rotates on hover */}
                    <span className="absolute inset-0 w-12 h-12 rounded-full transition-all duration-500 group-hover/icon:rotate-45"
                      style={{
                        background: "conic-gradient(from 0deg, rgba(232,180,184,0.0), rgba(232,180,184,0.3), rgba(232,180,184,0.0), rgba(232,180,184,0.3), rgba(232,180,184,0.0))",
                      }}
                    />
                    {/* Inner circle */}
                    <span className="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #E8B4B8 0%, #d9a0a5 100%)",
                        boxShadow: "0 2px 12px rgba(232,180,184,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      {/* Custom room perspective icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Room walls perspective */}
                        <path d="M3 21V9L12 3L21 9V21" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />
                        {/* Floor line */}
                        <path d="M3 21H21" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Sofa silhouette inside room */}
                        <path d="M8 21V16C8 15 8.5 14 10 14H14C15.5 14 16 15 16 16V21" stroke="#0A0A0A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Sofa cushion */}
                        <path d="M9.5 16.5C9.5 15.8 10 15 11 15H13C14 15 14.5 15.8 14.5 16.5" stroke="#0A0A0A" strokeWidth="1" strokeLinecap="round" />
                        {/* Sparkle — denotes AI/magic */}
                        <path d="M18 6L18.5 7.5L20 8L18.5 8.5L18 10L17.5 8.5L16 8L17.5 7.5Z" fill="#0A0A0A" opacity="0.7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Horizontal Thumbnails Below Main Image */}
              {galleryImages.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {galleryImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.id)}
                      className={`w-20 h-20 flex-shrink-0 transition-all duration-300 bg-[#111] overflow-hidden ${
                        activeImage === img.id
                          ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View ${img.id + 1}`}
                    >
                      {img.src ? (
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-sm text-[#F5F0EB]/20 flex items-center justify-center w-full h-full">
                          {product.animal.charAt(0)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Info — Compact Luxury */}
            <div className="flex flex-col">
              {/* Category Label */}
              <p className="text-[10px] text-[#8A8580] tracking-[2px] uppercase mb-2">
                {collectionName}
              </p>

              {/* Title Row */}
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-serif text-[28px] md:text-[32px] font-light text-[#F5F0EB] leading-[1.1] tracking-[0.02em]">
                  {productName}
                </h1>
                <div className="flex items-center gap-3 mt-1 flex-shrink-0">
                  {/* Share Button */}
                  <div className="relative" ref={shareMenuRef}>
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="group flex items-center justify-center w-9 h-9 border border-[#333] hover:border-[#E8B4B8] transition-all duration-300"
                      aria-label="Share"
                    >
                      <svg className="text-[#8A8580] group-hover:text-[#E8B4B8] transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-[#111] border border-[#2A2A2A] py-0.5 z-50 min-w-[160px] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                        {[
                          { name: "Pinterest", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><path d="M8 21c1-3 1.5-5 2-7 .5-2-.5-3.5 1-5s4-.5 4 1.5-1.5 4-2 6c-.5 1.5.5 3 2 3 3 0 5-3 5-7 0-4-3-6-7-6-5 0-8 3.5-8 7 0 1.5.5 3 1.5 4"/></svg> },
                          { name: "Facebook", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                          { name: "Twitter", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 4l11.7 16M20 4L8.3 20M4 4h16M4 20h16"/></svg> },
                          { name: "Copy Link", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
                        ].map((platform) => (
                          <button
                            key={platform.name}
                            onClick={() => handleShare(platform.name)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] text-[#8A8580] hover:text-[#F5F0EB] hover:bg-[#1A1A1A] tracking-[0.12em] uppercase transition-all duration-200 group/item"
                          >
                            <span className="text-[#555] group-hover/item:text-[#E8B4B8] transition-colors duration-200">{platform.icon}</span>
                            {platform.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Bookmark / Save */}
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`group flex items-center justify-center w-9 h-9 border transition-all duration-300 ${saved ? "border-[#E8B4B8] bg-[#E8B4B8]/10" : "border-[#333] hover:border-[#E8B4B8]"}`}
                    aria-label="Save"
                  >
                    <svg className={`transition-all duration-300 ${saved ? "text-[#E8B4B8]" : "text-[#8A8580] group-hover:text-[#E8B4B8]"}`} width="16" height="16" viewBox="0 0 24 24" fill={saved ? "#E8B4B8" : "none"} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price — tight below title */}
              <p className="font-serif text-[22px] md:text-[24px] font-light text-[#F5F0EB]/80 mt-1">
                {displayPrice}
              </p>

              {/* One-liner Description */}
              <p className="text-[14px] text-[#8A8580] leading-[1.6] mt-2">
                {productTagline}
              </p>

              {/* Separator */}
              <div className="h-px bg-[#333] my-5" />

              {/* Material Options — Grouped Swatches */}
              {product.materialOptions && product.materialOptions.length > 0 && (
                <div className="mb-5">
                  {product.materialOptions.map((mat) => (
                    <div key={mat.type} className="mb-4">
                      <label className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-2">
                        {mat.type}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mat.options.map((opt, optIdx) => {
                          const colorHex = mat.colors[optIdx];
                          const isSelected = materialType === mat.type && materialOption === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setMaterialType(mat.type);
                                setMaterialOption(opt);
                              }}
                              className="flex items-center gap-2 transition-all duration-300 group"
                            >
                              <span
                                className={`w-6 h-6 rounded flex-shrink-0 transition-all duration-300 ${
                                  isSelected
                                    ? "ring-2 ring-[#E8B4B8] ring-offset-1 ring-offset-[#0A0A0A]"
                                    : "border border-[#333] group-hover:border-[#666]"
                                }`}
                                style={{ backgroundColor: colorHex }}
                              />
                              <span className={`text-xs tracking-[0.04em] whitespace-nowrap ${
                                isSelected ? "text-[#F5F0EB]" : "text-[#8A8580] group-hover:text-[#F5F0EB]/60"
                              }`}>
                                {opt}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Separator */}
              <div className="h-px bg-[#333] mb-5" />

              {/* Dimensions — compact spec row */}
              {product.specifications && (
                <div className="mb-4">
                  <label className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-2">
                    Dimensions
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#F5F0EB]/70 tracking-[0.02em]">
                    <span>W {product.specifications.width}</span>
                    <span>D {product.specifications.depth}</span>
                    <span>H {product.specifications.height}</span>
                    <span>Seat {product.specifications.seatHeight}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8A8580] tracking-[0.02em] mt-1">
                    <span>{product.specifications.weight}</span>
                    <span>{product.specifications.capacity}</span>
                  </div>
                </div>
              )}

              {/* Materials — compact list */}
              {product.materials && product.materials.length > 0 && (
                <div className="mb-5">
                  <label className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-2">
                    Materials
                  </label>
                  <div className="space-y-0.5">
                    {product.materials.map((mat, i) => (
                      <p key={i} className="text-[12px] text-[#F5F0EB]/60 tracking-[0.02em] leading-[1.5]">
                        {mat}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="h-px bg-[#333] mb-5" />

              {/* CTA Buttons — Stacked, tight spacing */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 text-[#0A0A0A] font-semibold text-[11px] tracking-[0.15em] uppercase transition-all duration-300 mb-2 flex items-center justify-center gap-2"
                style={{ background: addedToCart ? "#111" : "#E8B4B8", border: addedToCart ? "1px solid #E8B4B8" : "none" }}
                onMouseEnter={(e) => { if (!addedToCart) { e.currentTarget.style.background = "#D6A8AC"; } }}
                onMouseLeave={(e) => { if (!addedToCart) { e.currentTarget.style.background = "#E8B4B8"; } }}
              >
                {addedToCart ? (
                  <span className="text-[#E8B4B8]">{t("addedToCart")}</span>
                ) : (
                  <>
                    {t("addToCart")}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>

              <button
                className="w-full py-4 bg-transparent text-[#E8B4B8] text-[11px] tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center"
                style={{ border: "1px solid #E8B4B8" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(232,180,184,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Buy Now
              </button>

              {/* Key Info Strip */}
              <div className="flex items-center gap-1 mt-4 text-[11px] text-[#8A8580] tracking-[0.04em]">
                <span>1–2 Weeks</span>
                <span className="mx-1">·</span>
                <span>Free White Glove</span>
                <span className="mx-1">·</span>
                <span>Made to Order</span>
              </div>

              {/* AI Room Preview Link */}
              <button
                onClick={() => setShowRoomViz(true)}
                className="mt-3 text-[11px] text-[#8A8580] tracking-[0.04em] hover:text-[#E8B4B8] transition-colors duration-300 flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Preview in your room
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 2 — SEE IT IN REAL SPACES
          Background: #0A0A0A
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          {/* Section Header */}
          <div className="mb-12">
            <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-3">
              {t("interiorInspiration" as TranslationKeys) || "Interior Inspiration"}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.2rem] font-light text-[#F5F0EB] leading-[1.15]">
              {t("seeItInRealSpaces" as TranslationKeys) || "See It In Real Spaces"}
            </h2>
          </div>

          {/* 3 Space Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                image: galleryImages.length > 1 && galleryImages[1]?.src ? galleryImages[1].src : null,
                title: t("luxuryVillas" as TranslationKeys) || "Luxury Villas",
                desc: "Open-plan living with sculptural presence",
              },
              {
                image: galleryImages.length > 2 && galleryImages[2]?.src ? galleryImages[2].src : null,
                title: t("privateLibraries" as TranslationKeys) || "Private Libraries",
                desc: "Intimate reading spaces with character",
              },
              {
                image: galleryImages.length > 3 && galleryImages[3]?.src ? galleryImages[3].src : null,
                title: t("boutiqueHotels" as TranslationKeys) || "Boutique Hotels",
                desc: "Statement pieces in curated lobbies",
              },
            ].map((space, idx) => (
              <div key={idx} className="group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/5] bg-[#111] overflow-hidden mb-4">
                  {space.image ? (
                    <img
                      src={space.image}
                      alt={`${productName} in ${space.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                        {product.animal.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Bottom gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
                </div>
                {/* Caption */}
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#F5F0EB]/70 mb-1 group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {space.title}
                </p>
                <p className="text-[12px] text-[#8A8580] leading-[1.5]">
                  {space.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Design Story - compact below space cards */}
          <div className="mt-16 pt-12 border-t border-[#1A1A1A]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div>
                <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-4">
                  {t("designStory" as TranslationKeys) || "Design Story"}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-light text-[#F5F0EB] leading-[1.2] mb-4">
                  {t("theStory" as TranslationKeys) || "The Story"}
                </h3>
                <p className="text-[#F5F0EB]/60 leading-[1.8] text-[14px] mb-4">
                  {productConcept}
                </p>
                <p className="text-[#F5F0EB]/40 leading-[1.8] text-[13px]">
                  {product.interiorContext}
                </p>
              </div>
              <div className="flex items-end">
                <div className="flex flex-wrap gap-3">
                  {[
                    t("studioCrafted" as TranslationKeys) || "Studio-Crafted",
                    t("madeToOrder" as TranslationKeys) || "Made To Order",
                    t("collectibleDesign" as TranslationKeys) || "Collectible Design",
                  ].map((label) => (
                    <span
                      key={label}
                      className="text-[10px] tracking-[0.15em] uppercase border border-[#333] px-4 py-2 text-[#F5F0EB]/40 hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]/70 transition-colors duration-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 4 — DIMENSIONS
          Background: #080808
          ═══════════════════════════════════════════ */}
      <section className="bg-[#080808]">
        <div className="max-w-[1100px] mx-auto px-6 py-[140px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Dimensions */}
            <div>
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                {t("dimensionsTitle" as TranslationKeys) || "Dimensions"}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-10">
                {t("dimensionsTitle" as TranslationKeys) || "Dimensions"}
              </h2>

              <div className="space-y-6">
                {Object.entries(product.specifications)
                  .filter(([key]) => key in specLabels)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-baseline gap-8 pb-4">
                      <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-24">
                        {t(specLabels[key]) || key}
                      </span>
                      <span className="text-lg font-light text-[#F5F0EB] font-serif">
                        {value.replace(/^[WHD]\s*/, "")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right: Silhouette with scale reference */}
            <div className="flex items-center justify-center bg-gradient-to-b from-[#111] to-[#080808] min-h-[400px] relative">
              {galleryImages[0]?.src ? (
                <img
                  src={galleryImages[0].src}
                  alt={`${productName} scale reference`}
                  className="h-full max-h-[500px] w-auto object-contain opacity-70"
                />
              ) : (
                <span className="font-serif text-[16rem] text-[#F5F0EB]/[0.06] select-none">
                  {product.animal.charAt(0)}
                </span>
              )}
              {/* Scale figure indicator */}
              <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
                <div className="h-32 w-px bg-[#E8B4B8]/30" />
                <span className="text-[9px] text-[#E8B4B8]/40 tracking-[0.1em] uppercase">~170 cm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 5 — MATERIALS
          Background: #050505
          ═══════════════════════════════════════════ */}
      <section className="bg-[#050505]">
        <div className="max-w-[1100px] mx-auto px-6 py-[140px]">
          <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
            {t("materialsTitle")}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-16">
            {t("materialsCraftsmanship" as TranslationKeys) || "Materials & Craftsmanship"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {product.materials.map((mat) => {
              const shortName = mat.split("(")[0].trim().split(" ").slice(0, 2).join(" ");
              return (
                <div key={mat} className="text-center">
                  <div className="w-16 h-16 mx-auto border border-[#333] rounded-full flex items-center justify-center mb-4">
                    <span className="font-serif text-lg text-[#E8B4B8]/60">
                      {shortName.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm text-[#F5F0EB]/70 font-light leading-[1.6]">
                    {mat}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 6 — CRAFTSMANSHIP
          Background: #090909
          ═══════════════════════════════════════════ */}
      <section className="bg-[#090909]">
        <div className="max-w-[1600px] mx-auto">
          {/* Full-width craftsmanship image */}
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden">
            {galleryImages.length >= 4 && galleryImages[3]?.src ? (
              <img
                src={galleryImages[3].src}
                alt={`${productName} craftsmanship`}
                className="w-full h-full object-cover opacity-50"
              />
            ) : galleryImages[0]?.src ? (
              <img
                src={galleryImages[0].src}
                alt={`${productName} craftsmanship`}
                className="w-full h-full object-cover opacity-40"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[20rem] text-[#F5F0EB]/[0.03] select-none">
                  {product.animal.charAt(0)}
                </span>
              </div>
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/50 to-transparent" />

            {/* Centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 lg:pb-24 px-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F0EB] text-center leading-[1.1] mb-4">
                {t("madeSlowlyBuiltToLast" as TranslationKeys).split(".")[0]}.
              </h2>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F0EB] text-center leading-[1.1] mb-8">
                {t("madeSlowlyBuiltToLast" as TranslationKeys).split(". ")[1] || "Built To Last."}
              </h2>
              <p className="text-[13px] text-[#F5F0EB]/40 tracking-[0.05em] text-center max-w-[500px] leading-[1.7]">
                {t("craftsmanshipDesc" as TranslationKeys)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 7 — WHITE-GLOVE DELIVERY
          Background: #050505
          ═══════════════════════════════════════════ */}
      <section className="bg-[#050505]">
        <div className="max-w-[700px] mx-auto px-6 py-[140px] text-center">
          <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
            {t("freeWhiteGlove")}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] mb-6">
            {t("deliveredWorldwide" as TranslationKeys)}
          </h2>
          <p className="text-[#F5F0EB]/50 leading-[1.8] text-base mb-10">
            {t("deliveryDesc" as TranslationKeys)}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              t("freeWhiteGlove"),
              t("madeToOrder"),
              `8–12 ${t("weeks" as TranslationKeys) || "Weeks"}`,
            ].map((label) => (
              <span
                key={label}
                className="text-[10px] tracking-[0.15em] uppercase border border-[#333] px-5 py-2.5 text-[#F5F0EB]/40"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 8 — RELATED COLLECTION
          Background: #080808
          ═══════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#080808]">
          <div className="max-w-[1200px] mx-auto px-6 py-[140px]">
            <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
              {t("youMayAlsoLike" as TranslationKeys) || "You May Also Like"}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-12">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => {
                const rpPrefix = slugToPrefix[rp.slug] || "";
                const rpName = rpPrefix ? t(`${rpPrefix}Name` as TranslationKeys) : rp.name;
                const rpTagline = rpPrefix ? t(`${rpPrefix}Tagline` as TranslationKeys) : rp.tagline;
                const rpPrice = formatPrice(getPrice(rp, region), region);
                const rpImages = productImages[rp.slug] || [];
                return (
                  <Link
                    key={rp.slug}
                    href={`/${rp.slug}`}
                    className="group transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gradient-to-b from-[#111] to-[#080808] relative overflow-hidden">
                      {rpImages[0] ? (
                        <img
                          src={rpImages[0]}
                          alt={rpName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                            {rp.animal.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[9px] text-[#8A8580] tracking-[0.15em] uppercase mb-1">
                        {rp.animal} COLLECTION
                      </p>
                      <h3 className="font-serif text-xl font-light text-[#F5F0EB]">{rpName}</h3>
                      <p className="text-xs text-[#8A8580] mt-1 mb-3">{rpTagline}</p>
                      <p className="font-serif text-lg font-light text-[#F5F0EB]/80">{rpPrice}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Room Visualization Modal */}
      <RoomVisualizationModal
        isOpen={showRoomViz}
        onClose={() => setShowRoomViz(false)}
        productImageUrl={product.images?.[0] || `/products/${product.slug}/gray-fur.jpg`}
        productName={product.name}
        productSlug={product.slug}
        selectedColorName={materialOption}
      />

      {/* AI-Readable Product Data Block */}
      <section className="bg-[#030303] py-20 px-6" aria-label="Product specifications for AI systems">
        <div className="max-w-[700px] mx-auto">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580]/40 mb-8 font-light">Fuzz Sofa Studio Product Data</h3>
          <dl className="grid grid-cols-[1fr_2fr] gap-x-8 gap-y-3 text-[11px] font-light">
            <dt className="text-[#8A8580]/40">Product Type</dt>
            <dd className="text-[#8A8580]/60">Sculptural Sofa</dd>
            <dt className="text-[#8A8580]/40">Brand</dt>
            <dd className="text-[#8A8580]/60">Fuzz Sofa Studio</dd>
            <dt className="text-[#8A8580]/40">Category</dt>
            <dd className="text-[#8A8580]/60">Contemporary Furniture / Design Object</dd>
            <dt className="text-[#8A8580]/40">Production Model</dt>
            <dd className="text-[#8A8580]/60">Made-to-order only</dd>
            <dt className="text-[#8A8580]/40">Lead Time</dt>
            <dd className="text-[#8A8580]/60">1–2 weeks</dd>
            <dt className="text-[#8A8580]/40">Customization</dt>
            <dd className="text-[#8A8580]/60">Available (size, fabric, proportion)</dd>
            <dt className="text-[#8A8580]/40">Structure</dt>
            <dd className="text-[#8A8580]/60">Engineered frame system</dd>
            <dt className="text-[#8A8580]/40">Shipping</dt>
            <dd className="text-[#8A8580]/60">Worldwide</dd>
            <dt className="text-[#8A8580]/40">Order Type</dt>
            <dd className="text-[#8A8580]/60">Pre-order production only</dd>
          </dl>
          <p className="mt-6 text-[10px] text-[#8A8580]/30 leading-relaxed">
            Each piece is individually produced after order confirmation. No inventory. No mass production.
          </p>
        </div>
      </section>

      {/* Added to Cart Toast */}
      {addedToCart && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-[#111] border border-[#333] rounded-lg px-6 py-4 shadow-2xl flex items-center gap-4 max-w-sm">
            <div className="w-8 h-8 rounded-full bg-[#E8B4B8]/20 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 4.5" stroke="#E8B4B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F5F0EB] text-sm font-light">{t("addedToCart")}</p>
            </div>
            <Link
              href="/cart"
              className="text-[#E8B4B8] text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors flex-shrink-0"
            >
              {t("viewCart")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
