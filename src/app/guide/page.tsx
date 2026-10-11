import Link from 'next/link';
import { SitePage } from '@/components/SitePage';
import { Icon, cx } from '@/components/ui';
import { GUIDES } from '@/content/guides';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/guide');

export default function Page() {
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero">
        <div className="bhero-in">
          <span className="bhero-pill">
            <span className="bhero-dot" />
            Guides
          </span>
          <h1 className="bhero-title">Learn how to use Teamital</h1>
          <p className="bhero-sub">Step-by-step guides for company admins and for employees.</p>
        </div>
      </section>
      <section className="guide">
        <div className="ghub">
          {GUIDES.map((g) => (
            <Link href={g.path} className="ghub-card" key={g.slug}>
              <span className={cx('tile', `tone-${g.tone}`, 'ghub-tile')}>
                <Icon name={g.icon} size={30} />
              </span>
              <span className="bpill">{g.audience}</span>
              <h2>{g.title}</h2>
              <p>{g.subtitle}</p>
              <span className="bfeat-link">
                Read the guide
                <Icon name="arrow_forward" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
