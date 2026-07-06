'use client';

import Link from 'next/link';

const products: Record<string, { name: string; price: string; image: string }> = {
  gorilla: { name: 'Gorilla Sofa', price: '$7,800', image: 'https://picsum.photos/seed/gorilla-sofa/400/400' },
  owl: { name: 'Owl Chair', price: '$3,500', image: 'https://picsum.photos/seed/owl-chair/400/400' },
  meteorite: { name: 'Ring Sofa', price: '$3,500', image: 'https://picsum.photos/seed/ringsofa/800/800' },
  orbit: { name: 'Orbit Sofa', price: '$4,200', image: 'https://picsum.photos/seed/orbit-sofa/400/400' },
};

export default function CollectionPage() {
  return (
    <div className="page page-collection active">
      <div className="page-title">Collection</div>
      <div className="page-sub">Explore our full range of studio-crafted furniture</div>
      <div className="collection-grid" id="collectionGrid">
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
    </div>
  );
}
