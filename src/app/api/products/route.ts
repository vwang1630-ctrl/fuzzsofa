import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products-server';
import type { Product } from '@/lib/products';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/products.json');

export async function GET() {
  try {
    const products = getProducts();
    // Return summary for list view (exclude large text fields)
    const summary = products.map((p: Product) => ({
      slug: p.slug,
      name: p.name,
      animal: p.animal,
      tagline: p.tagline,
      description: p.description,
      priceRange: p.priceRange,
      images: p.images,
      materialOptions: p.materialOptions,
      specifications: p.specifications,
      mobileShortKey: p.mobileShortKey,
      mobileFeatures: p.mobileFeatures,
      metaDescription: p.metaDescription,
      hiddenInRegions: p.hiddenInRegions,
    }));
    return NextResponse.json({ products: summary });
  } catch {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();

    // Validate required fields
    if (!product.slug || !product.name) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, name' },
        { status: 400 }
      );
    }

    const products = getProducts();

    // Check for duplicate slug
    const existing = products.findIndex((p: Product) => p.slug === product.slug);
    if (existing >= 0) {
      // Update existing product
      products[existing] = { ...products[existing], ...product };
    } else {
      // Add new product
      products.push(product);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      product: existing >= 0 ? products[existing] : products[products.length - 1],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}
