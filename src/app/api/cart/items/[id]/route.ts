import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

export async function PUT(
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
 const { quantity } = body;

 if (!quantity || quantity < 1) {
 return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
 }

 // Verify item belongs to user's cart
 const { data: item, error: itemError } = await supabase
 .from('cart_items')
 .select('id, cart_id, cart(user_id)')
 .eq('id', id)
 .single();

 if (itemError || !item) {
 return NextResponse.json({ error: 'Item not found' }, { status: 404 });
 }

 type ItemWithCart = { id: string; cart_id: string; cart: { user_id: string } | null };
 const itemWithCart = item as unknown as ItemWithCart;
 if (!itemWithCart.cart || itemWithCart.cart.user_id !== user.id) {
 return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
 }

 // Update quantity
 const { error: updateError } = await supabase
 .from('cart_items')
 .update({ quantity })
 .eq('id', id);

 if (updateError) {
 console.error('Error updating quantity:', updateError);
 return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 });
 }

 return NextResponse.json({ success: true, quantity });
 } catch (err) {
 console.error('Cart item API error:', err);
 return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 }
}

export async function DELETE(
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

 // Verify item belongs to user's cart
 const { data: item, error: itemError } = await supabase
 .from('cart_items')
 .select('id, cart_id, cart(user_id)')
 .eq('id', id)
 .single();

 if (itemError || !item) {
 return NextResponse.json({ error: 'Item not found' }, { status: 404 });
 }

 type ItemWithCart = { id: string; cart_id: string; cart: { user_id: string } | null };
 const itemWithCart = item as unknown as ItemWithCart;
 if (!itemWithCart.cart || itemWithCart.cart.user_id !== user.id) {
 return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
 }

 // Delete item
 const { error: deleteError } = await supabase
 .from('cart_items')
 .delete()
 .eq('id', id);

 if (deleteError) {
 console.error('Error deleting item:', deleteError);
 return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
 }

 return NextResponse.json({ success: true });
 } catch (err) {
 console.error('Cart item API error:', err);
 return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 }
}