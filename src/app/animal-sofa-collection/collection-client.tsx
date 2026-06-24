"use client";

import Link from "next/link";
import { products, formatPrice, type Region } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/seo";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "silverback-sofa": "silverbackSofa",
  "owl-sofa": "owlChair",
};

const productCardImages: Record<string, string> = {
  "gorilla-sofa": "/products/gorilla-sofa/gray.jpg",
  "silverback-sofa": "/products/silverback-sofa/beige.jpg",
  "owl-sofa": "/products/owl/snowy-white.png",
};

export function CollectionClient() {
  const { region } = useCart();
  const { t } = useLanguage();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: t("animalCollectionTitle"), url: "https://fuzzsofa.com/animal-sofa-collection" },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="relative">
        <div className="py-20 md:py-32 text-center bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">
              {t("fullCollection")}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
              {t("animalCollectionTitle")}
            </h1>
            <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
              {t("fullCollectionDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${product.slug}`}
              className="group bg-[#111111] border border-[#1A1A1A] overflow-hidden hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                {productCardImages[product.slug] ? (
                  <img src={productCardImages[product.slug]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                      style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                    />
                    <span className="font-serif text-8xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                      {product.animal.charAt(0)}
                    </span>
                  </>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs text-[#E8B4B8]/50 tracking-[0.1em] uppercase mb-1">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                </p>
                <h2 className="font-serif text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                </h2>
                <p className="mt-2 text-sm text-[#8A8580]">{slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Tagline` as TranslationKeys) : product.tagline}</p>
                <p className="mt-3 text-[#F5F0EB]/70">
                  {t("from")} {formatPrice(product.priceRange[region][0], region)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.materialOptions?.map((opt) => (
                    <span key={opt.type} className="text-xs border border-[#333] px-3 py-1 text-[#8A8580]">
                      {opt.type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-[#1A1A1A] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">{t("madeToOrder")}</h3>
              <p className="text-sm text-[#8A8580]">{t("madeToOrderDesc")}</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">{t("whiteGloveDelivery")}</h3>
              <p className="text-sm text-[#8A8580]">{t("whiteGloveDeliveryDesc")}</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">{t("qualityGuarantee")}</h3>
              <p className="text-sm text-[#8A8580]">{t("qualityGuaranteeDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Content: What is an Animal Sofa? */}
      <section className="border-t border-[#1A1A1A] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-6">{t("whatIsAnimalSofa")}</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed mb-4">
            {t("whatIsAnimalSofaDesc1")}
          </p>
          <p className="text-[#F5F0EB]/60 leading-relaxed mb-4">
            {t("whatIsAnimalSofaDesc2")}
          </p>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            {t("whatIsAnimalSofaDesc3")}
          </p>
        </div>
      </section>
    </>
  );
}
