import { NextResponse } from 'next/server';
import { currentAdminEmail, deleteEvent, serviceClient } from '@/lib/google';

export const runtime = 'nodejs';

/** Admin: cancel a booking and remove its Google Calendar / Meet event (invitees are notified). */
export async function POST(req: Request) {
  if (!(await currentAdminEmail())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  const { data } = await db.from('meeting_bookings').select('google_event_id').eq('id', id).maybeSingle();
  const { error } = await db.from('meeting_bookings').update({ status: 'cancelled' }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (data?.google_event_id) await deleteEvent(data.google_event_id);
  return NextResponse.json({ ok: true });
}
