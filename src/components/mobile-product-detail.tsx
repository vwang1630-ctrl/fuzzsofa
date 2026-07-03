'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, Region } from '@/lib/products';
import { formatPrice, getPrice } from '@/lib/products';

interface MobileProductDetailProps {
  product: Product;
  productImages: string[];
  storyImages: string[];
  spaceImages: string[];
  featureData: { titleKey: string; fallbackTitle: string; descKey: string; fallbackDesc: string }[];
  craftData: { name: string; detail: string }[];
  relatedProducts: { slug: string; name: string; image: string; price: string; desc: string }[];
  locale: string;
  region: Region;
  selectedMaterial: number;
  onMaterialChange: (idx: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  t: (key: string) => string;
  cartCount: number;
}

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
];

// Map spec keys to translatable labels
const SPEC_LABELS: Record<string, { key: string; fallback: string }> = {
  width: { key: 'width', fallback: '宽度' },
  height: { key: 'height', fallback: '高度' },
  depth: { key: 'depth', fallback: '深度' },
  seatHeight: { key: 'seatHeight', fallback: '座高' },
  weight: { key: 'weight', fallback: '重量' },
  capacity: { key: 'capacity', fallback: '承重' },
};

export default function MobileProductDetail({
  product,
  productImages,
  storyImages,
  spaceImages,
  featureData,
  craftData,
  relatedProducts,
  locale,
  region,
  selectedMaterial,
  onMaterialChange,
  onAddToCart,
  onBuyNow,
  t,
  cartCount,
}: MobileProductDetailProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const colors = product.materialOptions || [];
  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImage < productImages.length - 1) {
        setCurrentImage((prev) => prev + 1);
      } else if (diff < 0 && currentImage > 0) {
        setCurrentImage((prev) => prev - 1);
      }
    }
  }, [currentImage, productImages.length]);

  const handleShareCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch { /* ignore */ }
    setShareOpen(false);
  }, []);

  const handleShareSave = useCallback(() => {
    const link = document.createElement('a');
    link.href = productImages[currentImage];
    link.download = `${product.slug}-image.jpg`;
    link.click();
    setShareOpen(false);
  }, [productImages, currentImage, product.slug]);

  // Convert specifications object to array
  const specRows = Object.entries(product.specifications || {}).map(([key, value]) => {
    const cmVal = parseFloat(value);
    return {
      label: SPEC_LABELS[key]?.fallback || key,
      cmValue: key === 'weight' || key === 'capacity' ? value : `${value} cm`,
      inValue: key === 'weight' || key === 'capacity' ? value : isNaN(cmVal) ? value : `${(cmVal / 2.54).toFixed(1)} in`,
      isConvertible: key !== 'weight' && key !== 'capacity',
    };
  });

  const price = formatPrice(getPrice(product, region), region);
  const currencyLabel = region === 'europe' ? 'EUR' : 'USD';

  useEffect(() => {
    if (langOpen || shareOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [langOpen, shareOpen]);

  // Add body class to hide global header on mobile product pages
  useEffect(() => {
    document.body.classList.add('has-mobile-pdp');
    return () => { document.body.classList.remove('has-mobile-pdp'); };
  }, []);

  return (
    <>
      <div className="container lg:hidden">
        {/* ===== 顶部导航 ===== */}
        <div className="masthead">
          <span className="brand">FUZZ SOFA <em>studio</em></span>

          <div className="lang-dropdown">
            <div className="toggle" onClick={() => setLangOpen(!langOpen)}>
              <span>{currentLang.label}</span>
              <span className={`arrow${langOpen ? ' open' : ''}`}>▾</span>
            </div>
            <div className={`menu${langOpen ? ' open' : ''}`}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`menu-item${lang.code === locale ? ' active' : ''}`}
                  onClick={() => {
                    setLangOpen(false);
                    router.push(`/${lang.code === 'en' ? '' : lang.code}/${product.slug}`);
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          <div className={`lang-backdrop${langOpen ? ' open' : ''}`} onClick={() => setLangOpen(false)} />

          <div className="right">
            <span className="cart-link" onClick={() => router.push('/cart')}>
              {t('cart') || '购物车'} ({cartCount})
            </span>
            <button onClick={() => router.push('/search')}>
              <svg className="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="16" y1="16" x2="22" y2="22" /></svg>
            </button>
            <div className="avatar" onClick={() => router.push('/account')}>
              <svg className="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </div>
        </div>

        {/* ===== 图片区 ===== */}
        <div
          className="hero-image"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img src={productImages[currentImage]} alt={product.name} />

          <div className="float-ai">
            <button>
              <svg className="icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
            </button>
          </div>

          <div className="share-dropdown">
            <button className="share-toggle" onClick={() => setShareOpen(!shareOpen)} aria-label="Share">
              <svg viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <div className={`share-menu${shareOpen ? ' open' : ''}`}>
              <button className="menu-item" onClick={handleShareCopy}>
                <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                <span>{t('shareCopy') || '复制链接'}</span>
              </button>
              <button className="menu-item" onClick={handleShareSave}>
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                <span>{t('shareSave') || '保存图片'}</span>
              </button>
              <div className="menu-divider" />
              <button className="menu-item" onClick={() => { setShareOpen(false); }}>
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                <span>Facebook</span>
              </button>
              <button className="menu-item" onClick={() => { setShareOpen(false); }}>
                <svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                <span>Twitter / X</span>
              </button>
              <button className="menu-item" onClick={() => { setShareOpen(false); }}>
                <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>
                <span>Email</span>
              </button>
            </div>
          </div>
          <div className={`share-backdrop${shareOpen ? ' open' : ''}`} onClick={() => setShareOpen(false)} />

          <div className="float-actions">
            <button onClick={() => setIsFav(!isFav)}>
              <svg className="icon" viewBox="0 0 24 24" style={isFav ? { fill: '#E8B4B8', stroke: '#E8B4B8' } : {}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </button>
          </div>

          <div className="image-indicator">
            {productImages.map((_, idx) => (
              <span key={idx} className={idx === currentImage ? 'active' : ''}>
                {String(idx + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>

        {/* ===== 颜色选择器 ===== */}
        {colors.length > 0 && (
          <div className="color-selector">
            <span className="label">{t('color') || '颜色'}</span>
            <div className="options">
              {colors.map((colorOpt, idx) => (
                <button
                  key={idx}
                  className={`color-btn${idx === selectedMaterial ? ' active' : ''}`}
                  onClick={() => onMaterialChange(idx)}
                >
                  <span className="swatch-wrap">
                    <span
                      className="swatch"
                      style={{ background: colorOpt.colors?.[0] || '#888' }}
                    />
                    <span className="check" />
                  </span>
                  <span className="label-text">{colorOpt.options?.[0] || colorOpt.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== 卖点 ===== */}
        {featureData.length > 0 && (
          <div className="features">
            {featureData.map((feat, idx) => (
              <div className="feature-row" key={idx}>
                <span className="num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="label">{feat.fallbackTitle}</span>
                <span className="desc">{feat.fallbackDesc}</span>
              </div>
            ))}
          </div>
        )}

        {/* ===== 描述 ===== */}
        <div className="description">
          <p>{product.description}</p>
        </div>

        {/* ===== THE STORY ===== */}
        {storyImages.length > 0 && (
          <div className="story">
            <div className="section-label">{t('storyTitle') || '设计故事'}</div>
            <div className="story-grid">
              <div className="story-image">
                <img src={storyImages[0]} alt="Design sketch" loading="lazy" />
                <span className="sketch-tag">✧ {t('sketchTag') || '手稿 · 概念设计'}</span>
              </div>
              <div className="story-text">
                <div className="title">{product.name} <span className="light">✦</span></div>
                <p>{product.concept}</p>
                <p className="spec-note">
                  <span>{t('handmadeNote') || '* 手工制作 · 尺寸可能存在 ±1-3cm 差异 · 重量因面料批次略有浮动'}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== 规格 ===== */}
        {specRows.length > 0 && (
          <>
            <div className="specs-header">
              <span className="label">{t('dimensions') || '尺寸'}</span>
              <div className="unit-toggle">
                <button
                  className={unit === 'cm' ? 'active' : ''}
                  onClick={() => setUnit('cm')}
                >
                  cm
                </button>
                <button
                  className={unit === 'in' ? 'active' : ''}
                  onClick={() => setUnit('in')}
                >
                  in
                </button>
              </div>
            </div>
            <div className="specs">
              {specRows.map((spec, idx) => (
                <div className="spec-item" key={idx}>
                  <span className="l">{spec.label}</span>
                  <span className="v">{unit === 'cm' || !spec.isConvertible ? spec.cmValue : spec.inValue}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== 材质 ===== */}
        {craftData.length > 0 && (
          <div className="craft">
            <div className="section-label">{t('craftTitle') || '材质与工艺'}</div>
            <div className="craft-list">
              {craftData.map((item, idx) => (
                <div className="craft-item" key={idx}>
                  <span className="line" />
                  <span className="name">{item.name}</span>
                  <span className="detail">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 场景 ===== */}
        {spaceImages.length > 0 && (
          <div className="inspiration">
            <div className="section-label">{t('sceneTitle') || '实景灵感'}</div>
            <div className="scene-scroll">
              {spaceImages.map((img, idx) => (
                <div className="scene-card" key={idx}>
                  <img src={img} alt="" loading="lazy" />
                  <div className="label">{idx === 0 ? (t('scene1Label') || '星际 lounge') : idx === 1 ? (t('scene2Label') || '沙丘静修') : (t('scene3Label') || '银河沙龙')}</div>
                  <div className="sub">{idx === 0 ? (t('scene1Sub') || '星空下的起居室') : idx === 1 ? (t('scene2Sub') || '静谧 · 沉思 · 温暖') : (t('scene3Sub') || '长谈之地')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 发现更多 ===== */}
        {relatedProducts.length > 0 && (
          <div className="explore-more">
            <div className="explore-header">
              <span className="explore-label">{t('exploreMore') || '发现更多'}</span>
              <span className="explore-view-all" onClick={() => router.push('/')}>{t('viewAll') || '查看全部'} →</span>
            </div>
            <div className="explore-scroll">
              {relatedProducts.map((item) => (
                <div className="explore-card" key={item.slug} onClick={() => router.push(`/${item.slug}`)}>
                  <div className="explore-card-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="explore-card-info">
                    <div className="explore-card-name">{item.name}</div>
                    <div className="explore-card-desc">{item.desc}</div>
                    <div className="explore-card-price">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== 底部 CTA ===== */}
      <div className="bottom-cta lg:hidden">
        <div className="row-top">
          <div className="product-id">
            <span className="brand">FUZZ SOFA</span>
            <span className="name">{product.name} <span className="light">✦</span></span>
          </div>
          <button className="btn-ai-clean">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="ai-label">AI {t('preview') || '预览'}</span>
          </button>
        </div>
        <div className="row-bottom">
          <span className="price">{price} <small>{currencyLabel}</small></span>
          <button className="btn-buy" onClick={onBuyNow}>{t('buyNow') || '购买'}</button>
        </div>
      </div>
    </>
  );
}
