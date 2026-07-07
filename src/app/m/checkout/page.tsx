"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";
import "@/app/m/sofaapp.css";

interface AddressForm {
  country: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
}

interface FormErrors {
  country?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart, region } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [addressForm, setAddressForm] = useState<AddressForm>({
    country: "US",
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
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

  // 国家列表
  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "KR", name: "South Korea" },
    { code: "SG", name: "Singapore" },
    { code: "NZ", name: "New Zealand" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "OTHER", name: "Other" },
  ];

  // 需要州/省字段的国家
  const countriesWithState = ["US", "CA", "AU", "JP", "CN", "KR", "IN", "BR", "MX"];

  // 判断是否需要显示州/省字段
  const needsStateField = countriesWithState.includes(addressForm.country);

  // 表单验证
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!addressForm.fullName.trim()) errors.fullName = "Please enter your full name";
    if (!addressForm.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!addressForm.phone.trim()) {
      errors.phone = "Please enter your phone number";
    } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(addressForm.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!addressForm.addressLine1.trim()) errors.addressLine1 = "Please enter your address";
    if (!addressForm.city.trim()) errors.city = "Please enter your city";
    if (needsStateField && !addressForm.stateProvince.trim()) {
      errors.stateProvince = "Please enter your state/province";
    }
    if (!addressForm.postalCode.trim()) errors.postalCode = "Please enter your postal code";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交订单 - 跳转到独立的订单确认页面
  const handleSubmit = () => {
    if (!validateForm()) return;
    // 生成订单号
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    // 将订单信息存储到 sessionStorage（支付页面会读取）
    sessionStorage.setItem("paymentOrderId", newOrderId);
    sessionStorage.setItem("paymentItems", JSON.stringify(checkoutItems));
    sessionStorage.setItem("paymentTotal", totalWithShipping.toString());
    // 跳转到支付页面
    router.push("/m/payment");
  };

  // 返回购物车
  const handleBack = () => {
    router.push("/m/cart");
  };

  // 关闭结算页
  const handleClose = () => {
    router.push("/m");
  };

  return (
    <div className="shop-page">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <button onClick={handleBack} className="shop-header-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="shop-header-title">Checkout</h1>
        <button onClick={handleClose} className="shop-header-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 商品清单模块 */}
      <section className="shop-section">
        <div className="shop-section-title">Order Items</div>
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
                <div className="shop-item-spec">{item.materialOption || "Standard"}</div>
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
        <div className="shop-section-title">Shipping Information</div>
        <div className="shop-input-row">
          {/* 国家/地区选择 */}
          <div>
            <select
              value={addressForm.country}
              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
              className="shop-input shop-select"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 全名 */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={addressForm.fullName}
              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              className={`shop-input ${formErrors.fullName ? "shop-input-error" : ""}`}
            />
            {formErrors.fullName && <div className="shop-input-error-text">{formErrors.fullName}</div>}
          </div>

          {/* 邮箱 */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={addressForm.email}
              onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
              className={`shop-input ${formErrors.email ? "shop-input-error" : ""}`}
            />
            {formErrors.email && <div className="shop-input-error-text">{formErrors.email}</div>}
          </div>

          {/* 电话 */}
          <div>
            <input
              type="tel"
              placeholder="Phone"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className={`shop-input ${formErrors.phone ? "shop-input-error" : ""}`}
            />
            {formErrors.phone && <div className="shop-input-error-text">{formErrors.phone}</div>}
          </div>

          {/* 地址第1行 */}
          <div>
            <input
              type="text"
              placeholder="Address"
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              className={`shop-input ${formErrors.addressLine1 ? "shop-input-error" : ""}`}
            />
            {formErrors.addressLine1 && <div className="shop-input-error-text">{formErrors.addressLine1}</div>}
          </div>

          {/* 地址第2行（选填） */}
          <div>
            <input
              type="text"
              placeholder="Apt, Suite, etc. (optional)"
              value={addressForm.addressLine2}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
              className="shop-input"
            />
          </div>

          {/* 城市 */}
          <div>
            <input
              type="text"
              placeholder="City"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              className={`shop-input ${formErrors.city ? "shop-input-error" : ""}`}
            />
            {formErrors.city && <div className="shop-input-error-text">{formErrors.city}</div>}
          </div>

          {/* 州/省（根据国家动态显示） */}
          {needsStateField && (
            <div>
              <input
                type="text"
                placeholder="State"
                value={addressForm.stateProvince}
                onChange={(e) => setAddressForm({ ...addressForm, stateProvince: e.target.value })}
                className={`shop-input ${formErrors.stateProvince ? "shop-input-error" : ""}`}
              />
              {formErrors.stateProvince && <div className="shop-input-error-text">{formErrors.stateProvince}</div>}
            </div>
          )}

          {/* 邮编 */}
          <div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              className={`shop-input ${formErrors.postalCode ? "shop-input-error" : ""}`}
            />
            {formErrors.postalCode && <div className="shop-input-error-text">{formErrors.postalCode}</div>}
          </div>
        </div>
      </section>

      {/* 支付方式模块 */}
      <section className="shop-section">
        <div className="shop-section-title">Payment Method</div>
        <div className="shop-payment-row">
          {/* Credit Card */}
          <button
            className={`shop-payment-btn ${paymentMethod === "credit-card" ? "active" : ""}`}
            onClick={() => setPaymentMethod("credit-card")}
          >
            Credit Card
          </button>
          {/* PayPal */}
          <button
            className={`shop-payment-btn ${paymentMethod === "paypal" ? "active" : ""}`}
            onClick={() => setPaymentMethod("paypal")}
          >
            PayPal
          </button>
        </div>
      </section>

      {/* 费用明细模块 */}
      <section className="shop-section">
        <div className="shop-fee-row">
          <span className="shop-fee-label">Subtotal</span>
          <span className="shop-fee-value">${selectedTotal.toLocaleString()} USD</span>
        </div>
        <div className="shop-fee-row">
          <span className="shop-fee-label">Shipping</span>
          <span className={`shop-fee-value ${shippingFee === 0 ? "shop-fee-free" : ""}`}>
            {shippingFee === 0 ? "Free" : `$${shippingFee} USD`}
          </span>
        </div>
        <div className="shop-fee-row">
          <span className="shop-fee-total-label">Total</span>
          <span className="shop-fee-total-value">${totalWithShipping.toLocaleString()} USD</span>
        </div>
      </section>

      {/* 底部确认下单按钮 */}
      <div className="shop-bottom-bar">
        <button className="shop-submit-btn" onClick={handleSubmit}>
          Place Order
        </button>
      </div>
    </div>
  );
}