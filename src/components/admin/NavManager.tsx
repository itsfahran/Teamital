'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/admin-client';

export type NavItem = { id: string; label: string; href: string; location: string; sort_order: number };

export function NavManager({ items }: { items: NavItem[] }) {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [location, setLocation] = useState('header');
  const [error, setError] = useState('');

  const add = async () => {
    if (!label.trim() || !href.trim()) return setError('Label and link are required.');
    setError('');
    const next = items.reduce((m, i) => Math.max(m, i.sort_order), 0) + 1;
    const { error: err } = await createClient()
      .from('cms_nav_items')
      .insert({ label: label.trim(), href: href.trim(), location, sort_order: next });
    if (err) return setError(err.message);
    setLabel('');
    setHref('');
    await revalidateSite();
    router.refresh();
  };

  const remove = async (i: NavItem) => {
    if (!confirm(`Delete “${i.label}”?`)) return;
    await createClient().from('cms_nav_items').delete().eq('id', i.id);
    await revalidateSite();
    router.refresh();
  };

  const swap = async (a: NavItem, b: NavItem | undefined) => {
    if (!b) return;
    const db = createClient();
    await db.from('cms_nav_items').update({ sort_order: b.sort_order }).eq('id', a.id);
    await db.from('cms_nav_items').update({ sort_order: a.sort_order }).eq('id', b.id);
    await revalidateSite();
    router.refresh();
  };

  return (
    <>
      <div className="adm-card adm-form">
        <div className="adm-grid3">
          <label className="adm-label">
            Label
            <input className="adm-input" value={label} onChange={(e) => setLabel(e.target.value)} />
          </label>
          <label className="adm-label">
            Link
            <input className="adm-input" value={href} placeholder="/pricing" onChange={(e) => setHref(e.target.value)} />
          </label>
          <label className="adm-label">
            Location
            <select className="adm-input" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </label>
        </div>
        {error && <div className="adm-alert adm-alert-err">{error}</div>}
        <div className="adm-savebar">
          <button className="adm-btn adm-btn-primary" onClick={add}>
            Add link
          </button>
        </div>
      </div>

      <div className="adm-card adm-table">
        <div className="adm-tr adm-th adm-tr-nav">
          <div>Label</div>
          <div>Link</div>
          <div>Location</div>
          <div />
        </div>
        {items.length === 0 && <div className="adm-empty">No links yet.</div>}
        {items.map((it, idx) => (
          <div className="adm-tr adm-tr-nav" key={it.id}>
            <div>
              <b>{it.label}</b>
            </div>
            <div>
              <code>{it.href}</code>
            </div>
            <div>{it.location}</div>
            <div className="adm-actions">
              <button className="adm-btn adm-btn-sm" disabled={idx === 0} onClick={() => swap(it, items[idx - 1])}>
                ↑
              </button>
              <button className="adm-btn adm-btn-sm" disabled={idx === items.length - 1} onClick={() => swap(it, items[idx + 1])}>
                ↓
              </button>
              <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(it)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
