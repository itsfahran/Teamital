import { notFound } from 'next/navigation';
import { ContentEditor } from '@/components/admin/content/ContentEditor';
import { getContentPage } from '@/content/registry';
import { getSiteContentFresh } from '@/lib/content/server';

export const dynamic = 'force-dynamic';

export default async function ContentPageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const def = getContentPage(page);
  if (!def) notFound();
  const { content, override } = await getSiteContentFresh(def.key, def.defaults);
  return (
    <ContentEditor
      key={def.key}
      pageKey={def.key}
      label={def.label}
      route={def.route}
      defaults={JSON.parse(JSON.stringify(def.defaults))}
      initial={JSON.parse(JSON.stringify(content))}
      hasOverride={override != null}
      labels={def.labels}
    />
  );
}
