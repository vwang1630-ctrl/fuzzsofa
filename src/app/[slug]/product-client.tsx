"use client";

import Link from "next/link";
import { useState } from "react";
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
  // Map product slug to i18n key prefix
  const slugToPrefix: Record<string, string> = {
    "bear-sofa": "bearSofa",
    "lion-sofa": "lionSofa",
    "tiger-sofa": "tigerSofa",
    "gorilla-sofa": "gorillaSofa",
    "owl-sofa": "owlChair",
  };
  const prefix = slugToPrefix[product.slug] || "";

  // Translated product name/tagline/concept
  const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : product.name;
  const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : product.tagline;
  const productConcept = prefix ? t(`${prefix}Concept` as TranslationKeys) : product.concept;

  // Translated FAQ
  const faqKeys = ["faqDelivery", "faqCustomization", "faqLeadTime", "faqReturnPolicy"] as TranslationKeys[];
  const faqAnswerKeys = ["faqDeliveryAnswer", "faqCustomizationAnswer", "faqLeadTimeAnswer", "faqReturnPolicyAnswer"] as TranslationKeys[];
  const translatedFaq = faqKeys.map((qk, i) => ({
    question: t(qk),
    answer: t(faqAnswerKeys[i]),
  }));

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
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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
      "/products/owl/interior-context.png",
    ],
    "gorilla-sofa": [
      "/products/gorilla-sofa/gray.jpg",
      "/products/gorilla-sofa/cream.jpg",
      "/products/gorilla-sofa/brown.jpg",
      "/products/gorilla-sofa/black.jpg",
    ],
  };

  const images = productImages[product.slug] || [];

  const galleryImages = images.length > 0
    ? images.map((src, i) => ({ label: `${productName} — View ${i + 1}`, id: i, src }))
    : [
        { label: `${productName} — Full View`, id: 0, src: "" },
        { label: `${productName} — Detail`, id: 1, src: "" },
        { label: `${productName} — In Context`, id: 2, src: "" },
        { label: `${productName} — Side Profile`, id: 3, src: "" },
      ];

  // Get price for current region
  const displayPrice = formatPrice(getPrice(product, region), region);

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

      {/* 1) HERO: Product Image + Key Info Side-by-Side */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT: Product Image */}
            <div className="relative aspect-square bg-gradient-to-b from-[#111111] to-[#0A0A0A] overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ background: "radial-gradient(ellipse at 50% 70%, #E8B4B8, transparent 60%)" }}
              />
              {galleryImages[activeImage]?.src ? (
                <img
                  src={galleryImages[activeImage].src}
                  alt={galleryImages[activeImage].label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-[15rem] md:text-[20rem] text-[#F5F0EB]/[0.04] select-none">
                    {product.animal.charAt(0)}
                  </span>
                </div>
              )}
              {/* Image thumbnails */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                  {galleryImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.id)}
                      className={`w-[50px] h-[50px] border transition-all duration-300 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center overflow-hidden ${
                        activeImage === img.id
                          ? "border-[#E8B4B8]"
                          : "border-[#333] hover:border-[#E8B4B8]"
                      }`}
                      aria-label={img.label}
                    >
                      {img.src ? (
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-sm text-[#F5F0EB]/20">
                          {product.animal.charAt(0)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div className="flex flex-col justify-center px-8 md:px-12 py-12 lg:py-16 bg-[#0A0A0A]">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">
                {product.animal}-Inspired Sculptural Furniture
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F0EB] leading-[1.1]">
                {productName}
              </h1>
              <p className="mt-3 text-lg text-[#F5F0EB]/50 font-light">{productTagline}</p>

              {/* Price */}
              <div className="mt-8 mb-6">
                <p className="font-serif text-3xl md:text-4xl font-light text-[#F5F0EB]">
                  {displayPrice}
                </p>
                <p className="text-xs text-[#8A8580] mt-1 tracking-[0.05em]">{t("freeDelivery")}</p>
              </div>

              {/* In Your Space - concise */}
              <div className="mb-8">
                <p className="text-sm text-[#F5F0EB]/60 leading-[1.7] max-w-[440px]">
                  {t(`${prefix}Interior` as TranslationKeys)}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.relatedInteriors.map((interior) => {
                    const sceneKeyMap: Record<string, TranslationKeys> = {
                      "luxury-villa-interior": "luxuryVillaScene",
                      "boutique-hotel-lobby": "boutiqueHotelScene",
                      "statement-furniture": "statementFurnitureScene",
                      "sculptural-furniture-trend": "sculpturalTrendScene",
                    };
                    return (
                      <Link
                        key={interior}
                        href={`/${interior}`}
                        className="text-xs tracking-[0.1em] uppercase border border-[#333] px-3 py-1.5 text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
                      >
                        {sceneKeyMap[interior] ? t(sceneKeyMap[interior]) : interior.replace(/-/g, " ")}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Material Quick Select */}
              {product.materialOptions && product.materialOptions.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-3">
                    {t("materialsTitle")}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.materialOptions.map((mat) => (
                      <button
                        key={mat.type}
                        onClick={() => {
                          setMaterialType(mat.type);
                          setMaterialOption(mat.options[0]);
                        }}
                        className={`text-xs px-3 py-1.5 border transition-all duration-300 ${
                          materialType === mat.type
                            ? "border-[#E8B4B8] text-[#E8B4B8]"
                            : "border-[#333] text-[#F5F0EB]/40 hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                        }`}
                      >
                        {mat.type === "Cloud Touch" ? t("cloudTouch") :
                         mat.type === "Wild Touch" ? t("wildTouch") :
                         mat.type === "Leather Touch" ? t("leatherTouch") : mat.type}
                      </button>
                    ))}
                  </div>
                  {/* Color options within selected material type */}
                  {currentMaterialOptions && (
                    <div className="flex flex-wrap gap-2">
                      {currentMaterialOptions.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setMaterialOption(opt)}
                          className={`text-xs px-3 py-1.5 border transition-all duration-300 ${
                            materialType === currentMaterialOptions.type && materialOption === opt
                              ? "border-[#E8B4B8] text-[#E8B4B8]"
                              : "border-[#1A1A1A] text-[#F5F0EB]/30 hover:border-[#333] hover:text-[#F5F0EB]/60"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart + Secondary CTAs */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full border border-[#F5F0EB] text-[#F5F0EB] py-4 text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  {addedToCart ? t("addedToCart") : t("addToCart")}
                </button>
                <button
                  onClick={() => setShowRoomViz(true)}
                  className="w-full border border-[#333] text-[#F5F0EB]/60 py-3 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8]/50 hover:text-[#E8B4B8] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className="text-[#E8B4B8]/60">
                    <path
                      d="M3 10C3 8.89543 3.89543 8 5 8H7.586C7.85122 8 7.89443 7.89464 8.29289 7.70711L9.70711 6.29289C9.89443 6.10536 10.1488 6 10.414 6H17.586C17.8512 6 18.1056 6.10536 18.2929 6.29289L19.7071 7.70711C19.8944 7.89464 20.1488 8 20.414 8H23C24.1046 8 25 8.89543 25 10V20C25 21.1046 24.1046 22 23 22H5C3.89543 22 3 21.1046 3 20V10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="14" cy="14.5" r="4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  {t("tryInRoom")}
                </button>
                <Link
                  href="/contact"
                  className="w-full border border-[#1A1A1A] text-[#F5F0EB]/40 py-3 text-sm tracking-[0.1em] uppercase hover:border-[#333] hover:text-[#F5F0EB]/60 transition-all duration-300 text-center"
                >
                  {t("requestPricing")}
                </Link>
              </div>

              {/* Key specs summary */}
              <div className="mt-8 pt-6 border-t border-[#1A1A1A] grid grid-cols-3 gap-4">
                {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] text-[#8A8580] tracking-[0.1em] uppercase mb-0.5">
                      {t(key as TranslationKeys) || key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-xs text-[#F5F0EB]/60">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) DESIGN CONCEPT */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-[700px] mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-6">{t("designConcept")}</h2>
          <p className="text-[#F5F0EB]/70 leading-[1.7] text-base">{productConcept}</p>
        </div>
      </section>

      {/* 3) SPECIFICATIONS */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("specificationsTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-1">
                  {t(key as TranslationKeys) || key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-sm text-[#F5F0EB]/80">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-1">{t("delivery")}</p>
              <p className="text-sm text-[#F5F0EB]/80">{t("freeDelivery")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4) MATERIALS DETAIL */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-4">{t("materialsTitle")}</h2>
          <p className="text-sm text-[#8A8580] mb-10">{t("materialOptions")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.materialOptions?.map((mat) => (
              <div
                key={mat.type}
                onClick={() => {
                  setMaterialType(mat.type);
                  setMaterialOption(mat.options[0]);
                }}
                className={`cursor-pointer border p-6 transition-all duration-300 ${
                  materialType === mat.type
                    ? "border-[#E8B4B8] bg-[#111111]"
                    : "border-[#1A1A1A] hover:border-[#333]"
                }`}
              >
                <h3 className="font-serif text-xl font-light text-[#F5F0EB] mb-1">
                  {mat.type === "Cloud Touch" ? t("cloudTouch") :
                   mat.type === "Wild Touch" ? t("wildTouch") :
                   mat.type === "Leather Touch" ? t("leatherTouch") : mat.type}
                </h3>
                <p className="text-xs text-[#8A8580] mb-4">
                  {mat.type === "Cloud Touch" && t("cloudTouchDesc")}
                  {mat.type === "Wild Touch" && t("wildTouchDesc")}
                  {mat.type === "Leather Touch" && t("leatherTouchDesc")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mat.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMaterialType(mat.type);
                        setMaterialOption(opt);
                      }}
                      className={`text-xs px-3 py-1.5 border transition-all duration-300 ${
                        materialType === mat.type && materialOption === opt
                          ? "border-[#E8B4B8] text-[#E8B4B8]"
                          : "border-[#333] text-[#F5F0EB]/40 hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )) || (
              <div className="border border-[#1A1A1A] p-6">
                <p className="text-sm text-[#F5F0EB]/70">{product.materials.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5) FAQ */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-[700px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {translatedFaq.map((faq, i) => (
              <div key={i} className="border-b border-[#1A1A1A] pb-6 last:border-0">
                <h3 className="font-serif text-lg font-light text-[#F5F0EB] mb-2">{faq.question}</h3>
                <p className="text-sm text-[#8A8580] leading-[1.7]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6) RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => {
                const rpPrefix = slugToPrefix[rp.slug] || "";
                const rpName = rpPrefix ? t(`${rpPrefix}Name` as TranslationKeys) : rp.name;
                const rpTagline = rpPrefix ? t(`${rpPrefix}Tagline` as TranslationKeys) : rp.tagline;
                const rpImages = productImages[rp.slug] || [];
                return (
                  <Link
                    key={rp.slug}
                    href={`/${rp.slug}`}
                    className="group border border-[#1A1A1A] hover:border-[#E8B4B8]/30 transition-all duration-300"
                  >
                    <div className="aspect-square bg-gradient-to-b from-[#111111] to-[#0A0A0A] relative overflow-hidden">
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
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-light text-[#F5F0EB]">{rpName}</h3>
                      <p className="text-xs text-[#8A8580] mt-1">{rpTagline}</p>
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
    </>
  );
}
