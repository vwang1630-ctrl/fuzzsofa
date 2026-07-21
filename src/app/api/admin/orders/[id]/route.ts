import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, queryOne, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { id } = await params;

    // Get order details
    const order = await queryOne<RowDataPacket>(
      `SELECT o.*, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get order items
    const items = await query<RowDataPacket[]>(
      `SELECT * FROM order_items WHERE order_id = ? ORDER BY id`,
      [id]
    );

    // Get shipping events
    const events = await query<RowDataPacket[]>(
      `SELECT * FROM shipping_events WHERE order_id = ? ORDER BY happened_at ASC`,
      [id]
    );

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        shippingMethod: order.shipping_method,
        shippingFee: Number(order.shipping_fee),
        subtotal: Number(order.subtotal),
        total: Number(order.total),
        currency: order.currency,
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
        recipientName: order.recipient_name,
        carrier: order.carrier,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        deliveredAt: order.delivered_at,
        latestShippingEvent: order.latest_shipping_event,
        userEmail: order.user_email,
        userId: order.user_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: items.map((item) => ({
          id: item.id,
          productSlug: item.product_slug,
          productName: item.product_name,
          colorName: item.color_name,
          colorHex: item.color_hex,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unit_price),
          subtotal: Number(item.subtotal),
          imageUrl: item.image_url,
        })),
        shippingEvents: events.map((evt) => ({
          id: evt.id,
          status: evt.status,
          description: evt.description,
          location: evt.location,
          happenedAt: evt.happened_at,
          eventType: evt.event_type,
          eventTitle: evt.event_title,
          eventDescription: evt.event_description,
          isCurrent: Boolean(evt.is_current),
          isException: Boolean(evt.is_exception),
          carrier: evt.carrier,
          trackingNumber: evt.tracking_number,
          flightVessel: evt.flight_vessel,
          estimatedArrival: evt.estimated_arrival,
          createdAt: evt.created_at,
        })),
      },
    });
  } catch (err) {
    console.error('Admin order detail API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentMethod, trackingNumber, carrier, address, items } = body;

    // Check if order exists
    const existingOrder = await queryOne<RowDataPacket>(
      `SELECT id, status, payment_status FROM orders WHERE id = ?`,
      [id]
    );

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderStatus = existingOrder.status as string;
    const orderPaymentStatus = existingOrder.payment_status as string;
    const isUnpaid = orderStatus === 'pending' || orderPaymentStatus === 'pending_payment' || orderPaymentStatus === 'pending';

    // Build update object
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    updateFields.push('updated_at = NOW()');

    if (status) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }
    if (paymentStatus) {
      updateFields.push('payment_status = ?');
      updateParams.push(paymentStatus);
    }
    if (paymentMethod) {
      updateFields.push('payment_method = ?');
      updateParams.push(paymentMethod);
    }
    if (trackingNumber !== undefined) {
      updateFields.push('tracking_number = ?');
      updateParams.push(trackingNumber);
    }
    if (carrier !== undefined) {
      updateFields.push('carrier = ?');
      updateParams.push(carrier);
    }

    // Address update - only allowed for unpaid orders
    if (address && isUnpaid) {
      if (address.firstName) {
        updateFields.push('first_name = ?');
        updateParams.push(address.firstName);
      }
      if (address.lastName) {
        updateFields.push('last_name = ?');
        updateParams.push(address.lastName);
      }
      if (address.email) {
        updateFields.push('email = ?');
        updateParams.push(address.email);
      }
      if (address.phone !== undefined) {
        updateFields.push('phone = ?');
        updateParams.push(address.phone);
      }
      if (address.country) {
        updateFields.push('country = ?');
        updateParams.push(address.country);
      }
      if (address.addressLine1) {
        updateFields.push('address_line = ?');
        updateParams.push(address.addressLine1);
      }
      if (address.addressLine2 !== undefined) {
        updateFields.push('address_line2 = ?');
        updateParams.push(address.addressLine2);
      }
      if (address.city) {
        updateFields.push('city = ?');
        updateParams.push(address.city);
      }
      if (address.state !== undefined) {
        updateFields.push('state = ?');
        updateParams.push(address.state);
      }
      if (address.zipCode) {
        updateFields.push('zip_code = ?');
        updateParams.push(address.zipCode);
      }
      if (address.firstName && address.lastName) {
        updateFields.push('recipient_name = ?');
        updateParams.push(`${address.firstName} ${address.lastName}`);
      }
    }

    // If marking as paid + confirmed, also set both
    if (paymentStatus === 'paid' && !status) {
      updateFields.push('status = ?');
      updateParams.push('confirmed');
    }

    if (updateFields.length > 1) {
      // More than just updated_at
      updateParams.push(id);
      await execute(
        `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }

    // If payment was marked as paid, add shipping event
    if (paymentStatus === 'paid') {
      await execute(
        `INSERT INTO shipping_events (id, order_id, status, description, happened_at)
         VALUES (UUID(), ?, 'confirmed', 'Payment confirmed. Your order has been sent to the Fuzz workshop for production.', NOW())`,
        [id]
      );
    }

    // If status changed to shipped, add shipping event
    if (status === 'shipped') {
      const shipDesc = trackingNumber
        ? `Your order has been shipped via ${carrier || 'carrier'} (Tracking: ${trackingNumber}).`
        : 'Your order has been shipped.';
      await execute(
        `INSERT INTO shipping_events (id, order_id, status, description, happened_at)
         VALUES (UUID(), ?, 'shipped', ?, NOW())`,
        [id, shipDesc]
      );
    }

    // If status changed to delivered
    if (status === 'delivered') {
      await execute(
        `INSERT INTO shipping_events (id, order_id, status, description, happened_at)
         VALUES (UUID(), ?, 'delivered', 'Your order has been delivered. Thank you for choosing Fuzz Sofa!', NOW())`,
        [id]
      );
    }

    // Update order items (color/style) - only allowed for unpaid orders
    if (items && isUnpaid && Array.isArray(items)) {
      for (const item of items) {
        if (!item.id) continue;
        const itemUpdateFields: string[] = [];
        const itemUpdateParams: unknown[] = [];

        if (item.colorName) {
          itemUpdateFields.push('color_name = ?');
          itemUpdateParams.push(item.colorName);
        }
        if (item.colorHex) {
          itemUpdateFields.push('color_hex = ?');
          itemUpdateParams.push(item.colorHex);
        }
        if (item.productName) {
          itemUpdateFields.push('product_name = ?');
          itemUpdateParams.push(item.productName);
        }

        if (itemUpdateFields.length > 0) {
          itemUpdateParams.push(item.id, id);
          await execute(
            `UPDATE order_items SET ${itemUpdateFields.join(', ')} WHERE id = ? AND order_id = ?`,
            itemUpdateParams
          );
        }
      }
    }

    // Fetch updated order
    const updatedOrder = await queryOne<RowDataPacket>(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ order: updatedOrder });
  } catch (err) {
    console.error('Admin order update API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
