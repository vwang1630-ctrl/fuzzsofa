'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Save,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Braces,
  Home,
  PawPrint,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: '仪表盘', href: '/admin', icon: LayoutDashboard },
  { label: '商品管理', href: '/admin/products', icon: Package },
  { label: '订单管理', href: '/admin/orders', icon: ShoppingBag },
  { label: '首页装修', href: '/admin/homepage', icon: Home },
];

// 图片上传预览组件
function ImageUploadPreview({
  label,
  value,
  onChange,
  aspectRatio = 'aspect-video',
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'x-session': localStorage.getItem('admin_token') || '',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url || data.key);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#152033]">{label}</label>
      <div className={`relative ${aspectRatio} bg-[#F6F8FB] rounded-lg border-2 border-dashed border-[#E6EAF2] overflow-hidden group`}>
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-[#152033] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#F6F8FB] transition-colors">
                更换图片
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E6EAF2]/50 transition-colors">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-[#637089] animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#637089] mb-2" />
                <span className="text-sm text-[#637089]">点击上传图片</span>
                <span className="text-xs text-[#637089]/60 mt-1">支持 JPG、PNG、WebP</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}

// 输入框组件
function InputField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#152033]">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-3 py-2 border border-[#E6EAF2] rounded-md text-sm text-[#152033] placeholder:text-[#637089]/50 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 focus:border-[#2F6BFF] resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-[#E6EAF2] rounded-md text-sm text-[#152033] placeholder:text-[#637089]/50 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 focus:border-[#2F6BFF]"
        />
      )}
    </div>
  );
}

// 卡片容器组件
function ConfigCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-[#E6EAF2] p-6">
      <h3 className="text-base font-semibold text-[#152033] mb-5">{title}</h3>
      {children}
    </div>
  );
}

interface HomepageConfig {
  hero: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
  };
  brand: {
    title: string;
    description: string;
    image: string;
  };
  features: {
    title: string;
    intro: string;
    items: Array<{ title: string; description: string }>;
  };
  scene: {
    title: string;
    image: string;
  };
  footer: {
    line1: string;
    line2: string;
  };
  journalBanner: {
    image: string;
    title: string;
  };
}

const defaultConfig: HomepageConfig = {
  hero: {
    image: '',
    title: 'Crafted by Nature',
    subtitle: 'Where wild inspiration meets refined comfort',
    buttonText: 'Explore Collection',
  },
  brand: {
    title: 'Our Story',
    description: 'Founded in 2019, FUZZ SOFA brings the untamed beauty of the animal kingdom into modern living spaces...',
    image: '',
  },
  features: {
    title: 'Why Choose FUZZ',
    intro: 'Every piece tells a story of nature-inspired design',
    items: [
      { title: 'Animal-Inspired Design', description: 'Each piece draws from the unique characteristics of wildlife' },
      { title: 'Premium Materials', description: 'Full-grain leather and premium velvet from sustainable sources' },
      { title: 'Handcrafted Quality', description: 'Master artisans bring each design to life with precision' },
    ],
  },
  scene: {
    title: 'In Your Space',
    image: '',
  },
  footer: {
    line1: '© 2026 FUZZ SOFA. All rights reserved.',
    line2: 'Crafted with nature in mind.',
  },
  journalBanner: {
    image: '',
    title: 'The Journal',
  },
};

