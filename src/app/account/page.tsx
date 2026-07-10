"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import { useCart } from "@/lib/cart-context";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

interface OrderItem {
    id: string;
    productSlug: string;
    productName: string;
    colorName: string | null;
    colorHex: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    imageUrl: string | null;
    fabric?: string;
    size?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    total: number;
    shippingFee: number;
    subtotal: number;
    currency: string;
    createdAt: string;
    items: OrderItem[];
    trackingNumber: string | null;
    carrier: string | null;
    estimatedDelivery: string | null;
    latestShippingEvent: string | null;
    shippingMethod: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
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

const formatDate = (d: string) => {
    try {
        const date = new Date(d);

        if (isNaN(date.getTime()))
            return d;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return d;
    }
};

const statusLabel = (s: string, t: (key: TranslationKeys) => string): string => {
    const m: Record<string, TranslationKeys> = {
        pending: "orderStatusPending",
        confirmed: "orderStatusConfirmed",
        processing: "orderStatusProcessing",
        shipped: "orderStatusShipped",
        delivered: "orderStatusDelivered",
        cancelled: "orderStatusCancelled"
    };

    return m[s] ? t(m[s]) : s;
};

const statusColor = (s: string) => {
    const m: Record<string, string> = {
        pending: "text-[#e8a050] border-[#e8a050]/30 bg-[#e8a050]/10",
        confirmed: "text-[#c98b96] border-[#c98b96]/30 bg-[#c98b96]/10",
        processing: "text-[#c98b96] border-[#c98b96]/30 bg-[#c98b96]/10",
        shipped: "text-[#7eb8e0] border-[#7eb8e0]/30 bg-[#7eb8e0]/10",
        delivered: "text-[#a8a8a8] border-[#a8a8a8]/30 bg-[#a8a8a8]/10",
        cancelled: "text-[#555] border-[#555]/30 bg-[#555]/10"
    };

    return m[s] || "text-[#8A8580] border-[#8A8580]/30 bg-[#8A8580]/10";
};

const paymentStatusLabel = (s: string, t: (key: TranslationKeys) => string): string => {
    const m: Record<string, TranslationKeys> = {
        pending: "orderPaymentUnpaid",
        pending_payment: "orderPaymentAwaitingTransfer",
        paid: "orderPaymentPaid",
        refunded: "orderPaymentRefunded",
        failed: "orderPaymentFailed"
    };

    return m[s] ? t(m[s]) : s;
};

const getPaymentStatusComponent = (s: string, tFn: (key: TranslationKeys) => string) => {
    const colorMap: Record<string, string> = {
        pending: "text-[#E8B4B8]",
        pending_payment: "text-[#E8B4B8]",
        paid: "text-green-400",
        refunded: "text-[#8A8580]",
        failed: "text-red-400"
    };

    return (
        <span className={`text-xs ${colorMap[s] || "text-[#F5F0EB]"}`}>
            {paymentStatusLabel(s, tFn)}
        </span>
    );
};

const logisticsBadge = (event: string | null, t: (key: TranslationKeys) => string) => {
    if (!event)
        return null;

    const map: Record<string, {
        color: string;
        key: TranslationKeys;
    }> = {
        shippingPreShipping: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgePreShipping"
        },

        shippingPacked: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgePreShipping"
        },

        shippingPickedUp: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgeDomestic"
        },

        shippingWarehouseReceived: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgeDomestic"
        },

        shippingWarehouseDispatched: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgeDomestic"
        },

        shippingExportDeclared: {
            color: "bg-[#333] text-[#8A8580]",
            key: "shippingStatusBadgeDomestic"
        },

        shippingExportCleared: {
            color: "bg-[#2563eb]/20 text-blue-400",
            key: "shippingStatusBadgeInternational"
        },

        shippingInTransitIntl: {
            color: "bg-[#2563eb]/20 text-blue-400",
            key: "shippingStatusBadgeInternational"
        },

        shippingTransitHub: {
            color: "bg-[#2563eb]/20 text-blue-400",
            key: "shippingStatusBadgeInternational"
        },

        shippingArrivedDest: {
            color: "bg-orange-500/20 text-orange-400",
            key: "shippingStatusBadgeCustoms"
        },

        shippingImportDeclared: {
            color: "bg-orange-500/20 text-orange-400",
            key: "shippingStatusBadgeCustoms"
        },

        shippingTaxPaid: {
            color: "bg-orange-500/20 text-orange-400",
            key: "shippingStatusBadgeCustoms"
        },

        shippingImportCleared: {
            color: "bg-green-500/20 text-green-400",
            key: "shippingStatusBadgeLocalDelivery"
        },

        shippingLocalSorting: {
            color: "bg-green-500/20 text-green-400",
            key: "shippingStatusBadgeLocalDelivery"
        },

        shippingLocalDispatched: {
            color: "bg-green-500/20 text-green-400",
            key: "shippingStatusBadgeLocalDelivery"
        },

        shippingOutForDelivery: {
            color: "bg-green-500/20 text-green-400",
            key: "shippingStatusBadgeLocalDelivery"
        },

        shippingDelivered: {
            color: "bg-green-500/20 text-green-400",
            key: "shippingStatusBadgeDelivered"
        },

        shippingCustomsHold: {
            color: "bg-red-500/20 text-red-400",
            key: "shippingStatusBadgeException"
        },

        shippingDelay: {
            color: "bg-red-500/20 text-red-400",
            key: "shippingStatusBadgeException"
        },

        shippingDeliveryFailed: {
            color: "bg-red-500/20 text-red-400",
            key: "shippingStatusBadgeException"
        },

        shippingReturnToOrigin: {
            color: "bg-red-500/20 text-red-400",
            key: "shippingStatusBadgeException"
        }
    };

    const badge = map[event];

    if (!badge)
        return null;

    return {
        color: badge.color,
        label: t(badge.key)
    };
};

