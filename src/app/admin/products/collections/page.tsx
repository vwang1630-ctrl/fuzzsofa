'use client';

import { Tag, Plus } from 'lucide-react';

const colors = {
  primary: '#008060',
  primaryLight: '#D3F4E5',
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  bgCard: '#FFFFFF',
  border: '#E1E3E5',
};

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            集合
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            管理产品集合和分类
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: colors.primary }}
        >
          <Plus className="w-4 h-4" />
          创建集合
        </button>
      </div>

      <div
        className="rounded-xl p-12 flex flex-col items-center justify-center"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: colors.primaryLight }}
        >
          <Tag className="w-8 h-8" style={{ color: colors.primary }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
          产品集合
        </h3>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          创建产品集合来组织您的商品
        </p>
      </div>
    </div>
  );
}
