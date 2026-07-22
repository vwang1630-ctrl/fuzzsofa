'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  LayoutGrid, Image as ImageIcon, Package, FolderOpen, FileText,
  Plus, Trash2, Edit2, GripVertical, ChevronUp, ChevronDown,
  Save, X, AlertCircle, Check
} from 'lucide-react';

const ADMIN_TOKEN_KEY = 'admin_token';

type SectionType = 'header' | 'banner' | 'featured' | 'cases' | 'posts';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderConfig {
  siteName: string;
  logo: string;
  logoText: string;
  navItems: NavItem[];
  languages: { code: string; label: string }[];
  defaultLanguage: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  sortOrder: number;
  isActive: boolean;
}

interface FeaturedProduct {
  id: string;
  productSlug: string;
  displayOrder: number;
  tag: string;
  customTitle: string;
  customSubtitle: string;
  isActive: boolean;
  productName?: string;
  productImage?: string;
}

interface DesignCase {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface Post {
  id: string;
  postSlug: string;
  displayOrder: number;
  isActive: boolean;
  postTitle?: string;
  postExcerpt?: string;
  postCategory?: string;
}

const sectionConfig: Record<SectionType, { label: string; icon: React.ElementType }> = {
  header: { label: '网站头部', icon: LayoutGrid },
  banner: { label: '轮播图', icon: ImageIcon },
  featured: { label: '主推商品', icon: Package },
  cases: { label: '设计案例', icon: FolderOpen },
  posts: { label: '最新动态', icon: FileText },
};

export default function HomepageManagePage() {
  const [activeSection, setActiveSection] = useState<SectionType>('header');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Header config
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    siteName: 'FUZZ SOFA',
    logo: '',
    logoText: 'FUZZ SOFA',
    navItems: [
      { label: 'Products', href: '/products' },
      { label: 'About', href: '/about' },
      { label: 'Magazine', href: '/magazine' },
      { label: 'Contact', href: '/contact' },
    ],
    languages: [
      { code: 'en', label: 'English' },
      { code: 'zh', label: '中文' },
    ],
    defaultLanguage: 'en',
  });

  // Data
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [designCases, setDesignCases] = useState<DesignCase[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allProducts, setAllProducts] = useState<{ slug: string; name: string; image?: string }[]>([]);

  // Edit states
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingCase, setEditingCase] = useState<DesignCase | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showPostPicker, setShowPostPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const authHeaders = (): Record<string, string> => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return token ? { 'x-session': token } : {};
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configRes, bannersRes, featuredRes, casesRes, postsRes, productsRes] = await Promise.all([
        fetch('/api/admin/homepage/config', { headers: authHeaders() }),
        fetch('/api/admin/homepage/banners', { headers: authHeaders() }),
        fetch('/api/admin/homepage/featured', { headers: authHeaders() }),
        fetch('/api/admin/homepage/cases', { headers: authHeaders() }),
        fetch('/api/admin/homepage/posts', { headers: authHeaders() }),
        fetch('/api/admin/products', { headers: authHeaders() }),
      ]);

      if (configRes.ok) {
        const config = await configRes.json();
        if (config.header) setHeaderConfig(config.header);
      }
      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (featuredRes.ok) setFeaturedProducts(await featuredRes.json());
      if (casesRes.ok) setDesignCases(await casesRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
      if (productsRes.ok) {
        const products = await productsRes.json();
        setAllProducts(products.map((p: { slug: string; name: string; images?: { hero?: string } }) => ({
          slug: p.slug,
          name: p.name,
          image: p.images?.hero,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const saveHeaderConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage/config', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ header: headerConfig }),
      });
      if (res.ok) {
        showToast('success', '网站头部配置已保存');
      } else {
        showToast('error', '保存失败');
      }
    } catch {
      showToast('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    setHeaderConfig({
      ...headerConfig,
      navItems: [...headerConfig.navItems, { label: 'New Item', href: '/' }],
    });
  };

  const updateNavItem = (index: number, field: keyof NavItem, value: string) => {
    const newItems = [...headerConfig.navItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setHeaderConfig({ ...headerConfig, navItems: newItems });
  };

  const removeNavItem = (index: number) => {
    setHeaderConfig({
      ...headerConfig,
      navItems: headerConfig.navItems.filter((_, i) => i !== index),
    });
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...headerConfig.navItems];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setHeaderConfig({ ...headerConfig, navItems: newItems });
  };

  // Banner operations
  const saveBanner = async (banner: Partial<Banner>) => {
    setSaving(true);
    try {
      const method = banner.id ? 'PUT' : 'POST';
      const url = banner.id ? `/api/admin/homepage/banners/${banner.id}` : '/api/admin/homepage/banners';
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (res.ok) {
        showToast('success', banner.id ? '轮播图已更新' : '轮播图已添加');
        setEditingBanner(null);
        fetchData();
      } else {
        showToast('error', '保存失败');
      }
    } catch {
      showToast('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('确定要删除这个轮播图吗？')) return;
    try {
      const res = await fetch(`/api/admin/homepage/banners/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('success', '轮播图已删除');
        fetchData();
      }
    } catch {
      showToast('error', '删除失败');
    }
  };

  // Featured products operations
  const saveFeaturedProducts = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage/featured', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: featuredProducts }),
      });
      if (res.ok) {
        showToast('success', '主推商品已保存');
      } else {
        showToast('error', '保存失败');
      }
    } catch {
      showToast('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addFeaturedProduct = (product: { slug: string; name: string; image?: string }) => {
    if (featuredProducts.some(p => p.productSlug === product.slug)) return;
    setFeaturedProducts([
      ...featuredProducts,
      {
        id: `temp-${Date.now()}`,
        productSlug: product.slug,
        displayOrder: featuredProducts.length + 1,
        tag: 'NEW',
        customTitle: product.name,
        customSubtitle: '',
        isActive: true,
        productName: product.name,
        productImage: product.image,
      },
    ]);
  };

  const removeFeaturedProduct = (id: string) => {
    setFeaturedProducts(featuredProducts.filter(p => p.id !== id));
  };

  const updateFeaturedProduct = (id: string, field: keyof FeaturedProduct, value: string | boolean) => {
    setFeaturedProducts(featuredProducts.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Design cases operations
  const saveCase = async (caseItem: Partial<DesignCase>) => {
    setSaving(true);
    try {
      const method = caseItem.id ? 'PUT' : 'POST';
      const url = caseItem.id ? `/api/admin/homepage/cases/${caseItem.id}` : '/api/admin/homepage/cases';
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(caseItem),
      });
      if (res.ok) {
        showToast('success', caseItem.id ? '案例已更新' : '案例已添加');
        setEditingCase(null);
        fetchData();
      } else {
        showToast('error', '保存失败');
      }
    } catch {
      showToast('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const deleteCase = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    try {
      const res = await fetch(`/api/admin/homepage/cases/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('success', '案例已删除');
        fetchData();
      }
    } catch {
      showToast('error', '删除失败');
    }
  };

  // Posts operations
  const savePosts = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage/posts', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: posts }),
      });
      if (res.ok) {
        showToast('success', '最新动态已保存');
      } else {
        showToast('error', '保存失败');
      }
    } catch {
      showToast('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  const sectionIcons = {
    header: LayoutGrid,
    banner: ImageIcon,
    featured: Package,
    cases: FolderOpen,
    posts: FileText,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F6BFF]" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Left Sidebar - Section Navigator */}
      <div className="w-64 bg-white border-r border-[#E6EAF2] flex flex-col">
        <div className="p-4 border-b border-[#E6EAF2]">
          <h2 className="text-lg font-semibold text-[#152033]">首页装修</h2>
          <p className="text-sm text-[#637089] mt-1">管理首页各模块内容</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {(['header', 'banner', 'featured', 'cases', 'posts'] as SectionType[]).map((section) => {
            const Icon = sectionConfig[section].icon;
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section
                    ? 'bg-[#2F6BFF] text-white'
                    : 'text-[#152033] hover:bg-[#F6F8FB]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{sectionConfig[section].label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#E6EAF2]">
          <Button
            onClick={() => fetchData()}
            variant="outline"
            className="w-full"
          >
            刷新数据
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#F6F8FB] p-6">
        {/* Header Section */}
        {activeSection === 'header' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border border-[#E6EAF2] p-6">
              <h3 className="text-lg font-semibold text-[#152033] mb-6">网站头部配置</h3>

              <div className="space-y-6">
                <div>
                  <Label className="text-[#152033]">站点名称</Label>
                  <Input
                    value={headerConfig.siteName}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, siteName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[#152033]">Logo URL（可选）</Label>
                  <Input
                    value={headerConfig.logo}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="mt-1"
                  />
                  {headerConfig.logo && (
                    <img src={headerConfig.logo} alt="Logo preview" className="mt-2 h-10 object-contain" />
                  )}
                </div>

                <div>
                  <Label className="text-[#152033]">Logo 文字（当无 Logo 图片时显示）</Label>
                  <Input
                    value={headerConfig.logoText}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, logoText: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-[#152033]">导航菜单</Label>
                    <Button onClick={addNavItem} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      添加菜单
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {headerConfig.navItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-[#F6F8FB] rounded-lg">
                        <GripVertical className="w-4 h-4 text-[#637089] cursor-grab" />
                        <Input
                          value={item.label}
                          onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                          className="flex-1"
                          placeholder="菜单名称"
                        />
                        <Input
                          value={item.href}
                          onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                          className="flex-1"
                          placeholder="链接地址"
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveNavItem(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveNavItem(index, 'down')}
                            disabled={index === headerConfig.navItems.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNavItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-[#152033]">默认语言</Label>
                  <select
                    value={headerConfig.defaultLanguage}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, defaultLanguage: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-[#E6EAF2] rounded-lg"
                  >
                    {headerConfig.languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={saveHeaderConfig}
                  disabled={saving}
                  className="w-full bg-[#2F6BFF] hover:bg-[#2558D6]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? '保存中...' : '保存配置'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Banner Section */}
        {activeSection === 'banner' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#152033]">轮播图管理</h3>
                <p className="text-sm text-[#637089]">共 {banners.length} 张轮播图</p>
              </div>
              <Button onClick={() => setEditingBanner({} as Banner)} className="bg-[#2F6BFF] hover:bg-[#2558D6]">
                <Plus className="w-4 h-4 mr-2" />
                添加轮播图
              </Button>
            </div>

            <div className="grid gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-[#E6EAF2] p-4 flex items-center gap-4">
                  <img
                    src={banner.imageUrl || '/placeholder-banner.png'}
                    alt={banner.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#152033]">{banner.title}</h4>
                    <p className="text-sm text-[#637089]">{banner.subtitle}</p>
                    <p className="text-xs text-[#637089] mt-1">链接: {banner.linkUrl}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={(checked) => saveBanner({ ...banner, isActive: checked })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => setEditingBanner(banner)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBanner(banner.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Banner Modal */}
            {editingBanner && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-[#152033]">
                      {editingBanner.id ? '编辑轮播图' : '添加轮播图'}
                    </h4>
                    <Button variant="ghost" size="icon" onClick={() => setEditingBanner(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>标题</Label>
                      <Input
                        value={editingBanner.title || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>副标题</Label>
                      <Textarea
                        value={editingBanner.subtitle || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>图片 URL</Label>
                      <Input
                        value={editingBanner.imageUrl || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>链接地址</Label>
                      <Input
                        value={editingBanner.linkUrl || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>按钮文字</Label>
                      <Input
                        value={editingBanner.buttonText || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={() => saveBanner(editingBanner)}
                      disabled={saving}
                      className="w-full bg-[#2F6BFF] hover:bg-[#2558D6]"
                    >
                      {saving ? '保存中...' : '保存'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Featured Products Section */}
        {activeSection === 'featured' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#152033]">主推商品</h3>
                <p className="text-sm text-[#637089]">共 {featuredProducts.length} 件商品</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowProductPicker(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加商品
                </Button>
                <Button onClick={saveFeaturedProducts} disabled={saving} className="bg-[#2F6BFF] hover:bg-[#2558D6]">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-[#E6EAF2] p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[#637089] w-8">#{index + 1}</span>
                    {product.productImage && (
                      <img
                        src={product.productImage}
                        alt={product.customTitle}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-[#637089]">商品</Label>
                        <p className="font-medium text-[#152033]">{product.productName || product.customTitle}</p>
                        <p className="text-sm text-[#637089]">{product.productSlug}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-[#637089]">标签</Label>
                        <select
                          value={product.tag}
                          onChange={(e) => updateFeaturedProduct(product.id, 'tag', e.target.value)}
                          className="mt-1 w-full px-2 py-1 border border-[#E6EAF2] rounded text-sm"
                        >
                          <option value="BESTSELLER">BESTSELLER</option>
                          <option value="NEW">NEW</option>
                          <option value="TRENDING">TRENDING</option>
                          <option value="HOT">HOT</option>
                          <option value="">无标签</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-[#637089]">显示状态</Label>
                        <div className="mt-1">
                          <Switch
                            checked={product.isActive}
                            onCheckedChange={(checked) => updateFeaturedProduct(product.id, 'isActive', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeaturedProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Picker Modal */}
            {showProductPicker && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-[#E6EAF2]">
                    <h4 className="text-lg font-semibold text-[#152033]">选择商品</h4>
                    <Button variant="ghost" size="icon" onClick={() => setShowProductPicker(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 border-b border-[#E6EAF2]">
                    <Input
                      placeholder="搜索商品..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid gap-2">
                      {filteredProducts.map((product) => {
                        const isAdded = featuredProducts.some(p => p.productSlug === product.slug);
                        return (
                          <div
                            key={product.slug}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              isAdded ? 'border-green-500 bg-green-50' : 'border-[#E6EAF2] hover:bg-[#F6F8FB]'
                            }`}
                          >
                            {product.image && (
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-[#152033]">{product.name}</p>
                              <p className="text-sm text-[#637089]">{product.slug}</p>
                            </div>
                            <Button
                              size="sm"
                              variant={isAdded ? 'outline' : 'default'}
                              onClick={() => addFeaturedProduct(product)}
                              disabled={isAdded}
                              className={isAdded ? '' : 'bg-[#2F6BFF] hover:bg-[#2558D6]'}
                            >
                              {isAdded ? '已添加' : '添加'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Design Cases Section */}
        {activeSection === 'cases' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#152033]">设计案例</h3>
                <p className="text-sm text-[#637089]">共 {designCases.length} 个案例</p>
              </div>
              <Button onClick={() => setEditingCase({} as DesignCase)} className="bg-[#2F6BFF] hover:bg-[#2558D6]">
                <Plus className="w-4 h-4 mr-2" />
                添加案例
              </Button>
            </div>

            <div className="grid gap-4">
              {designCases.map((caseItem) => (
                <div key={caseItem.id} className="bg-white rounded-xl shadow-sm border border-[#E6EAF2] p-4 flex items-center gap-4">
                  <img
                    src={caseItem.imageUrl || '/placeholder-case.png'}
                    alt={caseItem.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#152033]">{caseItem.title}</h4>
                    <p className="text-sm text-[#637089]">{caseItem.subtitle}</p>
                    <p className="text-xs text-[#637089] mt-1">链接: {caseItem.linkUrl}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={caseItem.isActive}
                      onCheckedChange={(checked) => saveCase({ ...caseItem, isActive: checked })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => setEditingCase(caseItem)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCase(caseItem.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Case Modal */}
            {editingCase && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-[#152033]">
                      {editingCase.id ? '编辑案例' : '添加案例'}
                    </h4>
                    <Button variant="ghost" size="icon" onClick={() => setEditingCase(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>标题</Label>
                      <Input
                        value={editingCase.title || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>副标题</Label>
                      <Textarea
                        value={editingCase.subtitle || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, subtitle: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>图片 URL</Label>
                      <Input
                        value={editingCase.imageUrl || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, imageUrl: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>链接地址</Label>
                      <Input
                        value={editingCase.linkUrl || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, linkUrl: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={() => saveCase(editingCase)}
                      disabled={saving}
                      className="w-full bg-[#2F6BFF] hover:bg-[#2558D6]"
                    >
                      {saving ? '保存中...' : '保存'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Latest Posts Section */}
        {activeSection === 'posts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#152033]">最新动态</h3>
                <p className="text-sm text-[#637089]">共 {posts.length} 篇文章</p>
              </div>
              <Button onClick={savePosts} disabled={saving} className="bg-[#2F6BFF] hover:bg-[#2558D6]">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>

            <div className="grid gap-4">
              {posts.map((post, index) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-[#E6EAF2] p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[#637089] w-8">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded">
                          {post.postCategory || 'Article'}
                        </span>
                        <span className="text-sm text-[#637089]">{post.postSlug}</span>
                      </div>
                      <p className="font-medium text-[#152033]">{post.postTitle || post.postSlug}</p>
                      {post.postExcerpt && (
                        <p className="text-sm text-[#637089] mt-1">{post.postExcerpt}</p>
                      )}
                    </div>
                    <Switch
                      checked={post.isActive}
                      onCheckedChange={(checked) => {
                        setPosts(posts.map(p =>
                          p.id === post.id ? { ...p, isActive: checked } : p
                        ));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
