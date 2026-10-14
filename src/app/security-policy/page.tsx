import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy/PolicyPage';
import { POLICY_DOCS } from '@/content/policies-cms';
import { POLICY_META } from '@/components/policy/PolicyPage';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent('security-policy', POLICY_DOCS['security-policy']);
  return metadataFor('/security-policy', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent('security-policy', POLICY_DOCS['security-policy']);
  const related: Record<string, { title: string; subtitle: string }> = {};
  for (const [k, m] of Object.entries(POLICY_META)) {
    const d = await getSiteContent(m.path.slice(1), POLICY_DOCS[m.path.slice(1) as keyof typeof POLICY_DOCS]);
    related[k] = { title: d.title, subtitle: d.subtitle };
  }
  return <PolicyPage kind="security" doc={c} related={related} />;
}
