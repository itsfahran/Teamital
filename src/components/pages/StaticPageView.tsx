import type { StaticPageContent } from '@/content/pages';
import { Aos } from '../Aos';
import { RichText } from '../RichText';
import { SitePage } from '../SitePage';

export function StaticPageView({ page }: { page: StaticPageContent }) {
  return (
    <SitePage stickyHeader compactBelow={980}>
      <div className="lp">
        <div className="lp-in">
          <Aos>
            <h1 className="lp-title">{page.title}</h1>
            <RichText className="lp-sub" value={page.subtitle} />
            <div className="gap-28" />
            {page.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="lp-img" src={page.image} alt={page.title} />
            )}
            {page.paragraphs.map((p, i) => (
              <RichText className="lp-p" value={p} key={i} />
            ))}
          </Aos>
        </div>
      </div>
    </SitePage>
  );
}
