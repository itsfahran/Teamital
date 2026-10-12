import { NextResponse } from 'next/server';
import { buildIcs, getSettings } from '@/lib/booking';
import { SITE } from '@/lib/config';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Calendar invite (.ics) for a booking, addressed by its secret token. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  if (!UUID.test(token) || !isSupabaseConfigured()) return new NextResponse('Not found', { status: 404 });

  const { data } = await createPublicSupabase().rpc('booking_by_token', { p_token: token });
  const b = (data as Array<{ id: string; start_at: string; end_at: string; status: string }> | null)?.[0];
  if (!b || b.status === 'cancelled') return new NextResponse('Not found', { status: 404 });

  const s = await getSettings();
  const ics = buildIcs({
    uid: b.id,
    start: new Date(b.start_at),
    end: new Date(b.end_at),
    title: 'Teamital: free 1:1 call',
    description: `Call with ${s.host_name}.${s.meeting_link ? `\nJoin: ${s.meeting_link}` : ''}\nQuestions? ${SITE.contactEmail}`,
    location: s.meeting_link,
    organizer: s.host_email || SITE.contactEmail,
  });
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="teamital-call.ics"',
      'Cache-Control': 'no-store',
    },
  });
}
