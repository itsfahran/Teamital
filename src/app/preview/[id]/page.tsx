import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { BuilderPageView } from '@/components/sections/BuilderPageView';
import { isBuilderContent } from '@/content/sections';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: { absolute: 'Preview | Teamital' }, robots: { index: false, follow: false } };

/** Admin-only preview of a page (drafts included). */
export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createServerSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect(`/login?next=/preview/${id}`);
  const { data: admin } = await db.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!admin) notFound();

  const { data: page } = await db.from('cms_pages').select('slug,title,status,content').eq('id', id).maybeSingle();
  if (!page) notFound();
  const sections = isBuilderContent(page.content) ? page.content : [];
  return <BuilderPageView sections={sections} path={`/${page.slug}`} banner={`Preview · ${page.title} · ${page.status === 'published' ? 'published' : 'draft (not visible to visitors)'}`} />;
}
