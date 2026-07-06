import { NextResponse } from 'next/server';
import { getProducts, getProductByShortKey } from '@/lib/products-server';
import type { Product } from '@/lib/products';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const products = getProducts();
    const product = products.find((p: Product) => p.slug === slug);

    if (!product) {
      // Also try mobileShortKey match
      const byShortKey = getProductByShortKey(slug);
      if (byShortKey) {
        // Include related products data
        const relatedSlugs = byShortKey.relatedProducts || [];
        const relatedProducts = products.filter((p: Product) =>
          relatedSlugs.includes(p.slug)
        ).map((p: Product) => ({
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          priceRange: p.priceRange,
          images: p.images,
          mobileShortKey: p.mobileShortKey,
        }));

        return NextResponse.json({ product: byShortKey, relatedProducts });
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Include related products data
    const relatedSlugs = product.relatedProducts || [];
    const relatedProducts = products.filter((p: Product) =>
      relatedSlugs.includes(p.slug)
    ).map((p: Product) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      priceRange: p.priceRange,
      images: p.images,
      mobileShortKey: p.mobileShortKey,
    }));

    return NextResponse.json({ product, relatedProducts });
  } catch {
    return NextResponse.json({ error: 'Failed to read product' }, { status: 500 });
  }
}
