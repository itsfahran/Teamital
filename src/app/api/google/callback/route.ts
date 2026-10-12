import { NextResponse } from 'next/server';
import { STATE_COOKIE, currentAdminEmail, exchangeCode, fetchEmail, saveConnection } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Google redirects here after consent. Stores the refresh token (server side only). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const back = (q: string) => {
    const r = NextResponse.redirect(`${origin}/admin/availability?${q}`);
    r.cookies.delete(STATE_COOKIE);
    return r;
  };

  if (!(await currentAdminEmail())) return NextResponse.redirect(`${origin}/login?next=/admin/availability`);
  if (url.searchParams.get('error')) return back('google=denied');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = req.headers.get('cookie')?.match(new RegExp(`${STATE_COOKIE}=([^;]+)`))?.[1];
  if (!code || !state || !cookieState || state !== cookieState) return back('google=bad_state');

  try {
    const tokens = await exchangeCode(code, origin);
    if (!tokens.refresh_token) return back('google=no_refresh');
    const email = await fetchEmail(tokens.access_token!);
    await saveConnection(tokens.refresh_token, email, tokens.scope);
    return back('google=connected');
  } catch (e) {
    console.error('[google] callback failed:', e);
    return back('google=failed');
  }
}
