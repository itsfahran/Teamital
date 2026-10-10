import { PolicyView } from '@/components/pages/PolicyView';
import { COOKIE_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/cookie-policy');

export default function Page() {
  return <PolicyView appBarTitle="Cookie Policy" heading="Cookie Policy" blocks={COOKIE_POLICY} />;
}
