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

    // Get or create cart for user
    const { data: existingCart, error: cartError } = await supabase
      .from('cart')
      .select('*, cart_items(*)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (cartError) {
      console.error('Error fetching cart:', cartError);
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    if (!existingCart) {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from('cart')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        console.error('Error creating cart:', createError);
        return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
      }

      return NextResponse.json({
        cart: {
          id: newCart.id,
          items: [],
          itemCount: 0,
          total: 0,
        },
      });
    }

    type CartItemRow = Record<string, unknown>;
    const items = ((existingCart.cart_items as CartItemRow[]) || []).map((item) => ({
      id: item.id,
      productSlug: item.product_slug,
      productName: item.product_name,
      material: item.material,
      colorName: item.color_name,
      colorHex: item.color_hex,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      imageUrl: item.image_url,
    }));

    const itemCount = items.reduce((sum, item) => sum + (item.quantity as number), 0);
    const total = items.reduce((sum, item) => sum + (item.quantity as number) * (item.unitPrice as number), 0);

    return NextResponse.json({
      cart: {
        id: existingCart.id,
        items,
        itemCount,
        total,
      },
    });
  } catch (err) {
    console.error('Cart GET API error:', err);
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
    const { productSlug, productName, material, colorName, colorHex, quantity, unitPrice, imageUrl } = body;

    if (!productSlug || !productName || !quantity || !unitPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create cart
    const { data: existingCart, error: cartError } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (cartError) {
      console.error('Error fetching cart:', cartError);
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    let cartId = existingCart?.id;

    if (!cartId) {
      const { data: newCart, error: createError } = await supabase
        .from('cart')
        .insert({ user_id: user.id })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating cart:', createError);
        return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
      }
      cartId = newCart.id;
    }

    // Check if same product+color already in cart
    const { data: existingItem, error: itemError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_slug', productSlug)
      .eq('color_name', colorName || '')
      .maybeSingle();

    if (itemError) {
      console.error('Error checking existing item:', itemError);
      return NextResponse.json({ error: 'Failed to check existing item' }, { status: 500 });
    }

    if (existingItem) {
      // Update quantity
      const newQuantity = (existingItem.quantity as number) + quantity;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Error updating item:', updateError);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'updated', quantity: newQuantity });
    }

    // Add new item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cartId,
        product_slug: productSlug,
        product_name: productName,
        material,
        color_name: colorName,
        color_hex: colorHex,
        quantity,
        unit_price: unitPrice,
        image_url: imageUrl,
      });

    if (insertError) {
      console.error('Error adding item:', insertError);
      return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: 'added' });
  } catch (err) {
    console.error('Cart POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get cart
    const { data: existingCart, error: cartError } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (cartError || !existingCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Delete all items
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', existingCart.id);

    if (deleteError) {
      console.error('Error clearing cart:', deleteError);
      return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cart DELETE API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}