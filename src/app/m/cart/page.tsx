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

  // 返回
  const handleBack = () => {
    router.back();
  };

  // 获取商品key
  const getItemKey = (item: typeof items[0]) => {
    return `${item.product.slug}-${item.materialOption || 'default'}`;
  };

  // 计算运费
  const shipping = selectedTotal >= 10000 ? 0 : 300;
  const grandTotal = selectedTotal + shipping;

  return (
    <div className="cart-page-new">
      {/* 顶部导航栏 */}
      <div className="cart-header-new">
        <button onClick={handleBack} className="cart-back-btn">
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
        <h1 className="cart-title-new">SHOPPING CART</h1>
        <span className="cart-items-count">{totalItems} items</span>
      </div>

      {/* 内容区域 */}
      <div className="cart-content-new">
        {/* 全选栏 */}
        {items.length > 0 && (
          <div className="cart-select-all-bar">
            <div
              className={`cart-checkbox-new ${allSelected ? "checked" : ""}`}
              onClick={() => toggleSelectAll(!allSelected)}
            >
              {allSelected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="cart-select-label-new">Select All</span>
          </div>
        )}

        {/* 商品卡片列表 */}
        {items.length === 0 ? (
          <div className="cart-empty-new">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="cart-empty-title">Your Cart is Empty</p>
            <p className="cart-empty-text">Discover our handcrafted animal-inspired furniture</p>
            <Link href="/m" className="cart-empty-btn">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="cart-items-list">
            {items.map((item) => {
              const key = getItemKey(item);
              const imageSrc = slugToImage[item.product.slug] || "/products/owl/black-leather.png";
              const unitPrice = getUnitPrice(item);

              return (
                <div key={key} className="cart-item-card">
                  <div className="cart-item-content">
                    {/* 选择框 */}
                    <div
                      className={`cart-checkbox-new ${item.selected ? "checked" : ""}`}
                      onClick={() => toggleSelect(item.product.slug, item.materialOption)}
                    >
                      {item.selected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* 缩略图 */}
                    <div className="cart-item-image">
                      <img
                        src={imageSrc}
                        alt={item.product.name}
                      />
                    </div>

                    {/* 商品信息 */}
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.product.name}</p>
                      <p className="cart-item-variant">{item.materialOption || "Standard"} × {item.quantity}</p>
                      <p className="cart-item-price">${(unitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 底部操作栏 */}
                  <div className="cart-item-actions">
                    {/* 数量控制 */}
                    <div className="cart-qty-control-new">
                      <button
                        className="cart-qty-btn-new"
                        onClick={() => updateQuantity(item.product.slug, item.materialOption, Math.max(1, item.quantity - 1))}
                      >
                        −
                      </button>
                      <span className="cart-qty-num-new">{item.quantity}</span>
                      <button
                        className="cart-qty-btn-new"
                        onClick={() => updateQuantity(item.product.slug, item.materialOption, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      className="cart-delete-btn-new"
                      onClick={() => removeItem(item.product.slug, item.materialOption)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 费用明细 */}
        {items.length > 0 && (
          <div className="cart-summary-card">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal</span>
              <span className="cart-summary-value">${selectedTotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Shipping</span>
              <span className={`cart-summary-value ${selectedTotal >= 10000 ? "free" : ""}`}>
                {selectedTotal >= 10000 ? "Free" : "$300"}
              </span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row total">
              <span className="cart-summary-label">Total</span>
              <span className="cart-summary-value total">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* 底部结算按钮 */}
      {items.length > 0 && (
        <div className="cart-bottom-bar-new">
          <button 
            className="cart-checkout-btn" 
            onClick={handleCheckout} 
            disabled={selectedItems.length === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
}
