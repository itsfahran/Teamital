import { notFound } from 'next/navigation';
import { PageBuilder, type BuilderPage } from '@/components/admin/builder/PageBuilder';
import { PageEditor, type EditorPage } from '@/components/admin/PageEditor';
import { isBuilderContent } from '@/content/sections';
import { createServerSupabase } from '@/lib/supabase/server';

type Params = { params: Promise<{ id: string }> };

export default async function EditPage({ params }: Params) {
  const { id } = await params;
  const db = await createServerSupabase();
  const { data: page } = await db.from('cms_pages').select('*').eq('id', id).maybeSingle();
  if (!page) notFound();
  const { data: seo } = await db.from('cms_seo').select('*').eq('page_id', id).maybeSingle();

  const content = Array.isArray(page.content) ? page.content : [];
  // Pages made with the page builder (or empty ones) open in the builder; older block pages keep their editor.
  if (isBuilderContent(content) || content.length === 0) {
    const initial: BuilderPage = {
      id: page.id,
      slug: page.slug,
      title: page.title,
      status: page.status,
      sections: content as BuilderPage['sections'],
      metaTitle: seo?.meta_title ?? '',
      metaDescription: seo?.meta_description ?? '',
    };
    return (
      <>
        <h1 className="adm-h1">Edit page</h1>
        <PageBuilder initial={initial} />
      </>
    );
  }

  const initial: EditorPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    h1: page.h1 ?? '',
    status: page.status,
    content,
    metaTitle: seo?.meta_title ?? '',
    metaDescription: seo?.meta_description ?? '',
  };
  return (
    <>
      <h1 className="adm-h1">Edit page</h1>
      <p className="adm-muted">This page uses the older block editor.</p>
      <PageEditor initial={initial} />
    </>
  );
}
