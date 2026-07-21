import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const offset = (page - 1) * pageSize;

    // Build WHERE clauses
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status && status !== 'all') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push(
        `(o.order_number LIKE ? OR o.first_name LIKE ? OR o.last_name LIKE ? OR o.email LIKE ? OR u.email LIKE ?)`
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countRow = await queryOne<RowDataPacket>(
      `SELECT COUNT(*) as total
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}`,
      params
    );
    const total = countRow?.total ?? 0;

    // Get paginated orders
    const orders = await query<RowDataPacket[]>(
      `SELECT o.id, o.order_number, o.status, o.payment_status, o.payment_method,
              o.shipping_method, o.shipping_fee, o.subtotal, o.total, o.currency,
              o.first_name, o.last_name, o.email, o.phone,
              o.country, o.address_line, o.address_line2, o.city, o.state, o.zip_code,
              o.carrier, o.tracking_number, o.estimated_delivery, o.latest_shipping_event,
              o.created_at, o.updated_at,
              u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        paymentStatus: o.payment_status,
        paymentMethod: o.payment_method,
        shippingMethod: o.shipping_method,
        shippingFee: Number(o.shipping_fee),
        subtotal: Number(o.subtotal),
        total: Number(o.total),
        currency: o.currency,
        firstName: o.first_name,
        lastName: o.last_name,
        email: o.email,
        phone: o.phone,
        country: o.country,
        addressLine1: o.address_line,
        addressLine2: o.address_line2,
        city: o.city,
        state: o.state,
        zipCode: o.zip_code,
        carrier: o.carrier,
        trackingNumber: o.tracking_number,
        estimatedDelivery: o.estimated_delivery,
        latestShippingEvent: o.latest_shipping_event,
        userEmail: o.user_email,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      })),
      pagination: {
        page,
        pageSize,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    });
  } catch (err) {
    console.error('Admin orders API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
