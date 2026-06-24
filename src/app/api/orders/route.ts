import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
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

    type OrderRow = Record<string, unknown>;
    type OrderItemRow = Record<string, unknown>;
    const mapped = (orders as OrderRow[] || []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      paymentStatus: o.payment_status,
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
        colorHex: item.color_hex,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
        imageUrl: item.image_url,
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
      paymentStatus,
      address,
    } = body;

    // Map items from frontend format (flexible: slug or productSlug, name or productName)
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

    // Map address from frontend format (zip or zipCode)
    const addr = address || {};
    const zipCode = addr.zipCode || addr.zip || null;

    // Validate required fields
    if (mappedItems.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    if (!addr.firstName || !addr.lastName || !addr.email || !addr.addressLine1 || !addr.city || !addr.country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // Generate order number: FUZZ-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `FUZZ-${dateStr}-${random}`;

    // Determine order status based on payment
    // Online payment (creditcard/paypal/applepay) → confirmed + paid immediately
    // Bank transfer → pending + pending_payment
    const isOnlinePayment = paymentMethod && paymentMethod !== 'banktransfer';
    const orderStatus = isOnlinePayment ? 'confirmed' : 'pending';
    const finalPaymentStatus = isOnlinePayment ? 'paid' : 'pending_payment';

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: orderStatus,
        shipping_method: shippingMethod || 'standard',
        shipping_fee: shippingFee || 0,
        subtotal: subtotal || 0,
        total: total || 0,
        currency: 'USD',
        payment_method: paymentMethod || null,
        payment_status: finalPaymentStatus,
        first_name: addr.firstName,
        last_name: addr.lastName,
        recipient_name: `${addr.firstName} ${addr.lastName}`,
        email: addr.email,
        phone: addr.phone || null,
        country: addr.country,
        address_line: addr.addressLine1,
        address_line2: addr.addressLine2 || null,
        city: addr.city,
        state: addr.state || null,
        zip_code: zipCode,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = mappedItems.map((item: {
      productSlug: string;
      productName: string;
      colorName: string;
      colorHex: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      imageUrl: string | null;
    }) => ({
      order_id: order.id,
      product_slug: item.productSlug,
      product_name: item.productName,
      color_name: item.colorName,
      color_hex: item.colorHex,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
      image_url: item.imageUrl,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // Create initial shipping event
    const shippingEventDesc = isOnlinePayment
        ? 'Payment confirmed. Your order has been sent to the Fuzz workshop for production.'
        : 'Order placed. Awaiting bank transfer payment.';
    await supabase.from('shipping_events').insert({
      order_id: order.id,
      status: orderStatus,
      description: shippingEventDesc,
      happened_at: new Date().toISOString(),
    });

    // For online payment, also add production start event
    if (isOnlinePayment) {
      await supabase.from('shipping_events').insert({
        order_id: order.id,
        status: 'confirmed',
        description: 'Your furniture is now being handcrafted by our artisans. Estimated production time: 2 days.',
        happened_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: finalPaymentStatus,
        total: order.total,
        paymentMethod: paymentMethod,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: delete a pending order (only pending orders can be deleted)
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Check that the order belongs to the user and is in pending status
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, payment_status')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow deleting pending orders (unpaid)
    if ((order as Record<string, unknown>).status !== 'pending') {
      return NextResponse.json({ error: 'Only pending orders can be deleted' }, { status: 400 });
    }

    // Delete shipping events first (foreign key)
    await supabase.from('shipping_events').delete().eq('order_id', orderId);
    // Delete order items
    await supabase.from('order_items').delete().eq('order_id', orderId);
    // Delete the order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting order:', deleteError);
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Order delete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
