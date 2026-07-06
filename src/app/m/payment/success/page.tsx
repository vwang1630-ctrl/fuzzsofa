'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessContent() {
 const searchParams = useSearchParams();
 const orderId = searchParams.get('orderId') || '';
 const amount = searchParams.get('amount') || '0';
 const paymentMethod = searchParams.get('paymentMethod') || 'creditcard';

 const paymentMethodLabels: Record<string, string> = {
 creditcard: '信用卡',
 paypal: 'PayPal',
 bank: '银行转账',
 };

 return (
 <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
 <div className="max-w-md w-full">
 {/* Success Icon */}
 <div className="w-20 h-20 border-2 border-[#E8B4B8] rounded-full flex items-center justify-center mb-6 mx-auto">
 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2">
 <polyline points="20 6 9 17 4 12"/>
 </svg>
 </div>

 {/* Title */}
 <h1 className="font-serif text-2xl font-light text-[#F5F0EB] mb-3 tracking-wide text-center">
 支付成功
 </h1>

 {/* Order Info */}
 <div className="bg-[#111111] rounded-lg p-6 border border-[#1A1A1A] mb-6">
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">订单号</span>
 <span className="text-[#F5F0EB] text-sm">{orderId}</span>
 </div>
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">支付金额</span>
 <span className="text-[#F5F0EB] text-sm font-medium">$ {Number(amount).toLocaleString()}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-[#8A8580] text-sm">支付方式</span>
 <span className="text-[#F5F0EB] text-sm">{paymentMethodLabels[paymentMethod]}</span>
 </div>
 </div>

 {/* Message */}
 <p className="text-[#8A8580] mb-8 text-sm text-center">
 感谢您的购买，我们将尽快发货。您可以在「我的订单」中查看订单状态。
 </p>

 {/* Buttons */}
 <div className="flex gap-4">
 <Link
 href="/m/orders"
 className="flex-1 py-3 bg-[#E8B4B8] text-[#0A0A0A] text-sm tracking-[0.1em] uppercase rounded hover:bg-[#F5F0EB] transition-all duration-300 text-center"
 >
 查看订单
 </Link>
 <Link
 href="/m"
 className="flex-1 py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase rounded hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all duration-300 text-center"
 >
 继续选购
 </Link>
 </div>
 </div>
 </div>
 );
}

export default function PaymentSuccessPage() {
 return (
 <Suspense fallback={
 <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
 <p className="text-[#8A8580]">加载中...</p>
 </div>
 }>
 <PaymentSuccessContent />
 </Suspense>
 );
}