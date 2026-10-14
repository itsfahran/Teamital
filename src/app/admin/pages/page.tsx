import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { PageActions } from '@/components/admin/PageActions';

export default async function PagesList() {
  const db = await createServerSupabase();
  const { data: pages, error } = await db
    .from('cms_pages')
    .select('id,slug,title,status,updated_at')
    .order('updated_at', { ascending: false });

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">Pages</h1>
        <Link href="/admin/pages/new" className="adm-btn adm-btn-primary">
          New page
        </Link>
      </div>
      <p className="adm-muted">
        Build new landing pages from sections (Hero, Features, Content, Benefits, Call to action, FAQ, Testimonials, Lead form), each with several designs. Published pages are served at <code>/&lt;address&gt;</code>.
      </p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <div className="adm-card adm-table">
        <div className="adm-tr adm-th">
          <div>Title</div>
          <div>Slug</div>
          <div>Status</div>
          <div>Updated</div>
          <div />
        </div>
        {(pages ?? []).length === 0 && <div className="adm-empty">No pages yet. Create your first one.</div>}
        {(pages ?? []).map((p) => (
          <div className="adm-tr" key={p.id}>
            <div>
              <Link href={`/admin/pages/${p.id}`} className="adm-link">
                {p.title}
              </Link>
            </div>
            <div>
              <code>/{p.slug === 'home' ? '' : p.slug}</code>
            </div>
            <div>
              <span className={p.status === 'published' ? 'adm-pill adm-pill-ok' : 'adm-pill'}>{p.status}</span>
            </div>
            <div className="adm-muted">{new Date(p.updated_at).toLocaleDateString()}</div>
            <PageActions id={p.id} slug={p.slug} status={p.status} />
          </div>
        ))}
      </div>
    </>
  );
}
