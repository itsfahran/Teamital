import { notFound } from 'next/navigation';
import { CmsPageView } from '@/components/pages/CmsPageView';
import { getCmsPage } from '@/lib/cms';
import { RESERVED_SLUGS } from '@/lib/config';
import { metadataFor } from '@/lib/seo';

export const revalidate = 30;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return metadataFor(`/${slug}`, slug);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const page = await getCmsPage(slug);
  if (!page) notFound();
  return <CmsPageView page={page} />;
}
