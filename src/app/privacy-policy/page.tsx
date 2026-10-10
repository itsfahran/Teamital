import { PolicyView } from '@/components/pages/PolicyView';
import { PRIVACY_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/privacy-policy');

export default function Page() {
  return <PolicyView appBarTitle="Privacy Policy" heading="Privacy Policy" blocks={PRIVACY_POLICY} />;
}
