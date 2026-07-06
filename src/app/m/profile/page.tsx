'use client';

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="page page-profile active" id="pageProfile">
      <div className="profile-header">
        <div className="avatar-lg">👤</div>
        <div className="info">
          <div className="name">Fuzz Studio</div>
          <div className="email">studio@fuzzsofa.com</div>
        </div>
        <button className="edit-btn" id="profileEdit">编辑</button>
      </div>
      <div className="profile-menu">
        <Link href="/m/profile/orders" className="menu-item" id="profileOrders">
          <svg className="icon-sm" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          我的订单
          <span className="badge" id="orderBadge">0</span>
          <span className="arrow">→</span>
        </Link>
        <Link href="/m/profile/favorites" className="menu-item" id="profileFavorites">
          <svg className="icon-sm" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          我的收藏
          <span className="badge" id="favBadge">0</span>
          <span className="arrow">→</span>
        </Link>
        <Link href="/m/profile/addresses" className="menu-item" id="profileAddress">
          <svg className="icon-sm" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          地址管理
          <span className="arrow">→</span>
        </Link>
        <Link href="/m/profile/settings" className="menu-item" id="profileSettings">
          <svg className="icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          设置与隐私
          <span className="arrow">→</span>
        </Link>
        <Link href="/m/profile/help" className="menu-item" id="profileHelp">
          <svg className="icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          帮助与反馈
          <span className="arrow">→</span>
        </Link>
        <Link href="/m/auth/login" className="menu-item" id="profileLogin">
          <span style={{ fontSize: 16 }}>🔑</span>
          登录/注册
          <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
