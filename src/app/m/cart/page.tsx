"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

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

export default function MobileCartPage() {
  const router = useRouter();
  const {
    items, removeItem, updateQuantity, toggleSelect, toggleSelectAll,
    selectedItems, selectedTotal, allSelected, region,
  } = useCart();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 border border-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-light text-[#F5F0EB] mb-3 tracking-wide">购物车</h1>
        <p className="text-[#8A8580] mb-8 text-sm">您的购物车是空的</p>
        <Link
          href="/m"
          className="inline-flex items-center px-6 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          继续浏览
        </Link>
      </div>
    );
  }

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;
  const totalWithShipping = selectedTotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A] px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/m" className="text-[#8A8580] hover:text-[#F5F0EB]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-serif text-xl font-light text-[#F5F0EB] tracking-wide">购物车</h1>
          <span className="text-sm text-[#8A8580]">{items.length} 件</span>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1A1A1A]">
        <button
          onClick={() => toggleSelectAll(!allSelected)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
            allSelected
              ? "bg-[#E8B4B8] border-[#E8B4B8]"
              : "border-[#333] hover:border-[#E8B4B8]"
          }`}
          aria-label={allSelected ? "取消全选" : "全选"}
        >
          {allSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>
        <span className="text-sm text-[#8A8580]">{allSelected ? "取消全选" : "全选"}</span>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-4">
        {items.map((item) => {
          const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
          const unitPrice = getUnitPrice(item.product, region);
          const itemTotal = unitPrice * item.quantity;
          const itemKey = `${item.product.slug}-${item.materialOption}`;

          return (
            <div key={itemKey} className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
              {/* Selection checkbox */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleSelect(item.product.slug, item.materialOption)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 mt-1 ${
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
                </button>

                {/* Product image */}
                <div className="w-20 h-20 rounded overflow-hidden bg-[#1A1A1A]">
                  <Image
                    src={imageSrc}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#F5F0EB] font-medium text-sm truncate">{item.product.name}</h3>
                  <p className="text-[#8A8580] text-xs mt-1">{item.materialType} · {item.materialOption}</p>
                  <p className="text-[#E8B4B8] font-medium mt-2">${formatPrice(unitPrice)}</p>
                </div>

                {/* Delete button */}
                {confirmDelete === itemKey ? (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        removeItem(item.product.slug, item.materialOption);
                        setConfirmDelete(null);
                      }}
                      className="text-xs text-[#E8B4B8] px-2 py-1 border border-[#E8B4B8] rounded"
                    >
                      删除
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs text-[#8A8580] px-2 py-1"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(itemKey)}
                    className="text-[#8A8580] hover:text-[#F5F0EB] p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Quantity controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-[#333] flex items-center justify-center text-[#8A8580] hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all"
                  >
                    −
                  </button>
                  <span className="text-[#F5F0EB] text-sm w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-[#333] flex items-center justify-center text-[#8A8580] hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-[#F5F0EB] font-medium">小计: ${formatPrice(itemTotal)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#1A1A1A] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#8A8580] text-sm">已选 {selectedItems.length} 件</span>
          <div className="text-right">
            <p className="text-[#8A8580] text-xs">商品总价: ${formatPrice(selectedTotal)}</p>
            <p className="text-[#8A8580] text-xs">运费: {shippingFee === 0 ? "免运费" : `$${formatPrice(shippingFee)}`}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#F5F0EB] font-medium">应付总额</span>
          <span className="text-[#E8B4B8] font-serif text-xl">${formatPrice(totalWithShipping)}</span>
        </div>
        <button
          onClick={() => {
            if (selectedItems.length > 0) {
              router.push("/m/checkout");
            }
          }}
          disabled={selectedItems.length === 0}
          className={`w-full py-4 rounded text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
            selectedItems.length > 0
              ? "bg-[#E8B4B8] text-[#0A0A0A] hover:bg-[#F5F0EB]"
              : "bg-[#1A1A1A] text-[#8A8580] cursor-not-allowed"
          }`}
        >
          去结算 ({selectedItems.length})
        </button>
      </div>
    </div>
  );
}