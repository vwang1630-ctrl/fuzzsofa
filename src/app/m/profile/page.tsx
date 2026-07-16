"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../sofaapp.css";

// ===== 类型定义 =====
interface OrderItem {
    name: string;
    color: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    id: string;
    date: string;
    status: "pending" | "paid" | "shipped" | "delivered";
    total: number;
    items: OrderItem[];
}

interface SavedAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    label?: string;
}

// ===== 主页面组件 =====
export default function MobileProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"orders" | "favorites" | "addresses" | "settings">("orders");

    // 模拟用户数据
    const user = {
        name: "Alexander Chen",
        email: "alexander@fuzz.design",
        avatar: null,
        memberLevel: "Gold Member"
    };

    // 模拟订单数据
    const orders: Order[] = [
        {
            id: "FZ-2024-0892",
            date: "2024-12-15",
            status: "delivered",
            total: 3500,
            items: [
                {
                    name: "Owl Chair",
                    color: "Snowy White",
                    quantity: 1,
                    price: 3500,
                    image: "/products/owl/snowy-white.png"
                }
            ]
        },
        {
            id: "FZ-2024-0756",
            date: "2024-11-28",
            status: "shipped",
            total: 7800,
            items: [
                {
                    name: "Silverback Sofa",
                    color: "Charcoal",
                    quantity: 1,
                    price: 7800,
                    image: "/products/gorilla-sofa/gray.jpg"
                }
            ]
        }
    ];

    // 模拟地址数据
    const addresses: SavedAddress[] = [
        {
            fullName: "Alexander Chen",
            addressLine1: "123 Design District",
            addressLine2: "Suite 456",
            city: "San Francisco",
            state: "CA",
            zipCode: "94107",
            country: "United States",
            label: "Home"
        }
    ];

    // 订单状态统计
    const orderStats = [
        { label: "Pending", count: 0, icon: "clock", status: "pending" },
        { label: "Paid", count: 0, icon: "credit-card", status: "paid" },
        { label: "Shipped", count: 1, icon: "truck", status: "shipped" },
        { label: "Completed", count: 1, icon: "check-circle", status: "delivered" }
    ];

    return (
        <div className="app">
            <div className="profile-page-new">
                {/* ===== 顶部用户信息区 ===== */}
                <div className="profile-user-section">
                    <div className="profile-user-card-new">
                        <div className="profile-avatar-new">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="profile-user-info-new">
                            <h1 className="profile-user-name-new">{user.name}</h1>
                        </div>
                        <button className="profile-edit-btn-new" onClick={() => router.push("/m/profile/settings")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ===== 订单状态入口 ===== */}
                <div className="profile-orders-section">
                    <div className="profile-section-header">
                        <h2 className="profile-section-title">MY ORDERS</h2>
                        <Link href="/m/profile/orders" className="profile-section-link">
                            View All
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </div>
                    <div className="profile-order-grid">
                        {orderStats.map((stat) => (
                            <Link
                                key={stat.status}
                                href={`/m/profile/orders?status=${stat.status}`}
                                className="profile-order-stat"
                            >
                                <div className="profile-order-stat-icon">
                                    {stat.icon === "clock" && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    )}
                                    {stat.icon === "credit-card" && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                    )}
                                    {stat.icon === "truck" && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="1" y="3" width="15" height="13" />
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                            <circle cx="5.5" cy="18.5" r="2.5" />
                                            <circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                    )}
                                    {stat.icon === "check-circle" && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    )}
                                </div>
                                <span className="profile-order-stat-label">{stat.label}</span>
                                {stat.count > 0 && (
                                    <span className="profile-order-stat-badge">{stat.count}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ===== 功能列表 ===== */}
                <div className="profile-functions-section">
                    <div className="profile-function-list">
                        <Link href="/m/profile/addresses" className="profile-function-item">
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>My Addresses</span>
                            </div>
                            <svg className="profile-function-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>

                        <Link href="/m/profile/favorites" className="profile-function-item">
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>My Favorites</span>
                            </div>
                            <div className="profile-function-right">
                                <span className="profile-function-count">3</span>
                                <svg className="profile-function-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/m/profile/payment" className="profile-function-item">
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                <span>Payment Methods</span>
                            </div>
                            <svg className="profile-function-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>

                        <Link href="/m/profile/coupons" className="profile-function-item">
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="20 12 20 22 4 22 4 12" />
                                    <rect x="2" y="7" width="20" height="5" />
                                    <line x1="12" y1="22" x2="12" y2="7" />
                                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                </svg>
                                <span>My Coupons</span>
                            </div>
                            <svg className="profile-function-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* ===== 设置与退出 ===== */}
                <div className="profile-settings-section">
                    <div className="profile-function-list">
                        <Link href="/m/profile/settings" className="profile-function-item">
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                <span>Account Settings</span>
                            </div>
                            <svg className="profile-function-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>

                        <button className="profile-function-item profile-signout-btn" onClick={() => {}}>
                            <div className="profile-function-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span>Sign Out</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* ===== 最近订单预览 ===== */}
                {orders.length > 0 && (
                    <div className="profile-recent-orders">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">RECENT ORDERS</h2>
                        </div>
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/m/profile/orders/${order.id}`}
                                className="profile-recent-order-card"
                            >
                                <div className="profile-order-card-header">
                                    <span className="profile-order-id">{order.id}</span>
                                    <span className={`profile-order-status profile-order-status-${order.status}`}>
                                        {order.status === "delivered" ? "Completed" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <div className="profile-order-card-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="profile-order-item">
                                            <div className="profile-order-item-image">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} />
                                                ) : (
                                                    <div className="profile-order-item-placeholder" />
                                                )}
                                            </div>
                                            <div className="profile-order-item-info">
                                                <p className="profile-order-item-name">{item.name}</p>
                                                <p className="profile-order-item-variant">{item.color} × {item.quantity}</p>
                                            </div>
                                            <p className="profile-order-item-price">${typeof item.price === 'number' ? item.price.toLocaleString() : '0'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="profile-order-card-footer">
                                    <span className="profile-order-date">{order.date}</span>
                                    <span className="profile-order-total">${typeof order.total === 'number' ? order.total.toLocaleString() : '0'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
