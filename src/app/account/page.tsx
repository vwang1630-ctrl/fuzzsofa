"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total: number;
  shipping_fee: number;
  subtotal: number;
  created_at: string;
  items: OrderItem[];
}

interface Address {
  id: string;
  label: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  is_default: boolean;
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

const paymentStatusLabel = (s: string) => {
  const m: Record<string, string> = {
    pending: "Unpaid",
    pending_payment: "Awaiting Transfer",
    paid: "Paid",
    refunded: "Refunded",
    failed: "Failed",
  };
  return m[s] || s;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type Tab = "orders" | "addresses" | "payment";

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(false);

  // Auth
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Get session
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

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (!sessionToken) { setLoadingOrders(false); return; }
      try {
        const res = await fetch("/api/orders", { headers: authHeaders() });
        if (res.ok) { const data = await res.json(); setOrders(data.orders || data || []); }
      } catch (err) { console.error("Failed to fetch orders:", err); }
      finally { setLoadingOrders(false); }
    }
    fetchOrders();
  }, [sessionToken, authHeaders]);

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (!sessionToken || tab !== "addresses") return;
      setLoadingAddr(true);
      try {
        const res = await fetch("/api/addresses", { headers: authHeaders() });
        if (res.ok) { const data = await res.json(); setAddresses(data.addresses || data || []); }
      } catch (err) { console.error("Failed to fetch addresses:", err); }
      finally { setLoadingAddr(false); }
    }
    fetchAddresses();
  }, [sessionToken, tab, authHeaders]);

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeleting(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSelectedOrders(prev => { const n = new Set(prev); n.delete(orderId); return n; });
      }
    } catch (err) { console.error("Delete failed:", err); }
    finally { setDeleting(null); }
  };

  // Pay single order
  const handlePayOrder = (order: Order) => {
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

  // Batch pay selected orders
  const handleBatchPay = () => {
    const selected = orders.filter(o => selectedOrders.has(o.id) && o.payment_status === "pending");
    if (selected.length === 0) return;
    const total = selected.reduce((s, o) => s + o.total, 0);
    const subtotal = selected.reduce((s, o) => s + o.subtotal, 0);
    const shippingFee = selected.reduce((s, o) => s + o.shipping_fee, 0);
    const items = selected.flatMap(o => o.items.map(it => ({
      productSlug: it.product_slug,
      productName: it.product_name,
      colorName: it.color_name,
      colorHex: it.color_hex,
      quantity: it.quantity,
      unitPrice: it.unit_price,
      subtotal: it.subtotal,
      imageUrl: it.image_url,
    })));
    const payData = {
      orderIds: selected.map(o => o.id),
      items,
      total,
      subtotal,
      shippingFee,
    };
    sessionStorage.setItem("payExistingOrders", JSON.stringify(payData));
    router.push("/payment");
  };

  // Toggle order selection
  const toggleOrder = (id: string) => {
    setSelectedOrders(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // Filter orders
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const pendingOrders = orders.filter(o => o.payment_status === "pending");
  const hasSelectedPending = orders.filter(o => selectedOrders.has(o.id) && o.payment_status === "pending").length > 0;

  if (!mounted) return null;

  /* ---- Not logged in ---- */
  if (!sessionToken && !loadingOrders) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#8A8580]">Please log in to view your account</p>
        <Link href="/login" className="px-6 py-2 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-wider hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all">
          LOG IN
        </Link>
      </div>
    );
  }

  /* ---- Main layout ---- */
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl text-[#F5F0EB] tracking-wide mb-10">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#1A1A1A] mb-10">
        {(["orders", "addresses", "payment"] as Tab[]).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`pb-3 text-sm tracking-[0.1em] uppercase transition-colors ${
              tab === tabKey
                ? "text-[#F5F0EB] border-b-2 border-[#E8B4B8]"
                : "text-[#8A8580] hover:text-[#F5F0EB]"
            }`}
          >
            {tabKey === "orders" ? "My Orders" : tabKey === "addresses" ? "My Addresses" : "Payment Settings"}
          </button>
        ))}
      </div>

      {/* ==================== ORDERS TAB ==================== */}
      {tab === "orders" && (
        <div>
          {/* Filters + Batch Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 text-xs tracking-wider uppercase border transition-all ${
                    statusFilter === s
                      ? "border-[#E8B4B8] text-[#E8B4B8]"
                      : "border-[#1A1A1A] text-[#8A8580] hover:border-[#333]"
                  }`}
                >
                  {s === "all" ? "All" : statusLabel(s)}
                </button>
              ))}
            </div>
            {hasSelectedPending && (
              <button
                onClick={handleBatchPay}
                className="px-4 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
              >
                PAY SELECTED ({orders.filter(o => selectedOrders.has(o.id) && o.payment_status === "pending").length})
              </button>
            )}
          </div>

          {/* Orders List */}
          {loadingOrders ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-[#8A8580]">No orders found</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-[#111111] border border-[#1A1A1A] hover:border-[#333] transition-all"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
                    <div className="flex items-center gap-4">
                      {order.payment_status === "pending" && (
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrder(order.id)}
                          className="w-4 h-4 accent-[#E8B4B8]"
                        />
                      )}
                      <div>
                        <Link href={`/orders/${order.id}`} className="text-[#F5F0EB] text-sm hover:text-[#E8B4B8] transition-colors">
                          {order.order_number}
                        </Link>
                        <p className="text-xs text-[#8A8580] mt-1">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs tracking-wider uppercase ${statusColor(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                      {order.payment_status === "pending" && order.status !== "cancelled" && (
                        <span className="text-xs text-yellow-500">
                          {paymentStatusLabel(order.payment_status)}
                        </span>
                      )}
                      <span className="text-[#F5F0EB] text-sm">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="w-12 h-12 bg-[#1A1A1A] flex-shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#333] text-xs">
                              {item.product_name.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-[#8A8580]">+{order.items.length - 3} more</span>
                      )}
                      <span className="text-xs text-[#8A8580] ml-auto">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions for pending orders */}
                  {order.payment_status === "pending" && order.status !== "cancelled" && (
                    <div className="flex items-center gap-3 px-5 py-3 border-t border-[#1A1A1A]">
                      <button
                        onClick={() => handlePayOrder(order)}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
                      >
                        PAY NOW
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deleting === order.id}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#333] text-[#8A8580] hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50"
                      >
                        {deleting === order.id ? "DELETING..." : "DELETE"}
                      </button>
                    </div>
                  )}

                  {/* Status info for production orders */}
                  {order.status === "confirmed" && (
                    <div className="px-5 py-3 border-t border-[#1A1A1A]">
                      <p className="text-xs text-[#E8B4B8]">
                        Your order has entered the Fuzz Studio for crafting. Estimated completion: ~2 days.
                      </p>
                    </div>
                  )}

                  {/* Status info for shipped orders */}
                  {order.status === "shipped" && (
                    <div className="px-5 py-3 border-t border-[#1A1A1A]">
                      <Link href={`/orders/${order.id}`} className="text-xs text-[#E8B4B8] hover:underline">
                        View tracking information →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== ADDRESSES TAB ==================== */}
      {tab === "addresses" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-[#F5F0EB]">My Addresses</h2>
            <button
              onClick={() => {/* TODO: add address modal */}}
              className="px-4 py-2 text-xs tracking-wider uppercase border border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all"
            >
              ADD ADDRESS
            </button>
          </div>

          {loadingAddr ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-[#8A8580] text-center py-10">No saved addresses</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="bg-[#111111] border border-[#1A1A1A] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-wider uppercase text-[#8A8580]">{addr.label}</span>
                    {addr.is_default && (
                      <span className="text-xs text-[#E8B4B8]">Default</span>
                    )}
                  </div>
                  <p className="text-[#F5F0EB] text-sm">{addr.first_name} {addr.last_name}</p>
                  <p className="text-[#8A8580] text-sm mt-1">
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}<br />
                    {addr.city}, {addr.state || ""} {addr.zip_code || ""}<br />
                    {addr.country}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Edit</button>
                    <button className="text-xs text-[#8A8580] hover:text-red-400 transition-colors">Delete</button>
                    {!addr.is_default && (
                      <button className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">Set Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== PAYMENT TAB ==================== */}
      {tab === "payment" && (
        <div>
          <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">Payment Settings</h2>
          <div className="bg-[#111111] border border-[#1A1A1A] p-6">
            <p className="text-[#8A8580] text-sm">
              Payment methods are saved securely during checkout. Your default payment method will be pre-selected for future orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
