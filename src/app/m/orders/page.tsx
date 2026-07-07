'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/m/sofaapp.css';

interface OrderItem {
  name: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // 从 localStorage 读取订单历史
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch {
        setOrders([]);
      }
    }
    
    // 检查 sessionStorage 是否有刚完成的订单
    const pendingOrderId = sessionStorage.getItem('paymentOrderId');
    const pendingItems = sessionStorage.getItem('paymentItems');
    const pendingTotal = sessionStorage.getItem('paymentTotal');
    
    if (pendingOrderId && pendingItems && pendingTotal) {
      const newOrder: Order = {
        id: pendingOrderId,
        items: JSON.parse(pendingItems),
        total: Number(pendingTotal),
        status: 'processing',
        createdAt: new Date().toISOString(),
      };
      
      // 添加到订单历史
      const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      // 清除 sessionStorage
      sessionStorage.removeItem('paymentOrderId');
      sessionStorage.removeItem('paymentItems');
      sessionStorage.removeItem('paymentTotal');
    }
  }, []);
  
  const handleBack = () => {
    router.push('/m/profile');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#8A8580';
      case 'shipped':
        return '#E8B4B8';
      case 'delivered':
        return '#E8B4B8';
      default:
        return '#8A8580';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="shop-page">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <button onClick={handleBack} className="shop-header-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="shop-header-title">My Orders</h1>
        <span></span>
      </div>
      
      <div className="shop-content">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <p className="orders-empty-text">No orders yet</p>
            <p className="orders-empty-subtext">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <span className="order-card-id">Order #{order.id}</span>
                  <span className="order-card-date">{formatDate(order.createdAt)}</span>
                </div>
                
                <div className="order-card-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-card-item">
                      <span className="order-card-item-name">{item.name}</span>
                      <span className="order-card-item-qty">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-card-footer">
                  <span className="order-card-total">$ {order.total.toFixed(2)}</span>
                  <span 
                    className="order-card-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}