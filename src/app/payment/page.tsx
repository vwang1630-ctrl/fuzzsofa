"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

interface CheckoutItem {
  productSlug: string;
  productName: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
}

interface CheckoutData {
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  };
  shippingMethod: string;
  items: CheckoutItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

interface ExistingOrderItem {
  product_slug: string;
  product_name: string;
  color_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

interface ExistingOrder {
  id: string;
  order_number: string;
  total: number;
  items: ExistingOrderItem[];
}

type PaymentMethod = "creditcard" | "paypal" | "applepay" | "banktransfer";
type PaymentState = "form" | "processing" | "failed";

function PaymentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { t } = useLanguage();

  // Mode detection: new checkout vs paying existing orders
  const [mode, setMode] = useState<"checkout" | "existing">("checkout");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [existingOrders, setExistingOrders] = useState<ExistingOrder[]>([]);
  const [existingOrdersTotal, setExistingOrdersTotal] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("creditcard");
  const [paymentState, setPaymentState] = useState<PaymentState>("form");
  const [errorMessage, setErrorMessage] = useState("");

  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    // Check if we have orderIds in URL (paying existing orders)
    const orderIdsParam = searchParams.get("orderIds");
    if (orderIdsParam) {
      setMode("existing");
      loadExistingOrders(orderIdsParam.split(","));
      return;
    }

