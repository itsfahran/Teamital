import { NextResponse } from 'next/server';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** GET ?token= -> booking summary (no sensitive data) for the manage page. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  if (!UUID.test(token) || !isSupabaseConfigured()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { data } = await createPublicSupabase().rpc('booking_by_token', { p_token: token });
  const b = (data as Array<Record<string, unknown>> | null)?.[0];
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ name: b.name, topic: b.topic, start: b.start_at, end: b.end_at, status: b.status, tz: b.visitor_tz });
}

/** POST { token } -> cancel the booking. */
export async function POST(req: Request) {
  let token = '';
  try {
    token = String(((await req.json()) as { token?: string }).token ?? '');
  } catch {
    /* ignore */
  }
  if (!UUID.test(token) || !isSupabaseConfigured()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { data, error } = await createPublicSupabase().rpc('cancel_booking', { p_token: token });
  if (error) return NextResponse.json({ error: 'Could not cancel.' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'This booking can no longer be cancelled.' }, { status: 409 });
  return NextResponse.json({ ok: true });
}
