"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";

interface ShippingEvent {
  id: string;
  event_type: string;
  event_title: string;
  event_description: string | null;
  location: string | null;
  event_time: string;
  is_current: boolean;
  is_exception: boolean;
  flight_vessel: string | null;
  estimated_arrival: string | null;
}

interface TrackingResult {
  order_number: string;
  tracking_number: string;
  carrier: string | null;
  estimated_delivery: string | null;
  status: string;
  events: ShippingEvent[];
  exception?: { type: string; message: string } | null;
}

const PHASE_ORDER = [
  // Phase 1: Domestic
  "pre_shipping", "packed", "picked_up", "warehouse_received", "warehouse_dispatched",
  // Phase 2: Export
  "export_declared", "export_cleared", "export_inspection", "in_transit_intl",
  // Phase 3: International
  "transit_hub",
  // Phase 4: Import (DDP)
  "arrived_dest", "import_declared", "tax_paid", "import_cleared",
  // Phase 5: Local delivery
  "local_sorting", "local_dispatched", "out_for_delivery", "delivered",
];

const EVENT_TYPE_TO_I18N_KEY: Record<string, string> = {
  pre_shipping: "shippingPreShipping",
  packed: "shippingPacked",
  picked_up: "shippingPickedUp",
  warehouse_received: "shippingWarehouseReceived",
  warehouse_dispatched: "shippingWarehouseDispatched",
  export_declared: "shippingExportDeclared",
  export_cleared: "shippingExportCleared",
  export_inspection: "shippingExportInspection",
  in_transit_intl: "shippingInTransitIntl",
  transit_hub: "shippingTransitHub",
  arrived_dest: "shippingArrivedDest",
  import_declared: "shippingImportDeclared",
  tax_paid: "shippingTaxPaid",
  import_cleared: "shippingImportCleared",
  local_sorting: "shippingLocalSorting",
  local_dispatched: "shippingLocalDispatched",
  out_for_delivery: "shippingOutForDelivery",
  delivered: "shippingDelivered",
  customs_hold: "shippingCustomsHold",
  delay: "shippingDelay",
  delivery_failed: "shippingDeliveryFailed",
  return_to_origin: "shippingReturnToOrigin",
};

const EXCEPTION_TYPES = ["customs_hold", "delay", "delivery_failed", "return_to_origin"];

function getEventIcon(eventType: string, isCompleted: boolean, isCurrent: boolean, isException: boolean): { icon: string; color: string } {
  if (isException) return { icon: "!", color: "bg-red-500 text-white" };
  if (isCurrent) return { icon: "●", color: "bg-blue-500 text-white" };
  if (isCompleted) return { icon: "✓", color: "bg-green-600 text-white" };
  return { icon: "○", color: "bg-[#333] text-[#8A8580]" };
}

