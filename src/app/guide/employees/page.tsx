import { GuideView } from '@/components/guide/GuideView';
import { getGuide } from '@/content/guides';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/guide/employees');

export default function Page() {
  return <GuideView guide={getGuide('employees')!} />;
}
