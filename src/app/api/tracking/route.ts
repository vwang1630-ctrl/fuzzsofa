import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// GET /api/tracking?number=XXX - Public tracking lookup by tracking number
export async function GET(request: NextRequest) {
  try {
    const trackingNumber = request.nextUrl.searchParams.get('number');
    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Find order by tracking number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_number, carrier, estimated_delivery, latest_shipping_event, shipping_method, created_at')
      .eq('tracking_number', trackingNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'No tracking information found for this number' }, { status: 404 });
    }

    // Get shipping events
    const { data: events, error: eventsError } = await supabase
      .from('shipping_events')
      .select('*')
      .eq('order_id', order.id)
      .order('event_time', { ascending: true });

    if (eventsError) {
      console.error('Error fetching shipping events:', eventsError);
    }

    return NextResponse.json({
      order: {
        orderNumber: order.order_number,
        status: order.status,
        trackingNumber: order.tracking_number,
        carrier: order.carrier,
        estimatedDelivery: order.estimated_delivery,
        latestEvent: order.latest_shipping_event,
        shippingMethod: order.shipping_method,
        createdAt: order.created_at,
      },
      events: events || [],
    });
  } catch (err) {
    console.error('Public tracking API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
