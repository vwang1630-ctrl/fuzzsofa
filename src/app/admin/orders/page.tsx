'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
  MapPin,
  Package,
  CreditCard,
  XCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

interface ShippingEvent {
  status: string;
  title: string;
  description: string;
  happenedAt: string;
  location: string;
  isCurrent: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsSummary: string;
  total: number;
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  trackingNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  items?: OrderItem[];
  shippingEvents?: ShippingEvent[];
  paymentTime?: string;
  transactionId?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: '张小美',
    itemsSummary: 'Gorilla Sofa + 3件商品',
    total: 12680,
    currency: '¥',
    paymentMethod: '微信支付',
    status: 'pending',
    createdAt: '2024-12-18',
    email: 'zhangxm@example.com',
    phone: '139****1234',
    address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1503',
    items: [
      {
        id: 'i1',
        productName: 'Gorilla Sofa 经典款',
        quantity: 1,
        unitPrice: 8980,
        imageUrl:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop',
      },
      {
        id: 'i2',
        productName: '动物抱枕套装',
        quantity: 3,
        unitPrice: 1233,
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [],
    paymentTime: undefined,
    transactionId: undefined,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: '李晓华',
    itemsSummary: 'Owl Sofa + 1件商品',
    total: 5980,
    currency: '¥',
    paymentMethod: '支付宝',
    status: 'paid',
    createdAt: '2024-12-17',
    email: 'lixh@example.com',
    phone: '136****5678',
    address: '上海市浦东新区陆家嘴环路 1000 号恒生银行大厦 25F',
    items: [
      {
        id: 'i3',
        productName: 'Owl Sofa 猫头鹰沙发',
        quantity: 1,
        unitPrice: 4980,
        imageUrl:
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80&h=80&fit=crop',
      },
      {
        id: 'i4',
        productName: '实木边几',
        quantity: 1,
        unitPrice: 1000,
        imageUrl:
          'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [
      {
        status: 'confirmed',
        title: '已确认',
        description: '订单已确认，正在准备发货',
        happenedAt: '2024-12-17 15:00',
        location: '上海仓库',
        isCurrent: true,
      },
    ],
    paymentTime: '2024-12-17 14:35',
    transactionId: 'TXN20241217143501',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: '王大明',
    itemsSummary: 'Meteorite Ring Sofa + 2件商品',
    total: 8460,
    currency: '¥',
    paymentMethod: '银行卡',
    status: 'shipped',
    createdAt: '2024-12-15',
    trackingNumber: 'SF1234567890',
    email: 'wangdm@example.com',
    phone: '138****6789',
    address: '浙江省杭州市西湖区文三路 478 号天苑大厦 12 楼 A 座',
    items: [
      {
        id: 'i5',
        productName: 'Meteorite Ring Sofa',
        quantity: 1,
        unitPrice: 6880,
        imageUrl:
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80&h=80&fit=crop',
      },
      {
        id: 'i6',
        productName: '泰国乳胶枕头',
        quantity: 2,
        unitPrice: 790,
        imageUrl:
          'https://images.unsplash.com/photo-1505693314120-0d4f3e44108c?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [
      {
        status: 'delivered',
        title: '已签收',
        description: '包裹已签收',
        happenedAt: '2024-12-17 10:23',
        location: '杭州西湖营业部',
        isCurrent: false,
      },
      {
        status: 'delivering',
        title: '派送中',
        description: '快递员张师傅 131****5678',
        happenedAt: '2024-12-17 08:15',
        location: '杭州西湖区',
        isCurrent: true,
      },
      {
        status: 'in_transit',
        title: '运输中',
        description: '已到达杭州转运中心',
        happenedAt: '2024-12-16 14:00',
        location: '杭州转运中心',
        isCurrent: false,
      },
      {
        status: 'shipped',
        title: '已发货',
        description: '深圳南山仓库已发出',
        happenedAt: '2024-12-15 16:45',
        location: '深圳南山仓库',
        isCurrent: false,
      },
    ],
    paymentTime: '2024-12-15 14:35',
    transactionId: 'TXN20241215143527',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: '赵婉清',
    itemsSummary: 'Polar Bear Loveseat + 4件商品',
    total: 18320,
    currency: '¥',
    paymentMethod: '微信支付',
    status: 'completed',
    createdAt: '2024-12-12',
    email: 'zhaowq@example.com',
    phone: '135****9012',
    address: '广州市天河区珠江新城华夏路 30 号富力盈通大厦 1801',
    items: [
      {
        id: 'i7',
        productName: 'Polar Bear Loveseat',
        quantity: 1,
        unitPrice: 15800,
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop',
      },
      {
        id: 'i8',
        productName: '动物纹样地毯',
        quantity: 1,
        unitPrice: 1520,
        imageUrl:
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [
      {
        status: 'delivered',
        title: '已完成',
        description: '订单已完成，感谢您的购买',
        happenedAt: '2024-12-14 11:00',
        location: '广州天河营业部',
        isCurrent: true,
      },
    ],
    paymentTime: '2024-12-12 09:20',
    transactionId: 'TXN20241212092015',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: '陈志强',
    itemsSummary: 'Silverback Sofa + 1件商品',
    total: 3280,
    currency: '¥',
    paymentMethod: '支付宝',
    status: 'cancelled',
    createdAt: '2024-12-10',
    email: 'chenzq@example.com',
    phone: '137****3456',
    address: '深圳市南山区科技园南区高新南七道 1 号',
    items: [
      {
        id: 'i9',
        productName: 'Silverback Sofa',
        quantity: 1,
        unitPrice: 2980,
        imageUrl:
          'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [],
    paymentTime: undefined,
    transactionId: undefined,
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: '孙丽娜',
    itemsSummary: 'Hedgehog Accent Chair + 2件商品',
    total: 4560,
    currency: '¥',
    paymentMethod: '微信支付',
    status: 'shipped',
    createdAt: '2024-12-08',
    trackingNumber: 'YT9876543210',
    email: 'sunln@example.com',
    phone: '133****7890',
    address: '成都市锦江区红星路三段 1 号国际金融中心 22F',
    items: [
      {
        id: 'i10',
        productName: 'Hedgehog Accent Chair',
        quantity: 1,
        unitPrice: 3280,
        imageUrl:
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&h=80&fit=crop',
      },
      {
        id: 'i11',
        productName: '动物纹样靠垫',
        quantity: 2,
        unitPrice: 640,
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [
      {
        status: 'in_transit',
        title: '运输中',
        description: '已到达成都转运中心',
        happenedAt: '2024-12-10 09:30',
        location: '成都转运中心',
        isCurrent: true,
      },
      {
        status: 'shipped',
        title: '已发货',
        description: '广州番禺仓库已发出',
        happenedAt: '2024-12-08 17:20',
        location: '广州番禺仓库',
        isCurrent: false,
      },
    ],
    paymentTime: '2024-12-08 10:15',
    transactionId: 'TXN20241208101533',
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    customerName: '周建国',
    itemsSummary: '全屋定制套装 + 5件商品',
    total: 26800,
    currency: '¥',
    paymentMethod: '银行卡',
    status: 'pending',
    createdAt: '2024-12-06',
    email: 'zhoujg@example.com',
    phone: '131****2345',
    address: '南京市鼓楼区中山北路 288 号中兴大厦 30F',
    items: [
      {
        id: 'i12',
        productName: 'Gorilla Sofa 豪华款',
        quantity: 1,
        unitPrice: 18800,
        imageUrl:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop',
      },
      {
        id: 'i13',
        productName: 'Owl Sofa 迷你款',
        quantity: 1,
        unitPrice: 3500,
        imageUrl:
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [],
    paymentTime: undefined,
    transactionId: undefined,
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    customerName: '吴佳琪',
    itemsSummary: 'Snowy Owl Chair + 3件商品',
    total: 6920,
    currency: '¥',
    paymentMethod: '支付宝',
    status: 'completed',
    createdAt: '2024-12-03',
    email: 'wujq@example.com',
    phone: '132****6789',
    address: '武汉市武昌区中南路 99 号保利广场 15F',
    items: [
      {
        id: 'i14',
        productName: 'Snowy Owl Chair',
        quantity: 1,
        unitPrice: 5200,
        imageUrl:
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80&h=80&fit=crop',
      },
      {
        id: 'i15',
        productName: '动物纹样挂画',
        quantity: 3,
        unitPrice: 573,
        imageUrl:
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80&h=80&fit=crop',
      },
    ],
    shippingEvents: [
      {
        status: 'delivered',
        title: '已完成',
        description: '订单已完成，感谢您的购买',
        happenedAt: '2024-12-06 14:00',
        location: '武汉武昌营业部',
        isCurrent: true,
      },
    ],
    paymentTime: '2024-12-03 11:45',
    transactionId: 'TXN20241203114522',
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STATUS_TABS = [
  {
    key: 'all',
    label: '全部订单',
    icon: ClipboardList,
    count: 156,
    activeCls: 'bg-[#EBF1FF] text-[#2F6BFF]',
    badgeCls: 'bg-[#2F6BFF]/15 text-[#2F6BFF]',
  },
  {
    key: 'pending',
    label: '待付款',
    icon: Clock,
    count: 12,
    activeCls: 'bg-[#EBF1FF] text-[#2F6BFF]',
    badgeCls: 'bg-[#FEF3C7] text-[#D97706]',
  },
  {
    key: 'shipped',
    label: '已发货',
    icon: Truck,
    count: 38,
    activeCls: 'bg-[#EBF1FF] text-[#2F6BFF]',
    badgeCls: 'bg-[#D1FAE5] text-[#16A37B]',
  },
  {
    key: 'completed',
    label: '已完成',
    icon: CheckCircle,
    count: 98,
    activeCls: 'bg-[#EBF1FF] text-[#2F6BFF]',
    badgeCls: 'bg-[#EDF0F5] text-[#637089]',
  },
];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: '待付款', cls: 'bg-[#FEF3C7] text-[#D97706]' },
  paid: { label: '已付款', cls: 'bg-[#EBF1FF] text-[#2F6BFF]' },
  shipped: { label: '已发货', cls: 'bg-[#D1FAE5] text-[#16A37B]' },
  completed: { label: '已完成', cls: 'bg-[#EDF0F5] text-[#637089]' },
  cancelled: { label: '已取消', cls: 'bg-[#FEE2E2] text-[#EF4444]' },
};

const PAYMENT_LABELS: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  card: '银行卡',
  微信支付: '微信支付',
  支付宝: '支付宝',
  银行卡: '银行卡',
};

function fmtCurrency(currency: string, amount: number) {
  return `${currency}${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  /* pagination */
  const [page, setPage] = useState(1);
  const pageSize = 8;

  /* drawer */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);

  /* ---------- fetch from API (fallback to mock) ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/orders?pageSize=100');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled && data.orders?.length) {
          setOrders(
            data.orders.map((o: Record<string, unknown>, i: number) => ({
              id: String(o.id ?? i + 1),
              orderNumber: (o.orderNumber as string) || `ORD-${i + 1}`,
              customerName: `${o.firstName || ''} ${o.lastName || ''}`.trim() || '未知客户',
              itemsSummary: '—',
              total: Number(o.total) || 0,
              currency: (o.currency as string) || '¥',
              paymentMethod:
                PAYMENT_LABELS[(o.paymentMethod as string) || ''] ||
                (o.paymentMethod as string) ||
                '—',
              status: (o.status as string) || 'pending',
              createdAt: ((o.createdAt as string) || '').slice(0, 10),
              trackingNumber: (o.trackingNumber as string) || undefined,
              email: (o.email as string) || undefined,
              phone: (o.phone as string) || undefined,
              address: [
                o.addressLine1,
                o.addressLine2,
                o.city,
                o.state,
                o.zipCode,
                o.country,
              ]
                .filter(Boolean)
                .join(' '),
              items: [],
              shippingEvents: [],
            })),
          );
        }
      } catch {
        /* keep mock data */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- derived data ---------- */
  const filtered = useMemo(() => {
    let list = [...orders];

    // Tab filter
    if (activeTab !== 'all') {
      list = list.filter((o) => {
        if (activeTab === 'pending') return o.status === 'pending';
        if (activeTab === 'shipped') return o.status === 'shipped';
        if (activeTab === 'completed') return o.status === 'completed';
        return true;
      });
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q),
      );
    }

    // Date range
    if (dateStart) {
      list = list.filter((o) => o.createdAt >= dateStart);
    }
    if (dateEnd) {
      list = list.filter((o) => o.createdAt <= dateEnd);
    }

    // Payment method
    if (paymentFilter) {
      const label = PAYMENT_LABELS[paymentFilter] || paymentFilter;
      list = list.filter((o) => o.paymentMethod === label);
    }

    return list;
  }, [orders, activeTab, search, dateStart, dateEnd, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------- handlers ---------- */
  const openDrawer = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setDrawerOrder(order);
        setDrawerOpen(true);
      }
    },
    [orders],
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setDrawerOrder(null), 300);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setDateStart('');
    setDateEnd('');
    setPaymentFilter('');
    setActiveTab('all');
    setPage(1);
  }, []);

  const handleShipOrder = useCallback(() => {
    if (!drawerOrder) return;
    if (confirm(`确认发货订单 ${drawerOrder.orderNumber}？发货后将通知客户。`)) {
      setOrders((prev) =>
        prev.map((o) => (o.id === drawerOrder.id ? { ...o, status: 'shipped' } : o)),
      );
      setDrawerOrder((prev) => (prev ? { ...prev, status: 'shipped' } : null));
    }
  }, [drawerOrder]);

  const handleCancelOrder = useCallback(() => {
    if (!drawerOrder) return;
    if (confirm(`确认取消订单 ${drawerOrder.orderNumber}？取消后需退款。`)) {
      setOrders((prev) =>
        prev.map((o) => (o.id === drawerOrder.id ? { ...o, status: 'cancelled' } : o)),
      );
      setDrawerOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
    }
  }, [drawerOrder]);

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2F6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#637089]">加载中...</p>
        </div>
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <>
    <main className="flex-1 min-w-0 overflow-y-auto bg-[#F6F8FB] p-6">
      {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#152033]">订单管理</h1>
            <p className="text-sm text-[#637089] mt-1">查看和处理所有客户订单</p>
          </div>

          {/* Stat Tabs */}
          <div className="flex items-center gap-2 mb-5">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? tab.activeCls
                      : 'bg-[#EDF0F5] text-[#637089] hover:bg-[#E6EAF2]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive ? tab.badgeCls : 'bg-[#E6EAF2] text-[#637089]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[#637089] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="order-search"
                  type="text"
                  placeholder="搜索订单号 / 客户名"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#EDF0F5] border-none rounded-md pl-9 pr-3 py-2 text-sm text-[#152033] placeholder:text-[#637089]/50 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#637089] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="date-start"
                    type="date"
                    value={dateStart}
                    onChange={(e) => {
                      setDateStart(e.target.value);
                      setPage(1);
                    }}
                    className="bg-[#EDF0F5] border-none rounded-md pl-9 pr-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                  />
                </div>
                <span className="text-[#637089] text-sm">至</span>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#637089] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="date-end"
                    type="date"
                    value={dateEnd}
                    onChange={(e) => {
                      setDateEnd(e.target.value);
                      setPage(1);
                    }}
                    className="bg-[#EDF0F5] border-none rounded-md pl-9 pr-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Payment Filter */}
              <select
                id="payment-filter"
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-[#EDF0F5] border-none rounded-md px-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                <option value="">全部支付方式</option>
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="card">银行卡</option>
              </select>

              {/* Reset */}
              <button
                id="btn-reset"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-[#637089] hover:text-[#152033] hover:bg-[#EDF0F5] rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>
          </div>

          {/* Order Table */}
          <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1.2fr_0.8fr_1.2fr_0.8fr_0.7fr_1fr_0.8fr_0.6fr] px-4 py-3 bg-[#EDF0F5] text-xs font-semibold text-[#637089] uppercase tracking-wide border-b border-[#E6EAF2]">
              <span>订单号</span>
              <span>客户姓名</span>
              <span>商品摘要</span>
              <span>总金额</span>
              <span>支付方式</span>
              <span>订单状态</span>
              <span>下单时间</span>
              <span>操作</span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#EDF0F5]">
              {paged.map((order) => {
                const badge = STATUS_BADGE[order.status] || {
                  label: order.status,
                  cls: 'bg-[#EDF0F5] text-[#637089]',
                };

                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1.2fr_0.8fr_1.2fr_0.8fr_0.7fr_1fr_0.8fr_0.6fr] px-4 py-3 items-center hover:bg-[#EDF0F5]/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-[#2F6BFF]">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm text-[#152033]">{order.customerName}</span>
                    <span className="text-sm text-[#637089] truncate pr-2">
                      {order.itemsSummary}
                    </span>
                    <span className="text-sm font-semibold text-[#152033]">
                      {fmtCurrency(order.currency, order.total)}
                    </span>
                    <span className="text-sm text-[#637089]">{order.paymentMethod}</span>
                    <span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      {order.trackingNumber && order.status === 'shipped' && (
                        <span className="text-xs text-[#637089] ml-1.5">
                          {order.trackingNumber}
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-[#637089]">{order.createdAt}</span>
                    <button
                      onClick={() => openDrawer(order.id)}
                      className="text-[#2F6BFF] text-sm font-medium hover:underline w-fit"
                    >
                      查看详情
                    </button>
                  </div>
                );
              })}

              {paged.length === 0 && (
                <div className="px-4 py-16 text-center">
                  <ClipboardList className="w-10 h-10 text-[#DDE1EA] mx-auto mb-3" />
                  <p className="text-sm text-[#637089]">没有找到匹配的订单</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-sm text-[#637089]">
              共 {filtered.length} 条记录，第 {page} / {totalPages} 页
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm text-[#637089] bg-[#EDF0F5] rounded-md hover:bg-[#E6EAF2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      p === page
                        ? 'bg-[#2F6BFF] text-white'
                        : 'text-[#637089] bg-[#EDF0F5] hover:bg-[#E6EAF2]'
                    }`}
                  >
                    {p}
                  </button>
                ))}

              {page + 2 < totalPages && (
                <span className="px-2 text-sm text-[#637089]">...</span>
              )}

              {page + 2 < totalPages && (
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1.5 text-sm font-medium text-[#637089] bg-[#EDF0F5] hover:bg-[#E6EAF2] rounded-md transition-colors"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm text-[#637089] bg-[#EDF0F5] rounded-md hover:bg-[#E6EAF2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

      {/* ===== Drawer Overlay ===== */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* ===== Order Detail Drawer ===== */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] max-w-[90vw] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-50 transition-transform duration-300 flex flex-col ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {drawerOrder && (
          <>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6EAF2]">
              <div>
                <h2 className="text-base font-semibold text-[#152033]">
                  {drawerOrder.orderNumber}
                </h2>
                <p className="text-xs text-[#637089] mt-0.5">
                  下单时间：{drawerOrder.createdAt}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 text-[#637089] hover:text-[#152033] hover:bg-[#EDF0F5] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Order Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${
                    STATUS_BADGE[drawerOrder.status]?.cls || 'bg-[#EDF0F5] text-[#637089]'
                  }`}
                >
                  {STATUS_BADGE[drawerOrder.status]?.label || drawerOrder.status}
                </span>
                {drawerOrder.trackingNumber && (
                  <span className="text-sm text-[#637089]">
                    物流单号：{drawerOrder.trackingNumber}
                  </span>
                )}
              </div>

              {/* Shipping Address */}
              {drawerOrder.address && (
                <div>
                  <h3 className="text-sm font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#637089]" />
                    收货地址
                  </h3>
                  <div className="bg-[#EDF0F5] rounded-lg p-3">
                    <p className="text-sm text-[#152033] font-medium">
                      {drawerOrder.customerName}
                    </p>
                    <p className="text-sm text-[#637089] mt-1">{drawerOrder.address}</p>
                    {drawerOrder.phone && (
                      <p className="text-sm text-[#637089] mt-0.5">
                        联系电话：{drawerOrder.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              {drawerOrder.items && drawerOrder.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#637089]" />
                    商品清单
                  </h3>
                  <div className="space-y-3">
                    {drawerOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-[#EDF0F5] rounded-lg p-3"
                      >
                        <div className="w-14 h-14 rounded-md overflow-hidden bg-[#DDE1EA] relative shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#152033] truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#637089] mt-0.5">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#152033] shrink-0">
                          {fmtCurrency(drawerOrder.currency, item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Total */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E6EAF2]">
                    <span className="text-sm text-[#637089]">
                      共 {drawerOrder.items.length} 种商品，
                      {drawerOrder.items.reduce((sum, i) => sum + i.quantity, 0)} 件
                    </span>
                    <span className="text-base font-bold text-[#152033]">
                      合计：{fmtCurrency(drawerOrder.currency, drawerOrder.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Shipping Events */}
              {drawerOrder.shippingEvents && drawerOrder.shippingEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#637089]" />
                    物流信息
                  </h3>
                  <div className="bg-[#EDF0F5] rounded-lg p-3 space-y-3">
                    {drawerOrder.shippingEvents.map((evt, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            evt.isCurrent ? 'bg-[#16A37B]' : 'bg-[#637089]/40'
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm ${evt.isCurrent ? 'text-[#152033] font-medium' : 'text-[#637089]'}`}
                          >
                            {evt.title}
                          </p>
                          <p className="text-xs text-[#637089] mt-0.5">
                            {evt.happenedAt} · {evt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#637089]" />
                  支付信息
                </h3>
                <div className="bg-[#EDF0F5] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#637089]">支付方式</span>
                    <span className="text-sm text-[#152033] font-medium">
                      {drawerOrder.paymentMethod}
                    </span>
                  </div>
                  {drawerOrder.paymentTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#637089]">支付时间</span>
                      <span className="text-sm text-[#152033] font-medium">
                        {drawerOrder.paymentTime}
                      </span>
                    </div>
                  )}
                  {drawerOrder.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#637089]">交易流水号</span>
                      <span className="text-sm text-[#152033] font-medium font-mono">
                        {drawerOrder.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-[#E6EAF2] flex items-center gap-3">
              {drawerOrder.status !== 'completed' && drawerOrder.status !== 'cancelled' && (
                <>
                  {drawerOrder.status === 'paid' || drawerOrder.status === 'shipped' ? (
                    <Button
                      onClick={handleShipOrder}
                      className="flex-1 bg-[#2F6BFF] hover:bg-[#2558DD] text-white px-4 py-2.5 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2 h-auto"
                    >
                      <Truck className="w-4 h-4" />
                      确认发货
                    </Button>
                  ) : null}
                  <Button
                    onClick={handleCancelOrder}
                    variant="outline"
                    className="flex-1 bg-[#EDF0F5] text-[#152033] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#E6EAF2] inline-flex items-center justify-center gap-2 h-auto border-none"
                  >
                    <XCircle className="w-4 h-4" />
                    取消订单
                  </Button>
                </>
              )}
              {drawerOrder.status === 'completed' && (
                <div className="w-full text-center text-sm text-[#637089]">
                  该订单已完成
                </div>
              )}
              {drawerOrder.status === 'cancelled' && (
                <div className="w-full text-center text-sm text-[#EF4444]">
                  该订单已取消
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
    </>
  );
}
