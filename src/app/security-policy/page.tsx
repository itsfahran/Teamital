import { PolicyPage } from '@/components/policy/PolicyPage';
import { SECURITY_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/security-policy');

export default function Page() {
  return <PolicyPage kind="security" blocks={SECURITY_POLICY} />;
}
