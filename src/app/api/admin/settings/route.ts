import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/settings
 * 获取所有站点设置
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT id, setting_key, setting_value, setting_type, description, updated_at
       FROM site_settings
       ORDER BY setting_key ASC`
    );

    const settings: Record<string, { value: string; type: string; description: string; updatedAt: string }> = {};
    for (const row of rows) {
      settings[row.setting_key] = {
        value: row.setting_value ?? '',
        type: row.setting_type ?? 'string',
        description: row.description ?? '',
        updatedAt: row.updated_at,
      };
    }

    return NextResponse.json({ settings });
  } catch (err) {
    console.error('Admin settings GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * 批量更新站点设置
 * Body: { settings: { [key]: value, ... } }
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request: settings object is required' },
        { status: 400 }
      );
    }

    const entries = Object.entries(settings) as [string, string][];

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No settings to update' }, { status: 400 });
    }

    // Batch update using individual queries (safe for small number of settings)
    for (const [key, value] of entries) {
      // Validate key format
      if (!/^[a-z_][a-z0-9_]*$/.test(key)) {
        return NextResponse.json(
          { error: `Invalid setting key format: ${key}` },
          { status: 400 }
        );
      }

      await execute(
        `UPDATE site_settings SET setting_value = ? WHERE setting_key = ?`,
        [String(value), key]
      );
    }

    // Fetch updated settings
    const rows = await query<RowDataPacket[]>(
      `SELECT setting_key, setting_value, setting_type, description, updated_at
       FROM site_settings
       ORDER BY setting_key ASC`
    );

    const updatedSettings: Record<string, { value: string; type: string; description: string; updatedAt: string }> = {};
    for (const row of rows) {
      updatedSettings[row.setting_key] = {
        value: row.setting_value ?? '',
        type: row.setting_type ?? 'string',
        description: row.description ?? '',
        updatedAt: row.updated_at,
      };
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (err) {
    console.error('Admin settings PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
