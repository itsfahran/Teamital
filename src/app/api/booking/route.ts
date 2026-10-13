import { NextResponse, after } from 'next/server';
import { SITE } from '@/lib/config';
import {
  DURATIONS,
  TEAM_SIZES,
  TOPICS,
  confirmationEmail,
  fmtWhen,
  getAvailableSlots,
  notifyEmail,
  sendEmail,
} from '@/lib/booking';
import { createMeetEvent, serviceClient } from '@/lib/google';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type Body = Record<string, unknown>;
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Book a slot: validates it is still free, stores it, emails the visitor and the team. */
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Booking is not available right now.' }, { status: 503 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const phone = clean(body.phone, 40);
  const company = clean(body.company, 200);
  const message = clean(body.message, 3000);
  const visitorTz = clean(body.timezone, 80);
  const startIso = clean(body.start, 40);
  const topic = TOPICS.includes(body.topic as (typeof TOPICS)[number]) ? (body.topic as string) : '';
  const teamSize = TEAM_SIZES.includes(body.teamSize as (typeof TEAM_SIZES)[number]) ? (body.teamSize as string) : '';

  if (!name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  const duration = DURATIONS.find((d) => d === Number(body.duration)) ?? 30;
  const startMs = Date.parse(startIso);
  if (!Number.isFinite(startMs)) return NextResponse.json({ error: 'Please choose a time.' }, { status: 400 });

  // The slot must be one the server would offer (right hours, not taken, enough notice).
  const { settings, slots } = await getAvailableSlots();
  if (!settings.is_enabled) return NextResponse.json({ error: 'Booking is currently closed.' }, { status: 409 });
  const startKey = new Date(startMs).toISOString();
  if (!slots.includes(startKey)) {
    return NextResponse.json({ error: 'That time is no longer available. Please pick another.', code: 'slot_taken' }, { status: 409 });
  }
  const endMs = startMs + Math.min(duration, settings.slot_minutes) * 60_000;

  const db = createPublicSupabase();
  const token = crypto.randomUUID();
  const { error } = await db.from('meeting_bookings').insert({
    cancel_token: token,
    name,
    email,
    phone: phone || null,
    company: company || null,
    team_size: teamSize || null,
    topic: topic || null,
    message: message || null,
    start_at: new Date(startMs).toISOString(),
    end_at: new Date(endMs).toISOString(),
    visitor_tz: visitorTz || null,
    status: 'confirmed',
    source: 'web',
  });
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Someone just booked that time. Please pick another.', code: 'slot_taken' }, { status: 409 });
    }
    console.error('[booking] insert failed:', error.message);
    return NextResponse.json({ error: 'We could not save your booking. Please try again.' }, { status: 500 });
  }

  // Google Calendar + Meet (when connected). Google emails the invitation to the visitor and the host.
  let meetLink = settings.meeting_link;
  const ev = await createMeetEvent({
    start: new Date(startMs),
    end: new Date(endMs),
    summary: `Teamital call (${duration} min): ${name}${company ? ` (${company})` : ''}`,
    description: [
      `Free 1:1 call booked on teamital.com`,
      topic && `Topic: ${topic}`,
      company && `Company: ${company}`,
      teamSize && `Team size: ${teamSize}`,
      phone && `Phone: ${phone}`,
      message && `\nMessage:\n${message}`,
    ]
      .filter(Boolean)
      .join('\n'),
    attendees: [email],
    requestId: token,
  });
  if (ev) {
    if (ev.meetLink) meetLink = ev.meetLink;
    const svc = serviceClient();
    if (svc) await svc.from('meeting_bookings').update({ meet_link: ev.meetLink || null, google_event_id: ev.eventId }).eq('cancel_token', token);
  }

  // Emails (best effort: never fail the booking because of email).
  const origin = SITE.publicSiteUrl;
  const manageUrl = `${origin}/book-a-call/manage?token=${token}`;
  const icsUrl = `${origin}/api/booking/ics?token=${token}`;
  const visitorWhen = fmtWhen(startKey, visitorTz || settings.timezone);
  const teamWhen = fmtWhen(startKey, settings.timezone);
  // `after` keeps the function alive until the emails are sent (important on serverless hosts).
  after(async () => {
    await Promise.allSettled([
      sendEmail(
        [email],
        `Your Teamital call is booked: ${visitorWhen}`,
        confirmationEmail({ name, when: visitorWhen, link: meetLink, manageUrl, icsUrl, host: settings.host_name }),
        settings.host_email || SITE.contactEmail,
      ),
      sendEmail(
        [settings.host_email || SITE.contactEmail],
        `New call booked: ${name} (${teamWhen})`,
        notifyEmail({ name, email, phone, company, teamSize, topic, message, when: teamWhen, link: meetLink }),
        email,
      ),
    ]);
  });

  return NextResponse.json({
    ok: true,
    token,
    start: startKey,
    end: new Date(endMs).toISOString(),
    meetingLink: meetLink,
    googleInvite: Boolean(ev),
  });
}
