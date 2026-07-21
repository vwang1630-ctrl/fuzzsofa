import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    // Validate required fields
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    const result = await loginUser({
      email: email || undefined,
      phone: phone || undefined,
      password,
    });

    if (!result) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Strip password_hash from user object before returning
    const { password_hash, ...safeUser } = result.user;

    return NextResponse.json({
      user: safeUser,
      token: result.token,
    });
  } catch (error) {
    console.error('POST /api/public/auth/login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
