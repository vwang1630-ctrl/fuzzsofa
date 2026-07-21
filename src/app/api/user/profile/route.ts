import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';

interface UserRow {
  id: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// GET: 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error('User profile GET API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = await getUserFromSession(sessionToken);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, avatarUrl } = body;

    // 构建动态更新字段
    const updates: string[] = [];
    const params: unknown[] = [];

    if (firstName !== undefined) {
      updates.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push('last_name = ?');
      params.push(lastName);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (avatarUrl !== undefined) {
      updates.push('avatar_url = ?');
      params.push(avatarUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push('updated_at = NOW()');
    params.push(sessionUser.id);

    const { affectedRows } = await execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (affectedRows === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 返回更新后的用户信息
    const updatedUser = await queryOne<UserRow>(
      'SELECT * FROM users WHERE id = ?',
      [sessionUser.id]
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        avatarUrl: updatedUser.avatar_url,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (err) {
    console.error('User profile PUT API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
