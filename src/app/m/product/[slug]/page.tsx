'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const productsData: Record<string, {
  name: string;
  price: string;
  priceNum: number;
  image: string;
  images: string[];
  colors: { key: string; label: string; image: string }[];
  features: { num: string; label: string; desc: string }[];
  description: string;
  story: { title: string; text: string[] };
  specs: { label: string; cm: string; inch: string }[];
  crafts: { name: string; detail: string }[];
  scenes: { image: string; label: string; sub: string }[];
  explore: { key: string; name: string; desc: string; price: string; image: string }[];
}> = {
  gorilla: {
    name: 'Gorilla Sofa',
    price: '$7,800',
    priceNum: 7800,
    image: 'https://picsum.photos/seed/gorilla-sofa/800/800',
    images: [
      'https://picsum.photos/seed/gorilla-sofa/800/800',
      'https://picsum.photos/seed/gorilla-sofa2/800/800',
      'https://picsum.photos/seed/gorilla-sofa3/800/800',
    ],
    colors: [
      { key: 'white', label: '雪山白', image: 'https://picsum.photos/seed/gorilla-white/800/800' },
      { key: 'gray', label: '太空灰', image: 'https://picsum.photos/seed/gorilla-gray/800/800' },
    ],
    features: [
      { num: '01', label: '野性存在', desc: '粗犷力量，野性优雅' },
      { num: '02', label: '承重 200kg', desc: '航空级坚固骨架' },
      { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
    ],
    description:
      '其雕塑形态灵感源自大猩猩的力量与优雅，是开放空间与个性居所的视觉焦点。',
    story: {
      title: 'Gorilla Sofa',
      text: [
        '大猩猩沙发源于对<span class="highlight">自然力量</span>的观察。粗犷而不失优雅，它就像一件栖息在客厅中的雕塑。',
        '每一道线条都经过手工塑形，在三维空间中寻找力量与舒适的平衡。这不仅是家具，更是一座可栖息的雕塑。',
      ],
    },
    specs: [
      { label: '宽度', cm: '160', inch: '63.0' },
      { label: '深度', cm: '110', inch: '43.3' },
      { label: '高度', cm: '90', inch: '35.4' },
      { label: '座高', cm: '42', inch: '16.5' },
    ],
    crafts: [
      { name: '镀锌钢框架', detail: '精密焊接' },
      { name: '高密度海绵', detail: '定制模具成型' },
      { name: '云触感面料', detail: '现代质感' },
      { name: '一体式金属底座', detail: '哑光饰面' },
    ],
    scenes: [
      { image: 'https://picsum.photos/seed/scene1/400/300', label: '星际 lounge', sub: '星空下的起居室' },
      { image: 'https://picsum.photos/seed/scene2/400/300', label: '沙丘静修', sub: '静谧 · 沉思 · 温暖' },
      { image: 'https://picsum.photos/seed/scene3/400/300', label: '银河沙龙', sub: '长谈之地' },
    ],
    explore: [
      { key: 'owl', name: 'Owl Chair', desc: '静默智慧 · 私密坐具', price: '$2,800', image: 'https://picsum.photos/seed/owl-chair/400/400' },
      { key: 'orbit', name: 'Orbit Sofa', desc: '悬浮姿态 · 未来轮廓', price: '$4,200', image: 'https://picsum.photos/seed/orbit-sofa/400/400' },
      { key: 'meteorite', name: 'Ring Sofa', desc: '环形围坐 · 对话氛围', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/400/400' },
    ],
  },
  owl: {
    name: 'Owl Chair',
    price: '$3,500',
    priceNum: 3500,
    image: 'https://picsum.photos/seed/owl-chair/800/800',
    images: [
      'https://picsum.photos/seed/owl-chair/800/800',
      'https://picsum.photos/seed/owl-chair2/800/800',
      'https://picsum.photos/seed/owl-chair3/800/800',
    ],
    colors: [
      { key: 'white', label: '雪山白', image: 'https://picsum.photos/seed/owl-white/800/800' },
      { key: 'gray', label: '太空灰', image: 'https://picsum.photos/seed/owl-gray/800/800' },
    ],
    features: [
      { num: '01', label: '静默智慧', desc: '私密坐具，独处时光' },
      { num: '02', label: '承重 150kg', desc: '航空级坚固骨架' },
      { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
    ],
    description:
      '其设计灵感源自猫头鹰的智慧与静谧，为独处时光提供完美栖息。',
    story: {
      title: 'Owl Chair',
      text: [
        '猫头鹰椅源于对<span class="highlight">静谧独处</span>的观察。宽大的靠背如同展开的翅膀，围合出一个私密的阅读角落。',
        '每一处弧度都经过精心推敲，在包裹感与开放感之间找到平衡。',
      ],
    },
    specs: [
      { label: '宽度', cm: '80', inch: '31.5' },
      { label: '深度', cm: '85', inch: '33.5' },
      { label: '高度', cm: '95', inch: '37.4' },
      { label: '座高', cm: '42', inch: '16.5' },
    ],
    crafts: [
      { name: '镀锌钢框架', detail: '精密焊接' },
      { name: '高密度海绵', detail: '定制模具成型' },
      { name: '云触感面料', detail: '现代质感' },
      { name: '一体式金属底座', detail: '哑光饰面' },
    ],
    scenes: [
      { image: 'https://picsum.photos/seed/scene1/400/300', label: '星际 lounge', sub: '星空下的起居室' },
      { image: 'https://picsum.photos/seed/scene2/400/300', label: '沙丘静修', sub: '静谧 · 沉思 · 温暖' },
      { image: 'https://picsum.photos/seed/scene3/400/300', label: '银河沙龙', sub: '长谈之地' },
    ],
    explore: [
      { key: 'gorilla', name: 'Gorilla Sofa', desc: '粗犷力量 · 野性优雅', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
      { key: 'orbit', name: 'Orbit Sofa', desc: '悬浮姿态 · 未来轮廓', price: '$4,200', image: 'https://picsum.photos/seed/orbit-sofa/400/400' },
      { key: 'meteorite', name: 'Ring Sofa', desc: '环形围坐 · 对话氛围', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/400/400' },
    ],
  },
  meteorite: {
    name: 'Ring Sofa',
    price: '$3,500',
    priceNum: 3500,
    image: 'https://picsum.photos/seed/ringsofa/800/800',
    images: [
      'https://picsum.photos/seed/ringsofa/800/800',
      'https://picsum.photos/seed/ringsofa2/800/800',
      'https://picsum.photos/seed/ringsofa3/800/800',
    ],
    colors: [
      { key: 'white', label: '雪山白', image: 'https://picsum.photos/seed/ringsofa-white/800/800' },
      { key: 'gray', label: '太空灰', image: 'https://picsum.photos/seed/ringsofa-gray/800/800' },
    ],
    features: [
      { num: '01', label: '360° 对话', desc: '环形围坐，促进交流' },
      { num: '02', label: '承重 150kg', desc: '航空级坚固骨架' },
      { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
    ],
    description:
      '其环形设计自然营造出 <span class="highlight">360°</span> 的对话氛围，是开放空间、创意工作室与精品酒店的理想中心。',
    story: {
      title: 'Ring Sofa',
      text: [
        '环形设计源于对<span class="highlight">自然对话</span>的观察。没有起点，没有终点——就像一场永不停歇的交流。',
        '每一道弧线都经过手工塑形，在三维空间中寻找平衡。这不仅是家具，更是一座可栖息的雕塑。',
      ],
    },
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
      { image: 'https://picsum.photos/seed/scene1/400/300', label: '星际 lounge', sub: '星空下的起居室' },
      { image: 'https://picsum.photos/seed/scene2/400/300', label: '沙丘静修', sub: '静谧 · 沉思 · 温暖' },
      { image: 'https://picsum.photos/seed/scene3/400/300', label: '银河沙龙', sub: '长谈之地' },
    ],
    explore: [
      { key: 'owl', name: 'Owl Chair', desc: '静默智慧 · 私密坐具', price: '$2,800', image: 'https://picsum.photos/seed/owl-chair/400/400' },
      { key: 'orbit', name: 'Orbit Sofa', desc: '悬浮姿态 · 未来轮廓', price: '$4,200', image: 'https://picsum.photos/seed/orbit-sofa/400/400' },
      { key: 'gorilla', name: 'Gorilla Sofa', desc: '粗犷力量 · 野性优雅', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
    ],
  },
  orbit: {
    name: 'Orbit Sofa',
    price: '$4,200',
    priceNum: 4200,
    image: 'https://picsum.photos/seed/orbit-sofa/800/800',
    images: [
      'https://picsum.photos/seed/orbit-sofa/800/800',
      'https://picsum.photos/seed/orbit-sofa2/800/800',
      'https://picsum.photos/seed/orbit-sofa3/800/800',
    ],
    colors: [
      { key: 'white', label: '雪山白', image: 'https://picsum.photos/seed/orbit-white/800/800' },
      { key: 'gray', label: '太空灰', image: 'https://picsum.photos/seed/orbit-gray/800/800' },
    ],
    features: [
      { num: '01', label: '悬浮姿态', desc: '未来轮廓，视觉焦点' },
      { num: '02', label: '承重 180kg', desc: '航空级坚固骨架' },
      { num: '03', label: '1–2 周定制', desc: '纯手工匠心制作' },
    ],
    description:
      '其悬浮式设计营造出轻盈的未来感，为空间注入独特的视觉张力。',
    story: {
      title: 'Orbit Sofa',
      text: [
        '轨道沙发源于对<span class="highlight">失重悬浮</span>的想象。它仿佛漂浮在空间中，打破了传统家具的厚重感。',
        '底座与座面之间的留白，不仅是视觉的巧思，更是对空间本质的思考。',
      ],
    },
    specs: [
      { label: '宽度', cm: '200', inch: '78.7' },
      { label: '深度', cm: '90', inch: '35.4' },
      { label: '高度', cm: '75', inch: '29.5' },
      { label: '座高', cm: '42', inch: '16.5' },
    ],
    crafts: [
      { name: '镀锌钢框架', detail: '精密焊接' },
      { name: '高密度海绵', detail: '定制模具成型' },
      { name: '云触感面料', detail: '现代质感' },
      { name: '一体式金属底座', detail: '哑光饰面' },
    ],
    scenes: [
      { image: 'https://picsum.photos/seed/scene1/400/300', label: '星际 lounge', sub: '星空下的起居室' },
      { image: 'https://picsum.photos/seed/scene2/400/300', label: '沙丘静修', sub: '静谧 · 沉思 · 温暖' },
      { image: 'https://picsum.photos/seed/scene3/400/300', label: '银河沙龙', sub: '长谈之地' },
    ],
    explore: [
      { key: 'owl', name: 'Owl Chair', desc: '静默智慧 · 私密坐具', price: '$2,800', image: 'https://picsum.photos/seed/owl-chair/400/400' },
      { key: 'gorilla', name: 'Gorilla Sofa', desc: '粗犷力量 · 野性优雅', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
      { key: 'meteorite', name: 'Ring Sofa', desc: '环形围坐 · 对话氛围', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/400/400' },
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const product = productsData[slug] || productsData.meteorite;

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

  const colorMap: Record<string, string> = { white: '雪山白', gray: '太空灰' };
  const fabricMap: Record<string, string> = { cloud: 'Cloud Touch', wild: 'Wild Touch', velvet: 'Velvet' };

  const currentImage =
    selectedColor === 'white' ? product.images[currentImageIndex] : product.colors.find((c) => c.key === selectedColor)?.image || product.images[0];

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
            {product.images.map((_, i) => (
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
            {product.colors.map((c) => (
              <button
                key={c.key}
                className={`color-btn${selectedColor === c.key ? ' active' : ''}`}
                data-color={c.key}
                onClick={() => { setSelectedColor(c.key); setCurrentImageIndex(0); }}
              >
                <span className="swatch-wrap">
                  <span className={`swatch swatch-${c.key}`} />
                  <span className="check" />
                </span>
                <span className="label-text">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="features">
          {product.features.map((f) => (
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
              <img src="https://picsum.photos/seed/sketch/800/600" alt="Design sketch" loading="lazy" />
              <span className="sketch-tag">✧ 手稿 · 概念设计</span>
            </div>
            <div className="story-text">
              <div className="title">
                {product.story.title} <span className="light">✦</span>
              </div>
              {product.story.text.map((t, i) => (
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
          {product.specs.map((s) => (
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
            {product.crafts.map((c) => (
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
            {product.scenes.map((s, i) => (
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
            {product.explore.map((e) => (
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
          <span className="price">{product.price} <small>USD</small></span>
          <button className="btn-buy" id="detailBuyBtn" onClick={() => setShowConfig(true)}>购买</button>
        </div>
      </div>

      {/* Config Panel */}
      {showConfig && (
        <div className="panel-overlay open" id="configOverlay" onClick={(e) => { if (e.target === e.currentTarget) setShowConfig(false); }}>
          <div className="panel config-panel">
            <div className="handle" />
            <div className="panel-title">定制配置</div>
            <div className="panel-scroll">
              <div className="config-group">
                <span className="group-label">颜色</span>
                <div className="options">
                  {product.colors.map((c) => (
                    <button key={c.key} className={`opt-color${configColor === c.key ? ' active' : ''}`} onClick={() => setConfigColor(c.key)}>
                      <span className={`swatch swatch-${c.key}`} />{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="config-group">
                <span className="group-label">面料</span>
                <div className="options">
                  {['cloud', 'wild', 'velvet'].map((f) => (
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
              <div className="total">{product.price} <small>USD</small></div>
              <button className="btn-confirm" id="confirmConfig" onClick={() => { setShowConfig(false); setShowConfirm(true); }}>确认配置</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Panel */}
      {showConfirm && (
        <div className="panel-overlay open" id="confirmOverlay" onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}>
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
              <div className="row"><span>金额</span><span className="val">{product.price} USD</span></div>
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
        <div className="ai-overlay open" id="detailAiOverlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAI(false); }}>
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
            <img src="https://picsum.photos/seed/room/800/1000" alt="Room" className="room-bg" id="detailRoomBg" />
            <div
              className="ar-product-overlay"
              id="detailArProduct"
              style={{
                transform: `translateX(-50%) scale(${0.4 + (arSize / 100) * 0.8})`,
                opacity: 0.3 + (arOpacity / 100) * 0.7,
              }}
            >
              <img src={product.image} alt={product.name} />
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
                  onChange={(e) => setArSize(Number(e.target.value))}
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
                  onChange={(e) => setArOpacity(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
