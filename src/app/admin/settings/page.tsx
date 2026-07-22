'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Upload,
  Globe,
  Mail,
  Image,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface SettingItem {
  value: string;
  type: string;
  description: string;
  updatedAt: string;
}

interface SettingsData {
  site_name: string;
  site_description: string;
  banner_image: string;
  banner_title: string;
  banner_subtitle: string;
  contact_email: string;
  currency: string;
  language: string;
}

/* ------------------------------------------------------------------ */
/*  Default values (fallback)                                          */
/* ------------------------------------------------------------------ */
const DEFAULT_SETTINGS: SettingsData = {
  site_name: 'FUZZ SOFA',
  site_description: 'Animal-Inspired Luxury Furniture',
  banner_image: '',
  banner_title: 'Crafted by Nature',
  banner_subtitle: 'Where Wild Meets Refined',
  contact_email: 'hello@fuzzsofa.com',
  currency: 'USD',
  language: 'en',
};

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - 美元 ($)' },
  { value: 'CNY', label: 'CNY - 人民币 (¥)' },
  { value: 'EUR', label: 'EUR - 欧元 (€)' },
  { value: 'GBP', label: 'GBP - 英镑 (£)' },
  { value: 'JPY', label: 'JPY - 日元 (¥)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  /* ---------- Fetch settings from API ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled && data.settings) {
          const mapped: SettingsData = {
            site_name: data.settings.site_name?.value ?? DEFAULT_SETTINGS.site_name,
            site_description: data.settings.site_description?.value ?? DEFAULT_SETTINGS.site_description,
            banner_image: data.settings.banner_image?.value ?? DEFAULT_SETTINGS.banner_image,
            banner_title: data.settings.banner_title?.value ?? DEFAULT_SETTINGS.banner_title,
            banner_subtitle: data.settings.banner_subtitle?.value ?? DEFAULT_SETTINGS.banner_subtitle,
            contact_email: data.settings.contact_email?.value ?? DEFAULT_SETTINGS.contact_email,
            currency: data.settings.currency?.value ?? DEFAULT_SETTINGS.currency,
            language: data.settings.language?.value ?? DEFAULT_SETTINGS.language,
          };
          setSettings(mapped);
          setOriginalSettings(mapped);
        }
      } catch {
        // Keep default settings
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---------- Update a setting ---------- */
  const updateSetting = useCallback((key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveStatus('idle');
  }, []);

  /* ---------- Save settings ---------- */
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      if (data.settings) {
        const mapped: SettingsData = {
          site_name: data.settings.site_name?.value ?? settings.site_name,
          site_description: data.settings.site_description?.value ?? settings.site_description,
          banner_image: data.settings.banner_image?.value ?? settings.banner_image,
          banner_title: data.settings.banner_title?.value ?? settings.banner_title,
          banner_subtitle: data.settings.banner_subtitle?.value ?? settings.banner_subtitle,
          contact_email: data.settings.contact_email?.value ?? settings.contact_email,
          currency: data.settings.currency?.value ?? settings.currency,
          language: data.settings.language?.value ?? settings.language,
        };
        setOriginalSettings(mapped);
      }
      setHasChanges(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  /* ---------- Handle banner image upload (mock) ---------- */
  const handleBannerUpload = useCallback(() => {
    // In production, this would open a file picker and upload to storage
    const mockUrl = 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&h=400&fit=crop';
    updateSetting('banner_image', mockUrl);
  }, [updateSetting]);

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2F6BFF] animate-spin" />
          <p className="text-sm text-[#637089]">加载设置中...</p>
        </div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div>
      {/* Page Title */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#152033]">站点设置</h1>
          <p className="text-sm text-[#637089] mt-1">管理网站基本信息、Banner 和区域设置</p>
        </div>
        <Button
          id="btn-save-settings"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-[#2F6BFF] hover:bg-[#2558DD] text-white px-5 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          保存设置
        </Button>
      </div>

      {/* Save Status Message */}
      {saveStatus === 'success' && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 bg-[rgba(22,163,123,0.08)] text-[#16A37B]">
          <CheckCircle className="w-4 h-4" />
          设置已成功保存
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 bg-[rgba(239,68,68,0.08)] text-[#EF4444]">
          <AlertCircle className="w-4 h-4" />
          保存失败，请稍后重试
        </div>
      )}

      <div className="space-y-6">
        {/* ─── Section 1: 站点基本信息 ──────────────────────── */}
        <div
          className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(47,107,255,0.1)]">
              <SettingsIcon className="w-4.5 h-4.5 text-[#2F6BFF]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#152033]">站点基本信息</h2>
              <p className="text-xs text-[#637089]">设置网站名称和描述</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 站点名称 */}
            <div>
              <label htmlFor="setting-site-name" className="block text-sm font-medium text-[#152033] mb-1.5">
                站点名称
              </label>
              <input
                id="setting-site-name"
                type="text"
                value={settings.site_name}
                onChange={(e) => updateSetting('site_name', e.target.value)}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                placeholder="输入站点名称"
              />
            </div>

            {/* 站点描述 */}
            <div>
              <label htmlFor="setting-site-description" className="block text-sm font-medium text-[#152033] mb-1.5">
                站点描述
              </label>
              <textarea
                id="setting-site-description"
                value={settings.site_description}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                rows={3}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors resize-none"
                placeholder="输入站点描述"
              />
            </div>
          </div>
        </div>

        {/* ─── Section 2: Banner 设置 ──────────────────────── */}
        <div
          className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(245,158,11,0.1)]">
              <Image className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#152033]">Banner 设置</h2>
              <p className="text-xs text-[#637089]">配置首页 Banner 的标题、副标题和图片</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Banner 标题 */}
            <div>
              <label htmlFor="setting-banner-title" className="block text-sm font-medium text-[#152033] mb-1.5">
                Banner 标题
              </label>
              <input
                id="setting-banner-title"
                type="text"
                value={settings.banner_title}
                onChange={(e) => updateSetting('banner_title', e.target.value)}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                placeholder="输入 Banner 标题"
              />
            </div>

            {/* Banner 副标题 */}
            <div>
              <label htmlFor="setting-banner-subtitle" className="block text-sm font-medium text-[#152033] mb-1.5">
                Banner 副标题
              </label>
              <input
                id="setting-banner-subtitle"
                type="text"
                value={settings.banner_subtitle}
                onChange={(e) => updateSetting('banner_subtitle', e.target.value)}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                placeholder="输入 Banner 副标题"
              />
            </div>

            {/* Banner 图片 */}
            <div>
              <label htmlFor="setting-banner-image" className="block text-sm font-medium text-[#152033] mb-1.5">
                Banner 图片
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    id="setting-banner-image"
                    type="text"
                    value={settings.banner_image}
                    onChange={(e) => updateSetting('banner_image', e.target.value)}
                    className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
                    placeholder="输入图片 URL 或点击上传"
                  />
                  <p className="text-xs text-[#637089] mt-1.5">建议尺寸：1200×400px，支持 JPG/PNG/WebP</p>
                </div>
                <button
                  id="btn-upload-banner"
                  onClick={handleBannerUpload}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border border-[#E6EAF2] text-[#637089] hover:bg-[#EDF0F5] hover:text-[#152033] transition-colors shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  上传图片
                </button>
              </div>

              {/* Banner Preview */}
              {settings.banner_image && (
                <div className="mt-3 relative rounded-lg overflow-hidden border border-[#E6EAF2]" style={{ height: '160px' }}>
                  <img
                    src={settings.banner_image}
                    alt="Banner 预览"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-sm">{settings.banner_title}</p>
                      <p className="text-white/80 text-xs mt-0.5">{settings.banner_subtitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Section 3: 联系信息 ──────────────────────── */}
        <div
          className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(22,163,123,0.1)]">
              <Mail className="w-4.5 h-4.5 text-[#16A37B]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#152033]">联系信息</h2>
              <p className="text-xs text-[#637089]">设置网站联系邮箱</p>
            </div>
          </div>

          <div>
            <label htmlFor="setting-contact-email" className="block text-sm font-medium text-[#152033] mb-1.5">
              联系邮箱
            </label>
            <input
              id="setting-contact-email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => updateSetting('contact_email', e.target.value)}
              className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors"
              placeholder="输入联系邮箱"
            />
          </div>
        </div>

        {/* ─── Section 4: 区域设置 ──────────────────────── */}
        <div
          className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(139,92,246,0.1)]">
              <Globe className="w-4.5 h-4.5 text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#152033]">区域设置</h2>
              <p className="text-xs text-[#637089]">设置默认货币和语言</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 货币 */}
            <div>
              <label htmlFor="setting-currency" className="block text-sm font-medium text-[#152033] mb-1.5">
                默认货币
              </label>
              <select
                id="setting-currency"
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 语言 */}
            <div>
              <label htmlFor="setting-language" className="block text-sm font-medium text-[#152033] mb-1.5">
                默认语言
              </label>
              <select
                id="setting-language"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full bg-[#EDF0F5] border-none rounded-md px-4 py-2.5 text-sm text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-colors cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── Bottom Save Bar ──────────────────────── */}
        {hasChanges && (
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-[#E6EAF2] -mx-6 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-[#637089]">您有未保存的更改</p>
            <div className="flex items-center gap-3">
              <button
                id="btn-discard"
                onClick={() => {
                  setSettings(originalSettings);
                  setHasChanges(false);
                  setSaveStatus('idle');
                }}
                className="px-4 py-2 text-sm font-medium text-[#637089] hover:text-[#152033] hover:bg-[#EDF0F5] rounded-md transition-colors"
              >
                放弃更改
              </button>
              <Button
                id="btn-save-bottom"
                onClick={handleSave}
                disabled={saving}
                className="bg-[#2F6BFF] hover:bg-[#2558DD] text-white px-5 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 h-auto"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                保存设置
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
