"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  "muscle-gorilla-sofa": "muscleGorillaSofa",
};

const slugToImage: Record<string, string> = {
  "bear-sofa": "/products/bear-sofa/thumb.jpg",
  "lion-sofa": "/products/lion-sofa/thumb.jpg",
  "tiger-sofa": "/products/tiger-sofa/thumb.jpg",
  "gorilla-sofa": "/products/gorilla-sofa/thumb.jpg",
  "owl-sofa": "/products/owl-sofa/thumb.jpg",
  "silverback-sofa": "/products/silverback-sofa/thumb.jpg",
  "meteorite-ring-sofa": "/products/meteorite-ring-sofa/thumb.jpg",
  "muscle-gorilla-sofa": "/products/muscle-gorilla-sofa/thumb.jpg",
};

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, toggleSelect, toggleSelectAll,
    selectedItems, selectedTotal, allSelected, region,
  } = useCart();
  const { t } = useLanguage();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 border border-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-3 tracking-wide">
          {t("cartTitle")}
        </h1>
        <p className="text-[#8A8580] mb-8 text-sm">{t("cartEmpty")}</p>
        <Link
          href="/animal-sofa-collection"
          className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("cartContinueShopping")}
        </Link>
      </div>
    );
  }

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] tracking-wide">
          {t("cartTitle")}
        </h1>
        <span className="text-sm text-[#8A8580] tracking-wider uppercase">
          {items.length} {items.length === 1 ? "1 item" : `${items.length} ${t("cartItems")}`}
        </span>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1A1A1A]">
        <button
          onClick={() => toggleSelectAll(!allSelected)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
            allSelected
              ? "bg-[#E8B4B8] border-[#E8B4B8]"
              : "border-[#333] hover:border-[#E8B4B8]"
          }`}
          aria-label={allSelected ? "Deselect all" : "Select all"}
        >
          {allSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>
        <span className="text-sm text-[#8A8580]">
          {allSelected ? t("cartDeselectAll") : t("cartSelectAll")}
        </span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-32">
        {items.map((item) => {
          const price = getUnitPrice(item.product, item.region);
          const itemTotal = price * item.quantity;
          const productName = slugToPrefix[item.product.slug]
            ? t(`${slugToPrefix[item.product.slug]}Name` as TranslationKeys)
            : item.product.name;
          const thumbSrc = slugToImage[item.product.slug] || "/products/placeholder/thumb.jpg";
          const isConfirming = confirmDelete === `${item.product.slug}-${item.materialOption}`;

          return (
            <div
              key={`${item.product.slug}-${item.materialOption}`}
              className={`bg-[#111111] border transition-all duration-300 cursor-pointer ${
                item.selected
                  ? "border-l-2 border-l-[#E8B4B8] border-[#1A1A1A]"
                  : "border-[#1A1A1A] opacity-70"
              }`}
              onClick={() => toggleSelect(item.product.slug, item.materialOption)}
            >
              <div className="p-6 flex gap-5">
                {/* Select checkbox */}
                <div className="flex items-start pt-1">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
                      item.selected
                        ? "bg-[#E8B4B8] border-[#E8B4B8]"
                        : "border-[#333] hover:border-[#E8B4B8]"
                    }`}
                  >
                    {item.selected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Product Image */}
                <div className="w-[60px] h-[60px] bg-[#1A1A1A] shrink-0 overflow-hidden relative">
                  <Image
                    src={thumbSrc}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#F5F0EB]">{productName}</h3>
                      <p className="text-xs text-[#8A8580] mt-1 tracking-wider uppercase">
                        {item.materialOption} &middot; {item.materialType}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isConfirming) {
                          removeItem(item.product.slug, item.materialOption);
                          setConfirmDelete(null);
                        } else {
                          setConfirmDelete(`${item.product.slug}-${item.materialOption}`);
                        }
                      }}
                      onBlur={() => setConfirmDelete(null)}
                      className={`text-xs shrink-0 px-3 py-1.5 border transition-all duration-300 ${
                        isConfirming
                          ? "bg-red-900/30 border-red-800 text-red-300"
                          : "border-[#333] text-[#8A8580] hover:border-[#E8B4B8] hover:text-[#E8B4B8]"
                      }`}
                    >
                      {isConfirming ? t("cartRemoveConfirm") : t("cartRemove")}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity - 1)}
                        className="w-7 h-7 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center text-sm transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#F5F0EB] w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity + 1)}
                        className="w-7 h-7 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[#F5F0EB] font-light">{formatPrice(itemTotal, region)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Fixed Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] backdrop-blur-sm z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-[#8A8580]">
              {selectedItems.length} {t("cartSelected")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#8A8580]">{t("cartShipping")}:</span>
              <span className="text-[#E8B4B8]">
                {shippingFee === 0 ? (t("free") || "Free") : formatPrice(shippingFee, region)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-[#8A8580] block">{t("cartTotal")}</span>
              <span className="text-xl text-[#F5F0EB] font-light">
                {formatPrice(selectedTotal + shippingFee, region)}
              </span>
            </div>
            <Link
              href={selectedItems.length > 0 ? "/checkout" : "#"}
              className={`px-8 py-3 text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
                selectedItems.length > 0
                  ? "border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A]"
                  : "border border-[#333] text-[#8A8580] cursor-not-allowed pointer-events-none"
              }`}
            >
              {t("cartCheckout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
