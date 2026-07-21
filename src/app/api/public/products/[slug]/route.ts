import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
  id: string;
  slug: string;
  name: string;
  animal: string;
  tagline: string | null;
  description: string | null;
  price_range: string | null;
  images: string | null;
  material_options: string | null;
  specifications: string | null;
  mobile_short_key: string | null;
  mobile_features: string | null;
  meta_description: string | null;
  hidden_in_regions: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await queryOne<ProductRow>(
      `SELECT id, slug, name, animal, tagline, description, price_range, images,
              material_options, specifications, mobile_short_key, mobile_features,
              meta_description, hidden_in_regions, created_at, updated_at
       FROM products
       WHERE slug = ?`,
      [slug]
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const parsedProduct = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      animal: product.animal,
      tagline: product.tagline,
      description: product.description,
      price_range: product.price_range,
      images: safeJsonParse(product.images, []),
      material_options: safeJsonParse(product.material_options, []),
      specifications: safeJsonParse(product.specifications, []),
      mobile_short_key: product.mobile_short_key,
      mobile_features: safeJsonParse(product.mobile_features, []),
      meta_description: product.meta_description,
      hidden_in_regions: safeJsonParse(product.hidden_in_regions, []),
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error('GET /api/public/products/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
