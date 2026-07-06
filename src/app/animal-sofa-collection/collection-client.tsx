"use client";

import Link from "next/link";
import { formatPrice, type Region } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/seo";

const slugToPrefix: Record<string, string> = {
  "gorilla-sofa": "gorillaSofa",
  "silverback-sofa": "silverbackSofa",
  "owl-sofa": "owlChair",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  "muscle-gorilla-sofa": "muscleGorillaSofa",
};

const productCardImages: Record<string, string> = {
  "gorilla-sofa": "/products/gorilla-sofa/featured.webp",
  "silverback-sofa": "/products/silverback-sofa/gray.jpg",
  "owl-sofa": "/products/owl/snowy-white.png",
  "meteorite-ring-sofa": "/products/meteorite-ring-sofa/main.jpg",
  "muscle-gorilla-sofa": "/products/muscle-gorilla-sofa/main.jpg",
};

export function CollectionClient() {
  const { region } = useCart();
  const products = useProducts();
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
        <div className="pt-8 pb-4 sm:pt-12 sm:pb-6 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6">
            <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-3">
              Featured Works
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#F5F0EB]">
              {t("animalCollectionTitle")}
            </h1>
            <p className="mt-2 text-sm text-[#F5F0EB]/50 font-light max-w-2xl">
              Each piece is made individually after order confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Products — 5 products, flat display, no filters */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {products.filter((p) => p.images && p.images.length > 0).map((product, idx) => (
            <Link
              key={product.slug}
              href={`/${product.slug}`}
              className={`group bg-[#111111] border border-[#1A1A1A] overflow-hidden hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300 ${idx === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div className={`${idx === 0 ? 'aspect-[2/1]' : 'aspect-square'} bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden`}>
                {product.images && product.images.length > 0 ? (
                  <img src={productCardImages[product.slug] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-8xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                    {product.animal.charAt(0)}
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs text-[#E8B4B8]/50 tracking-[0.1em] uppercase mb-1">
                  {product.animal}
                </p>
                <h2 className="font-serif text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Name` as TranslationKeys) : product.name}
                </h2>
                <p className="mt-2 text-sm text-[#8A8580]">
                  {slugToPrefix[product.slug] ? t(`${slugToPrefix[product.slug]}Tagline` as TranslationKeys) : product.tagline}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[#F5F0EB]/70">
                    {t("from")} {formatPrice(product.priceRange[region][0], region)}
                  </p>
                  <span className="text-xs text-[#8A8580] tracking-wide">
                    Made to order (1–2 weeks)
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
