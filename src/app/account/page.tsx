"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice, getProduct, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
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
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery: string | null;
  latest_shipping_event: string | null;
  shipping_method: string | null;
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
    pending: "text-[#8A8580] border-[#8A8580]/30 bg-[#8A8580]/10",
    confirmed: "text-[#E8B4B8] border-[#E8B4B8]/30 bg-[#E8B4B8]/10",
    processing: "text-[#E8B4B8] border-[#E8B4B8]/30 bg-[#E8B4B8]/10",
    shipped: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    delivered: "text-green-400 border-green-400/30 bg-green-400/10",
    cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
  };
  return m[s] || "text-[#8A8580] border-[#8A8580]/30 bg-[#8A8580]/10";
};

const paymentStatusLabel = (s: string, t: (key: TranslationKeys) => string): string => {
  const m: Record<string, TranslationKeys> = {
    pending: "orderPaymentUnpaid",
    pending_payment: "orderPaymentAwaitingTransfer",
    paid: "orderPaymentPaid",
    refunded: "orderPaymentRefunded",
    failed: "orderPaymentFailed",
  };
  return m[s] ? t(m[s]) : s;
};

/* Logistics badge: maps latest_shipping_event → color + label key */
const logisticsBadge = (event: string | null, t: (key: TranslationKeys) => string) => {
  if (!event) return null;
  const map: Record<string, { color: string; key: TranslationKeys }> = {
    shippingPreShipping:       { color: "bg-[#333] text-[#8A8580]",   key: "shippingStatusBadgePreShipping" },
    shippingPacked:            { color: "bg-[#333] text-[#8A8580]",   key: "shippingStatusBadgePreShipping" },
    shippingPickedUp:          { color: "bg-[#333] text-[#8A8580]",   key: "shippingStatusBadgeDomestic" },
    shippingWarehouseReceived: { color: "bg-[#333] text-[#8A8580]",   key: "shippingStatusBadgeDomestic" },
    shippingWarehouseDispatched:{ color: "bg-[#333] text-[#8A8580]",  key: "shippingStatusBadgeDomestic" },
    shippingExportDeclared:    { color: "bg-[#333] text-[#8A8580]",   key: "shippingStatusBadgeDomestic" },
    shippingExportCleared:     { color: "bg-[#2563eb]/20 text-blue-400", key: "shippingStatusBadgeInternational" },
    shippingInTransitIntl:     { color: "bg-[#2563eb]/20 text-blue-400", key: "shippingStatusBadgeInternational" },
    shippingTransitHub:        { color: "bg-[#2563eb]/20 text-blue-400", key: "shippingStatusBadgeInternational" },
    shippingArrivedDest:       { color: "bg-orange-500/20 text-orange-400", key: "shippingStatusBadgeCustoms" },
    shippingImportDeclared:    { color: "bg-orange-500/20 text-orange-400", key: "shippingStatusBadgeCustoms" },
    shippingTaxPaid:           { color: "bg-orange-500/20 text-orange-400", key: "shippingStatusBadgeCustoms" },
    shippingImportCleared:     { color: "bg-green-500/20 text-green-400", key: "shippingStatusBadgeLocalDelivery" },
    shippingLocalSorting:      { color: "bg-green-500/20 text-green-400", key: "shippingStatusBadgeLocalDelivery" },
    shippingLocalDispatched:   { color: "bg-green-500/20 text-green-400", key: "shippingStatusBadgeLocalDelivery" },
    shippingOutForDelivery:    { color: "bg-green-500/20 text-green-400", key: "shippingStatusBadgeLocalDelivery" },
    shippingDelivered:         { color: "bg-green-500/20 text-green-400", key: "shippingStatusBadgeDelivered" },
    shippingCustomsHold:       { color: "bg-red-500/20 text-red-400", key: "shippingStatusBadgeException" },
    shippingDelay:             { color: "bg-red-500/20 text-red-400", key: "shippingStatusBadgeException" },
    shippingDeliveryFailed:    { color: "bg-red-500/20 text-red-400", key: "shippingStatusBadgeException" },
    shippingReturnToOrigin:    { color: "bg-red-500/20 text-red-400", key: "shippingStatusBadgeException" },
  };
  const badge = map[event];
  if (!badge) return null;
  return { color: badge.color, label: t(badge.key) };
};

