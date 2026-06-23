"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQuantity, region } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-4xl font-light text-[#F5F0EB] mb-4">{t("yourCart")}</h1>
        <p className="text-[#8A8580] mb-8">{t("cartEmpty")}</p>
        <Link
          href="/animal-sofa-collection"
          className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.priceRange[region][0];
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-light text-[#F5F0EB] mb-12">{t("yourCart")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const price = item.product.priceRange[region][0];
            return (
              <div
                key={`${item.product.slug}-${item.materialOption}`}
                className="bg-[#111111] border border-[#1A1A1A] p-6 flex gap-6"
              >
                <div className="w-24 h-24 bg-[#1A1A1A] flex items-center justify-center shrink-0">
                  <span className="font-serif text-3xl text-[#F5F0EB]/[0.08]">
                    {item.product.animal.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#F5F0EB]">{item.product.name}</h3>
                      <p className="text-xs text-[#8A8580] mt-1">
                        {item.materialType} &middot; {item.materialOption}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.slug)}
                      className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors shrink-0"
                    >
                      {t("remove")}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        className="w-7 h-7 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center text-sm transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#F5F0EB] w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        className="w-7 h-7 border border-[#333] text-[#F5F0EB]/50 hover:border-[#E8B4B8] hover:text-[#E8B4B8] flex items-center justify-center text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[#F5F0EB]">{formatPrice(price * item.quantity, region)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-[#111111] border border-[#1A1A1A] p-6">
            <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("orderSummary")}</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("subtotal")}</span>
                <span className="text-[#F5F0EB]">{formatPrice(subtotal, region)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("shipping")}</span>
                <span className="text-[#E8B4B8]">{t("free")}</span>
              </div>
              <div className="border-t border-[#1A1A1A] pt-3 flex justify-between">
                <span className="text-[#F5F0EB]">{t("total")}</span>
                <span className="text-[#F5F0EB] font-medium">{formatPrice(subtotal, region)}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#8A8580]">
              {t("whiteGloveGuarantee")}
            </p>

            <Link
              href="/checkout"
              className="mt-6 block w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase text-center hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
            >
              {t("checkout")}
            </Link>

            <Link
              href="/animal-sofa-collection"
              className="mt-3 block text-center text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
