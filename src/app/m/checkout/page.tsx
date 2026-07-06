"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

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

type ShippingMethod = "standard" | "express";
type PaymentMethod = "creditcard" | "paypal" | "applepay" | "bank";

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const defaultForm: AddressForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export default function MobileCheckoutPage() {
 const router = useRouter();
 const { selectedItems, selectedTotal, region, clearCart } = useCart();
 const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
 const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
 const [addressForm, setAddressForm] = useState<AddressForm>(defaultForm);
 const [formErrors, setFormErrors] = useState<Record<string, string>>({});
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [showLoginPrompt, setShowLoginPrompt] = useState(false);
 const [orderId, setOrderId] = useState<string>("");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowLoginPrompt(true);
      }
    };
    checkAuth();
  }, []);

 // Redirect if no selected items
 if (selectedItems.length === 0) {
 router.push("/m/cart");
 return null;
 }

  const shippingFee = shippingMethod === "express" ? 500 : (selectedTotal >= 10000 ? 0 : 300);
  const totalWithShipping = selectedTotal + shippingFee;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressForm.firstName.trim()) errors.firstName = "请填写姓名";
    if (!addressForm.lastName.trim()) errors.lastName = "请填写姓氏";
    if (!addressForm.email.trim()) errors.email = "请填写邮箱";
    if (!addressForm.email.includes("@")) errors.email = "邮箱格式不正确";
    if (!addressForm.phone.trim()) errors.phone = "请填写电话";
    if (!addressForm.addressLine1.trim()) errors.addressLine1 = "请填写地址";
    if (!addressForm.city.trim()) errors.city = "请填写城市";
    if (!addressForm.zipCode.trim()) errors.zipCode = "请填写邮编";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems.map(item => ({
            productSlug: item.product.slug,
            productName: item.product.name,
            materialType: item.materialType,
            materialOption: item.materialOption,
            quantity: item.quantity,
            unitPrice: getUnitPrice(item.product, region),
          })),
 shippingAddress: addressForm,
 shippingMethod,
 paymentMethod,
 shippingFee,
 total: totalWithShipping,
        }),
      });

      if (!response.ok) {
        throw new Error("订单创建失败");
      }

 const data = await response.json();
 const newOrderId = data.orderId || `ORD-${Date.now()}`;
 clearCart();

 // Redirect to payment success page
 router.push(`/m/payment/success?orderId=${newOrderId}&amount=${totalWithShipping}&paymentMethod=${paymentMethod}`);
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("订单提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
 };

 // Login prompt overlay
  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <div className="bg-[#111111] rounded-lg p-6 border border-[#1A1A1A] max-w-sm w-full">
          <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-4 tracking-wide">请先登录</h2>
          <p className="text-[#8A8580] mb-6 text-sm">登录后可保存收货地址并查看订单历史</p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 py-3 bg-[#E8B4B8] text-[#0A0A0A] text-sm tracking-[0.1em] uppercase rounded hover:bg-[#F5F0EB] transition-all duration-300 text-center"
            >
              登录
            </Link>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="flex-1 py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase rounded hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all duration-300"
            >
              继续作为访客
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-[#8A8580] rounded-full hover:bg-[#111111] active:bg-[#1A1A1A] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-base font-medium text-[#F5F0EB]">结算</h1>
        <span className="text-xs text-[#8A8580]">{selectedItems.length} 件商品</span>
      </div>

      {/* Order Items Summary */}
      <div className="px-4 py-6">
        <h2 className="text-sm font-medium text-[#F5F0EB] mb-4">订单商品</h2>
        <div className="bg-[#111111] rounded-xl p-4">
          {selectedItems.map((item) => {
            const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
            const unitPrice = getUnitPrice(item.product, region);
            
            return (
              <div key={`${item.product.slug}-${item.materialOption}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1A1A1A]">
                  <Image src={imageSrc} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F5F0EB] truncate">{item.product.name}</p>
                  <p className="text-xs text-[#8A8580] mt-1">{item.materialType} · {item.materialOption}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8A8580]">×{item.quantity}</p>
                  <p className="text-sm text-[#E8B4B8] font-medium mt-1">${formatPrice(unitPrice * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="px-4 py-6">
        <h2 className="text-sm font-medium text-[#F5F0EB] mb-4">收货信息</h2>
        <div className="space-y-3">
          {/* Name fields */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="姓名"
                value={addressForm.firstName}
                onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="姓氏"
                value={addressForm.lastName}
                onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="邮箱地址"
            value={addressForm.email}
            onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
            className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="联系电话"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="详细地址"
            value={addressForm.addressLine1}
            onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
            className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
          />

          {/* City, State, Zip */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="城市"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
              />
            </div>
            <div className="w-28">
              <select
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 appearance-none"
              >
                <option value="">州/省</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="邮政编码"
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <select
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full bg-[#111111] border-none rounded-xl px-4 py-3.5 text-sm text-[#F5F0EB] focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 appearance-none"
              >
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 py-6">
        <h2 className="text-sm font-medium text-[#F5F0EB] mb-4">支付方式</h2>
        <div className="space-y-2">
          {/* Credit Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod("creditcard")}
            className={`w-full bg-[#111111] rounded-xl p-4 flex items-center justify-between transition-all ${
              paymentMethod === "creditcard" ? "ring-2 ring-[#E8B4B8]/30" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-7 bg-[#1A1A1A] rounded flex items-center justify-center">
                <span className="text-xs text-[#F5F0EB] font-medium">Stripe</span>
              </div>
              <p className="text-sm text-[#F5F0EB]">信用卡支付</p>
            </div>
            {paymentMethod === "creditcard" && (
              <div className="w-5 h-5 rounded-full bg-[#E8B4B8] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>

          {/* PayPal */}
          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            className={`w-full bg-[#111111] rounded-xl p-4 flex items-center justify-between transition-all ${
              paymentMethod === "paypal" ? "ring-2 ring-[#E8B4B8]/30" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-7 bg-[#003087] rounded flex items-center justify-center">
                <span className="text-xs text-white font-medium">PayPal</span>
              </div>
              <p className="text-sm text-[#F5F0EB]">PayPal 支付</p>
            </div>
            {paymentMethod === "paypal" && (
              <div className="w-5 h-5 rounded-full bg-[#E8B4B8] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setPaymentMethod("bank")}
            className={`w-full bg-[#111111] rounded-xl p-4 flex items-center justify-between transition-all ${
              paymentMethod === "bank" ? "ring-2 ring-[#E8B4B8]/30" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-7 bg-[#1A1A1A] rounded flex items-center justify-center">
                <span className="text-xs text-[#F5F0EB]">银行</span>
              </div>
              <p className="text-sm text-[#F5F0EB]">银行转账</p>
            </div>
            {paymentMethod === "bank" && (
              <div className="w-5 h-5 rounded-full bg-[#E8B4B8] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar - prevents content overlap */}
      <div className="h-[160px] shrink-0" />
      
      {/* Bottom summary - fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#1A1A1A] px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#8A8580]">应付总额</span>
          <span className="text-xl font-medium text-[#E8B4B8]">${formatPrice(selectedTotal)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl text-sm font-medium transition-all ${
            isSubmitting
              ? "bg-[#1A1A1A] text-[#8A8580] cursor-wait"
              : "bg-[#E8B4B8] text-[#0A0A0A] active:opacity-90"
          }`}
        >
          {isSubmitting ? "提交中..." : "提交订单"}
        </button>
      </div>
    </div>
  );
}