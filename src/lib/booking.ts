import { createPublicSupabase } from './supabase/server';

export type BookingSettings = {
  is_enabled: boolean;
  timezone: string;
  weekdays: number[];
  start_time: string;
  end_time: string;
  slot_minutes: number;
  buffer_minutes: number;
  min_notice_hours: number;
  max_days_ahead: number;
  meeting_link: string | null;
  host_name: string;
  host_email: string | null;
};

export const DEFAULT_SETTINGS: BookingSettings = {
  is_enabled: true,
  timezone: 'Europe/Dublin',
  weekdays: [1, 2, 3, 4, 5],
  start_time: '09:00:00',
  end_time: '17:00:00',
  slot_minutes: 30,
  buffer_minutes: 0,
  min_notice_hours: 12,
  max_days_ahead: 45,
  meeting_link: null,
  host_name: 'Teamital Team',
  host_email: null,
};

export { TOPICS, TEAM_SIZES } from './booking-constants';

/* ───────────── time-zone maths (no external library) ───────────── */

function offsetMinutes(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const p: Record<string, string> = {};
  for (const x of parts) p[x.type] = x.value;
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return (asUtc - utcMs) / 60000;
}

/** Wall-clock time in `tz` -> UTC milliseconds. */
export function zonedToUtc(y: number, m: number, d: number, h: number, min: number, tz: string): number {
  const guess = Date.UTC(y, m - 1, d, h, min);
  const off = offsetMinutes(guess, tz);
  let utc = guess - off * 60000;
  const off2 = offsetMinutes(utc, tz);
  if (off2 !== off) utc = guess - off2 * 60000;
  return utc;
}

function todayIn(tz: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const p: Record<string, string> = {};
  for (const x of parts) p[x.type] = x.value;
  return { y: +p.year, m: +p.month, d: +p.day };
}

const hm = (t: string): [number, number] => {
  const [h, m] = t.split(':');
  return [parseInt(h, 10) || 0, parseInt(m, 10) || 0];
};

/* ───────────── data access ───────────── */

export async function getSettings(): Promise<BookingSettings> {
  try {
    const { data } = await createPublicSupabase().from('booking_settings').select('*').eq('id', 1).maybeSingle();
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(data as Partial<BookingSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Every bookable slot start (ISO, UTC) in the booking window, minus anything already taken. */
export async function getAvailableSlots(settings?: BookingSettings): Promise<{ settings: BookingSettings; slots: string[] }> {
  const s = settings ?? (await getSettings());
  if (!s.is_enabled) return { settings: s, slots: [] };

  const now = Date.now();
  const earliest = now + s.min_notice_hours * 3600_000;
  const t = todayIn(s.timezone);
  const [sh, sm] = hm(s.start_time);
  const [eh, em] = hm(s.end_time);
  const step = s.slot_minutes + s.buffer_minutes;

  const all: number[] = [];
  for (let i = 0; i <= s.max_days_ahead; i++) {
    const day = new Date(Date.UTC(t.y, t.m - 1, t.d + i));
    const y = day.getUTCFullYear();
    const m = day.getUTCMonth() + 1;
    const d = day.getUTCDate();
    if (!s.weekdays.includes(day.getUTCDay())) continue;
    const dayStart = zonedToUtc(y, m, d, sh, sm, s.timezone);
    const dayEnd = zonedToUtc(y, m, d, eh, em, s.timezone);
    for (let ts = dayStart; ts + s.slot_minutes * 60_000 <= dayEnd; ts += step * 60_000) {
      if (ts >= earliest) all.push(ts);
    }
  }
  if (all.length === 0) return { settings: s, slots: [] };

  let taken = new Set<number>();
  try {
    const { data } = await createPublicSupabase().rpc('booked_slots', {
      p_from: new Date(all[0]).toISOString(),
      p_to: new Date(all[all.length - 1] + 60_000).toISOString(),
    });
    taken = new Set((data as Array<{ start_at: string }> | null)?.map((r) => new Date(r.start_at).getTime()) ?? []);
  } catch {
    // If the lookup fails we still show slots; the unique index prevents double booking.
  }
  return { settings: s, slots: all.filter((ts) => !taken.has(ts)).map((ts) => new Date(ts).toISOString()) };
}

/* ───────────── calendar invite ───────────── */

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export function buildIcs(opts: { uid: string; start: Date; end: Date; title: string; description: string; location?: string | null; organizer?: string | null }): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Teamital//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@teamital.com`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(opts.start)}`,
    `DTEND:${icsDate(opts.end)}`,
    `SUMMARY:${icsEscape(opts.title)}`,
    `DESCRIPTION:${icsEscape(opts.description)}`,
    ...(opts.location ? [`LOCATION:${icsEscape(opts.location)}`] : []),
    ...(opts.organizer ? [`ORGANIZER;CN=Teamital:mailto:${opts.organizer}`] : []),
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Teamital call starts in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

/* ───────────── email (Resend, optional) ───────────── */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function fmtWhen(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

export async function sendEmail(to: string[], subject: string, html: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Teamital <onboarding@resend.dev>',
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) console.error('[booking] resend failed', res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error('[booking] resend error', e);
    return false;
  }
}

const shell = (body: string) => `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
<div style="border:1px solid #e5e7eb;border-radius:16px;padding:28px">${body}</div>
<p style="font-size:12px;color:#6b7280;text-align:center;margin-top:16px">Teamital · Kandoy House, 2 Fairview Strand, Dublin D03 R8P3, Ireland</p></div>`;

export function confirmationEmail(opts: { name: string; when: string; link: string | null; manageUrl: string; icsUrl: string; host: string }) {
  return shell(`<h2 style="margin:0 0 8px;font-size:22px">Your call is booked</h2>
<p style="color:#4b5563;line-height:1.6">Hi ${esc(opts.name)}, thanks for booking a free 1:1 call with ${esc(opts.host)}.</p>
<div style="background:#eff6ff;border-radius:12px;padding:16px;margin:18px 0"><b style="color:#1a56db">${esc(opts.when)}</b></div>
${opts.link ? `<p><a href="${esc(opts.link)}" style="display:inline-block;background:#1a56db;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700">Join the meeting</a></p>` : '<p style="color:#4b5563">We will send the meeting details before the call.</p>'}
<p style="margin-top:18px;font-size:14px"><a href="${esc(opts.icsUrl)}" style="color:#1a56db">Add to calendar</a> · <a href="${esc(opts.manageUrl)}" style="color:#1a56db">Cancel this booking</a></p>`);
}

export function notifyEmail(opts: { name: string; email: string; phone?: string; company?: string; teamSize?: string; topic?: string; message?: string; when: string }) {
  const row = (k: string, v?: string) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>` : '');
  return shell(`<h2 style="margin:0 0 8px;font-size:20px">New call booked</h2>
<table style="font-size:14px;border-collapse:collapse">${row('When', opts.when)}${row('Name', opts.name)}${row('Email', opts.email)}${row('Phone', opts.phone)}${row('Company', opts.company)}${row('Team size', opts.teamSize)}${row('Topic', opts.topic)}</table>
${opts.message ? `<p style="margin-top:14px;white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:10px">${esc(opts.message)}</p>` : ''}`);
}
