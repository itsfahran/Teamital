import type { Metadata } from 'next';
import Link from 'next/link';
import { RichText } from '@/components/RichText';
import { SitePage } from '@/components/SitePage';
import { Icon, cx } from '@/components/ui';
import { GUIDES_DOC, GUIDES_PAGE_KEY } from '@/content/guides';
import { getSiteContent } from '@/lib/content/server';
import { plainText } from '@/lib/content/utils';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(GUIDES_PAGE_KEY, GUIDES_DOC);
  return metadataFor('/guide', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(GUIDES_PAGE_KEY, GUIDES_DOC);
  const guides = [c.companies, c.employees];
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero">
        <div className="bhero-in">
          <span className="bhero-pill">
            <span className="bhero-dot" />
            {c.hub.pill}
          </span>
          <h1 className="bhero-title">{c.hub.title}</h1>
          <RichText className="bhero-sub" value={c.hub.sub} />
        </div>
      </section>
      <section className="guide">
        <div className="ghub">
          {guides.map((g) => (
            <Link href={g.path} className="ghub-card" key={g.slug}>
              <span className={cx('tile', `tone-${g.tone}`, 'ghub-tile')}>
                <Icon name={g.icon} size={30} />
              </span>
              <span className="bpill">{g.audience}</span>
              <h2>{g.title}</h2>
              <p>{plainText(g.subtitle)}</p>
              <span className="bfeat-link">
                {c.hub.readLabel}
                <Icon name="arrow_forward" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
