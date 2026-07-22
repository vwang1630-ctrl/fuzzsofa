'use client';

import { Package } from 'lucide-react';

const colors = {
  primary: '#008060',
  primaryLight: '#D3F4E5',
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  bgCard: '#FFFFFF',
  border: '#E1E3E5',
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          库存
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          管理产品库存数量
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
          <Package className="w-8 h-8" style={{ color: colors.primary }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
          库存管理
        </h3>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          库存追踪、低库存预警功能即将上线
        </p>
      </div>
    </div>
  );
}
