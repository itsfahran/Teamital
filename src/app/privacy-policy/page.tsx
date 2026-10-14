import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy/PolicyPage';
import { POLICY_DOCS } from '@/content/policies-cms';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent('privacy-policy', POLICY_DOCS['privacy-policy']);
  return metadataFor('/privacy-policy', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent('privacy-policy', POLICY_DOCS['privacy-policy']);
  return <PolicyPage kind="privacy" doc={c} />;
}
