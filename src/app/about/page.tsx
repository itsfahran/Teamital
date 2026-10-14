import type { Metadata } from 'next';
import { StaticPageView } from '@/components/pages/StaticPageView';
import { ABOUT, PAGE_KEYS } from '@/content/pages';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(PAGE_KEYS.about, ABOUT);
  return metadataFor('/about', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(PAGE_KEYS.about, ABOUT);
  return <StaticPageView page={c} />;
}
