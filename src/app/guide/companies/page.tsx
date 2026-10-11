import { GuideView } from '@/components/guide/GuideView';
import { getGuide } from '@/content/guides';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/guide/companies');

export default function Page() {
  return <GuideView guide={getGuide('companies')!} />;
}
