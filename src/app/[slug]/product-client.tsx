"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { Product, Region } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { getProduct } from "@/lib/products";
import { RoomVisualizationModal } from "@/components/room-visualization-modal";

interface Props {
  product: Product;
}

export function ProductPageClient({ product }: Props) {
  const { addItem, region, setRegion } = useCart();
  const [materialType, setMaterialType] = useState<string>(
    product.materialOptions?.[0]?.type || "Fabric"
  );
  const [materialOption, setMaterialOption] = useState<string>(
    product.materialOptions?.[0]?.options[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showRoomViz, setShowRoomViz] = useState(false);
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
    { value: "middleEast", label: "Middle East (USD)" },
    { value: "southeastAsia", label: "SE Asia (USD)" },
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

      {/* HERO */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#141414] to-[#0A0A0A] relative overflow-hidden">
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
                {product.name}
              </h1>
              <p className="mt-3 text-lg text-[#F5F0EB]/50 font-light">{product.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-6">
              The Concept
            </h2>
            <p className="text-[#F5F0EB]/70 leading-relaxed text-base">{product.concept}</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-6">
              Where It Belongs
            </h2>
            <p className="text-[#F5F0EB]/70 leading-relaxed text-base">{product.interiorContext}</p>
            <div className="mt-6 flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* SPECIFICATIONS */}
      <section className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-sm text-[#F5F0EB]/80">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRY IN YOUR ROOM */}
      <section className="border-t border-[#222] bg-gradient-to-b from-[#0A0A0A] to-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-6 py-16">
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
                  <circle
                    cx="14"
                    cy="14.5"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-xl md:text-2xl font-light text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                  Try in Your Room
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Upload a photo and see the {product.name} in your space with AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/40 group-hover:text-[#E8B4B8] transition-colors duration-300">
              <span>Get Started</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Materials</h2>
          <ul className="space-y-3">
            {product.materials.map((mat, i) => (
              <li key={i} className="text-sm text-[#F5F0EB]/70 flex items-start gap-3">
                <span className="text-[#E8B4B8] mt-0.5">&#8226;</span>
                {mat}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PURCHASE SECTION */}
      <section ref={purchaseRef} className="border-t border-[#222] bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-8">Configure Your Piece</h2>

              {/* Region selector */}
              <div className="mb-8">
                <label className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase block mb-3">
                  Region
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
                  <label className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase block mb-3">
                    Material Type
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

              {/* Material option */}
              {currentMaterialOptions && (
                <div className="mb-8">
                  <label className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase block mb-3">
                    Color / Finish
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentMaterialOptions.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setMaterialOption(opt)}
                        className={`text-xs px-4 py-2 border transition-all duration-300 ${
                          materialOption === opt
                            ? "border-[#E8B4B8] text-[#E8B4B8]"
                            : "border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase block mb-3">
                  Quantity
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
              <div className="bg-[#141414] border border-[#222] p-8">
                <p className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase mb-2">Price</p>
                <p className="font-serif text-3xl text-[#F5F0EB]">
                  {formatPrice(product.priceRange[region][0], region)}
                  <span className="text-lg text-[#6B6B6B]"> – </span>
                  {formatPrice(product.priceRange[region][1], region)}
                </p>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Price varies by material selection and configuration
                </p>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className="mt-6 w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                </button>

                {/* Secondary actions */}
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/contact"
                    className="text-center py-3 text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/40 hover:text-[#E8B4B8] transition-colors border border-[#222] hover:border-[#E8B4B8]/30"
                  >
                    Request Pricing (Trade / Bulk)
                  </Link>
                  <Link
                    href="/contact"
                    className="text-center py-3 text-xs tracking-[0.1em] uppercase text-[#F5F0EB]/40 hover:text-[#E8B4B8] transition-colors"
                  >
                    Talk to a Designer
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-6 pt-6 border-t border-[#222] space-y-2">
                  <p className="text-xs text-[#6B6B6B]">
                    <span className="text-[#E8B4B8]">&#10003;</span> Free White-Glove Delivery Worldwide
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    <span className="text-[#E8B4B8]">&#10003;</span> 14-Day Quality Guarantee
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    <span className="text-[#E8B4B8]">&#10003;</span> Made to Order, 8–12 Weeks
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    <span className="text-[#E8B4B8]">&#10003;</span> Photo & Video Documentation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Related Pieces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/${rp.slug}`}
                className="group bg-[#141414] border border-[#222] p-6 hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] mb-4 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                  <span className="font-serif text-6xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                    {rp.animal.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {rp.name}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1">{rp.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl">
            {product.faq.map((item, i) => (
              <div key={i} className="border-b border-[#222] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-3">{item.question}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{item.answer}</p>
              </div>
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
