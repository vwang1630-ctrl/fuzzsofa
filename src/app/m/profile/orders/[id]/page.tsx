"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrders, type Order } from "@/lib/order-storage";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const orders = getOrders();
        const found = orders.find(o => o.id === orderId);
        if (found) {
            setOrder(found);
        }
        setLoading(false);
    }, [orderId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    };

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

    // 模拟物流数据
    const getShippingData = (status: string) => {
        const baseDate = order ? new Date(order.date) : new Date();
        
        if (status === "Shipping" || status === "Completed") {
            return {
                trackingNumber: "SF" + Math.random().toString().slice(2, 12),
                carrier: "DHL Express",
                estimatedDelivery: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                events: [
                    { status: "Order Placed", location: "Shanghai, CN", time: baseDate.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), flight: "" },
                    { status: "In Transit", location: "Anchorage, US", time: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), flight: "CX-880" },
                    { status: "Customs Cleared", location: "Los Angeles, US", time: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), flight: "" },
                    { status: "Out for Delivery", location: "Local Facility", time: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), flight: "" }
                ]
            };
        }
        return null;
    };

    // 模拟配送地址
    const getShippingAddress = () => {
        return {
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States"
        };
    };

    if (loading) {
        return (
            <div
                style={{
                    background: "#0A0A0A",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <div
                    style={{
                        width: "24px",
                        height: "24px",
                        border: "2px solid #333",
                        borderTopColor: "#E8B4B8",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}
                />
            </div>
        );
    }

    if (!order) {
        return (
            <div
                style={{
                    background: "#0A0A0A",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem"
                }}>
                <p
                    style={{
                        color: "#8A8580",
                        fontSize: "14px",
                        marginBottom: "1rem"
                    }}>
                    Order not found
                </p>
                <button
                    onClick={() => router.push("/m/profile")}
                    style={{
                        background: "transparent",
                        border: "1px solid #E8B4B8",
                        color: "#E8B4B8",
                        padding: "10px 20px",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer"
                    }}>
                    Back to Orders
                </button>
            </div>
        );
    }

    const shippingData = getShippingData(order.status);
    const shippingAddress = getShippingAddress();

    return (
        <div
            style={{
                background: "#0A0A0A",
                minHeight: "100vh",
                paddingBottom: "2rem"
            }}>
            {/* Header */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    background: "#0A0A0A",
                    borderBottom: "1px solid #1A1A1A",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    zIndex: 100
                }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#E8B4B8",
                        cursor: "pointer",
                        padding: "4px"
                    }}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1
                    style={{
                        color: "#F5F0EB",
                        fontSize: "16px",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontFamily: "'Cormorant Garamond', Georgia, serif"
                    }}>
                    Order Details
                </h1>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Order Info Card */}
                <div
                    style={{
                        background: "#111111",
                        border: "1px solid #1A1A1A",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px"
                        }}>
                        <div>
                            <p
                                style={{
                                    color: "#8A8580",
                                    fontSize: "11px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    marginBottom: "4px"
                                }}>
                                Order Number
                            </p>
                            <p
                                style={{
                                    color: "#F5F0EB",
                                    fontSize: "14px",
                                    fontFamily: "monospace"
                                }}>
                                #{order.id.slice(-8)}
                            </p>
                        </div>
                        <span
                            style={{
                                color: getStatusColor(order.status),
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 12px",
                                border: `1px solid ${getStatusColor(order.status)}`
                            }}>
                            {order.status}
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "16px",
                            borderTop: "1px solid #1A1A1A"
                        }}>
                        <p
                            style={{
                                color: "#8A8580",
                                fontSize: "12px"
                            }}>
                            {formatDate(order.date)}
                        </p>
                        <p
                            style={{
                                color: "#E8B4B8",
                                fontSize: "16px",
                                fontWeight: 500
                            }}>
                            {formatPrice(order.total)}
                        </p>
                    </div>
                </div>

                {/* Shipping Info - 物流信息 */}
                {shippingData && (
                    <div
                        style={{
                            background: "#111111",
                            border: "1px solid #1A1A1A",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                        <h2
                            style={{
                                color: "#8A8580",
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                marginBottom: "16px"
                            }}>
                            Shipping Information
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>Tracking Number</span>
                                <span style={{ color: "#F5F0EB", fontSize: "12px", fontFamily: "monospace" }}>{shippingData.trackingNumber}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>Carrier</span>
                                <span style={{ color: "#F5F0EB", fontSize: "12px" }}>{shippingData.carrier}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>Estimated Delivery</span>
                                <span style={{ color: "#E8B4B8", fontSize: "12px" }}>{shippingData.estimatedDelivery}</span>
                            </div>
                        </div>

                        {/* DDP Banner */}
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "12px",
                                background: "rgba(232, 180, 184, 0.05)",
                                border: "1px solid rgba(232, 180, 184, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span style={{ color: "#E8B4B8", fontSize: "11px", letterSpacing: "0.05em" }}>DDP Shipping - All taxes included</span>
                        </div>
                    </div>
                )}

                {/* Timeline - 物流时间线 */}
                {shippingData && shippingData.events.length > 0 && (
                    <div
                        style={{
                            background: "#111111",
                            border: "1px solid #1A1A1A",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                        <h2
                            style={{
                                color: "#8A8580",
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                marginBottom: "16px"
                            }}>
                            Tracking Timeline
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {shippingData.events.map((event, index) => (
                                <div key={index} style={{ display: "flex", gap: "16px" }}>
                                    {/* Timeline dot and line */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                background: index === shippingData.events.length - 1 ? "#E8B4B8" : "#333",
                                                border: index === shippingData.events.length - 1 ? "2px solid #E8B4B8" : "2px solid #333",
                                                flexShrink: 0
                                            }}
                                        />
                                        {index < shippingData.events.length - 1 && (
                                            <div style={{ width: "1px", height: "40px", background: "#333" }} />
                                        )}
                                    </div>

                                    {/* Event content */}
                                    <div style={{ paddingBottom: "16px" }}>
                                        <p style={{ color: "#F5F0EB", fontSize: "13px", marginBottom: "4px" }}>{event.status}</p>
                                        <p style={{ color: "#8A8580", fontSize: "11px" }}>{event.location}</p>
                                        <p style={{ color: "#6A6560", fontSize: "10px", marginTop: "2px" }}>{event.time}</p>
                                        {event.flight && (
                                            <p style={{ color: "#6A6560", fontSize: "10px", marginTop: "2px" }}>Flight: {event.flight}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div style={{ marginBottom: "20px" }}>
                    <h2
                        style={{
                            color: "#F5F0EB",
                            fontSize: "14px",
                            fontWeight: 400,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            marginBottom: "16px"
                        }}>
                        Items
                    </h2>

                    <div
                        style={{
                            background: "#111111",
                            border: "1px solid #1A1A1A"
                        }}>
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    gap: "16px",
                                    padding: "16px",
                                    borderBottom: index < order.items.length - 1 ? "1px solid #1A1A1A" : "none"
                                }}>
                                {/* Product Image */}
                                <div
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        flexShrink: 0,
                                        background: "#1A1A1A",
                                        overflow: "hidden"
                                    }}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#333",
                                                fontSize: "20px"
                                            }}>
                                            {(item.name || "?").charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div style={{ flex: 1 }}>
                                    <p
                                        style={{
                                            color: "#F5F0EB",
                                            fontSize: "14px",
                                            marginBottom: "4px"
                                        }}>
                                        {item.name}
                                    </p>
                                    <p
                                        style={{
                                            color: "#8A8580",
                                            fontSize: "12px",
                                            marginBottom: "8px"
                                        }}>
                                        {item.color} × {item.quantity}
                                    </p>
                                    <p
                                        style={{
                                            color: "#F5F0EB",
                                            fontSize: "14px"
                                        }}>
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div
                    style={{
                        background: "#111111",
                        border: "1px solid #1A1A1A",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                    <h2
                        style={{
                            color: "#8A8580",
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: "16px"
                        }}>
                        Order Summary
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px"
                            }}>
                            <span style={{ color: "#8A8580" }}>Subtotal</span>
                            <span style={{ color: "#F5F0EB" }}>{formatPrice(order.total)}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px"
                            }}>
                            <span style={{ color: "#8A8580" }}>Shipping</span>
                            <span style={{ color: "#F5F0EB" }}>Free</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                                paddingTop: "12px",
                                borderTop: "1px solid #1A1A1A"
                            }}>
                            <span style={{ color: "#F5F0EB" }}>Total</span>
                            <span style={{ color: "#E8B4B8" }}>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address - 配送地址 */}
                <div
                    style={{
                        background: "#111111",
                        border: "1px solid #1A1A1A",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                    <h2
                        style={{
                            color: "#8A8580",
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: "16px"
                        }}>
                        Shipping Address
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <p style={{ color: "#F5F0EB", fontSize: "14px" }}>{shippingAddress.name}</p>
                        <p style={{ color: "#F5F0EB", fontSize: "12px" }}>{shippingAddress.email}</p>
                        <p style={{ color: "#8A8580", fontSize: "12px" }}>{shippingAddress.phone}</p>
                        <p style={{ color: "#8A8580", fontSize: "12px", lineHeight: 1.6 }}>
                            {shippingAddress.addressLine1}
                            {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                            <br />
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                            <br />
                            {shippingAddress.country}
                        </p>
                    </div>
                </div>

                {/* Logistics Service Info - 物流服务信息 */}
                {(order.status === "Shipping" || order.status === "Completed") && (
                    <div
                        style={{
                            background: "#111111",
                            border: "1px solid #1A1A1A",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                        <h2
                            style={{
                                color: "#8A8580",
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                marginBottom: "16px"
                            }}>
                            Shipping Services
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>DDP Shipping - All taxes included</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>Real-time tracking timeline</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span style={{ color: "#8A8580", fontSize: "12px" }}>Lost package claim support</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {order.status === "Shipping" && (
                        <button
                            className="panel-confirm-btn"
                            style={{
                                width: "100%",
                                padding: "14px",
                                fontSize: "12px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: "pointer"
                            }}>
                            Track Order
                        </button>
                    )}
                    {order.status === "Completed" && (
                        <button
                            className="panel-confirm-btn"
                            style={{
                                width: "100%",
                                padding: "14px",
                                fontSize: "12px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: "pointer"
                            }}>
                            Buy Again
                        </button>
                    )}
                    <button
                        onClick={() => router.push("/m/profile")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "transparent",
                            border: "1px solid #333",
                            color: "#8A8580",
                            fontSize: "12px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            cursor: "pointer"
                        }}>
                        Back to Orders
                    </button>
                </div>
            </div>
        </div>
    );
}
