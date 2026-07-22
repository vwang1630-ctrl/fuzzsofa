import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne, executeInsert } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/homepage/cases
 * 获取设计案例列表（按 display_order 升序）
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM homepage_design_cases
       ORDER BY display_order ASC, id ASC`
    );

    return NextResponse.json({ cases: rows.map(mapCase) });
  } catch (err) {
    console.error('Admin homepage cases GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/homepage/cases
 * 添加设计案例
 * Body: { title, subtitle?, imageUrl, linkUrl?, displayOrder?, isActive? }
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

    // Default display_order: append to the end
    let displayOrder = body.displayOrder;
    if (displayOrder === undefined || displayOrder === null) {
      const maxRow = await queryOne<RowDataPacket>(
        `SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM homepage_design_cases`
      );
      displayOrder = maxRow?.next_order ?? 1;
    }

    const { insertId } = await executeInsert(
      `INSERT INTO homepage_design_cases
        (title, subtitle, image_url, link_url, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.subtitle ?? null,
        body.imageUrl,
        body.linkUrl ?? null,
        displayOrder,
        body.isActive === undefined ? 1 : body.isActive ? 1 : 0,
      ]
    );

    const created = await queryOne<RowDataPacket>(
      `SELECT * FROM homepage_design_cases WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json(
      { success: true, case: created ? mapCase(created) : null },
      { status: 201 }
    );
  } catch (err) {
    console.error('Admin homepage cases POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapCase(row: RowDataPacket) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}
