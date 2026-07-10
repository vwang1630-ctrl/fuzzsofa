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
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    loadOrders();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'fuzz_orders') {
        loadOrders();
      }
    };
    window.addEventListener('storage', handleStorage);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadOrders();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
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
    <div className="orders-page-new">
      {/* Header */}
      <div className="orders-header-new">
        <Link href="/m/profile" className="orders-back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="orders-title-new">MY ORDERS</h1>
        <span className="orders-header-right"></span>
      </div>

      {/* Status Filters */}
      <div className="orders-filters-new">
        {statusFilters.map((filter) => (
          <button 
            key={filter} 
            className={`orders-filter-btn-new ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="orders-content-new">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-new">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <p className="orders-empty-title">No Orders Yet</p>
            <p className="orders-empty-text">Start shopping to see your orders here</p>
            <Link href="/m" className="orders-empty-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list-new">
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/m/profile/orders/${order.id}`} className="orders-card-new" style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* Order Header */}
                <div className="orders-card-header">
                  <div className="orders-order-id-group">
                    <span className="orders-order-id-label">Order</span>
                    <span className="orders-order-id-value">#{order.id}</span>
                  </div>
                  <span className={`orders-order-status orders-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="orders-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="orders-item-row">
                      <div className="orders-item-image">
                        <img src={item.image || '/products/placeholder.jpg'} alt={item.name} />
                      </div>
                      <div className="orders-item-info">
                        <p className="orders-item-name">{item.name}</p>
                        <p className="orders-item-variant">
                          {item.color}{item.fabric ? ` / ${item.fabric}` : ''} × {item.quantity}
                        </p>
                      </div>
                      <p className="orders-item-price">
                        ${typeof item.price === 'number' ? item.price.toLocaleString() : '0'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="orders-card-footer">
                  <div className="orders-date-group">
                    <span className="orders-date-label">Date</span>
                    <span className="orders-date-value">{formatDate(order.date)}</span>
                  </div>
                  <div className="orders-total-group">
                    <span className="orders-total-label">Total</span>
                    <span className="orders-total-value">${typeof order.total === 'number' ? order.total.toLocaleString() : '0'}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="orders-actions">
                  {order.status === 'Pending' && (
                    <span className="orders-action-btn">Track Order</span>
                  )}
                  {order.status === 'Shipping' && (
                    <span className="orders-action-btn">Track Order</span>
                  )}
                  {order.status === 'Completed' && (
                    <span className="orders-action-btn">Buy Again</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
