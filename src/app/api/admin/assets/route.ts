import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { listFiles, uploadFile, getPublicUrl } from '@/lib/storage';
import crypto from 'crypto';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || undefined;
    const maxKeys = Math.min(1000, Math.max(1, parseInt(searchParams.get('maxKeys') || '100', 10)));

    const { files, isTruncated } = await listFiles(prefix, maxKeys);

    return NextResponse.json({
      files: files.map((f) => ({
        key: f.key,
        url: getPublicUrl(f.key),
        size: f.size,
        lastModified: f.lastModified,
      })),
      isTruncated,
    });
  } catch (err) {
    console.error('Admin assets list API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique key
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const key = folder
      ? `${folder}/${sanitizedBase}_${uniqueId}${ext}`
      : `uploads/${sanitizedBase}_${uniqueId}${ext}`;

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { url, key: storedKey } = await uploadFile({
      key,
      body: buffer,
      contentType: file.type || 'application/octet-stream',
    });

    return NextResponse.json({
      success: true,
      file: {
        key: storedKey,
        url,
        size: file.size,
        contentType: file.type,
        originalName: file.name,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Admin assets upload API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
