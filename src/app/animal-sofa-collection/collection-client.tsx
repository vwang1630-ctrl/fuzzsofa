"use client";

import Link from "next/link";
import { products, formatPrice, type Region } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { breadcrumbJsonLd } from "@/lib/seo";

export function CollectionClient() {
  const { region } = useCart();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Animal Sofa Collection", url: "https://fuzzsofa.com/animal-sofa-collection" },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="relative">
        <div className="py-20 md:py-32 text-center bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">
              The Complete Collection
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
              Animal Sofa Collection
            </h1>
            <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
              Five sculptural pieces, each translating the essential qualities of a distinct animal into functional furniture form. Made to order in Shanghai, delivered worldwide.
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
              className="group bg-[#141414] border border-[#222] overflow-hidden hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                />
                <span className="font-serif text-8xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                  {product.animal.charAt(0)}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#E8B4B8]/50 tracking-[0.1em] uppercase mb-1">
                  {product.animal}-Inspired
                </p>
                <h2 className="font-serif text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-[#6B6B6B]">{product.tagline}</p>
                <p className="mt-3 text-[#F5F0EB]/70">
                  From {formatPrice(product.priceRange[region][0], region)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.materialOptions?.map((opt) => (
                    <span key={opt.type} className="text-xs border border-[#333] px-3 py-1 text-[#6B6B6B]">
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
      <section className="border-t border-[#222] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">Made to Order</h3>
              <p className="text-sm text-[#6B6B6B]">Each piece is crafted to your specifications at our Shanghai workshop, 8–12 weeks production</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">White-Glove Delivery</h3>
              <p className="text-sm text-[#6B6B6B]">Free worldwide delivery with professional installation and packaging removal</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">Quality Guarantee</h3>
              <p className="text-sm text-[#6B6B6B]">14-day quality guarantee with full shipping documentation and video evidence</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
