'use client';

import Link from 'next/link';

const orders = [
  { id: 'FUZZ-20260628-001', name: 'Gorilla Sofa', color: '雪山白', fabric: 'Cloud Touch', price: '$7,800', status: '制作中', date: '2026-06-28' },
  { id: 'FUZZ-20260610-003', name: 'Ring Sofa', color: '太空灰', fabric: 'Velvet', price: '$3,500', status: '已发货', date: '2026-06-10' },
];

export default function OrdersPage() {
  return (
    <div className="page page-orders active" id="pageOrders">
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">‹</Link>
        <span className="title">我的订单</span>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          <div className="empty-text">暂无订单</div>
        </div>
      ) : (
        <div className="order-list" id="orderList">
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-top">
                <span className="order-id">{o.id}</span>
                <span className={`order-status status-${o.status === '制作中' ? 'making' : 'shipped'}`}>{o.status}</span>
              </div>
              <div className="order-body">
                <div className="order-info">
                  <div className="order-name">{o.name}</div>
                  <div className="order-detail">{o.color} · {o.fabric}</div>
                  <div className="order-price">{o.price}</div>
                </div>
              </div>
              <div className="order-date">{o.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
