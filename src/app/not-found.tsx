import { SitePage } from '@/components/SitePage';
import { SmartLink } from '@/components/ui';
import { MissingPath } from '@/components/pages/MissingPath';
import { CHROME, CHROME_PAGE_KEY } from '@/content/chrome';
import { getSiteContent } from '@/lib/content/server';

export default async function NotFound() {
  const c = (await getSiteContent(CHROME_PAGE_KEY, CHROME)).notFound;
  return (
    <SitePage compactBelow={0} stickyHeader theme="app" background="#fff" footer={false}>
      <div className="missing">
        <div className="missing-in">
          <div className="missing-t">{c.title}</div>
          <MissingPath />
          <SmartLink href="/" className="btn-text missing-btn">
            {c.button}
          </SmartLink>
        </div>
      </div>
    </SitePage>
  );
}
