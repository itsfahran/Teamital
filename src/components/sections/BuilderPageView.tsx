import type { SectionBlock } from '@/content/sections';
import { SitePage } from '../SitePage';
import { SectionView } from './SectionView';

/** Renders a page built in the admin page builder: header, the sections in order, footer. */
export function BuilderPageView({ sections, path, banner }: { sections: SectionBlock[]; path: string; banner?: string }) {
  return (
    <SitePage compactBelow={980} background="#fff">
      {banner && <div className="sx-banner">{banner}</div>}
      {sections.map((s) => (
        <SectionView key={s.id} section={s} pagePath={path} />
      ))}
    </SitePage>
  );
}
