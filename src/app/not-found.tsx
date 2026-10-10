import { SitePage } from '@/components/SitePage';
import { SmartLink } from '@/components/ui';
import { MissingPath } from '@/components/pages/MissingPath';

export default function NotFound() {
  return (
    <SitePage compactBelow={0} stickyHeader theme="app" background="#fff" footer={false}>
      <div className="missing">
        <div className="missing-in">
          <div className="missing-t">Page not found</div>
          <MissingPath />
          <SmartLink href="/" className="btn-text missing-btn">
            Go home
          </SmartLink>
        </div>
      </div>
    </SitePage>
  );
}
