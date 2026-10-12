import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerSupabase } from './supabase/server';

/** Endpoints are overridable so the integration can be tested against a local mock. */
const OAUTH_AUTH = process.env.GOOGLE_AUTH_URL || 'https://accounts.google.com/o/oauth2/v2/auth';
const OAUTH_TOKEN = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const CAL_BASE = process.env.GOOGLE_CALENDAR_BASE || 'https://www.googleapis.com/calendar/v3';
const USERINFO = process.env.GOOGLE_USERINFO_URL || 'https://openidconnect.googleapis.com/v1/userinfo';
const GMAIL_BASE = process.env.GOOGLE_GMAIL_BASE || 'https://gmail.googleapis.com/gmail/v1';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.send', // lets confirmation emails go out from the connected Gmail account
  'openid',
  'email',
];
export const STATE_COOKIE = 'g_oauth_state';

/** OAuth client present, plus a way to keep the token (service key) or a token supplied via env. */
export const googleConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.GOOGLE_REFRESH_TOKEN));

/** Privileged client (service role). Server only: never import from client components. */
export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Resolves to the signed-in admin's email, or null. */
export async function currentAdminEmail(): Promise<string | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  return data ? (user.email ?? '') : null;
}

export function redirectUri(origin: string) {
  return `${origin}/api/google/callback`;
}

export function buildAuthUrl(origin: string, state: string) {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(origin),
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent', // always return a refresh token
    include_granted_scopes: 'true',
    state,
  });
  return `${OAUTH_AUTH}?${p.toString()}`;
}

export async function exchangeCode(code: string, origin: string) {
  const res = await fetch(OAUTH_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(origin),
      grant_type: 'authorization_code',
    }),
  });
  const data = (await res.json()) as { access_token?: string; refresh_token?: string; scope?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'Token exchange failed');
  return data;
}

export async function fetchEmail(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(USERINFO, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) return null;
    return ((await res.json()) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

export async function saveConnection(refreshToken: string, email: string | null, scope: string | undefined) {
  const db = serviceClient();
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  const { error } = await db.from('google_connection').upsert({
    id: 1,
    email,
    refresh_token: refreshToken,
    scope: scope ?? null,
    connected_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function getConnectionStatus(): Promise<{ connected: boolean; email: string | null; connectedAt: string | null }> {
  const db = serviceClient();
  if (!db) return { connected: false, email: null, connectedAt: null };
  const { data } = await db.from('google_connection').select('email,connected_at').eq('id', 1).maybeSingle();
  return data ? { connected: true, email: data.email, connectedAt: data.connected_at } : { connected: false, email: null, connectedAt: null };
}

export async function disconnect() {
  const db = serviceClient();
  if (!db) return;
  const { data } = await db.from('google_connection').select('refresh_token').eq('id', 1).maybeSingle();
  if (data?.refresh_token) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(data.refresh_token)}`, { method: 'POST' });
    } catch {
      /* best effort */
    }
  }
  await db.from('google_connection').delete().eq('id', 1);
}

async function storedRefreshToken(): Promise<string | null> {
  if (process.env.GOOGLE_REFRESH_TOKEN) return process.env.GOOGLE_REFRESH_TOKEN;
  const db = serviceClient();
  if (!db) return null;
  const { data } = await db.from('google_connection').select('refresh_token').eq('id', 1).maybeSingle();
  return data?.refresh_token ?? null;
}

async function accessToken(): Promise<string | null> {
  if (!googleConfigured()) return null;
  const refresh = await storedRefreshToken();
  if (!refresh) return null;
  const res = await fetch(OAUTH_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refresh,
      grant_type: 'refresh_token',
    }),
  });
  const j = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !j.access_token) {
    console.error('[google] refresh failed:', j.error);
    return null;
  }
  return j.access_token;
}

export type MeetEvent = { eventId: string; meetLink: string };

/** Creates a calendar event with a Google Meet link; Google emails the invitation to the attendees. */
export async function createMeetEvent(opts: {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  attendees: string[];
  requestId: string;
}): Promise<MeetEvent | null> {
  const token = await accessToken();
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  try {
    const res = await fetch(`${CAL_BASE}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        summary: opts.summary,
        description: opts.description,
        start: { dateTime: opts.start.toISOString() },
        end: { dateTime: opts.end.toISOString() },
        attendees: opts.attendees.map((email) => ({ email })),
        conferenceData: {
          createRequest: { requestId: opts.requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }, { method: 'email', minutes: 60 }] },
      }),
    });
    if (!res.ok) {
      console.error('[google] create event failed:', res.status, await res.text());
      return null;
    }
    let ev = (await res.json()) as { id: string; hangoutLink?: string };
    // Conference creation can complete a moment after the insert returns.
    for (let i = 0; i < 4 && !ev.hangoutLink; i++) {
      await new Promise((r) => setTimeout(r, 700));
      const again = await fetch(`${CAL_BASE}/calendars/primary/events/${ev.id}`, { headers });
      if (again.ok) ev = (await again.json()) as typeof ev;
    }
    return ev.hangoutLink ? { eventId: ev.id, meetLink: ev.hangoutLink } : { eventId: ev.id, meetLink: '' };
  } catch (e) {
    console.error('[google] create event error:', e);
    return null;
  }
}

/** Removes the event (Google notifies the attendees of the cancellation). */
export async function deleteEvent(eventId: string): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;
  try {
    const res = await fetch(`${CAL_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}?sendUpdates=all`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok || res.status === 404 || res.status === 410;
  } catch {
    return false;
  }
}

const b64url = (s: string | Buffer) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const mimeWord = (s: string) => `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;

/** Sends an HTML email from the connected Google account (Gmail API). Returns false when unavailable. */
export async function sendGmail(to: string[], subject: string, html: string, replyTo?: string): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;
  const raw = [
    `To: ${to.join(', ')}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    `Subject: ${mimeWord(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n'),
  ].join('\r\n');
  try {
    const res = await fetch(`${GMAIL_BASE}/users/me/messages/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: b64url(raw) }),
    });
    if (!res.ok) console.error('[google] gmail send failed:', res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (e) {
    console.error('[google] gmail send error:', e);
    return false;
  }
}

export async function readStateCookie() {
  return (await cookies()).get(STATE_COOKIE)?.value ?? null;
}
