import { revalidatePath, revalidateTag } from 'next/cache';
import { CONTENT_TAG } from '@/lib/content/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/** Called by the admin panel after edits so public pages pick up fresh content immediately. */
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
