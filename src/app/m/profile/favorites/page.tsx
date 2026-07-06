'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FavItem {
  slug: string;
  name: string;
  priceRange: { americas: [number, number] };
  images: string[];
  mobileShortKey: string;
}

function formatPrice(priceRange: { americas: [number, number] }): string {
  return `$${priceRange.americas[0].toLocaleString()}`;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavItem[]>([]);

  useEffect(() => {
    // For now, fetch all products as "favorites" placeholder
    // In Phase 3, this will be replaced with user-specific favorites from Supabase
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          // Show first 2 products as sample favorites
          setFavorites(data.products.slice(0, 2));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page page-favorites active" id="pageFavorites">
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">‹</Link>
        <span className="title">我的收藏</span>
      </div>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          <div className="empty-text">暂无收藏</div>
        </div>
      ) : (
        <div className="fav-grid" id="favGrid">
          {favorites.map((f) => (
            <Link key={f.slug} href={`/m/product/${f.mobileShortKey || f.slug}`} className="product-card">
              <div className="image-wrap">
                <img src={f.images?.[0] || '/products/placeholder.jpg'} alt={f.name} loading="lazy" />
              </div>
              <div className="info">
                <div className="name">{f.name}</div>
                <div className="price">{formatPrice(f.priceRange)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
