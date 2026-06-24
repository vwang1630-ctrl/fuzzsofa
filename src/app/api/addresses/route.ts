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

    const { data: addresses, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (err) {
    console.error('Addresses API error:', err);
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
    const { label, firstName, lastName, email, phone, country, addressLine1, addressLine2, city, state, zipCode, isDefault } = body;

    if (!firstName || !lastName || !addressLine1 || !city || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        label: label || 'Home',
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        country: country || 'US',
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        city,
        state: state || null,
        zip_code: zipCode || null,
        is_default: isDefault || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating address:', error);
      return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    console.error('Address creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
