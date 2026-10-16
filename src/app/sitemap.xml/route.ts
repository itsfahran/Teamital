import { BLOG, BLOG_PAGE_KEY } from '@/content/blog';
import { SITEMAP, SITEMAP_KEY, type SitemapUrl } from '@/content/sitemap';
import { ROUTES, SITE } from '@/lib/config';
import { getSiteContent } from '@/lib/content/server';
import { createPublicSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const revalidate = 60;

const MAIN = ['/', ROUTES.about, ROUTES.contact, ROUTES.careers, ROUTES.guides, ROUTES.guideCompanies, ROUTES.guideEmployees, ROUTES.privacyPolicy, ROUTES.terms, ROUTES.cookies, ROUTES.security];
const FREQ = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** Turns whatever the admin typed into an absolute URL on this site (or null if it is not usable). */
function absolute(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const base = new URL(SITE.publicSiteUrl);
  try {
    const url = /^https?:\/\//i.test(t) ? new URL(t) : new URL(t.startsWith('/') ? t : `/${t}`, base);
    // A sitemap may only list URLs of its own site.
    if (url.host.replace(/^www\./, '') !== base.host.replace(/^www\./, '')) return null;
    url.host = base.host;
    url.protocol = base.protocol;
    url.hash = '';
    return url.pathname === '/' && !url.search ? `${base.origin}/` : url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function entry(url: string, o: Partial<SitemapUrl>) {
  const lm = o.lastmod && !Number.isNaN(Date.parse(o.lastmod)) ? new Date(o.lastmod).toISOString().slice(0, 10) : '';
  const pr = Number(o.priority);
  const lines = ['  <url>', `    <loc>${esc(url)}</loc>`];
  if (lm) lines.push(`    <lastmod>${lm}</lastmod>`);
  if (o.changefreq && FREQ.has(o.changefreq)) lines.push(`    <changefreq>${o.changefreq}</changefreq>`);
  if (o.priority !== undefined && o.priority !== '' && Number.isFinite(pr) && pr >= 0 && pr <= 1) lines.push(`    <priority>${pr.toFixed(1)}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

export async function GET() {
  const c = await getSiteContent(SITEMAP_KEY, SITEMAP);
  const seen = new Set<string>();
  const blocks: string[] = [];

  const add = (title: string, rows: Array<{ url: string; o: Partial<SitemapUrl> }>) => {
    const out: string[] = [];
    for (const r of rows) {
      const abs = absolute(r.url);
      if (!abs || seen.has(abs)) continue;
      seen.add(abs);
      out.push(entry(abs, r.o));
    }
    if (out.length) blocks.push(`  <!-- ${esc(title).replace(/--/g, '-')} -->\n${out.join('\n')}`);
  };

  // 1. URLs the admin added by hand, group by group (these win over the automatic ones below).
  for (const g of c.groups) {
    add(
      g.name || 'Pages',
      g.urls.filter((x) => x.enabled).map((x) => ({ url: x.url, o: x })),
    );
  }

  // 2. Automatic: main pages, blog articles and published custom pages.
  if (c.settings.includeMainPages) {
    add('Main pages', MAIN.map((url) => ({ url, o: { changefreq: 'monthly', priority: url === '/' ? '1.0' : '0.6' } })));
  }
  if (c.settings.includeBlogPosts) {
    const blog = await getSiteContent(BLOG_PAGE_KEY, BLOG);
    add('Blog articles', blog.posts.map((p) => ({ url: `/blog/${p.slug}`, o: { changefreq: 'monthly', priority: '0.6', lastmod: p.date } })));
  }
  if (c.settings.includeCustomPages && isSupabaseConfigured()) {
    const { data } = await createPublicSupabase().from('cms_pages').select('slug,updated_at').eq('status', 'published');
    add(
      'Custom pages',
      (data ?? []).filter((p) => p.slug !== 'home').map((p) => ({ url: `/${p.slug}`, o: { changefreq: 'monthly', priority: '0.7', lastmod: p.updated_at as string } })),
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${blocks.join('\n')}\n</urlset>\n`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
