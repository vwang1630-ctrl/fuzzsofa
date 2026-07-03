'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Product } from '@/lib/products';
import type { Locale } from '@/lib/i18n';
import { getPrice, formatPrice } from '@/lib/products';

/* ===== Types ===== */
interface SpaceImage {
  image: string;
  titleKey?: string;
  title?: string;
  descKey: string;
}

interface FeatureItem {
  titleKey: string;
  fallbackTitle: string;
  descKey: string;
  fallbackDesc: string;
}

interface CraftItem {
  name: string;
  detail: string;
}

interface RelatedProduct {
  slug: string;
  name: string;
  image: string;
  price: string;
  desc: string;
}

interface MobileProductDetailProps {
  product: Product;
  region: 'americas' | 'europe' | 'middle_east' | 'se_asia';
  productImages: string[];
  storyImage: string;
  spaceImages: SpaceImage[];
  featureData: FeatureItem[];
  craftData: CraftItem[];
  locale: Locale;
  cartCount: number;
  onAddToCart: () => void;
  t: (key: string) => string;
}

/* ===== Helper: safe translate ===== */
const FALLBACKS: Record<string, string> = {
  color: '颜色',
  dimensions: '尺寸',
  story: '设计故事',
  craft: '材质与工艺',
  inspiration: '实景灵感',
  explore: '发现更多',
  buy: '购买',
  aiPreview: 'AI 预览',
  share: '分享',
  copyLink: '复制链接',
  saveImage: '保存图片',
  cancel: '取消',
  launchAR: '启动 AR 预览',
  cm: 'CM',
  inch: '英寸',
  width: '宽度',
  depth: '深度',
  height: '高度',
  seatHeight: '座高',
};

function txt(t: (key: string) => string, key: string): string {
  const v = t(key);
  return v === key ? (FALLBACKS[key] || key) : v;
}