const formatEDD = (d: string | null) => {
    if (!d)
        return null;

    try {
        return new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });
    } catch {
        return null;
    }
};

type Tab = "orders" | "addresses" | "payment" | "favorites";

export default function AccountPage() {
    const router = useRouter();

    const {
        t,
        locale
    } = useLanguage();

    const {
        region
    } = useCart();

    const allProducts = useProducts();
    const getProductLocal = (slug: string): Product | undefined => allProducts.find(p => p.slug === slug);

    const [tab, setTab] = useState<Tab>("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    type OrderTab = "all" | "pending" | "production" | "shipped" | "delivered";
    const [orderTab, setOrderTab] = useState<OrderTab>("all");

    const orderTabs: {
        key: OrderTab;
        labelKey: TranslationKeys;
        statuses: string[];
    }[] = [{
        key: "all",
        labelKey: "orderTabAll",
        statuses: []
    }, {
        key: "pending",
        labelKey: "orderTabPending",
        statuses: ["pending"]
    }, {
        key: "production",
        labelKey: "orderTabProduction",
        statuses: ["confirmed", "processing"]
    }, {
        key: "shipped",
        labelKey: "orderTabShipped",
        statuses: ["shipped"]
    }, {
        key: "delivered",
        labelKey: "orderTabDelivered",
        statuses: ["delivered"]
    }];

    const tabOrders = orderTab === "all" ? orders : orders.filter(o => {
        const tab = orderTabs.find(t => t.key === orderTab);
        return tab ? tab.statuses.includes(o.status) : false;
    });

    const [deleting, setDeleting] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddr, setLoadingAddr] = useState(false);

    const [favorites, setFavorites] = useState<{
        id: string;
        product_slug: string;
        created_at: string;
    }[]>([]);

    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);
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
        isDefault: false
    });

    const [addrSaving, setAddrSaving] = useState(false);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editSaving, setEditSaving] = useState(false);

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: ""
    });

    const [editItems, setEditItems] = useState<Array<{
        id: string;
        colorName: string;
        colorHex: string;
        productSlug: string;
    }>>([]);

    const [editProductColors, setEditProductColors] = useState<Record<string, {
        name: string;
        hex: string;
        type: string;
        swatchImage: string;
    }[]>>({});

    const [editSelectedTypes, setEditSelectedTypes] = useState<Record<number, string>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function getSession() {
            try {
                const supabase = await getSupabaseBrowserClientWithRetry();

                const {
                    data: {
                        session
                    }
                } = await supabase.auth.getSession();

                setSessionToken(session?.access_token ?? null);
            } catch {}
        }

        getSession();
    }, []);

    const authHeaders = useCallback(() => {
        const h: Record<string, string> = {
            "Content-Type": "application/json"
        };

        if (sessionToken)
            h["x-session"] = sessionToken;

        return h;
    }, [sessionToken]);

    useEffect(() => {
        async function fetchOrders() {
            if (!sessionToken) {
                setLoadingOrders(false);
                return;
            }

            try {
                const res = await fetch("/api/orders", {
                    headers: authHeaders()
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || data || []);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        }

        fetchOrders();
    }, [sessionToken, authHeaders]);

    useEffect(() => {
        async function fetchAddresses() {
            if (!sessionToken || tab !== "addresses")
                return;

            setLoadingAddr(true);

            try {
                const res = await fetch("/api/addresses", {
                    headers: authHeaders()
                });

                if (res.ok) {
                    const data = await res.json();
                    setAddresses(data.addresses || data || []);
                }
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            } finally {
                setLoadingAddr(false);
            }
        }

        fetchAddresses();
    }, [sessionToken, tab, authHeaders]);

    useEffect(() => {
        async function fetchFavorites() {
            if (!sessionToken || tab !== "favorites")
                return;

            setLoadingFavorites(true);

            try {
                const res = await fetch("/api/favorites", {
                    headers: authHeaders()
                });

                if (res.ok) {
                    const data = await res.json();
                    setFavorites(data.favorites || []);
                }
            } catch (err) {
                console.error("Failed to fetch favorites:", err);
            } finally {
                setLoadingFavorites(false);
            }
        }

        fetchFavorites();
    }, [sessionToken, tab, authHeaders]);

    const handleRemoveFavorite = async (productSlug: string) => {
        setRemovingFavorite(productSlug);

        try {
            const res = await fetch(`/api/favorites?productSlug=${encodeURIComponent(productSlug)}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (res.ok) {
                setFavorites(prev => prev.filter(f => f.product_slug !== productSlug));
            }
        } catch (err) {
            console.error("Remove favorite failed:", err);
        } finally {
            setRemovingFavorite(null);
        }
    };

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
            isDefault: addresses.length === 0
        });

        setShowAddrModal(true);
    };

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
            isDefault: addr.is_default
        });

        setShowAddrModal(true);
    };

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
                isDefault: addrForm.isDefault
            };

            let res: Response;

            if (editingAddr) {
                res = await fetch(`/api/addresses/${editingAddr.id}`, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch("/api/addresses", {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setShowAddrModal(false);

                const addrRes = await fetch("/api/addresses", {
                    headers: authHeaders()
                });

                if (addrRes.ok) {
                    const data = await addrRes.json();
                    setAddresses(data.addresses || []);
                }
            }
        } catch (err) {
            console.error("Save address failed:", err);
        } finally {
            setAddrSaving(false);
        }
    };

    const handleDeleteAddress = async (addrId: string) => {
        if (!confirm(t("addressDeleteConfirm")))
            return;

        try {
            const res = await fetch(`/api/addresses/${addrId}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (res.ok) {
                setAddresses(prev => prev.filter(a => a.id !== addrId));
            }
        } catch (err) {
            console.error("Delete address failed:", err);
        }
    };

    const handleSetDefault = async (addrId: string) => {
        try {
            const res = await fetch(`/api/addresses/${addrId}`, {
                method: "PATCH",
                headers: authHeaders(),

                body: JSON.stringify({
                    isDefault: true
                })
            });

            if (res.ok) {
                setAddresses(prev => prev.map(a => ({
                    ...a,
                    is_default: a.id === addrId
                })));
            }
        } catch (err) {
            console.error("Set default failed:", err);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm(t("accountDeleteConfirm")))
            return;

        setDeleting(orderId);

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== orderId));

                setSelectedOrders(prev => {
                    const n = new Set(prev);
                    n.delete(orderId);
                    return n;
                });
            }
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeleting(null);
        }
    };

    const openEditOrder = (order: Order) => {
        setEditingOrder(order);

        setEditForm({
            firstName: order.firstName || "",
            lastName: order.lastName || "",
            email: order.email || "",
            phone: order.phone || "",
            country: order.country || "",
            addressLine1: order.addressLine1 || "",
            addressLine2: order.addressLine2 || "",
            city: order.city || "",
            state: order.state || "",
            zipCode: order.zipCode || ""
        });

        setEditItems(order.items.map(it => ({
            id: it.id,
            colorName: it.colorName || "",
            colorHex: it.colorHex || "",
            productSlug: it.productSlug || ""
        })));

        const colorsMap: Record<string, {
            name: string;
            hex: string;
            type: string;
            swatchImage: string;
        }[]> = {};

        const slugs = new Set(order.items.map(it => it.productSlug || ""));

        const productImages: Record<string, string[]> = {
            "owl-sofa": [
                "/products/owl/snowy-white.png",
                "/products/owl/rose-pink.png",
                "/products/owl/forest-green.png",
                "/products/owl/warm-gray.png",
                "/products/owl/dusty-pink-fur.png",
                "/products/owl/lifestyle-square.webp"
            ],

            "gorilla-sofa": [
                "/products/gorilla-sofa/gray.jpg",
                "/products/gorilla-sofa/cream.jpg",
                "/products/gorilla-sofa/brown.jpg",
                "/products/gorilla-sofa/black.jpg"
            ],

            "silverback-sofa": [
                "/products/silverback-sofa/gray.jpg",
                "/products/silverback-sofa/beige.jpg",
                "/products/silverback-sofa/navy.jpg",
                "/products/silverback-sofa/charcoal.jpg"
            ],

            "meteorite-ring-sofa": [
                "/products/meteorite-ring-sofa/hero-1.webp",
                "/products/meteorite-ring-sofa/main.jpg",
                "/products/meteorite-ring-sofa/scene-2.jpg"
            ],

            "muscle-gorilla-sofa": [
                "/products/muscle-gorilla-sofa/main.jpg",
                "/products/muscle-gorilla-sofa/scene-2.jpg",
                "/products/muscle-gorilla-sofa/scene-4.jpg",
                "/products/muscle-gorilla-sofa/scene-5.jpg"
            ]
        };

        const matTypeKeyMap: Record<string, string> = {
            "Plush Fur": "matTypePlushFur",
            "Bouclé": "matTypeBoucle",
            "Velvet": "matTypeVelvet",
            "Fabric": "matTypeFabric",
            "Meteorite Fabric": "matTypeMeteoriteFabric",
            "Leather": "matTypeLeather"
        };

        slugs.forEach(slug => {
            if (!slug)
                return;

            const product = getProductLocal(slug);

            if (product?.materialOptions) {
                const allColors: {
                    name: string;
                    hex: string;
                    type: string;
                    swatchImage: string;
                }[] = [];

                const images = productImages[slug] || [];
                let globalIdx = 0;

                product.materialOptions.forEach(opt => {
                    opt.options.forEach((name, i) => {
                        const swatchImg = images[globalIdx] || "";

                        allColors.push({
                            name,
                            hex: opt.colors[i] || "#666",
                            type: matTypeKeyMap[opt.type] || "matTypeFabric",
                            swatchImage: swatchImg
                        });

                        globalIdx++;
                    });
                });

                colorsMap[slug] = allColors;
            }
        });

        setEditProductColors(colorsMap);
        const typesMap: Record<number, string> = {};

        order.items.forEach((item, idx) => {
            const slug = item.productSlug;
            const allColors = colorsMap[slug] || [];
            const matchedType = allColors.find(c => c.name === item.colorName)?.type;

            if (matchedType) {
                typesMap[idx] = matchedType;
            } else if (allColors.length > 0) {
                typesMap[idx] = allColors[0].type;
            }
        });

        setEditSelectedTypes(typesMap);
    };

    const saveEditOrder = async () => {
        if (!editingOrder)
            return;

        setEditSaving(true);

        try {
            const res = await fetch(`/api/orders/${editingOrder.id}`, {
                method: "PATCH",

                headers: {
                    ...authHeaders(),
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    address: editForm,
                    items: editItems
                })
            });

            if (res.ok) {
                const ordersRes = await fetch("/api/orders", {
                    headers: authHeaders()
                });

                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(data.orders || data || []);
                }

                setEditingOrder(null);
            } else {
                alert(t("editOrderError"));
            }
        } catch (err) {
            console.error("Edit order failed:", err);
            alert(t("editOrderError"));
        } finally {
            setEditSaving(false);
        }
    };

    const handlePayOrder = (order: Order) => {
        const payData = {
            orderIds: [order.id],

            items: order.items.map(it => ({
                productSlug: it.productSlug,
                productName: it.productName,
                colorName: it.colorName,
                colorHex: it.colorHex,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                subtotal: it.subtotal,
                imageUrl: it.imageUrl
            })),

            total: order.total,
            subtotal: order.subtotal,
            shippingFee: order.shippingFee
        };

        sessionStorage.setItem("payExistingOrders", JSON.stringify(payData));
        router.push("/payment");
    };

    const handleBatchPay = () => {
        const selected = orders.filter(o => selectedOrders.has(o.id) && o.paymentStatus === "pending");

        if (selected.length === 0)
            return;

        const total = selected.reduce((s, o) => s + o.total, 0);
        const subtotal = selected.reduce((s, o) => s + o.subtotal, 0);
        const shippingFee = selected.reduce((s, o) => s + o.shippingFee, 0);

        const items = selected.flatMap(o => o.items.map(it => ({
            productSlug: it.productSlug,
            productName: it.productName,
            colorName: it.colorName,
            colorHex: it.colorHex,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            subtotal: it.subtotal,
            imageUrl: it.imageUrl
        })));

        const payData = {
            orderIds: selected.map(o => o.id),
            items,
            total,
            subtotal,
            shippingFee
        };

        sessionStorage.setItem("payExistingOrders", JSON.stringify(payData));
        router.push("/payment");
    };

    const toggleOrder = (id: string) => {
        setSelectedOrders(prev => {
            const n = new Set(prev);

            if (n.has(id))
                n.delete(id);
            else
                n.add(id);

            return n;
        });
    };

    const tabFilteredOrders = orderTab === "pending" ? orders.filter(o => o.status === "pending") : orderTab === "production" ? orders.filter(o => o.status === "confirmed" || o.status === "processing") : orderTab === "shipped" ? orders.filter(o => o.status === "shipped") : orderTab === "delivered" ? orders.filter(o => o.status === "delivered") : [...orders].sort((a, b) => {
        const aCancelled = a.status === "cancelled" || a.paymentStatus === "failed" ? 1 : 0;
        const bCancelled = b.status === "cancelled" || b.paymentStatus === "failed" ? 1 : 0;
        return aCancelled - bCancelled;
    });

    const hasSelectedPending = orders.filter(o => selectedOrders.has(o.id) && o.paymentStatus === "pending").length > 0;

    if (!mounted)
        return null;

    if (!sessionToken && !loadingOrders) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-[#8A8580]">{t("accountLoginRequired")}</p>
                <Link
                    href="/login"
                    className="px-6 py-2 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-wider hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all">
                    {t("signIn")}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-20">
            <h1 className="font-serif text-3xl text-[#F5F0EB] tracking-wide mb-10">{t("accountTitle")}</h1>
            {}
            <div
                className="flex gap-4 md:gap-8 border-b border-[#1A1A1A] mb-10 overflow-x-auto scrollbar-hide">
                {(["orders", "addresses", "payment", "favorites"] as Tab[]).map(tabKey => <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    className={`pb-3 text-xs md:text-sm tracking-[0.1em] uppercase transition-colors whitespace-nowrap flex-shrink-0 ${tab === tabKey ? "text-[#F5F0EB] border-b-2 border-[#E8B4B8]" : "text-[#8A8580] hover:text-[#F5F0EB]"}`}>
                    {tabKey === "orders" && <><span className="sm:hidden">{t("accountTabOrdersShort")}</span><span className="hidden sm:inline">{t("accountMyOrders")}</span></>}
                    {tabKey === "addresses" && <><span className="sm:hidden">{t("accountTabAddressesShort")}</span><span className="hidden sm:inline">{t("accountMyAddresses")}</span></>}
                    {tabKey === "payment" && <><span className="sm:hidden">{t("accountTabPaymentShort")}</span><span className="hidden sm:inline">{t("accountPaymentSettings")}</span></>}
                    {tabKey === "favorites" && <><span className="sm:hidden">{t("accountTabFavoritesShort")}</span><span className="hidden sm:inline">{t("myFavorites")}</span></>}
                </button>)}
            </div>
            {}
            {tab === "orders" && <div>
                {}
                <div className="flex gap-8 border-b border-[#1A1A1A] mb-6">
                    {[{
                        key: "all" as OrderTab,
                        labelKey: "orderTabAll" as TranslationKeys,
                        shortKey: "orderTabAllShort" as TranslationKeys,
                        count: orders.length
                    }, {
                        key: "pending" as OrderTab,
                        labelKey: "orderTabPending" as TranslationKeys,
                        shortKey: "orderTabPendingShort" as TranslationKeys,
                        count: orders.filter(o => o.status === "pending").length
                    }, {
                        key: "production" as OrderTab,
                        labelKey: "orderTabProduction" as TranslationKeys,
                        shortKey: "orderTabProductionShort" as TranslationKeys,
                        count: orders.filter(o => o.status === "confirmed" || o.status === "processing").length
                    }, {
                        key: "shipped" as OrderTab,
                        labelKey: "orderTabShipped" as TranslationKeys,
                        shortKey: "orderTabShippedShort" as TranslationKeys,
                        count: orders.filter(o => o.status === "shipped").length
                    }, {
                        key: "delivered" as OrderTab,
                        labelKey: "orderTabDelivered" as TranslationKeys,
                        shortKey: "orderTabDeliveredShort" as TranslationKeys,
                        count: orders.filter(o => o.status === "delivered").length
                    }].map(tab => <button
                        key={tab.key}
                        onClick={() => setOrderTab(tab.key)}
                        className={`pb-3 text-sm tracking-[0.1em] uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${orderTab === tab.key ? "text-[#c98b96] border-b-2 border-[#c98b96]" : "text-[#a8a8a8] hover:text-[#F5F0EB]"}`}>
                        <span className="sm:hidden">{t(tab.shortKey)}</span>
                        <span className="hidden sm:inline">{t(tab.labelKey)}</span>
                        {tab.count > 0 && <span
                            className={`text-[12px] min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full ${orderTab === tab.key ? "bg-[#c98b96] text-[#0A0A0A]" : "bg-[#1A1A1A] text-[#a8a8a8]"}`}>
                            {tab.count}
                        </span>}
                    </button>)}
                </div>
                {}
                {orderTab === "pending" && hasSelectedPending && <div className="flex justify-end mb-4">
                    <button
                        onClick={handleBatchPay}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#E8B4B8] text-[#E8B4B8] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all">
                        {t("accountPaySelected")}({orders.filter(o => selectedOrders.has(o.id) && o.paymentStatus === "pending").length})
                                      </button>
                </div>}
                {}
                {loadingOrders ? <div className="flex justify-center py-20">
                    <div
                        className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
                </div> : tabFilteredOrders.length === 0 ? <div className="text-center py-20 text-[#8A8580]">{t("accountNoOrders")}</div> : <div className="space-y-3 sm:space-y-4">
                    {tabFilteredOrders.map(order => {
                        const mainItem = order.items?.[0];
                        const totalQty = order.items?.reduce((sum: number, it: OrderItem) => sum + it.quantity, 0) || 0;
                        const isCancelled = order.status === "cancelled" || order.paymentStatus === "failed";

                        return (
                            <div
                                key={order.id}
                                className={`border border-[#1a1a1a] rounded-lg p-4 sm:p-5 hover:border-[#333] transition-colors duration-300 ${isCancelled ? "opacity-50" : ""}`}>
                                {}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[#F5F0EB] text-xs sm:text-sm font-light tracking-wider">{order.orderNumber}</span>
                                            <Link
                                                href={`/order/detail?orderNo=${order.orderNumber}`}
                                                className="text-[12px] tracking-[0.15em] uppercase text-[#c98b96] border border-[#c98b96]/40 px-3 py-1 rounded hover:bg-[#c98b96] hover:text-[#0A0A0A] transition-all duration-300">
                                                {t("viewDetails")}
                                            </Link>
                                            {(order.status === "pending" || order.paymentStatus === "pending_payment" || order.paymentStatus === "pending") && <button
                                                onClick={() => openEditOrder(order)}
                                                className="text-[12px] tracking-[0.15em] uppercase text-[#F5F0EB] border border-[#333] px-3 py-1 rounded hover:border-[#c98b96] hover:text-[#c98b96] transition-all duration-300">
                                                {t("editOrder")}
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                                {}
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[#8A8580] text-[12px] tracking-wide">{formatDate(order.createdAt)}</p>
                                    <span
                                        className={`inline-block px-2 py-0.5 text-[12px] tracking-wider rounded border ${statusColor(order.status)}`}>
                                        {statusLabel(order.status, t)}
                                    </span>
                                </div>
                                {}
                                <div className="flex items-center gap-3">
                                    {mainItem?.imageUrl && <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-[#111] flex-shrink-0 border border-[#1a1a1a]">
                                        <img
                                            src={mainItem.imageUrl}
                                            alt={mainItem.productName}
                                            className="w-full h-full object-cover" />
                                    </div>}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#F5F0EB] text-xs sm:text-sm font-light truncate">{mainItem?.productName || "—"}</p>
                                        <p className="text-[#8A8580] text-[12px] mt-0.5">
                                            {totalQty > 1 ? `× ${totalQty}` : ""}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[#F5F0EB] text-sm sm:text-base font-light">{formatPrice(order.total)}</p>
                                        <p className="text-[#8A8580] text-[12px] mt-0.5">
                                            {paymentStatusLabel(order.paymentStatus, t)}· {order.paymentMethod || "PayPal"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>}
                {}
                {editingOrder && <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setEditingOrder(null)}>
                    <div
                        className="bg-[#0A0A0A] border border-[#1A1A1A] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <div className="p-6 sm:p-8">
                            <h3 className="font-serif text-xl text-[#F5F0EB] mb-2">{t("editOrderTitle")}</h3>
                            <p className="text-[#8A8580] text-xs tracking-wide mb-6">{editingOrder.orderNumber}</p>
                            {}
                            <div className="mb-8">
                                <h4 className="text-sm text-[#F5F0EB] tracking-[0.1em] uppercase mb-4">{t("editOrderColor")}</h4>
                                <div className="space-y-4">
                                    {editItems.map((item, idx) => {
                                        const availableColors = editProductColors[item.productSlug] || [];

                                        const typeGroups: Record<string, {
                                            name: string;
                                            hex: string;
                                            swatchImage: string;
                                        }[]> = {};

                                        availableColors.forEach(c => {
                                            const typeKey = c.type || "matTypeFabric";

                                            if (!typeGroups[typeKey])
                                                typeGroups[typeKey] = [];

                                            typeGroups[typeKey].push({
                                                name: c.name,
                                                hex: c.hex,
                                                swatchImage: c.swatchImage
                                            });
                                        });

                                        const typeKeys = Object.keys(typeGroups);
                                        const selectedType = editSelectedTypes[idx] || typeKeys[0] || "";
                                        const colorsForType = typeGroups[selectedType] || [];
                                        const selectedItem = editingOrder.items?.[idx];

                                        const typeLabelMap: Record<string, string> = {
                                            "matTypeBoucle": "布克莱",
                                            "matTypeVelvet": "金丝绒",
                                            "matTypePlushFur": "毛绒",
                                            "matTypeLeather": "皮革",
                                            "matTypeFabric": "面料"
                                        };

                                        return (
                                            <div key={item.id} className="border border-[#1A1A1A] rounded-lg p-4">
                                                <p className="text-xs text-[#8A8580] mb-3 tracking-wide">商品 {idx + 1}: {selectedItem?.productName || ""}
                                                </p>
                                                {availableColors.length > 0 ? <div className="space-y-4">
                                                    {}
                                                    <div className="flex flex-wrap gap-3">
                                                        {typeKeys.map(typeKey => <button
                                                            key={typeKey}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditSelectedTypes(prev => ({
                                                                    ...prev,
                                                                    [idx]: typeKey
                                                                }));

                                                                const newTypeColors = typeGroups[typeKey] || [];

                                                                if (newTypeColors.length > 0) {
                                                                    const newItems = [...editItems];

                                                                    newItems[idx] = {
                                                                        ...newItems[idx],
                                                                        colorName: newTypeColors[0].name,
                                                                        colorHex: newTypeColors[0].hex
                                                                    };

                                                                    setEditItems(newItems);
                                                                }
                                                            }}
                                                            className={`text-xs tracking-[0.08em] px-4 py-2 transition-all duration-300 ${selectedType === typeKey ? "bg-[#E8B4B8]/15 text-[#E8B4B8] border border-[#E8B4B8]/50" : "text-[#8A8580] border border-[#333] hover:border-[#555] hover:text-[#F5F0EB]/60"}`}>
                                                            {typeLabelMap[typeKey] || typeKey}
                                                        </button>)}
                                                    </div>
                                                    {}
                                                    <div className="flex flex-wrap gap-4">
                                                        {colorsForType.map(color => {
                                                            const isSelected = item.colorName === color.name;

                                                            return (
                                                                <button
                                                                    key={color.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newItems = [...editItems];

                                                                        newItems[idx] = {
                                                                            ...newItems[idx],
                                                                            colorName: color.name,
                                                                            colorHex: color.hex
                                                                        };

                                                                        setEditItems(newItems);
                                                                    }}
                                                                    className="flex flex-col items-center gap-2 transition-all duration-300 group">
                                                                    <span
                                                                        className={`w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "border border-[#333] group-hover:border-[#555]"}`}>
                                                                        {color.swatchImage ? <img
                                                                            src={color.swatchImage}
                                                                            alt={color.name}
                                                                            width={48}
                                                                            height={48}
                                                                            className="w-full h-full object-cover" /> : <span
                                                                            className="w-full h-full block"
                                                                            style={{
                                                                                backgroundColor: color.hex
                                                                            }} />}
                                                                    </span>
                                                                    {}
                                                                    <span
                                                                        className={`text-xs tracking-[0.04em] text-center whitespace-nowrap ${isSelected ? "text-[#E8B4B8]" : "text-[#8A8580] group-hover:text-[#F5F0EB]/60"}`}>
                                                                        {color.name.replace(/\s*(Leather|Bouclé|Velvet|Plush|Fabric|Linen|Fur)\s*/gi, '').trim() || color.name}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {}
                                                    <p className="text-xs text-[#8A8580] mt-1">当前选择：<span className="text-[#E8B4B8]">{typeLabelMap[selectedType] || selectedType}· {item.colorName.replace(/\s*(Leather|Bouclé|Velvet|Plush|Fabric|Linen|Fur)\s*/gi, '').trim() || item.colorName}</span>
                                                    </p>
                                                </div> : <p className="text-xs text-[#8A8580]">{item.colorName}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {}
                            <div className="mb-8">
                                <h4 className="text-sm text-[#F5F0EB] tracking-[0.1em] uppercase mb-4">{t("editOrderAddress")}</h4>
                                <div className="space-y-4">
                                    {}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderFirstName")} <span className="text-[#E8B4B8]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    firstName: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderLastName")} <span className="text-[#E8B4B8]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    lastName: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                    </div>
                                    {}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderEmail")}
                                            </label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    email: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderPhone")}
                                            </label>
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    phone: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                    </div>
                                    {}
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("editOrderCountry")} <span className="text-[#E8B4B8]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.country}
                                            onChange={e => setEditForm(p => ({
                                                ...p,
                                                country: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors placeholder:text-[#8A8580]/40" />
                                    </div>
                                    {}
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("editOrderAddressLine1")} <span className="text-[#E8B4B8]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.addressLine1}
                                            onChange={e => setEditForm(p => ({
                                                ...p,
                                                addressLine1: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    {}
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("editOrderAddressLine2")}
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.addressLine2}
                                            onChange={e => setEditForm(p => ({
                                                ...p,
                                                addressLine2: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    {}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderCity")} <span className="text-[#E8B4B8]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.city}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    city: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderState")}
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.state}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    state: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label
                                                className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                                {t("editOrderZipCode")} <span className="text-[#E8B4B8]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.zipCode}
                                                onChange={e => setEditForm(p => ({
                                                    ...p,
                                                    zipCode: e.target.value
                                                }))}
                                                className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {}
                            <div className="flex gap-3">
                                <button
                                    onClick={saveEditOrder}
                                    disabled={editSaving}
                                    className="flex-1 bg-[#c98b96] text-[#0A0A0A] py-3 text-sm tracking-[0.1em] uppercase font-medium hover:bg-[#b87a85] transition-all disabled:opacity-50">
                                    {editSaving ? "..." : t("editOrderSave")}
                                </button>
                                <button
                                    onClick={() => setEditingOrder(null)}
                                    className="flex-1 border border-[#333] text-[#8A8580] py-3 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8]/50 hover:text-[#F5F0EB] transition-all">
                                    {t("editOrderCancel")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>}
            {tab === "addresses" && <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl text-[#F5F0EB]">{t("accountMyAddresses")}</h2>
                    <button
                        onClick={openAddAddress}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all">
                        {t("accountAddAddress")}
                    </button>
                </div>
                {loadingAddr ? <div className="flex justify-center py-10">
                    <div
                        className="w-6 h-6 border-2 border-[#333] border-t-[#E8B4B8] rounded-full animate-spin" />
                </div> : addresses.length === 0 ? <p className="text-[#8A8580] text-center py-10">{t("accountNoAddresses")}</p> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(
                        addr => <div key={addr.id} className="bg-[#111111] border border-[#1A1A1A] p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs tracking-wider uppercase text-[#8A8580]">{addr.label}</span>
                                {addr.is_default && <span className="text-xs text-[#E8B4B8]">{t("accountDefaultLabel")}</span>}
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
                                    className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">
                                    {t("edit")}
                                </button>
                                <button
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="text-xs text-[#8A8580] hover:text-red-400 transition-colors">
                                    {t("remove")}
                                </button>
                                {!addr.is_default && <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors">
                                    {t("accountSetDefault")}
                                </button>}
                            </div>
                        </div>
                    )}
                </div>}
                {}
                {showAddrModal && <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setShowAddrModal(false)}>
                    <div
                        className="bg-[#0A0A0A] border border-[#1A1A1A] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <h3 className="font-serif text-xl text-[#F5F0EB] mb-6">
                                {editingAddr ? t("addressEditTitle") : t("addressAddTitle")}
                            </h3>
                            <div className="space-y-4">
                                {}
                                <div>
                                    <label
                                        className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                        {t("addressLabel")}
                                    </label>
                                    <select
                                        value={addrForm.label}
                                        onChange={e => setAddrForm(p => ({
                                            ...p,
                                            label: e.target.value
                                        }))}
                                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors">
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressFirstName")} <span className="text-[#E8B4B8]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={addrForm.firstName}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                firstName: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressLastName")} <span className="text-[#E8B4B8]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={addrForm.lastName}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                lastName: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                </div>
                                {}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressEmail")}
                                        </label>
                                        <input
                                            type="email"
                                            value={addrForm.email}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                email: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressPhone")}
                                        </label>
                                        <input
                                            type="tel"
                                            value={addrForm.phone}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                phone: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                </div>
                                {}
                                <div>
                                    <label
                                        className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                        {t("addressCountry")} <span className="text-[#E8B4B8]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={addrForm.country}
                                        onChange={e => setAddrForm(p => ({
                                            ...p,
                                            country: e.target.value
                                        }))}
                                        placeholder="US, AE, GB, DE..."
                                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors placeholder:text-[#8A8580]/40" />
                                </div>
                                {}
                                <div>
                                    <label
                                        className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                        {t("addressLine1")} <span className="text-[#E8B4B8]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={addrForm.addressLine1}
                                        onChange={e => setAddrForm(p => ({
                                            ...p,
                                            addressLine1: e.target.value
                                        }))}
                                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                </div>
                                {}
                                <div>
                                    <label
                                        className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                        {t("addressLine2")}
                                    </label>
                                    <input
                                        type="text"
                                        value={addrForm.addressLine2}
                                        onChange={e => setAddrForm(p => ({
                                            ...p,
                                            addressLine2: e.target.value
                                        }))}
                                        className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                </div>
                                {}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressCity")} <span className="text-[#E8B4B8]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={addrForm.city}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                city: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressState")}
                                        </label>
                                        <input
                                            type="text"
                                            value={addrForm.state}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                state: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label
                                            className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-1.5">
                                            {t("addressZip")}
                                        </label>
                                        <input
                                            type="text"
                                            value={addrForm.zipCode}
                                            onChange={e => setAddrForm(p => ({
                                                ...p,
                                                zipCode: e.target.value
                                            }))}
                                            className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F0EB] text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8B4B8]/50 transition-colors" />
                                    </div>
                                </div>
                                {}
                                <label className="flex items-center gap-3 cursor-pointer mt-2">
                                    <input
                                        type="checkbox"
                                        checked={addrForm.isDefault}
                                        onChange={e => setAddrForm(p => ({
                                            ...p,
                                            isDefault: e.target.checked
                                        }))}
                                        className="w-4 h-4 accent-[#E8B4B8] bg-[#111111] border-[#1A1A1A]" />
                                    <span className="text-sm text-[#F5F0EB]/70">{t("addressIsDefault")}</span>
                                </label>
                            </div>
                            {}
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={addrSaving || !addrForm.firstName || !addrForm.lastName || !addrForm.addressLine1 || !addrForm.city || !addrForm.country}
                                    className="flex-1 border border-[#F5F0EB] text-[#F5F0EB] py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#F5F0EB] disabled:hover:border-[#F5F0EB]">
                                    {addrSaving ? "..." : t("addressSave")}
                                </button>
                                <button
                                    onClick={() => setShowAddrModal(false)}
                                    className="flex-1 border border-[#333] text-[#8A8580] py-3 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8]/50 hover:text-[#F5F0EB] transition-all">
                                    {t("addressCancel")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>}
            {}
            {tab === "payment" && <div>
                <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("accountPaymentSettings")}</h2>
                <div className="bg-[#111111] border border-[#1A1A1A] p-6">
                    <p className="text-[#8A8580] text-sm">
                        {t("accountPaymentDesc")}
                    </p>
                </div>
            </div>}
            {}
            {tab === "favorites" && <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl text-[#F5F0EB]">{t("myFavorites")}</h2>
                    {favorites.length > 0 && <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">
                        {t("favoritesCount").replace("{n}", String(favorites.length))}
                    </span>}
                </div>
                {loadingFavorites ? <div className="flex justify-center py-12">
                    <div
                        className="w-6 h-6 border-2 border-[#E8B4B8]/30 border-t-[#E8B4B8] rounded-full animate-spin" />
                </div> : favorites.length === 0 ? <div className="text-center py-16">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8A8580"
                        strokeWidth="1"
                        className="mx-auto mb-4 opacity-40">
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <p className="text-[#8A8580] text-sm mb-2">{t("noFavorites")}</p>
                    <p className="text-[#8A8580]/60 text-xs mb-6">{t("noFavoritesDesc")}</p>
                    <Link
                        href="/#collection"
                        className="inline-block px-6 py-2 border border-[#F5F0EB] text-[#F5F0EB] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] hover:border-[#E8B4B8] transition-all duration-300">
                        {t("animalCollection")}
                    </Link>
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-6">
                    {favorites.filter(fav => getProductLocal(fav.product_slug)).map(fav => {
                        const prod = getProductLocal(fav.product_slug)!;

                        const slugToPrefix: Record<string, string> = {
                            "gorilla-sofa": "gorillaSofa",
                            "silverback-sofa": "silverbackSofa",
                            "owl-sofa": "owlChair",
                            "meteorite-ring-sofa": "meteoriteRingSofa",
                            "muscle-gorilla-sofa": "muscleGorillaSofa"
                        };

                        const prefix = slugToPrefix[fav.product_slug] || "";
                        const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : prod.name;
                        const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : prod.tagline;

                        const productImages: Record<string, string[]> = {
                            "owl-sofa": ["/products/owl/snowy-white.png"],
                            "gorilla-sofa": ["/products/gorilla-sofa/gray.jpg"],
                            "silverback-sofa": ["/products/silverback-sofa/gray.jpg"],
                            "meteorite-ring-sofa": ["/products/meteorite-ring-sofa/main.jpg"],
                            "muscle-gorilla-sofa": ["/products/muscle-gorilla-sofa/main.jpg"]
                        };

                        const img = productImages[fav.product_slug]?.[0];
                        const priceValue = prod.priceRange ? prod.priceRange[region as keyof typeof prod.priceRange]?.[0] ?? prod.priceRange.americas?.[0] ?? 0 : 0;

                        return (
                            <div
                                key={fav.id}
                                className="group border border-[#1A1A1A] hover:border-[#E8B4B8]/30 transition-all duration-300 relative">
                                <Link href={`/${fav.product_slug}`}>
                                    <div
                                        className="aspect-square bg-gradient-to-b from-[#111111] to-[#0A0A0A] relative overflow-hidden">
                                        {img ? <img
                                            src={img}
                                            alt={productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                                {prod.animal.charAt(0)}
                                            </span>
                                        </div>}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/${fav.product_slug}`}>
                                                <h3
                                                    className="font-serif text-lg font-light text-[#F5F0EB] hover:text-[#E8B4B8] transition-colors">{productName}</h3>
                                            </Link>
                                            <p className="text-xs text-[#8A8580] mt-1">{productTagline}</p>
                                            <p className="text-sm text-[#F5F0EB]/60 mt-2">{formatPrice(priceValue, region)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFavorite(fav.product_slug)}
                                            disabled={removingFavorite === fav.product_slug}
                                            className="flex-shrink-0 text-[#E8B4B8] hover:text-[#F5F0EB] transition-colors p-1"
                                            title={t("removeFavorite")}>
                                            {removingFavorite === fav.product_slug ? <div
                                                className="w-4 h-4 border-2 border-[#E8B4B8]/30 border-t-[#E8B4B8] rounded-full animate-spin" /> : <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="1.5">
                                                <path
                                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>}
            </div>}
        </div>
    );
}