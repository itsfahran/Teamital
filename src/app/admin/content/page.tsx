import Link from 'next/link';
import { CONTENT_PAGES } from '@/content/registry';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ContentIndex() {
  const db = await createServerSupabase();
  const { data } = await db.from('site_content').select('page_key,updated_at');
  const edited = new Map((data ?? []).map((r) => [r.page_key as string, r.updated_at as string]));

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">Site content</h1>
      </div>
      <p className="adm-muted">
        Edit the text, images and buttons of every page. Descriptions have a formatting toolbar, images upload straight from your computer, and changes go live
        as soon as you press <b>Save &amp; publish</b>.
      </p>
      <div className="cx-pages">
        {CONTENT_PAGES.map((p) => (
          <Link href={`/admin/content/${p.key}`} className="cx-page" key={p.key}>
            <span className="cx-page-ico">
              <span className="mi">{p.icon}</span>
            </span>
            <span className="cx-page-txt">
              <b>{p.label}</b>
              <i>{p.description}</i>
              <em className={edited.has(p.key) ? 'cx-badge cx-badge-on' : 'cx-badge'}>
                {edited.has(p.key) ? `Customised · ${new Date(edited.get(p.key)!).toLocaleDateString('en-GB')}` : 'Original content'}
              </em>
            </span>
            <span className="mi">chevron_right</span>
          </Link>
        ))}
      </div>
    </>
  );
}
