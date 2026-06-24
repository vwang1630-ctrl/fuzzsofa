import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

// POST /api/orders/[id]/seed-shipping - Seed demo shipping events for an order
// This simulates the full DDP logistics chain for testing
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

    // Verify order belongs to user and is in a shippable state
    const { data: order } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_number, carrier')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate a demo tracking number if not present
    const trackingNumber = order.tracking_number || `FS${Date.now().toString(36).toUpperCase()}`;
    const carrier = order.carrier || 'SF Express International';

    // Delete existing shipping events for clean seed
    await supabase
      .from('shipping_events')
      .delete()
      .eq('order_id', id);

    // Generate timeline: events from 5 days ago to now
    const now = new Date();
    const events = [
      {
        event_type: 'shippingPreShipping',
        event_title: 'shippingPreShipping',
        event_description: 'Order confirmed, preparing your package',
        location: 'Fuzz Studio, Shenzhen',
        hoursAgo: 120, is_exception: false,
      },
      {
        event_type: 'shippingPacked',
        event_title: 'shippingPacked',
        event_description: 'Package packed & labeled',
        location: 'Fuzz Studio, Shenzhen',
        hoursAgo: 108, is_exception: false,
      },
      {
        event_type: 'shippingPickedUp',
        event_title: 'shippingPickedUp',
        event_description: 'Picked up from warehouse',
        location: 'Shenzhen, Guangdong',
        hoursAgo: 96, is_exception: false,
      },
      {
        event_type: 'shippingWarehouseReceived',
        event_title: 'shippingWarehouseReceived',
        event_description: 'Arrived at consolidation warehouse',
        location: 'SF International Hub, Guangzhou',
        hoursAgo: 84, is_exception: false,
      },
      {
        event_type: 'shippingWarehouseDispatched',
        event_title: 'shippingWarehouseDispatched',
        event_description: 'Dispatched from warehouse to airport',
        location: 'Guangzhou Baiyun International Airport',
        hoursAgo: 72, is_exception: false,
      },
      {
        event_type: 'shippingExportDeclared',
        event_title: 'shippingExportDeclared',
        event_description: 'Export customs declaration filed',
        location: 'Guangzhou Customs',
        hoursAgo: 66, is_exception: false,
      },
      {
        event_type: 'shippingExportCleared',
        event_title: 'shippingExportCleared',
        event_description: 'Export customs released',
        location: 'Guangzhou Customs',
        hoursAgo: 60, is_exception: false,
      },
      {
        event_type: 'shippingInTransitIntl',
        event_title: 'shippingInTransitIntl',
        event_description: 'In transit — flight departed',
        location: 'Guangzhou → Dubai',
        hoursAgo: 48, is_exception: false,
        flight_vessel: 'CZ383',
      },
      {
        event_type: 'shippingTransitHub',
        event_title: 'shippingTransitHub',
        event_description: 'Arrived at transit hub',
        location: 'Dubai International Airport',
        hoursAgo: 30, is_exception: false,
      },
      {
        event_type: 'shippingArrivedDest',
        event_title: 'shippingArrivedDest',
        event_description: 'Arrived at destination country',
        location: 'Dubai International Airport',
        hoursAgo: 24, is_exception: false,
      },
      {
        event_type: 'shippingImportDeclared',
        event_title: 'shippingImportDeclared',
        event_description: 'Import customs declaration filed (DDP)',
        location: 'Dubai Customs',
        hoursAgo: 20, is_exception: false,
      },
      {
        event_type: 'shippingTaxPaid',
        event_title: 'shippingTaxPaid',
        event_description: 'Duties & taxes paid (DDP service)',
        location: 'Dubai Customs',
        hoursAgo: 16, is_exception: false,
      },
      {
        event_type: 'shippingImportCleared',
        event_title: 'shippingImportCleared',
        event_description: 'Import customs released',
        location: 'Dubai Customs',
        hoursAgo: 12, is_exception: false,
      },
      {
        event_type: 'shippingLocalSorting',
        event_title: 'shippingLocalSorting',
        event_description: 'At local sorting center',
        location: 'Dubai South Logistics Hub',
        hoursAgo: 8, is_exception: false,
      },
      {
        event_type: 'shippingOutForDelivery',
        event_title: 'shippingOutForDelivery',
        event_description: 'Out for delivery',
        location: 'Dubai Marina Area',
        hoursAgo: 2, is_exception: false,
      },
    ];

    // Mark last event as current
    events[events.length - 1].is_exception = false;

    // Insert all events
    const insertData = events.map((evt, idx) => {
      const eventTime = new Date(now.getTime() - evt.hoursAgo * 3600000);
      return {
        order_id: id,
        event_type: evt.event_type,
        event_title: evt.event_title,
        event_description: evt.event_description,
        location: evt.location,
        is_current: idx === events.length - 1,
        is_exception: evt.is_exception,
        carrier,
        tracking_number: trackingNumber,
        flight_vessel: (evt as { flight_vessel?: string }).flight_vessel || null,
        happened_at: eventTime.toISOString(),
        status: evt.event_type,
        description: evt.event_description,
      };
    });

    const { error: insertError } = await supabase
      .from('shipping_events')
      .insert(insertData);

    if (insertError) {
      console.error('Error seeding shipping events:', insertError);
      return NextResponse.json({ error: 'Failed to seed shipping events' }, { status: 500 });
    }

    // Update order with tracking info
    const estimatedDelivery = new Date(now.getTime() + 24 * 3600000); // Tomorrow
    await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier,
        estimated_delivery: estimatedDelivery.toISOString().split('T')[0],
        latest_shipping_event: 'shippingOutForDelivery',
        status: 'shipped',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      message: 'Demo shipping events seeded',
      trackingNumber,
      eventsCount: events.length,
    });
  } catch (err) {
    console.error('Seed shipping API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
