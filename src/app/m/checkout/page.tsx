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
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A] px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-[#8A8580] hover:text-[#F5F0EB]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="font-serif text-xl font-light text-[#F5F0EB] tracking-wide">结算</h1>
          <span className="text-sm text-[#8A8580]">{selectedItems.length} 件</span>
        </div>
      </div>

      {/* Order Items Summary */}
      <div className="px-4 py-4">
        <h2 className="text-[#F5F0EB] font-medium mb-3">订单商品</h2>
        <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
          {selectedItems.map((item) => {
            const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
            const unitPrice = getUnitPrice(item.product, region);
            
            return (
              <div key={`${item.product.slug}-${item.materialOption}`} className="flex items-center gap-3 py-2">
                <div className="w-12 h-12 rounded overflow-hidden bg-[#1A1A1A]">
                  <Image src={imageSrc} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F0EB] text-sm truncate">{item.product.name}</p>
                  <p className="text-[#8A8580] text-xs">{item.materialType} · {item.materialOption}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#F5F0EB] text-sm">×{item.quantity}</p>
                  <p className="text-[#E8B4B8] text-sm">${formatPrice(unitPrice * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="px-4 py-4">
        <h2 className="text-[#F5F0EB] font-medium mb-3">收货地址</h2>
        <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A] space-y-3">
          {/* Name fields */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="姓名"
                value={addressForm.firstName}
                onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                className={`w-full bg-[#0A0A0A] border ${formErrors.firstName ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
              />
              {formErrors.firstName && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.firstName}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="姓氏"
                value={addressForm.lastName}
                onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                className={`w-full bg-[#0A0A0A] border ${formErrors.lastName ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
              />
              {formErrors.lastName && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="邮箱"
              value={addressForm.email}
              onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
              className={`w-full bg-[#0A0A0A] border ${formErrors.email ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
            />
            {formErrors.email && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              placeholder="电话"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className={`w-full bg-[#0A0A0A] border ${formErrors.phone ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
            />
            {formErrors.phone && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="地址"
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              className={`w-full bg-[#0A0A0A] border ${formErrors.addressLine1 ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
            />
            {formErrors.addressLine1 && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.addressLine1}</p>}
          </div>

          {/* Address Line 2 (optional) */}
          <input
            type="text"
            placeholder="地址行2（可选）"
            value={addressForm.addressLine2}
            onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none"
          />

          {/* City, State, Zip */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="城市"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className={`w-full bg-[#0A0A0A] border ${formErrors.city ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
              />
              {formErrors.city && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.city}</p>}
            </div>
            <div className="w-24">
              <select
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded px-3 py-2 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] outline-none appearance-none"
              >
                <option value="">州/省</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="w-20">
              <input
                type="text"
                placeholder="邮编"
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                className={`w-full bg-[#0A0A0A] border ${formErrors.zipCode ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} rounded px-3 py-2 text-[#F5F0EB] text-sm placeholder-[#8A8580] focus:border-[#E8B4B8] outline-none`}
              />
              {formErrors.zipCode && <p className="text-[#E8B4B8] text-xs mt-1">{formErrors.zipCode}</p>}
            </div>
          </div>

          {/* Country */}
          <select
            value={addressForm.country}
            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded px-3 py-2 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] outline-none appearance-none"
          >
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="px-4 py-4">
        <h2 className="text-[#F5F0EB] font-medium mb-3">配送方式</h2>
        <div className="space-y-2">
          <button
            onClick={() => setShippingMethod("standard")}
            className={`w-full bg-[#111111] rounded-lg p-4 border ${shippingMethod === "standard" ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} flex items-center justify-between`}
          >
            <div>
              <p className="text-[#F5F0EB] text-sm">标准配送</p>
              <p className="text-[#8A8580] text-xs">预计 7-14 天送达</p>
            </div>
            <p className="text-[#E8B4B8] text-sm">
              {selectedTotal >= 10000 ? "免运费" : "$300"}
            </p>
          </button>
          <button
            onClick={() => setShippingMethod("express")}
            className={`w-full bg-[#111111] rounded-lg p-4 border ${shippingMethod === "express" ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} flex items-center justify-between`}
          >
            <div>
              <p className="text-[#F5F0EB] text-sm">快速配送</p>
              <p className="text-[#8A8580] text-xs">预计 3-5 天送达</p>
            </div>
            <p className="text-[#E8B4B8] text-sm">$500</p>
          </button>
        </div>
      </div>

 {/* Payment Method */}
      <div className="px-4 py-4">
        <h2 className="text-[#F5F0EB] font-medium mb-3">支付方式</h2>
        <div className="flex flex-col gap-2">
          {/* Credit Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod("creditcard")}
            className={`bg-[#111111] rounded-lg p-4 border flex items-center justify-between transition-all ${
              paymentMethod === "creditcard" ? "border-[#E8B4B8]" : "border-[#1A1A1A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-[#1A1A1A] rounded flex items-center justify-center">
                <span className="text-[#F5F0EB] text-xs font-bold">Stripe</span>
              </div>
              <p className="text-[#F5F0EB] text-sm">信用卡支付</p>
            </div>
            {paymentMethod === "creditcard" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          {/* PayPal */}
          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            className={`bg-[#111111] rounded-lg p-4 border flex items-center justify-between transition-all ${
              paymentMethod === "paypal" ? "border-[#E8B4B8]" : "border-[#1A1A1A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-[#003087] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PayPal</span>
              </div>
              <p className="text-[#F5F0EB] text-sm">PayPal 账户支付</p>
            </div>
            {paymentMethod === "paypal" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setPaymentMethod("bank")}
            className={`bg-[#111111] rounded-lg p-4 border flex items-center justify-between transition-all ${
              paymentMethod === "bank" ? "border-[#E8B4B8]" : "border-[#1A1A1A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-[#1A1A1A] rounded flex items-center justify-center">
                <span className="text-[#F5F0EB] text-xs">银行</span>
              </div>
              <p className="text-[#F5F0EB] text-sm">银行转账</p>
            </div>
            {paymentMethod === "bank" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Bottom summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#1A1A1A] px-6 py-5">
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-base">
            <span className="text-[#8A8580]">商品总价</span>
            <span className="text-[#F5F0EB]">${formatPrice(selectedTotal)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-[#8A8580]">运费</span>
            <span className="text-[#F5F0EB]">{shippingFee === 0 ? "免运费" : `$${formatPrice(shippingFee)}`}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-[#F5F0EB] font-medium">应付总额</span>
            <span className="text-[#E8B4B8] font-serif text-2xl">${formatPrice(totalWithShipping)}</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-5 rounded text-base tracking-[0.1em] uppercase transition-all duration-300 ${
            isSubmitting
              ? "bg-[#1A1A1A] text-[#8A8580] cursor-wait"
              : "bg-[#E8B4B8] text-[#0A0A0A] hover:bg-[#F5F0EB]"
          }`}
        >
          {isSubmitting ? "提交中..." : "提交订单并支付"}
        </button>
        <Link href="/m" className="block text-center text-[#8A8580] text-base mt-4 hover:text-[#F5F0EB]">
          返回商品页
        </Link>
      </div>
    </div>
  );
}