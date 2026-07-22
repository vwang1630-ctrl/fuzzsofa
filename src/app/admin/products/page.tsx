'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Package,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Product {
  id: string;
  slug: string;
  name: string;
  animal: string;
  priceRange: { min: number; max: number };
  stockStatus: string;
  stockCount: number;
  status: string;
  image: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'gorilla-sofa',
    name: 'Gorilla Sofa',
    animal: 'gorilla',
    priceRange: { min: 2499, max: 3299 },
    stockStatus: 'in_stock',
    stockCount: 42,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
  },
  {
    id: '2',
    slug: 'owl-sofa',
    name: 'Owl Sofa',
    animal: 'owl',
    priceRange: { min: 1899, max: 2499 },
    stockStatus: 'in_stock',
    stockCount: 28,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=60&h=60&fit=crop',
  },
  {
    id: '3',
    slug: 'silverback-sofa',
    name: 'Silverback Sofa',
    animal: 'gorilla',
    priceRange: { min: 3299, max: 4599 },
    stockStatus: 'low_stock',
    stockCount: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=60&h=60&fit=crop',
  },
  {
    id: '4',
    slug: 'meteorite-ring-sofa',
    name: 'Meteorite Ring Sofa',
    animal: 'polar-bear',
    priceRange: { min: 2799, max: 3699 },
    stockStatus: 'in_stock',
    stockCount: 18,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=60&h=60&fit=crop',
  },
  {
    id: '5',
    slug: 'polar-bear-loveseat',
    name: 'Polar Bear Loveseat',
    animal: 'polar-bear',
    priceRange: { min: 2199, max: 2899 },
    stockStatus: 'in_stock',
    stockCount: 35,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
  },
  {
    id: '6',
    slug: 'hedgehog-accent-chair',
    name: 'Hedgehog Accent Chair',
    animal: 'hedgehog',
    priceRange: { min: 1499, max: 1999 },
    stockStatus: 'out_of_stock',
    stockCount: 0,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=60&h=60&fit=crop',
  },
  {
    id: '7',
    slug: 'muscle-gorilla-sofa',
    name: 'Muscle Gorilla Sofa',
    animal: 'gorilla',
    priceRange: { min: 2899, max: 3899 },
    stockStatus: 'in_stock',
    stockCount: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=60&h=60&fit=crop',
  },
  {
    id: '8',
    slug: 'snowy-owl-chair',
    name: 'Snowy Owl Chair',
    animal: 'owl',
    priceRange: { min: 1699, max: 2199 },
    stockStatus: 'low_stock',
    stockCount: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=60&h=60&fit=crop',
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const ANIMAL_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '全部动物类型' },
  { value: 'gorilla', label: '大猩猩' },
  { value: 'owl', label: '猫头鹰' },
  { value: 'polar-bear', label: '北极熊' },
  { value: 'hedgehog', label: '刺猬' },
];

const ANIMAL_BADGE: Record<string, { label: string; cls: string }> = {
  gorilla: { label: '大猩猩', cls: 'bg-[#EBF1FF] text-[#2F6BFF]' },
  owl: { label: '猫头鹰', cls: 'bg-[#FEF3C7] text-[#D97706]' },
  'polar-bear': { label: '北极熊', cls: 'bg-[#D1FAE5] text-[#16A37B]' },
  hedgehog: { label: '刺猬', cls: 'bg-[#FEE2E2] text-[#EF4444]' },
};

function getStockInfo(status: string, count: number) {
  if (status === 'out_of_stock' || count === 0)
    return { label: `缺货 (0)`, cls: 'bg-[#FEE2E2] text-[#EF4444]' };
  if (status === 'low_stock' || count <= 10)
    return { label: `低库存 (${count})`, cls: 'bg-[#FEF3C7] text-[#D97706]' };
  return { label: `有库存 (${count})`, cls: 'bg-[#D1FAE5] text-[#16A37B]' };
}

