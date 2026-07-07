'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSavedAddresses, SavedAddress } from '@/lib/address-storage';
import '@/app/m/sofaapp.css';

export default function ProfilePage() {
  const router = useRouter();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  
  useEffect(() => {
    setSavedAddresses(getSavedAddresses());
  }, []);
  
  const handleBack = () => {
    router.push('/m');
  };
  
  // 菜单项配置
  const menuItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      label: 'My Orders',
      path: '/m/orders',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Saved Addresses',
      count: savedAddresses.length,
      action: () => router.push('/m/addresses'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      label: 'Payment Methods',
      action: () => router.push('/m/payment-methods'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      label: 'Settings',
      action: () => router.push('/m/settings'),
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
      action: () => router.push('/m/help'),
    },
  ];
  
  return (
    <div className="shop-page">
      {/* 顶部导航栏 */}
      <div className="shop-header">
        <button onClick={handleBack} className="shop-header-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="shop-header-title">Profile</h1>
        <span></span>
      </div>
      
      <div className="shop-content">
        {/* 用户信息卡片 */}
        <div className="profile-user-card">
          <div className="profile-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5">
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
        
        {/* 菜单列表 */}
        <div className="profile-menu-section">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className="profile-menu-item"
              onClick={item.action}
            >
              <div className="profile-menu-icon">{item.icon}</div>
              <span className="profile-menu-label">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="profile-menu-count">{item.count}</span>
              )}
              <svg className="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}