import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne, executeInsert } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const offset = (page - 1) * pageSize;

    // Build WHERE clauses
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push(`(name LIKE ? OR slug LIKE ? OR description LIKE ?)`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countRow = await queryOne<RowDataPacket>(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countRow?.total ?? 0;

    // Get paginated products
    const products = await query<RowDataPacket[]>(
      `SELECT id, slug, name, animal, tagline, description, status, stock_status,
              price_range, images, material_options, specifications,
              mobile_short_key, meta_description, hidden_in_regions,
              trending_geo, created_at, updated_at
       FROM products
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        animal: p.animal,
        tagline: p.tagline,
        description: p.description,
        status: p.status,
        stockStatus: p.stock_status,
        priceRange: safeJsonParse(p.price_range, {}),
        images: safeJsonParse(p.images, []),
        materialOptions: safeJsonParse(p.material_options, []),
        specifications: safeJsonParse(p.specifications, {}),
        mobileShortKey: p.mobile_short_key,
        metaDescription: p.meta_description,
        hiddenInRegions: safeJsonParse(p.hidden_in_regions, []),
        trendingGeo: safeJsonParse(p.trending_geo, []),
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })),
      pagination: {
        page,
        pageSize,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    });
  } catch (err) {
    console.error('Admin products API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();

    // Validate required fields
    if (!body.slug || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, name' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await queryOne<RowDataPacket>(
      `SELECT id FROM products WHERE slug = ?`,
      [body.slug]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await executeInsert(
      `INSERT INTO products (
        id, slug, name, animal, tagline, description, concept, interior_context,
        price_range, specifications, materials, material_options, images,
        faq, related_products, related_interiors, meta_description,
        hidden_in_regions, trending_geo, mobile_short_key,
        mobile_features, mobile_story, mobile_crafts, mobile_scenes,
        status, stock_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.slug,
        body.name,
        body.animal || null,
        body.tagline || null,
        body.description || null,
        body.concept || null,
        body.interiorContext || null,
        JSON.stringify(body.priceRange || {}),
        JSON.stringify(body.specifications || {}),
        JSON.stringify(body.materials || []),
        JSON.stringify(body.materialOptions || []),
        JSON.stringify(body.images || []),
        JSON.stringify(body.faq || []),
        JSON.stringify(body.relatedProducts || []),
        JSON.stringify(body.relatedInteriors || []),
        body.metaDescription || null,
        JSON.stringify(body.hiddenInRegions || []),
        JSON.stringify(body.trendingGeo || []),
        body.mobileShortKey || null,
        JSON.stringify(body.mobileFeatures || []),
        JSON.stringify(body.mobileStory || null),
        JSON.stringify(body.mobileCrafts || []),
        JSON.stringify(body.mobileScenes || []),
        body.status || 'active',
        body.stockStatus || 'in_stock',
        now,
        now,
      ]
    );

    // Fetch the created product
    const created = await queryOne<RowDataPacket>(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      product: created,
    }, { status: 201 });
  } catch (err) {
    console.error('Admin product create API error:', err);
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
