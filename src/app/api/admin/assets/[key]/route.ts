import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { deleteFile, listFiles } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { key } = await params;

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Decode the key in case it was URL-encoded
    const decodedKey = decodeURIComponent(key);

    // Verify the file exists before deleting
    const { files } = await listFiles(decodedKey, 1);
    const fileExists = files.some((f) => f.key === decodedKey);

    if (!fileExists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await deleteFile(decodedKey);

    return NextResponse.json({ success: true, key: decodedKey });
  } catch (err) {
    console.error('Admin asset delete API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