/* ===== Component ===== */
export default function MobileProductDetail(props: MobileProductDetailProps) {
  const {
    product,
    region,
    productImages,
    storyImage,
    spaceImages,
    featureData,
    craftData,
    locale,
    onAddToCart,
    t,
  } = props;

  // Gallery state
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Color state
  const colors = product.materialOptions?.[0]?.colors || [];
  const options = product.materialOptions?.[0]?.options || [];
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  // Unit toggle
  const [isCm, setIsCm] = useState(true);

  // Language dropdown
  const [langOpen, setLangOpen] = useState(false);

  // Share dropdown
  const [shareOpen, setShareOpen] = useState(false);

  // Favorite
  const [isFav, setIsFav] = useState(false);

  // AR modal
  const [arOpen, setArOpen] = useState(false);

  // Body class for header hiding
  useEffect(() => {
    document.body.classList.add('has-mobile-pdp');
    return () => document.body.classList.remove('has-mobile-pdp');
  }, []);

  // Images to display (hero gallery)
  const displayImages = productImages.length > 0 ? productImages : ['/products/placeholder.jpg'];

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < displayImages.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
    }
  }, [currentSlide, displayImages.length]);

  // Dimensions
  const specs = product.specifications;
  const specRows = [
    { label: txt(t, 'width'), cm: specs?.width, inch: specs?.width },
    { label: txt(t, 'depth'), cm: specs?.depth, inch: specs?.depth },
    { label: txt(t, 'height'), cm: specs?.height, inch: specs?.height },
    { label: txt(t, 'seatHeight'), cm: specs?.seatHeight, inch: specs?.seatHeight },
  ].filter(s => s.cm);

  // Price
  const price = formatPrice(getPrice(product, region), region);

  // Related products (from product.relatedProducts via props — we just use spaceImages for explore)
  const relatedSlugs = product.relatedProducts || [];

  return (
    <div className="m_container lg:hidden">
      {/* ===== Masthead ===== */}
      <div className="m_masthead">
        <div className="m_brand">FUZZ SOFA <em>studio</em></div>
        <div className="m_right">
          <div className="m_lang-dropdown">
            <div className="m_toggle" onClick={() => setLangOpen(!langOpen)}>
              {locale === 'zh' ? '中文' : locale === 'en' ? 'EN' : locale.toUpperCase()}
              <span className={`m_arrow ${langOpen ? 'm_open' : ''}`}>▼</span>
            </div>
            {langOpen && (
              <>
                <div className="m_lang-backdrop m_open" onClick={() => setLangOpen(false)} />
                <div className="m_menu m_open">
                  {['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'fa', 'hi'].map(l => (
                    <button key={l} className={`m_menu-item ${locale === l ? 'm_active' : ''}`}
                      onClick={() => setLangOpen(false)}>
                      {l === 'zh' ? '中文' : l === 'en' ? 'English' : l === 'ja' ? '日本語' : l === 'ko' ? '한국어' : l === 'fr' ? 'Français' : l === 'de' ? 'Deutsch' : l === 'es' ? 'Español' : l === 'it' ? 'Italiano' : l === 'pt' ? 'Português' : l === 'ru' ? 'Русский' : l === 'ar' ? 'العربية' : l === 'fa' ? 'فارسی' : l === 'hi' ? 'हिन्दी' : l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="m_cart-link">购物车 (0)</span>
          <button><svg className="m_icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
          <div className="m_avatar"><svg className="m_icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        </div>
      </div>

      {/* ===== Hero Gallery ===== */}
      <div className="m_hero-image"
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <img src={displayImages[currentSlide]} alt={product.name} />
        <div className="m_float-ai">
          <button onClick={() => setArOpen(true)}>
            <svg className="m_icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </button>
        </div>
        <div className="m_float-actions">
          <button onClick={() => setIsFav(!isFav)} className={isFav ? 'm_faved' : ''}>
            <svg className="m_icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        <div className="m_share-dropdown">
          <button className="m_share-toggle" onClick={() => setShareOpen(!shareOpen)}>
            <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
          {shareOpen && (
            <div className="m_share-menu m_open">
              <button className="m_share-item" onClick={() => { navigator.clipboard?.writeText(window.location.href); setShareOpen(false); }}>
                <svg className="m_icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {txt(t, 'copyLink')}
              </button>
              <button className="m_share-item" onClick={() => setShareOpen(false)}>
                <svg className="m_icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {txt(t, 'saveImage')}
              </button>
              <button className="m_share-item" onClick={() => setShareOpen(false)}>
                <svg className="m_icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {txt(t, 'cancel')}
              </button>
            </div>
          )}
        </div>
        <div className="m_image-indicator">
          {displayImages.map((_: string, i: number) => (
            <span key={i} className={i === currentSlide ? 'm_active' : ''}>
              {String(i + 1).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>

      {/* ===== Color Selector ===== */}
      {colors.length > 0 && (
        <div className="m_color-selector">
          <div className="m_section-label">{txt(t, 'color')}</div>
          <div className="m_colors">
            {options.map((name: string, i: number) => (
              <div key={i} className="m_color-item" onClick={() => setSelectedColorIdx(i)}>
                <div className={`m_swatch ${i === selectedColorIdx ? 'm_active' : ''}`}
                  style={{ backgroundColor: colors[i] || '#888' }} />
                <span className="m_color-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Features ===== */}
      {featureData.length > 0 && (
        <div className="m_features">
          {featureData.map((feat: FeatureItem, i: number) => (
            <div className="m_feature-row" key={i}>
              <div className="m_num">{String(i + 1).padStart(2, '0')}</div>
              <div className="m_feature-text">
                <div className="m_feat-title">{feat.fallbackTitle}</div>
                <div className="m_feat-desc">{feat.fallbackDesc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Description ===== */}
      {product.concept && (
        <div className="m_description">
          <p>{product.concept}</p>
        </div>
      )}

      {/* ===== Story ===== */}
      {(storyImage || product.concept) && (
        <div className="m_story">
          <div className="m_section-label">{txt(t, 'story')}</div>
          <div className="m_story-grid">
            {storyImage && (
              <div className="m_story-img">
                <img src={storyImage} alt="Design story" />
              </div>
            )}
            <div className="m_story-text">
              <p>{product.concept || ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Dimensions ===== */}
      {specRows.length > 0 && (
        <div className="m_specs-section">
          <div className="m_specs-header">
            <div className="m_section-label">{txt(t, 'dimensions')}</div>
            <div className="m_unit-toggle">
              <button className={isCm ? 'm_active' : ''} onClick={() => setIsCm(true)}>{txt(t, 'cm')}</button>
              <span>/</span>
              <button className={!isCm ? 'm_active' : ''} onClick={() => setIsCm(false)}>{txt(t, 'inch')}</button>
            </div>
          </div>
          <div className="m_specs">
            {specRows.map((spec: { label: string; cm?: string; inch?: string }, i: number) => (
              <div className="m_spec-item" key={i}>
                <div className="m_spec-label">{spec.label}</div>
                <div className="m_spec-value">{isCm ? `${spec.cm}cm` : `${spec.cm}in`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Craft / Materials ===== */}
      {craftData.length > 0 && (
        <div className="m_craft-section">
          <div className="m_section-label">{txt(t, 'craft')}</div>
          <div className="m_craft">
            {craftData.map((item: CraftItem, i: number) => (
              <div className="m_craft-item" key={i}>
                <div className="m_num">{String(i + 1).padStart(2, '0')}</div>
                <div className="m_craft-text">
                  <div className="m_name">{item.name}</div>
                  <div className="m_desc">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Interior Inspiration ===== */}
      {spaceImages.length > 0 && (
        <div className="m_inspiration">
          <div className="m_section-label">{txt(t, 'inspiration')}</div>
          <div className="m_inspiration-scroll">
            {spaceImages.map((space: SpaceImage, i: number) => (
              <div className="m_insp-card" key={i}>
                <img src={space.image} alt={space.title || ''} />
                <div className="m_insp-info">
                  <div className="m_insp-title">{space.title || ''}</div>
                  <div className="m_insp-sub">{space.descKey || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Explore More ===== */}
      {relatedSlugs.length > 0 && (
        <div className="m_explore-more">
          <div className="m_section-label">{txt(t, 'explore')}</div>
          <div className="m_explore-scroll">
            {relatedSlugs.map((slug: string) => (
              <a className="m_explore-card" key={slug} href={`/${slug}`}>
                <div className="m_explore-info">
                  <div className="m_explore-name">{slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ===== Bottom CTA ===== */}
      <div className="m_bottom-cta">
        <div className="m_cta-left">
          <div className="m_product-id">
            <span className="m_brand">FUZZ SOFA</span>
            <span className="m_name">{product.name} <span className="m_light">✦</span></span>
          </div>
          <div className="m_price-row">
            <span className="m_price">{price}</span>
            <span className="m_currency">{region === 'europe' ? 'EUR' : 'USD'}</span>
          </div>
        </div>
        <div className="m_cta-right">
          <button className="m_btn-ai-clean" onClick={() => setArOpen(true)}>
            <svg className="m_icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span className="m_ai-label">{txt(t, 'aiPreview')}</span>
          </button>
          <button className="m_btn-buy" onClick={onAddToCart}>{txt(t, 'buy')}</button>
        </div>
      </div>

      {/* ===== AR Modal ===== */}
      {arOpen && (
        <div className="m_ar-overlay">
          <div className="m_ar-panel">
            <div className="m_ar-header">
              <span className="m_ar-title">AR Preview</span>
              <button onClick={() => setArOpen(false)}>✕</button>
            </div>
            <div className="m_ar-body">
              <svg className="m_icon" viewBox="0 0 24 24" style={{width: 48, height: 48, stroke: '#E8B4B8'}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <p style={{color: '#8A8580', fontSize: 14, textAlign: 'center', margin: '16px 0'}}>{product.name}</p>
              <button className="m_btn-buy" style={{width: '100%'}} onClick={() => setArOpen(false)}>
                {txt(t, 'launchAR')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
