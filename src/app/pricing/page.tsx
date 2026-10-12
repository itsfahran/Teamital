import { PricingView } from '@/components/pages/PricingView';
import { DEFAULT_PLANS } from '@/content/default-plans';
import { getPlans } from '@/lib/cms';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export const generateMetadata = () => metadataFor('/pricing');

export default async function Page() {
  const fromDb = await getPlans();
  const plans = fromDb.length > 0 ? fromDb : DEFAULT_PLANS;
  return <PricingView plans={plans} />;
}
