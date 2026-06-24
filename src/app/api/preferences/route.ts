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

    const { data: prefs, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }

    return NextResponse.json({ preferences: prefs || { default_payment_method: 'creditcard', preferred_shipping_method: 'standard' } });
  } catch (err) {
    console.error('Preferences API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { defaultPaymentMethod, preferredShippingMethod } = body;

    // Upsert: insert or update
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let result;
    if (existing) {
      const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
      if (defaultPaymentMethod) updateData.default_payment_method = defaultPaymentMethod;
      if (preferredShippingMethod) updateData.preferred_shipping_method = preferredShippingMethod;

      result = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      const insertData: Record<string, string> = {
        user_id: user.id,
        default_payment_method: defaultPaymentMethod || 'creditcard',
        preferred_shipping_method: preferredShippingMethod || 'standard',
      };

      result = await supabase
        .from('user_preferences')
        .insert(insertData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving preferences:', result.error);
      return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
    }

    return NextResponse.json({ preferences: result.data });
  } catch (err) {
    console.error('Preferences API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
