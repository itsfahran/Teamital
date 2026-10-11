import { PolicyPage } from '@/components/policy/PolicyPage';
import { PRIVACY_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/privacy-policy');

export default function Page() {
  return <PolicyPage kind="privacy" blocks={PRIVACY_POLICY} />;
}
