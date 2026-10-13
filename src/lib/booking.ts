import { SITE } from './config';
import { sendGmail } from './google';
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

export { TOPICS, TEAM_SIZES, DURATIONS } from './booking-constants';

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
    const merged = { ...DEFAULT_SETTINGS, ...(data as Partial<BookingSettings>) };
    // Only a real http(s) URL is a usable meeting link (ignore anything else, e.g. a pasted email).
    if (merged.meeting_link && !/^https?:\/\/\S+$/i.test(merged.meeting_link.trim())) merged.meeting_link = null;
    return merged;
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
  if (!key) return sendGmail(to, subject, html, replyTo);
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
    if (res.ok) return true;
    console.error('[booking] resend failed', res.status, await res.text());
  } catch (e) {
    console.error('[booking] resend error', e);
  }
  return sendGmail(to, subject, html, replyTo);
}

/* ───────────── email templates (table layout + inline styles for Gmail/Outlook) ───────────── */

const BLUE = '#1a56db';
const FONT = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function shell(opts: { preheader: string; title: string; intro: string; body: string }) {
  const logo = `${SITE.publicSiteUrl}/brand-logo.png`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f1f5fb">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5fb;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;font-family:${FONT}">
  <tr><td align="center" style="padding:0 0 18px"><a href="${SITE.publicSiteUrl}" style="text-decoration:none"><img src="${logo}" width="240" alt="Teamital" style="display:block;border:0;height:auto;width:240px;max-width:100%"></a></td></tr>
  <tr><td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(26,86,219,.12)">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:${BLUE};background-image:linear-gradient(135deg,#1a56db 0%,#2563eb 55%,#0ea5e9 100%);padding:34px 36px 30px">
        <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#bfdbfe;font-weight:700">Teamital</div>
        <div style="font-size:26px;line-height:1.25;color:#ffffff;font-weight:800;margin-top:8px">${opts.title}</div>
        <div style="font-size:15px;line-height:1.6;color:#dbeafe;margin-top:10px">${opts.intro}</div>
      </td></tr>
      <tr><td style="padding:30px 36px 34px;color:#111827;font-size:15px;line-height:1.65">${opts.body}</td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:22px 12px 0;font-size:12px;line-height:1.7;color:#6b7280">
    <b style="color:#374151">Teamital</b> · Complete workforce intelligence in one place<br>
    Kandoy House, 2 Fairview Strand, Dublin D03 R8P3, Ireland<br>
    <a href="mailto:${SITE.contactEmail}" style="color:${BLUE};text-decoration:none">${SITE.contactEmail}</a> · <a href="${SITE.publicSiteUrl}" style="color:${BLUE};text-decoration:none">teamital.com</a>
  </td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string, primary = true) =>
  `<a href="${esc(href)}" style="display:inline-block;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;padding:14px 26px;${
    primary ? `background:${BLUE};color:#ffffff;` : `background:#eff6ff;color:${BLUE};border:1px solid #bfdbfe;`
  }">${label}</a>`;

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:9px 0;width:120px;color:#6b7280;font-size:13px;vertical-align:top;border-bottom:1px solid #eef2f7">${label}</td><td style="padding:9px 0;font-size:14px;font-weight:600;color:#111827;border-bottom:1px solid #eef2f7">${value}</td></tr>`;

const card = (inner: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5eaf3;border-radius:14px;margin:0 0 22px"><tr><td style="padding:8px 20px">${inner}</td></tr></table>`;

const linkBox = (link: string) =>
  `<div style="margin:16px 0 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Meeting link (copy &amp; paste)</div>
<div style="margin-top:6px;background:#f3f6fb;border:1px dashed #93b4f3;border-radius:10px;padding:12px 14px;font-size:14px;word-break:break-all"><a href="${esc(link)}" style="color:${BLUE};text-decoration:none;font-weight:600">${esc(link)}</a></div>`;

export function confirmationEmail(opts: { name: string; when: string; link: string | null; manageUrl: string; icsUrl: string; host: string; duration?: number }) {
  return shell({
    preheader: `Your call is booked for ${opts.when}`,
    title: 'Your call is booked ✓',
    intro: `Hi ${esc(opts.name)}, thanks for booking a free 1:1 call with ${esc(opts.host)}. Here is everything you need.`,
    body: `${card(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRow('When', esc(opts.when))}${opts.duration ? detailRow('Length', `${opts.duration} minutes`) : ''}${detailRow('With', esc(opts.host))}<tr><td style="padding:9px 0;color:#6b7280;font-size:13px">Where</td><td style="padding:9px 0;font-size:14px;font-weight:600;color:#111827">${opts.link ? 'Google Meet (online)' : 'Online · details to follow'}</td></tr></table>`,
    )}
${
  opts.link
    ? `<div style="text-align:center;margin:6px 0 4px">${button(opts.link, 'Join Google Meet')}</div>${linkBox(opts.link)}`
    : '<p style="margin:0;color:#4b5563">We will send the meeting details before the call.</p>'
}
<div style="text-align:center;margin:26px 0 0">${button(opts.icsUrl, 'Add to calendar', false)}</div>
<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #eef2f7;font-size:13px;color:#6b7280;text-align:center">Plans changed? <a href="${esc(opts.manageUrl)}" style="color:${BLUE};text-decoration:none;font-weight:600">Cancel this booking</a>. Questions? Just reply to this email.</p>`,
  });
}

export function notifyEmail(opts: { name: string; email: string; phone?: string; company?: string; teamSize?: string; topic?: string; message?: string; when: string; link?: string | null; duration?: number }) {
  const row = (k: string, v?: string) => (v ? detailRow(k, esc(v)) : '');
  return shell({
    preheader: `${opts.name} booked a call: ${opts.when}`,
    title: 'New call booked',
    intro: `<b style="color:#fff">${esc(opts.name)}</b> just booked a free 1:1 call.`,
    body: `${card(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('When', opts.when)}${opts.duration ? row('Length', `${opts.duration} minutes`) : ''}${row('Name', opts.name)}${detailRow('Email', `<a href="mailto:${esc(opts.email)}" style="color:${BLUE};text-decoration:none">${esc(opts.email)}</a>`)}${row('Phone', opts.phone)}${row('Company', opts.company)}${row('Team size', opts.teamSize)}${row('Topic', opts.topic)}</table>`,
    )}
${opts.message ? `<div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Message</div><div style="margin:6px 0 22px;white-space:pre-wrap;background:#f8fafc;border:1px solid #e5eaf3;border-radius:12px;padding:14px 16px;font-size:14px">${esc(opts.message)}</div>` : ''}
${opts.link ? `<div style="text-align:center">${button(opts.link, 'Open Google Meet')}</div>${linkBox(opts.link)}` : ''}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280;text-align:center">Reply to this email to reach ${esc(opts.name)} directly.</p>`,
  });
}
