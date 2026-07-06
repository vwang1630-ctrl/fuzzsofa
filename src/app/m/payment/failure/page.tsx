'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailureContent() {
 const searchParams = useSearchParams();
 const orderId = searchParams.get('orderId') || '';
 const amount = searchParams.get('amount') || '0';
 const errorMessage = searchParams.get('error') || '支付未完成';

 return (
 <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
 <div className="max-w-md w-full">
 {/* Failure Icon */}
 <div className="w-20 h-20 border-2 border-[#333] rounded-full flex items-center justify-center mb-6 mx-auto">
 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="2">
 <line x1="18" y1="6" x2="6" y2="18"/>
 <line x1="6" y1="6" x2="18" y2="18"/>
 </svg>
 </div>

 {/* Title */}
 <h1 className="font-serif text-2xl font-light text-[#F5F0EB] mb-3 tracking-wide text-center">
 支付未完成
 </h1>

 {/* Error Message */}
 <div className="bg-[#111111] rounded-lg p-6 border border-[#1A1A1A] mb-6">
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">订单号</span>
 <span className="text-[#F5F0EB] text-sm">{orderId}</span>
 </div>
 <div className="flex justify-between mb-3">
 <span className="text-[#8A8580] text-sm">待支付金额</span>
 <span className="text-[#F5F0EB] text-sm font-medium">$ {Number(amount).toLocaleString()}</span>
 </div>
 <div className="pt-3 border-t border-[#1A1A1A]">
 <p className="text-[#E8B4B8] text-sm">{errorMessage}</p>
 </div>
 </div>

 {/* Info */}
 <p className="text-[#8A8580] mb-8 text-sm text-center">
 订单暂保留 15 分钟，您可重新发起支付。请检查支付信息或尝试其他支付方式。
 </p>

 {/* Buttons */}
 <div className="flex flex-col gap-3">
 <Link
 href={`/m/checkout?orderId=${orderId}`}
 className="w-full py-3 bg-[#E8B4B8] text-[#0A0A0A] text-sm tracking-[0.1em] uppercase rounded hover:bg-[#F5F0EB] transition-all duration-300 text-center"
 >
 重新支付
 </Link>
 <Link
 href="/m/orders"
 className="w-full py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase rounded hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all duration-300 text-center"
 >
 查看订单
 </Link>
 <Link
 href="/m/cart"
 className="w-full py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase rounded hover:border-[#E8B4B8] hover:text-[#F5F0EB] transition-all duration-300 text-center"
 >
 返回购物车
 </Link>
 </div>
 </div>
 </div>
 );
}

export default function PaymentFailurePage() {
 return (
 <Suspense fallback={
 <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
 <p className="text-[#8A8580]">加载中...</p>
 </div>
 }>
 <PaymentFailureContent />
 </Suspense>
 );
}