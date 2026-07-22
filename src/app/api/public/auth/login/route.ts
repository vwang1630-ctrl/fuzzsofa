import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    // Validate required fields
    if (!password) {
      return NextResponse.json({ error: '密码不能为空' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: '请输入邮箱或手机号' }, { status: 400 });
    }

    const result = await loginUser({
      email: email || undefined,
      phone: phone || undefined,
      password,
    });

    if (!result) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    // Strip password_hash from user object before returning
    const { password_hash, ...safeUser } = result.user;

    return NextResponse.json({
      user: safeUser,
      token: result.token,
    });
  } catch (error) {
    console.error('POST /api/public/auth/login error:', error);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
