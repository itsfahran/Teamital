import { NextResponse } from 'next/server';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';
import { SITE } from '@/lib/config';

export const runtime = 'nodejs';

type Body = { name?: unknown; email?: unknown; company?: unknown; message?: unknown };

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Contact form backend: stores the message in Supabase (`contact_messages`)
 * and, when RESEND_API_KEY is set, emails it to the Teamital inbox.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const company = clean(body.company, 200);
  const message = clean(body.message, 5000);

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!email.includes('@')) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 });
  if (message.length < 8) return NextResponse.json({ error: 'Please write a short message' }, { status: 400 });

  let stored = false;
  if (isSupabaseConfigured()) {
    const { error } = await createPublicSupabase()
      .from('contact_messages')
      .insert({ name, email, company: company || null, message, source: 'web' });
    stored = !error;
    if (error) console.error('[contact] supabase insert failed:', error.message);
  }

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || `Teamital <onboarding@resend.dev>`,
          to: [SITE.contactEmail],
          reply_to: email,
          subject: `Contact from ${name} — Teamital`,
          html:
            `<p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p>` +
            `<p><b>Company:</b> ${esc(company || '-')}</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) console.error('[contact] resend failed:', res.status, await res.text());
    } catch (e) {
      console.error('[contact] resend error:', e);
    }
  }

  if (!stored && !emailed) {
    // Nothing persisted: tell the client so it can fall back to a mailto: link.
    return NextResponse.json({ error: 'Could not send message' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