function fmtPrice(n: number) {
  return '$' + n.toLocaleString('en-US');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [search, setSearch] = useState('');
  const [animalFilter, setAnimalFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  /* selection & pagination */
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  /* ---------- fetch from API (fallback to mock) ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/products?pageSize=100');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled && data.products?.length) {
          setProducts(
            data.products.map((p: Record<string, unknown>, i: number) => ({
              id: String(p.id ?? i + 1),
              slug: p.slug as string,
              name: p.name as string,
              animal: (p.animal as string) || 'gorilla',
              priceRange: (p.priceRange as { min?: number; max?: number }) || {
                min: 0,
                max: 0,
              },
              stockStatus: (p.stockStatus as string) || 'in_stock',
              stockCount:
                typeof p.stockCount === 'number'
                  ? p.stockCount
                  : (p.stockStatus as string) === 'out_of_stock'
                    ? 0
                    : 20,
              status: (p.status as string) || 'active',
              image:
                ((p.images as string[])?.[0] as string) ||
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
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
    let list = [...products];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
      );
    }
    if (animalFilter !== 'all') list = list.filter((p) => p.animal === animalFilter);
    if (statusFilter === 'active') list = list.filter((p) => p.status === 'active');
    if (statusFilter === 'inactive') list = list.filter((p) => p.status === 'inactive');

    if (sortBy !== 'default') {
      list.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.priceRange.min - b.priceRange.min;
          case 'price-desc':
            return b.priceRange.min - a.priceRange.min;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }
    return list;
  }, [products, search, animalFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allChecked = paged.length > 0 && paged.every((p) => selected.has(p.id));

  /* ---------- handlers ---------- */
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((p) => next.add(p.id));
        return next;
      });
    }
  }, [allChecked, paged]);

  const toggleStatus = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p,
      ),
    );
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (product && confirm(`确定要删除商品 "${product.name}" 吗？此操作不可撤销。`)) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [products],
  );

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
    <main className="flex-1 min-w-0 overflow-y-auto bg-[#F6F8FB] p-6">
      {/* Page Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#152033]">商品管理</h1>
              <p className="text-sm text-[#637089] mt-1">管理所有动物灵感家具产品</p>
            </div>
            <Button className="bg-[#2F6BFF] hover:bg-[#2558DD] text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 h-auto">
              <Plus className="w-3.5 h-3.5" />
              新增商品
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#637089]/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索商品名称 / Slug..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#EDF0F5] border-none rounded-md pl-9 pr-3 py-2 text-sm text-[#152033] placeholder:text-[#637089]/50 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                />
              </div>

              {/* Animal Filter */}
              <select
                value={animalFilter}
                onChange={(e) => {
                  setAnimalFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-[#EDF0F5] border-none rounded-md px-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                {ANIMAL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-[#EDF0F5] border-none rounded-md px-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="active">上架</option>
                <option value="inactive">下架</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#EDF0F5] border-none rounded-md px-3 py-2 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                <option value="default">默认排序</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="name-asc">名称 A-Z</option>
                <option value="name-desc">名称 Z-A</option>
              </select>
            </div>
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#637089]">
              共 <span className="font-medium">{filtered.length}</span> 件商品
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#EDF0F5] border-b border-[#E6EAF2]">
                    <th className="w-10 px-4 py-3 text-left">
                      <Checkbox
                        checked={allChecked}
                        onCheckedChange={toggleAll}
                        className="w-4 h-4 border-[#DDE1EA] data-[state=checked]:bg-[#2F6BFF] data-[state=checked]:border-[#2F6BFF] cursor-pointer"
                      />
                    </th>
                    <th className="w-[68px] px-2 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      图片
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      商品名称
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      动物类型
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      价格 (USD)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      库存状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      上架状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#637089] uppercase tracking-wide">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF0F5]">
                  {paged.map((product) => {
                    const animal = ANIMAL_BADGE[product.animal] || {
                      label: product.animal,
                      cls: 'bg-[#EDF0F5] text-[#637089]',
                    };
                    const stock = getStockInfo(product.stockStatus, product.stockCount);

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#EDF0F5]/50 transition-colors"
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selected.has(product.id)}
                            onCheckedChange={() => toggleSelect(product.id)}
                            className="w-4 h-4 border-[#DDE1EA] data-[state=checked]:bg-[#2F6BFF] data-[state=checked]:border-[#2F6BFF] cursor-pointer"
                          />
                        </td>

                        {/* Image */}
                        <td className="px-2 py-3">
                          <div className="w-[60px] h-[60px] rounded-md overflow-hidden bg-[#EDF0F5] relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[#152033]">
                            {product.name}
                          </span>
                        </td>

                        {/* Animal Badge */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${animal.cls}`}
                          >
                            {animal.label}
                          </span>
                        </td>

                        {/* Slug */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#637089] font-mono">
                            {product.slug}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[#152033]">
                            {fmtPrice(product.priceRange.min)} –{' '}
                            {fmtPrice(product.priceRange.max)}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${stock.cls}`}
                          >
                            {stock.label}
                          </span>
                        </td>

                        {/* Status Switch */}
                        <td className="px-4 py-3">
                          <Switch
                            checked={product.status === 'active'}
                            onCheckedChange={() => toggleStatus(product.id)}
                            className={
                              product.status === 'active'
                                ? 'bg-[#16A37B] data-[state=checked]:bg-[#16A37B]'
                                : 'data-[state=checked]:bg-[#16A37B]'
                            }
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/products/${product.slug}`}
                              className="text-[#2F6BFF] text-sm font-medium hover:underline"
                            >
                              编辑
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-[#EF4444] text-sm font-medium hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center">
                        <Package className="w-10 h-10 text-[#DDE1EA] mx-auto mb-3" />
                        <p className="text-sm text-[#637089]">没有找到匹配的商品</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#E6EAF2]">
              <span className="text-sm text-[#637089]">
                显示{' '}
                {filtered.length > 0
                  ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)}`
                  : '0'}{' '}
                / 共 {filtered.length} 件
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-[#EDF0F5] border-none rounded-md px-2 py-1 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 cursor-pointer"
                >
                  <option value={6}>6 条/页</option>
                  <option value={12}>12 条/页</option>
                  <option value={24}>24 条/页</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-2 py-1 text-[#637089] hover:bg-[#EDF0F5] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, page - 3),
                      Math.min(totalPages, page + 2),
                    )
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                          p === page
                            ? 'bg-[#2F6BFF]/10 text-[#2F6BFF] font-medium'
                            : 'text-[#637089] hover:bg-[#EDF0F5]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-2 py-1 text-[#637089] hover:bg-[#EDF0F5] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
    </main>
  );
}