const formatEDD = (d: string | null) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return null; }
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type Tab = "orders" | "addresses" | "payment" | "favorites";

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { region } = useCart();

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  /* ---- Tab-based order grouping ---- */
  type OrderTab = "all" | "pending" | "production" | "shipped" | "cancelled";
  const [orderTab, setOrderTab] = useState<OrderTab>("all");

  const orderTabs: { key: OrderTab; labelKey: TranslationKeys; statuses: string[] }[] = [
    { key: "all", labelKey: "accountAll", statuses: [] },
    { key: "pending", labelKey: "orderTabPending", statuses: ["pending"] },
    { key: "production", labelKey: "orderTabProduction", statuses: ["confirmed", "processing"] },
    { key: "shipped", labelKey: "orderTabShipped", statuses: ["shipped", "delivered"] },
    { key: "cancelled", labelKey: "orderTabCancelled", statuses: ["cancelled"] },
  ];

  const tabOrders = orderTab === "all"
    ? orders
    : orders.filter(o => {
        const tab = orderTabs.find(t => t.key === orderTab);
        return tab ? tab.statuses.includes(o.status) : false;
      });
  const [deleting, setDeleting] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<{ id: string; product_slug: string; created_at: string }[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);

  // Address modal
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });
  const [addrSaving, setAddrSaving] = useState(false);

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

  // Fetch favorites
  useEffect(() => {
    async function fetchFavorites() {
      if (!sessionToken || tab !== "favorites") return;
      setLoadingFavorites(true);
      try {
        const res = await fetch("/api/favorites", { headers: authHeaders() });
        if (res.ok) { const data = await res.json(); setFavorites(data.favorites || []); }
      } catch (err) { console.error("Failed to fetch favorites:", err); }
      finally { setLoadingFavorites(false); }
    }
    fetchFavorites();
  }, [sessionToken, tab, authHeaders]);

  // Remove favorite
  const handleRemoveFavorite = async (productSlug: string) => {
    setRemovingFavorite(productSlug);
    try {
      const res = await fetch(
        `/api/favorites?productSlug=${encodeURIComponent(productSlug)}`,
        { method: "DELETE", headers: authHeaders() }
      );
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.product_slug !== productSlug));
      }
    } catch (err) { console.error("Remove favorite failed:", err); }
    finally { setRemovingFavorite(null); }
  };

  // Open address modal for adding
  const openAddAddress = () => {
    setEditingAddr(null);
    setAddrForm({
      label: "Home",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: addresses.length === 0,
    });
    setShowAddrModal(true);
  };

  // Open address modal for editing
  const openEditAddress = (addr: Address) => {
    setEditingAddr(addr);
    setAddrForm({
      label: addr.label,
      firstName: addr.first_name,
      lastName: addr.last_name,
      email: addr.email || "",
      phone: addr.phone || "",
      country: addr.country,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state || "",
      zipCode: addr.zip_code || "",
      isDefault: addr.is_default,
    });
    setShowAddrModal(true);
  };

  // Save address (create or update)
  const handleSaveAddress = async () => {
    setAddrSaving(true);
    try {
      const payload = {
        label: addrForm.label,
        firstName: addrForm.firstName,
        lastName: addrForm.lastName,
        email: addrForm.email,
        phone: addrForm.phone,
        country: addrForm.country,
        addressLine1: addrForm.addressLine1,
        addressLine2: addrForm.addressLine2,
        city: addrForm.city,
        state: addrForm.state,
        zipCode: addrForm.zipCode,
        isDefault: addrForm.isDefault,
      };

      let res: Response;
      if (editingAddr) {
        res = await fetch(`/api/addresses/${editingAddr.id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/addresses", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowAddrModal(false);
        // Refresh addresses
        const addrRes = await fetch("/api/addresses", { headers: authHeaders() });
        if (addrRes.ok) {
          const data = await addrRes.json();
          setAddresses(data.addresses || []);
        }
      }
    } catch (err) { console.error("Save address failed:", err); }
    finally { setAddrSaving(false); }
  };

  // Delete address
  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm(t("addressDeleteConfirm"))) return;
    try {
      const res = await fetch(`/api/addresses/${addrId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== addrId));
      }
    } catch (err) { console.error("Delete address failed:", err); }
  };

  // Set default address
  const handleSetDefault = async (addrId: string) => {
    try {
      const res = await fetch(`/api/addresses/${addrId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        setAddresses(prev => prev.map(a => ({
          ...a,
          is_default: a.id === addrId,
        })));
      }
    } catch (err) { console.error("Set default failed:", err); }
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(t("accountDeleteConfirm"))) return;
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

  // Tab-filtered orders
  const tabFilteredOrders = orderTab === "pending"
    ? orders.filter(o => o.status === "pending")
    : orderTab === "production"
    ? orders.filter(o => o.status === "confirmed" || o.status === "processing")
    : orderTab === "shipped"
    ? orders.filter(o => o.status === "shipped" || o.status === "delivered")
    : orderTab === "cancelled"
    ? orders.filter(o => o.status === "cancelled" || o.payment_status === "failed")
    : orders;

  const hasSelectedPending = orders.filter(o => selectedOrders.has(o.id) && o.payment_status === "pending").length > 0;

  if (!mounted) return null;

  /* ---- Not logged in ---- */
  if (!sessionToken && !loadingOrders) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#8A8580]">{t("accountLoginRequired")}</p>
        <Link href="/login" className="px-6 py-2 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-wider hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  /* ---- Main layout ---- */
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl text-[#F5F0EB] tracking-wide mb-10">{t("accountTitle")}</h1>

      {/* Tabs */}
      <div className="flex gap-4 lg:gap-8 border-b border-[#1A1A1A] mb-10 overflow-x-auto scrollbar-hide">
        {(["orders", "addresses", "payment", "favorites"] as Tab[]).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`pb-3 text-xs lg:text-sm tracking-[0.1em] uppercase transition-colors whitespace-nowrap flex-shrink-0 ${
              tab === tabKey
                ? "text-[#F5F0EB] border-b-2 border-[#E8B4B8]"
                : "text-[#8A8580] hover:text-[#F5F0EB]"
            }`}
          >
            {tabKey === "orders" && <><span className="lg:hidden">{t("accountTabOrdersShort")}</span><span className="hidden lg:inline">{t("accountMyOrders")}</span></>}
            {tabKey === "addresses" && <><span className="lg:hidden">{t("accountTabAddressesShort")}</span><span className="hidden lg:inline">{t("accountMyAddresses")}</span></>}
            {tabKey === "payment" && <><span className="lg:hidden">{t("accountTabPaymentShort")}</span><span className="hidden lg:inline">{t("accountPaymentSettings")}</span></>}
            {tabKey === "favorites" && <><span className="lg:hidden">{t("accountTabFavoritesShort")}</span><span className="hidden lg:inline">{t("myFavorites")}</span></>}
          </button>
        ))}
      </div>

      {/* ==================== ORDERS TAB ==================== */}
      {tab === "orders" && (
        <div>
          {/* Order Sub-tabs */}
          <div className="flex gap-4 lg:gap-6 border-b border-[#1A1A1A] mb-6 overflow-x-auto scrollbar-hide">
            {([
              { key: "all" as OrderTab, label: <><span className="lg:hidden">{t("orderTabAllShort")}</span><span className="hidden lg:inline">{t("orderTabAll")}</span></>, count: orders.length },
              { key: "pending" as OrderTab, label: <><span className="lg:hidden">{t("orderTabPendingShort")}</span><span className="hidden lg:inline">{t("orderTabPending")}</span></>, count: orders.filter(o => o.status === "pending").length },
              { key: "production" as OrderTab, label: <><span className="lg:hidden">{t("orderTabProductionShort")}</span><span className="hidden lg:inline">{t("orderTabProduction")}</span></>, count: orders.filter(o => o.status === "confirmed" || o.status === "processing").length },
              { key: "shipped" as OrderTab, label: <><span className="lg:hidden">{t("orderTabShippedShort")}</span><span className="hidden lg:inline">{t("orderTabShipped")}</span></>, count: orders.filter(o => o.status === "shipped" || o.status === "delivered").length },
              { key: "cancelled" as OrderTab, label: <><span className="lg:hidden">{t("orderTabCancelledShort")}</span><span className="hidden lg:inline">{t("orderTabCancelled")}</span></>, count: orders.filter(o => o.status === "cancelled" || o.payment_status === "failed").length },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setOrderTab(tab.key)}
                className={`pb-3 text-xs lg:text-sm tracking-[0.1em] uppercase transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap flex-shrink-0 ${
                  orderTab === tab.key
                    ? "text-[#F5F0EB] border-b-2 border-[#E8B4B8]"
                    : "text-[#8A8580] hover:text-[#F5F0EB]"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[12px] px-1.5 py-0.5 rounded-full ${
                    orderTab === tab.key ? "bg-[#E8B4B8] text-[#0A0A0A]" : "bg-[#1A1A1A] text-[#8A8580]"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Batch Pay for pending */}
          {orderTab === "pending" && hasSelectedPending && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleBatchPay}
                className="px-4 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
              >
                {t("accountPaySelected")} ({orders.filter(o => selectedOrders.has(o.id) && o.payment_status === "pending").length})
              </button>
            </div>
          )}

          {/* Orders List */}
          {loadingOrders ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
            </div>
          ) : tabFilteredOrders.length === 0 ? (
            <div className="text-center py-20 text-[#8A8580]">{t("accountNoOrders")}</div>
          ) : (
            <div className="space-y-4">
              {tabFilteredOrders.map(order => (
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
                      <button
                        onClick={() => {
                          const statusToTab: Record<string, OrderTab> = {
                            pending: 'pending',
                            confirmed: 'production',
                            processing: 'production',
                            shipped: 'shipped',
                            delivered: 'shipped',
                            cancelled: 'cancelled',
                          };
                          const paymentFailedTab = order.payment_status === 'failed' ? 'cancelled' as OrderTab : null;
                          setOrderTab(paymentFailedTab || statusToTab[order.status] || 'all');
                        }}
                        className={`text-[12px] tracking-widest uppercase px-2.5 py-1 rounded hover:opacity-70 transition-opacity cursor-pointer border ${statusColor(order.status)}`}
                      >
                        {statusLabel(order.status, t)}
                      </button>
                      {/* Logistics badge - clickable to shipping tab */}
                      {(() => {
                        const badge = logisticsBadge(order.latest_shipping_event, t);
                        if (!badge) return null;
                        return (
                          <button
                            key="logistics-badge"
                            onClick={() => setOrderTab('shipped')}
                            className={`text-[12px] tracking-wider uppercase px-2 py-0.5 rounded hover:opacity-80 transition-opacity ${badge.color}`}
                          >
                            {badge.label}
                          </button>
                        );
                      })()}
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
                              {(item.product_name || "?").charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-[#8A8580]">{t("moreItems").replace("{n}", String(order.items.length - 3))}</span>
                      )}
                      <span className="text-xs text-[#8A8580] ml-auto">
                        {t("itemCount").replace("{n}", String(order.items.length))}
                      </span>
                    </div>
                    {/* Tracking number + EDD for shipped orders */}
                    {(order.tracking_number || order.estimated_delivery) && (
                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#1A1A1A]">
                        {order.tracking_number && (
                          <Link href={`/orders/${order.id}`} className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">
                            {t("trackingNumber")}: {order.tracking_number}
                          </Link>
                        )}
                        {order.estimated_delivery && formatEDD(order.estimated_delivery) && (
                          <span className="text-xs text-[#8A8580] ml-auto">
                            {t("shippingEstDelivery")}: {formatEDD(order.estimated_delivery)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions for pending orders */}
                  {order.status === "pending" && (
                    <div className="flex items-center gap-3 px-5 py-3 border-t border-[#1A1A1A]">
                      <button
                        onClick={() => handlePayOrder(order)}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all"
                      >
                        {t("accountPayNow")}
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deleting === order.id}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#333] text-[#8A8580] hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50"
                      >
                        {deleting === order.id ? t("accountDeleting") : t("accountDelete")}
                      </button>
                    </div>
                  )}

                  {/* Status info for production orders (confirmed + processing merged) */}
                  {(order.status === "confirmed" || order.status === "processing") && (
                    <div className="px-5 py-3 border-t border-[#1A1A1A]">
                      <p className="text-xs text-[#E8B4B8]">
                        {t("accountInProductionDesc")}
                      </p>
                    </div>
                  )}

                  {/* Status info for shipped/delivered orders */}
                  {(order.status === "shipped" || order.status === "delivered") && (
                    <div className="px-5 py-3 border-t border-[#1A1A1A]">
                      <Link href={`/orders/${order.id}`} className="text-xs text-[#E8B4B8] hover:underline">
                        {t("accountViewTrackingInfo")}
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
            <h2 className="font-serif text-xl text-[#F5F0EB]">{t("accountMyAddresses")}</h2>
            <button
              onClick={openAddAddress}
              className="px-4 py-2 text-xs tracking-wider uppercase border border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all"
            >
              {t("accountAddAddress")}
            </button>
          </div>

          {loadingAddr ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-[#8A8580] text-center py-10">{t("accountNoAddresses")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="bg-[#111111] border border-[#1A1A1A] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-wider uppercase text-[#8A8580]">{addr.label}</span>
                    {addr.is_default && (
                      <span className="text-xs text-[#E8B4B8]">{t("accountDefaultLabel")}</span>
                    )}
                  </div>
                  <p className="text-[#F5F0EB] text-sm">{addr.first_name} {addr.last_name}</p>
                  <p className="text-[#8A8580] text-sm mt-1">
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}<br />
                    {addr.city}, {addr.state || ""} {addr.zip_code || ""}<br />
                    {addr.country}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-[#8A8580] hover:text-red-400 transition-colors"
                    >
                      {t("remove")}
                    </button>
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
                      >
                        {t("accountSetDefault")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {showAddrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowAddrModal(false)}>
              <div
                className="bg-[#0A0A0A] border border-[#1A1A1A] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#F5F0EB] mb-6">
                    {editingAddr ? t("addressEditTitle") : t("addressAddTitle")}
                  </h3>

                  <div className="space-y-4">
                    {/* Label */}
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                        {t("addressLabel")}
                      </label>
                      <select
                        value={addrForm.label}
                        onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressFirstName")} <span className="text-[#E8B4B8]">*</span>
                        </label>
                        <input
                          type="text"
                          value={addrForm.firstName}
                          onChange={e => setAddrForm(p => ({ ...p, firstName: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressLastName")} <span className="text-[#E8B4B8]">*</span>
                        </label>
                        <input
                          type="text"
                          value={addrForm.lastName}
                          onChange={e => setAddrForm(p => ({ ...p, lastName: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressEmail")}
                        </label>
                        <input
                          type="email"
                          value={addrForm.email}
                          onChange={e => setAddrForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressPhone")}
                        </label>
                        <input
                          type="tel"
                          value={addrForm.phone}
                          onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                        {t("addressCountry")} <span className="text-[#E8B4B8]">*</span>
                      </label>
                      <input
                        type="text"
                        value={addrForm.country}
                        onChange={e => setAddrForm(p => ({ ...p, country: e.target.value }))}
                        placeholder="US, AE, GB, DE..."
                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors placeholder:text-[#8A8580]/40"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                        {t("addressLine1")} <span className="text-[#E8B4B8]">*</span>
                      </label>
                      <input
                        type="text"
                        value={addrForm.addressLine1}
                        onChange={e => setAddrForm(p => ({ ...p, addressLine1: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                        {t("addressLine2")}
                      </label>
                      <input
                        type="text"
                        value={addrForm.addressLine2}
                        onChange={e => setAddrForm(p => ({ ...p, addressLine2: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                      />
                    </div>

                    {/* City + State + Zip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressCity")} <span className="text-[#E8B4B8]">*</span>
                        </label>
                        <input
                          type="text"
                          value={addrForm.city}
                          onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressState")}
                        </label>
                        <input
                          type="text"
                          value={addrForm.state}
                          onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                          {t("addressZip")}
                        </label>
                        <input
                          type="text"
                          value={addrForm.zipCode}
                          onChange={e => setAddrForm(p => ({ ...p, zipCode: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Default toggle */}
                    <label className="flex items-center gap-3 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={addrForm.isDefault}
                        onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))}
                        className="w-4 h-4 accent-[#E8B4B8] bg-[#111111] border-[#1A1A1A]"
                      />
                      <span className="text-sm text-[#F5F0EB]/70">{t("addressIsDefault")}</span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSaveAddress}
                      disabled={addrSaving || !addrForm.firstName || !addrForm.lastName || !addrForm.addressLine1 || !addrForm.city || !addrForm.country}
                      className="flex-1 border border-[#F5F0EB] text-[#F5F0EB] py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#F5F0EB] disabled:hover:border-[#F5F0EB]"
                    >
                      {addrSaving ? "..." : t("addressSave")}
                    </button>
                    <button
                      onClick={() => setShowAddrModal(false)}
                      className="flex-1 border border-[#333] text-[#8A8580] py-3 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8]/50 hover:text-[#F5F0EB] transition-all"
                    >
                      {t("addressCancel")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== PAYMENT TAB ==================== */}
      {tab === "payment" && (
        <div>
          <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("accountPaymentSettings")}</h2>
          <div className="bg-[#111111] border border-[#1A1A1A] p-6">
            <p className="text-[#8A8580] text-sm">
              {t("accountPaymentDesc")}
            </p>
          </div>
        </div>
      )}

      {/* ==================== FAVORITES TAB ==================== */}
      {tab === "favorites" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-[#F5F0EB]">{t("myFavorites")}</h2>
            {favorites.length > 0 && (
              <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">
                {t("favoritesCount").replace("{n}", String(favorites.length))}
              </span>
            )}
          </div>

          {loadingFavorites ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#E8B4B8]/30 border-t-[#E8B4B8] rounded-full animate-spin" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1" className="mx-auto mb-4 opacity-40">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className="text-[#8A8580] text-sm mb-2">{t("noFavorites")}</p>
              <p className="text-[#8A8580]/60 text-xs mb-6">{t("noFavoritesDesc")}</p>
              <Link
                href="/#collection"
                className="inline-block px-6 py-2 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300"
              >
                {t("animalCollection")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.filter(fav => getProduct(fav.product_slug)).map(fav => {
                const prod = getProduct(fav.product_slug)!;
                const slugToPrefix: Record<string, string> = {
                  "gorilla-sofa": "gorillaSofa",
                  "silverback-sofa": "silverbackSofa",
                  "owl-sofa": "owlChair",
                  "meteorite-ring-sofa": "meteoriteRingSofa",
                  "muscle-gorilla-sofa": "muscleGorillaSofa",
                };
                const prefix = slugToPrefix[fav.product_slug] || "";
                const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : prod.name;
                const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : prod.tagline;
                const productImages: Record<string, string[]> = {
                  "owl-sofa": ["/products/owl/snowy-white.png"],
                  "gorilla-sofa": ["/products/gorilla-sofa/gray.jpg"],
                  "silverback-sofa": ["/products/silverback-sofa/gray.jpg"],
                  "meteorite-ring-sofa": ["/products/meteorite-ring-sofa/main.jpg"],
                  "muscle-gorilla-sofa": ["/products/muscle-gorilla-sofa/main.jpg"],
                };
                const img = productImages[fav.product_slug]?.[0];
                const priceValue = prod.priceRange ? (prod.priceRange[region as keyof typeof prod.priceRange]?.[0] ?? prod.priceRange.americas?.[0] ?? 0) : 0;
                return (
                  <div
                    key={fav.id}
                    className="group border border-[#1A1A1A] hover:border-[#E8B4B8]/30 transition-all duration-300 relative"
                  >
                    <Link href={`/${fav.product_slug}`}>
                      <div className="aspect-square bg-gradient-to-b from-[#111111] to-[#0A0A0A] relative overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                              {prod.animal.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/${fav.product_slug}`}>
                            <h3 className="font-serif text-lg font-light text-[#F5F0EB] hover:text-[#E8B4B8] transition-colors">{productName}</h3>
                          </Link>
                          <p className="text-xs text-[#8A8580] mt-1">{productTagline}</p>
                          <p className="text-sm text-[#F5F0EB]/60 mt-2">{formatPrice(priceValue, region)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(fav.product_slug)}
                          disabled={removingFavorite === fav.product_slug}
                          className="flex-shrink-0 text-[#E8B4B8] hover:text-[#F5F0EB] transition-colors p-1"
                          title={t("removeFavorite")}
                        >
                          {removingFavorite === fav.product_slug ? (
                            <div className="w-4 h-4 border-2 border-[#E8B4B8]/30 border-t-[#E8B4B8] rounded-full animate-spin" />
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
