'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/admin-client';

export function PageActions({ id, slug, status }: { id: string; slug: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    await createClient()
      .from('cms_pages')
      .update({ status: status === 'published' ? 'draft' : 'published' })
      .eq('id', id);
    await revalidateSite();
    setBusy(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm(`Delete page “${slug}”? This cannot be undone.`)) return;
    setBusy(true);
    await createClient().from('cms_pages').delete().eq('id', id);
    await revalidateSite();
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="adm-actions">
      {status === 'published' && (
        <a className="adm-btn adm-btn-sm" href={slug === 'home' ? '/' : `/${slug}`} target="_blank" rel="noopener noreferrer">
          View
        </a>
      )}
      <Link className="adm-btn adm-btn-sm" href={`/admin/pages/${id}`}>
        Edit
      </Link>
      <button className="adm-btn adm-btn-sm" onClick={toggle} disabled={busy}>
        {status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={remove} disabled={busy}>
        Delete
      </button>
    </div>
  );
}
