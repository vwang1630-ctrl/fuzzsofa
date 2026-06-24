"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  "muscle-gorilla-sofa": "muscleGorillaSofa",
};

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
type PaymentMethod = "creditcard" | "paypal" | "applepay" | "banktransfer";

interface AddressForm {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const { selectedItems, selectedTotal, region, clearCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AddressForm>({
    recipientName: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    addressLine: "",
    zipCode: "",
  });

  const shippingFee = shippingMethod === "express" ? 200 : (selectedTotal >= 10000 ? 0 : 300);
  const total = selectedTotal + shippingFee;

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-4">{t("checkoutTitle")}</h1>
        <p className="text-[#8A8580] mb-8 text-sm">{t("cartEmpty")}</p>
        <Link
          href="/animal-sofa-collection"
          className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("cartContinueShopping")}
        </Link>
      </div>
    );
  }

  const updateForm = (field: keyof AddressForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!form.recipientName.trim()) newErrors.recipientName = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.province.trim()) newErrors.province = true;
    if (!form.city.trim()) newErrors.city = true;
    if (!form.addressLine.trim()) newErrors.addressLine = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const orderItems = selectedItems.map((item) => {
        const price = getUnitPrice(item.product, item.region);
        return {
          productSlug: item.product.slug,
          productName: slugToPrefix[item.product.slug]
            ? t(`${slugToPrefix[item.product.slug]}Name` as TranslationKeys)
            : item.product.name,
          colorName: item.materialOption,
          colorHex: "#333333",
          quantity: item.quantity,
          unitPrice: price,
          subtotal: price * item.quantity,
        };
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingMethod,
          shippingFee,
          paymentMethod,
          address: form,
          items: orderItems,
          subtotal: selectedTotal,
          total,
          currency: "USD",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Order creation failed");
      }

      const data = await res.json();
      clearCart();
      router.push(`/order-confirmed?order=${data.order.orderNumber}`);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order creation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-[#111111] border ${errors[field] ? "border-red-500" : "border-[#1A1A1A]"} px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-12 tracking-wide">{t("checkoutTitle")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Left Column - Form */}
          <div className="space-y-10">
            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("checkoutShippingInfo")}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.recipientName}
                      onChange={(e) => updateForm("recipientName", e.target.value)}
                      className={inputClass("recipientName")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutPhone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={inputClass("phone")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutProvince")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.province}
                      onChange={(e) => updateForm("province", e.target.value)}
                      className={inputClass("province")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutCity")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className={inputClass("city")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutDistrict")}
                    </label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => updateForm("district", e.target.value)}
                      className={inputClass("district")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("checkoutAddress")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.addressLine}
                    onChange={(e) => updateForm("addressLine", e.target.value)}
                    className={inputClass("addressLine")}
                  />
                </div>

                <div className="w-1/3">
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("checkoutZipCode")}
                  </label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => updateForm("zipCode", e.target.value)}
                    className={inputClass("zipCode")}
                  />
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("checkoutShippingMethod")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`p-4 border text-left transition-all duration-300 ${
                    shippingMethod === "standard"
                      ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                      : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F0EB] text-sm">{t("checkoutStandardShipping")}</span>
                    <span className="text-[#E8B4B8] text-sm">{t("free") || "Free"}</span>
                  </div>
                  <p className="text-xs text-[#8A8580] mt-1">7-15 business days</p>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`p-4 border text-left transition-all duration-300 ${
                    shippingMethod === "express"
                      ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                      : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F0EB] text-sm">{t("checkoutExpressShipping")}</span>
                    <span className="text-[#F5F0EB] text-sm">$200</span>
                  </div>
                  <p className="text-xs text-[#8A8580] mt-1">3-5 business days</p>
                </button>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("checkoutPaymentMethod")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { key: "creditcard" as PaymentMethod, label: t("checkoutCreditCard"), icon: "💳" },
                  { key: "paypal" as PaymentMethod, label: t("checkoutPayPal"), icon: "P" },
                  { key: "applepay" as PaymentMethod, label: t("checkoutApplePay"), icon: "Apple" },
                  { key: "banktransfer" as PaymentMethod, label: t("checkoutBankTransfer"), icon: "↔" },
                ]).map((pm) => (
                  <button
                    key={pm.key}
                    type="button"
                    onClick={() => setPaymentMethod(pm.key)}
                    className={`p-4 border text-center transition-all duration-300 ${
                      paymentMethod === pm.key
                        ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                        : "border-[#1A1A1A] hover:border-[#333]"
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs text-[#8A8580]">
                      {pm.icon}
                    </div>
                    <span className="text-[#F5F0EB] text-sm">{pm.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("checkoutOrderSummary")}</h2>

              <div className="space-y-4 mb-6">
                {selectedItems.map((item) => {
                  const price = getUnitPrice(item.product, item.region);
                  const productName = slugToPrefix[item.product.slug]
                    ? t(`${slugToPrefix[item.product.slug]}Name` as TranslationKeys)
                    : item.product.name;
                  const thumbSrc = slugToImage[item.product.slug] || "/products/placeholder/thumb.jpg";
                  return (
                    <div key={item.product.slug} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#1A1A1A] shrink-0 overflow-hidden relative">
                        <Image src={thumbSrc} alt={productName} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0EB] text-sm truncate">{productName}</p>
                        <p className="text-xs text-[#8A8580]">
                          {item.materialOption} x{item.quantity}
                        </p>
                      </div>
                      <p className="text-[#F5F0EB] text-sm shrink-0">{formatPrice(price * item.quantity, region)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#1A1A1A] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">{t("cartSubtotal")}</span>
                  <span className="text-[#F5F0EB]">{formatPrice(selectedTotal, region)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">{t("cartShipping")}</span>
                  <span className={shippingFee === 0 ? "text-[#E8B4B8]" : "text-[#F5F0EB]"}>
                    {shippingFee === 0 ? (t("free") || "Free") : formatPrice(shippingFee, region)}
                  </span>
                </div>
                <div className="border-t border-[#1A1A1A] pt-3 flex justify-between">
                  <span className="text-[#F5F0EB]">{t("cartTotal")}</span>
                  <span className="text-[#F5F0EB] text-lg font-light">{formatPrice(total, region)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "..." : t("checkoutPlaceOrder")}
              </button>

              <Link
                href="/cart"
                className="mt-3 block text-center text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
              >
                {t("checkoutBackToCart")}
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
