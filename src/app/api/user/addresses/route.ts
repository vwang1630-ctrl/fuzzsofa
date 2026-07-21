import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { query, queryOne, execute, executeInsert } from '@/lib/db';

interface AddressRow {
  id: number;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  country: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  is_default: boolean;
  created_at: Date;
}

// GET: 获取地址列表
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

    const addresses = await query<AddressRow[]>(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [user.id]
    );

    return NextResponse.json({
      addresses: addresses.map((addr) => ({
        id: addr.id,
        label: addr.label,
        firstName: addr.first_name,
        lastName: addr.last_name,
        email: addr.email,
        phone: addr.phone,
        country: addr.country,
        addressLine1: addr.address_line1,
        addressLine2: addr.address_line2,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zip_code,
        isDefault: Boolean(addr.is_default),
        createdAt: addr.created_at,
      })),
    });
  } catch (err) {
    console.error('User addresses GET API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 添加地址
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('x-session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      label,
      firstName,
      lastName,
      email,
      phone,
      country,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      isDefault,
    } = body;

    // 校验必填字段
    if (!firstName || !lastName || !addressLine1 || !city || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 如果设为默认地址，先取消其他默认
    if (isDefault) {
      await execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND is_default = TRUE',
        [user.id]
      );
    }

    // 插入新地址
    const result = await executeInsert(
      `INSERT INTO user_addresses (user_id, label, first_name, last_name, email, phone, country, address_line1, address_line2, city, state, zip_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        label || 'Home',
        firstName,
        lastName,
        email || null,
        phone || null,
        country || 'US',
        addressLine1,
        addressLine2 || null,
        city,
        state || null,
        zipCode || null,
        isDefault || false,
      ]
    );

    // 查询新插入的地址
    const addresses = await query<AddressRow[]>('SELECT * FROM user_addresses WHERE id = ?', [result.insertId]);

    const addr = addresses[0];

    return NextResponse.json({
      address: addr ? {
        id: addr.id,
        label: addr.label,
        firstName: addr.first_name,
        lastName: addr.last_name,
        email: addr.email,
        phone: addr.phone,
        country: addr.country,
        addressLine1: addr.address_line1,
        addressLine2: addr.address_line2,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zip_code,
        isDefault: Boolean(addr.is_default),
        createdAt: addr.created_at,
      } : null,
    }, { status: 201 });
  } catch (err) {
    console.error('User addresses POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
