import type { StaticPage } from '@/content/static-pages';
import { Aos } from '../Aos';
import { SitePage } from '../SitePage';

export function StaticPageView({ page }: { page: StaticPage }) {
  return (
    <SitePage stickyHeader compactBelow={980}>
      <div className="lp">
        <div className="lp-in">
          <Aos>
            <h1 className="lp-title">{page.title}</h1>
            <p className="lp-sub">{page.subtitle}</p>
            <div className="gap-28" />
            {page.paragraphs.map((p) => (
              <p className="lp-p" key={p}>
                {p}
              </p>
            ))}
          </Aos>
        </div>
      </div>
    </SitePage>
  );
}
