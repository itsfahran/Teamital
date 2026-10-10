import { PolicyView } from '@/components/pages/PolicyView';
import { SECURITY_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/security-policy');

export default function Page() {
  return <PolicyView appBarTitle="Security Policy" heading="Security Policy" blocks={SECURITY_POLICY} />;
}
