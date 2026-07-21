import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const animal = searchParams.get('animal');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));

    // Build WHERE clauses
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (animal) {
      conditions.push('animal = ?');
      params.push(animal);
    }

    if (search) {
      conditions.push('(name LIKE ? OR tagline LIKE ? OR description LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countResult = await query<RowDataPacket[]>(countSql, params);
    const total = (countResult[0] as { total: number }).total;

    // Get products with pagination
    const offset = (page - 1) * pageSize;
    const dataSql = `
      SELECT id, slug, name, animal, tagline, description, price_range, images,
             material_options, specifications, mobile_short_key, mobile_features,
             meta_description, hidden_in_regions, created_at, updated_at
      FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const products = await query<ProductRow[]>(dataSql, params);

    // Parse JSON fields
    const parsedProducts = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      animal: p.animal,
      tagline: p.tagline,
      description: p.description,
      price_range: p.price_range,
      images: safeJsonParse(p.images, []),
      material_options: safeJsonParse(p.material_options, []),
      specifications: safeJsonParse(p.specifications, []),
      mobile_short_key: p.mobile_short_key,
      mobile_features: safeJsonParse(p.mobile_features, []),
      meta_description: p.meta_description,
      hidden_in_regions: safeJsonParse(p.hidden_in_regions, []),
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    return NextResponse.json({
      products: parsedProducts,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    console.error('GET /api/public/products error:', errMsg, errStack);
    return NextResponse.json({ error: 'Failed to fetch products', detail: errMsg }, { status: 500 });
  }
}

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value as T; // Already parsed by mysql2
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}
