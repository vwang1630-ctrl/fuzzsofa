"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import "@/app/m/sofaapp.css";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { region } = useCart();
  const [orderId, setOrderId] = useState<string>("");
  const [orderItems, setOrderItems] = useState<{ name: string; color: string; quantity: number; price: number }[]>([]);
  const [total, setTotal] = useState<number>(0);

  // 商品图片映射
  const slugToImage: Record<string, string> = {
    "owl-sofa": "/products/owl/black-leather.png",
    "owl": "/products/owl/black-leather.png",
  };

  useEffect(() => {
    // 从URL参数获取订单ID和商品信息
    const id = searchParams.get("orderId") || "";
    const itemsJson = searchParams.get("items") || "[]";
    const totalAmount = searchParams.get("total") || "0";

    setOrderId(id);
    try {
      setOrderItems(JSON.parse(decodeURIComponent(itemsJson)));
    } catch {
      setOrderItems([]);
    }
    setTotal(Number(totalAmount));
  }, [searchParams]);

  const handleClose = () => {
    router.push("/m");
  };

  return (
    <div className="shop-page" id="orderSuccessPage">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <button onClick={handleClose} className="shop-header-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="shop-header-title">Order Confirmed</h1>
        <span></span>
      </div>

      <div className="shop-content">
        {/* 成功图标 */}
        <div className="order-success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="order-success-title">Order Submitted Successfully</p>
        <p className="order-success-id">Order ID: {orderId}</p>

        {/* 商品明细 */}
        <div className="order-details-section">
          <div className="shop-section-title">Order Details</div>
          {orderItems.map((item, index) => (
            <div key={index} className="order-details-row">
              <div className="order-details-item">
                <span className="order-details-name">
                  {item.name} ×{item.quantity}
                </span>
              </div>
              <span className="order-details-price">
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          
          {/* 总金额 */}
          <div className="order-details-total-row">
            <span className="order-details-total-label">Total</span>
            <span className="order-details-total-value">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* 确认信息 */}
        <div className="order-confirm-section">
          <div className="shop-section-title">Confirmation Email Sent</div>
          <p className="order-confirm-text">
            A confirmation email has been sent to your email address. Please check your inbox for order details and tracking information.
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="order-success-actions">
          <button className="panel-confirm-btn" onClick={() => router.push("/m")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}