import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { query, queryOne, execute, executeInsert } from '@/lib/db';

interface OrderRow {
  id: number;
  user_id: string;
  order_number: string;
  status: string;
  payment_status: string;
  shipping_method: string;
  shipping_fee: number;
  subtotal: number;
  total: number;
  currency: string;
  payment_method: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  address_line: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  latest_shipping_event: string | null;
  created_at: Date;
}

interface OrderItemRow {
  id: number;
  order_id: number;
  product_slug: string;
  product_name: string;
  color_name: string;
  color_hex: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url: string | null;
}

// GET: 查询用户订单列表
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params: unknown[] = [user.id];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const orders = await query<OrderRow[]>(sql, params);

    // 查询每个订单的商品
    const mapped = await Promise.all(
      orders.map(async (order) => {
        const items = await query<OrderItemRow[]>(
          'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
          [order.id]
        );

        return {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          paymentStatus: order.payment_status,
          shippingMethod: order.shipping_method,
          shippingFee: order.shipping_fee,
          subtotal: order.subtotal,
          total: order.total,
          currency: order.currency,
          paymentMethod: order.payment_method,
          firstName: order.first_name,
          lastName: order.last_name,
          email: order.email,
          phone: order.phone,
          country: order.country,
          addressLine1: order.address_line,
          addressLine2: order.address_line2,
          city: order.city,
          state: order.state,
          zipCode: order.zip_code,
          carrier: order.carrier,
          trackingNumber: order.tracking_number,
          estimatedDelivery: order.estimated_delivery,
          latestShippingEvent: order.latest_shipping_event,
          createdAt: order.created_at,
          items: items.map((item) => ({
            id: item.id,
            productSlug: item.product_slug,
            productName: item.product_name,
            colorName: item.color_name,
            colorHex: item.color_hex,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            subtotal: item.subtotal,
            imageUrl: item.image_url,
          })),
        };
      })
    );

    return NextResponse.json({ orders: mapped });
  } catch (err) {
    console.error('User orders GET API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 创建订单（从购物车结算）
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
    const {
      items,
      shippingMethod,
      shippingFee,
      subtotal,
      total,
      paymentMethod,
      address,
    } = body;

    // 映射商品数据（兼容多种字段名格式）
    const mappedItems = (items || []).map((item: Record<string, unknown>) => ({
      productSlug: item.productSlug || item.slug || '',
      productName: item.productName || item.name || '',
      colorName: item.colorName || 'Default',
      colorHex: item.colorHex || '#000000',
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice || item.price) || 0,
      subtotal: Number(item.subtotal) || (Number(item.quantity) || 1) * (Number(item.unitPrice || item.price) || 0),
      imageUrl: item.imageUrl || item.image_url || null,
    }));

    // 映射地址
    const addr = address || {};
    const zipCode = addr.zipCode || addr.zip || null;

    // 校验必填字段
    if (mappedItems.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    if (!addr.firstName || !addr.lastName || !addr.email || !addr.addressLine1 || !addr.city || !addr.country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // 生成订单号: FUZZ-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `FUZZ-${dateStr}-${random}`;

    // 根据支付方式确定订单状态
    const isOnlinePayment = paymentMethod && paymentMethod !== 'banktransfer';
    const orderStatus = isOnlinePayment ? 'confirmed' : 'pending';
    const finalPaymentStatus = isOnlinePayment ? 'paid' : 'pending_payment';

    // 创建订单
    const orderResult = await executeInsert(
      `INSERT INTO orders (user_id, order_number, status, shipping_method, shipping_fee, subtotal, total, currency, payment_method, payment_status, first_name, last_name, email, phone, country, address_line, address_line2, city, state, zip_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        orderNumber,
        orderStatus,
        shippingMethod || 'standard',
        shippingFee || 0,
        subtotal || 0,
        total || 0,
        'USD',
        paymentMethod || null,
        finalPaymentStatus,
        addr.firstName,
        addr.lastName,
        addr.email,
        addr.phone || null,
        addr.country,
        addr.addressLine1,
        addr.addressLine2 || null,
        addr.city,
        addr.state || null,
        zipCode,
      ]
    );

    const orderId = orderResult.insertId;

    // 创建订单商品
    for (const item of mappedItems) {
      await executeInsert(
        `INSERT INTO order_items (order_id, product_slug, product_name, color_name, color_hex, quantity, unit_price, subtotal, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productSlug,
          item.productName,
          item.colorName,
          item.colorHex,
          item.quantity,
          item.unitPrice,
          item.subtotal,
          item.imageUrl,
        ]
      );
    }

    // 清空用户购物车
    const cart = await queryOne<{ id: number }>(
      'SELECT id FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    if (cart) {
      await execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }

    return NextResponse.json({
      order: {
        id: orderId,
        orderNumber,
        status: orderStatus,
        paymentStatus: finalPaymentStatus,
        total: total || 0,
        paymentMethod: paymentMethod,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('User orders POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
