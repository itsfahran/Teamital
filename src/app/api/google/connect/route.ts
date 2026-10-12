import { NextResponse } from 'next/server';
import { STATE_COOKIE, buildAuthUrl, currentAdminEmail, googleConfigured } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Admin only: starts the Google consent flow. */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  if (!(await currentAdminEmail())) return NextResponse.redirect(`${origin}/login?next=/admin/availability`);
  if (!googleConfigured()) return NextResponse.redirect(`${origin}/admin/availability?google=not_configured`);

  const state = crypto.randomUUID();
  const res = NextResponse.redirect(buildAuthUrl(origin, state));
  res.cookies.set(STATE_COOKIE, state, { httpOnly: true, secure: origin.startsWith('https'), sameSite: 'lax', path: '/', maxAge: 600 });
  return res;
}
