'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const products: Record<string, { name: string; price: string; image: string }> = {
  gorilla: { name: 'Gorilla Sofa', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
  owl: { name: 'Owl Chair', price: '$3,500', image: 'https://picsum.photos/seed/owl-chair/400/400' },
  meteorite: { name: 'Ring Sofa', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/800/800' },
  orbit: { name: 'Orbit Sofa', price: '$4,200', image: 'https://picsum.photos/seed/orbit-sofa/400/400' },
};

const heroSlides = [
  {
    image: 'https://picsum.photos/seed/hero1/800/1000',
    alt: 'Fuzz Sofa Studio',
    tag: 'Fuzz Sofa Studio',
    title: 'Sit on Art',
    sub: '雕塑感家具 · 手工定制 · 1–2周交付',
    btnText: '探索系列 →',
    href: '/m/collection',
  },
  {
    image: 'https://picsum.photos/seed/hero2/800/1000',
    alt: 'Craftsmanship',
    tag: 'Artisan Craft',
    title: 'Made by Hands',
    sub: '每一件都是独一无二的艺术品',
    btnText: '查看作品 →',
    href: '/m/collection',
  },
  {
    image: 'https://picsum.photos/seed/hero3/800/1000',
    alt: 'Interior',
    tag: 'Inspired Spaces',
    title: 'Live with Sculpture',
    sub: '为您的空间注入艺术灵魂',
    btnText: '查看作品 →',
    href: '/m/collection',
  },
];

const logs = [
  {
    id: 1,
    title: '工坊手记：一件雕塑沙发的诞生',
    date: '2026-06-28',
    summary: '从一块海绵到最终成型的沙发，我们记录下每一道工序背后的思考与手感。',
    image: 'https://picsum.photos/seed/log1/600/400',
  },
  {
    id: 2,
    title: '与自然对话：环形设计的灵感来源',
    date: '2026-06-20',
    summary: '环形的围坐形式并非偶然，它源于对自然中圆形聚落形态的观察。',
    image: 'https://picsum.photos/seed/log2/600/400',
  },
  {
    id: 3,
    title: '匠心工艺：从选材到成品',
    date: '2026-06-12',
    summary: '每一块海绵、每一根钢架都经过严格筛选，确保品质与耐久。',
    image: 'https://picsum.photos/seed/log3/600/400',
  },
];

export default function MobileHomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const nextHero = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextHero, 5000);
    return () => clearInterval(timer);
  }, [nextHero]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    setTouchStart({ x: t.screenX, y: t.screenY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    const dx = touchStart.x - t.screenX;
    const dy = touchStart.y - t.screenY;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
      } else {
        setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      }
    }
  };

  const firstLog = logs[0];

  return (
    <>
      {/* Hero Carousel */}
      <div
        className="hero-carousel"
        id="heroCarousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.map((slide, i) => (
          <div key={i} className={`slide${i === heroIndex ? ' active' : ''}`} data-index={i}>
            <img src={slide.image} alt={slide.alt} />
            <div className="hero-overlay">
              <div className="hero-tag">{slide.tag}</div>
              <h1>{slide.title}</h1>
              <p className="hero-sub">{slide.sub}</p>
              <Link href={slide.href} className="btn-explore">
                {slide.btnText}
              </Link>
            </div>
          </div>
        ))}
        <div className="hero-gradient" />
        <div className="hero-indicators">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={i === heroIndex ? 'active' : ''}
              onClick={() => setHeroIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Brand Philosophy */}
      <div className="brand-philosophy">
        <p>雕塑感家具 · 纯手工制作 · 每件均为订制</p>
      </div>

      {/* Media Quote */}
      <div className="media-quote">
        <span className="quote-icon">✦</span>
        <blockquote>
          &ldquo;Mundos interiores: Mira cómo el mobiliario escultórico transforma un
          espacio&rdquo;
          <cite>— Revista de Diseño, 2026</cite>
        </blockquote>
      </div>

      {/* Featured Works */}
      <section className="featured-works">
        <div className="section-header">
          <h2>精选作品</h2>
          <Link href="/m/collection" className="view-all">
            查看全部 →
          </Link>
        </div>
        <div className="product-grid" id="productGrid">
          {Object.entries(products).map(([key, p]) => (
            <Link key={key} href={`/m/product/${key}`} className="product-card" data-product={key}>
              <div className="image-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="info">
                <div className="name">{p.name}</div>
                <div className="price">{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Log Preview */}
      {firstLog && (
        <Link href={`/m/log/${firstLog.id}`} className="log-preview" id="homeLogPreview">
          <div className="log-preview-image" id="homeLogImg">
            <img src={firstLog.image} alt="日志封面" />
          </div>
          <div className="log-preview-content">
            <div className="log-tag">✧ 日志</div>
            <h3 id="homeLogTitle">{firstLog.title}</h3>
            <div className="summary" id="homeLogSummary">
              {firstLog.summary}
            </div>
            <span className="btn-text" id="homeLogBtn">
              探索我们 →
            </span>
          </div>
        </Link>
      )}
    </>
  );
}
