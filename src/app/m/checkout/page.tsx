"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

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

    // Simulate order creation
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  // Order success page
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 border border-[#E8B4B8] rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-light text-[#F5F0EB] mb-3 tracking-wide">订单已提交</h1>
        <p className="text-[#8A8580] mb-2 text-sm">订单号: {orderId}</p>
        <p className="text-[#6A6560] mb-8 text-sm">感谢您的购买，我们将尽快安排发货</p>
        <div className="flex gap-4">
          <Link
            href="/m"
            className="inline-flex items-center px-6 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            继续选购
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = selectedTotal >= 10000 ? 0 : 300;
  const totalWithShipping = selectedTotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A] px-4 py-4 z-50">
        <div className="flex items-center justify-between">
          <Link href="/m/cart" className="text-[#8A8580] hover:text-[#F5F0EB]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-serif text-xl font-light text-[#F5F0EB] tracking-wide">结算</h1>
          <button
            onClick={() => router.push("/m/cart")}
            className="text-[#8A8580] hover:text-[#F5F0EB]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Product List */}
      <section className="px-4 py-5 border-b border-[#1A1A1A]">
        <div className="text-xs text-[#6A6560] uppercase tracking-[0.15em] mb-4">商品清单</div>
        {selectedItems.map((item) => {
          const imageSrc = slugToImage[item.product.slug] || "/products/owl-sofa/thumb.jpg";
          const unitPrice = getUnitPrice(item.product, region);
          const itemTotal = unitPrice * item.quantity;

          return (
            <div key={`${item.product.slug}-${item.materialOption}`} className="flex gap-4 py-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#111111] flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/products/owl/black-leather.png";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-base font-light text-[#F5F0EB] tracking-wide">{item.product.name}</div>
                <div className="text-xs text-[#6A6560] mt-1">{item.materialOption || "标准款"}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[#8A8580]">× {item.quantity}</span>
                  <span className="text-base text-[#F5F0EB] font-light">${itemTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Shipping Address */}
      <section className="px-4 py-5 border-b border-[#1A1A1A]">
        <div className="text-xs text-[#6A6560] uppercase tracking-[0.15em] mb-4">配送信息</div>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="姓名"
              value={addressForm.fullName}
              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              className={`w-full bg-transparent py-3 text-[#F5F0EB] placeholder:text-[#6A6560] border-b ${formErrors.fullName ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} focus:border-[#E8B4B8] transition-colors`}
            />
            {formErrors.fullName && <div className="text-xs text-[#E8B4B8] mt-1">{formErrors.fullName}</div>}
          </div>
          <div>
            <input
              type="text"
              placeholder="详细地址"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              className={`w-full bg-transparent py-3 text-[#F5F0EB] placeholder:text-[#6A6560] border-b ${formErrors.address ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} focus:border-[#E8B4B8] transition-colors`}
            />
            {formErrors.address && <div className="text-xs text-[#E8B4B8] mt-1">{formErrors.address}</div>}
          </div>
          <div>
            <input
              type="text"
              placeholder="城市 / 邮编"
              value={addressForm.cityZip}
              onChange={(e) => setAddressForm({ ...addressForm, cityZip: e.target.value })}
              className={`w-full bg-transparent py-3 text-[#F5F0EB] placeholder:text-[#6A6560] border-b ${formErrors.cityZip ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} focus:border-[#E8B4B8] transition-colors`}
            />
            {formErrors.cityZip && <div className="text-xs text-[#E8B4B8] mt-1">{formErrors.cityZip}</div>}
          </div>
          <div>
            <input
              type="tel"
              placeholder="电话"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className={`w-full bg-transparent py-3 text-[#F5F0EB] placeholder:text-[#6A6560] border-b ${formErrors.phone ? "border-[#E8B4B8]" : "border-[#1A1A1A]"} focus:border-[#E8B4B8] transition-colors`}
            />
            {formErrors.phone && <div className="text-xs text-[#E8B4B8] mt-1">{formErrors.phone}</div>}
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="px-4 py-5 border-b border-[#1A1A1A]">
        <div className="text-xs text-[#6A6560] uppercase tracking-[0.15em] mb-4">支付方式</div>
        <div className="flex gap-3">
          <button
            onClick={() => setPaymentMethod("creditcard")}
            className={`flex-1 py-4 rounded-lg border text-sm tracking-[0.05em] transition-all duration-300 ${
              paymentMethod === "creditcard"
                ? "bg-[#E8B4B8]/10 border-[#E8B4B8] text-[#F5F0EB]"
                : "bg-transparent border-[#333] text-[#8A8580] hover:border-[#E8B4B8]/50"
            }`}
          >
            信用卡
          </button>
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex-1 py-4 rounded-lg border text-sm tracking-[0.05em] transition-all duration-300 ${
              paymentMethod === "paypal"
                ? "bg-[#E8B4B8]/10 border-[#E8B4B8] text-[#F5F0EB]"
                : "bg-transparent border-[#333] text-[#8A8580] hover:border-[#E8B4B8]/50"
            }`}
          >
            PayPal
          </button>
        </div>
      </section>

      {/* Price Summary */}
      <section className="px-4 py-5">
        <div className="text-xs text-[#6A6560] uppercase tracking-[0.15em] mb-4">费用明细</div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#8A8580]">商品小计</span>
            <span className="text-[#F5F0EB]">${selectedTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8A8580]">运费</span>
            <span className={shippingFee === 0 ? "text-[#E8B4B8]" : "text-[#F5F0EB]"}>
              {shippingFee === 0 ? "免运费" : `$${shippingFee}`}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#1A1A1A]">
            <span className="text-[#8A8580]">总计</span>
            <span className="font-serif text-xl text-[#F5F0EB]">${totalWithShipping.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#1A1A1A] px-4 py-5">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedItems.length === 0}
          className={`w-full py-4 border text-sm uppercase tracking-[0.15em] font-light transition-all duration-300 ${
            isSubmitting || selectedItems.length === 0
              ? "border-[#333] text-[#6A6560] cursor-not-allowed"
              : "border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A]"
          }`}
        >
          {isSubmitting ? "提交中..." : "确认下单"}
        </button>
      </div>
    </div>
  );
}