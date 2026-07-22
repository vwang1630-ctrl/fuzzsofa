import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, execute, executeInsert } from '@/lib/db';
import { journalArticles } from '@/lib/journal';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/homepage/posts
 * 获取最新动态列表（按 display_order 升序，关联本地文章数据补充标题等信息）
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM homepage_latest_posts
       ORDER BY display_order ASC, id ASC`
    );

    return NextResponse.json({ items: rows.map(mapPostItem) });
  } catch (err) {
    console.error('Admin homepage posts GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/homepage/posts
 * 批量更新最新动态（全量同步，含排序）
 * Body: { items: [{ id?, postSlug, displayOrder?, isActive? }] }
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
      if (!item || !item.postSlug) {
        return NextResponse.json(
          { error: 'Each item requires postSlug' },
          { status: 400 }
        );
      }
    }

    const existingRows = await query<RowDataPacket[]>(
      `SELECT id FROM homepage_latest_posts`
    );
    const existingIds = new Set(existingRows.map((r) => Number(r.id)));
    const submittedIds = new Set<number>();

    for (const [index, item] of items.entries()) {
      const displayOrder = item.displayOrder ?? index + 1;
      const isActive = item.isActive === undefined ? 1 : item.isActive ? 1 : 0;

      if (item.id && existingIds.has(Number(item.id))) {
        submittedIds.add(Number(item.id));
        await execute(
          `UPDATE homepage_latest_posts
           SET post_slug = ?, display_order = ?, is_active = ?
           WHERE id = ?`,
          [item.postSlug, displayOrder, isActive, item.id]
        );
      } else {
        const { insertId } = await executeInsert(
          `INSERT INTO homepage_latest_posts (post_slug, display_order, is_active)
           VALUES (?, ?, ?)`,
          [item.postSlug, displayOrder, isActive]
        );
        submittedIds.add(insertId);
      }
    }

    // Delete records that were not submitted
    const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
    if (toDelete.length > 0) {
      await execute(
        `DELETE FROM homepage_latest_posts WHERE id IN (${toDelete.map(() => '?').join(',')})`,
        toDelete
      );
    }

    // Fetch updated list
    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM homepage_latest_posts
       ORDER BY display_order ASC, id ASC`
    );

    return NextResponse.json({ success: true, items: rows.map(mapPostItem) });
  } catch (err) {
    console.error('Admin homepage posts PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapPostItem(row: RowDataPacket) {
  const article = journalArticles.find((a) => a.slug === row.post_slug);

  return {
    id: row.id,
    postSlug: row.post_slug,
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    postTitle: article?.title ?? null,
    postExcerpt: article?.excerpt ?? null,
    postCategory: article?.category ?? null,
    postDate: article?.datePublished ?? null,
  };
}
