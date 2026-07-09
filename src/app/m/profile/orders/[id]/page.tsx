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
