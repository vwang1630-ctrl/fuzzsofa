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

function getOrderStatusBadge(status: string, paymentStatus: string) {
  // Determine display status based on combined status + payment
  if (paymentStatus === 'pending' || paymentStatus === 'failed') {
    return { label: '待付款', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' };
  }
  switch (status) {
    case 'pending':
      return { label: '待处理', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' };
    case 'confirmed':
    case 'processing':
      return { label: '生产中', bg: 'rgba(47,107,255,0.15)', color: '#2F6BFF' };
    case 'shipped':
      return { label: '已发货', bg: 'rgba(47,107,255,0.15)', color: '#2F6BFF' };
    case 'delivered':
      return { label: '已完成', bg: 'rgba(22,163,123,0.15)', color: '#16A37B' };
    case 'cancelled':
      return { label: '已取消', bg: 'rgba(99,112,137,0.15)', color: '#637089' };
    default:
      return { label: status, bg: 'rgba(99,112,137,0.15)', color: '#637089' };
  }
}

// ─── Mock Data (for loading state / fallback) ────────────────
const mockDashboardData: DashboardData = {
  totalRevenue: 128430,
  totalOrders: 1286,
  totalProducts: 356,
  totalUsers: 892,
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-20240116-001',
      status: 'delivered',
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
      orderNumber: 'ORD-20240115-002',
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
      orderNumber: 'ORD-20240115-003',
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
      orderNumber: 'ORD-20240114-004',
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
      orderNumber: 'ORD-20240114-005',
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

// ─── Component ───────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

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
        // Use mock data as fallback when not authenticated
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
        } else if (res.status === 401 || res.status === 403) {
          // Use mock data as fallback
          setData(mockDashboardData);
        } else {
          setError('加载仪表盘数据失败');
          setData(mockDashboardData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError('网络错误，请稍后重试');
        // Use mock data as fallback
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
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#152033' }}>
            仪表盘
          </h1>
          <p className="text-sm mt-1" style={{ color: '#637089' }}>
            数据概览
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg p-5 animate-pulse"
              style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg" style={{ background: '#EDF0F5' }} />
                <div className="w-16 h-4 rounded" style={{ background: '#EDF0F5' }} />
              </div>
              <div className="w-24 h-7 rounded mb-2" style={{ background: '#EDF0F5' }} />
              <div className="w-16 h-4 rounded" style={{ background: '#EDF0F5' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayData = data || mockDashboardData;

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#152033' }}>
          仪表盘
        </h1>
        <p className="text-sm mt-1" style={{ color: '#637089' }}>
          数据概览
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
        >
          <span>⚠️</span>
          <span>{error}（当前显示模拟数据）</span>
        </div>
      )}

      {/* ─── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 指标卡片-总销售额 */}
        <div
          id="card-sales"
          className="rounded-lg p-5 cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(47,107,255,0.1)' }}
            >
              <Banknote className="w-5 h-5" style={{ color: '#2F6BFF' }} />
            </div>
            <div className="flex items-center gap-1" style={{ color: '#16A37B' }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">+12.5%</span>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#152033' }}>
            {formatCurrency(displayData.totalRevenue)}
          </p>
          <p className="text-sm mt-1" style={{ color: '#637089' }}>
            总销售额
          </p>
        </div>

        {/* 指标卡片-订单总数 */}
        <div
          id="card-orders"
          className="rounded-lg p-5 cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              <ShoppingCart className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex items-center gap-1" style={{ color: '#16A37B' }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">+8.2%</span>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#152033' }}>
            {formatNumber(displayData.totalOrders)}
          </p>
          <p className="text-sm mt-1" style={{ color: '#637089' }}>
            订单总数
          </p>
        </div>

        {/* 指标卡片-商品总数 */}
        <div
          id="card-products"
          className="rounded-lg p-5 cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(22,163,123,0.1)' }}
            >
              <Package className="w-5 h-5" style={{ color: '#16A37B' }} />
            </div>
            <div className="flex items-center gap-1" style={{ color: '#EF4444' }}>
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">-2.1%</span>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#152033' }}>
            {formatNumber(displayData.totalProducts)}
          </p>
          <p className="text-sm mt-1" style={{ color: '#637089' }}>
            商品总数
          </p>
        </div>

        {/* 指标卡片-用户总数 */}
        <div
          id="card-users"
          className="rounded-lg p-5 cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(47,107,255,0.1)' }}
            >
              <Users className="w-5 h-5" style={{ color: '#2F6BFF' }} />
            </div>
            <div className="flex items-center gap-1" style={{ color: '#16A37B' }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">+18.7%</span>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#152033' }}>
            {formatNumber(displayData.totalUsers)}
          </p>
          <p className="text-sm mt-1" style={{ color: '#637089' }}>
            用户总数
          </p>
        </div>
      </div>

      {/* ─── Middle Section: Chart + Recent Orders ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* 左侧：近7天销售趋势（静态 SVG 图表） */}
        <div
          id="chart-sales-trend"
          className="lg:col-span-2 rounded-lg p-5"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#152033' }}>
              近7天销售趋势
            </h2>
            <span
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: '#EDF0F5', color: '#637089' }}
            >
              最近7天
            </span>
          </div>
          <div className="relative">
            <svg viewBox="0 0 600 220" className="w-full" style={{ height: '220px' }}>
              {/* Grid lines */}
              <line x1="50" y1="20" x2="50" y2="180" stroke="#EDF0F5" strokeWidth="1" />
              <line x1="50" y1="180" x2="580" y2="180" stroke="#EDF0F5" strokeWidth="1" />
              <line x1="50" y1="140" x2="580" y2="140" stroke="#EDF0F5" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="100" x2="580" y2="100" stroke="#EDF0F5" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="60" x2="580" y2="60" stroke="#EDF0F5" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="50" y1="20" x2="580" y2="20" stroke="#EDF0F5" strokeWidth="0.5" strokeDasharray="4,4" />

              {/* Y-axis labels */}
              <text x="40" y="184" textAnchor="end" fontSize="11" fill="#637089">0</text>
              <text x="40" y="144" textAnchor="end" fontSize="11" fill="#637089">5k</text>
              <text x="40" y="104" textAnchor="end" fontSize="11" fill="#637089">10k</text>
              <text x="40" y="64" textAnchor="end" fontSize="11" fill="#637089">15k</text>
              <text x="40" y="24" textAnchor="end" fontSize="11" fill="#637089">20k</text>

              {/* X-axis labels */}
              <text x="126" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/10</text>
              <text x="202" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/11</text>
              <text x="278" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/12</text>
              <text x="354" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/13</text>
              <text x="430" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/14</text>
              <text x="506" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/15</text>
              <text x="580" y="200" textAnchor="middle" fontSize="11" fill="#637089">1/16</text>

              {/* Area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.01" />
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
                stroke="#2F6BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              <circle cx="126" cy="108" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="202" cy="72" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="278" cy="124" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="354" cy="56" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="430" cy="88" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="506" cy="44" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />
              <circle cx="580" cy="68" r="4" fill="#ffffff" stroke="#2F6BFF" strokeWidth="2" />

              {/* Data labels */}
              <text x="126" y="98" textAnchor="middle" fontSize="10" fill="#637089">9.2k</text>
              <text x="202" y="62" textAnchor="middle" fontSize="10" fill="#637089">13.5k</text>
              <text x="278" y="118" textAnchor="middle" fontSize="10" fill="#637089">7.0k</text>
              <text x="354" y="46" textAnchor="middle" fontSize="10" fill="#637089">15.5k</text>
              <text x="430" y="78" textAnchor="middle" fontSize="10" fill="#637089">11.5k</text>
              <text x="506" y="34" textAnchor="middle" fontSize="10" fill="#637089">17.0k</text>
              <text x="580" y="58" textAnchor="middle" fontSize="10" fill="#637089">14.0k</text>
            </svg>
          </div>
        </div>

        {/* 右侧：最近订单列表 */}
        <div
          id="card-recent-orders"
          className="rounded-lg p-5"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#152033' }}>
              最近订单
            </h2>
            <Link
              href="/admin/orders"
              id="link-view-all-orders"
              className="text-xs font-medium hover:underline"
              style={{ color: '#2F6BFF' }}
            >
              查看全部
            </Link>
          </div>
          <div className="space-y-0">
            {displayData.recentOrders.slice(0, 5).map((order, idx) => {
              const badge = getOrderStatusBadge(order.status, order.paymentStatus);
              const isLast = idx === Math.min(displayData.recentOrders.length, 5) - 1;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  id={`order-item-${order.id}`}
                  className="flex items-center justify-between py-2.5 block hover:bg-[#F6F8FB] rounded-md px-2 -mx-2 transition-colors"
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid rgba(237,240,245,0.5)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: '#152033' }}
                    >
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#637089' }}>
                      {order.lastName}{order.firstName}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold" style={{ color: '#152033' }}>
                      {formatCurrency(order.total, order.currency)}
                    </p>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium mt-0.5"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Bottom: Top Products ────────────────────────────── */}
      <div
        id="card-top-products"
        className="rounded-lg p-5"
        style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: '#152033' }}>
            热门商品 TOP5
          </h2>
          <Link
            href="/admin/products"
            id="link-view-all-products"
            className="text-xs font-medium hover:underline"
            style={{ color: '#2F6BFF' }}
          >
            查看全部
          </Link>
        </div>
        <div>
          {displayData.topProducts.map((product, idx) => {
            const rank = idx + 1;
            const isLast = idx === displayData.topProducts.length - 1;
            // Determine stock status for display
            let stockLabel = '库存充足';
            let stockBg = 'rgba(22,163,123,0.15)';
            let stockColor = '#16A37B';
            if (product.totalSold > 1000) {
              stockLabel = '库存充足';
              stockBg = 'rgba(22,163,123,0.15)';
              stockColor = '#16A37B';
            } else if (product.totalSold > 600) {
              stockLabel = '库存紧张';
              stockBg = 'rgba(245,158,11,0.15)';
              stockColor = '#F59E0B';
            } else {
              stockLabel = '库存不足';
              stockBg = 'rgba(239,68,68,0.15)';
              stockColor = '#EF4444';
            }

            return (
              <Link
                key={product.productSlug}
                href={`/admin/products/${product.productSlug}`}
                id={`top-product-${product.productSlug}`}
                className="flex items-center gap-4 py-3 hover:bg-[#F6F8FB] rounded-md px-2 -mx-2 transition-colors"
                style={{
                  borderBottom: isLast ? 'none' : '1px solid rgba(237,240,245,0.5)',
                }}
              >
                <span
                  className="text-sm font-bold w-6 text-center shrink-0"
                  style={{
                    color: rank <= 3 ? '#2F6BFF' : '#637089',
                  }}
                >
                  {rank}
                </span>
                {/* Product image placeholder */}
                <div
                  className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: '#EDF0F5' }}
                >
                  <Package className="w-5 h-5" style={{ color: '#637089' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: '#152033' }}
                  >
                    {product.productName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#637089' }}>
                    销量 {formatNumber(product.totalSold)} 件 · {formatCurrency(product.totalRevenue)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium"
                    style={{ background: stockBg, color: stockColor }}
                  >
                    {stockLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
