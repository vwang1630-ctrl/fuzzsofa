import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { query, queryOne, execute, executeInsert } from '@/lib/db';

interface CartRow {
  id: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

interface CartItemRow {
  id: number;
  cart_id: number;
  product_slug: string;
  product_name: string;
  material: string | null;
  color_name: string;
  color_hex: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
}

// GET: 查询用户购物车
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

    // 查询用户的购物车
    const cart = await queryOne<CartRow>(
      'SELECT * FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!cart) {
      return NextResponse.json({
        cart: {
          id: null,
          items: [],
          itemCount: 0,
          total: 0,
        },
      });
    }

    // 查询购物车商品
    const items = await query<CartItemRow[]>(
      'SELECT * FROM cart_items WHERE cart_id = ? ORDER BY created_at DESC',
      [cart.id]
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      productSlug: item.product_slug,
      productName: item.product_name,
      material: item.material,
      colorName: item.color_name,
      colorHex: item.color_hex,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      imageUrl: item.image_url,
    }));

    const itemCount = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = mappedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return NextResponse.json({
      cart: {
        id: cart.id,
        items: mappedItems,
        itemCount,
        total: Math.round(total * 100) / 100,
      },
    });
  } catch (err) {
    console.error('User cart GET API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 创建/更新购物车（整体更新购物车商品列表）
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
    const { items } = body;

    // 查找或创建购物车
    let cart = await queryOne<CartRow>(
      'SELECT * FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!cart) {
      const result = await executeInsert(
        'INSERT INTO carts (user_id) VALUES (?)',
        [user.id]
      );
      cart = await queryOne<CartRow>('SELECT * FROM carts WHERE id = ?', [result.insertId]);
    }

    if (!cart) {
      return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
    }

    // 如果传入了 items 数组，则整体替换购物车内容
    if (items && Array.isArray(items)) {
      // 清空现有购物车商品
      await execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

      // 批量插入新商品
      for (const item of items) {
        if (!item.productSlug || !item.quantity || !item.unitPrice) {
          continue;
        }
        await executeInsert(
          `INSERT INTO cart_items (cart_id, product_slug, product_name, material, color_name, color_hex, quantity, unit_price, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cart.id,
            item.productSlug,
            item.productName || '',
            item.material || null,
            item.colorName || 'Default',
            item.colorHex || '#000000',
            item.quantity,
            item.unitPrice,
            item.imageUrl || null,
          ]
        );
      }
    }

    // 返回更新后的购物车
    const updatedItems = await query<CartItemRow[]>(
      'SELECT * FROM cart_items WHERE cart_id = ? ORDER BY created_at DESC',
      [cart.id]
    );

    const mappedItems = updatedItems.map((item) => ({
      id: item.id,
      productSlug: item.product_slug,
      productName: item.product_name,
      material: item.material,
      colorName: item.color_name,
      colorHex: item.color_hex,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      imageUrl: item.image_url,
    }));

    const itemCount = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = mappedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return NextResponse.json({
      cart: {
        id: cart.id,
        items: mappedItems,
        itemCount,
        total: Math.round(total * 100) / 100,
      },
    });
  } catch (err) {
    console.error('User cart POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
