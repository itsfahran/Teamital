import { PolicyPage } from '@/components/policy/PolicyPage';
import { COOKIE_POLICY } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/cookie-policy');

export default function Page() {
  return <PolicyPage kind="cookies" blocks={COOKIE_POLICY} />;
}
