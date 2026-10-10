import { PolicyView } from '@/components/pages/PolicyView';
import { TERMS_AND_CONDITIONS } from '@/content/policies';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/terms-and-conditions');

export default function Page() {
  return <PolicyView appBarTitle="Terms & Conditions" heading="Terms & Conditions" blocks={TERMS_AND_CONDITIONS} />;
}
