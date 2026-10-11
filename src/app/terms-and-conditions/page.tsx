import { PolicyPage } from '@/components/policy/PolicyPage';
import { TERMS_AND_CONDITIONS } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/terms-and-conditions');

export default function Page() {
  return <PolicyPage kind="terms" blocks={TERMS_AND_CONDITIONS} />;
}
