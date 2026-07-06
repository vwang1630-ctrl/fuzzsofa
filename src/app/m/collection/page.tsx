'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductSummary {
  slug: string;
  name: string;
  tagline: string;
  priceRange: {
    americas: [number, number];
  };
  images: string[];
  mobileShortKey: string;
}

function formatPrice(priceRange: { americas: [number, number] }): string {
  return `$${priceRange.americas[0].toLocaleString()}`;
}

export default function CollectionPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page page-collection active">
      <div className="page-title">Collection</div>
      <div className="page-sub">Explore our full range of studio-crafted furniture</div>
      <div className="collection-grid" id="collectionGrid">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/m/product/${p.mobileShortKey || p.slug}`}
            className="product-card"
            data-product={p.mobileShortKey || p.slug}
          >
            <div className="image-wrap">
              <img src={p.images?.[0] || '/products/placeholder.jpg'} alt={p.name} loading="lazy" />
            </div>
            <div className="info">
              <div className="name">{p.name}</div>
              <div className="price">{formatPrice(p.priceRange)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
