'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingBag,
  Users,
  FileText,
  BarChart3,
  Megaphone,
  Tag,
  Settings,
  Braces,
  LogOut,
  PawPrint,
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  Palette,
  Navigation,
  FileEdit,
} from 'lucide-react';

// ─── Shopify-style Navigation Structure ────────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/admin', label: '首页', icon: Home, exact: true },
  {
    href: '/admin/orders',
    label: '订单',
    icon: ShoppingBag,
    children: [
      { href: '/admin/orders', label: '所有订单', icon: ShoppingBag, exact: true },
      { href: '/admin/orders/drafts', label: '草稿', icon: FileEdit },
      { href: '/admin/orders/abandoned', label: '废弃结账', icon: ShoppingBag },
    ],
  },
  {
    href: '/admin/products',
    label: '产品',
    icon: Package,
    children: [
      { href: '/admin/products', label: '所有产品', icon: Package, exact: true },
      { href: '/admin/products/inventory', label: '库存', icon: Package },
      { href: '/admin/products/collections', label: '集合', icon: Tag },
    ],
  },
  { href: '/admin/customers', label: '客户', icon: Users },
  {
    href: '/admin/content',
    label: '内容',
    icon: FileText,
    children: [
      { href: '/admin/content/articles', label: '博客文章', icon: FileText },
      { href: '/admin/content/pages', label: '页面', icon: FileEdit },
    ],
  },
  { href: '/admin/analytics', label: '分析', icon: BarChart3 },
  { href: '/admin/marketing', label: '营销', icon: Megaphone },
  { href: '/admin/discounts', label: '折扣', icon: Tag },
];

const storeNavItems: NavItem[] = [
  {
    href: '/admin/store',
    label: '在线商店',
    icon: Palette,
    children: [
      { href: '/admin/homepage', label: '首页装修', icon: Home },
      { href: '/admin/store/themes', label: '主题', icon: Palette },
      { href: '/admin/store/navigation', label: '导航', icon: Navigation },
    ],
  },
];

const settingsNavItem: NavItem = { href: '/admin/settings', label: '设置', icon: Settings };
const apiNavItem: NavItem = { href: '/admin/api-docs', label: 'API 文档', icon: Braces };
const logsNavItem: NavItem = { href: '/admin/logs', label: '网站日志', icon: FileText };

// ─── Shopify Color Palette ─────────────────────────────────────
const colors = {
  primary: '#008060',           // Shopify Green
  primaryHover: '#004C3F',      // Dark Green
  primaryLight: '#D3F4E5',      // Light Green
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  textDisabled: '#8C9196',
  textSidebar: '#E3E3E3',
  textSidebarMuted: '#9D9D9D',
  bgPage: '#F6F6F7',
  bgCard: '#FFFFFF',
  bgSidebar: '#1A1A1A',
  bgSidebarHover: '#2D2D2D',
  bgSidebarActive: '#008060',
  border: '#E1E3E5',
  borderDark: '#BABFC3',
  success: '#008060',
  warning: '#B98900',
  error: '#D82C0D',
  info: '#005BD3',
};

