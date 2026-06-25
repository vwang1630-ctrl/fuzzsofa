"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/products";
import { getProduct, getPrice, formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { RoomVisualizationModal } from "@/components/room-visualization-modal";

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

      {/* ═══════════════════════════════════════════
          SCREEN 1 — HERO (58/42 Layout)
          Background: #050505
          ═══════════════════════════════════════════ */}
      <section className="bg-[#050505]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-screen">
            {/* LEFT: Product Image Area */}
            <div className="relative flex items-center justify-center bg-[#050505] px-6 pt-5 pb-6 md:pb-10">
              <div className="flex gap-4 w-full max-w-[800px]">
                {/* Vertical Thumbnails — Left Side (70x70, gap 16px, opacity .7) */}
                {galleryImages.length > 1 && (
                  <div className="hidden md:flex flex-col gap-4 flex-shrink-0">
                    {galleryImages.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(img.id)}
                        className={`w-[70px] h-[70px] transition-all duration-300 bg-[#111] overflow-hidden flex-shrink-0 ${
                          activeImage === img.id
                            ? "border border-[rgba(255,255,255,0.4)] opacity-100"
                            : "border border-transparent opacity-70 hover:opacity-100"
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

                {/* Main Image — Square 1:1 with 60px breathing room */}
                <div className="relative flex-1 aspect-square bg-gradient-to-b from-[#0a0a0a] to-[#050505] overflow-hidden p-[60px]">
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ background: "radial-gradient(ellipse at 50% 70%, #E8B4B8, transparent 60%)" }}
                  />
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

                  {/* AI Room Preview — Bottom Right Circle (Apple Vision Pro style) */}
                  <button
                    onClick={() => setShowRoomViz(true)}
                    className="absolute bottom-8 right-8 z-10 w-[56px] h-[56px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                    aria-label="Preview in your space"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#111] border border-[#333] rounded text-[9px] tracking-[0.12em] uppercase text-[#F5F0EB]/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Preview In Your Space
                    </span>
                  </button>

                  {/* Mobile Thumbnails — Bottom Left */}
                  {galleryImages.length > 1 && (
                    <div className="md:hidden absolute bottom-4 left-4 flex gap-2">
                      {galleryImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImage(img.id)}
                          className={`w-[48px] h-[48px] transition-all duration-300 bg-[#0A0A0A]/80 backdrop-blur-sm overflow-hidden ${
                            activeImage === img.id
                              ? "border border-[rgba(255,255,255,0.4)] opacity-100"
                              : "border border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          {img.src ? (
                            <img src={img.src} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-serif text-xs text-[#F5F0EB]/20 flex items-center justify-center w-full h-full">
                              {product.animal.charAt(0)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info (42%) — lifted upward */}
            <div className="flex flex-col justify-center px-8 md:px-12 lg:px-14 py-16 lg:py-20 bg-[#050505] lg:-mt-10" style={{ transform: "translateY(-40px)" }}>
              {/* Collection Label */}
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                {collectionName}
              </p>

              {/* Title — 64px, weight 300, leading 1.05, max-w 500px */}
              <h1 className="font-serif text-[64px] font-light text-[#F5F0EB] leading-[1.05] tracking-[0.02em] max-w-[500px] mb-4">
                {productName}
              </h1>

              {/* Price — 42px */}
              <p className="font-serif text-[42px] font-light text-[#F5F0EB]/80 mt-8 mb-6">
                {displayPrice}
              </p>

              {/* Tagline */}
              <p className="text-[13px] text-[#F5F0EB]/50 leading-[1.6] max-w-[400px] mb-3">
                {productTagline}
              </p>

              {/* Brand Language */}
              <p className="text-[11px] text-[#E8B4B8]/50 tracking-[0.12em] italic mb-8 max-w-[380px]">
                {t("furnitureToDefineSpace" as TranslationKeys) || "Furniture designed to define a space."}
              </p>

              {/* Separator */}
              <div className="h-px bg-[#1A1A1A] mb-8" />

              {/* Material Quick Select — Luxury Vertical List */}
              {product.materialOptions && product.materialOptions.length > 0 && (
                <div className="mb-8">
                  {product.materialOptions.map((mat) => (
                    <div key={mat.type} className="mb-5">
                      <label className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-3">
                        {mat.type}
                      </label>
                      <div className="space-y-1.5">
                        {mat.options.map((opt) => {
                          const colorIdx = mat.options.indexOf(opt);
                          const colorHex = mat.colors[colorIdx];
                          const isSelected = materialType === mat.type && materialOption === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setMaterialType(mat.type);
                                setMaterialOption(opt);
                              }}
                              className={`flex items-center gap-3 w-full text-left py-1.5 transition-all duration-300 group ${
                                isSelected
                                  ? "text-[#F5F0EB]"
                                  : "text-[#F5F0EB]/35 hover:text-[#F5F0EB]/60"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-sm flex-shrink-0 transition-all duration-300 ${
                                  isSelected
                                    ? "ring-1 ring-[#E8B4B8] ring-offset-1 ring-offset-[#050505]"
                                    : "border border-[#333] group-hover:border-[#666]"
                                }`}
                                style={{ backgroundColor: colorHex }}
                              />
                              <span className="text-xs tracking-[0.06em]">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Leather texture bar */}
                      <div
                        className="mt-3 h-[2px] w-full opacity-30"
                        style={{
                          background: `linear-gradient(90deg, ${mat.colors.join(", ")})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Separator */}
              <div className="h-px bg-[#1A1A1A] mb-8" />

              {/* Add to Cart — Thin Luxury Outline */}
              <button
                onClick={handleAddToCart}
                className="w-full border border-[rgba(255,255,255,0.12)] bg-transparent text-[#F5F0EB]/80 h-[60px] text-[11px] tracking-[0.15em] uppercase hover:bg-[#111] hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 mb-8 flex items-center justify-center gap-2"
              >
                {addedToCart ? t("addedToCart") : (
                  <>
                    {t("addToCart")}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>

              {/* Delivery Info */}
              <div className="flex items-center gap-6 text-[11px] text-[#8A8580] tracking-[0.05em]">
                <span>{t("freeWhiteGlove")}</span>
                <span className="w-px h-3 bg-[#333]" />
                <span>{t("madeToOrder")}</span>
                <span className="w-px h-3 bg-[#333]" />
                <span>8–12 {t("weeks" as TranslationKeys) || "Weeks"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 2 — DESIGN STORY
          Background: #090909
          ═══════════════════════════════════════════ */}
      <section className="bg-[#090909]">
        <div className="max-w-[1100px] mx-auto px-6 py-[140px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Detail Images */}
            <div className="space-y-6">
              {galleryImages.length >= 2 ? (
                <>
                  <div className="aspect-[4/3] bg-gradient-to-b from-[#111] to-[#0a0a0a] overflow-hidden">
                    {galleryImages[1]?.src ? (
                      <img
                        src={galleryImages[1].src}
                        alt={`${productName} detail`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                          {product.animal.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {galleryImages.length >= 3 && galleryImages[2]?.src && (
                    <div className="aspect-[4/3] bg-gradient-to-b from-[#111] to-[#0a0a0a] overflow-hidden">
                      <img
                        src={galleryImages[2].src}
                        alt={`${productName} texture`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-b from-[#111] to-[#0a0a0a] flex items-center justify-center">
                  <span className="font-serif text-[12rem] text-[#F5F0EB]/[0.04] select-none">
                    {product.animal.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Story Text */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                {t("designStory" as TranslationKeys) || "Design Story"}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] mb-6">
                {t("theStory" as TranslationKeys) || "The Story"}
              </h2>
              <p className="text-[#F5F0EB]/60 leading-[1.8] text-base mb-4">
                {productConcept}
              </p>
              <p className="text-[#F5F0EB]/40 leading-[1.8] text-sm mb-10">
                {product.interiorContext}
              </p>

              {/* Attributes */}
              <div className="flex flex-wrap gap-4">
                {[
                  t("handcrafted" as TranslationKeys) || "Handcrafted",
                  t("madeToOrder" as TranslationKeys) || "Made To Order",
                  t("collectibleDesign" as TranslationKeys) || "Collectible Design",
                ].map((label) => (
                  <span
                    key={label}
                    className="text-[10px] tracking-[0.15em] uppercase border border-[#333] px-4 py-2 text-[#F5F0EB]/40"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCREEN 3 — INTERIOR INSPIRATION
          Background: #050505
          ═══════════════════════════════════════════ */}
      <section className="bg-[#050505]">
        <div className="max-w-[1600px] mx-auto">
          {/* Full-width hero image */}
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden">
            {galleryImages[0]?.src ? (
              <img
                src={galleryImages[0].src}
                alt={`${productName} in interior`}
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[20rem] text-[#F5F0EB]/[0.03] select-none">
                  {product.animal.charAt(0)}
                </span>
              </div>
            )}
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

            {/* Centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 lg:pb-24 px-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F0EB] text-center leading-[1.1] mb-6">
                {t("designedToDefineSpace" as TranslationKeys) || "Designed To Define A Space"}
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  t("luxuryVillas" as TranslationKeys) || "Luxury Villas",
                  t("boutiqueHotels" as TranslationKeys) || "Boutique Hotels",
                  t("privateClubs" as TranslationKeys) || "Private Clubs",
                  t("expressiveInteriors" as TranslationKeys) || "Expressive Interiors",
                ].map((label) => (
                  <span
                    key={label}
                    className="text-[10px] tracking-[0.15em] uppercase border border-[#F5F0EB]/20 px-4 py-2 text-[#F5F0EB]/50"
                  >
                    {label}
                  </span>
                ))}
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
        product={product}
        isOpen={showRoomViz}
        onClose={() => setShowRoomViz(false)}
        onBuyThisPiece={handleAddToCart}
      />

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
