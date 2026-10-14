import type { Metadata } from 'next';
import { WhiteLabelPage } from '@/components/wl/WhiteLabelPage';
import { WL, WL_PAGE_KEY } from '@/content/white-label';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(WL_PAGE_KEY, WL);
  return metadataFor('/white-label-program', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(WL_PAGE_KEY, WL);
  return <WhiteLabelPage c={c} />;
}
