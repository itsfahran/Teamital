import type { Metadata } from 'next';
import { PricingView } from '@/components/pages/PricingView';
import { DEFAULT_PLANS } from '@/content/default-plans';
import { PAGE_KEYS, PRICING_PAGE } from '@/content/pages';
import { getPlans } from '@/lib/cms';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(PAGE_KEYS.pricing, PRICING_PAGE);
  return metadataFor('/pricing', undefined, c.seo);
}

export default async function Page() {
  const [fromDb, c] = await Promise.all([getPlans(), getSiteContent(PAGE_KEYS.pricing, PRICING_PAGE)]);
  const plans = fromDb.length > 0 ? fromDb : DEFAULT_PLANS;
  return <PricingView plans={plans} c={c} />;
}
