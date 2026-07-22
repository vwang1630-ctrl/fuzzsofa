'use client';

import { ShoppingCart } from 'lucide-react';

const colors = {
  primary: '#008060',
  primaryLight: '#D3F4E5',
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  bgCard: '#FFFFFF',
  border: '#E1E3E5',
};

export default function AbandonedOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          废弃结账
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          查看未完成支付的订单
        </p>
      </div>

      <div
        className="rounded-xl p-12 flex flex-col items-center justify-center"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: colors.primaryLight }}
        >
          <ShoppingCart className="w-8 h-8" style={{ color: colors.primary }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
          暂无废弃结账
        </h3>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          当客户未完成支付时，订单将显示在这里
        </p>
      </div>
    </div>
  );
}
