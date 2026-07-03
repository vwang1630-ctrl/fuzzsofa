import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*), shipping_events(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Sort shipping events by happened_at ascending (chronological)
    if (order.shipping_events) {
      (order.shipping_events as { happened_at: string }[]).sort(
        (a, b) => new Date(a.happened_at).getTime() - new Date(b.happened_at).getTime()
      );
    }

    // Map to camelCase for frontend consistency
    type ItemRow = Record<string, unknown>;
    type EventRow = Record<string, unknown>;

    const mapped = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      total: order.total,
      shippingFee: order.shipping_fee,
      subtotal: order.subtotal,
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
      shippingMethod: order.shipping_method,
      createdAt: order.created_at,
      items: ((order.order_items as ItemRow[]) || []).map((item) => ({
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
      shippingEvents: ((order.shipping_events as EventRow[]) || []).map((evt) => ({
        id: evt.id,
        eventType: evt.event_type,
        eventTitle: evt.event_title,
        eventDescription: evt.event_description,
        location: evt.location,
        happenedAt: evt.happened_at,
        isCurrent: evt.is_current,
        isException: evt.is_exception,
        carrier: evt.carrier,
        trackingNumber: evt.tracking_number,
        flightVessel: evt.flight_vessel,
        estimatedArrival: evt.estimated_arrival,
        status: evt.status,
        description: evt.description,
      })),
    };

    return NextResponse.json({ order: mapped });
  } catch (err) {
    console.error('Order detail API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentMethod, trackingNumber, carrier } = body;

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (paymentStatus) updateData.payment_status = paymentStatus;
    if (paymentMethod) updateData.payment_method = paymentMethod;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;

    // If marking as paid + confirmed, also set both
    if (paymentStatus === 'paid' && !status) {
      updateData.status = 'confirmed';
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // If payment was marked as paid, add shipping event
    if (paymentStatus === 'paid') {
      await supabase.from('shipping_events').insert({
        order_id: id,
        status: 'confirmed',
        description: 'Payment confirmed. Your order has been sent to the Fuzz workshop for production.',
        happened_at: new Date().toISOString(),
      });
    }

    // If status changed to shipped, add shipping event
    if (status === 'shipped') {
      await supabase.from('shipping_events').insert({
        order_id: id,
        status: 'shipped',
        description: `Your order has been shipped${trackingNumber ? ` via ${carrier || 'carrier'} (Tracking: ${trackingNumber})` : ''}.`,
        happened_at: new Date().toISOString(),
      });
    }

    // If status changed to delivered
    if (status === 'delivered') {
      await supabase.from('shipping_events').insert({
        order_id: id,
        status: 'delivered',
        description: 'Your order has been delivered. Thank you for choosing Fuzz Sofa!',
        happened_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Order update API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
