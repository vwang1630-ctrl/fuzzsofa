import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, execute, executeInsert } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/homepage/featured
 * 获取主推商品列表（按 display_order 升序，关联 products 表补充商品信息）
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT fp.*, p.name AS product_name, p.images AS product_images, p.status AS product_status
       FROM homepage_featured_products fp
       LEFT JOIN products p ON p.slug = fp.product_slug
       ORDER BY fp.display_order ASC, fp.id ASC`
    );

    return NextResponse.json({ items: rows.map(mapFeaturedItem) });
  } catch (err) {
    console.error('Admin homepage featured GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/homepage/featured
 * 批量更新主推商品（全量同步，含排序）
 * Body: { items: [{ id?, productSlug, displayOrder?, tag?, customTitle?, customSubtitle?, isActive? }] }
 * - 带 id 且已存在的记录执行更新
 * - 不带 id 的记录执行插入
 * - 数据库中已存在但未提交的记录会被删除
 * - displayOrder 缺省时按数组顺序自动编号（从 1 开始）
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request: items array is required' },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item || !item.productSlug) {
        return NextResponse.json(
          { error: 'Each item requires productSlug' },
          { status: 400 }
        );
      }
    }

    const existingRows = await query<RowDataPacket[]>(
      `SELECT id FROM homepage_featured_products`
    );
    const existingIds = new Set(existingRows.map((r) => Number(r.id)));
    const submittedIds = new Set<number>();

    for (const [index, item] of items.entries()) {
      const displayOrder = item.displayOrder ?? index + 1;
      const isActive = item.isActive === undefined ? 1 : item.isActive ? 1 : 0;

      if (item.id && existingIds.has(Number(item.id))) {
        submittedIds.add(Number(item.id));
        await execute(
          `UPDATE homepage_featured_products
           SET product_slug = ?, display_order = ?, tag = ?, custom_title = ?, custom_subtitle = ?, is_active = ?
           WHERE id = ?`,
          [
            item.productSlug,
            displayOrder,
            item.tag ?? null,
            item.customTitle ?? null,
            item.customSubtitle ?? null,
            isActive,
            item.id,
          ]
        );
      } else {
        const { insertId } = await executeInsert(
          `INSERT INTO homepage_featured_products
            (product_slug, display_order, tag, custom_title, custom_subtitle, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            item.productSlug,
            displayOrder,
            item.tag ?? null,
            item.customTitle ?? null,
            item.customSubtitle ?? null,
            isActive,
          ]
        );
        submittedIds.add(insertId);
      }
    }

    // Delete records that were not submitted
    const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
    if (toDelete.length > 0) {
      await execute(
        `DELETE FROM homepage_featured_products WHERE id IN (${toDelete.map(() => '?').join(',')})`,
        toDelete
      );
    }

    // Fetch updated list
    const rows = await query<RowDataPacket[]>(
      `SELECT fp.*, p.name AS product_name, p.images AS product_images, p.status AS product_status
       FROM homepage_featured_products fp
       LEFT JOIN products p ON p.slug = fp.product_slug
       ORDER BY fp.display_order ASC, fp.id ASC`
    );

    return NextResponse.json({ success: true, items: rows.map(mapFeaturedItem) });
  } catch (err) {
    console.error('Admin homepage featured PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapFeaturedItem(row: RowDataPacket) {
  const images = safeJsonParse(row.product_images, null) as {
    hero?: string;
    gallery?: string[];
  } | null;

  return {
    id: row.id,
    productSlug: row.product_slug,
    displayOrder: row.display_order,
    tag: row.tag,
    customTitle: row.custom_title,
    customSubtitle: row.custom_subtitle,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    productName: row.product_name ?? null,
    productImage: images?.hero ?? images?.gallery?.[0] ?? null,
    productStatus: row.product_status ?? null,
  };
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
