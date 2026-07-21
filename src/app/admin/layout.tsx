'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Braces,
  Bell,
  LogOut,
  PawPrint,
} from 'lucide-react';
import { getSupabaseBrowserClientWithRetry } from '@/lib/supabase-browser';

const navItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: '商品管理', icon: Package, exact: false },
  { href: '/admin/orders', label: '订单管理', icon: ShoppingBag, exact: false },
];

const apiNavItem = {
  href: '/admin/api-docs',
  label: 'API 文档',
  icon: Braces,
  exact: false,
};

function isActiveRoute(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('admin@fuzzsofa.com');
  const [authChecked, setAuthChecked] = useState(false);

  // Get session token from Supabase
  useEffect(() => {
    async function getSession() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSessionToken(session?.access_token ?? null);
        if (session?.user?.email) {
          setAdminEmail(session.user.email);
        }
      } catch {
        // Silently fail - will be handled by API calls
      } finally {
        setAuthChecked(true);
      }
    }
    getSession();
  }, []);

  const authHeaders = useCallback(() => {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (sessionToken) {
      h['x-session'] = sessionToken;
    }
    return h;
  }, [sessionToken]);

  const handleLogout = async () => {
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push('/');
  };

  // Get user initials for avatar
  const getInitial = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{
        background: '#F6F8FB',
        color: '#152033',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 border-b"
        style={{
          background: '#FFFFFF',
          height: '3.5rem',
          borderColor: 'rgba(230, 234, 242, 0.5)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#2F6BFF' }}
          >
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-base" style={{ color: '#152033' }}>
            FUZZ SOFA
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-md ml-1"
            style={{ background: '#EDF0F5', color: '#637089' }}
          >
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-md transition-colors"
            style={{ color: '#637089' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#152033';
              e.currentTarget.style.background = '#EDF0F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#637089';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#EF4444' }}
            />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#EBF1FF' }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: '#2F6BFF' }}
              >
                {getInitial(adminEmail)}
              </span>
            </div>
            <span
              className="text-sm font-medium hidden sm:inline"
              style={{ color: '#152033' }}
            >
              {adminEmail.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ color: '#637089' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#637089';
              e.currentTarget.style.background = 'transparent';
            }}
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">退出</span>
          </button>
        </div>
      </header>

      <div className="flex" style={{ height: 'calc(100vh - 3.5rem)' }}>
        {/* Sidebar */}
        <aside
          className="w-56 shrink-0 overflow-y-auto"
          style={{
            background: '#FFFFFF',
            borderRight: '1px solid rgba(230, 234, 242, 0.5)',
          }}
        >
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors"
                  style={
                    active
                      ? { background: 'rgba(47, 107, 255, 0.1)', color: '#2F6BFF' }
                      : { color: '#637089' }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = '#EDF0F5';
                      e.currentTarget.style.color = '#152033';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#637089';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div
              className="pt-3 mt-3"
              style={{ borderTop: '1px solid rgba(230, 234, 242, 0.5)' }}
            >
              <Link
                href={apiNavItem.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors"
                style={{ color: '#637089' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EDF0F5';
                  e.currentTarget.style.color = '#152033';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#637089';
                }}
              >
                <Braces className="w-4 h-4" />
                {apiNavItem.label}
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6" style={{ background: '#F6F8FB' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
