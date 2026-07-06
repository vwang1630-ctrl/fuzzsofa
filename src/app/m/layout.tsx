'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sofaapp.css';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHome = pathname === '/m';
  const isCollection = pathname === '/m/collection';
  const isLog = pathname.startsWith('/m/log');
  const isProfile = pathname.startsWith('/m/profile') || pathname.startsWith('/m/auth');

  const isDetailPage = pathname.startsWith('/m/product/');
  const isLogDetail = pathname.match(/^\/m\/log\/\d+$/);

  const showBottomNav = !isDetailPage && !isLogDetail;

  return (
    <div className="app">
      <header className="navbar" id="mainNav">
        <Link href="/m" className="brand" id="brandHome">
          FUZZ SOFA <em>studio</em>
        </Link>
        <div className="right">
          <Link href="/m/product/meteorite" className="cart-link" id="cartLink">
            购物车 (0)
          </Link>
          <Link href="/m/profile" className="avatar-btn" id="avatarBtn">
            FS
          </Link>
        </div>
      </header>

      {children}

      {showBottomNav && (
        <nav className="bottom-nav" id="bottomNav">
          <Link href="/m" className={`tab${isHome ? ' active' : ''}`}>
            <svg className="tab-icon" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1" />
            </svg>
          </Link>
          <Link href="/m/collection" className={`tab${isCollection ? ' active' : ''}`}>
            <svg className="tab-icon" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </Link>
          <Link href="/m/log" className={`tab${isLog && !isLogDetail ? ' active' : ''}`}>
            <svg className="tab-icon" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </Link>
          <Link href="/m/profile" className={`tab${isProfile ? ' active' : ''}`}>
            <svg className="tab-icon" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </nav>
      )}

      <div id="toast">Link copied successfully</div>
    </div>
  );
}
