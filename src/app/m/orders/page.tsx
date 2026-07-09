'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/m/sofaapp.css';
import { getOrders, type Order, type OrderItem } from '@/lib/order-storage';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Shipping' | 'Completed' | 'Cancelled'>('all');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    loadOrders();
    
    // 监听 storage 事件，当其他页面修改订单数据时更新
    const handleStorageChange = () => loadOrders();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ordersUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ordersUpdated', handleStorageChange);
    };
  }, []);
  
  const loadOrders = () => {
    const storedOrders = getOrders();
    setOrders(storedOrders);
  };
  
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);
  
  const handleBack = () => {
    router.push('/m/profile');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#E8A050';
      case 'Shipping':
        return '#7EB8E0';
      case 'Completed':
        return '#A8A8A8';
      case 'Cancelled':
        return '#555555';
      default:
        return '#8A8580';
    }
  };
  
  const getStatusText = (status: string) => {
    return status;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };
  
  const handleViewOrder = (orderId: string) => {
    router.push(`/m/orders/${orderId}`);
  };
  
  const handleTrackOrder = (orderId: string) => {
    router.push(`/m/orders/${orderId}?track=true`);
  };
  
  const handleBuyAgain = (order: Order) => {
    // 将订单商品添加到购物车
    const cartItems = order.items.map((item: OrderItem) => ({
      id: item.name,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color || 'Default',
      image: item.image || '',
      product: {
        slug: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        price: item.price,
        images: item.image ? [item.image] : [],
        colors: item.color ? [{ name: item.color, hex: '#000000', type: 'solid', swatchImage: '' }] : [],
        category: 'sofa',
        description: '',
        dimensions: { width: 0, depth: 0, height: 0, seatHeight: 0, weight: 0 }
      }
    }));
    
    // 添加到购物车
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    cart = [...cart, ...cartItems];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    router.push('/m/cart');
  };
  
  if (!mounted) {
    return (
      <div className="orders-page" style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <div className="shop-header" style={{ background: '#0A0A0A' }}>
          <button className="back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>My Orders</h1>
          <div style={{ width: '24px' }}></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="orders-page" style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      {/* Header */}
      <div className="shop-header" style={{ background: '#0A0A0A' }}>
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1>My Orders</h1>
        <div style={{ width: '24px' }}></div>
      </div>
      
      {/* Filter Tabs */}
      <div className="orders-filter" style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '16px', 
        overflowX: 'auto',
        borderBottom: '1px solid #1A1A1A'
      }}>
        {[
          { key: 'all', label: 'All', count: orders.length },
          { key: 'Pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
          { key: 'Shipping', label: 'Shipping', count: orders.filter(o => o.status === 'Shipping').length },
          { key: 'Completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
          { key: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            style={{
              padding: '8px 16px',
              background: filter === tab.key ? '#E8B4B8' : 'transparent',
              color: filter === tab.key ? '#0A0A0A' : '#8A8580',
              border: `1px solid ${filter === tab.key ? '#E8B4B8' : '#333333'}`,
              borderRadius: 0,
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Orders List */}
      <div className="orders-list" style={{ padding: '16px' }}>
        {filteredOrders.length === 0 ? (
          <div className="orders-empty" style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8A8580'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>No orders yet</p>
            <Link 
              href="/m/shop"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'rgba(232, 180, 184, 0.06)',
                color: '#E8B4B8',
                border: '1.5px solid rgba(232, 180, 184, 0.35)',
                borderRadius: 0,
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="order-card"
              style={{
                background: '#111111',
                border: '1px solid #1A1A1A',
                borderRadius: 0,
                marginBottom: '16px',
                overflow: 'hidden'
              }}
            >
              {/* Order Header */}
              <div className="order-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #1A1A1A'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#8A8580', 
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}>
                    Order #{order.id.slice(-8)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6A6560' }}>
                    {formatDate(order.date)}
                  </div>
                </div>
                <div 
                  className="order-status"
                  style={{
                    padding: '6px 12px',
                    background: `${getStatusColor(order.status)}15`,
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`,
                    borderRadius: 0,
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="order-items" style={{ padding: '16px' }}>
                {order.items.slice(0, 2).map((item: OrderItem, idx: number) => (
                  <div 
                    key={idx}
                    className="order-item"
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: idx < Math.min(order.items.length, 2) - 1 ? '12px' : 0
                    }}
                  >
                    <div 
                      className="item-image"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: '#1A1A1A',
                        borderRadius: 0,
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#333333'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#F5F0EB',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.name}
                      </div>
                      {item.color && (
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#8A8580',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {item.color} × {item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="item-price" style={{ 
                      fontSize: '13px', 
                      color: '#E8B4B8',
                      fontWeight: 500
                    }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#8A8580',
                    textAlign: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #1A1A1A'
                  }}>
                    +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              {/* Order Footer */}
              <div className="order-footer" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderTop: '1px solid #1A1A1A',
                background: '#0A0A0A'
              }}>
                <div className="order-total" style={{ 
                  fontSize: '14px', 
                  color: '#F5F0EB',
                  fontWeight: 500
                }}>
                  Total: <span style={{ color: '#E8B4B8' }}>{formatPrice(order.total)}</span>
                </div>
                <div className="order-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      color: '#F5F0EB',
                      border: '1px solid #333333',
                      borderRadius: 0,
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View
                  </button>
                  {order.status === 'Shipping' && (
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        color: '#E8B4B8',
                        border: '1px solid rgba(232, 180, 184, 0.35)',
                        borderRadius: 0,
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Track
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <button
                      onClick={() => handleBuyAgain(order)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(232, 180, 184, 0.06)',
                        color: '#E8B4B8',
                        border: '1.5px solid rgba(232, 180, 184, 0.35)',
                        borderRadius: 0,
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
