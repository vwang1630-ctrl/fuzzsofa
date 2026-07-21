import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { slug } = await params;

    const product = await queryOne<RowDataPacket>(
      `SELECT * FROM products WHERE slug = ?`,
      [slug]
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        animal: product.animal,
        tagline: product.tagline,
        description: product.description,
        concept: product.concept,
        interiorContext: product.interior_context,
        priceRange: safeJsonParse(product.price_range, {}),
        specifications: safeJsonParse(product.specifications, {}),
        materials: safeJsonParse(product.materials, []),
        materialOptions: safeJsonParse(product.material_options, []),
        images: safeJsonParse(product.images, []),
        faq: safeJsonParse(product.faq, []),
        relatedProducts: safeJsonParse(product.related_products, []),
        relatedInteriors: safeJsonParse(product.related_interiors, []),
        metaDescription: product.meta_description,
        hiddenInRegions: safeJsonParse(product.hidden_in_regions, []),
        trendingGeo: safeJsonParse(product.trending_geo, []),
        mobileShortKey: product.mobile_short_key,
        mobileFeatures: safeJsonParse(product.mobile_features, []),
        mobileStory: safeJsonParse(product.mobile_story, null),
        mobileCrafts: safeJsonParse(product.mobile_crafts, []),
        mobileScenes: safeJsonParse(product.mobile_scenes, []),
        status: product.status,
        stockStatus: product.stock_status,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
    });
  } catch (err) {
    console.error('Admin product detail API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { slug } = await params;

    // Check if product exists
    const existing = await queryOne<RowDataPacket>(
      `SELECT id FROM products WHERE slug = ?`,
      [slug]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();

    // Build dynamic update
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    // Simple string fields
    const stringFields: Record<string, string> = {
      name: 'name',
      animal: 'animal',
      tagline: 'tagline',
      description: 'description',
      concept: 'concept',
      interiorContext: 'interior_context',
      metaDescription: 'meta_description',
      mobileShortKey: 'mobile_short_key',
      status: 'status',
      stockStatus: 'stock_status',
    };

    for (const [bodyKey, dbCol] of Object.entries(stringFields)) {
      if (body[bodyKey] !== undefined) {
        updateFields.push(`${dbCol} = ?`);
        updateParams.push(body[bodyKey]);
      }
    }

    // JSON fields
    const jsonFields: Record<string, string> = {
      priceRange: 'price_range',
      specifications: 'specifications',
      materials: 'materials',
      materialOptions: 'material_options',
      images: 'images',
      faq: 'faq',
      relatedProducts: 'related_products',
      relatedInteriors: 'related_interiors',
      hiddenInRegions: 'hidden_in_regions',
      trendingGeo: 'trending_geo',
      mobileFeatures: 'mobile_features',
      mobileStory: 'mobile_story',
      mobileCrafts: 'mobile_crafts',
      mobileScenes: 'mobile_scenes',
    };

    for (const [bodyKey, dbCol] of Object.entries(jsonFields)) {
      if (body[bodyKey] !== undefined) {
        updateFields.push(`${dbCol} = ?`);
        updateParams.push(JSON.stringify(body[bodyKey]));
      }
    }

    // Allow slug update
    if (body.slug && body.slug !== slug) {
      // Check new slug doesn't conflict
      const conflict = await queryOne<RowDataPacket>(
        `SELECT id FROM products WHERE slug = ? AND slug != ?`,
        [body.slug, slug]
      );
      if (conflict) {
        return NextResponse.json(
          { error: 'Another product with this slug already exists' },
          { status: 409 }
        );
      }
      updateFields.push('slug = ?');
      updateParams.push(body.slug);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push('updated_at = NOW()');
    updateParams.push(slug);

    await execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE slug = ?`,
      updateParams
    );

    // Fetch updated product
    const updatedSlug = body.slug && body.slug !== slug ? body.slug : slug;
    const updated = await queryOne<RowDataPacket>(
      `SELECT * FROM products WHERE slug = ?`,
      [updatedSlug]
    );

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error('Admin product update API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { slug } = await params;

    // Check if product exists
    const existing = await queryOne<RowDataPacket>(
      `SELECT id FROM products WHERE slug = ?`,
      [slug]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await execute(`DELETE FROM products WHERE slug = ?`, [slug]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin product delete API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeJsonParse(value: unknown, defaultValue: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
  return value ?? defaultValue;
}
