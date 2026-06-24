"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

type PaymentMethod = "creditcard" | "paypal" | "applepay" | "banktransfer";

interface CheckoutItem {
  productSlug: string;
  productName: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
}

interface CheckoutData {
  address: {
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
  };
  shippingMethod: "standard" | "express";
  shippingFee: number;
  selectedTotal: number;
  total: number;
  currency: string;
  items: CheckoutItem[];
}

interface CardForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function PaymentPage() {
  const { selectedItems, region, clearCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
  const [submitting, setSubmitting] = useState(false);
  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, boolean>>({});
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Load session + checkout data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (!stored) {
      router.replace("/checkout");
      return;
    }

    try {
      const parsed: CheckoutData = JSON.parse(stored);
      setCheckoutData(parsed);
    } catch {
      router.replace("/checkout");
      return;
    }

    async function init() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          setSessionToken(session.access_token);

          // Load saved payment preference
          const prefRes = await fetch("/api/preferences", {
            headers: { "x-session": session.access_token },
          });
          if (prefRes.ok) {
            const prefData = await prefRes.json();
            if (prefData.preferences?.default_payment_method) {
              setPaymentMethod(prefData.preferences.default_payment_method as PaymentMethod);
            }
          }
        }
      } catch {
        // Not logged in — order creation will fail with 401
      }
    }
    init();
  }, [router]);

  const updateCardForm = (field: keyof CardForm, value: string) => {
    if (field === "cardNumber") {
      // Format card number with spaces every 4 digits
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
      setCardForm({ ...cardForm, cardNumber: formatted });
    } else if (field === "expiryDate") {
      // Format MM/YY
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setCardForm({ ...cardForm, expiryDate: formatted });
    } else if (field === "cvv") {
      setCardForm({ ...cardForm, cvv: value.replace(/\D/g, "").slice(0, 4) });
    } else {
      setCardForm({ ...cardForm, [field]: value });
    }
    if (cardErrors[field]) {
      setCardErrors({ ...cardErrors, [field]: false });
    }
  };

  const validateCard = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (paymentMethod === "creditcard") {
      const digits = cardForm.cardNumber.replace(/\s/g, "");
      if (digits.length < 15) newErrors.cardNumber = true;
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) newErrors.expiryDate = true;
      if (cardForm.cvv.length < 3) newErrors.cvv = true;
      if (!cardForm.cardholderName.trim()) newErrors.cardholderName = true;
    }
    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = async () => {
    if (!checkoutData) return;
    if (!validateCard()) return;

    setSubmitting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (sessionToken) {
        headers["x-session"] = sessionToken;
      }

      // Save payment preference (fire and forget)
      if (sessionToken) {
        fetch("/api/preferences", {
          method: "PUT",
          headers,
          body: JSON.stringify({
            defaultPaymentMethod: paymentMethod,
            preferredShippingMethod: checkoutData.shippingMethod,
          }),
        }).catch(() => {});
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          shippingMethod: checkoutData.shippingMethod,
          shippingFee: checkoutData.shippingFee,
          paymentMethod,
          address: checkoutData.address,
          items: checkoutData.items.map((item) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            colorName: item.colorName,
            colorHex: item.colorHex,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
          subtotal: checkoutData.selectedTotal,
          total: checkoutData.total,
          currency: checkoutData.currency,
        }),
      });

      if (res.status === 401) {
        alert(t("checkoutLoginRequired"));
        router.push("/login?redirect=/payment");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("checkoutOrderFailed"));
      }

      const data = await res.json();
      sessionStorage.removeItem("checkoutData");
      clearCart();
      router.push(`/order-confirmed?order=${data.order.orderNumber}`);
    } catch (err) {
      console.error("Payment failed:", err);
      alert(t("checkoutOrderFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while checkout data is being parsed
  if (!checkoutData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-[#8A8580] text-sm tracking-[0.1em] uppercase">...</div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full bg-[#111111] border ${cardErrors[field] ? "border-red-500" : "border-[#1A1A1A]"} px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors placeholder:text-[#8A8580]/40`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-12 tracking-wide">
        {t("paymentTitle")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Left Column - Payment */}
        <div className="space-y-10">
          {/* Order Summary / Shipping Recap */}
          <section>
            <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
              {t("paymentOrderSummary")}
            </h2>
            <div className="bg-[#111111] border border-[#1A1A1A] p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("paymentShippingTo")}</span>
                <span className="text-[#F5F0EB] text-right">
                  {checkoutData.address.firstName} {checkoutData.address.lastName}
                </span>
              </div>
              <p className="text-xs text-[#8A8580] text-right">
                {checkoutData.address.addressLine1}
                {checkoutData.address.addressLine2 ? `, ${checkoutData.address.addressLine2}` : ""}
                <br />
                {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}
                <br />
                {checkoutData.address.country}
              </p>
              <div className="border-t border-[#1A1A1A] pt-3 flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("checkoutShippingMethod")}</span>
                <span className="text-[#F5F0EB]">
                  {checkoutData.shippingMethod === "express"
                    ? t("checkoutExpressShipping")
                    : t("checkoutStandardShipping")}
                </span>
              </div>
              <Link
                href="/checkout"
                className="inline-block text-xs text-[#E8B4B8] tracking-[0.05em] hover:underline mt-1"
              >
                {t("paymentEditShipping")}
              </Link>
            </div>
          </section>

          {/* Payment Method Selection */}
          <section>
            <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
              {t("checkoutPaymentMethod")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                { key: "creditcard" as PaymentMethod, label: t("checkoutCreditCard"), icon: "💳" },
                { key: "paypal" as PaymentMethod, label: t("checkoutPayPal"), icon: "P" },
                { key: "applepay" as PaymentMethod, label: t("checkoutApplePay"), icon: "" },
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
                  <span className="text-[#F5F0EB] text-xs">{pm.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Conditional Payment Forms */}
          {paymentMethod === "creditcard" && (
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("paymentCardDetails")}
              </h2>
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("paymentCardNumber")} *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardForm.cardNumber}
                    onChange={(e) => updateCardForm("cardNumber", e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass("cardNumber")}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("paymentCardholderName")} *
                  </label>
                  <input
                    type="text"
                    value={cardForm.cardholderName}
                    onChange={(e) => updateCardForm("cardholderName", e.target.value)}
                    placeholder="Name on card"
                    className={inputClass("cardholderName")}
                  />
                </div>

                {/* Expiry + CVV row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("paymentExpiryDate")} *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardForm.expiryDate}
                      onChange={(e) => updateCardForm("expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      className={inputClass("expiryDate")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("paymentCVV")} *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardForm.cvv}
                      onChange={(e) => updateCardForm("cvv", e.target.value)}
                      placeholder="123"
                      className={inputClass("cvv")}
                    />
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#8A8580]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>{t("paymentSecureNote")}</span>
              </div>
            </section>
          )}

          {paymentMethod === "paypal" && (
            <section>
              <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#003087]">P</span>
                </div>
                <p className="text-[#F5F0EB] text-sm mb-2">{t("paymentPayPalRedirect")}</p>
                <p className="text-xs text-[#8A8580]">{t("paymentPayPalDescription")}</p>
              </div>
            </section>
          )}

          {paymentMethod === "applepay" && (
            <section>
              <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5F0EB">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                <p className="text-[#F5F0EB] text-sm mb-2">{t("paymentApplePayConfirm")}</p>
                <p className="text-xs text-[#8A8580]">{t("paymentApplePayDescription")}</p>
              </div>
            </section>
          )}

          {paymentMethod === "banktransfer" && (
            <section>
              <div className="bg-[#111111] border border-[#1A1A1A] p-6 space-y-3">
                <h3 className="text-[#F5F0EB] text-sm font-light tracking-wide">{t("paymentBankTransferInfo")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">Bank</span>
                    <span className="text-[#F5F0EB]">HSBC International</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">SWIFT</span>
                    <span className="text-[#F5F0EB]">HSBCUS33</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">Account</span>
                    <span className="text-[#F5F0EB]">FUZZ-2024-8891</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">Reference</span>
                    <span className="text-[#F5F0EB]">{t("paymentUseOrderNumber")}</span>
                  </div>
                </div>
                <p className="text-xs text-[#8A8580] pt-2 border-t border-[#1A1A1A]">
                  {t("paymentBankTransferNote")}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Order Summary (sticky) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-[#111111] border border-[#1A1A1A] p-6">
            <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("checkoutOrderSummary")}</h2>

            <div className="space-y-4 mb-6">
              {checkoutData.items.map((item) => (
                <div key={item.productSlug + item.colorName} className="flex gap-3">
                  <div className="w-12 h-12 bg-[#1A1A1A] shrink-0 overflow-hidden relative">
                    <Image src={item.imageUrl || "/products/placeholder/thumb.jpg"} alt={item.productName} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F0EB] text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-[#8A8580]">
                      {item.colorName} x{item.quantity}
                    </p>
                  </div>
                  <p className="text-[#F5F0EB] text-sm shrink-0">{formatPrice(item.subtotal, region)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1A1A1A] pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("cartSubtotal")}</span>
                <span className="text-[#F5F0EB]">{formatPrice(checkoutData.selectedTotal, region)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8580]">{t("cartShipping")}</span>
                <span className={checkoutData.shippingFee === 0 ? "text-[#E8B4B8]" : "text-[#F5F0EB]"}>
                  {checkoutData.shippingFee === 0 ? (t("free") || "Free") : formatPrice(checkoutData.shippingFee, region)}
                </span>
              </div>
              <div className="border-t border-[#1A1A1A] pt-3 flex justify-between">
                <span className="text-[#F5F0EB] font-light">{t("cartTotal")}</span>
                <span className="text-[#F5F0EB] text-lg">{formatPrice(checkoutData.total, region)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={submitting}
              className="w-full mt-6 border border-[#F5F0EB] text-[#F5F0EB] py-4 text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "..." : t("paymentPayNow")}
            </button>

            <Link
              href="/checkout"
              className="block text-center mt-4 text-[#8A8580] text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors"
            >
              {t("paymentBackToCheckout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
