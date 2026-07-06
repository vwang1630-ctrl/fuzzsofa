"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";

const slugToImage: Record<string, string> = {
  "bear-sofa": "/products/bear-sofa/thumb.jpg",
  "lion-sofa": "/products/lion-sofa/thumb.jpg",
  "tiger-sofa": "/products/tiger-sofa/thumb.jpg",
  "gorilla-sofa": "/products/gorilla-sofa/thumb.jpg",
  "owl-sofa": "/products/owl-sofa/thumb.jpg",
  "owl": "/products/owl-sofa/thumb.jpg",
  "silverback-sofa": "/products/silverback-sofa/thumb.jpg",
  "meteorite-ring-sofa": "/products/meteorite-ring-sofa/thumb.jpg",
  "muscle-gorilla-sofa": "/products/muscle-gorilla-sofa/thumb.jpg",
};

type PaymentMethod = "creditcard" | "paypal" | "alipay";

interface AddressForm {
  recipientName: string;
  detailedAddress: string;
  city: string;
  zipCode: string;
}

const defaultForm: AddressForm = {
  recipientName: "",
  detailedAddress: "",
  city: "",
  zipCode: "",
};

export default function MobileCheckoutPage() {
  const router = useRouter();
  const { selectedItems, selectedTotal, region, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
  const [addressForm, setAddressForm] = useState<AddressForm>(defaultForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect if no items
  useEffect(() => {
    if (selectedItems.length === 0 && !orderSuccess) {
      router.push("/m/cart");
    }
  }, [selectedItems.length, orderSuccess, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressForm.recipientName.trim()) errors.recipientName = "请填写收件人姓名";
    if (!addressForm.detailedAddress.trim()) errors.detailedAddress = "请填写详细地址";
    if (!addressForm.city.trim()) errors.city = "请填写城市";
    if (!addressForm.zipCode.trim()) errors.zipCode = "请填写邮编";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate order creation
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  // Format price with USD
  const formatPriceWithUSD = (price: number): string => {
    return `$${price.toLocaleString()} USD`;
  };

  // Order success page
  if (orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "80px", height: "80px", border: "1px solid #E8B4B8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: 300, color: "#F5F0EB", marginBottom: "12px", letterSpacing: "0.05em" }}>订单已提交</h1>
        <p style={{ color: "#8A8580", marginBottom: "8px", fontSize: "14px" }}>订单号: {orderId}</p>
        <p style={{ color: "#6A6560", marginBottom: "32px", fontSize: "14px" }}>感谢您的购买，我们将尽快安排发货</p>
        <Link
          href="/m"
          style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", border: "1px solid #E8B4B8", color: "#E8B4B8", fontSize: "14px", letterSpacing: "0.1em", textDecoration: "none", transition: "all 0.3s" }}
        >
          继续选购
        </Link>
      </div>
    );
  }

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;
  const totalWithShipping = selectedTotal + shippingFee;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", paddingBottom: "120px" }}>
      {/* Header - 保持不变 */}
      <div style={{ position: "sticky", top: 0, backgroundColor: "rgba(10, 10, 10, 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #1A1A1A", padding: "16px", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/m/cart" style={{ color: "#8A8580" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: 300, color: "#F5F0EB", letterSpacing: "0.05em" }}>结算</h1>
          <button
            onClick={() => router.push("/m/cart")}
            style={{ color: "#8A8580", background: "none", border: "none", cursor: "pointer" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 商品清单模块 */}
      <section style={{ padding: "20px 16px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ fontSize: "12px", color: "#6A6560", letterSpacing: "0.15em", marginBottom: "16px" }}>商品清单</div>
        {selectedItems.map((item) => {
          const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
          const unitPrice = getUnitPrice(item.product, region);
          const itemTotal = unitPrice * item.quantity;

          return (
            <div key={`${item.product.slug}-${item.materialOption}`} style={{ display: "flex", gap: "12px", padding: "12px 0" }}>
              {/* 左侧缩略图 */}
              <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#111111" }}>
                <img
                  src={imageSrc}
                  alt={item.product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "/products/owl/black-leather.png";
                  }}
                />
              </div>
              {/* 右侧商品信息 */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                {/* 第一行：商品名称 + 数量 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F5F0EB", fontSize: "16px", fontWeight: 500 }}>{item.product.name}</span>
                  <span style={{ color: "#8A8580", fontSize: "14px" }}>×{item.quantity}</span>
                </div>
                {/* 第二行：颜色·面料 */}
                <div style={{ color: "#8A8580", fontSize: "13px", marginTop: "4px" }}>
                  {item.materialOption || "标准款"}
                </div>
              </div>
              {/* 价格右对齐 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#F5F0EB", fontSize: "16px", fontWeight: 500 }}>${itemTotal.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 配送信息模块 */}
      <section style={{ padding: "20px 16px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ fontSize: "12px", color: "#6A6560", letterSpacing: "0.15em", marginBottom: "16px" }}>配送信息</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 收件人姓名 */}
          <div>
            <input
              type="text"
              placeholder="收件人姓名"
              value={addressForm.recipientName}
              onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
              style={{
                width: "100%",
                backgroundColor: "#1A1A1A",
                borderRadius: "8px",
                padding: "14px 16px",
                color: "#F5F0EB",
                fontSize: "14px",
                border: "none",
                outline: "none",
              }}
            />
            {formErrors.recipientName && <div style={{ fontSize: "12px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.recipientName}</div>}
          </div>
          {/* 详细地址 */}
          <div>
            <input
              type="text"
              placeholder="详细地址"
              value={addressForm.detailedAddress}
              onChange={(e) => setAddressForm({ ...addressForm, detailedAddress: e.target.value })}
              style={{
                width: "100%",
                backgroundColor: "#1A1A1A",
                borderRadius: "8px",
                padding: "14px 16px",
                color: "#F5F0EB",
                fontSize: "14px",
                border: "none",
                outline: "none",
              }}
            />
            {formErrors.detailedAddress && <div style={{ fontSize: "12px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.detailedAddress}</div>}
          </div>
          {/* 城市 */}
          <div>
            <input
              type="text"
              placeholder="城市"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              style={{
                width: "100%",
                backgroundColor: "#1A1A1A",
                borderRadius: "8px",
                padding: "14px 16px",
                color: "#F5F0EB",
                fontSize: "14px",
                border: "none",
                outline: "none",
              }}
            />
            {formErrors.city && <div style={{ fontSize: "12px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.city}</div>}
          </div>
          {/* 邮编 */}
          <div>
            <input
              type="text"
              placeholder="邮编"
              value={addressForm.zipCode}
              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
              style={{
                width: "100%",
                backgroundColor: "#1A1A1A",
                borderRadius: "8px",
                padding: "14px 16px",
                color: "#F5F0EB",
                fontSize: "14px",
                border: "none",
                outline: "none",
              }}
            />
            {formErrors.zipCode && <div style={{ fontSize: "12px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.zipCode}</div>}
          </div>
        </div>
      </section>

      {/* 支付方式模块 */}
      <section style={{ padding: "20px 16px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ fontSize: "12px", color: "#6A6560", letterSpacing: "0.15em", marginBottom: "16px" }}>支付方式</div>
        <div style={{ display: "flex", gap: "12px" }}>
          {/* 信用卡 */}
          <button
            onClick={() => setPaymentMethod("creditcard")}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: paymentMethod === "creditcard" ? "rgba(232, 180, 184, 0.1)" : "transparent",
              border: paymentMethod === "creditcard" ? "1px solid #E8B4B8" : "1px solid #333",
              color: paymentMethod === "creditcard" ? "#F5F0EB" : "#8A8580",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            信用卡
          </button>
          {/* PayPal */}
          <button
            onClick={() => setPaymentMethod("paypal")}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: paymentMethod === "paypal" ? "rgba(232, 180, 184, 0.1)" : "transparent",
              border: paymentMethod === "paypal" ? "1px solid #E8B4B8" : "1px solid #333",
              color: paymentMethod === "paypal" ? "#F5F0EB" : "#8A8580",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            PayPal
          </button>
          {/* 支付宝 */}
          <button
            onClick={() => setPaymentMethod("alipay")}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: paymentMethod === "alipay" ? "rgba(232, 180, 184, 0.1)" : "transparent",
              border: paymentMethod === "alipay" ? "1px solid #E8B4B8" : "1px solid #333",
              color: paymentMethod === "alipay" ? "#F5F0EB" : "#8A8580",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            支付宝
          </button>
        </div>
      </section>

      {/* 费用明细模块 */}
      <section style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: "12px", color: "#6A6560", letterSpacing: "0.15em", marginBottom: "16px" }}>费用明细</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 小计 */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8A8580", fontSize: "14px" }}>小计</span>
            <span style={{ color: "#F5F0EB", fontSize: "14px" }}>{formatPriceWithUSD(selectedTotal)}</span>
          </div>
          {/* 运费 */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8A8580", fontSize: "14px" }}>运费</span>
            <span style={{ color: "#F5F0EB", fontSize: "14px" }}>免费</span>
          </div>
          {/* 总计 */}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #1A1A1A" }}>
            <span style={{ color: "#8A8580", fontSize: "14px" }}>总计</span>
            <span style={{ color: "#F5F0EB", fontSize: "18px", fontWeight: 600 }}>{formatPriceWithUSD(totalWithShipping)}</span>
          </div>
        </div>
      </section>

      {/* 底部确认按钮 */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(10, 10, 10, 0.95)", backdropFilter: "blur(8px)", borderTop: "1px solid #1A1A1A", padding: "20px 16px" }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedItems.length === 0}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: isSubmitting || selectedItems.length === 0 ? "transparent" : "transparent",
            border: isSubmitting || selectedItems.length === 0 ? "1px solid #333" : "1px solid #E8B4B8",
            borderRadius: "8px",
            color: isSubmitting || selectedItems.length === 0 ? "#6A6560" : "#E8B4B8",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            cursor: isSubmitting || selectedItems.length === 0 ? "not-allowed" : "pointer",
            transition: "all 0.3s",
          }}
        >
          {isSubmitting ? "提交中..." : "确认下单"}
        </button>
      </div>
    </div>
  );
}