"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";
import {
  getSavedAddresses,
  saveAddress,
  getDefaultAddress,
  type SavedAddress,
} from "@/lib/address-storage";
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
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  
  // 地址相关状态
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState("Home");
  
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
      router.push("/m/cart");
    }
  }, [router]);

  // 读取已保存的地址
  useEffect(() => {
    const addresses = getSavedAddresses();
    setSavedAddresses(addresses);
    
    // 如果有保存的地址，默认选择默认地址
    if (addresses.length > 0) {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setUseNewAddress(false);
        // 自动填充表单
        setAddressForm({
          country: defaultAddr.country,
          fullName: defaultAddr.fullName,
          email: defaultAddr.email,
          phone: defaultAddr.phone,
          addressLine1: defaultAddr.addressLine1,
          addressLine2: defaultAddr.addressLine2,
          city: defaultAddr.city,
          stateProvince: defaultAddr.state,
          postalCode: defaultAddr.zipCode,
        });
      }
    } else {
      // 没有保存的地址，显示新地址表单
      setUseNewAddress(true);
    }
  }, []);

  // 选择已保存地址
  const handleSelectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setUseNewAddress(false);
    setAddressForm({
      country: address.country,
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      stateProvince: address.state,
      postalCode: address.zipCode,
    });
  };

  // 切换到新地址
  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setUseNewAddress(true);
    setAddressForm({
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
  };

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

  // 提交订单
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // 如果是新地址且用户选择保存，保存到localStorage
    if (useNewAddress && saveNewAddress) {
      saveAddress({
        label: addressLabel,
        fullName: addressForm.fullName,
        email: addressForm.email,
        phone: addressForm.phone,
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2,
        city: addressForm.city,
        state: addressForm.stateProvince,
        zipCode: addressForm.postalCode,
        country: addressForm.country,
        isDefault: savedAddresses.length === 0,
      });
    }
    
    // 生成订单号
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    // 将订单信息存储到 sessionStorage
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
              <div className="shop-item-thumb">
                <img src={imageSrc} alt={item.product.name} />
              </div>
              <div className="shop-item-info">
                <div className="shop-item-row1">
                  <span className="shop-item-name">{item.product.name}</span>
                  <span className="shop-item-qty">×{item.quantity}</span>
                </div>
                <div className="shop-item-spec">{item.materialOption || "Standard"}</div>
              </div>
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
        
        {/* 已保存地址选择 */}
        {savedAddresses.length > 0 && (
          <div className="saved-addresses-section">
            <div className="saved-addresses-list">
              {savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  className={`saved-address-card ${selectedAddressId === addr.id ? "active" : ""}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="saved-address-header">
                    <span className="saved-address-label">{addr.label}</span>
                    {addr.isDefault && <span className="saved-address-default-badge">Default</span>}
                  </div>
                  <div className="saved-address-name">{addr.fullName}</div>
                  <div className="saved-address-detail">
                    {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </div>
                  <div className="saved-address-city">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </div>
                  <div className="saved-address-country">{addr.country}</div>
                </button>
              ))}
              
              {/* 添加新地址按钮 */}
              <button
                className={`saved-address-card add-new ${useNewAddress ? "active" : ""}`}
                onClick={handleUseNewAddress}
              >
                <div className="saved-address-add-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="saved-address-add-text">Add New Address</div>
              </button>
            </div>
          </div>
        )}
        
        {/* 新地址表单（有保存地址时仅在useNewAddress=true时显示，无保存地址时始终显示） */}
        {(useNewAddress || savedAddresses.length === 0) && (
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
            
            {/* 保存地址选项（仅在输入新地址时显示） */}
            {savedAddresses.length > 0 && (
              <div className="save-address-option">
                <div className="save-address-checkbox-row">
                  <button
                    className={`save-address-checkbox ${saveNewAddress ? "checked" : ""}`}
                    onClick={() => setSaveNewAddress(!saveNewAddress)}
                  >
                    {saveNewAddress && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span className="save-address-text">Save this address for future orders</span>
                </div>
                
                {saveNewAddress && (
                  <div className="address-label-row">
                    <span className="address-label-prefix">Label as:</span>
                    <div className="address-label-buttons">
                      {["Home", "Office", "Other"].map((label) => (
                        <button
                          key={label}
                          className={`address-label-btn ${addressLabel === label ? "active" : ""}`}
                          onClick={() => setAddressLabel(label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 支付方式模块 */}
      <section className="shop-section">
        <div className="shop-section-title">Payment Method</div>
        <div className="shop-payment-row">
          <button
            className={`shop-payment-btn ${paymentMethod === "credit-card" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("credit-card")}
          >
            <span className="payment-radio">
              {paymentMethod === "credit-card" && <span className="payment-radio-dot"></span>}
            </span>
            {/* Credit Card Icon */}
            <svg className="payment-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="payment-text">Credit Card</span>
          </button>
          <button
            className={`shop-payment-btn ${paymentMethod === "paypal" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <span className="payment-radio">
              {paymentMethod === "paypal" && <span className="payment-radio-dot"></span>}
            </span>
            {/* PayPal Icon */}
            <svg className="payment-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .757-.64h6.953c2.297 0 4.147.485 5.195 1.38.995.85 1.394 2.097 1.176 3.707-.37 2.717-2.042 4.49-4.94 5.09-.8.17-1.67.24-2.58.24H8.91a.77.77 0 0 0-.756.64l-.92 5.83a.641.641 0 0 1-.633.74l-.525.003z"/>
            </svg>
            <span className="payment-text">PayPal</span>
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