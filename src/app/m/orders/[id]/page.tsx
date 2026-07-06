'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
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

const paymentMethodLabels: Record<string, string> = {
 creditcard: '信用卡',
 paypal: 'PayPal',
 bank: '银行转账',
};

const slugToImage: Record<string, string> = {
 'owl': '/products/owl-sofa/thumb.jpg',
 'owl-sofa': '/products/owl-sofa/thumb.jpg',
 'cat': '/products/cat-sofa/thumb.jpg',
 'dog': '/products/dog-sofa/thumb.jpg',
 'rabbit': '/products/rabbit-sofa/thumb.jpg',
 'fox': '/products/fox-sofa/thumb.jpg',
};

export default function OrderDetailPage() {
 const params = useParams();
 const orderId = params.id as string;
 const [order, setOrder] = useState<Order | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchOrder();
 }, [orderId]);

 const fetchOrder = async () => {
 try {
 const response = await fetch(`/api/orders/${orderId}`);
 if (response.ok) {
 const data = await response.json();
 setOrder(data.order);
 }
 } catch (error) {
 console.error('Failed to fetch order:', error);
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

 if (!order) {
 return (
 <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
 <p className="text-[#8A8580] mb-4">订单不存在</p>
 <Link href="/m/orders" className="text-[#E8B4B8] text-sm">
 返回订单列表
 </Link>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#0A0A0A] pb-24">
 {/* Header */}
 <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A] px-4 py-4">
 <div className="flex items-center justify-between">
 <Link href="/m/orders" className="text-[#8A8580] hover:text-[#F5F0EB]">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
 <path d="M19 12H5M12 19l-7-7 7-7"/>
 </svg>
 </Link>
 <h1 className="font-serif text-xl font-light text-[#F5F0EB] tracking-wide">订单详情</h1>
 <span className="text-sm text-[#8A8580]">{order.id}</span>
 </div>
 </div>

 {/* Status Banner */}
 <div className="px-4 py-4">
 <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-[#F5F0EB] text-lg font-medium">{statusLabels[order.status] || order.status}</p>
 <p className="text-[#8A8580] text-sm mt-1">
 {order.status === 'pending' ? '订单保留 15 分钟，请尽快支付' : '感谢您的购买'}
 </p>
 </div>
 <div
 className="w-12 h-12 rounded-full flex items-center justify-center"
 style={{
 backgroundColor: `${statusColors[order.status]}20`,
 }}
 >
 <span
 className="text-2xl"
 style={{ color: statusColors[order.status] }}
 >
 {order.status === 'delivered' ? '✓' : order.status === 'shipped' ? '→' : order.status === 'pending' ? '!' : '○'}
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Order Items */}
 <div className="px-4 py-4">
 <h2 className="text-[#F5F0EB] font-medium mb-3">商品明细</h2>
 <div className="bg-[#111111] rounded-lg border border-[#1A1A1A]">
 {order.items.map((item, index) => (
 <div
 key={index}
 className={`p-4 ${index < order.items.length - 1 ? 'border-b border-[#1A1A1A]' : ''}`}
 >
 <div className="flex items-center gap-4">
 <img
 src={slugToImage[item.productSlug] || '/products/owl-sofa/thumb.jpg'}
 alt={item.productName}
 className="w-16 h-16 rounded object-cover"
 />
 <div className="flex-1">
 <p className="text-[#F5F0EB] text-sm font-medium">{item.productName}</p>
 <p className="text-[#8A8580] text-xs mt-1">
 {item.materialType} · {item.materialOption}
 </p>
 <p className="text-[#8A8580] text-xs mt-1">数量: {item.quantity}</p>
 </div>
 <span className="text-[#F5F0EB] text-sm font-medium">
 $ {(item.unitPrice * item.quantity).toLocaleString()}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Shipping Address */}
 <div className="px-4 py-4">
 <h2 className="text-[#F5F0EB] font-medium mb-3">收货地址</h2>
 <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
 <p className="text-[#F5F0EB] text-sm">
 {order.shippingAddress.firstName} {order.shippingAddress.lastName}
 </p>
 <p className="text-[#8A8580] text-xs mt-2">
 {order.shippingAddress.address}, {order.shippingAddress.city}
 </p>
 <p className="text-[#8A8580] text-xs">
 {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
 </p>
 <p className="text-[#8A8580] text-xs mt-2">电话: {order.shippingAddress.phone}</p>
 </div>
 </div>

 {/* Payment Info */}
 <div className="px-4 py-4">
 <h2 className="text-[#F5F0EB] font-medium mb-3">支付信息</h2>
 <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">支付方式</span>
 <span className="text-[#F5F0EB] text-sm">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</span>
 </div>
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">商品总价</span>
 <span className="text-[#F5F0EB] text-sm">$ {order.total.toLocaleString()}</span>
 </div>
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">运费</span>
 <span className="text-[#F5F0EB] text-sm">$ {order.shippingFee.toLocaleString()}</span>
 </div>
 <div className="flex justify-between pt-3 border-t border-[#1A1A1A]">
 <span className="text-[#F5F0EB] text-sm font-medium">订单总额</span>
 <span className="text-[#E8B4B8] text-sm font-medium">$ {(order.total + order.shippingFee).toLocaleString()}</span>
 </div>
 </div>
 </div>

 {/* Order Time */}
 <div className="px-4 py-4">
 <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
 <div className="flex justify-between">
 <span className="text-[#8A8580] text-sm">下单时间</span>
 <span className="text-[#F5F0EB] text-sm">{new Date(order.createdAt).toLocaleString()}</span>
 </div>
 </div>
 </div>

 {/* Actions */}
 {order.status === 'pending' && (
 <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] px-4 py-4">
 <Link
 href={`/m/payment?orderId=${order.id}&amount=${order.total + order.shippingFee}`}
 className="w-full py-3 bg-[#E8B4B8] text-[#0A0A0A] text-sm tracking-[0.1em] uppercase rounded hover:bg-[#F5F0EB] transition-all duration-300 text-center block"
 >
 立即支付
 </Link>
 </div>
 )}
 </div>
 );
}