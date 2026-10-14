import { NextResponse, after } from 'next/server';
import { sendLeadEmail } from '@/lib/leads';
import { serviceClient } from '@/lib/google';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Lead form backend: saves the lead (Supabase `leads`) and emails it to the team.
 * The email is sent after the response so the visitor never waits on it.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(body.website, 100)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const phone = clean(body.phone, 60);
  const company = clean(body.company, 200);
  const message = clean(body.message, 5000);
  const pagePath = clean(body.pagePath, 300);
  const formName = clean(body.formName, 120);

  if (!name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Forms are not available right now.' }, { status: 503 });

  const lead = { name, email, phone: phone || null, company: company || null, message: message || null, page_path: pagePath || null, form_name: formName || null };

  // Prefer the service client so we can read the new row's id back; fall back to the public insert.
  const svc = serviceClient();
  let id: string | undefined;
  if (svc) {
    const { data, error } = await svc.from('leads').insert(lead).select('id').single();
    if (error) {
      console.error('[leads] insert failed:', error.message);
      return NextResponse.json({ error: 'We could not save your details. Please try again.' }, { status: 500 });
    }
    id = data.id as string;
  } else {
    const { error } = await createPublicSupabase().from('leads').insert(lead);
    if (error) {
      console.error('[leads] insert failed:', error.message);
      return NextResponse.json({ error: 'We could not save your details. Please try again.' }, { status: 500 });
    }
  }

  after(async () => {
    const sent = await sendLeadEmail(lead).catch((e) => {
      console.error('[leads] email failed:', e);
      return false;
    });
    if (sent && id) await svc?.from('leads').update({ email_sent: true }).eq('id', id);
  });

  return NextResponse.json({ ok: true });
}
