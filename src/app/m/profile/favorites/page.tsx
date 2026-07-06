'use client';

import Link from 'next/link';

const favorites = [
  { key: 'gorilla', name: 'Gorilla Sofa', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
  { key: 'ringsofa', name: 'Ring Sofa', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/400/400' },
];

export default function FavoritesPage() {
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
            <Link key={f.key} href={`/m/product/${f.key}`} className="product-card">
              <div className="image-wrap">
                <img src={f.image} alt={f.name} loading="lazy" />
              </div>
              <div className="info">
                <div className="name">{f.name}</div>
                <div className="price">{f.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
