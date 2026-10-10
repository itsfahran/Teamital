import { StaticPageView } from '@/components/pages/StaticPageView';
import { STATIC_PAGES } from '@/content/static-pages';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/features');

export default function Page() {
  return <StaticPageView page={STATIC_PAGES.features} />;
}
