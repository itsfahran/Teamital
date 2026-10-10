import { PricingView } from '@/components/pages/PricingView';
import { getPlans } from '@/lib/cms';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export const generateMetadata = () => metadataFor('/pricing');

export default async function Page() {
  const plans = await getPlans();
  return <PricingView plans={plans} />;
}
