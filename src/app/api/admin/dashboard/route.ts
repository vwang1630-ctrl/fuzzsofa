import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    // Aggregate stats
    const revenueRow = await queryOne<RowDataPacket>(
      `SELECT COALESCE(SUM(total), 0) as totalRevenue
       FROM orders
       WHERE payment_status = 'paid'`
    );
    const totalRevenue = revenueRow?.totalRevenue ?? 0;

    const ordersRow = await queryOne<RowDataPacket>(
      `SELECT COUNT(*) as totalOrders FROM orders`
    );
    const totalOrders = ordersRow?.totalOrders ?? 0;

    const productsRow = await queryOne<RowDataPacket>(
      `SELECT COUNT(*) as totalProducts FROM products WHERE status = 'active'`
    );
    const totalProducts = productsRow?.totalProducts ?? 0;

    const usersRow = await queryOne<RowDataPacket>(
      `SELECT COUNT(*) as totalUsers FROM users WHERE is_active = TRUE`
    );
    const totalUsers = usersRow?.totalUsers ?? 0;

    // Recent 10 orders
    const recentOrders = await query<RowDataPacket[]>(
      `SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.currency,
              o.first_name, o.last_name, o.email, o.created_at,
              u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Top 5 products by order quantity
    const topProducts = await query<RowDataPacket[]>(
      `SELECT oi.product_slug, oi.product_name, SUM(oi.quantity) as totalSold,
              SUM(oi.subtotal) as totalRevenue
       FROM order_items oi
       GROUP BY oi.product_slug, oi.product_name
       ORDER BY totalSold DESC
       LIMIT 5`
    );

    return NextResponse.json({
      totalRevenue: Number(totalRevenue),
      totalOrders: Number(totalOrders),
      totalProducts: Number(totalProducts),
      totalUsers: Number(totalUsers),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        paymentStatus: o.payment_status,
        total: Number(o.total),
        currency: o.currency,
        firstName: o.first_name,
        lastName: o.last_name,
        email: o.email,
        userEmail: o.user_email,
        createdAt: o.created_at,
      })),
      topProducts: topProducts.map((p) => ({
        productSlug: p.product_slug,
        productName: p.product_name,
        totalSold: Number(p.totalSold),
        totalRevenue: Number(p.totalRevenue),
      })),
    });
  } catch (err) {
    console.error('Admin dashboard API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
