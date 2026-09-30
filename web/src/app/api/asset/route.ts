import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { resolveAsset } from '@/lib/store';

/**
 * Serves a slide image that lives outside web/public (the factory writes to
 * <repo>/output). Only files inside the repo are reachable: resolveAsset
 * throws on traversal, and unknown extensions are refused.
 */

const CONTENT_TYPE: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export async function GET(request: Request): Promise<Response> {
  const relative = new URL(request.url).searchParams.get('path');
  if (!relative) {
    return NextResponse.json({ error: 'missing path' }, { status: 400 });
  }

  const contentType = CONTENT_TYPE[path.extname(relative).toLowerCase()];
  if (!contentType) {
    return NextResponse.json({ error: 'unsupported asset type' }, { status: 415 });
  }

  let absolute: string;
  try {
    absolute = resolveAsset(relative);
  } catch {
    return NextResponse.json({ error: 'path outside the repo' }, { status: 403 });
  }

  try {
    const file = await readFile(/* turbopackIgnore: true */ absolute);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (cause) {
    const err = cause as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: `asset not found: ${relative}` }, { status: 404 });
    }
    throw cause;
  }
}
