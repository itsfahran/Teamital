import type { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';
import { HOME, HOME_PAGE_KEY } from '@/content/home';
import { getCmsPage } from '@/lib/cms';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(HOME_PAGE_KEY, HOME);
  return metadataFor('/', 'home', c.seo);
}

export default async function Page() {
  const [cms, c] = await Promise.all([getCmsPage('home'), getSiteContent(HOME_PAGE_KEY, HOME)]);
  return <HomePage cms={cms} c={c} />;
}
