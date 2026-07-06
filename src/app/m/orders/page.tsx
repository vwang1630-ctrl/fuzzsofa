'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface OrderItem {
 productSlug: string;
 productName: string;
 materialType: string;
 materialOption: string;
 quantity: number;
 unitPrice: number;
}

interface Order {
 id: string;
 status: string;
 items: OrderItem[];
 total: number;
 shippingFee: number;
 createdAt: string;
 paymentMethod: string;
 shippingAddress: {
 firstName: string;
 lastName: string;
 address: string;
 city: string;
 state: string;
 postalCode: string;
 country: string;
 phone: string;
 };
}

const statusLabels: Record<string, string> = {
 pending: '待支付',
 paid: '已支付',
 processing: '处理中',
 shipped: '已发货',
 delivered: '已送达',
 cancelled: '已取消',
};

const statusColors: Record<string, string> = {
 pending: '#E8B4B8',
 paid: '#4ADE80',
 processing: '#60A5FA',
 shipped: '#60A5FA',
 delivered: '#4ADE80',
 cancelled: '#8A8580',
};

const slugToImage: Record<string, string> = {
 'owl': '/products/owl-sofa/thumb.jpg',
 'owl-sofa': '/products/owl-sofa/thumb.jpg',
 'cat': '/products/cat-sofa/thumb.jpg',
 'dog': '/products/dog-sofa/thumb.jpg',
 'rabbit': '/products/rabbit-sofa/thumb.jpg',
 'fox': '/products/fox-sofa/thumb.jpg',
};

export default function OrdersPage() {
 const [orders, setOrders] = useState<Order[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchOrders();
 }, []);

 const fetchOrders = async () => {
 try {
 const response = await fetch('/api/orders');
 if (response.ok) {
 const data = await response.json();
 setOrders(data.orders || []);
 }
 } catch (error) {
 console.error('Failed to fetch orders:', error);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
 <p className="text-[#8A8580]">加载中...</p>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#0A0A0A]">
 {/* Header */}
 <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A] px-4 py-4">
 <div className="flex items-center justify-between">
 <Link href="/m" className="text-[#8A8580] hover:text-[#F5F0EB]">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
 <path d="M19 12H5M12 19l-7-7 7-7"/>
 </svg>
 </Link>
 <h1 className="font-serif text-xl font-light text-[#F5F0EB] tracking-wide">我的订单</h1>
 <span className="text-sm text-[#8A8580]">{orders.length} 个</span>
 </div>
 </div>

 {/* Orders List */}
 <div className="px-4 py-4">
 {orders.length === 0 ? (
 <div className="text-center py-12">
 <p className="text-[#8A8580] mb-4">暂无订单记录</p>
 <Link
 href="/m"
 className="text-[#E8B4B8] text-sm hover:text-[#F5F0EB]"
 >
 去选购家具
 </Link>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {orders.map((order) => (
 <Link
 key={order.id}
 href={`/m/orders/${order.id}`}
 className="bg-[#111111] rounded-lg border border-[#1A1A1A] overflow-hidden"
 >
 {/* Order Header */}
 <div className="px-4 py-3 border-b border-[#1A1A1A] flex justify-between items-center">
 <span className="text-[#F5F0EB] text-sm">{order.id}</span>
 <span
 className="text-xs px-2 py-1 rounded"
 style={{
 backgroundColor: `${statusColors[order.status]}20`,
 color: statusColors[order.status],
 }}
 >
 {statusLabels[order.status] || order.status}
 </span>
 </div>

 {/* Order Items Preview */}
 <div className="px-4 py-3">
 {order.items.slice(0, 2).map((item, index) => (
 <div key={index} className="flex items-center gap-3 mb-2">
 <img
 src={slugToImage[item.productSlug] || '/products/owl-sofa/thumb.jpg'}
 alt={item.productName}
 className="w-12 h-12 rounded object-cover"
 />
 <div className="flex-1">
 <p className="text-[#F5F0EB] text-sm">{item.productName}</p>
 <p className="text-[#8A8580] text-xs">
 {item.materialType} · {item.materialOption} · {item.quantity}件
 </p>
 </div>
 <span className="text-[#F5F0EB] text-sm">
 $ {item.unitPrice.toLocaleString()}
 </span>
 </div>
 ))}
 {order.items.length > 2 && (
 <p className="text-[#8A8580] text-xs">
 还有 {order.items.length - 2} 件商品...
 </p>
 )}
 </div>

 {/* Order Footer */}
 <div className="px-4 py-3 border-t border-[#1A1A1A] flex justify-between items-center">
 <span className="text-[#8A8580] text-xs">
 {new Date(order.createdAt).toLocaleDateString()}
 </span>
 <span className="text-[#F5F0EB] text-sm font-medium">
 合计 $ {(order.total + order.shippingFee).toLocaleString()}
 </span>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}