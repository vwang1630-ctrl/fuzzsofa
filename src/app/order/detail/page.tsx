"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface OrderItem {
  id: string;
  productSlug: string;
  productName: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
  fabric?: string;
  size?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  currency: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  latestShippingEvent: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  items: OrderItem[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatDate(d: string | undefined | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(d: string | undefined | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusLabel(status: string, t: (key: import("@/lib/i18n").TranslationKeys) => string): string {
  const map: Record<string, import("@/lib/i18n").TranslationKeys> = {
    pending: "orderStatusPending",
    confirmed: "orderStatusConfirmed",
    processing: "orderStatusProcessing",
    in_production: "orderStatusConfirmed",
    shipped: "orderStatusShipped",
    delivered: "orderStatusDelivered",
    cancelled: "orderStatusCancelled",
    refunded: "orderStatusCancelled",
  };
  return map[status] ? t(map[status]) : status;
}

function paymentStatusLabel(status: string, t: (key: import("@/lib/i18n").TranslationKeys) => string): string {
  const map: Record<string, import("@/lib/i18n").TranslationKeys> = {
    pending: "orderStatusPending",
    paid: "orderStatusDelivered",
    failed: "paymentFailed",
    refunded: "orderStatusCancelled",
  };
  return map[status] ? t(map[status]) : status;
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-[#c98b96]/20 text-[#c98b96] border-[#c98b96]/30",
    confirmed: "bg-[#c98b96]/20 text-[#c98b96] border-[#c98b96]/30",
    processing: "bg-[#c98b96]/20 text-[#c98b96] border-[#c98b96]/30",
    in_production: "bg-[#c98b96]/20 text-[#c98b96] border-[#c98b96]/30",
    shipped: "bg-green-900/30 text-green-400 border-green-600/30",
    delivered: "bg-green-900/30 text-green-400 border-green-600/30",
    cancelled: "bg-red-900/30 text-red-400 border-red-600/30",
    refunded: "bg-[#555]/20 text-[#888] border-[#555]/30",
  };
  return map[status] || "bg-[#c98b96]/20 text-[#c98b96] border-[#c98b96]/30";
}

/* ------------------------------------------------------------------ */
/*  Timeline data                                                      */
/* ------------------------------------------------------------------ */
const PRODUCTION_STEPS = [
  { key: "payment_confirmed", titleKey: "odStepPaymentConfirmed" as import("@/lib/i18n").TranslationKeys, descKey: "odStepPaymentDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "in_production", titleKey: "odStepInProduction" as import("@/lib/i18n").TranslationKeys, descKey: "odStepInProductionDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "quality_inspection", titleKey: "odStepInspection" as import("@/lib/i18n").TranslationKeys, descKey: "odStepInspectionDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "domestic_pickup", titleKey: "odStepPickup" as import("@/lib/i18n").TranslationKeys, descKey: "odStepPickupDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "international_freight", titleKey: "odStepAirFreight" as import("@/lib/i18n").TranslationKeys, descKey: "odStepAirFreightDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "customs_clearance", titleKey: "odStepCustoms" as import("@/lib/i18n").TranslationKeys, descKey: "odStepCustomsDesc" as import("@/lib/i18n").TranslationKeys },
  { key: "last_mile_delivery", titleKey: "odStepDelivery" as import("@/lib/i18n").TranslationKeys, descKey: "odStepDeliveryDesc" as import("@/lib/i18n").TranslationKeys },
];

function getStepStatus(orderStatus: string, stepKey: string): "done" | "current" | "pending" {
  const orderProgress: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 1,
    in_production: 2,
    shipped: 5,
    delivered: 7,
    cancelled: 0,
  };
  const stepIndex = PRODUCTION_STEPS.findIndex(s => s.key === stepKey) + 1;
  const currentProgress = orderProgress[orderStatus] || 1;
  if (stepIndex < currentProgress) return "done";
  if (stepIndex === currentProgress) return "current";
  return "pending";
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("orderNo");
  const { t, locale } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [ddpOpen, setDdpOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Get session token
  useEffect(() => {
    async function getSession() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        setSessionToken(session?.access_token ?? null);
      } catch { /* not logged in */ }
    }
    getSession();
  }, []);

  const authHeaders = useCallback(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (sessionToken) h["x-session"] = sessionToken;
    return h;
  }, [sessionToken]);

  const fetchOrder = useCallback(async () => {
    if (!orderNo || !sessionToken) return;
    try {
      const res = await fetch("/api/orders", { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const orders: Order[] = data.orders || data;
      const found = orders.find((o: Order) => o.orderNumber === orderNo);
      if (found) setOrder(found);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [orderNo, sessionToken, authHeaders]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#8A8580] text-sm tracking-wider animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        {!sessionToken ? (
          <>
            <p className="text-[#8A8580] text-sm">{t("odNotLoggedIn")}</p>
            <Link href="/account" className="text-[#c98b96] text-xs tracking-wider uppercase border border-[#c98b96]/40 px-4 py-2 rounded hover:bg-[#c98b96] hover:text-[#0A0A0A] transition-all duration-300">
              {t("backToOrders") || "← Back to My Orders"}
            </Link>
          </>
        ) : (
          <>
            <p className="text-[#8A8580] text-sm">{t("odOrderNotFound")}</p>
            <Link href="/account" className="text-[#c98b96] text-xs tracking-wider uppercase hover:underline">
              {t("backToOrders") || "← Back to My Orders"}
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0EB]">
      {/* Back link */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <Link href="/account" className="text-[#8A8580] text-xs sm:text-sm tracking-wider hover:text-[#c98b96] transition-colors">
          ← {t("backToOrders") || "Back to My Orders"}
        </Link>
      </div>

      {/* Main content: left + right columns on desktop */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_340px] gap-6 sm:gap-8 lg:gap-12">

          {/* ====== LEFT COLUMN ====== */}
          <div className="space-y-8 sm:space-y-10">

            {/* MODULE A: Header + Basic Info */}
            <section>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-light tracking-wider mb-2">
                    {t("odOrderDetails")}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[#8A8580] text-xs sm:text-sm tracking-wider">{order.orderNumber}</span>
                    <span className={`inline-block px-2 py-0.5 text-[12px] tracking-wider rounded border ${statusColor(order.status)}`}>
                      {statusLabel(order.status, t)}
                    </span>
                  </div>
                  <p className="text-[#8A8580] text-[12px] mt-1.5 tracking-wide">
                    {formatDate(order.createdAt)} · {t("odUtcTime")}
                  </p>
                </div>
              </div>

              {/* Progress hint */}
              {(order.status === "in_production" || order.status === "processing" || order.status === "confirmed") && (
                <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 sm:p-5 mt-4">
                  <p className="text-[#c98b96] text-xs sm:text-sm leading-relaxed">
                    {locale === "zh" ? t("odProgressHintZh") : t("odProgressHintEn")}{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "—"}
                  </p>
                </div>
              )}
            </section>

            {/* MODULE B: Order Items */}
            <section>
              <h2 className="text-sm sm:text-base font-light tracking-[0.15em] uppercase mb-4 pb-2 border-b border-[#1a1a1a]">
                {t("odOrderItems")}
              </h2>
              <div className="space-y-5">
                {order.items?.map(item => (
                  <div key={item.id} className="bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden">
                    <div className="flex gap-4 p-4 sm:p-5">
                      {/* Product image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden bg-[#0A0A0A] flex-shrink-0 border border-[#1a1a1a]">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#333] text-xs">—</div>
                        )}
                      </div>
                      {/* Product info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-[#F5F0EB] text-sm sm:text-base font-light">{item.productName}</p>
                        <p className="text-[#8A8580] text-[12px] tracking-wider">
                          {t("odModel")}: <span className="text-[#F5F0EB]/70">{item.productSlug}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          {item.colorHex && (
                            <span className="w-3.5 h-3.5 rounded-full border border-[#333]" style={{ backgroundColor: item.colorHex }} />
                          )}
                          <span className="text-[#8A8580] text-[12px]">{item.colorName ? `${t("odColor")}: ${item.colorName}` : ""}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-[#8A8580] pt-1">
                          <span>{t("odUnitPrice")}: <span className="text-[#F5F0EB]/80">{formatPrice(item.unitPrice)}</span></span>
                          <span>{t("odQty")}: <span className="text-[#F5F0EB]/80">{item.quantity}</span></span>
                          <span>{t("odItemSubtotal")}: <span className="text-[#F5F0EB]">{formatPrice(item.subtotal)}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Product Specs */}
                    <div className="border-t border-[#1a1a1a]">
                      <button
                        onClick={() => setSpecsOpen(!specsOpen)}
                        className="w-full px-4 sm:px-5 py-2.5 flex items-center justify-between text-[12px] tracking-wider text-[#8A8580] hover:text-[#c98b96] transition-colors"
                      >
                        <span>{t("odProductSpecs")}</span>
                        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${specsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {specsOpen && (
                        <div className="px-4 sm:px-5 pb-4 space-y-2 text-[12px]">
                          <div className="flex justify-between"><span className="text-[#8A8580]">{t("odMaterial")}</span><span className="text-[#F5F0EB]/70 text-right">{t("odMaterialDesc")}</span></div>
                          {item.size && <div className="flex justify-between"><span className="text-[#8A8580]">{t("odProductSize")}</span><span className="text-[#F5F0EB]/70">{item.size}</span></div>}
                          {item.fabric && <div className="flex justify-between"><span className="text-[#8A8580]">{t("odFabric")}</span><span className="text-[#F5F0EB]/70">{item.fabric}</span></div>}
                          <div className="flex justify-between"><span className="text-[#8A8580]">{t("odWarranty")}</span><span className="text-[#F5F0EB]/70">{t("odWarrantyDesc")}</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MODULE C: Payment & Tax Declaration */}
            <section className="bg-[#111] border border-[#c98b96]/20 rounded-lg p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-light tracking-[0.15em] uppercase mb-4 pb-2 border-b border-[#1a1a1a]">
                {t("odPaymentTax")}
              </h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("odChargeTime")}</span>
                  <span className="text-[#F5F0EB]/80">{formatDateTime(order.createdAt)} (UTC+8)</span>
                </div>
                <div className="flex items-start gap-2 pt-2">
                  <span className="text-[#c98b96] mt-0.5">✅</span>
                  <p className="text-[#F5F0EB] text-xs sm:text-sm leading-relaxed">
                    {locale === "zh" ? t("odDdpStatementZh") : t("odDdpStatementEn")}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setDdpOpen(!ddpOpen)}
                    className="text-[#c98b96] text-[12px] tracking-wider underline underline-offset-4 hover:no-underline transition-all"
                  >
                    {t("odDdpDetails")} {ddpOpen ? "▲" : "▼"}
                  </button>
                  {ddpOpen && (
                    <div className="mt-3 bg-[#0A0A0A] rounded p-3 sm:p-4 space-y-2 text-[12px] text-[#8A8580] leading-relaxed">
                      <p>{locale === "zh" ? t("odDdpDetail1Zh") : t("odDdpDetail1En")}</p>
                      <p>{locale === "zh" ? t("odDdpDetail2Zh") : t("odDdpDetail2En")}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* MODULE D: Production & Shipping Timeline */}
            <section>
              <h2 className="text-sm sm:text-base font-light tracking-[0.15em] uppercase mb-4 pb-2 border-b border-[#1a1a1a]">
                {t("odTimeline")}
              </h2>
              <div className="space-y-0">
                {PRODUCTION_STEPS.map((step, idx) => {
                  const stepState = getStepStatus(order.status, step.key);
                  return (
                    <div key={step.key} className="flex gap-3 sm:gap-4">
                      {/* Timeline track */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          stepState === "done" ? "border-[#555] bg-[#555]" :
                          stepState === "current" ? "border-[#c98b96] bg-[#c98b96]/20" :
                          "border-[#333] bg-transparent"
                        }`}>
                          {stepState === "done" && (
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {stepState === "current" && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#c98b96]" />
                          )}
                        </div>
                        {idx < PRODUCTION_STEPS.length - 1 && (
                          <div className={`w-px flex-1 min-h-[24px] ${
                            stepState === "done" ? "bg-[#555]" :
                            stepState === "current" ? "bg-gradient-to-b from-[#c98b96]/50 to-[#333]" :
                            "bg-[#222]"
                          }`} />
                        )}
                      </div>
                      {/* Step content */}
                      <div className={`pb-4 sm:pb-5 ${idx === PRODUCTION_STEPS.length - 1 ? "pb-0" : ""}`}>
                        <p className={`text-xs sm:text-sm font-light tracking-wider ${
                          stepState === "current" ? "text-[#c98b96]" :
                          stepState === "done" ? "text-[#8A8580]" :
                          "text-[#444]"
                        }`}>
                          {t(step.titleKey)}
                        </p>
                        <p className={`text-[12px] mt-0.5 leading-relaxed ${
                          stepState === "current" ? "text-[#8A8580]" :
                          stepState === "done" ? "text-[#555]" :
                          "text-[#333]"
                        }`}>
                          {t(step.descKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping route summary */}
              <div className="mt-6 bg-[#111] border border-[#1a1a1a] rounded-lg p-3 sm:p-4">
                <p className="text-[12px] text-[#8A8580] tracking-wider mb-2">{t("odShippingRoute")}</p>
                <p className="text-[12px] text-[#F5F0EB]/60 leading-relaxed">
                  {locale === "zh" ? t("odShippingRouteZh") : t("odShippingRouteEn")}
                </p>
              </div>
            </section>
          </div>

          {/* ====== RIGHT COLUMN (sidebar) ====== */}
          <div className="space-y-6">

            {/* Order Summary Card */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 sm:p-5 sticky top-20">
              <h3 className="text-xs sm:text-sm tracking-[0.15em] uppercase text-[#8A8580] mb-4 pb-2 border-b border-[#1a1a1a]">
                {t("odOrderSummary")}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("odSubtotal")}</span>
                  <span className="text-[#F5F0EB]">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("odShipping")}</span>
                  <span className="text-[#c98b96]">{order.shippingFee === 0 ? t("odFreeShipping") : formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#1a1a1a]">
                  <span className="text-[#F5F0EB] font-light">{t("odTotal")}</span>
                  <span className="text-[#F5F0EB]">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a1a1a] space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8A8580]">{t("odPaymentStatus")}</span>
                  <span className={order.paymentStatus === "paid" ? "text-green-400" : "text-[#c98b96]"}>
                    {paymentStatusLabel(order.paymentStatus, t)}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8A8580]">{t("odPaymentMethod")}</span>
                  <span className="text-[#F5F0EB]/70">{order.paymentMethod || "PayPal"}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm tracking-[0.15em] uppercase text-[#8A8580] mb-3 pb-2 border-b border-[#1a1a1a]">
                {t("odShippingAddress")}
              </h3>
              <div className="space-y-1.5 text-[12px] text-[#F5F0EB]/70">
                <p>{order.firstName} {order.lastName}</p>
                <p>{order.addressLine1}</p>
                {order.addressLine2 && <p>{order.addressLine2}</p>}
                <p>{order.city}{order.state ? `, ${order.state}` : ""} {order.zipCode}</p>
                <p>{order.country}</p>
                {order.phone && <p className="text-[#8A8580] mt-1">{order.phone}</p>}
              </div>
            </div>

            {/* Contact Support */}
            <Link
              href="/contact"
              className="block text-center text-[12px] tracking-[0.15em] uppercase text-[#8A8580] border border-[#333] rounded-lg py-3 hover:border-[#c98b96] hover:text-[#c98b96] transition-all duration-300"
            >
              {t("odContactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
