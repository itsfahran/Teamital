'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/admin-client';

export type Plan = {
  id: string;
  name: string;
  price: number | null;
  price_eur: number | null;
  billing: string;
  features: unknown;
  is_active: boolean;
};

type Draft = {
  id?: string;
  name: string;
  price: string;
  billing: string;
  features: string;
  is_active: boolean;
};

const EMPTY: Draft = { name: '', price: '', billing: 'monthly', features: '', is_active: true };

function toDraft(p: Plan): Draft {
  const amount = p.price_eur && p.price_eur > 0 ? p.price_eur : (p.price ?? 0);
  return {
    id: p.id,
    name: p.name,
    price: String(amount),
    billing: p.billing,
    features: Array.isArray(p.features) ? (p.features as unknown[]).map(String).join('\n') : '',
    is_active: p.is_active,
  };
}

export function PlansManager({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!draft) return;
    const price = Number(draft.price);
    if (!draft.name.trim()) return setError('Name is required.');
    if (!Number.isFinite(price) || price < 0) return setError('Enter a valid price (0 = “Custom”).');
    setBusy(true);
    setError('');
    const features = draft.features.split('\n').map((l) => l.trim()).filter(Boolean);
    const maxUsers = features
      .map((l) => /(\d+)\s*(users?|employees?|seats?)/i.exec(l))
      .find(Boolean);
    const row = {
      name: draft.name.trim(),
      price,
      price_eur: price > 0 ? price : null,
      billing: draft.billing,
      features,
      max_users: maxUsers ? Number(maxUsers[1]) : null,
      is_active: draft.is_active,
    };
    const db = createClient();
    const { error: err } = draft.id
      ? await db.from('subscription_plans').update(row).eq('id', draft.id)
      : await db.from('subscription_plans').insert(row);
    setBusy(false);
    if (err) return setError(err.message);
    await revalidateSite();
    setDraft(null);
    router.refresh();
  };

  const remove = async (p: Plan) => {
    if (!confirm(`Delete plan “${p.name}” (${p.billing})?`)) return;
    await createClient().from('subscription_plans').delete().eq('id', p.id);
    await revalidateSite();
    router.refresh();
  };

  const toggle = async (p: Plan) => {
    await createClient().from('subscription_plans').update({ is_active: !p.is_active }).eq('id', p.id);
    await revalidateSite();
    router.refresh();
  };

  return (
    <>
      <div className="adm-head">
        <span />
        <button className="adm-btn adm-btn-primary" onClick={() => setDraft({ ...EMPTY })}>
          New plan
        </button>
      </div>

      {draft && (
        <div className="adm-card adm-form">
          <div className="adm-grid2">
            <label className="adm-label">
              Name
              <input className="adm-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </label>
            <label className="adm-label">
              Price (EUR) <span className="adm-muted">0 shows “Custom”</span>
              <input className="adm-input" inputMode="decimal" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            </label>
            <label className="adm-label">
              Billing
              <select className="adm-input" value={draft.billing} onChange={(e) => setDraft({ ...draft, billing: e.target.value })}>
                <option value="monthly">Monthly</option>
                <option value="annual">1 Year</option>
              </select>
            </label>
            <label className="adm-label adm-check">
              <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
              Active (visible on the site)
            </label>
          </div>
          <label className="adm-label">
            Features <span className="adm-muted">(one per line)</span>
            <textarea className="adm-input" rows={5} value={draft.features} onChange={(e) => setDraft({ ...draft, features: e.target.value })} />
          </label>
          {error && <div className="adm-alert adm-alert-err">{error}</div>}
          <div className="adm-savebar">
            <button className="adm-btn adm-btn-primary" onClick={save} disabled={busy}>
              {busy ? 'Saving…' : 'Save plan'}
            </button>
            <button className="adm-btn" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="adm-card adm-table">
        <div className="adm-tr adm-th adm-tr-plans">
          <div>Name</div>
          <div>Billing</div>
          <div>Price</div>
          <div>Status</div>
          <div />
        </div>
        {plans.length === 0 && <div className="adm-empty">No plans yet.</div>}
        {plans.map((p) => (
          <div className="adm-tr adm-tr-plans" key={p.id}>
            <div>
              <b>{p.name}</b>
            </div>
            <div>{p.billing}</div>
            <div>€{p.price_eur && p.price_eur > 0 ? p.price_eur : (p.price ?? 0)}</div>
            <div>
              <span className={p.is_active ? 'adm-pill adm-pill-ok' : 'adm-pill'}>{p.is_active ? 'active' : 'hidden'}</span>
            </div>
            <div className="adm-actions">
              <button className="adm-btn adm-btn-sm" onClick={() => setDraft(toDraft(p))}>
                Edit
              </button>
              <button className="adm-btn adm-btn-sm" onClick={() => toggle(p)}>
                {p.is_active ? 'Hide' : 'Show'}
              </button>
              <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(p)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