export default function TrackingPage() {
  const { t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("trackingHistory") || "[]");
      setSearchHistory(history);
    } catch { /* ignore */ }
  }, []);

  const handleSearch = async (num?: string) => {
    const searchNum = num || trackingNumber.trim();
    if (!searchNum) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch(`/api/tracking?tracking_number=${encodeURIComponent(searchNum)}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setResult(data);

      // Save to history
      setSearchHistory(prev => {
        const updated = [searchNum, ...prev.filter((n: string) => n !== searchNum)].slice(0, 5);
        try { localStorage.setItem("trackingHistory", JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const completedTypes = new Set(result?.events.map(e => e.event_type) || []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0EB]">
      {/* Header */}
      <div className="border-b border-[#1A1A1A]">
        <div className="max-w-[700px] mx-auto px-6 py-16">
          <h1 className="text-3xl font-light tracking-[0.05em] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t("trackingPageTitle")}
          </h1>
          <p className="text-sm text-[#8A8580] mb-8">
            {t("shippingServiceDDP")}
          </p>

          {/* Search */}
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={t("trackingEnterNumber")}
              className="flex-1 bg-[#111] border border-[#1A1A1A] px-4 py-3 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:border-[#333] transition-colors"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !trackingNumber.trim()}
              className="px-6 py-3 border border-[#F5F0EB] text-sm tracking-wider uppercase transition-colors hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] disabled:opacity-30"
            >
              {loading ? "..." : t("trackingSearch")}
            </button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && !result && (
            <div className="mt-6">
              <p className="text-xs text-[#8A8580] tracking-wider uppercase mb-2">{t("trackingHistory")}</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map(num => (
                  <button
                    key={num}
                    onClick={() => { setTrackingNumber(num); handleSearch(num); }}
                    className="text-xs px-3 py-1.5 border border-[#1A1A1A] text-[#8A8580] hover:border-[#333] hover:text-[#F5F0EB] transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {notFound && (
        <div className="max-w-[700px] mx-auto px-6 py-16 text-center">
          <p className="text-[#8A8580]">{t("trackingNoResult")}</p>
        </div>
      )}

      {result && (
        <div className="max-w-[700px] mx-auto px-6 py-12">
          {/* Order overview card */}
          <div className="border border-[#1A1A1A] p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#8A8580] tracking-wider uppercase mb-1">
                  {t("trackingNumber")}
                </p>
                <p className="text-lg font-mono">{result.tracking_number}</p>
              </div>
              {result.carrier && (
                <p className="text-sm text-[#8A8580]">{result.carrier}</p>
              )}
            </div>

            {result.estimated_delivery && (
              <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                <p className="text-xs text-[#8A8580] tracking-wider uppercase mb-1">
                  {t("shippingEstDelivery")}
                </p>
                <p className="text-sm">{new Date(result.estimated_delivery).toLocaleDateString()}</p>
              </div>
            )}

            {/* DDP banner */}
            <div className="mt-4 p-3 bg-[#111] border border-[#1A1A1A] text-xs text-[#8A8580] flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{t("shippingDDPNotice")}</span>
            </div>

            {/* Exception alert */}
            {result.exception && (
              <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 text-xs text-red-400 flex items-center justify-between">
                <span>{result.exception.message}</span>
                <Link href="/account" className="underline hover:text-red-300">
                  {t("shippingContactSupport")}
                </Link>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {PHASE_ORDER.map((eventType, idx) => {
              const event = result.events.find(e => e.event_type === eventType);
              const isCompleted = completedTypes.has(eventType);
              const isCurrent = event?.is_current || false;
              const isException = event?.is_exception || false;

              // Skip future nodes that are far beyond the current stage
              // Show completed + current + next 2 upcoming
              const currentIdx = PHASE_ORDER.findIndex(p => result.events.some(e => e.event_type === p && e.is_current));
              if (!isCompleted && !isCurrent && !isException && idx > currentIdx + 3) return null;
              if (currentIdx === -1 && !isCompleted && !isException) return null;

              const { icon, color } = getEventIcon(eventType, isCompleted, isCurrent, isException);

              return (
                <div key={eventType} className="flex gap-4">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${color}`}>
                      {icon}
                    </div>
                    {idx < PHASE_ORDER.length - 1 && (
                      <div className={`w-px flex-1 min-h-[40px] ${isCompleted ? "bg-green-600/40" : "bg-[#1A1A1A]"}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6 flex-1">
                    <p className={`text-sm ${isCurrent ? "text-[#F5F0EB] font-medium" : isCompleted ? "text-[#F5F0EB]/80" : "text-[#8A8580]/50"}`}>
                      {event ? (event.event_title || (EVENT_TYPE_TO_I18N_KEY[eventType] ? t(EVENT_TYPE_TO_I18N_KEY[eventType] as Parameters<typeof t>[0]) : eventType)) : (EVENT_TYPE_TO_I18N_KEY[eventType] ? t(EVENT_TYPE_TO_I18N_KEY[eventType] as Parameters<typeof t>[0]) : eventType)}
                    </p>
                    {event?.location && (
                      <p className="text-xs text-[#8A8580] mt-0.5">{event.location}</p>
                    )}
                    {event?.event_time && (
                      <p className="text-[10px] text-[#8A8580]/60 mt-0.5">
                        {new Date(event.event_time).toLocaleString()}
                      </p>
                    )}
                    {event?.flight_vessel && (
                      <p className="text-xs text-[#8A8580] mt-1">{event.flight_vessel}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exception events */}
          {result.events.filter(e => EXCEPTION_TYPES.includes(e.event_type)).map(event => {
            const { icon, color } = getEventIcon(event.event_type, false, false, true);
            return (
              <div key={event.id} className="flex gap-4 mt-2">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${color}`}>
                    {icon}
                  </div>
                </div>
                <div className="pb-4">
                  <p className="text-sm text-red-400">{event.event_title}</p>
                  {event.event_description && (
                    <p className="text-xs text-red-400/70 mt-0.5">{event.event_description}</p>
                  )}
                  {event.location && (
                    <p className="text-xs text-[#8A8580] mt-0.5">{event.location}</p>
                  )}
                  <p className="text-[10px] text-[#8A8580]/60 mt-0.5">
                    {new Date(event.event_time).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Route diagram */}
          <div className="mt-8 pt-8 border-t border-[#1A1A1A]">
            <p className="text-xs text-[#8A8580] tracking-wider uppercase mb-4">{t("shippingRouteDiagram")}</p>
            <div className="flex items-center justify-between">
              {[
                { label: t("shippingRouteChina"), phase: "domestic" },
                { label: t("shippingRouteTransit"), phase: "international" },
                { label: t("shippingRouteDestination"), phase: "customs" },
                { label: t("shippingRouteDelivery"), phase: "delivery" },
              ].map((step, i) => {
                const isActive = (() => {
                  const current = result.events.find(e => e.is_current);
                  if (!current) return false;
                  const phases: Record<string, string[]> = {
                    domestic: ["pre_shipping", "packed", "picked_up", "warehouse_received", "warehouse_dispatched"],
                    international: ["export_declared", "export_cleared", "in_transit_intl", "transit_hub"],
                    customs: ["arrived_dest", "import_declared", "tax_paid", "import_cleared"],
                    delivery: ["local_sorting", "local_dispatched", "out_for_delivery", "delivered"],
                  };
                  return phases[step.phase]?.includes(current.event_type) || false;
                })();

                return (
                  <div key={step.phase} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${isActive ? "bg-blue-500" : "bg-[#333]"}`} />
                      <span className={`text-[10px] mt-1 ${isActive ? "text-[#F5F0EB]" : "text-[#8A8580]/50"}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < 3 && <div className="w-8 h-px bg-[#1A1A1A] -mt-3" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="max-w-[700px] mx-auto px-6 pb-16">
        <Link href="/" className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors tracking-wider uppercase">
          ← Fuzz Sofa
        </Link>
      </div>
    </div>
  );
}
