"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
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
  status: string;
  description: string | null;
  location: string | null;
  happened_at: string;
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
  created_at: string;
  items: OrderItem[];
  shipping_events: ShippingEvent[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const statusLabel = (s: string): string => {
  const m: Record<string, string> = {
    pending: "Pending Payment",
    confirmed: "In Production",
    processing: "Packing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return m[s] || s;
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

/* ------------------------------------------------------------------ */
/*  Status Timeline Component                                          */
/* ------------------------------------------------------------------ */

function StatusTimeline({ status, createdAt }: { status: string; createdAt: string }) {
  const steps = [
    { key: "pending", label: "Order Placed", desc: "Waiting for payment" },
    { key: "confirmed", label: "In Production", desc: "Being crafted at Fuzz Studio (~2 days)" },
    { key: "processing", label: "Packing", desc: "Quality check & packaging" },
    { key: "shipped", label: "Shipped", desc: "On the way to you" },
    { key: "delivered", label: "Delivered", desc: "Signed and received" },
  ];

  const currentIdx = steps.findIndex(s => s.key === status);
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isCompleted = !isCancelled && i < currentIdx;
        const isCurrent = !isCancelled && i === currentIdx;
        const isFuture = !isCancelled && i > currentIdx;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Dot + Line */}
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
            {/* Content */}
            <div className="pb-6">
              <p className={`text-sm ${isCompleted || isCurrent ? "text-[#F5F0EB]" : "text-[#333]"}`}>
                {step.label}
              </p>
              <p className={`text-xs mt-0.5 ${isCurrent ? "text-[#E8B4B8]" : "text-[#8A8580]"}`}>
                {isCancelled ? "—" : step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
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
        } catch { /* not logged in */ }

        const headers: Record<string, string> = {};
        if (sessionToken) headers["x-session"] = sessionToken;

        const res = await fetch(`/api/orders/${orderId}`, { headers });
        if (res.ok) { const data = await res.json(); setOrder(data); }
      } catch (err) { console.error("Failed to fetch order:", err); }
      finally { setLoading(false); }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCopyTracking = async () => {
    if (!order?.tracking_number) return;
    try {
      await navigator.clipboard.writeText(order.tracking_number);
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
        <Link href="/account" className="text-[#E8B4B8] hover:underline text-sm">Back to My Orders</Link>
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
        Back to My Orders
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-2xl text-[#F5F0EB] tracking-wide">Order Details</h1>
          <p className="text-sm text-[#8A8580] mt-1">{order.order_number} · {formatDate(order.created_at)}</p>
        </div>
        <span className={`text-sm uppercase tracking-wider ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Pending Payment: Pay Now or Delete */}
          {order.payment_status === "pending" && order.status !== "cancelled" && (
            <section className="bg-[#111111] border border-yellow-500/30 p-5">
              <p className="text-yellow-400 text-sm mb-4">This order is awaiting payment</p>
              <div className="flex gap-3">
                <button
                  onClick={handlePayOrder}
                  className="px-5 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
                >
                  PAY NOW
                </button>
                <Link
                  href="/account"
                  className="px-5 py-2 text-xs tracking-wider uppercase border border-[#333] text-[#8A8580] hover:text-[#F5F0EB] hover:border-[#F5F0EB] transition-all"
                >
                  BACK TO ORDERS
                </Link>
              </div>
            </section>
          )}

          {/* In Production message */}
          {order.status === "confirmed" && (
            <section className="bg-[#111111] border border-[#E8B4B8]/30 p-5">
              <p className="text-[#E8B4B8] text-sm">
                Your order has entered the Fuzz Studio for crafting. Each piece is carefully handmade — estimated completion time is approximately 2 days. Once finished, it will be packed and shipped.
              </p>
            </section>
          )}

          {/* Status Timeline */}
          <section>
            <h2 className="font-serif text-lg text-[#F5F0EB] mb-6">Order Progress</h2>
            <StatusTimeline status={order.status} createdAt={order.created_at} />
          </section>

          {/* Shipping Tracking (only for shipped orders) */}
          {order.status === "shipped" && order.shipping_events && order.shipping_events.length > 0 && (
            <section>
              <h2 className="font-serif text-lg text-[#F5F0EB] mb-6">Shipping Tracking</h2>
              <div className="relative pl-6 border-l border-[#1A1A1A] space-y-6">
                {order.shipping_events.map((evt, i) => (
                  <div key={evt.id} className="relative">
                    <div className={`absolute -left-[1.55rem] top-1 w-2.5 h-2.5 rounded-full ${
                      i === 0 ? "bg-[#E8B4B8]" : "bg-[#333]"
                    }`} />
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
            <h2 className="font-serif text-lg text-[#F5F0EB] mb-4">Items</h2>
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
                      {item.color_name || "Default"} × {item.quantity}
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
          {/* Tracking Number (shipped/delivered only) */}
          {order.tracking_number && (order.status === "shipped" || order.status === "delivered") && (
            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">Tracking Number</h3>
              <div className="flex items-center gap-2">
                <span className="text-[#F5F0EB] font-mono text-sm">{order.tracking_number}</span>
                <button
                  onClick={handleCopyTracking}
                  className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors shrink-0"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {order.carrier && <p className="text-xs text-[#8A8580] mt-2">Carrier: {order.carrier}</p>}
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-[#111111] border border-[#1A1A1A] p-5">
            <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8A8580]">Subtotal</span>
                <span className="text-[#F5F0EB]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8580]">Shipping</span>
                <span className="text-[#F5F0EB]">{order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="border-t border-[#1A1A1A] pt-2 flex justify-between">
                <span className="text-[#F5F0EB]">Total</span>
                <span className="text-[#E8B4B8]">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8580]">Payment</span>
                <span className="text-[#F5F0EB]">{order.payment_status === "paid" ? "Paid" : "Unpaid"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#111111] border border-[#1A1A1A] p-5">
            <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">Shipping Address</h3>
            <p className="text-[#F5F0EB] text-sm">{order.first_name} {order.last_name}</p>
            <p className="text-[#F5F0EB] text-sm">{order.email}</p>
            {order.phone && <p className="text-[#8A8580] text-sm">{order.phone}</p>}
            <p className="text-[#8A8580] text-sm">
              {order.address_line}{order.address_line2 ? `, ${order.address_line2}` : ""}<br />
              {order.city}, {order.state || ""} {order.zip_code || ""}<br />
              {order.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
