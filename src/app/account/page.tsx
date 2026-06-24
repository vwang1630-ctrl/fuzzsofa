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
  colorHex: string;
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
  paymentMethod: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items: OrderItem[];
  shippingEvents: ShippingEvent[];
}

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

type TabKey = "all" | "pending" | "processing" | "shipped" | "delivered";
type SectionKey = "orders" | "addresses";

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

const COUNTRIES = [
  "US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "NL", "BE",
  "AT", "CH", "SE", "NO", "DK", "FI", "PT", "IE", "PL", "CZ",
  "AE", "SA", "QA", "BH", "KW", "OM",
  "JP", "KR", "SG", "HK", "TW",
];

const countryName = (code: string): string => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AccountPage() {
  const { t } = useLanguage();
  const [section, setSection] = useState<SectionKey>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  // Address form state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "US",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const getAuthHeaders = useCallback(async () => {
    const headers: Record<string, string> = {};
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) headers["x-session"] = session.access_token;
    } catch { /* not logged in */ }
    return headers;
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
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
  }, [getAuthHeaders]);

  const fetchAddresses = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/addresses", { headers });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchOrders();
    fetchAddresses();
  }, [fetchOrders, fetchAddresses]);

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
    } catch { /* noop */ }
  };

  /* ---- Address CRUD ---- */
  const resetAddressForm = () => {
    setAddressForm({
      label: "Home", firstName: "", lastName: "", email: "", phone: "",
      country: "US", addressLine1: "", addressLine2: "",
      city: "", state: "", zipCode: "", isDefault: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const openEditAddress = (addr: Address) => {
    setAddressForm({
      label: addr.label, firstName: addr.firstName, lastName: addr.lastName,
      email: addr.email || "", phone: addr.phone, country: addr.country,
      addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 || "",
      city: addr.city, state: addr.state, zipCode: addr.zipCode,
      isDefault: addr.isDefault,
    });
    setEditingAddress(addr);
    setShowAddressForm(true);
  };

  const openNewAddress = () => {
    resetAddressForm();
    setShowAddressForm(true);
  };

  const saveAddress = async () => {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";
    const body = { ...addressForm, id: editingAddress?.id };
    const res = await fetch("/api/addresses", {
      method: editingAddress ? "PUT" : "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchAddresses();
      resetAddressForm();
    }
  };

  const deleteAddress = async (id: string) => {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";
    const res = await fetch("/api/addresses", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchAddresses();
  };

  const setDefaultAddress = async (id: string) => {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";
    await fetch("/api/addresses", {
      method: "PUT",
      headers,
      body: JSON.stringify({ id, isDefault: true }),
    });
    fetchAddresses();
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

            <div className="bg-[#111111] border border-[#1A1A1A] p-5">
              <h3 className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-3">
                {t("orderDetailShippingAddress")}
              </h3>
              <p className="text-[#F5F0EB] text-sm">{o.firstName} {o.lastName}</p>
              {o.email && <p className="text-[#8A8580] text-sm">{o.email}</p>}
              <p className="text-[#F5F0EB] text-sm">{o.phone}</p>
              <p className="text-[#8A8580] text-sm">
                {o.addressLine1}{o.addressLine2 ? `, ${o.addressLine2}` : ""}<br />
                {o.city}, {o.state} {o.zipCode}, {countryName(o.country)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Main Account View ---- */
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10 tracking-wide">
        {t("accountTitle")}
      </h1>

      {/* Section Nav */}
      <div className="flex gap-8 mb-8 border-b border-[#1A1A1A]">
        <button
          onClick={() => setSection("orders")}
          className={`pb-3 text-sm tracking-[0.1em] uppercase transition-colors border-b-2 -mb-[1px] ${
            section === "orders"
              ? "border-[#E8B4B8] text-[#E8B4B8]"
              : "border-transparent text-[#8A8580] hover:text-[#F5F0EB]"
          }`}
        >
          {t("accountMyOrders")}
        </button>
        <button
          onClick={() => setSection("addresses")}
          className={`pb-3 text-sm tracking-[0.1em] uppercase transition-colors border-b-2 -mb-[1px] ${
            section === "addresses"
              ? "border-[#E8B4B8] text-[#E8B4B8]"
              : "border-transparent text-[#8A8580] hover:text-[#F5F0EB]"
          }`}
        >
          {t("accountMyAddresses")}
        </button>
      </div>

      {/* ============ ORDERS SECTION ============ */}
      {section === "orders" && (
        <>
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
        </>
      )}

      {/* ============ ADDRESSES SECTION ============ */}
      {section === "addresses" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#8A8580]">
              {addresses.length} {t("accountMyAddresses").toLowerCase()}
            </p>
            <button
              onClick={openNewAddress}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#F5F0EB] text-[#F5F0EB] text-xs tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t("accountAddAddress")}
            </button>
          </div>

          {/* Address Cards */}
          {addresses.length === 0 && !showAddressForm ? (
            <div className="text-center py-16 bg-[#111111] border border-[#1A1A1A]">
              <svg className="mx-auto mb-4 text-[#333]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-[#8A8580] mb-4">{t("accountNoAddresses")}</p>
              <button
                onClick={openNewAddress}
                className="text-sm text-[#E8B4B8] hover:text-[#F5F0EB] transition-colors"
              >
                {t("accountAddFirstAddress")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-[#111111] border p-5 transition-all duration-300 ${
                    addr.isDefault ? "border-[#E8B4B8]" : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-[0.1em] uppercase text-[#F5F0EB]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 bg-[#E8B4B8]/10 text-[#E8B4B8] border border-[#E8B4B8]/20">
                          {t("accountDefaultAddress")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
                        >
                          {t("accountSetDefault")}
                        </button>
                      )}
                      <button
                        onClick={() => openEditAddress(addr)}
                        className="text-xs text-[#8A8580] hover:text-[#F5F0EB] transition-colors"
                      >
                        {t("accountEditAddress")}
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-[#8A8580] hover:text-red-400 transition-colors"
                      >
                        {t("accountDeleteAddress")}
                      </button>
                    </div>
                  </div>
                  <p className="text-[#F5F0EB] text-sm">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-[#8A8580] text-sm mt-1">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-[#8A8580] text-sm">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <p className="text-[#8A8580] text-sm">{countryName(addr.country)}</p>
                  {addr.phone && (
                    <p className="text-[#8A8580] text-sm mt-1">{addr.phone}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {showAddressForm && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-xl text-[#F5F0EB] tracking-wide">
                    {editingAddress ? "Edit Address" : "New Address"}
                  </h2>
                  <button
                    onClick={resetAddressForm}
                    className="text-[#8A8580] hover:text-[#F5F0EB] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Label */}
                  <div>
                    <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                      Label
                    </label>
                    <div className="flex gap-2">
                      {[t("accountAddressHome"), t("accountAddressOffice"), "Other"].map((lbl) => (
                        <button
                          key={lbl}
                          onClick={() => setAddressForm((f) => ({ ...f, label: lbl }))}
                          className={`px-4 py-2 text-xs tracking-[0.05em] uppercase border transition-all duration-300 ${
                            addressForm.label === lbl
                              ? "border-[#E8B4B8] text-[#E8B4B8]"
                              : "border-[#333] text-[#8A8580] hover:border-[#F5F0EB] hover:text-[#F5F0EB]"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutFirstName")}
                      </label>
                      <input
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm((f) => ({ ...f, firstName: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutLastName")}
                      </label>
                      <input
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm((f) => ({ ...f, lastName: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutEmail")}
                      </label>
                      <input
                        type="email"
                        value={addressForm.email}
                        onChange={(e) => setAddressForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutPhone")}
                      </label>
                      <input
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                      {t("checkoutCountry")}
                    </label>
                    <select
                      value={addressForm.country}
                      onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors appearance-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{countryName(c)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address Lines */}
                  <div>
                    <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                      {t("checkoutAddressLine1")}
                    </label>
                    <input
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm((f) => ({ ...f, addressLine1: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                      {t("checkoutAddressLine2")} <span className="normal-case tracking-normal">(Optional)</span>
                    </label>
                    <input
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm((f) => ({ ...f, addressLine2: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutCity")}
                      </label>
                      <input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutState")}
                      </label>
                      <input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                        {t("checkoutZipCode")}
                      </label>
                      <input
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm((f) => ({ ...f, zipCode: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Default checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))}
                      className="w-4 h-4 accent-[#E8B4B8]"
                    />
                    <span className="text-sm text-[#8A8580]">Set as default address</span>
                  </label>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={saveAddress}
                      disabled={!addressForm.firstName || !addressForm.lastName || !addressForm.addressLine1 || !addressForm.city}
                      className="flex-1 py-3 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {editingAddress ? "Save Changes" : "Add Address"}
                    </button>
                    <button
                      onClick={resetAddressForm}
                      className="px-6 py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase hover:text-[#F5F0EB] hover:border-[#F5F0EB] transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
