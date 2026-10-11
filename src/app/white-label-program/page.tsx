import { WhiteLabelPage } from '@/components/wl/WhiteLabelPage';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/white-label-program');

export default function Page() {
  return <WhiteLabelPage />;
}
