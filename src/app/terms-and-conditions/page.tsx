import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy/PolicyPage';
import { POLICY_DOCS } from '@/content/policies-cms';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent('terms-and-conditions', POLICY_DOCS['terms-and-conditions']);
  return metadataFor('/terms-and-conditions', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent('terms-and-conditions', POLICY_DOCS['terms-and-conditions']);
  return <PolicyPage kind="terms" doc={c} />;
}
