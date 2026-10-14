import type { Metadata } from 'next';
import { GuideView } from '@/components/guide/GuideView';
import { GUIDES_DOC, GUIDES_PAGE_KEY } from '@/content/guides';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(GUIDES_PAGE_KEY, GUIDES_DOC);
  return metadataFor('/guide/companies', undefined, c.companies.seo);
}

export default async function Page() {
  const c = await getSiteContent(GUIDES_PAGE_KEY, GUIDES_DOC);
  return <GuideView guide={c.companies} other={c.employees} labels={c.labels} cta={c.cta} />;
}
