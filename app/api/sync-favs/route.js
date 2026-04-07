// app/api/sync-favs/route.js
// Server route that reads + writes the current user's favorites and wishlist
// to Clerk's user.publicMetadata. Public metadata is server-writable only,
// which means we can trust the values clients can read but not modify directly.
//
// Endpoints:
//   GET  /api/sync-favs   → returns { favs, wishlist } for the signed-in user
//   POST /api/sync-favs   → body { favs?, wishlist? } merges into the user's metadata
//
// All requests require an authenticated session; otherwise 401.

import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

// These routes are dynamic by definition (read auth state).
export const dynamic = 'force-dynamic';

function sanitizeList(list) {
  if (!Array.isArray(list)) return [];
  // Defensive cleanup: keep only the fields we care about, drop anything weird
  return list
    .filter((x) => x && typeof x === 'object' && typeof x.slug === 'string')
    .map((x) => ({
      slug: String(x.slug).slice(0, 200),
      name: typeof x.name === 'string' ? x.name.slice(0, 200) : '',
      city: typeof x.city === 'string' ? x.city.slice(0, 200) : '',
      country: typeof x.country === 'string' ? x.country.slice(0, 200) : '',
      tag: typeof x.tag === 'string' ? x.tag.slice(0, 300) : '',
      addedAt: typeof x.addedAt === 'number' ? x.addedAt : Date.now(),
    }))
    .slice(0, 500); // hard cap to keep metadata under Clerk's 8KB limit
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = user.publicMetadata || {};
  return NextResponse.json({
    favs: Array.isArray(meta.favs) ? meta.favs : [],
    wishlist: Array.isArray(meta.wishlist) ? meta.wishlist : [],
  });
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = user.publicMetadata || {};

  const next = { ...meta };
  if (body.favs !== undefined) next.favs = sanitizeList(body.favs);
  if (body.wishlist !== undefined) next.wishlist = sanitizeList(body.wishlist);

  await client.users.updateUserMetadata(userId, { publicMetadata: next });

  return NextResponse.json({
    favs: next.favs || [],
    wishlist: next.wishlist || [],
  });
}
