import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getAuthenticatedClient } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (country !== undefined) updateData.country = country;
    if (addressLine1 !== undefined) updateData.address_line1 = addressLine1;
    if (addressLine2 !== undefined) updateData.address_line2 = addressLine2 || null;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state || null;
    if (zipCode !== undefined) updateData.zip_code = zipCode || null;
    if (isDefault !== undefined) updateData.is_default = isDefault;
    updateData.updated_at = new Date().toISOString();

    // If setting as default, unset other defaults first
    if (isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('user_addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (err) {
    console.error('Address update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isDefault } = body;

    if (isDefault) {
      // Unset other defaults
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('user_addresses')
      .update({ is_default: isDefault ?? true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error patching address:', error);
      return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (err) {
    console.error('Address patch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionToken = request.headers.get('x-session');
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting address:', error);
      return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Address delete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
