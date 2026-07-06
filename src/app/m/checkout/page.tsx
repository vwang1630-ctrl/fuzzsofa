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
  "owl": "/products/owl-sofa/thumb.jpg",
  "silverback-sofa": "/products/silverback-sofa/thumb.jpg",
  "meteorite-ring-sofa": "/products/meteorite-ring-sofa/thumb.jpg",
  "muscle-gorilla-sofa": "/products/muscle-gorilla-sofa/thumb.jpg",
};

type PaymentMethod = "creditcard" | "paypal";

interface AddressForm {
  fullName: string;
  address: string;
  cityZip: string;
  phone: string;
}

const defaultForm: AddressForm = {
  fullName: "",
  address: "",
  cityZip: "",
  phone: "",
};

export default function MobileCheckoutPage() {
  const router = useRouter();
  const { selectedItems, selectedTotal, region, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
  const [addressForm, setAddressForm] = useState<AddressForm>(defaultForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;
  const totalWithShipping = selectedTotal + shippingFee;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressForm.fullName.trim()) errors.fullName = "请填写姓名";
    if (!addressForm.address.trim()) errors.address = "请填写地址";
    if (!addressForm.cityZip.trim()) errors.cityZip = "请填写城市和邮编";
    if (!addressForm.phone.trim()) errors.phone = "请填写电话";
    
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
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header - 参考图片样式：左标题 + 右关闭按钮 */}
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm px-5 py-5 flex items-center justify-between">
        <h1 className="text-lg font-medium text-[#F5F0EB]">结算</h1>
        <button 
          onClick={() => router.back()} 
          className="w-8 h-8 flex items-center justify-center text-[#F5F0EB] rounded-full hover:bg-[#111111] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* 商品清单模块 - 参考图片样式 */}
      <div className="px-5 py-6">
        <p className="text-xs text-[#8A8580] mb-4">商品清单</p>
        <div className="space-y-4">
          {selectedItems.map((item) => {
            const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
            const unitPrice = getUnitPrice(item.product, region);
            const totalPrice = unitPrice * item.quantity;
            
            return (
              <div key={`${item.product.slug}-${item.materialOption}`} className="flex items-center gap-4">
                {/* 商品缩略图 */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                  <Image src={imageSrc} alt={item.product.name} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                </div>
                {/* 商品信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F5F0EB]">{item.product.name}</p>
                  <p className="text-xs text-[#8A8580] mt-2">{item.materialType} · {item.materialOption}</p>
                </div>
                {/* 数量和价格 */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#8A8580]">×{item.quantity}</p>
                  <p className="text-sm font-medium text-[#F5F0EB] mt-1">${formatPrice(totalPrice)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 分割线 */}
      <div className="h-px bg-[#1A1A1A] mx-5" />

      {/* 配送信息模块 - 参考图片样式：4个垂直输入框 */}
      <div className="px-5 py-6">
        <p className="text-xs text-[#8A8580] mb-4">配送信息</p>
        <div className="space-y-3">
          {/* 姓名 */}
          <div className="relative">
            <input
              type="text"
              placeholder="姓名"
              value={addressForm.fullName}
              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              className={`w-full bg-transparent text-[#F5F0EB] py-4 text-sm placeholder:text-[#8A8580]/60 focus:outline-none border-b ${formErrors.fullName ? 'border-b-[#E8B4B8]' : 'border-b-[#1A1A1A]'}`}
            />
            {formErrors.fullName && <p className="text-xs text-[#E8B4B8] mt-1">{formErrors.fullName}</p>}
          </div>
          
          {/* 地址 */}
          <div className="relative">
            <input
              type="text"
              placeholder="地址"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              className={`w-full bg-transparent text-[#F5F0EB] py-4 text-sm placeholder:text-[#8A8580]/60 focus:outline-none border-b ${formErrors.address ? 'border-b-[#E8B4B8]' : 'border-b-[#1A1A1A]'}`}
            />
            {formErrors.address && <p className="text-xs text-[#E8B4B8] mt-1">{formErrors.address}</p>}
          </div>
          
          {/* 城市和邮编 */}
          <div className="relative">
            <input
              type="text"
              placeholder="城市, 邮编"
              value={addressForm.cityZip}
              onChange={(e) => setAddressForm({ ...addressForm, cityZip: e.target.value })}
              className={`w-full bg-transparent text-[#F5F0EB] py-4 text-sm placeholder:text-[#8A8580]/60 focus:outline-none border-b ${formErrors.cityZip ? 'border-b-[#E8B4B8]' : 'border-b-[#1A1A1A]'}`}
            />
            {formErrors.cityZip && <p className="text-xs text-[#E8B4B8] mt-1">{formErrors.cityZip}</p>}
          </div>
          
          {/* 电话 */}
          <div className="relative">
            <input
              type="tel"
              placeholder="电话"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className={`w-full bg-transparent text-[#F5F0EB] py-4 text-sm placeholder:text-[#8A8580]/60 focus:outline-none border-b ${formErrors.phone ? 'border-b-[#E8B4B8]' : 'border-b-[#1A1A1A]'}`}
            />
            {formErrors.phone && <p className="text-xs text-[#E8B4B8] mt-1">{formErrors.phone}</p>}
          </div>
        </div>
      </div>

      {/* 分割线 */}
      <div className="h-px bg-[#1A1A1A] mx-5" />

      {/* 支付方式模块 - 参考图片样式 */}
      <div className="px-5 py-6">
        <p className="text-xs text-[#8A8580] mb-4">支付方式</p>
        <div className="flex gap-3">
          {/* 信用卡 */}
          <button
            onClick={() => setPaymentMethod("creditcard")}
            className={`flex-1 py-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              paymentMethod === "creditcard"
                ? "bg-[#F5F0EB]/10 border border-[#F5F0EB]/30 text-[#F5F0EB]"
                : "bg-transparent text-[#8A8580]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            信用卡
          </button>
          
          {/* PayPal */}
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex-1 py-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              paymentMethod === "paypal"
                ? "bg-[#F5F0EB]/10 border border-[#F5F0EB]/30 text-[#F5F0EB]"
                : "bg-transparent text-[#8A8580]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 9.5h3.5c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5H9l-.5 3h-2l.5-3H6l-1-5h2.5l1-0z"/>
            </svg>
            PayPal
          </button>
        </div>
      </div>

      {/* 分割线 */}
      <div className="h-px bg-[#1A1A1A] mx-5" />

      {/* 价格核算模块 - 参考图片样式 */}
      <div className="px-5 py-6">
        <p className="text-xs text-[#8A8580] mb-4">价格明细</p>
        <div className="space-y-3">
          {/* 商品小计 */}
          <div className="flex justify-between">
            <p className="text-sm text-[#8A8580]">商品小计</p>
            <p className="text-sm text-[#F5F0EB]">${formatPrice(selectedTotal)}</p>
          </div>
          
          {/* 运费 */}
          <div className="flex justify-between">
            <p className="text-sm text-[#8A8580]">运费</p>
            <p className="text-sm text-[#F5F0EB]">
              {shippingFee === 0 ? "免运费" : `$${formatPrice(shippingFee)}`}
            </p>
          </div>
          
          {/* 分割线 */}
          <div className="h-px bg-[#1A1A1A]" />
          
          {/* 总计 */}
          <div className="flex justify-between">
            <p className="text-sm text-[#8A8580]">总计</p>
            <p className="text-base font-medium text-[#F5F0EB]">${formatPrice(totalWithShipping)}</p>
          </div>
        </div>
      </div>

      {/* 底部操作区 - 参考图片样式：通栏确认按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] px-5 py-5 border-t border-[#1A1A1A]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "提交中..." : "确认下单"}
        </button>
      </div>
    </div>
  );
}