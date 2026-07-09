"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSavedAddresses, SavedAddress } from "@/lib/address-storage";
import { getOrders, Order } from "@/lib/order-storage";
import "@/app/m/sofaapp.css";
type Tab = "orders" | "addresses" | "favorites" | "settings";

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

    useEffect(() => {
        setSavedAddresses(getSavedAddresses());
    }, []);

    const handleBack = () => {
        router.push("/m");
    };

    const tabs: {
        key: Tab;
        label: string;
    }[] = [{
        key: "orders",
        label: "Orders"
    }, {
        key: "addresses",
        label: "Addresses"
    }, {
        key: "favorites",
        label: "Favorites"
    }, {
        key: "settings",
        label: "Settings"
    }];

    return (
        <div className="shop-page profile-page">
            {}
            <div className="shop-header">
                <button onClick={handleBack} className="shop-header-back">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="shop-header-title">My Account</h1>
                <span></span>
            </div>
            <div className="shop-content profile-content">
                {}
                <div className="profile-user-card">
                    <div className="profile-avatar">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E8B4B8"
                            strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="profile-user-info">
                        <p className="profile-user-name">Guest User</p>
                        <p className="profile-user-email">Sign in to sync your data</p>
                    </div>
                </div>
                {}
                <button className="profile-signin-btn">Sign In / Register
                            </button>
                {}
                <div className="profile-tabs">
                    {tabs.map(tab => <button
                        key={tab.key}
                        className={`profile-tab ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}>
                        {tab.label}
                    </button>)}
                </div>
                {}
                <div className="profile-tab-content">
                    {activeTab === "orders" && <OrdersTab />}
                    {activeTab === "addresses" && <AddressesTab addresses={savedAddresses} />}
                    {activeTab === "favorites" && <FavoritesTab />}
                    {activeTab === "settings" && <SettingsTab />}
                </div>
            </div>
        </div>
    );
}

function OrdersTab() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        setOrders(getOrders());
    }, []);

    const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
        case "Pending":
            return "#E8A050";
        case "Shipping":
            return "#7EB8E0";
        case "Completed":
            return "#A8A8A8";
        case "Cancelled":
            return "#555555";
        default:
            return "#8A8580";
        }
    };

    return (
        <div className="profile-section">
            {}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    padding: "16px",
                    overflowX: "auto",
                    borderBottom: "1px solid #1A1A1A"
                }}>
                {[{
                    key: "all",
                    label: "All",
                    count: orders.length
                }, {
                    key: "Pending",
                    label: "Pending",
                    count: orders.filter(o => o.status === "Pending").length
                }, {
                    key: "Shipping",
                    label: "Shipping",
                    count: orders.filter(o => o.status === "Shipping").length
                }, {
                    key: "Completed",
                    label: "Completed",
                    count: orders.filter(o => o.status === "Completed").length
                }, {
                    key: "Cancelled",
                    label: "Cancelled",
                    count: orders.filter(o => o.status === "Cancelled").length
                }].map(tab => <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    style={{
                        padding: "8px 16px",
                        background: filter === tab.key ? "#E8B4B8" : "transparent",
                        color: filter === tab.key ? "#0A0A0A" : "#8A8580",
                        border: `1px solid ${filter === tab.key ? "#E8B4B8" : "#333333"}`,
                        borderRadius: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}>
                    {tab.label}
                              </button>)}
            </div>
            {}
            <div
                className="orders-list"
                style={{
                    padding: "16px"
                }}>
                {filteredOrders.length === 0 ? <div
                    className="orders-empty"
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#8A8580"
                    }}>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        style={{
                            margin: "0 auto 16px",
                            opacity: 0.5
                        }}>
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p
                        style={{
                            fontSize: "14px",
                            marginBottom: "16px"
                        }}>No orders yet</p>
                    <Link
                        href="/m"
                        style={{
                            display: "inline-block",
                            padding: "12px 24px",
                            background: "rgba(232, 180, 184, 0.06)",
                            color: "#E8B4B8",
                            border: "1.5px solid rgba(232, 180, 184, 0.35)",
                            borderRadius: 0,
                            fontSize: "13px",
                            fontWeight: 500,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            transition: "all 0.3s ease"
                        }}>Start Shopping
                                    </Link>
                </div> : filteredOrders.map(order => <div
                    key={order.id}
                    className="order-card"
                    style={{
                        background: "#111111",
                        border: "1px solid #1A1A1A",
                        borderRadius: 0,
                        marginBottom: "16px",
                        overflow: "hidden"
                    }}>
                    {}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            borderBottom: "1px solid #1A1A1A"
                        }}>
                        <div>
                            <p
                                style={{
                                    fontSize: "11px",
                                    color: "#8A8580",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    marginBottom: "4px"
                                }}>Order #{order.id.slice(-8)}
                            </p>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "#6A6560"
                                }}>
                                {new Date(order.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </p>
                        </div>
                        <span
                            style={{
                                padding: "4px 12px",
                                fontSize: "11px",
                                fontWeight: 500,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: getStatusColor(order.status),
                                border: `1px solid ${getStatusColor(order.status)}`,
                                borderRadius: 0
                            }}>
                            {order.status}
                        </span>
                    </div>
                    {}
                    <div
                        style={{
                            padding: "16px"
                        }}>
                        {order.items.map((item, idx) => <div
                            key={idx}
                            style={{
                                display: "flex",
                                gap: "12px",
                                marginBottom: idx < order.items.length - 1 ? "12px" : 0
                            }}>
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "#0A0A0A",
                                    border: "1px solid #1A1A1A",
                                    borderRadius: 0,
                                    overflow: "hidden",
                                    flexShrink: 0
                                }}>
                                {item.image ? <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }} /> : <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#333"
                                    }}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>}
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0
                                }}>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#F5F0EB",
                                        marginBottom: "4px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                    {item.name}
                                </p>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#8A8580",
                                        marginBottom: "4px"
                                    }}>
                                    {item.color}× {item.quantity}
                                </p>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#E8B4B8"
                                    }}>${typeof item.price === "number" ? item.price.toLocaleString() : "0"}
                                </p>
                            </div>
                        </div>)}
                    </div>
                    {}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderTop: "1px solid #1A1A1A",
                            background: "rgba(232, 180, 184, 0.02)"
                        }}>
                        <span
                            style={{
                                fontSize: "12px",
                                color: "#8A8580",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase"
                            }}>Total
                                            </span>
                        <span
                            style={{
                                fontSize: "16px",
                                color: "#E8B4B8",
                                fontFamily: "'Cormorant Garamond', serif",
                                fontWeight: 500
                            }}>${typeof order.total === "number" ? order.total.toLocaleString() : "0"}
                        </span>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

function AddressesTab(
    {
        addresses
    }: {
        addresses: SavedAddress[];
    }
) {
    const router = useRouter();

    return (
        <div className="profile-section">
            {addresses.length > 0 ? <div className="profile-address-list">
                {addresses.map((addr, index) => <div key={index} className="profile-address-card">
                    <div className="profile-address-info">
                        <p className="profile-address-name">{addr.fullName}</p>
                        <p className="profile-address-detail">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="profile-address-detail">{addr.addressLine2}</p>}
                        <p className="profile-address-detail">
                            {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zipCode}
                        </p>
                        <p className="profile-address-detail">{addr.country}</p>
                    </div>
                    <div className="profile-address-actions">
                        <button className="profile-address-edit-btn">Edit</button>
                    </div>
                </div>)}
            </div> : <div className="profile-empty-state">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="profile-empty-title">No Saved Addresses</p>
                <p className="profile-empty-text">Your saved addresses will appear here</p>
            </div>}
            <button
                className="profile-add-address-btn"
                onClick={() => router.push("/m/profile/addresses/new")}>+ Add New Address
                      </button>
        </div>
    );
}

function FavoritesTab() {
    const router = useRouter();

    return (
        <div className="profile-section">
            <div className="profile-empty-state">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1">
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <p className="profile-empty-title">No Favorites Yet</p>
                <p className="profile-empty-text">Save your favorite items to view them later</p>
                <button className="profile-empty-btn" onClick={() => router.push("/m")}>Discover Products
                            </button>
            </div>
        </div>
    );
}

function SettingsTab() {
    const router = useRouter();

    const menuItems = [{
        icon: <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>,

        label: "Account Settings",
        action: () => router.push("/m/profile/settings")
    }, {
        icon: <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>,

        label: "Payment Methods",
        action: () => {}
    }, {
        icon: <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>,

        label: "Help & Support",
        action: () => router.push("/m/profile/help")
    }, {
        icon: <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>,

        label: "Sign Out",
        action: () => {},
        isDestructive: true
    }];

    return (
        <div className="profile-section">
            <div className="profile-menu-list">
                {menuItems.map((item, index) => <button
                    key={index}
                    className={`profile-menu-item ${item.isDestructive ? "destructive" : ""}`}
                    onClick={item.action}>
                    <span className="profile-menu-icon">{item.icon}</span>
                    <span className="profile-menu-label">{item.label}</span>
                    {!item.isDestructive && <svg
                        className="profile-menu-arrow"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>}
                </button>)}
            </div>
        </div>
    );
}