import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

// GET /api/orders/[id]/shipping - Get shipping events for an order
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

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_number, carrier, estimated_delivery, latest_shipping_event, shipping_method')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get shipping events sorted by time
    const { data: events, error: eventsError } = await supabase
      .from('shipping_events')
      .select('*')
      .eq('order_id', id)
      .order('event_time', { ascending: true });

    if (eventsError) {
      console.error('Error fetching shipping events:', eventsError);
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        trackingNumber: order.tracking_number,
        carrier: order.carrier,
        estimatedDelivery: order.estimated_delivery,
        latestEvent: order.latest_shipping_event,
        shippingMethod: order.shipping_method,
      },
      events: events || [],
    });
  } catch (err) {
    console.error('Shipping API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders/[id]/shipping - Add a shipping event (for demo/admin)
export async function POST(
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
    const { eventType, eventTitle, eventDescription, location, isException, flightVessel, estimatedArrival } = body as {
      eventType: string;
      eventTitle?: string;
      eventDescription?: string;
      location?: string;
      isException?: boolean;
      flightVessel?: string;
      estimatedArrival?: string;
    };

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
    }

    // Verify order belongs to user
    const { data: order } = await supabase
      .from('orders')
      .select('id, tracking_number, carrier')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Reset is_current on all existing events
    await supabase
      .from('shipping_events')
      .update({ is_current: false })
      .eq('order_id', id);

    // Insert new event
    const { data: event, error } = await supabase
      .from('shipping_events')
      .insert({
        order_id: id,
        event_type: eventType,
        event_title: eventTitle || eventType,
        event_description: eventDescription || null,
        location: location || null,
        is_current: true,
        is_exception: isException || false,
        carrier: order.carrier,
        tracking_number: order.tracking_number,
        flight_vessel: flightVessel || null,
        estimated_arrival: estimatedArrival || null,
        event_time: new Date().toISOString(),
        happened_at: new Date().toISOString(),
        status: eventType,
        description: eventDescription || eventTitle || eventType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting shipping event:', error);
      return NextResponse.json({ error: 'Failed to add shipping event' }, { status: 500 });
    }

    // Update order's latest_shipping_event
    await supabase
      .from('orders')
      .update({
        latest_shipping_event: eventType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    // Auto-transition order status based on event type
    const statusMap: Record<string, string> = {
      shippingPreShipping: 'confirmed',
      shippingPacked: 'confirmed',
      shippingPickedUp: 'processing',
      shippingWarehouseReceived: 'processing',
      shippingWarehouseDispatched: 'processing',
      shippingExportDeclared: 'processing',
      shippingExportCleared: 'processing',
      shippingInTransitIntl: 'shipped',
      shippingTransitHub: 'shipped',
      shippingArrivedDest: 'shipped',
      shippingImportDeclared: 'shipped',
      shippingTaxPaid: 'shipped',
      shippingImportCleared: 'shipped',
      shippingLocalSorting: 'shipped',
      shippingLocalDispatched: 'shipped',
      shippingOutForDelivery: 'shipped',
      shippingDelivered: 'delivered',
      shippingCustomsHold: 'shipped',
      shippingDelay: 'shipped',
      shippingDeliveryFailed: 'shipped',
      shippingReturnToOrigin: 'cancelled',
    };

    const newStatus = statusMap[eventType];
    if (newStatus) {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
    }

    return NextResponse.json({ event });
  } catch (err) {
    console.error('Shipping event API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
