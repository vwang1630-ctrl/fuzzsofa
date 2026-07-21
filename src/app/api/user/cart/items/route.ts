import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { queryOne, executeInsert, execute } from '@/lib/db';

interface CartRow {
  id: number;
  user_id: string;
}

interface CartItemRow {
  id: number;
  cart_id: number;
  product_slug: string;
  color_name: string;
  quantity: number;
}

// POST: 添加商品到购物车
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
    const { productSlug, material, colorName, colorHex, quantity, unitPrice, imageUrl } = body;

    // 参数校验
    if (!productSlug || typeof productSlug !== 'string') {
      return NextResponse.json({ error: 'productSlug is required' }, { status: 400 });
    }
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }
    if (!unitPrice || unitPrice < 0) {
      return NextResponse.json({ error: 'Invalid unitPrice' }, { status: 400 });
    }

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

    // 检查相同商品+颜色是否已在购物车中
    const existingItem = await queryOne<CartItemRow>(
      `SELECT * FROM cart_items
       WHERE cart_id = ? AND product_slug = ? AND color_name = ?`,
      [cart.id, productSlug, colorName || 'Default']
    );

    if (existingItem) {
      // 已有相同商品，更新数量
      const newQuantity = existingItem.quantity + quantity;
      const { affectedRows } = await execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem.id]
      );

      if (affectedRows === 0) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: 'updated',
        quantity: newQuantity,
      });
    }

    // 添加新商品到购物车
    const result = await executeInsert(
      `INSERT INTO cart_items (cart_id, product_slug, product_name, material, color_name, color_hex, quantity, unit_price, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cart.id,
        productSlug,
        body.productName || '',
        material || null,
        colorName || 'Default',
        colorHex || '#000000',
        quantity,
        unitPrice,
        imageUrl || null,
      ]
    );

    return NextResponse.json({
      success: true,
      action: 'added',
      itemId: result.insertId,
    }, { status: 201 });
  } catch (err) {
    console.error('User cart items POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
