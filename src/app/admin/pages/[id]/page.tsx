import { notFound } from 'next/navigation';
import { PageEditor, type EditorPage } from '@/components/admin/PageEditor';
import { createServerSupabase } from '@/lib/supabase/server';

type Params = { params: Promise<{ id: string }> };

export default async function EditPage({ params }: Params) {
  const { id } = await params;
  const db = await createServerSupabase();
  const { data: page } = await db.from('cms_pages').select('*').eq('id', id).maybeSingle();
  if (!page) notFound();
  const { data: seo } = await db.from('cms_seo').select('*').eq('page_id', id).maybeSingle();

  const initial: EditorPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    h1: page.h1 ?? '',
    status: page.status,
    content: Array.isArray(page.content) ? page.content : [],
    metaTitle: seo?.meta_title ?? '',
    metaDescription: seo?.meta_description ?? '',
  };

  return (
    <>
      <h1 className="adm-h1">Edit page</h1>
      <PageEditor initial={initial} />
    </>
  );
}
