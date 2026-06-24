"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface ShippingEvent {
  status: string;
  description: string;
  location?: string;
  happened_at: string;
}

interface OrderItem {
  productSlug: string;
  productName: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  currency: string;
  paymentMethod: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items: OrderItem[];
  shippingEvents: ShippingEvent[];
}

type TabKey = "all" | "pending" | "processing" | "shipped" | "delivered";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusLabel = (status: OrderStatus): TranslationKeys => {
  const map: Record<OrderStatus, TranslationKeys> = {
    pending: "orderStatusPending",
    processing: "orderStatusProcessing",
    shipped: "orderStatusShipped",
    delivered: "orderStatusDelivered",
    cancelled: "orderStatusCancelled",
  };
  return map[status];
};

const statusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending": return "text-[#8A8580]";
    case "processing": return "text-yellow-400";
    case "shipped": return "text-blue-400";
    case "delivered": return "text-[#E8B4B8]";
    case "cancelled": return "text-red-400";
    default: return "text-[#8A8580]";
  }
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AccountPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      let sessionToken: string | null = null;
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        sessionToken = session?.access_token ?? null;
      } catch {
        // Not logged in
      }

      const headers: Record<string, string> = {};
      if (sessionToken) headers["x-session"] = sessionToken;

      const res = await fetch("/api/orders", { headers });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: t("accountAll") },
    { key: "pending", label: t("orderStatusPending") },
    { key: "processing", label: t("orderStatusProcessing") },
    { key: "shipped", label: t("orderStatusShipped") },
    { key: "delivered", label: t("orderStatusDelivered") },
  ];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  /* ---- Order Detail View ---- */
  if (selectedOrder) {
    const o = selectedOrder;
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t("orderDetailBackToOrders")}
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-2xl text-[#F5F0EB] tracking-wide">{t("accountMyOrders")}</h1>
            <p className="text-sm text-[#8A8580] mt-1">
              {t("accountOrderNumber")}: {o.orderNumber}
            </p>
          </div>
          <span className={`text-sm uppercase tracking-wider ${statusColor(o.status)}`}>
            {t(statusLabel(o.status))}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Left - Timeline + Items */}
          <div className="space-y-10">
            {/* Shipping Timeline */}
            {o.shippingEvents && o.shippingEvents.length > 0 && (
              <section>
                <h2 className="font-serif text-lg text-[#F5F0EB] mb-6">{t("orderDetailTracking")}</h2>
                <div className="relative pl-6 border-l border-[#1A1A1A] space-y-6">
                  {o.shippingEvents.map((evt, i) => (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-[1.55rem] top-1 w-2.5 h-2.5 rounded-full ${
                          i === 0 ? "bg-[#E8B4B8]" : "bg-[#333]"
                        }`}
                      />
                      <p className="text-sm text-[#F5F0EB]">{evt.description}</p>
                      <p className="text-xs text-[#8A8580] mt-1">
                        {formatDate(evt.happened_at)}
                        {evt.location ? ` · ${evt.location}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Order Items */}
            <section>
              <h2 className="font-serif text-lg text-[#F5F0EB] mb-4">{t("orderDetailItems")}</h2>
              <div className="space-y-3">
                {o.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111111] border border-[#1A1A1A] p-4">
                    <div>
                      <p className="text-[#F5F0EB] text-sm">{item.productName}</p>
                      <p className="text-xs text-[#8A8580]">
                        {item.colorName} x{item.quantity}
                      </p>
                    </div>
                    <p className="text-[#F5F0EB] text-sm">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right - Summary */}
          <div className="space-y-6">
            {/* Tracking Info */}
            {o.trackingNumber && (
              <div className="bg-[#111111] border border-[#1A1A1A] p-5">
                <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">
                  {t("orderDetailTrackingNumber")}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#F5F0EB] font-mono text-sm">{o.trackingNumber}</span>
                  <button
                    onClick={() => handleCopy(o.trackingNumber!)}
                    className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors shrink-0"
                  >
                    {copied ? t("orderDetailCopied") : t("orderDetailCopy")}
                  </button>
                </div>
                {o.carrier && (
                  <p className="text-xs text-[#8A8580] mt-2">{o.carrier}</p>
                )}
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-4">
                {t("orderDetailSummary")}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("orderDetailSubtotal")}</span>
                  <span className="text-[#F5F0EB]">{formatPrice(o.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8580]">{t("orderDetailShippingFee")}</span>
                  <span className="text-[#F5F0EB]">
                    {o.shippingFee === 0 ? (t("free") || "Free") : formatPrice(o.shippingFee)}
                  </span>
                </div>
                <div className="border-t border-[#1A1A1A] pt-2 flex justify-between">
                  <span className="text-[#F5F0EB]">{t("orderDetailTotal")}</span>
                  <span className="text-[#E8B4B8]">{formatPrice(o.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">
                {t("orderDetailShippingAddress")}
              </h3>
              <p className="text-[#F5F0EB] text-sm">{o.recipientName}</p>
              <p className="text-[#F5F0EB] text-sm">{o.phone}</p>
              <p className="text-[#8A8580] text-sm">
                {o.province} {o.city} {o.district} {o.addressLine}
              </p>
              {o.zipCode && <p className="text-[#8A8580] text-sm">{o.zipCode}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Order List View ---- */
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10 tracking-wide">
        {t("accountTitle")}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto border-b border-[#1A1A1A]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.key
                ? "border-[#E8B4B8] text-[#E8B4B8]"
                : "border-transparent text-[#8A8580] hover:text-[#F5F0EB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8A8580] mb-6">{t("accountNoOrders")}</p>
          <Link
            href="/animal-sofa-collection"
            className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            {t("cartContinueShopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left bg-[#111111] border border-[#1A1A1A] p-6 hover:border-[#333] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#F5F0EB] font-mono">{order.orderNumber}</span>
                  <span className={`text-xs uppercase tracking-wider ${statusColor(order.status)}`}>
                    {t(statusLabel(order.status))}
                  </span>
                </div>
                <span className="text-sm text-[#8A8580]">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8580]">
                  {order.items.length} {t("cartItems")}
                </span>
                <span className="text-[#F5F0EB]">{formatPrice(order.total)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
