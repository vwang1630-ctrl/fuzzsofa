'use client';

import Link from 'next/link';

interface OrderItem {
  name: string;
  color: string;
  fabric: string;
  price: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
  total: string;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: 'FUZZ-20260628-001',
    date: 'Jun 28, 2026',
    status: 'Pending',
    total: '$7,800',
    items: [
      { name: 'Gorilla Sofa', color: 'Snow White', fabric: 'Cloud Touch', price: '$7,800', image: '/products/gorilla-sofa.jpg' }
    ]
  },
  {
    id: 'FUZZ-20260610-003',
    date: 'Jun 10, 2026',
    status: 'Shipping',
    total: '$3,500',
    items: [
      { name: 'Ring Sofa', color: 'Space Grey', fabric: 'Velvet', price: '$3,500', image: '/products/ring-sofa.jpg' }
    ]
  },
  {
    id: 'FUZZ-20260515-002',
    date: 'May 15, 2026',
    status: 'Completed',
    total: '$5,200',
    items: [
      { name: 'Owl Chair', color: 'Warm Beige', fabric: 'Linen', price: '$5,200', image: '/products/owl-chair.jpg' }
    ]
  }
];

const statusFilters = ['All', 'Pending', 'Shipping', 'Completed'] as const;

export default function OrdersPage() {
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
          <button key={filter} className={`order-filter-btn ${filter === 'All' ? 'active' : ''}`}>
            {filter}
          </button>
        ))}
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <div className="empty-text">No orders yet</div>
        </div>
      ) : (
        <div className="order-list" id="orderList">
          {orders.map((order) => (
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
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-spec">{item.color} &middot; {item.fabric}</div>
                      <div className="order-item-price">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-footer">
                <span className="order-date">{order.date}</span>
                <span className="order-total">Total: {order.total}</span>
              </div>

              {/* Order Actions */}
              <div className="order-actions">
                <button className="order-action-btn">View Details</button>
                {order.status === 'Shipping' && (
                  <button className="order-action-btn primary">Track Order</button>
                )}
                {order.status === 'Completed' && (
                  <button className="order-action-btn primary">Buy Again</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
