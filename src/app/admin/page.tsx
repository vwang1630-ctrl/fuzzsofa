'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Banknote,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Tag,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { getSupabaseBrowserClientWithRetry } from '@/lib/supabase-browser';

// ─── Types ───────────────────────────────────────────────────
interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  userEmail: string | null;
  createdAt: string;
}

interface TopProduct {
  productSlug: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

interface TodoItem {
  id: string;
  type: 'order' | 'inventory' | 'review';
  title: string;
  description: string;
  count: number;
  href: string;
}

// ─── Shopify Colors ──────────────────────────────────────────
const colors = {
  primary: '#008060',
  primaryHover: '#004C3F',
  primaryLight: '#D3F4E5',
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  textDisabled: '#8C9196',
  bgPage: '#F6F6F7',
  bgCard: '#FFFFFF',
  bgHover: '#F6F6F7',
  border: '#E1E3E5',
  borderDark: '#BABFC3',
  success: '#008060',
  successBg: '#D3F4E5',
  warning: '#B98900',
  warningBg: '#FFF5EA',
  error: '#D82C0D',
  errorBg: '#FED3D1',
  info: '#005BD3',
  infoBg: '#E0F5FF',
};

// ─── Helpers ─────────────────────────────────────────────────
function formatCurrency(value: number, currency = 'CNY') {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

// ─── Mock Data ───────────────────────────────────────────────
const mockDashboardData: DashboardData = {
  totalRevenue: 128430,
  totalOrders: 1286,
  totalProducts: 356,
  totalUsers: 892,
  recentOrders: [
    {
      id: '1',
      orderNumber: '1001',
      status: 'pending',
      paymentStatus: 'paid',
      total: 2380,
      currency: 'CNY',
      firstName: '明辉',
      lastName: '张',
      email: 'zhang@example.com',
      userEmail: null,
      createdAt: '2024-01-16T10:30:00Z',
    },
    {
      id: '2',
      orderNumber: '1002',
      status: 'shipped',
      paymentStatus: 'paid',
      total: 1560,
      currency: 'CNY',
      firstName: '思雨',
      lastName: '李',
      email: 'li@example.com',
      userEmail: null,
      createdAt: '2024-01-15T14:20:00Z',
    },
    {
      id: '3',
      orderNumber: '1003',
      status: 'processing',
      paymentStatus: 'paid',
      total: 890,
      currency: 'CNY',
      firstName: '建国',
      lastName: '王',
      email: 'wang@example.com',
      userEmail: null,
      createdAt: '2024-01-15T09:15:00Z',
    },
    {
      id: '4',
      orderNumber: '1004',
      status: 'pending',
      paymentStatus: 'pending',
      total: 3120,
      currency: 'CNY',
      firstName: '小燕',
      lastName: '赵',
      email: 'zhao@example.com',
      userEmail: null,
      createdAt: '2024-01-14T16:45:00Z',
    },
    {
      id: '5',
      orderNumber: '1005',
      status: 'delivered',
      paymentStatus: 'paid',
      total: 670,
      currency: 'CNY',
      firstName: '志强',
      lastName: '陈',
      email: 'chen@example.com',
      userEmail: null,
      createdAt: '2024-01-14T11:00:00Z',
    },
  ],
  topProducts: [
    { productSlug: 'owl-sofa', productName: 'Owl Chair 猫头鹰椅', totalSold: 1286, totalRevenue: 385800 },
    { productSlug: 'gorilla-sofa', productName: 'Gorilla Sofa 大猩猩沙发', totalSold: 986, totalRevenue: 295800 },
    { productSlug: 'silverback-sofa', productName: 'Silverback 银背沙发', totalSold: 752, totalRevenue: 225600 },
    { productSlug: 'meteorite-ring-sofa', productName: 'Meteorite Ring 陨石环沙发', totalSold: 634, totalRevenue: 190200 },
    { productSlug: 'muscle-gorilla-sofa', productName: 'Muscle Gorilla 肌肉大猩猩', totalSold: 521, totalRevenue: 156300 },
  ],
};

const mockTodoItems: TodoItem[] = [
  {
    id: '1',
    type: 'order',
    title: '待处理订单',
    description: '3 个订单需要发货',
    count: 3,
    href: '/admin/orders?status=pending',
  },
  {
    id: '2',
    type: 'inventory',
    title: '库存不足',
    description: '2 个产品库存低于预警值',
    count: 2,
    href: '/admin/products?filter=low_stock',
  },
];

// ─── Status Badge Component ──────────────────────────────────
function StatusBadge({ status, type }: { status: string; type: 'order' | 'payment' }) {
  let bg = colors.infoBg;
  let color = colors.info;
  let label = status;

  if (type === 'payment') {
    switch (status) {
      case 'paid':
        bg = colors.successBg;
        color = colors.success;
        label = '已付款';
        break;
      case 'pending':
        bg = colors.warningBg;
        color = colors.warning;
        label = '待付款';
        break;
      case 'failed':
        bg = colors.errorBg;
        color = colors.error;
        label = '支付失败';
        break;
      default:
        label = status;
    }
  } else {
    switch (status) {
      case 'pending':
        bg = colors.warningBg;
        color = colors.warning;
        label = '待处理';
        break;
      case 'processing':
        bg = colors.infoBg;
        color = colors.info;
        label = '处理中';
        break;
      case 'shipped':
        bg = colors.infoBg;
        color = colors.info;
        label = '已发货';
        break;
      case 'delivered':
        bg = colors.successBg;
        color = colors.success;
        label = '已完成';
        break;
      case 'cancelled':
        bg = colors.errorBg;
        color = colors.error;
        label = '已取消';
        break;
      default:
        label = status;
    }
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ─── Stat Card Component ─────────────────────────────────────
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
  icon: React.ElementType;
}) {
  return (
    <div
      className="rounded-xl p-5 transition-shadow hover:shadow-md"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: colors.primaryLight }}
        >
          <Icon className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
        {change && (
          <div
            className="flex items-center gap-1"
            style={{ color: changeType === 'down' ? colors.error : colors.success }}
          >
            {changeType === 'down' ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-medium">{change}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
        {value}
      </p>
      <p className="text-sm" style={{ color: colors.textSecondary }}>
        {title}
      </p>
    </div>
  );
}

// ─── Quick Action Button ─────────────────────────────────────
function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        color: colors.textPrimary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.bgHover;
        e.currentTarget.style.borderColor = colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.bgCard;
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      <Icon className="w-4 h-4" style={{ color: colors.primary }} />
      {label}
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [todoItems] = useState<TodoItem[]>(mockTodoItems);

  // Get session token
  useEffect(() => {
    async function getSession() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSessionToken(session?.access_token ?? null);
      } catch {
        // ignore
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

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboard() {
      if (!sessionToken) {
        setData(mockDashboardData);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: authHeaders(),
        });

        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData(mockDashboardData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError('网络错误，请稍后重试');
        setData(mockDashboardData);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [sessionToken, authHeaders]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded animate-pulse" style={{ background: colors.border }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <div className="w-10 h-10 rounded-lg mb-3" style={{ background: colors.border }} />
              <div className="w-24 h-7 rounded mb-2" style={{ background: colors.border }} />
              <div className="w-16 h-4 rounded" style={{ background: colors.border }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayData = data || mockDashboardData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {getGreeting()}，Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            这是您商店今天的概况
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuickAction href="/admin/products/new" icon={Plus} label="添加产品" />
          <QuickAction href="/admin/discounts/new" icon={Tag} label="创建折扣" />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          style={{ background: colors.errorBg, color: colors.error }}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}（当前显示模拟数据）</span>
        </div>
      )}

      {/* ─── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总销售额"
          value={formatCurrency(displayData.totalRevenue)}
          change="+12.5%"
          changeType="up"
          icon={Banknote}
        />
        <StatCard
          title="订单总数"
          value={formatNumber(displayData.totalOrders)}
          change="+8.2%"
          changeType="up"
          icon={ShoppingCart}
        />
        <StatCard
          title="商品总数"
          value={formatNumber(displayData.totalProducts)}
          icon={Package}
        />
        <StatCard
          title="客户总数"
          value={formatNumber(displayData.totalUsers)}
          change="+18.7%"
          changeType="up"
          icon={Users}
        />
      </div>

      {/* ─── Things to do ────────────────────────────────────── */}
      {todoItems.length > 0 && (
        <div
          className="rounded-xl p-5"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
            <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              待办事项
            </h2>
          </div>
          <div className="space-y-3">
            {todoItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ background: colors.bgHover }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgHover;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                  >
                    <Clock className="w-4 h-4" style={{ color: colors.warning }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sales Chart + Recent Orders ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              销售趋势
            </h2>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ background: colors.bgHover, color: colors.textSecondary }}
              >
                最近 7 天
              </span>
              <Link
                href="/admin/analytics"
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: colors.primary }}
              >
                查看报告
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <svg viewBox="0 0 600 220" className="w-full" style={{ height: '200px' }}>
              {/* Grid lines */}
              <line x1="50" y1="20" x2="50" y2="180" stroke={colors.border} strokeWidth="1" />
              <line x1="50" y1="180" x2="580" y2="180" stroke={colors.border} strokeWidth="1" />
              <line x1="50" y1="140" x2="580" y2="140" stroke={colors.border} strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="100" x2="580" y2="100" stroke={colors.border} strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="60" x2="580" y2="60" stroke={colors.border} strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="20" x2="580" y2="20" stroke={colors.border} strokeWidth="0.5" strokeDasharray="4,4" />

              {/* Y-axis labels */}
              <text x="40" y="184" textAnchor="end" fontSize="11" fill={colors.textSecondary}>0</text>
              <text x="40" y="144" textAnchor="end" fontSize="11" fill={colors.textSecondary}>5k</text>
              <text x="40" y="104" textAnchor="end" fontSize="11" fill={colors.textSecondary}>10k</text>
              <text x="40" y="64" textAnchor="end" fontSize="11" fill={colors.textSecondary}>15k</text>
              <text x="40" y="24" textAnchor="end" fontSize="11" fill={colors.textSecondary}>20k</text>

              {/* X-axis labels */}
              <text x="126" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/10</text>
              <text x="202" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/11</text>
              <text x="278" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/12</text>
              <text x="354" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/13</text>
              <text x="430" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/14</text>
              <text x="506" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/15</text>
              <text x="580" y="200" textAnchor="middle" fontSize="11" fill={colors.textSecondary}>1/16</text>

              {/* Area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <path
                d="M126,108 L202,72 L278,124 L354,56 L430,88 L506,44 L580,68 L580,180 L126,180 Z"
                fill="url(#areaGradient)"
              />

              {/* Line */}
              <polyline
                points="126,108 202,72 278,124 354,56 430,88 506,44 580,68"
                fill="none"
                stroke={colors.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              <circle cx="126" cy="108" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="202" cy="72" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="278" cy="124" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="354" cy="56" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="430" cy="88" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="506" cy="44" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
              <circle cx="580" cy="68" r="4" fill="#ffffff" stroke={colors.primary} strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Recent Orders */}
        <div
          className="rounded-xl p-5"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              最近订单
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium hover:underline flex items-center gap-1"
              style={{ color: colors.primary }}
            >
              查看全部
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {displayData.recentOrders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ background: colors.bgHover }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgHover;
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: colors.textPrimary }}
                  >
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {order.lastName}{order.firstName}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {formatCurrency(order.total, order.currency)}
                  </p>
                  <StatusBadge status={order.status} type="order" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Top Products ────────────────────────────────────── */}
      <div
        className="rounded-xl p-5"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            热门商品
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-medium hover:underline flex items-center gap-1"
            style={{ color: colors.primary }}
          >
            查看全部
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.textSecondary }}>
                  排名
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.textSecondary }}>
                  产品
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: colors.textSecondary }}>
                  销量
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: colors.textSecondary }}>
                  销售额
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.topProducts.map((product, idx) => (
                <tr
                  key={product.productSlug}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td className="py-3 px-4">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: idx < 3 ? colors.primary : colors.textSecondary,
                      }}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/products/${product.productSlug}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: colors.bgHover }}
                      >
                        <Package className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {product.productName}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      {formatNumber(product.totalSold)} 件
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {formatCurrency(product.totalRevenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