    // Otherwise, load checkout data from sessionStorage
    try {
      const raw = sessionStorage.getItem("checkoutData");
      if (!raw) {
        router.replace("/checkout");
        return;
      }
      setCheckoutData(JSON.parse(raw));
      setMode("checkout");
    } catch {
      router.replace("/checkout");
    }
  }, [router, searchParams]);

  const loadExistingOrders = async (orderIds: string[]) => {
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token || "";

      const orders: ExistingOrder[] = [];
      let totalAmount = 0;

      for (const id of orderIds) {
        const res = await fetch(`/api/orders/${id}`, {
          headers: token ? { "x-session": token } : {},
        });
        if (res.ok) {
          const data = await res.json();
          const order = data.order;
          orders.push({
            id: order.id,
            order_number: order.order_number,
            total: order.total,
            items: order.items || [],
          });
          totalAmount += order.total;
        }
      }

      if (orders.length === 0) {
        router.replace("/account");
        return;
      }

      setExistingOrders(orders);
      setExistingOrdersTotal(totalAmount);
    } catch {
      router.replace("/account");
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const isCardValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardholderName.trim().length >= 2 &&
      expiryDate.length === 5 &&
      cvv.length >= 3
    );
  };

  const handleSubmitPayment = async () => {
    setPaymentState("processing");
    setErrorMessage("");

    try {
      // For credit card / PayPal / Apple Pay: simulate payment gateway processing
      if (paymentMethod !== "banktransfer") {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Simulate 95% success rate for demo
        const isSuccessful = Math.random() > 0.05;
        if (!isSuccessful) {
          setPaymentState("failed");
          setErrorMessage(t("paymentDeclined"));
          return;
        }
      }

      // Get Supabase session for auth
      let sessionToken = "";
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data } = await supabase.auth.getSession();
        sessionToken = data.session?.access_token || "";
      } catch {
        // Continue without auth
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(sessionToken ? { "x-session": sessionToken } : {}),
      };

      if (mode === "checkout" && checkoutData) {
        // Create new order
        const orderPayload = {
          items: checkoutData.items.map((item: CheckoutItem) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            colorName: item.colorName || "",
            colorHex: item.colorHex || "#333333",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            imageUrl: item.imageUrl || "",
          })),
          address: checkoutData.address,
          shippingMethod: checkoutData.shippingMethod,
          paymentMethod,
          subtotal: checkoutData.subtotal,
          shippingFee: checkoutData.shippingFee,
          total: checkoutData.total,
          paymentStatus: paymentMethod === "banktransfer" ? "pending_payment" : "paid",
          orderStatus: paymentMethod === "banktransfer" ? "pending" : "confirmed",
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            router.push(`/login?redirect=/payment`);
            return;
          }
          throw new Error(errorData.error || "Failed to create order");
        }

        const orderData = await response.json();
        clearCart();
        sessionStorage.removeItem("checkoutData");

        const orderId = orderData.orderId || orderData.id || "";
        router.push(`/order-confirmed?order=${encodeURIComponent(orderId)}&payment=${paymentMethod}`);
      } else if (mode === "existing" && existingOrders.length > 0) {
        // Pay for existing orders
        const response = await fetch("/api/orders/pay", {
          method: "POST",
          headers,
          body: JSON.stringify({
            orderIds: existingOrders.map((o) => o.id),
            paymentMethod,
            paymentStatus: paymentMethod === "banktransfer" ? "pending_payment" : "paid",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            router.push(`/login?redirect=/payment`);
            return;
          }
          throw new Error(errorData.error || "Failed to process payment");
        }

        router.push(`/order-confirmed?payment=${paymentMethod}`);
      }
    } catch (err: unknown) {
      setPaymentState("failed");
      const message = err instanceof Error ? err.message : t("paymentUnexpectedError");
      setErrorMessage(message);
    }
  };

  const totalAmount = mode === "checkout" && checkoutData ? (checkoutData.total ?? 0) : existingOrdersTotal;
  const shippingFee = mode === "checkout" && checkoutData ? (checkoutData.shippingFee ?? 0) : 0;
  const subtotal = mode === "checkout" && checkoutData ? (checkoutData.subtotal ?? 0) : existingOrdersTotal;

  if ((!checkoutData && mode === "checkout") || (existingOrders.length === 0 && mode === "existing")) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E8B4B8] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Processing overlay
  if (paymentState === "processing") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-2 border-[#E8B4B8] border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
        </div>
        <h2 className="text-[#F5F0EB] text-xl font-light tracking-wide mb-2">
          {t("paymentProcessing")}
        </h2>
        <p className="text-[#8A8580] text-sm">{t("paymentDoNotClose")}</p>
      </div>
    );
  }

  // Failed state
  if (paymentState === "failed") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 className="text-[#F5F0EB] text-xl font-light tracking-wide mb-2">
          {t("paymentFailed")}
        </h2>
        <p className="text-red-400 text-sm mb-8 text-center max-w-md">
          {errorMessage}
        </p>
        <button
          onClick={() => {
            setPaymentState("form");
            setErrorMessage("");
          }}
          className="px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("paymentTryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <div className="border-b border-[#1A1A1A] px-6 py-4">
        <Link href="/" className="font-serif text-xl text-[#F5F0EB] tracking-[0.15em]">
          FUZZ SOFA
        </Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] tracking-wide mb-10">
          {t("paymentTitle")}
        </h1>

        {/* Error banner */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 mb-6 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-10">
          {/* Left: Payment methods + card form */}
          <div className="sm:col-span-3 space-y-8">
            {/* Payment Method Selection */}
            <div>
              <h2 className="text-sm text-[#8A8580] tracking-[0.15em] uppercase mb-4">
                {t("checkoutPaymentMethod")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["creditcard", t("checkoutCreditCard")],
                  ["paypal", t("checkoutPayPal")],
                  ["applepay", t("checkoutApplePay")],
                  ["banktransfer", t("checkoutBankTransfer")],
                ] as [PaymentMethod, string][]).map(([method, label]) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border text-left transition-all duration-300 ${
                      paymentMethod === method
                        ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                        : "border-[#1A1A1A] hover:border-[#333]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method ? "border-[#E8B4B8]" : "border-[#333]"
                        }`}
                      >
                        {paymentMethod === method && (
                          <div className="w-2 h-2 rounded-full bg-[#E8B4B8]" />
                        )}
                      </div>
                      <span className="text-[#F5F0EB] text-sm">{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "creditcard" && (
              <div>
                <h2 className="text-sm text-[#8A8580] tracking-[0.15em] uppercase mb-4">
                  {t("paymentCardDetails")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("paymentCardNumber")}
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("paymentCardholderName")}
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder={t("paymentNameOnCard")}
                      className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                        {t("paymentExpiryDate")}
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                        {t("paymentCVV")}
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-xs text-[#8A8580]">{t("paymentSecureNote")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal */}
            {paymentMethod === "paypal" && (
              <div className="border border-[#1A1A1A] p-8 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-[#003087] mb-1">
                  Pay<span className="text-[#009CDE]">Pal</span>
                </div>
                <p className="text-[#8A8580] text-sm mt-2 text-center">
                  {t("paymentPayPalDescription")}
                </p>
                <p className="text-[#8A8580] text-xs mt-4 text-center">
                  {t("paymentPayPalRedirect")}
                </p>
              </div>
            )}

            {/* Apple Pay */}
            {paymentMethod === "applepay" && (
              <div className="border border-[#1A1A1A] p-8 flex flex-col items-center justify-center">
                <div className="text-[#F5F0EB] text-2xl font-light mb-1">
                  <span className="font-normal">&#xF8FF;</span> Pay
                </div>
                <p className="text-[#8A8580] text-sm mt-2 text-center">
                  {t("paymentApplePayDescription")}
                </p>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === "banktransfer" && (
              <div className="border border-[#1A1A1A] p-6">
                <h3 className="text-[#F5F0EB] text-sm tracking-[0.1em] uppercase mb-4">
                  {t("paymentBankTransferInfo")}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">{t("paymentBankLabel")}</span>
                    <span className="text-[#F5F0EB]">HSBC International</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">SWIFT</span>
                    <span className="text-[#F5F0EB]">HSBCUS33</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">{t("paymentAccountLabel")}</span>
                    <span className="text-[#F5F0EB]">FUZZ-2024-8891</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">{t("paymentBeneficiaryLabel")}</span>
                    <span className="text-[#F5F0EB]">Fuzz Sofa International Ltd.</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                  <h4 className="text-[#F5F0EB] text-xs tracking-[0.1em] uppercase mb-3">
                    {t("paymentHowToPayBankTransfer")}
                  </h4>
                  <ol className="text-xs text-[#8A8580] space-y-2 list-decimal list-inside">
                    <li>{t("paymentBankStep1")}</li>
                    <li>{t("paymentBankStep2")}</li>
                    <li>{t("paymentBankStep3")}</li>
                    <li>{t("paymentBankStep4")}</li>
                    <li>{t("paymentBankStep5")}</li>
                  </ol>
                </div>
                <p className="text-xs text-[#8A8580] mt-4 pt-3 border-t border-[#1A1A1A]">
                  {t("paymentBankTransferNote")}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitPayment}
              disabled={paymentMethod === "creditcard" && !isCardValid()}
              className={`w-full py-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                paymentMethod === "creditcard" && !isCardValid()
                  ? "border border-[#1A1A1A] text-[#8A8580]/40 cursor-not-allowed"
                  : "border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A]"
              }`}
            >
              {paymentMethod === "banktransfer" ? t("paymentConfirmOrder") : t("paymentPayNow")}
            </button>

            <Link
              href={mode === "checkout" ? "/checkout" : "/account"}
              className="block text-center text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
            >
              {mode === "checkout" ? t("paymentBackToCheckout") : t("backToMyOrders")}
            </Link>
          </div>

          {/* Right: Order Summary */}
          <div className="sm:col-span-2">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6 sticky top-24">
              <h2 className="text-sm text-[#8A8580] tracking-[0.15em] uppercase mb-4">
                {t("paymentOrderSummary")}
              </h2>

              {/* Checkout mode: show shipping address */}
              {mode === "checkout" && checkoutData && (
                <div className="mb-4 pb-4 border-b border-[#1A1A1A]">
                  <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1">
                    {t("paymentShippingTo")}
                  </span>
                  <p className="text-[#F5F0EB] text-sm">
                    {checkoutData.address.firstName} {checkoutData.address.lastName}
                  </p>
                  <p className="text-[#8A8580] text-xs">
                    {checkoutData.address.addressLine1}
                    {checkoutData.address.addressLine2 && `, ${checkoutData.address.addressLine2}`}
                  </p>
                  <p className="text-[#8A8580] text-xs">
                    {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zip}
                  </p>
                  <p className="text-[#8A8580] text-xs">{checkoutData.address.country}</p>
                  <Link
                    href="/checkout"
                    className="text-xs text-[#E8B4B8] hover:underline mt-2 inline-block"
                  >
                    {t("paymentEditShipping")}
                  </Link>
                </div>
              )}

              {/* Existing orders mode: show order numbers */}
              {mode === "existing" && (
                <div className="mb-4 pb-4 border-b border-[#1A1A1A]">
                  <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1">
                    {t("paymentPayingFor")}
                  </span>
                  {existingOrders.map((order) => (
                    <p key={order.id} className="text-[#F5F0EB] text-sm">
                      {order.order_number} - ${(order.total ?? 0).toFixed(2)}
                    </p>
                  ))}
                </div>
              )}

              {/* Items (checkout mode) */}
              {mode === "checkout" && checkoutData && (
                <div className="space-y-3 mb-4 pb-4 border-b border-[#1A1A1A]">
                  {checkoutData.items.map((item: CheckoutItem, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] flex-shrink-0 overflow-hidden">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0EB] text-sm truncate">{item.productName}</p>
                        <p className="text-[#8A8580] text-xs">{t("cartQty")}: {item.quantity}</p>
                      </div>
                      <p className="text-[#F5F0EB] text-sm">${(item.unitPrice ?? 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Items (existing orders mode) */}
              {mode === "existing" && existingOrders.map((order) => (
                <div key={order.id} className="space-y-3 mb-4 pb-4 border-b border-[#1A1A1A]">
                  <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{order.order_number}</p>
                  {order.items.map((item: ExistingOrderItem, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] flex-shrink-0 overflow-hidden">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0EB] text-sm truncate">{item.product_name}</p>
                        <p className="text-[#8A8580] text-xs">{t("cartQty")}: {item.quantity}</p>
                      </div>
                      <p className="text-[#F5F0EB] text-sm">${(item.unit_price ?? 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ))}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("subtotal")}</span>
                  <span className="text-[#F5F0EB]">${(subtotal ?? 0).toFixed(2)}</span>
                </div>
                {mode === "checkout" && (
                  <div className="flex justify-between">
                    <span className="text-[#8A8580]">
                      {checkoutData?.shippingMethod === "express" ? t("expressShipping") : t("standardShipping")}
                    </span>
                    <span className="text-[#F5F0EB]">
                      {shippingFee === 0 ? t("freeShipping") : `$${(shippingFee ?? 0).toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#1A1A1A]">
                  <span className="text-[#F5F0EB]">{t("total")}</span>
                  <span className="text-[#E8B4B8] text-lg">${(totalAmount ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#E8B4B8] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentPageInner />
    </Suspense>
  );
}
