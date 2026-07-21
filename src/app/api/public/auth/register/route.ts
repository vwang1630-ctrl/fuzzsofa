import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, firstName, lastName } = body;

    // Validate required fields
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    const result = await registerUser({
      email: email || undefined,
      phone: phone || undefined,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });

    // Strip password_hash from user object before returning
    const { password_hash, ...safeUser } = result.user;

    return NextResponse.json({
      user: safeUser,
      token: result.token,
    });
  } catch (error) {
    console.error('POST /api/public/auth/register error:', error);

    // Handle duplicate entry errors
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'An account with this email or phone already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
