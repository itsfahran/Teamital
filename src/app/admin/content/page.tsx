import Link from 'next/link';
import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { CONTENT_PAGES } from '@/content/registry';
import { getSiteContent } from '@/lib/content/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const RELATED = [
  { href: '/admin/plans', icon: 'sell', label: 'Pricing plans & prices', text: 'Plan names, prices, billing period and the feature list shown on the Pricing page.' },
  { href: '/admin/navigation', icon: 'menu', label: 'Navigation links', text: 'Extra links shown in the site navigation.' },
  { href: '/admin/pages', icon: 'article', label: 'Custom pages', text: 'Create new pages at their own address, including alternative Home layouts.' },
];

export default async function ContentIndex() {
  const db = await createServerSupabase();
  const ui = (await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)).pages.content;
  const { data } = await db.from('site_content').select('page_key,updated_at');
  const edited = new Map((data ?? []).map((r) => [r.page_key as string, r.updated_at as string]));

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">{ui.title}</h1>
      </div>
      <p className="adm-muted">{ui.intro}</p>
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

      <h2 className="adm-h2" style={{ marginTop: 28 }}>
        {ui.relatedTitle}
      </h2>
      <div className="cx-pages">
        {RELATED.map((r) => (
          <Link href={r.href} className="cx-page" key={r.href}>
            <span className="cx-page-ico">
              <span className="mi">{r.icon}</span>
            </span>
            <span className="cx-page-txt">
              <b>{r.label}</b>
              <i>{r.text}</i>
            </span>
            <span className="mi">chevron_right</span>
          </Link>
        ))}
      </div>
    </>
  );
}
