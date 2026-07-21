import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromSession, type User } from '@/lib/auth';

/**
 * Admin authentication middleware.
 * Returns the admin user if authenticated, or a NextResponse error if not.
 *
 * Usage:
 *   const auth = await requireAdmin(request);
 *   if ('error' in auth) return auth.error;
 *   // auth.admin is the admin User
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ admin: User } | { error: NextResponse }> {
  // Block admin APIs in production
  if (process.env.COZE_PROJECT_ENV === 'PROD') {
    return {
      error: NextResponse.json(
        { error: 'Admin APIs are disabled in production' },
        { status: 403 }
      ),
    };
  }

  const sessionToken = request.headers.get('x-session');
  if (!sessionToken) {
    return {
      error: NextResponse.json({ error: 'Missing x-session header' }, { status: 401 }),
    };
  }

  const admin = await getAdminFromSession(sessionToken);
  if (!admin) {
    return {
      error: NextResponse.json({ error: 'Unauthorized: admin access required' }, { status: 403 }),
    };
  }

  return { admin };
}
