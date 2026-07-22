import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { queryOne, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * PUT /api/admin/homepage/banners/[id]
 * 更新轮播图
 * Body: { title?, subtitle?, imageUrl?, linkUrl?, buttonText?, sortOrder?, isActive? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();

    const existing = await queryOne<RowDataPacket>(
      `SELECT id FROM homepage_banners WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updateFields: string[] = ['updated_at = NOW()'];
    const updateParams: unknown[] = [];

    if (body.title !== undefined) {
      updateFields.push('title = ?');
      updateParams.push(body.title);
    }
    if (body.subtitle !== undefined) {
      updateFields.push('subtitle = ?');
      updateParams.push(body.subtitle);
    }
    if (body.imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateParams.push(body.imageUrl);
    }
    if (body.linkUrl !== undefined) {
      updateFields.push('link_url = ?');
      updateParams.push(body.linkUrl);
    }
    if (body.buttonText !== undefined) {
      updateFields.push('button_text = ?');
      updateParams.push(body.buttonText);
    }
    if (body.sortOrder !== undefined) {
      updateFields.push('sort_order = ?');
      updateParams.push(body.sortOrder);
    }
    if (body.isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(body.isActive ? 1 : 0);
    }

    if (updateFields.length > 1) {
      updateParams.push(id);
      await execute(
        `UPDATE homepage_banners SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }

    const updated = await queryOne<RowDataPacket>(
      `SELECT * FROM homepage_banners WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      banner: updated
        ? {
            id: updated.id,
            title: updated.title,
            subtitle: updated.subtitle,
            imageUrl: updated.image_url,
            linkUrl: updated.link_url,
            buttonText: updated.button_text,
            sortOrder: updated.sort_order,
            isActive: Boolean(updated.is_active),
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
          }
        : null,
    });
  } catch (err) {
    console.error('Admin homepage banner PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/homepage/banners/[id]
 * 删除轮播图
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { id } = await params;

    const existing = await queryOne<RowDataPacket>(
      `SELECT id FROM homepage_banners WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await execute(`DELETE FROM homepage_banners WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Admin homepage banner DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
