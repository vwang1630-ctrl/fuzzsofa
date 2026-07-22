'use client';

import { Megaphone, Plus } from 'lucide-react';

const colors = {
  primary: '#008060',
  primaryLight: '#D3F4E5',
  textPrimary: '#303030',
  textSecondary: '#6D7175',
  bgCard: '#FFFFFF',
  border: '#E1E3E5',
};

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            营销
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            创建和管理营销活动
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: colors.primary }}
        >
          <Plus className="w-4 h-4" />
          创建活动
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
          <Megaphone className="w-8 h-8" style={{ color: colors.primary }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
          营销活动
        </h3>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          邮件营销、社交媒体推广等功能即将上线
        </p>
      </div>
    </div>
  );
}
