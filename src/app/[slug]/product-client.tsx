"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { Product, Region } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { getProduct } from "@/lib/products";
import { RoomVisualizationModal } from "@/components/room-visualization-modal";

interface Props {
  product: Product;
}

export function ProductPageClient({ product }: Props) {
  const { addItem, region, setRegion } = useCart();
  const { t } = useLanguage();
  // Map product slug to i18n key prefix
  const slugToPrefix: Record<string, string> = {
    "bear-sofa": "bearSofa",
    "lion-sofa": "lionSofa",
    "tiger-sofa": "tigerSofa",
    "gorilla-sofa": "gorillaSofa",
    "owl-chair": "owlChair",
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
  const purchaseRef = useRef<HTMLElement>(null);

  const scrollToPurchase = () => {
    purchaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const regions: { value: Region; label: string }[] = [
    { value: "americas", label: "Americas (USD)" },
    { value: "europe", label: "Europe (EUR)" },
    { value: "middle_east", label: "Middle East (USD)" },
    { value: "se_asia", label: "SE Asia (USD)" },
  ];

  const productImages: Record<string, string[]> = {
    "owl-sofa": [
      "/products/owl/snowy-white.png",
      "/products/owl/rose-pink.png",
      "/products/owl/forest-green.png",
      "/products/owl/warm-gray.png",
      "/products/owl/interior-context.png",
    ],
  };

  const images = productImages[product.slug] || [];

  const galleryImages = images.length > 0
    ? images.map((src, i) => ({ label: `${product.name} — View ${i + 1}`, id: i, src }))
    : [
        { label: `${product.name} — Full View`, id: 0, src: "" },
        { label: `${product.name} — Detail`, id: 1, src: "" },
        { label: `${product.name} — In Context`, id: 2, src: "" },
        { label: `${product.name} — Side Profile`, id: 3, src: "" },
      ];

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

      {/* 1) CONCEPT SECTION */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#111111] to-[#0A0A0A] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(ellipse at 50% 80%, #E8B4B8, transparent 60%)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[12rem] md:text-[20rem] text-[#F5F0EB]/[0.03] select-none">
              {product.animal.charAt(0)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">
                {product.animal}-Inspired Sculptural Furniture
              </p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                {productName}
              </h1>
              <p className="mt-3 text-lg text-[#F5F0EB]/50 font-light">{productTagline}</p>
            </div>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto px-6 py-16">
          <p className="text-[#F5F0EB]/70 leading-[1.7] text-base">{productConcept}</p>
        </div>
      </section>

      {/* 2) IMAGE GALLERY */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <figure>
            <div className="aspect-square bg-gradient-to-b from-[#111111] to-[#0A0A0A] relative overflow-hidden">
              {galleryImages[activeImage]?.src ? (
                <img
                  src={galleryImages[activeImage].src}
                  alt={galleryImages[activeImage].label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{ background: "radial-gradient(ellipse at 50% 70%, #E8B4B8, transparent 60%)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-[15rem] md:text-[25rem] text-[#F5F0EB]/[0.04] select-none">
                      {product.animal.charAt(0)}
                    </span>
                  </div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-1/3" />
            </div>
            <figcaption className="sr-only">
              {galleryImages[activeImage].label} — {product.name} by Fuzz Sofa
            </figcaption>
          </figure>
          <div className="mt-4 flex gap-3">
            {galleryImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.id)}
                className={`w-[60px] h-[60px] border transition-all duration-300 bg-gradient-to-b from-[#111111] to-[#0A0A0A] flex items-center justify-center overflow-hidden ${
                  activeImage === img.id
                    ? "border-[#E8B4B8]"
                    : "border-[#1A1A1A] hover:border-[#E8B4B8]"
                }`}
                aria-label={img.label}
              >
                {img.src ? (
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-xl text-[#F5F0EB]/20">
                    {product.animal.charAt(0)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3) INTERIOR CONTEXT SECTION */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-6">{t("inYourSpace")}</h2>
          <p className="text-[#F5F0EB]/70 leading-[1.7] text-base max-w-[700px] mb-8">
            {product.interiorContext}
          </p>
          <div className="flex flex-wrap gap-3">
            {product.relatedInteriors.map((interior) => (
              <Link
                key={interior}
                href={`/${interior}`}
                className="text-xs tracking-[0.1em] uppercase border border-[#333] px-4 py-2 text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
              >
                {interior.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4) SPECIFICATIONS */}
      <section className="border-t border-[#1A1A1A]">
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

      {/* 5) MATERIALS SECTION */}
      <section className="border-t border-[#1A1A1A]">
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
                  {mat.type === "Cloud Touch" && "Ultra-soft boucle. Cloud-like comfort with a subtle texture."}
                  {mat.type === "Wild Touch" && "Natural linen blend. Breathable with organic grain."}
                  {mat.type === "Leather Touch" && "Full-grain leather. Rich patina develops over time."}
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

      {/* 6) AI TRY IN YOUR ROOM */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <button
            onClick={() => setShowRoomViz(true)}
            className="group w-full flex flex-col sm:flex-row items-center justify-between gap-6 py-6 px-8 border border-[#333] hover:border-[#E8B4B8]/50 transition-all duration-300 rounded-[4px]"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full border border-[#333] group-hover:border-[#E8B4B8]/50 flex items-center justify-center transition-colors duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="text-[#E8B4B8]/60 group-hover:text-[#E8B4B8] transition-colors duration-300"
                >
                  <path
                    d="M3 10C3 8.89543 3.89543 8 5 8H7.586C7.85122 8 7.89443 7.89464 8.29289 7.70711L9.70711 6.29289C9.89443 6.10536 10.1488 6 10.414 6H17.586C17.8512 6 18.1056 6.10536 18.2929 6.29289L19.7071 7.70711C19.8944 7.89464 20.1488 8 20.414 8H23C24.1046 8 25 8.89543 25 10V20C25 21.1046 24.1046 22 23 22H5C3.89543 22 3 21.1046 3 20V10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="14" cy="14.5" r="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-xl md:text-2xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  {t("tryInRoom")}
                </h3>
                <p className="text-xs text-[#8A8580] mt-1">
                  {t("uploadRoomPhoto")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/40 group-hover:text-[#E8B4B8] transition-colors duration-300">
              <span>{t("getStarted")}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* 7) PURCHASE SECTION */}
      <section ref={purchaseRef} className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-8">{t("purchaseTitle")}</h2>

              {/* Region selector */}
              <div className="mb-8">
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-3">
                  {t("country")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRegion(r.value)}
                      className={`text-xs px-4 py-2 border transition-all duration-300 ${
                        region === r.value
                          ? "border-[#E8B4B8] text-[#E8B4B8]"
                          : "border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material type */}
              {product.materialOptions && product.materialOptions.length > 1 && (
                <div className="mb-8">
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-3">
                    {t("materialsTitle")}
                  </label>
                  <div className="flex gap-2">
                    {product.materialOptions.map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => {
                          setMaterialType(opt.type);
                          setMaterialOption(opt.options[0]);
                        }}
                        className={`text-xs px-4 py-2 border transition-all duration-300 ${
                          materialType === opt.type
                            ? "border-[#E8B4B8] text-[#E8B4B8]"
                            : "border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                        }`}
                      >
                        {opt.type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-3">
                  {t("quantity")}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="text-[#F5F0EB] w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              {/* Price */}
              <div className="bg-[#111111] border border-[#1A1A1A] p-8">
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("price")}</p>
                <p className="font-serif text-3xl text-[#F5F0EB]">
                  {formatPrice(product.priceRange[region][0], region)}
                  <span className="text-lg text-[#8A8580]"> – </span>
                  {formatPrice(product.priceRange[region][1], region)}
                </p>

                {/* Add to cart — primary CTA */}
                <button
                  onClick={handleAddToCart}
                  className="mt-6 w-full py-4 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  {addedToCart ? `${t("addToCart")} ✓` : t("addToCart")}
                </button>

                {/* Request Pricing — secondary CTA */}
                <Link
                  href="/contact"
                  className="mt-4 block text-center py-3 text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/50 hover:text-[#E8B4B8] transition-colors border border-[#1A1A1A] hover:border-[#E8B4B8]/30"
                >
                  {t("requestPricing")}
                </Link>

                {/* Talk to Designer — tertiary CTA */}
                <Link
                  href="/contact"
                  className="mt-3 block text-center text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/40 hover:text-[#E8B4B8] transition-colors"
                >
                  {t("talkToDesigner")}
                </Link>

                {/* Trust signals */}
                <div className="mt-6 pt-6 border-t border-[#1A1A1A] space-y-2">
                  <p className="text-xs text-[#8A8580]">
                    <span className="text-[#E8B4B8]">&#10003;</span> {t("freeDelivery")}
                  </p>
                  <p className="text-xs text-[#8A8580]">
                    <span className="text-[#E8B4B8]">&#10003;</span> {t("qualityGuarantee")}
                  </p>
                  <p className="text-xs text-[#8A8580]">
                    <span className="text-[#E8B4B8]">&#10003;</span> {t("madeToOrder")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8) FAQ SECTION */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[700px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {translatedFaq.map((item, i) => (
              <div key={i} className="border-b border-[#1A1A1A] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-3">{item.question}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/${rp.slug}`}
                className="group bg-[#111111] border border-[#1A1A1A] p-6 hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square mb-4 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                  <span className="font-serif text-6xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                    {rp.animal.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {slugToPrefix[rp.slug] ? t(`${slugToPrefix[rp.slug]}Name` as TranslationKeys) : rp.name}
                </h3>
                <p className="text-xs text-[#8A8580] mt-1">{slugToPrefix[rp.slug] ? t(`${slugToPrefix[rp.slug]}Tagline` as TranslationKeys) : rp.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Room Visualization Modal */}
      <RoomVisualizationModal
        product={product}
        isOpen={showRoomViz}
        onClose={() => setShowRoomViz(false)}
        onBuyThisPiece={scrollToPurchase}
      />
    </>
  );
}
