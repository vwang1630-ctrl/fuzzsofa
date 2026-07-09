'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSavedAddresses, SavedAddress } from '@/lib/address-storage';
import '@/app/m/sofaapp.css';

type Tab = 'orders' | 'addresses' | 'favorites' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  
  useEffect(() => {
    setSavedAddresses(getSavedAddresses());
  }, []);
  
  const handleBack = () => {
    router.push('/m');
  };

  // Tab配置
  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: 'Orders' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'settings', label: 'Settings' },
  ];
  
  return (
    <div className="shop-page profile-page">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <button onClick={handleBack} className="shop-header-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="shop-header-title">My Account</h1>
        <span></span>
      </div>
      
      <div className="shop-content profile-content">
        {/* 用户信息卡片 */}
        <div className="profile-user-card">
          <div className="profile-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="profile-user-info">
            <p className="profile-user-name">Guest User</p>
            <p className="profile-user-email">Sign in to sync your data</p>
          </div>
        </div>
        
        {/* 登录按钮 */}
        <button className="profile-signin-btn">
          Sign In / Register
        </button>

        {/* 标签页导航 */}
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="profile-tab-content">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'addresses' && <AddressesTab addresses={savedAddresses} />}
          {activeTab === 'favorites' && <FavoritesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

// 订单标签页
function OrdersTab() {
  const router = useRouter();
  
  return (
    <div className="profile-section">
      {/* 订单统计卡片 */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card" onClick={() => router.push('/m/orders')}>
          <div className="profile-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <span className="profile-stat-label">All Orders</span>
        </div>
        <div className="profile-stat-card" onClick={() => router.push('/m/orders?status=pending')}>
          <div className="profile-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="profile-stat-label">Pending</span>
        </div>
        <div className="profile-stat-card" onClick={() => router.push('/m/orders?status=shipped')}>
          <div className="profile-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="profile-stat-label">Shipping</span>
        </div>
        <div className="profile-stat-card" onClick={() => router.push('/m/orders?status=delivered')}>
          <div className="profile-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="profile-stat-label">Completed</span>
        </div>
      </div>

      {/* 空状态 */}
      <div className="profile-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
        <p className="profile-empty-title">No Orders Yet</p>
        <p className="profile-empty-text">Start shopping to see your orders here</p>
        <button className="profile-empty-btn" onClick={() => router.push('/m')}>
          Browse Collection
        </button>
      </div>
    </div>
  );
}

// 地址标签页
function AddressesTab({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();

  return (
    <div className="profile-section">
      {addresses.length > 0 ? (
        <div className="profile-address-list">
          {addresses.map((addr, index) => (
            <div key={index} className="profile-address-card">
              <div className="profile-address-info">
                <p className="profile-address-name">{addr.fullName}</p>
                <p className="profile-address-detail">{addr.addressLine1}</p>
                {addr.addressLine2 && (
                  <p className="profile-address-detail">{addr.addressLine2}</p>
                )}
                <p className="profile-address-detail">
                  {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}
                </p>
                <p className="profile-address-detail">{addr.country}</p>
              </div>
              <div className="profile-address-actions">
                <button className="profile-address-edit-btn">Edit</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="profile-empty-title">No Saved Addresses</p>
          <p className="profile-empty-text">Your saved addresses will appear here</p>
        </div>
      )}
      
      <button 
        className="profile-add-address-btn"
        onClick={() => router.push('/m/profile/addresses/new')}
      >
        + Add New Address
      </button>
    </div>
  );
}

// 收藏标签页
function FavoritesTab() {
  const router = useRouter();
  
  return (
    <div className="profile-section">
      <div className="profile-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <p className="profile-empty-title">No Favorites Yet</p>
        <p className="profile-empty-text">Save your favorite items to view them later</p>
        <button className="profile-empty-btn" onClick={() => router.push('/m')}>
          Discover Products
        </button>
      </div>
    </div>
  );
}

// 设置标签页
function SettingsTab() {
  const router = useRouter();
  
  const menuItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      label: 'Account Settings',
      action: () => router.push('/m/profile/settings'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      label: 'Payment Methods',
      action: () => {},
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      label: 'Help & Support',
      action: () => router.push('/m/profile/help'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
      label: 'Sign Out',
      action: () => {},
      isDestructive: true,
    },
  ];

  return (
    <div className="profile-section">
      <div className="profile-menu-list">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`profile-menu-item ${item.isDestructive ? 'destructive' : ''}`}
            onClick={item.action}
          >
            <span className="profile-menu-icon">{item.icon}</span>
            <span className="profile-menu-label">{item.label}</span>
            {!item.isDestructive && (
              <svg className="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
