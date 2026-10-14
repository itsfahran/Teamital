import type { Metadata } from 'next';
import { StaticPageView } from '@/components/pages/StaticPageView';
import { CAREERS, PAGE_KEYS } from '@/content/pages';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(PAGE_KEYS.careers, CAREERS);
  return metadataFor('/careers', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(PAGE_KEYS.careers, CAREERS);
  return <StaticPageView page={c} />;
}
