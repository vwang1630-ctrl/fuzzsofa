'use client';

import { useState } from 'react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params?: Array<{ name: string; type: string; required: boolean; desc: string }>;
  response: string;
  module: string;
}

const endpoints: ApiEndpoint[] = [
  // Public
  { method: 'GET', path: '/api/public/products', description: '获取商品列表（访客可用，SSR渲染）', params: [
    { name: 'animal', type: 'string', required: false, desc: '动物类型筛选，如 gorilla, owl' },
    { name: 'search', type: 'string', required: false, desc: '搜索关键词' },
    { name: 'page', type: 'number', required: false, desc: '页码，默认1' },
    { name: 'pageSize', type: 'number', required: false, desc: '每页条数，默认20' },
  ], response: `{\n  "products": [{ "slug": "gorilla-sofa", "name": "Gorilla Sofa", "animal": "gorilla", ... }],\n  "total": 38,\n  "page": 1,\n  "pageSize": 20\n}`, module: '商品接口' },
  { method: 'GET', path: '/api/public/products/[slug]', description: '获取商品详情（SSR渲染）', params: [
    { name: 'slug', type: 'string', required: true, desc: '商品唯一标识，如 gorilla-sofa' },
  ], response: `{\n  "product": {\n    "slug": "gorilla-sofa",\n    "name": "Gorilla Sofa",\n    "animal": "gorilla",\n    "tagline": "Built to Hold You Like the Earth Holds Mountains.",\n    "description": "...",\n    "priceRange": { "americas": 4299, "europe": 3899, ... },\n    "specifications": { "dimensions": {...}, "weight": "125 lbs" },\n    "materials": [...],\n    "images": { "hero": "...", "gallery": [...] }\n  }\n}`, module: '商品接口' },
  { method: 'POST', path: '/api/public/auth/login', description: '用户登录', params: [
    { name: 'email', type: 'string', required: false, desc: '邮箱（与phone二选一）' },
    { name: 'phone', type: 'string', required: false, desc: '手机号（与email二选一）' },
    { name: 'password', type: 'string', required: true, desc: '密码' },
  ], response: `{\n  "user": { "id": "uuid", "email": "user@example.com", "role": "user" },\n  "token": "eyJ1c2VySWQiOi..." // 存入 x-session header\n}`, module: '认证接口' },
  { method: 'POST', path: '/api/public/auth/register', description: '用户注册', params: [
    { name: 'email', type: 'string', required: false, desc: '邮箱' },
    { name: 'phone', type: 'string', required: false, desc: '手机号' },
    { name: 'password', type: 'string', required: true, desc: '密码' },
    { name: 'firstName', type: 'string', required: false, desc: '名' },
    { name: 'lastName', type: 'string', required: false, desc: '姓' },
  ], response: `{\n  "user": { "id": "uuid", "email": "new@example.com", "role": "user" },\n  "token": "eyJ1c2VySWQiOi..."\n}`, module: '认证接口' },
  // User
  { method: 'GET', path: '/api/user/cart', description: '获取购物车（需登录）', response: `{\n  "cart": {\n    "id": "uuid",\n    "items": [{ "id": "uuid", "productSlug": "gorilla-sofa", "quantity": 1, "unitPrice": 4299 }],\n    "itemCount": 1,\n    "total": 4299\n  }\n}`, module: '购物车接口' },
  { method: 'POST', path: '/api/user/cart/items', description: '添加商品到购物车（需登录）', params: [
    { name: 'productSlug', type: 'string', required: true, desc: '商品slug' },
    { name: 'material', type: 'string', required: false, desc: '材质' },
    { name: 'colorName', type: 'string', required: false, desc: '颜色名' },
    { name: 'colorHex', type: 'string', required: false, desc: '颜色值' },
    { name: 'quantity', type: 'number', required: true, desc: '数量' },
    { name: 'unitPrice', type: 'number', required: true, desc: '单价' },
    { name: 'imageUrl', type: 'string', required: false, desc: '图片URL' },
  ], response: `{\n  "item": { "id": "uuid", "productSlug": "gorilla-sofa", "quantity": 1 },\n  "cartId": "uuid"\n}`, module: '购物车接口' },
  { method: 'GET', path: '/api/user/orders', description: '获取我的订单列表（需登录）', params: [
    { name: 'status', type: 'string', required: false, desc: '状态筛选: pending/confirmed/shipped/delivered' },
  ], response: `{\n  "orders": [{\n    "id": "uuid",\n    "orderNumber": "FUZZ-20260315-0001",\n    "status": "pending",\n    "total": 4299,\n    "items": [{ "productSlug": "gorilla-sofa", "quantity": 1 }],\n    "createdAt": "2026-03-15T10:00:00Z"\n  }]\n}`, module: '订单接口' },
  { method: 'POST', path: '/api/user/orders', description: '创建订单/从购物车结算（需登录）', params: [
    { name: 'paymentMethod', type: 'string', required: true, desc: '支付方式: credit_card/paypal/bank_transfer' },
    { name: 'shippingMethod', type: 'string', required: false, desc: '配送方式: standard/express' },
    { name: 'shippingAddress', type: 'object', required: true, desc: '收货地址 { firstName, lastName, phone, country, addressLine, city, state, zipCode }' },
  ], response: `{\n  "order": {\n    "id": "uuid",\n    "orderNumber": "FUZZ-20260315-0001",\n    "status": "pending",\n    "total": 4299,\n    "paymentStatus": "pending_payment"\n  }\n}`, module: '订单接口' },
  { method: 'GET', path: '/api/user/favorites', description: '获取收藏列表（需登录）', response: `{\n  "favorites": [{ "id": "uuid", "productSlug": "gorilla-sofa", "createdAt": "..." }]\n}`, module: '收藏接口' },
  { method: 'POST', path: '/api/user/favorites', description: '添加收藏（需登录）', params: [
    { name: 'productSlug', type: 'string', required: true, desc: '商品slug' },
  ], response: `{\n  "favorite": { "id": "uuid", "productSlug": "gorilla-sofa" }\n}`, module: '收藏接口' },
  { method: 'DELETE', path: '/api/user/favorites?productSlug=xxx', description: '删除收藏（需登录）', params: [
    { name: 'productSlug', type: 'string', required: true, desc: '商品slug（query参数）' },
  ], response: `{\n  "success": true\n}`, module: '收藏接口' },
  { method: 'GET', path: '/api/user/addresses', description: '获取收货地址列表（需登录）', response: `{\n  "addresses": [{\n    "id": "uuid",\n    "firstName": "John",\n    "lastName": "Doe",\n    "phone": "+1234567890",\n    "country": "US",\n    "addressLine": "123 Main St",\n    "city": "New York",\n    "state": "NY",\n    "zipCode": "10001",\n    "isDefault": true\n  }]\n}`, module: '地址接口' },
  { method: 'POST', path: '/api/user/addresses', description: '添加收货地址（需登录）', params: [
    { name: 'firstName', type: 'string', required: true, desc: '名' },
    { name: 'lastName', type: 'string', required: true, desc: '姓' },
    { name: 'phone', type: 'string', required: true, desc: '电话' },
    { name: 'country', type: 'string', required: true, desc: '国家代码' },
    { name: 'addressLine', type: 'string', required: true, desc: '地址行' },
    { name: 'city', type: 'string', required: true, desc: '城市' },
    { name: 'state', type: 'string', required: false, desc: '州/省' },
    { name: 'zipCode', type: 'string', required: true, desc: '邮编' },
    { name: 'isDefault', type: 'boolean', required: false, desc: '是否默认地址' },
  ], response: `{\n  "address": { "id": "uuid", ... }\n}`, module: '地址接口' },
  { method: 'GET', path: '/api/user/profile', description: '获取当前用户信息（需登录）', response: `{\n  "user": { "id": "uuid", "email": "user@example.com", "firstName": "John", "lastName": "Doe", "role": "user" }\n}`, module: '用户接口' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function ApiDocsPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['0']));
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = (idx: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const modules = [...new Set(endpoints.map(e => e.module))];
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F8FB' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#E6EAF2' }}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: '#152033' }}>API 文档</h1>
              <p className="mt-1 text-sm" style={{ color: '#637089' }}>前台项目对接接口文档</p>
            </div>
            <button
              onClick={() => copyText(baseUrl, 'base-url')}
              className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
              style={{ backgroundColor: '#2F6BFF' }}
            >
              {copied === 'base-url' ? '已复制' : '复制 Base URL'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Info bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6EAF2' }}>
            <div className="text-xs font-medium mb-1" style={{ color: '#637089' }}>Base URL</div>
            <code className="text-sm font-mono" style={{ color: '#152033' }}>{baseUrl}</code>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6EAF2' }}>
            <div className="text-xs font-medium mb-1" style={{ color: '#637089' }}>认证方式</div>
            <code className="text-sm font-mono" style={{ color: '#152033' }}>x-session: &lt;token&gt;</code>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6EAF2' }}>
            <div className="text-xs font-medium mb-1" style={{ color: '#637089' }}>API 版本</div>
            <span className="text-sm font-medium" style={{ color: '#152033' }}>v1.0</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left sidebar nav */}
          <nav className="w-56 shrink-0">
            <div className="sticky top-6 space-y-4">
              {modules.map(mod => (
                <div key={mod}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#637089' }}>{mod}</div>
                  <div className="space-y-1">
                    {endpoints.filter(e => e.module === mod).map((ep, i) => {
                      const idx = String(endpoints.indexOf(ep));
                      return (
                        <a
                          key={idx}
                          href={`#endpoint-${idx}`}
                          onClick={() => setExpanded(prev => new Set(prev).add(idx))}
                          className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors"
                          style={{ color: '#152033' }}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${methodColors[ep.method]}`}>
                            {ep.method}
                          </span>
                          <span className="truncate font-mono">{ep.path.replace('/api/public', '').replace('/api/user', '')}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Right content */}
          <div className="flex-1 min-w-0 space-y-4">
            {endpoints.map((ep, idx) => {
              const idxStr = String(idx);
              const isOpen = expanded.has(idxStr);
              return (
                <div
                  key={idx}
                  id={`endpoint-${idx}`}
                  className="bg-white rounded-lg border overflow-hidden"
                  style={{ borderColor: '#E6EAF2' }}
                >
                  <button
                    onClick={() => toggle(idxStr)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono font-medium" style={{ color: '#152033' }}>{ep.path}</code>
                    <span className="flex-1 text-sm text-right" style={{ color: '#637089' }}>{ep.description}</span>
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#637089' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: '#E6EAF2' }}>
                      <p className="mt-4 text-sm" style={{ color: '#637089' }}>{ep.description}</p>

                      {ep.params && ep.params.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#637089' }}>请求参数</h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b" style={{ borderColor: '#E6EAF2' }}>
                                <th className="text-left py-2 font-medium" style={{ color: '#152033' }}>参数</th>
                                <th className="text-left py-2 font-medium" style={{ color: '#152033' }}>类型</th>
                                <th className="text-left py-2 font-medium" style={{ color: '#152033' }}>必填</th>
                                <th className="text-left py-2 font-medium" style={{ color: '#152033' }}>说明</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ep.params.map((p, pi) => (
                                <tr key={pi} className="border-b" style={{ borderColor: '#E6EAF2' }}>
                                  <td className="py-2 font-mono text-xs" style={{ color: '#152033' }}>{p.name}</td>
                                  <td className="py-2 text-xs" style={{ color: '#637089' }}>{p.type}</td>
                                  <td className="py-2">
                                    {p.required
                                      ? <span className="text-xs text-red-600 font-medium">required</span>
                                      : <span className="text-xs" style={{ color: '#637089' }}>optional</span>
                                    }
                                  </td>
                                  <td className="py-2 text-xs" style={{ color: '#637089' }}>{p.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#637089' }}>响应示例</h4>
                          <button
                            onClick={() => copyText(ep.response, `resp-${idx}`)}
                            className="text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                            style={{ color: '#637089' }}
                          >
                            {copied === `resp-${idx}` ? '已复制' : '复制'}
                          </button>
                        </div>
                        <pre
                          className="rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                          style={{ backgroundColor: '#1E293B', color: '#E2E8F0' }}
                        >
                          {ep.response}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
