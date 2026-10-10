import { HomePage } from '@/components/home/HomePage';
import { getCmsPage } from '@/lib/cms';
import { metadataFor } from '@/lib/seo';

export const revalidate = 30;

export async function generateMetadata() {
  return metadataFor('/', 'home');
}

export default async function Page() {
  const cms = await getCmsPage('home');
  return <HomePage cms={cms} />;
}
