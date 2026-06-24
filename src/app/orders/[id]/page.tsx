"use client";

import { useEffect, useState } from "react";
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
}

interface ShippingEvent {
  id: string;
  status: string;
  description: string | null;
  location: string | null;
  happened_at: string;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  shipping_method: string;
  shipping_fee: number;
  subtotal: number;
  total: number;
  currency: string;
  payment_method: string | null;
  payment_status: string;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string | null;
  address_line: string;
  zip_code: string | null;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  created_at: string;
  items: OrderItem[];
  shipping_events: ShippingEvent[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const statusColor = (status: string): string => {
  switch (status) {
    case "pending": return "text-[#8A8580]";
    case "processing": return "text-yellow-400";
    case "shipped": return "text-blue-400";
    case "delivered": return "text-[#E8B4B8]";
    case "cancelled": return "text-red-400";
    default: return "text-[#8A8580]";
  }
};

const statusKey = (status: string): TranslationKeys => {
  const map: Record<string, TranslationKeys> = {
    pending: "orderStatusPending",
    processing: "orderStatusProcessing",
    shipped: "orderStatusShipped",
    delivered: "orderStatusDelivered",
    cancelled: "orderStatusCancelled",
  };
  return map[status] || "orderStatusPending";
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    async function fetchOrder() {
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

        const res = await fetch(`/api/orders/${orderId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCopyTracking = async () => {
    if (!order?.tracking_number) return;
    try {
      await navigator.clipboard.writeText(order.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

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
        <p className="text-[#8A8580]">Order not found</p>
        <Link href="/account" className="text-[#E8B4B8] hover:underline text-sm">
          {t("orderDetailBackToOrders")}
        </Link>
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
        {t("orderDetailBackToOrders")}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-2xl text-[#F5F0EB] tracking-wide">{t("accountMyOrders")}</h1>
          <p className="text-sm text-[#8A8580] mt-1">
            {t("accountOrderNumber")}: {order.order_number}
          </p>
        </div>
        <span className={`text-sm uppercase tracking-wider ${statusColor(order.status)}`}>
          {t(statusKey(order.status))}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Shipping Timeline */}
          {order.shipping_events && order.shipping_events.length > 0 && (
            <section>
              <h2 className="font-serif text-lg text-[#F5F0EB] mb-6">{t("orderDetailTracking")}</h2>
              <div className="relative pl-6 border-l border-[#1A1A1A] space-y-6">
                {order.shipping_events.map((evt, i) => (
                  <div key={evt.id} className="relative">
                    <div
                      className={`absolute -left-[1.55rem] top-1 w-2.5 h-2.5 rounded-full ${
                        i === 0 ? "bg-[#E8B4B8]" : "bg-[#333]"
                      }`}
                    />
                    <p className="text-sm text-[#F5F0EB]">{evt.description || evt.status}</p>
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
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#111111] border border-[#1A1A1A] p-4"
                >
                  <div>
                    <p className="text-[#F5F0EB] text-sm">{item.product_name}</p>
                    <p className="text-xs text-[#8A8580]">
                      {item.color_name || "Default"} x{item.quantity}
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
          {/* Tracking Info */}
          {order.tracking_number && (
            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">
                {t("orderDetailTrackingNumber")}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[#F5F0EB] font-mono text-sm">{order.tracking_number}</span>
                <button
                  onClick={handleCopyTracking}
                  className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors shrink-0"
                >
                  {copied ? t("orderDetailCopied") : t("orderDetailCopy")}
                </button>
              </div>
              {order.carrier && <p className="text-xs text-[#8A8580] mt-2">{order.carrier}</p>}
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
                <span className="text-[#F5F0EB]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8580]">{t("orderDetailShippingFee")}</span>
                <span className="text-[#F5F0EB]">
                  {order.shipping_fee === 0 ? (t("free") || "Free") : formatPrice(order.shipping_fee)}
                </span>
              </div>
              <div className="border-t border-[#1A1A1A] pt-2 flex justify-between">
                <span className="text-[#F5F0EB]">{t("orderDetailTotal")}</span>
                <span className="text-[#E8B4B8]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#111111] border border-[#1A1A1A] p-5">
            <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">
              {t("orderDetailShippingAddress")}
            </h3>
            <p className="text-[#F5F0EB] text-sm">{order.recipient_name}</p>
            <p className="text-[#F5F0EB] text-sm">{order.phone}</p>
            <p className="text-[#8A8580] text-sm">
              {order.province} {order.city} {order.district || ""} {order.address_line}
            </p>
            {order.zip_code && <p className="text-[#8A8580] text-sm">{order.zip_code}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
