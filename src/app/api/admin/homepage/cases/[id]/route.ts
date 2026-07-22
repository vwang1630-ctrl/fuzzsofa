import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { queryOne, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * PUT /api/admin/homepage/cases/[id]
 * 更新设计案例
 * Body: { title?, subtitle?, imageUrl?, linkUrl?, displayOrder?, isActive? }
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
      `SELECT id FROM homepage_design_cases WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Design case not found' }, { status: 404 });
    }

    const updateFields: string[] = [];
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
    if (body.displayOrder !== undefined) {
      updateFields.push('display_order = ?');
      updateParams.push(body.displayOrder);
    }
    if (body.isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(body.isActive ? 1 : 0);
    }

    if (updateFields.length > 0) {
      updateParams.push(id);
      await execute(
        `UPDATE homepage_design_cases SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }

    const updated = await queryOne<RowDataPacket>(
      `SELECT * FROM homepage_design_cases WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      case: updated
        ? {
            id: updated.id,
            title: updated.title,
            subtitle: updated.subtitle,
            imageUrl: updated.image_url,
            linkUrl: updated.link_url,
            displayOrder: updated.display_order,
            isActive: Boolean(updated.is_active),
            createdAt: updated.created_at,
          }
        : null,
    });
  } catch (err) {
    console.error('Admin homepage case PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/homepage/cases/[id]
 * 删除设计案例
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
      `SELECT id FROM homepage_design_cases WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Design case not found' }, { status: 404 });
    }

    await execute(`DELETE FROM homepage_design_cases WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Admin homepage case DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
