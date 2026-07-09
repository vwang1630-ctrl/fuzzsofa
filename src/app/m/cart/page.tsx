"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import "@/app/m/sofaapp.css";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    toggleSelect,
    toggleSelectAll,
    totalItems,
    selectedItems,
    selectedTotal,
    allSelected,
    region,
  } = useCart();

  // 商品图片映射
  const slugToImage: Record<string, string> = {
    "owl-sofa": "/products/owl/black-leather.png",
    "owl": "/products/owl/black-leather.png",
  };

  // 获取单价
  const getUnitPrice = (item: typeof items[0]) => {
    const range = item.product.priceRange[region] || item.product.priceRange.americas;
    return range[0];
  };

  // 跳转结算
  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    router.push("/m/checkout");
  };

  // 返回首页
  const handleBack = () => {
    router.push("/m");
  };

  // 获取商品key
  const getItemKey = (item: typeof items[0]) => `${item.product.slug}-${item.materialOption || "default"}`;

  // 计算运费
  const shipping = selectedTotal >= 10000 ? 0 : 300;
  const grandTotal = selectedTotal + shipping;

  return (
    <div id="cartPage" className="shop-page" style={{ padding: "0" }}>
      {/* 顶部导航栏 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#0A0A0A",
          borderBottom: "1px solid #1A1A1A",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 100
        }}>
        <button
          onClick={handleBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#E8B4B8",
            cursor: "pointer",
            padding: "4px"
          }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#F5F0EB",
            margin: 0,
            flex: 1
          }}>
          Shopping Cart
        </h1>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            color: "#8A8580",
            letterSpacing: "0.05em"
          }}>
          {totalItems} items
        </span>
      </div>

      {/* 商品列表 */}
      <section className="shop-section">
        {/* 全选栏 */}
        <div className="cart-select-row">
          <div
            className={`cart-checkbox ${allSelected ? "checked" : ""}`}
            onClick={() => toggleSelectAll(!allSelected)}
          >
            {allSelected && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="cart-select-label">Select All</span>
        </div>

        {/* 商品卡片列表 */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6A6560" strokeWidth="1">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="cart-empty-text">Your cart is empty</p>
            <Link href="/m" className="cart-empty-link">
              Continue Shopping
            </Link>
          </div>
        ) : (
          items.map((item) => {
            const key = getItemKey(item);
            const imageSrc = slugToImage[item.product.slug] || "/products/owl/black-leather.png";
            const unitPrice = getUnitPrice(item);

            return (
              <div key={key} className="shop-item-card">
                {/* 选择框 */}
                <div
                  className={`cart-checkbox ${item.selected ? "checked" : ""}`}
                  onClick={() => toggleSelect(item.product.slug, item.materialOption)}
                >
                  {item.selected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* 缩略图 */}
                <div className="shop-item-thumb">
                  <img src={imageSrc} alt={item.product.name} />
                </div>

                {/* 商品信息 */}
                <div className="shop-item-info">
                  <div className="shop-item-row1">
                    <span className="shop-item-name">{item.product.name}</span>
                    <span className="shop-item-qty">×{item.quantity}</span>
                  </div>
                  <div className="shop-item-spec">{item.materialOption || "Standard"}</div>

                  {/* 数量控制 */}
                  <div className="cart-qty-control">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product.slug, item.materialOption, Math.max(1, item.quantity - 1))}
                    >
                      −
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 价格 */}
                <div className="shop-item-price">
                  <span className="shop-item-price-value">${(unitPrice * item.quantity).toLocaleString()}</span>
                </div>

                {/* 删除按钮 */}
                <button
                  className="cart-delete-btn"
                  onClick={() => removeItem(item.product.slug, item.materialOption)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </section>

      {/* 费用明细 */}
      {items.length > 0 && (
        <section className="shop-section">
          <div className="shop-fee-row">
            <span className="shop-fee-label">Subtotal</span>
            <span className="shop-fee-value">${selectedTotal.toLocaleString()}</span>
          </div>
          <div className="shop-fee-row">
            <span className="shop-fee-label">Shipping</span>
            <span className={`shop-fee-value ${selectedTotal >= 10000 ? "shop-fee-free" : ""}`}>
              {selectedTotal >= 10000 ? "Free" : "$300"}
            </span>
          </div>
          <div className="shop-fee-row">
            <span className="shop-fee-total-label">Total</span>
            <span className="shop-fee-total-value">
              ${grandTotal.toLocaleString()} USD
            </span>
          </div>
        </section>
      )}

      {/* 底部结算按钮 */}
      <div className="shop-bottom-bar">
        <button className="panel-confirm-btn" onClick={handleCheckout} disabled={selectedItems.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
