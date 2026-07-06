"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";
import "@/sofaapp.css";

interface AddressForm {
  recipientName: string;
  detailedAddress: string;
  city: string;
  zipCode: string;
}

interface FormErrors {
  recipientName?: string;
  detailedAddress?: string;
  city?: string;
  zipCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart, region } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [addressForm, setAddressForm] = useState<AddressForm>({
    recipientName: "",
    detailedAddress: "",
    city: "",
    zipCode: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // 商品图片映射
  const slugToImage: Record<string, string> = {
    "owl-sofa": "/products/owl/black-leather.png",
    "owl": "/products/owl/black-leather.png",
  };

  // 从 sessionStorage 读取结算商品
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutItems");
    if (stored) {
      setCheckoutItems(JSON.parse(stored));
    } else {
      // 没有商品则返回购物车
      router.push("/m/cart");
    }
  }, [router]);

  // 获取单价
  const getUnitPrice = (item: CartItem) => {
    const range = item.product.priceRange[region] || item.product.priceRange.americas;
    return range[0];
  };

  // 计算总价
  const selectedTotal = checkoutItems.reduce((total: number, item: CartItem) => {
    return total + getUnitPrice(item) * item.quantity;
  }, 0);

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;
  const totalWithShipping = selectedTotal + shippingFee;

  // 表单验证
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!addressForm.recipientName.trim()) errors.recipientName = "请填写收件人姓名";
    if (!addressForm.detailedAddress.trim()) errors.detailedAddress = "请填写详细地址";
    if (!addressForm.city.trim()) errors.city = "请填写城市";
    if (!addressForm.zipCode.trim()) errors.zipCode = "请填写邮编";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交订单
  const handleSubmit = () => {
    if (!validateForm()) return;
    // 生成订单号
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setIsSubmitted(true);
    // 清空购物车中已结算的商品
    clearCart();
    // 清空 sessionStorage
    sessionStorage.removeItem("checkoutItems");
  };

  // 返回购物车
  const handleBack = () => {
    router.push("/m/cart");
  };

  // 关闭结算页
  const handleClose = () => {
    router.push("/m");
  };

  // 订单成功页面
  if (isSubmitted) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="shop-header-inner">
            <button onClick={handleClose} className="shop-header-back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="shop-header-title">订单成功</h1>
            <span></span>
          </div>
        </div>

        <div style={{ padding: "60px 16px", textAlign: "center" }}>
          {/* 成功图标 */}
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "2px solid #E8B4B8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p style={{ color: "#F5F0EB", fontSize: "18px", marginBottom: "12px" }}>订单提交成功</p>
          <p style={{ color: "#8A8580", fontSize: "14px", marginBottom: "24px" }}>订单号: {orderId}</p>

          {/* 商品明细 */}
          <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: "24px" }}>
            <div style={{ fontSize: "12px", color: "#6A6560", marginBottom: "16px" }}>商品明细</div>
            {checkoutItems.map((item: CartItem) => (
              <div key={item.product.slug} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ color: "#F5F0EB", fontSize: "14px" }}>
                  {item.product.name} ×{item.quantity}
                </span>
                <span style={{ color: "#F5F0EB", fontSize: "14px" }}>
                  ${(getUnitPrice(item) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div style={{ marginTop: "40px", display: "flex", gap: "12px" }}>
            <button className="shop-submit-btn" onClick={() => router.push("/m")}>
              继续选购
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="shop-header-title">结算</h1>
          <button onClick={handleClose} className="shop-header-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* 商品清单模块 */}
      <section className="shop-section">
        <div className="shop-section-title">商品清单</div>
        {checkoutItems.map((item: CartItem) => {
          const imageSrc = slugToImage[item.product.slug] || "/products/owl/black-leather.png";
          const unitPrice = getUnitPrice(item);
          const itemTotal = unitPrice * item.quantity;

          return (
            <div key={item.product.slug} className="shop-item-card">
              {/* 左侧缩略图 */}
              <div className="shop-item-thumb">
                <img src={imageSrc} alt={item.product.name} />
              </div>

              {/* 右侧商品信息 */}
              <div className="shop-item-info">
                {/* 第一行：商品名称 + 数量 */}
                <div className="shop-item-row1">
                  <span className="shop-item-name">{item.product.name}</span>
                  <span className="shop-item-qty">×{item.quantity}</span>
                </div>
                {/* 第二行：颜色·面料 */}
                <div className="shop-item-spec">{item.materialOption || "标准款"}</div>
              </div>

              {/* 价格右对齐 */}
              <div className="shop-item-price">
                <span className="shop-item-price-value">${itemTotal.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 配送信息模块 */}
      <section className="shop-section">
        <div className="shop-section-title">配送信息</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 收件人姓名 */}
          <div>
            <input
              type="text"
              placeholder="收件人姓名"
              value={addressForm.recipientName}
              onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
              className={`shop-input ${formErrors.recipientName ? "shop-input-error" : ""}`}
            />
            {formErrors.recipientName && <div className="shop-input-error-text">{formErrors.recipientName}</div>}
          </div>

          {/* 详细地址 */}
          <div>
            <input
              type="text"
              placeholder="详细地址"
              value={addressForm.detailedAddress}
              onChange={(e) => setAddressForm({ ...addressForm, detailedAddress: e.target.value })}
              className={`shop-input ${formErrors.detailedAddress ? "shop-input-error" : ""}`}
            />
            {formErrors.detailedAddress && <div className="shop-input-error-text">{formErrors.detailedAddress}</div>}
          </div>

          {/* 城市 */}
          <div>
            <input
              type="text"
              placeholder="城市"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              className={`shop-input ${formErrors.city ? "shop-input-error" : ""}`}
            />
            {formErrors.city && <div className="shop-input-error-text">{formErrors.city}</div>}
          </div>

          {/* 邮编 */}
          <div>
            <input
              type="text"
              placeholder="邮编"
              value={addressForm.zipCode}
              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
              className={`shop-input ${formErrors.zipCode ? "shop-input-error" : ""}`}
            />
            {formErrors.zipCode && <div className="shop-input-error-text">{formErrors.zipCode}</div>}
          </div>
        </div>
      </section>

      {/* 支付方式模块 */}
      <section className="shop-section">
        <div className="shop-section-title">支付方式</div>
        <div className="shop-payment-row">
          <button
            className={`shop-payment-btn ${paymentMethod === "credit-card" ? "active" : ""}`}
            onClick={() => setPaymentMethod("credit-card")}
          >
            信用卡
          </button>
          <button
            className={`shop-payment-btn ${paymentMethod === "paypal" ? "active" : ""}`}
            onClick={() => setPaymentMethod("paypal")}
          >
            PayPal
          </button>
          <button
            className={`shop-payment-btn ${paymentMethod === "alipay" ? "active" : ""}`}
            onClick={() => setPaymentMethod("alipay")}
          >
            支付宝
          </button>
        </div>
      </section>

      {/* 费用明细模块 */}
      <section className="shop-section">
        <div className="shop-fee-row">
          <span className="shop-fee-label">小计</span>
          <span className="shop-fee-value">${selectedTotal.toLocaleString()} USD</span>
        </div>
        <div className="shop-fee-row">
          <span className="shop-fee-label">运费</span>
          <span className={`shop-fee-value ${shippingFee === 0 ? "shop-fee-free" : ""}`}>
            {shippingFee === 0 ? "免费" : `$${shippingFee} USD`}
          </span>
        </div>
        <div className="shop-fee-row">
          <span className="shop-fee-total-label">总计</span>
          <span className="shop-fee-total-value">${totalWithShipping.toLocaleString()} USD</span>
        </div>
      </section>

      {/* 底部结算按钮 */}
      <div className="shop-bottom-bar">
        <button className="shop-submit-btn" onClick={handleSubmit}>
          确认下单
        </button>
      </div>
    </div>
  );
}