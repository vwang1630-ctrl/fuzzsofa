"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OrderItem {
  id: string;
  product_slug: string;
  product_name: string;
  color_name: string | null;
  color_hex: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url: string | null;
}

interface ShippingEvent {
  id: string;
  event_type: string;
  event_title: string | null;
  event_description: string | null;
  location: string | null;
  event_time: string;
  happened_at: string;
  is_current: boolean;
  is_exception: boolean;
  carrier: string | null;
  tracking_number: string | null;
  flight_vessel: string | null;
  estimated_arrival: string | null;
  // Old schema fields
  status: string;
  description: string | null;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total: number;
  shipping_fee: number;
  subtotal: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  address_line: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  latest_shipping_event: string | null;
  shipping_method: string | null;
  created_at: string;
  items: OrderItem[];
  shipping_events: ShippingEvent[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// All shipping event types in order
const SHIPPING_EVENT_ORDER: string[] = [
  "shippingPreShipping",
  "shippingPacked",
  "shippingPickedUp",
  "shippingWarehouseReceived",
  "shippingWarehouseDispatched",
  "shippingExportDeclared",
  "shippingExportCleared",
  "shippingInTransitIntl",
  "shippingTransitHub",
  "shippingArrivedDest",
  "shippingImportDeclared",
  "shippingTaxPaid",
  "shippingImportCleared",
  "shippingLocalSorting",
  "shippingLocalDispatched",
  "shippingOutForDelivery",
  "shippingDelivered",
];

const EXCEPTION_EVENTS = new Set([
  "shippingCustomsHold",
  "shippingDelay",
  "shippingDeliveryFailed",
  "shippingReturnToOrigin",
]);

const EVENT_PHASES: { phase: string; events: string[] }[] = [
  { phase: "shippingPhaseDomestic", events: ["shippingPreShipping", "shippingPacked", "shippingPickedUp", "shippingWarehouseReceived", "shippingWarehouseDispatched"] },
  { phase: "shippingPhaseExport", events: ["shippingExportDeclared", "shippingExportCleared", "shippingInTransitIntl"] },
  { phase: "shippingPhaseInternational", events: ["shippingTransitHub"] },
  { phase: "shippingPhaseImport", events: ["shippingArrivedDest", "shippingImportDeclared", "shippingTaxPaid", "shippingImportCleared"] },
  { phase: "shippingPhaseLocal", events: ["shippingLocalSorting", "shippingLocalDispatched", "shippingOutForDelivery", "shippingDelivered"] },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const formatDateTime = (d: string) => {
  try { return new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return d; }
};

const statusLabel = (s: string, t: (key: TranslationKeys) => string): string => {
  const m: Record<string, TranslationKeys> = {
    pending: "orderStatusPending",
    confirmed: "orderStatusConfirmed",
    processing: "orderStatusProcessing",
    shipped: "orderStatusShipped",
    delivered: "orderStatusDelivered",
    cancelled: "orderStatusCancelled",
  };
  return m[s] ? t(m[s]) : s;
};

const statusColor = (s: string) => {
  const m: Record<string, string> = {
    pending: "text-[#8A8580]",
    confirmed: "text-[#E8B4B8]",
    processing: "text-yellow-400",
    shipped: "text-blue-400",
    delivered: "text-green-400",
    cancelled: "text-red-400",
  };
  return m[s] || "text-[#8A8580]";
};

// Map latest shipping event to badge key
const shippingBadgeKey = (eventType: string | null): TranslationKeys => {
  if (!eventType) return "shippingStatusBadgePreShipping";
  if (eventType.startsWith("shippingPreShipping") || eventType.startsWith("shippingPacked")) return "shippingStatusBadgePreShipping";
  if (["shippingPickedUp", "shippingWarehouseReceived", "shippingWarehouseDispatched"].includes(eventType)) return "shippingStatusBadgeDomestic";
  if (["shippingExportDeclared", "shippingExportCleared", "shippingInTransitIntl", "shippingTransitHub"].includes(eventType)) return "shippingStatusBadgeInternational";
  if (["shippingArrivedDest", "shippingImportDeclared", "shippingTaxPaid", "shippingImportCleared"].includes(eventType)) return "shippingStatusBadgeCustoms";
  if (["shippingLocalSorting", "shippingLocalDispatched", "shippingOutForDelivery"].includes(eventType)) return "shippingStatusBadgeLocalDelivery";
  if (eventType === "shippingDelivered") return "shippingStatusBadgeDelivered";
  if (EXCEPTION_EVENTS.has(eventType)) return "shippingStatusBadgeException";
  return "shippingStatusBadgePreShipping";
};

const badgeColorClass = (eventType: string | null): string => {
  if (!eventType) return "bg-[#8A8580]/20 text-[#8A8580]";
  if (EXCEPTION_EVENTS.has(eventType)) return "bg-red-500/20 text-red-400";
  if (eventType === "shippingDelivered") return "bg-green-500/20 text-green-400";
  if (["shippingLocalSorting", "shippingLocalDispatched", "shippingOutForDelivery"].includes(eventType)) return "bg-green-500/20 text-green-400";
  if (["shippingArrivedDest", "shippingImportDeclared", "shippingTaxPaid", "shippingImportCleared"].includes(eventType)) return "bg-orange-500/20 text-orange-400";
  if (["shippingExportDeclared", "shippingExportCleared", "shippingInTransitIntl", "shippingTransitHub"].includes(eventType)) return "bg-blue-500/20 text-blue-400";
  return "bg-[#8A8580]/20 text-[#8A8580]";
};

/* ------------------------------------------------------------------ */
/*  Timeline Node Component                                            */
/* ------------------------------------------------------------------ */

function TimelineNode({
  event,
  isCurrent,
  isCompleted,
  isException,
  t,
}: {
  event: ShippingEvent;
  isCurrent: boolean;
  isCompleted: boolean;
  isException: boolean;
  t: (key: TranslationKeys) => string;
}) {
  const eventType = event.event_type || event.status;
  const title = event.event_description || event.description || (eventType ? t(eventType as TranslationKeys) : eventType);

  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      {/* Dot */}
      <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        isException
          ? "border-red-500 bg-red-500/30"
          : isCurrent
          ? "border-blue-400 bg-blue-400 ring-4 ring-blue-400/20"
          : isCompleted
          ? "border-[#E8B4B8] bg-[#E8B4B8]"
          : "border-[#333] bg-transparent"
      }`}>
        {isCompleted && !isException && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {isException && (
          <span className="text-red-400 text-[8px] font-bold">!</span>
        )}
        {isCurrent && (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div>
        <p className={`text-sm ${isCurrent ? "text-[#F5F0EB] font-medium" : isCompleted ? "text-[#F5F0EB]/80" : "text-[#333]"}`}>
          {title}
        </p>
        {event.location && (
          <p className={`text-xs mt-0.5 ${isCurrent || isCompleted ? "text-[#8A8580]" : "text-[#333]"}`}>
            {event.location}
          </p>
        )}
        <p className={`text-xs mt-0.5 ${isCurrent || isCompleted ? "text-[#8A8580]" : "text-[#333]"}`}>
          {formatDateTime(event.event_time || event.happened_at)}
        </p>
        {event.flight_vessel && (
          <p className="text-xs text-[#8A8580] mt-0.5">
            {event.flight_vessel}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Route Diagram Component                                            */
/* ------------------------------------------------------------------ */

function RouteDiagram({ t, currentPhase }: { t: (key: TranslationKeys) => string; currentPhase: number }) {
  const phases = [
    { label: "shippingRouteChina", icon: "🏭" },
    { label: "shippingRouteTransit", icon: "✈️" },
    { label: "shippingRouteDestination", icon: "🏛️" },
    { label: "shippingRouteDelivery", icon: "🚚" },
  ];

  return (
    <div className="flex items-center justify-between gap-1 py-4">
      {phases.map((phase, i) => (
        <div key={phase.label} className="flex items-center gap-1">
          <div className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded ${
            i <= currentPhase ? "bg-[#E8B4B8]/10" : "bg-[#1A1A1A]"
          }`}>
            <span className="text-lg">{phase.icon}</span>
            <span className={`text-[10px] tracking-wide ${
              i <= currentPhase ? "text-[#F5F0EB]" : "text-[#333]"
            }`}>
              {t(phase.label as TranslationKeys)}
            </span>
          </div>
          {i < phases.length - 1 && (
            <div className={`w-6 h-px ${i < currentPhase ? "bg-[#E8B4B8]" : "bg-[#333]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [shippingEvents, setShippingEvents] = useState<ShippingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const orderId = params.id as string;

  const fetchOrder = useCallback(async () => {
    try {
      let sessionToken: string | null = null;
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        sessionToken = session?.access_token ?? null;
      } catch { /* not logged in */ }

      const headers: Record<string, string> = {};
      if (sessionToken) headers["x-session"] = sessionToken;

      const res = await fetch(`/api/orders/${orderId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }

      // Also fetch shipping events
      const shippingRes = await fetch(`/api/orders/${orderId}/shipping`, { headers });
      if (shippingRes.ok) {
        const shippingData = await shippingRes.json();
        setShippingEvents(shippingData.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  const handleCopyTracking = async () => {
    const tn = order?.tracking_number || shippingEvents[0]?.tracking_number;
    if (!tn) return;
    try {
      await navigator.clipboard.writeText(tn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const handlePayOrder = () => {
    if (!order) return;
    const payData = {
      orderIds: [order.id],
      items: order.items.map(it => ({
        productSlug: it.product_slug,
        productName: it.product_name,
        colorName: it.color_name,
        colorHex: it.color_hex,
        quantity: it.quantity,
        unitPrice: it.unit_price,
        subtotal: it.subtotal,
        imageUrl: it.image_url,
      })),
      total: order.total,
      subtotal: order.subtotal,
      shippingFee: order.shipping_fee,
    };
    sessionStorage.setItem("payExistingOrders", JSON.stringify(payData));
    router.push("/payment");
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      let sessionToken: string | null = null;
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        sessionToken = session?.access_token ?? null;
      } catch { /* noop */ }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (sessionToken) headers["x-session"] = sessionToken;

      await fetch(`/api/orders/${orderId}/seed-shipping`, { method: "POST", headers });
      await fetchOrder(); // Refresh
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  // Determine current phase for route diagram
  const latestEvent = shippingEvents.find(e => e.is_current) || shippingEvents[shippingEvents.length - 1];
  const latestEventType = latestEvent?.event_type || latestEvent?.status;
  const currentPhaseIdx = (() => {
    if (!latestEventType) return -1;
    for (let pi = 0; pi < EVENT_PHASES.length; pi++) {
      if (EVENT_PHASES[pi].events.includes(latestEventType)) return pi;
    }
    return -1;
  })();

  // Get active events (non-exception, sorted)
  const activeEvents = shippingEvents.filter(e => !EXCEPTION_EVENTS.has(e.event_type || e.status));
  const exceptionEvents = shippingEvents.filter(e => EXCEPTION_EVENTS.has(e.event_type || e.status));
  const hasException = exceptionEvents.length > 0;

  // Determine which future events to show
  const latestActiveEvent = activeEvents[activeEvents.length - 1];
  const latestActiveEventType = latestActiveEvent?.event_type || latestActiveEvent?.status;
  const latestActiveIdx = SHIPPING_EVENT_ORDER.indexOf(latestActiveEventType || "");

  // Build the full timeline: past events + future placeholders
  const allTimelineEvents: { event?: ShippingEvent; eventType: string; isFuture: boolean }[] = [];

  // Add actual events
  for (const evt of activeEvents) {
    allTimelineEvents.push({ event: evt, eventType: evt.event_type || evt.status, isFuture: false });
  }

  // Add future placeholder events (only show next few)
  if (latestActiveIdx >= 0 && latestActiveIdx < SHIPPING_EVENT_ORDER.length - 1) {
    const futureEvents = SHIPPING_EVENT_ORDER.slice(latestActiveIdx + 1, latestActiveIdx + 4);
    for (const ft of futureEvents) {
      allTimelineEvents.push({ eventType: ft, isFuture: true });
    }
  }

  // Find the tracking number and carrier
  const trackingNumber = order?.tracking_number || shippingEvents[0]?.tracking_number;
  const carrier = order?.carrier || shippingEvents[0]?.carrier;
  const estimatedDelivery = order?.estimated_delivery;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#8A8580]">{t("orderNotFound")}</p>
        <Link href="/account" className="text-[#E8B4B8] hover:underline text-sm">{t("backToMyOrders")}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Back button */}
      <button
        onClick={() => router.push("/account")}
        className="flex items-center gap-2 text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t("backToMyOrders")}
      </button>

      {/* =========== TOP OVERVIEW CARD =========== */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl text-[#F5F0EB] tracking-wide">{t("orderDetails")}</h1>
            <p className="text-sm text-[#8A8580] mt-1">{order.order_number} · {formatDate(order.created_at)}</p>
          </div>
          <span className={`text-xs uppercase tracking-wider px-3 py-1 ${badgeColorClass(latestEventType)}`}>
            {t(shippingBadgeKey(latestEventType))}
          </span>
        </div>

        {/* Tracking number & carrier */}
        {trackingNumber && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{t("trackingNumber")}:</span>
            <span className="text-[#F5F0EB] font-mono text-sm">{trackingNumber}</span>
            <button
              onClick={handleCopyTracking}
              className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        )}
        {carrier && (
          <p className="text-xs text-[#8A8580] mb-3">{t("carrier")}: {carrier}</p>
        )}
        {estimatedDelivery && (
          <p className="text-sm text-[#F5F0EB]">
            {t("shippingEstDelivery")}: <span className="text-[#E8B4B8]">{formatDate(estimatedDelivery)}</span>
          </p>
        )}

        {/* DDP Banner */}
        {(order.status === "shipped" || order.status === "delivered" || order.status === "processing") && (
          <div className="mt-4 bg-[#E8B4B8]/5 border border-[#E8B4B8]/20 px-4 py-2.5">
            <p className="text-xs text-[#E8B4B8]">{t("shippingDDPNotice")}</p>
          </div>
        )}

        {/* Exception alert */}
        {hasException && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm">{t("shippingExceptionAlert")}</p>
              <Link href="/account" className="text-xs text-red-400 hover:text-red-300 underline">
                {t("shippingContactSupport")}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* =========== TWO COLUMN LAYOUT =========== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Pending Payment: Pay Now */}
          {order.payment_status === "pending" && order.status !== "cancelled" && (
            <section className="bg-[#111111] border border-yellow-500/30 p-5">
              <p className="text-yellow-400 text-sm mb-4">{t("orderAwaitingPayment")}</p>
              <div className="flex gap-3">
                <button
                  onClick={handlePayOrder}
                  className="px-5 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
                >
                  {t("accountPayNow")}
                </button>
                <Link
                  href="/account"
                  className="px-5 py-2 text-xs tracking-wider uppercase border border-[#333] text-[#8A8580] hover:text-[#F5F0EB] hover:border-[#F5F0EB] transition-all"
                >
                  {t("backToMyOrders")}
                </Link>
              </div>
            </section>
          )}

          {/* In Production message */}
          {order.status === "confirmed" && (
            <section className="bg-[#111111] border border-[#E8B4B8]/30 p-5">
              <p className="text-[#E8B4B8] text-sm">{t("accountInProductionDesc")}</p>
            </section>
          )}

          {/* =========== LOGISTICS TIMELINE =========== */}
          {shippingEvents.length > 0 ? (
            <section>
              <h2 className="font-serif text-lg text-[#F5F0EB] mb-2">{t("shippingTracking")}</h2>

              {/* Route Diagram */}
              <div className="bg-[#111111] border border-[#1A1A1A] p-4 mb-6">
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">{t("shippingRouteDiagram")}</p>
                <RouteDiagram t={t} currentPhase={currentPhaseIdx} />
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {allTimelineEvents.map((item, i) => {
                  if (item.isFuture) {
                    // Future placeholder
                    return (
                      <div key={`future-${item.eventType}-${i}`} className="relative pl-8 pb-4 last:pb-0">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-[#333] bg-transparent" />
                        <p className="text-sm text-[#333]">{t(item.eventType as TranslationKeys)}</p>
                      </div>
                    );
                  }

                  const evt = item.event!;
                  const isCurrent = evt.is_current || (i === activeEvents.length - 1 && !evt.is_exception);
                  const isCompleted = !isCurrent && !evt.is_exception;
                  const isException = evt.is_exception || EXCEPTION_EVENTS.has(evt.event_type || evt.status);

                  return (
                    <TimelineNode
                      key={evt.id}
                      event={evt}
                      isCurrent={isCurrent}
                      isCompleted={isCompleted}
                      isException={isException}
                      t={t}
                    />
                  );
                })}
              </div>

              {/* Exception events */}
              {exceptionEvents.length > 0 && (
                <div className="mt-6 border-l-2 border-red-500 pl-4">
                  {exceptionEvents.map(evt => (
                    <TimelineNode
                      key={evt.id}
                      event={evt}
                      isCurrent={false}
                      isCompleted={false}
                      isException={true}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : (
            /* No shipping events yet - show simple status timeline */
            <section>
              <h2 className="font-serif text-lg text-[#F5F0EB] mb-6">{t("orderProgress")}</h2>
              <SimpleTimeline status={order.status} t={t} />

              {/* Seed demo data button for shipped/confirmed orders */}
              {(order.status === "shipped" || order.status === "confirmed" || order.status === "processing") && (
                <button
                  onClick={handleSeedDemo}
                  disabled={seeding}
                  className="mt-6 text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors border border-[#333] px-3 py-1.5 hover:border-[#E8B4B8]"
                >
                  {seeding ? "..." : "Demo: Seed Shipping Data"}
                </button>
              )}
            </section>
          )}

          {/* Order Items */}
          <section>
            <h2 className="font-serif text-lg text-[#F5F0EB] mb-4">{t("orderItems")}</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-[#111111] border border-[#1A1A1A] p-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-[#1A1A1A] overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#333] text-lg">
                        {(item.product_name || "?").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/${item.product_slug}`} className="text-[#F5F0EB] text-sm hover:text-[#E8B4B8] transition-colors">
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-[#8A8580] mt-0.5">
                      {item.color_name || t("defaultColor")} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#F5F0EB] text-sm">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-[#111111] border border-[#1A1A1A] p-5">
            <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-4">{t("orderSummary")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8A8580]">{t("subtotal")}</span>
                <span className="text-[#F5F0EB]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8580]">{t("shipping")}</span>
                <span className="text-[#F5F0EB]">{order.shipping_fee === 0 ? t("freeShipping") : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="border-t border-[#1A1A1A] pt-2 flex justify-between">
                <span className="text-[#F5F0EB]">{t("total")}</span>
                <span className="text-[#E8B4B8]">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8580]">{t("payment")}</span>
                <span className="text-[#F5F0EB]">{order.payment_status === "paid" ? t("orderPaymentPaid") : t("orderPaymentUnpaid")}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#111111] border border-[#1A1A1A] p-5">
            <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">{t("shippingAddress")}</h3>
            <p className="text-[#F5F0EB] text-sm">{order.first_name} {order.last_name}</p>
            <p className="text-[#F5F0EB] text-sm">{order.email}</p>
            {order.phone && <p className="text-[#8A8580] text-sm">{order.phone}</p>}
            <p className="text-[#8A8580] text-sm">
              {order.address_line}{order.address_line2 ? `, ${order.address_line2}` : ""}<br />
              {order.city}, {order.state || ""} {order.zip_code || ""}<br />
              {order.country}
            </p>
          </div>

          {/* Logistics Service Info */}
          {(order.status === "shipped" || order.status === "delivered" || order.status === "processing") && (
            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">{t("shipping")}</h3>
              <div className="space-y-2 text-xs text-[#8A8580]">
                <p>✓ {t("shippingServiceDDP")}</p>
                <p>✓ {t("shippingServiceTimeline")}</p>
                <p>✓ {t("shippingServiceLostClaim")}</p>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            {trackingNumber && (
              <button
                onClick={handleCopyTracking}
                className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors text-left"
              >
                {t("shippingCopyTracking")}
              </button>
            )}
            <Link href="/account" className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">
              {t("shippingContactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple Timeline (fallback when no shipping events)                 */
/* ------------------------------------------------------------------ */

function SimpleTimeline({ status, t }: { status: string; t: (key: TranslationKeys) => string }) {
  const steps = [
    { key: "pending", labelKey: "timelineOrderPlaced" as TranslationKeys, descKey: "timelineDescWaitingPayment" as TranslationKeys },
    { key: "confirmed", labelKey: "timelineInProduction" as TranslationKeys, descKey: "timelineDescCrafting" as TranslationKeys },
    { key: "processing", labelKey: "timelinePacking" as TranslationKeys, descKey: "timelineDescPacking" as TranslationKeys },
    { key: "shipped", labelKey: "timelineShipped" as TranslationKeys, descKey: "timelineDescShipped" as TranslationKeys },
    { key: "delivered", labelKey: "timelineDelivered" as TranslationKeys, descKey: "timelineDescDelivered" as TranslationKeys },
  ];

  const currentIdx = steps.findIndex(s => s.key === status);
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isCompleted = !isCancelled && i < currentIdx;
        const isCurrent = !isCancelled && i === currentIdx;

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                isCompleted ? "bg-[#E8B4B8]" :
                isCurrent ? "bg-[#E8B4B8] ring-4 ring-[#E8B4B8]/20" :
                "bg-[#333]"
              }`} />
              {i < steps.length - 1 && (
                <div className={`w-px h-10 ${isCompleted ? "bg-[#E8B4B8]" : "bg-[#1A1A1A]"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm ${isCompleted || isCurrent ? "text-[#F5F0EB]" : "text-[#333]"}`}>
                {t(step.labelKey)}
              </p>
              <p className={`text-xs mt-0.5 ${isCurrent ? "text-[#E8B4B8]" : "text-[#8A8580]"}`}>
                {isCancelled ? "—" : t(step.descKey)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
