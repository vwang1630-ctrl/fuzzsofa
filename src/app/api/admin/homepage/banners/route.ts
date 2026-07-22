import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne, executeInsert } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/homepage/banners
 * 获取所有轮播图（按 sort_order 升序）
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM homepage_banners
       ORDER BY sort_order ASC, id ASC`
    );

    return NextResponse.json({ banners: rows.map(mapBanner) });
  } catch (err) {
    console.error('Admin homepage banners GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/homepage/banners
 * 添加轮播图
 * Body: { title, subtitle?, imageUrl, linkUrl?, buttonText?, sortOrder?, isActive? }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();

    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, imageUrl' },
        { status: 400 }
      );
    }

    // Default sort_order: append to the end
    let sortOrder = body.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const maxRow = await queryOne<RowDataPacket>(
        `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM homepage_banners`
      );
      sortOrder = maxRow?.next_order ?? 1;
    }

    const { insertId } = await executeInsert(
      `INSERT INTO homepage_banners
        (title, subtitle, image_url, link_url, button_text, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.subtitle ?? null,
        body.imageUrl,
        body.linkUrl ?? null,
        body.buttonText ?? null,
        sortOrder,
        body.isActive === undefined ? 1 : body.isActive ? 1 : 0,
      ]
    );

    const created = await queryOne<RowDataPacket>(
      `SELECT * FROM homepage_banners WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json(
      { success: true, banner: created ? mapBanner(created) : null },
      { status: 201 }
    );
  } catch (err) {
    console.error('Admin homepage banners POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapBanner(row: RowDataPacket) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    buttonText: row.button_text,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
