import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { query, execute } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/homepage/config
 * 获取首页所有配置（header、sections 等）
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const rows = await query<RowDataPacket[]>(
      `SELECT id, config_key, config_value, description, updated_at
       FROM homepage_config
       ORDER BY config_key ASC`
    );

    const config: Record<string, unknown> = {};
    const meta: Record<string, { description: string; updatedAt: string }> = {};

    for (const row of rows) {
      config[row.config_key] = safeJsonParse(row.config_value);
      meta[row.config_key] = {
        description: row.description ?? '',
        updatedAt: row.updated_at,
      };
    }

    return NextResponse.json({ config, meta });
  } catch (err) {
    console.error('Admin homepage config GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/homepage/config
 * 批量更新首页配置（支持 header、sections 等任意 config_key）
 * Body: { header: { ... }, sections: [ ... ], ... }
 * - 顶层每个 key 即为一个 config_key
 * - 对象/数组类型的值会以 JSON 字符串存储，字符串值原样存储
 * - 不存在的 key 会自动创建（upsert）
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid request: body must be an object of config key/value pairs' },
        { status: 400 }
      );
    }

    const entries = Object.entries(body) as [string, unknown][];

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No config to update' }, { status: 400 });
    }

    // Validate all keys before writing anything
    for (const [key] of entries) {
      if (!/^[a-z_][a-z0-9_]*$/.test(key)) {
        return NextResponse.json(
          { error: `Invalid config key format: ${key}` },
          { status: 400 }
        );
      }
    }

    for (const [key, value] of entries) {
      const storedValue =
        typeof value === 'string' ? value : JSON.stringify(value ?? null);

      await execute(
        `INSERT INTO homepage_config (config_key, config_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
        [key, storedValue]
      );
    }

    // Fetch updated config
    const rows = await query<RowDataPacket[]>(
      `SELECT id, config_key, config_value, description, updated_at
       FROM homepage_config
       ORDER BY config_key ASC`
    );

    const config: Record<string, unknown> = {};
    for (const row of rows) {
      config[row.config_key] = safeJsonParse(row.config_value);
    }

    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error('Admin homepage config PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeJsonParse(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value ?? null;
}