function isActiveRoute(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

// ─── Sidebar Nav Item Component ────────────────────────────────
function SidebarNavItem({
  item,
  pathname,
  depth = 0,
}: {
  item: NavItem;
  pathname: string;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActiveRoute(pathname, item.href, item.exact);
  const Icon = item.icon;

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren && item.children) {
      const childActive = item.children.some((child) =>
        isActiveRoute(pathname, child.href, child.exact)
      );
      if (childActive) setExpanded(true);
    }
  }, [pathname, hasChildren, item.children]);

  const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full';
  const activeStyle = {
    background: colors.bgSidebarActive,
    color: '#FFFFFF',
  };
  const inactiveStyle = {
    color: colors.textSidebar,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const content = (
    <>
      <Icon className="w-4 h-4 shrink-0" style={{ opacity: active ? 1 : 0.8 }} />
      <span className="flex-1 truncate">{item.label}</span>
      {hasChildren && (
        <span className="shrink-0">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      )}
    </>
  );

  return (
    <div>
      {hasChildren ? (
        <button
          onClick={handleClick}
          className={baseClasses}
          style={active ? activeStyle : inactiveStyle}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.background = colors.bgSidebarHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {content}
        </button>
      ) : (
        <Link
          href={item.href}
          className={baseClasses}
          style={active ? activeStyle : inactiveStyle}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.background = colors.bgSidebarHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {content}
        </Link>
      )}

      {/* Children */}
      {hasChildren && expanded && item.children && (
        <div className="ml-4 mt-1 space-y-0.5">
          {item.children.map((child) => (
            <SidebarNavItem
              key={child.href}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Layout Component ─────────────────────────────────────
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>('admin@fuzzsofa.com');
  const [authChecked, setAuthChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  // Check admin token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token && !isLoginPage) {
      router.push('/admin/login');
      return;
    }

    if (token && isLoginPage) {
      router.push('/admin');
      return;
    }

    if (token) {
      try {
        const userData = localStorage.getItem('admin_user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.email) {
            setAdminEmail(user.email);
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    setAuthChecked(true);
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // Get user initials for avatar
  const getInitial = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  // ─── Login page: render without sidebar ───
  if (isLoginPage) {
    return (
      <div
        className="min-h-screen font-sans antialiased"
        style={{
          background: colors.bgPage,
          color: colors.textPrimary,
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        {children}
      </div>
    );
  }

  // ─── Auth loading guard ───
  if (!authChecked) {
    return (
      <div
        className="min-h-screen font-sans antialiased flex items-center justify-center"
        style={{
          background: colors.bgPage,
          color: colors.textPrimary,
        }}
      >
        <div />
      </div>
    );
  }

  // ─── Admin panel: Shopify-style layout ───
  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{
        background: colors.bgPage,
        color: colors.textPrimary,
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 border-b"
        style={{
          background: colors.bgCard,
          height: '3.5rem',
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: colors.primary }}
            >
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              FUZZ SOFA
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md ml-8">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                background: colors.bgPage,
                borderColor: colors.border,
              }}
            >
              <Search className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="搜索..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: colors.textPrimary }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.bgPage;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: colors.error }}
            />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: colors.primaryLight }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: colors.primary }}
              >
                {getInitial(adminEmail)}
              </span>
            </div>
            <span
              className="text-sm font-medium hidden sm:inline"
              style={{ color: colors.textPrimary }}
            >
              {adminEmail.split('@')[0]}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.error;
              e.currentTarget.style.background = 'rgba(216,44,13,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textSecondary;
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
        {/* Sidebar - Dark */}
        <aside
          className="w-56 shrink-0 overflow-y-auto"
          style={{
            background: colors.bgSidebar,
          }}
        >
          <nav className="p-3 space-y-0.5">
            {/* Main Nav */}
            {navItems.map((item) => (
              <SidebarNavItem key={item.href} item={item} pathname={pathname} />
            ))}

            {/* Divider */}
            <div
              className="pt-3 mt-3"
              style={{ borderTop: '1px solid #3D3D3D' }}
            >
              <p
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: colors.textSidebarMuted }}
              >
                销售渠道
              </p>
              {storeNavItems.map((item) => (
                <SidebarNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </div>

            {/* Divider */}
            <div
              className="pt-3 mt-3"
              style={{ borderTop: '1px solid #3D3D3D' }}
            >
              <SidebarNavItem item={settingsNavItem} pathname={pathname} />
              <SidebarNavItem item={apiNavItem} pathname={pathname} />
              <SidebarNavItem item={logsNavItem} pathname={pathname} />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 min-w-0 overflow-y-auto p-6"
          style={{ background: colors.bgPage }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