export default function HomepageConfigPage() {
  const pathname = usePathname();
  const [config, setConfig] = useState<HomepageConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/homepage/config', {
        headers: {
          'x-session': localStorage.getItem('admin_token') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig({ ...defaultConfig, ...data.config });
        }
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
      setError('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const response = await fetch('/api/admin/homepage/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session': localStorage.getItem('admin_token') || '',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('保存失败');
      }
    } catch (err) {
      console.error('Failed to save config:', err);
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path: string[], value: string) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: Record<string, unknown> = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const updateFeatureItem = (index: number, field: 'title' | 'description', value: string) => {
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  return (
    <div className="flex h-screen bg-[#F6F8FB]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-[#E6EAF2]">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-[#E6EAF2]">
          <div className="w-8 h-8 bg-[#2F6BFF] rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-[#152033]">FUZZ SOFA</span>
          <span className="text-xs text-[#637089] bg-[#EDF0F5] px-2 py-0.5 rounded-md">Admin</span>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                    : 'text-[#637089] hover:bg-[#EDF0F5] hover:text-[#152033]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-[#E6EAF2]">
            <Link
              href="/admin/api-docs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#637089] hover:bg-[#EDF0F5] hover:text-[#152033] font-medium text-sm transition-colors"
            >
              <Braces className="w-4 h-4" />
              API 文档
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#152033]">首页装修</h1>
            <p className="text-sm text-[#637089] mt-1">配置首页各模块的内容和展示效果</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-[#16A37B]/10 border border-[#16A37B]/20 rounded-lg flex items-center gap-3">
              <Save className="w-5 h-5 text-[#16A37B]" />
              <p className="text-sm text-[#16A37B]">配置已保存</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2F6BFF] animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Hero 横幅配置 */}
              <ConfigCard title="Hero 横幅配置">
                <div className="space-y-5">
                  <ImageUploadPreview
                    label="横幅图片"
                    value={config.hero.image}
                    onChange={(url) => updateConfig(['hero', 'image'], url)}
                    aspectRatio="aspect-[21/9]"
                  />
                  <InputField
                    label="主标题"
                    value={config.hero.title}
                    onChange={(val) => updateConfig(['hero', 'title'], val)}
                    placeholder="Crafted by Nature"
                  />
                  <InputField
                    label="副标题"
                    value={config.hero.subtitle}
                    onChange={(val) => updateConfig(['hero', 'subtitle'], val)}
                    placeholder="Where wild inspiration meets refined comfort"
                  />
                  <InputField
                    label="按钮文字"
                    value={config.hero.buttonText}
                    onChange={(val) => updateConfig(['hero', 'buttonText'], val)}
                    placeholder="Explore Collection"
                  />
                </div>
              </ConfigCard>

              {/* 2. 品牌介绍配置 */}
              <ConfigCard title="品牌介绍配置">
                <div className="space-y-5">
                  <InputField
                    label="标题"
                    value={config.brand.title}
                    onChange={(val) => updateConfig(['brand', 'title'], val)}
                    placeholder="Our Story"
                  />
                  <InputField
                    label="介绍文本"
                    value={config.brand.description}
                    onChange={(val) => updateConfig(['brand', 'description'], val)}
                    placeholder="品牌故事描述..."
                    multiline
                  />
                  <ImageUploadPreview
                    label="配图"
                    value={config.brand.image}
                    onChange={(url) => updateConfig(['brand', 'image'], url)}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>
              </ConfigCard>

              {/* 3. 产品特色配置 */}
              <ConfigCard title="产品特色配置">
                <div className="space-y-5">
                  <InputField
                    label="大标题"
                    value={config.features.title}
                    onChange={(val) => updateConfig(['features', 'title'], val)}
                    placeholder="Why Choose FUZZ"
                  />
                  <InputField
                    label="导语"
                    value={config.features.intro}
                    onChange={(val) => updateConfig(['features', 'intro'], val)}
                    placeholder="Every piece tells a story..."
                  />
                  <div className="space-y-4 pt-2">
                    {config.features.items.map((item, index) => (
                      <div key={index} className="p-4 bg-[#F6F8FB] rounded-lg space-y-3">
                        <span className="text-xs font-medium text-[#637089]">特色 {index + 1}</span>
                        <InputField
                          label="标题"
                          value={item.title}
                          onChange={(val) => updateFeatureItem(index, 'title', val)}
                          placeholder="特色标题"
                        />
                        <InputField
                          label="描述"
                          value={item.description}
                          onChange={(val) => updateFeatureItem(index, 'description', val)}
                          placeholder="特色描述"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </ConfigCard>

              {/* 4. 场景展示配置 */}
              <ConfigCard title="场景展示配置">
                <div className="space-y-5">
                  <InputField
                    label="标题"
                    value={config.scene.title}
                    onChange={(val) => updateConfig(['scene', 'title'], val)}
                    placeholder="In Your Space"
                  />
                  <ImageUploadPreview
                    label="场景大图"
                    value={config.scene.image}
                    onChange={(url) => updateConfig(['scene', 'image'], url)}
                    aspectRatio="aspect-[16/9]"
                  />
                </div>
              </ConfigCard>

              {/* 5. 底部全局配置 */}
              <ConfigCard title="底部全局配置">
                <div className="space-y-5">
                  <InputField
                    label="第一行文字"
                    value={config.footer.line1}
                    onChange={(val) => updateConfig(['footer', 'line1'], val)}
                    placeholder="© 2026 FUZZ SOFA. All rights reserved."
                  />
                  <InputField
                    label="第二行文字"
                    value={config.footer.line2}
                    onChange={(val) => updateConfig(['footer', 'line2'], val)}
                    placeholder="Crafted with nature in mind."
                  />
                </div>
              </ConfigCard>

              {/* 6. 日志页 Banner 配置 */}
              <ConfigCard title="日志页 Banner 配置">
                <div className="space-y-5">
                  <ImageUploadPreview
                    label="Banner 图片"
                    value={config.journalBanner.image}
                    onChange={(url) => updateConfig(['journalBanner', 'image'], url)}
                    aspectRatio="aspect-[21/9]"
                  />
                  <InputField
                    label="标题"
                    value={config.journalBanner.title}
                    onChange={(val) => updateConfig(['journalBanner', 'title'], val)}
                    placeholder="The Journal"
                  />
                </div>
              </ConfigCard>

              {/* 保存按钮 */}
              <div className="flex justify-end pt-4 pb-8">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2F6BFF] text-white font-medium text-sm rounded-md hover:bg-[#2F6BFF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  保存全部配置
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
