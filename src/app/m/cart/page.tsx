"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import "@/sofaapp.css";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
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
    // 将选中商品存入 sessionStorage
    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    router.push("/m/checkout");
  };

  // 返回首页
  const handleBack = () => {
    router.push("/m");
  };

  // 获取商品key
  const getItemKey = (item: typeof items[0]) => `${item.product.slug}-${item.materialOption || "default"}`;

  return (
    <div className="shop-page">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <div className="shop-header-inner">
          <button onClick={handleBack} className="shop-header-back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="shop-header-title">购物车</h1>
          <span style={{ color: "#8A8580", fontSize: "14px" }}>{totalItems}件</span>
        </div>
      </div>

      {/* 商品列表 */}
      <section className="shop-section">
        {/* 全选栏 */}
        <div className="cart-select-row">
          <div
            className={`cart-checkbox ${allSelected ? "checked" : ""}`}
            onClick={() => toggleSelectAll(!allSelected)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {allSelected && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span style={{ marginLeft: "12px", color: "#8A8580", fontSize: "14px" }}>全选</span>
        </div>

        {/* 商品卡片列表 */}
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8580" }}>
            <p style={{ fontSize: "14px" }}>购物车是空的</p>
            <Link href="/m" style={{ color: "#E8B4B8", fontSize: "14px", marginTop: "16px" }}>
              去选购
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
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center" }}
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
                  <div className="shop-item-spec">{item.materialOption || "标准款"}</div>

                  {/* 数量控制 */}
                  <div className="cart-qty-control" style={{ marginTop: "8px" }}>
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
                <div className="shop-item-price" style={{ alignSelf: "center" }}>
                  <span className="shop-item-price-value">${(unitPrice * item.quantity).toLocaleString()}</span>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => removeItem(item.product.slug, item.materialOption)}
                  style={{ alignSelf: "center", color: "#6A6560", background: "none", border: "none", marginLeft: "8px" }}
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
            <span className="shop-fee-label">商品小计</span>
            <span className="shop-fee-value">${selectedTotal.toLocaleString()}</span>
          </div>
          <div className="shop-fee-row">
            <span className="shop-fee-label">运费</span>
            <span className={`shop-fee-value ${selectedTotal >= 10000 ? "shop-fee-free" : ""}`}>
              {selectedTotal >= 10000 ? "免运费" : "$300"}
            </span>
          </div>
          <div className="shop-fee-row">
            <span className="shop-fee-total-label">总计</span>
            <span className="shop-fee-total-value">
              ${(selectedTotal + (selectedTotal >= 10000 ? 0 : 300)).toLocaleString()} USD
            </span>
          </div>
        </section>
      )}

      {/* 底部结算按钮 */}
      <div className="shop-bottom-bar">
        <button className="shop-submit-btn" onClick={handleCheckout} disabled={selectedItems.length === 0}>
          确认下单
        </button>
      </div>
    </div>
  );
}