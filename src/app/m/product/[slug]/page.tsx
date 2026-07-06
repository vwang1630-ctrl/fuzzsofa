'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductDetail {
  slug: string;
  name: string;
  animal: string;
  tagline: string;
  priceRange: {
    americas: [number, number];
    europe: [number, number];
    middle_east: [number, number];
    se_asia: [number, number];
  };
  images: string[];
  materialOptions: {
    type: string;
    options: string[];
    colors: string[];
  }[];
  description: string;
  storyTitle: string;
  storyText: string[];
  specs: { label: string; cm: string; inch: string }[];
  crafts: { name: string; detail: string }[];
  scenes: { image: string; label: string; sub: string }[];
  features: { num: string; label: string; desc: string }[];
  mobileShortKey: string;
  colors: { key: string; label: string; colorCode?: string; image: string }[];
  explore: { key: string; name: string; desc: string; price: string; image: string }[];
}

// Fallback product if API fails
const fallbackProduct: ProductDetail = {
  slug: 'meteorite-ring-sofa',
  name: 'Ring Sofa',
  animal: 'Meteorite',
  tagline: '环形围坐 · 对话氛围',
  priceRange: { americas: [3500, 5000], europe: [3200, 4600], middle_east: [12800, 18300], se_asia: [112000, 160000] },
  images: ['/products/meteorite-ring-sofa/hero-1.webp', '/products/meteorite-ring-sofa/hero-2.webp'],
  materialOptions: [{ type: 'fabric', options: ['Cloud Touch', 'Wild Touch', 'Velvet'], colors: ['Snowy White', 'Space Gray'] }],
  description: '其环形设计自然营造出 360° 的对话氛围，是开放空间、创意工作室与精品酒店的理想中心。',
  storyTitle: 'Ring Sofa',
  storyText: [
    '环形设计源于对<span class="highlight">自然对话</span>的观察。没有起点，没有终点——就像一场永不停歇的交流。',
    '每一道弧线都经过手工塑形，在三维空间中寻找平衡。这不仅是家具，更是一座可栖息的雕塑。',
  ],
  specs: [
    { label: '宽度', cm: '110', inch: '43.3' },
    { label: '深度', cm: '80', inch: '31.5' },
    { label: '高度', cm: '80', inch: '31.5' },
    { label: '座高', cm: '42', inch: '16.5' },
  ],
  crafts: [
    { name: '镀锌钢框架', detail: '精密焊接' },
    { name: '高密度海绵', detail: '定制模具成型' },
    { name: '云触感面料', detail: '现代质感' },
    { name: '一体式金属底座', detail: '哑光饰面' },
  ],
  scenes: [
    { image: '/products/meteorite-ring-sofa/hero-1.webp', label: '星际 lounge', sub: '星空下的起居室' },
    { image: '/products/gorilla-sofa/gray.jpg', label: '沙丘静修', sub: '静谧 · 沉思 · 温暖' },
    { image: '/products/owl/snowy-white.png', label: '银河沙龙', sub: '长谈之地' },
  ],
  features: [
    { num: '01', label: '360° 对话', desc: '环形围坐，促进交流' },
    { num: '02', label: '承重 150kg', desc: '航空级坚固骨架' },
    { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
  ],
  mobileShortKey: 'meteorite',
  colors: [
    { key: 'white', label: '雪山白', image: '/products/meteorite-ring-sofa/hero-1.webp' },
    { key: 'gray', label: '太空灰', image: '/products/meteorite-ring-sofa/hero-2.webp' },
  ],
  explore: [],
};

// Slug to mobileShortKey mapping
const slugToKey: Record<string, string> = {
  'gorilla-sofa': 'gorilla',
  'owl': 'owl',
  'meteorite-ring-sofa': 'meteorite',
  'orbit-sofa': 'orbit',
};

// Also support direct key access
const keyToSlug: Record<string, string> = {
  gorilla: 'gorilla-sofa',
  owl: 'owl',
  meteorite: 'meteorite-ring-sofa',
  orbit: 'orbit-sofa',
};

function formatPrice(priceRange: { americas: [number, number] }): string {
  return `$${priceRange.americas[0].toLocaleString()}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const rawSlug = String(params.slug);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [allProducts, setAllProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('white');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [faved, setFaved] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [configColor, setConfigColor] = useState('white');
  const [configFabric, setConfigFabric] = useState('cloud');
  const [showShare, setShowShare] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [arSize, setArSize] = useState(80);
  const [arOpacity, setArOpacity] = useState(90);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch(`/api/products/${rawSlug}`).then((r) => r.json()),
    ])
      .then(([listRes, detailRes]) => {
        if (listRes.products) setAllProducts(listRes.products);
        if (detailRes.product) {
          const p = detailRes.product;

          // Map colors from ALL materialOptions (not just first)
          const colors = (p.materialOptions || []).flatMap(
            (mo: { type: string; options: string[]; colors: string[] }, moIdx: number) =>
              (mo.options || []).map((opt: string, i: number) => {
                const colorCode = mo.colors?.[i] || '';
                const key = colorCode.toLowerCase().includes('white') || opt.toLowerCase().includes('white') || opt.toLowerCase().includes('snowy')
                  ? 'white'
                  : colorCode.toLowerCase().includes('gray') || opt.toLowerCase().includes('gray')
                    ? 'gray'
                    : colorCode.toLowerCase().includes('pink') || opt.toLowerCase().includes('pink') || opt.toLowerCase().includes('rose')
                      ? 'pink'
                      : colorCode.toLowerCase().includes('brown') || opt.toLowerCase().includes('brown') || opt.toLowerCase().includes('chestnut') || opt.toLowerCase().includes('cognac')
                        ? 'brown'
                        : colorCode.toLowerCase().includes('black') || opt.toLowerCase().includes('black') || opt.toLowerCase().includes('obsidian') || opt.toLowerCase().includes('agate')
                          ? 'black'
                          : colorCode.toLowerCase().includes('green') || opt.toLowerCase().includes('green') || opt.toLowerCase().includes('forest')
                            ? 'green'
                            : colorCode.toLowerCase().includes('burgundy') || opt.toLowerCase().includes('burgundy') || opt.toLowerCase().includes('red')
                              ? 'red'
                              : `color-${moIdx}-${i}`;
                const imageIndex = moIdx * (mo.options?.length || 1) + i;
                return {
                  key,
                  label: opt,
                  colorCode,
                  image: p.images?.[imageIndex] || p.images?.[0] || '/products/placeholder.jpg',
                };
              })
          );
          // Deduplicate by key, keep first
          const seenKeys = new Set<string>();
          const dedupedColors = colors.filter((c: { key: string }) => {
            if (seenKeys.has(c.key)) return false;
            seenKeys.add(c.key);
            return true;
          });

          // Use mobileFeatures from JSON, fallback to generated
          const features = p.mobileFeatures || [
            { num: '01', label: p.animal || '独特设计', desc: p.tagline || '' },
            { num: '02', label: `承重 ${p.specifications?.capacity?.match(/\d+/)?.[0] || '150'}kg`, desc: '航空级坚固骨架' },
            { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
          ];

          // Use mobileStory from JSON
          const storyTitle = p.mobileStory?.title || p.name;
          const storyText = p.mobileStory?.text || [p.concept || p.description || ''];

          // Use mobileCrafts from JSON
          const crafts = p.mobileCrafts || [
            { name: '镀锌钢框架', detail: '精密焊接' },
            { name: '高密度海绵', detail: '定制模具成型' },
            { name: '云触感面料', detail: '现代质感' },
            { name: '一体式金属底座', detail: '哑光饰面' },
          ];

          // Use mobileScenes from JSON, fallback to generated from images
          const scenes = p.mobileScenes || (p.images || []).slice(0, 3).map((img: string, i: number) => ({
            image: img,
            label: ['实景空间', '灵感角落', '氛围搭配'][i] || '实景灵感',
            sub: ['真实生活场景', '设计灵感来源', '完美搭配方案'][i] || '',
          }));

          // Map specs from specifications
          const specs = [
            { label: '宽度', cm: p.specifications?.width || '', inch: p.specifications?.width ? String(Math.round(Number(p.specifications.width) / 2.54 * 10) / 10) : '' },
            { label: '深度', cm: p.specifications?.depth || '', inch: p.specifications?.depth ? String(Math.round(Number(p.specifications.depth) / 2.54 * 10) / 10) : '' },
            { label: '高度', cm: p.specifications?.height || '', inch: p.specifications?.height ? String(Math.round(Number(p.specifications.height) / 2.54 * 10) / 10) : '' },
            { label: '座高', cm: p.specifications?.seatHeight || '', inch: p.specifications?.seatHeight ? String(Math.round(Number(p.specifications.seatHeight) / 2.54 * 10) / 10) : '' },
          ].filter(s => s.cm);

          // Map explore from other products
          const explore = (listRes.products || [])
            .filter((ep: ProductDetail) => ep.slug !== p.slug)
            .slice(0, 3)
            .map((ep: ProductDetail) => ({
              key: ep.mobileShortKey || slugToKey[ep.slug] || ep.slug,
              name: ep.name,
              desc: ep.tagline || '',
              price: formatPrice(ep.priceRange),
              image: ep.images?.[0] || '/products/placeholder.jpg',
            }));

          setProduct({
            ...p,
            colors: dedupedColors,
            features,
            storyTitle,
            storyText,
            crafts,
            scenes,
            specs,
            explore,
            mobileShortKey: p.mobileShortKey || slugToKey[p.slug] || p.slug,
          });
        } else {
          setProduct(fallbackProduct);
        }
      })
      .catch(() => {
        setProduct(fallbackProduct);
      })
      .finally(() => setLoading(false));
  }, [rawSlug]);

  const colorMap: Record<string, string> = { white: '雪山白', gray: '太空灰' };
  const fabricMap: Record<string, string> = { cloud: 'Cloud Touch', wild: 'Wild Touch', velvet: 'Velvet' };

  if (loading || !product) {
    return (
      <div className="page active" id="pageDetail">
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center', color: '#8A8580' }}>
          Loading...
        </div>
      </div>
    );
  }

  const currentImage =
    selectedColor === 'white'
      ? product.images[currentImageIndex] || product.images[0]
      : product.colors.find((c) => c.key === selectedColor)?.image || product.images[0];

  return (
    <div className="page active" id="pageDetail">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 8px', marginBottom: 4 }}>
          <Link href="/m">‹</Link>
          <span style={{ flex: 1 }} />
        </div>

        {/* Hero Image */}
        <div className="hero-image" id="detailHeroImage">
          <img src={currentImage} alt={product.name} id="detailMainImage" />
          <div className="float-ai">
            <button id="detailTryARBtn" onClick={() => setShowAI(true)}>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </button>
          </div>

          {/* Share */}
          <div className="share-dropdown" id="detailShareDropdown">
            <button className="share-toggle" id="detailShareToggle" onClick={() => setShowShare(!showShare)} aria-label="Share">
              <svg viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            {showShare && (
              <div className="share-menu open" id="detailShareMenu">
                <button className="menu-item" data-action="copy" onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowShare(false); }}>
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  <span>复制链接</span>
                </button>
                <div className="menu-divider" />
                <button className="menu-item" data-action="instagram" onClick={() => setShowShare(false)}>
                  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  <span>Instagram</span>
                </button>
                <button className="menu-item" data-action="pinterest" onClick={() => setShowShare(false)}>
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 3.85 2.14 7.2 5.27 8.94-.07-.75-.14-1.9.03-2.72.16-.74 1.04-4.4 1.04-4.4s-.26-.54-.26-1.33c0-1.25.72-2.18 1.62-2.18.77 0 1.14.58 1.14 1.27 0 .77-.49 1.93-.74 3.01-.21.9.45 1.64 1.34 1.64 1.61 0 2.85-1.7 2.85-4.14 0-2.16-1.55-3.68-3.77-3.68-2.57 0-4.07 1.93-4.07 3.92 0 .78.3 1.61.67 2.06.08.08.1.16.07.24-.07.29-.22.9-.25.92-.04.15-.12.18-.24.11-1.8-.83-2.92-3.43-2.92-5.52C7.52 6.8 10.47 4 14.05 4c3.03 0 5.38 2.16 5.38 5.04 0 3.01-1.9 5.43-4.53 5.43-.89 0-1.72-.46-2-1.01 0 0-.44 1.67-.55 2.08-.2.76-.74 1.73-1.1 2.31.82.25 1.7.4 2.62.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                  <span>Pinterest</span>
                </button>
                <button className="menu-item" data-action="facebook" onClick={() => setShowShare(false)}>
                  <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  <span>Facebook</span>
                </button>
              </div>
            )}
          </div>
          {showShare && <div className="share-backdrop open" onClick={() => setShowShare(false)} />}

          {/* Favorite */}
          <div className="float-actions">
            <button id="detailFavBtn" className={faved ? 'faved' : ''} onClick={() => setFaved(!faved)}>
              <svg className="icon" viewBox="0 0 24 24" id="detailFavIcon" style={{ fill: faved ? '#E8B4B8' : 'none', stroke: faved ? '#E8B4B8' : 'rgba(255,255,255,0.5)' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* Image Indicator */}
          <div className="image-indicator" id="detailIndicator">
            {product.images.map((_: string, i: number) => (
              <span key={i} className={i === currentImageIndex ? 'active' : ''} onClick={() => setCurrentImageIndex(i)}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="color-selector">
          <span className="label">颜色</span>
          <div className="options">
            {product.colors.map((c: { key: string; label: string; colorCode?: string }) => (
              <button
                key={c.key}
                className={`color-btn${selectedColor === c.key ? ' active' : ''}`}
                data-color={c.key}
                onClick={() => { setSelectedColor(c.key); setCurrentImageIndex(0); }}
              >
                <span className="swatch-wrap">
                  <span
                    className="swatch"
                    style={{ backgroundColor: c.colorCode || '#888' }}
                  />
                  <span className="check" />
                </span>
                <span className="label-text">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="features">
          {product.features.map((f: { num: string; label: string; desc: string }) => (
            <div key={f.num} className="feature-row">
              <span className="num">{f.num}</span>
              <span className="label">{f.label}</span>
              <span className="desc">{f.desc}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="description">
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        {/* Story */}
        <div className="story">
          <div className="section-label">设计故事</div>
          <div className="story-grid">
            <div className="story-image">
              <img src={product.images?.[1] || product.images?.[0] || '/products/placeholder.jpg'} alt="Design sketch" loading="lazy" />
              <span className="sketch-tag">✧ 手稿 · 概念设计</span>
            </div>
            <div className="story-text">
              <div className="title">
                {product.storyTitle || product.name} <span className="light">✦</span>
              </div>
              {(product.storyText || []).map((t: string, i: number) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: t }} />
              ))}
              <p className="spec-note">* 手工制作 · 尺寸可能存在 ±1-3cm 差异 · 重量因面料批次略有浮动</p>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="specs-header">
          <span className="label">尺寸</span>
          <div className="unit-toggle" id="detailUnitToggle">
            <button className={unit === 'cm' ? 'active' : ''} onClick={() => setUnit('cm')}>cm</button>
            <button className={unit === 'in' ? 'active' : ''} onClick={() => setUnit('in')}>in</button>
          </div>
        </div>
        <div className="specs" id="detailSpecsContainer">
          {product.specs.map((s: { label: string; cm: string; inch: string }) => (
            <div key={s.label} className="spec-item">
              <span className="l">{s.label}</span>
              <span className="v">{unit === 'cm' ? `${s.cm} cm` : `${s.inch} in`}</span>
            </div>
          ))}
        </div>

        {/* Craft */}
        <div className="craft">
          <div className="section-label">材质与工艺</div>
          <div className="craft-list">
            {product.crafts.map((c: { name: string; detail: string }) => (
              <div key={c.name} className="craft-item">
                <span className="line" />
                <span className="name">{c.name}</span>
                <span className="detail">{c.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scenes */}
        <div className="inspiration">
          <div className="section-label">实景灵感</div>
          <div className="scene-scroll">
            {product.scenes.map((s: { image: string; label: string; sub: string }, i: number) => (
              <div key={i} className="scene-card">
                <img src={s.image} alt="" loading="lazy" />
                <div className="label">{s.label}</div>
                <div className="sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore More */}
        <div className="explore-more">
          <div className="explore-header">
            <span className="explore-label">发现更多</span>
            <Link href="/m/collection" className="explore-view-all">查看全部 →</Link>
          </div>
          <div className="explore-scroll">
            {product.explore.map((e: { key: string; name: string; desc: string; price: string; image: string }) => (
              <Link key={e.key} href={`/m/product/${e.key}`} className="explore-card" data-product={e.key}>
                <div className="explore-card-image">
                  <img src={e.image} alt={e.name} loading="lazy" />
                </div>
                <div className="explore-card-info">
                  <div className="explore-card-name">{e.name}</div>
                  <div className="explore-card-desc">{e.desc}</div>
                  <div className="explore-card-price">{e.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <div className="row-top">
          <div className="product-id">
            <span className="brand">FUZZ SOFA</span>
            <span className="name" id="detailBottomName">
              {product.name} <span className="light">✦</span>
            </span>
          </div>
          <button className="btn-ai-clean" id="detailPreviewBtn" onClick={() => setShowAI(true)}>
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="ai-label">AI 预览</span>
          </button>
        </div>
        <div className="row-bottom">
          <span className="price">{formatPrice(product.priceRange)} <small>USD</small></span>
          <button className="btn-buy" id="detailBuyBtn" onClick={() => setShowConfig(true)}>购买</button>
        </div>
      </div>

      {/* Config Panel */}
      {showConfig && (
        <div className="panel-overlay open" id="configOverlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setShowConfig(false); }}>
          <div className="panel config-panel">
            <div className="handle" />
            <div className="panel-title">定制配置</div>
            <div className="panel-scroll">
              <div className="config-group">
                <span className="group-label">颜色</span>
                <div className="options">
                  {product.colors.map((c: { key: string; label: string }) => (
                    <button key={c.key} className={`opt-color${configColor === c.key ? ' active' : ''}`} onClick={() => setConfigColor(c.key)}>
                      <span className={`swatch swatch-${c.key}`} />{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="config-group">
                <span className="group-label">面料</span>
                <div className="options">
                  {['cloud', 'wild', 'velvet'].map((f: string) => (
                    <button key={f} className={`opt-btn${configFabric === f ? ' active' : ''}`} onClick={() => setConfigFabric(f)}>
                      {fabricMap[f]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="config-group">
                <span className="group-label">备注 (可选)</span>
                <textarea placeholder="例如：尺寸微调、特殊面料要求…" />
              </div>
            </div>
            <div className="panel-footer">
              <div className="total">{formatPrice(product.priceRange)} <small>USD</small></div>
              <button className="btn-confirm" id="confirmConfig" onClick={() => { setShowConfig(false); setShowConfirm(true); }}>确认配置</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Panel */}
      {showConfirm && (
        <div className="panel-overlay open" id="confirmOverlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setShowConfirm(false); }}>
          <div className="panel confirm-panel">
            <div className="handle" />
            <svg className="icon-check" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div className="title">已添加到购物车</div>
            <div className="sub">您可以在购物车中查看或调整数量</div>
            <div className="order-summary">
              <div className="row"><span>商品</span><span className="val">{product.name}</span></div>
              <div className="row"><span>颜色</span><span className="val">{colorMap[configColor]}</span></div>
              <div className="row"><span>面料</span><span className="val">{fabricMap[configFabric]}</span></div>
              <div className="divider" />
              <div className="row"><span>金额</span><span className="val">{formatPrice(product.priceRange)} USD</span></div>
            </div>
            <div className="info-grid">
              <div className="info-item"><span className="info-icon">⏱</span><span className="info-label">制作周期</span><span className="info-value">1-2 周</span></div>
              <div className="info-item"><span className="info-icon">🔧</span><span className="info-label">手工定制</span><span className="info-value">每件独立</span></div>
              <div className="info-item"><span className="info-icon">📦</span><span className="info-label">配送</span><span className="info-value">全球送达</span></div>
            </div>
            <div className="actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>继续浏览</button>
              <button className="btn-primary" onClick={() => setShowConfirm(false)}>查看购物车</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Preview Panel */}
      {showAI && (
        <div className="ai-overlay open" id="detailAiOverlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setShowAI(false); }}>
          <div className="ai-panel">
            <div className="handle" />
            <div className="panel-title">✨ AI 空间预览</div>
            <div className="panel-sub">上传一张您房间的照片，AI 将把产品放入其中</div>
            <div className="upload-area" id="detailUploadArea">
              <svg className="upload-icon" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <div className="upload-label">点击上传图片</div>
              <div className="upload-hint">支持 JPG / PNG，建议 16:9 比例</div>
            </div>
            <div className="privacy-note">🔒 上传的图片仅用于本次预览，不会存储或分享</div>
            <div className="product-placing">
              <strong>{product.name}</strong> 将自动放置在空间中 <span className="sub">可调整大小和位置</span>
            </div>
            <button className="btn-primary" style={{ marginTop: 14 }} onClick={() => setShowAI(false)}>关闭</button>
          </div>
        </div>
      )}

      {/* AR Overlay */}
      {showAR && (
        <div className="ar-overlay open" id="detailArOverlay">
          <div className="ar-header">
            <button className="ar-back" onClick={() => setShowAR(false)}>← 返回</button>
            <span style={{ fontSize: 13, color: '#8A8580', letterSpacing: '0.04em' }}>AR 预览</span>
            <button className="ar-done" onClick={() => setShowAR(false)}>完成 ✓</button>
          </div>
          <div className="ar-scene">
            <img src={product.images?.[0] || '/products/placeholder.jpg'} alt="Room" className="room-bg" id="detailRoomBg" />
            <div
              className="ar-product-overlay"
              id="detailArProduct"
              style={{
                transform: `translateX(-50%) scale(${0.4 + (arSize / 100) * 0.8})`,
                opacity: 0.3 + (arOpacity / 100) * 0.7,
              }}
            >
              <img src={product.images?.[0] || '/products/placeholder.jpg'} alt={product.name} />
            </div>
            <div className="ar-product-label">
              <strong>{product.name}</strong> · 拖拽调整位置
            </div>
            <div className="ar-hint">
              👆 双指缩放 · 单指旋转 <span className="hint-sub">点击产品可切换角度</span>
            </div>
            <div className="ar-controls">
              <div className="control-item">
                <span className="ctrl-label">大小</span>
                <span className="ctrl-value">{arSize}%</span>
                <input
                  type="range"
                  className="ctrl-slider"
                  min={40}
                  max={120}
                  value={arSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArSize(Number(e.target.value))}
                />
              </div>
              <div className="control-item">
                <span className="ctrl-label">透明度</span>
                <span className="ctrl-value">{arOpacity}%</span>
                <input
                  type="range"
                  className="ctrl-slider"
                  min={30}
                  max={100}
                  value={arOpacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArOpacity(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
