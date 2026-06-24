import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Try to get authenticated client from x-session header
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Map snake_case DB fields to camelCase for frontend
    type OrderRow = Record<string, unknown>;
    type OrderItemRow = Record<string, unknown>;
    const mapped = (orders as OrderRow[] || []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      shippingMethod: o.shipping_method,
      shippingFee: o.shipping_fee,
      subtotal: o.subtotal,
      total: o.total,
      currency: o.currency,
      paymentMethod: o.payment_method,
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
      createdAt: o.created_at,
      items: ((o.order_items as OrderItemRow[]) || []).map((item) => ({
        productSlug: item.product_slug,
        productName: item.product_name,
        colorName: item.color_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
      })),
    }));

    return NextResponse.json({ orders: mapped });
  } catch (err) {
    console.error('Orders API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
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

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    if (!address?.firstName || !address?.lastName || !address?.email || !address?.addressLine1 || !address?.city || !address?.country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // Generate order number: FUZZ-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `FUZZ-${dateStr}-${random}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending',
        shipping_method: shippingMethod || 'standard',
        shipping_fee: shippingFee || 0,
        subtotal: subtotal || 0,
        total: total || 0,
        currency: 'USD',
        payment_method: paymentMethod || null,
        payment_status: 'paid',
        first_name: address.firstName,
        last_name: address.lastName,
        recipient_name: `${address.firstName} ${address.lastName}`,
        email: address.email,
        phone: address.phone || null,
        country: address.country,
        address_line: address.addressLine1,
        address_line2: address.addressLine2 || null,
        city: address.city,
        state: address.state || null,
        zip_code: address.zipCode || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: {
      productSlug: string;
      productName: string;
      colorName: string;
      colorHex: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }) => ({
      order_id: order.id,
      product_slug: item.productSlug,
      product_name: item.productName,
      color_name: item.colorName,
      color_hex: item.colorHex,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // Create initial shipping event
    await supabase.from('shipping_events').insert({
      order_id: order.id,
      status: 'confirmed',
      description: 'Order confirmed and payment received',
      happened_at: new Date().toISOString(),
    });

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
