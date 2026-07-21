import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { query, queryOne, execute, executeInsert } from '@/lib/db';

interface FavoriteRow {
  id: number;
  user_id: string;
  product_slug: string;
  created_at: Date;
}

// GET: 获取收藏列表
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await query<FavoriteRow[]>(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json({
      favorites: favorites.map((f) => ({
        id: f.id,
        productSlug: f.product_slug,
        createdAt: f.created_at,
      })),
    });
  } catch (err) {
    console.error('User favorites GET API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 添加收藏
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productSlug } = body;

    if (!productSlug || typeof productSlug !== 'string') {
      return NextResponse.json({ error: 'productSlug is required' }, { status: 400 });
    }

    // 检查是否已收藏
    const existing = await queryOne<FavoriteRow>(
      'SELECT * FROM favorites WHERE user_id = ? AND product_slug = ?',
      [user.id, productSlug]
    );

    if (existing) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 });
    }

    // 添加收藏
    const result = await executeInsert(
      'INSERT INTO favorites (user_id, product_slug) VALUES (?, ?)',
      [user.id, productSlug]
    );

    const favorite = await queryOne<FavoriteRow>(
      'SELECT * FROM favorites WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      favorite: favorite ? {
        id: favorite.id,
        productSlug: favorite.product_slug,
        createdAt: favorite.created_at,
      } : null,
    }, { status: 201 });
  } catch (err) {
    console.error('User favorites POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');

    if (!productSlug) {
      return NextResponse.json({ error: 'productSlug is required' }, { status: 400 });
    }

    const { affectedRows } = await execute(
      'DELETE FROM favorites WHERE user_id = ? AND product_slug = ?',
      [user.id, productSlug]
    );

    if (affectedRows === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('User favorites DELETE API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
