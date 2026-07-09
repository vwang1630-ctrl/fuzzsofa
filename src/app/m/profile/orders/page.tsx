'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getOrders, type Order } from '@/lib/order-storage';

const statusFilters = ['All', 'Pending', 'Shipping', 'Completed'] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const loadOrders = useCallback(() => {
    const storedOrders = getOrders();
    console.log('Loaded orders:', storedOrders);
    console.log('Orders count:', storedOrders.length);
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    loadOrders();
    // Listen for storage changes from other tabs/windows
    const handleStorage = (e: StorageEvent) => {
      console.log('Storage event:', e.key);
      if (e.key === 'fuzz_orders') {
        loadOrders();
      }
    };
    window.addEventListener('storage', handleStorage);
    // Also check when page becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page visible, reloading orders');
        loadOrders();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    // Force reload every 2 seconds when page is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadOrders();
      }
    }, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [loadOrders]);

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="page page-orders active" id="pageOrders">
      {/* Header */}
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">&lsaquo;</Link>
        <span className="title">My Orders</span>
      </div>

      {/* Status Filters */}
      <div className="order-filters">
        {statusFilters.map((filter) => (
          <button 
            key={filter} 
            className={`order-filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <div className="empty-text">No orders yet</div>
          <Link href="/m" className="empty-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="order-list" id="orderList">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div className="order-top">
                <div className="order-id-group">
                  <span className="order-id-label">Order</span>
                  <span className="order-id">#{order.id}</span>
                </div>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="order-item-image">
                      <img src={item.image || '/products/placeholder.jpg'} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-spec">
                        {item.color}{item.fabric ? ` / ${item.fabric}` : ''}
                      </div>
                      <div className="order-item-price">
                        ${item.price.toLocaleString()} × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-bottom">
                <div className="order-date-group">
                  <span className="order-date-label">Date</span>
                  <span className="order-date">{formatDate(order.date)}</span>
                </div>
                <div className="order-total-group">
                  <span className="order-total-label">Total</span>
                  <span className="order-total">${order.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-actions">
                {order.status === 'Pending' && (
                  <button className="order-action-btn">Track Order</button>
                )}
                {order.status === 'Shipping' && (
                  <button className="order-action-btn">Track Order</button>
                )}
                {order.status === 'Completed' && (
                  <button className="order-action-btn">Buy Again</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
