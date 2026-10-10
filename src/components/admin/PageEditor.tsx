'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/admin-client';
import { RESERVED_SLUGS } from '@/lib/config';

type Block = Record<string, unknown>;

export type EditorPage = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  status: string;
  content: Block[];
  metaTitle: string;
  metaDescription: string;
};

const BLOCK_TYPES = ['hero', 'h2', 'h3', 'slot', 'features', 'content', 'benefits', 'cta', 'faq', 'testimonials'];

const VARIANTS: Record<string, string[]> = {
  hero: ['split-product', 'split-dashboard', 'split-map', 'center-icons', 'ops-dashboard'],
  h2: ['original', 'dashboard', 'security-card'],
  h3: ['original', 'devices', 'why-matters'],
  slot: ['ops-board', 'feature-chart', 'story-rows', 'ai-insight', 'topic-menu', 'ask-banner', 'device-tracking'],
};

const SLOT_HINT: Record<number, string> = {
  4: 'Roles',
  5: 'Security',
  6: 'Testimonials',
  7: 'Why teams switch',
  8: 'Toolkit chips',
  9: 'Stats band',
  10: 'Final CTA',
};

const s = (v: unknown) => (v == null ? '' : String(v));

function itemsToText(raw: unknown): string {
  if (!Array.isArray(raw)) return '';
  return raw
    .map((e) => {
      if (typeof e === 'string') return e;
      if (e && typeof e === 'object') {
        const o = e as Record<string, unknown>;
        const title = s(o.title ?? o.q ?? o.name ?? o.label).trim();
        const text = s(o.text ?? o.a ?? o.quote ?? o.body).trim();
        return text ? (title ? `${title}|${text}` : text) : title;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

export function PageEditor({ initial }: { initial: EditorPage | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [h1, setH1] = useState(initial?.h1 ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? '');
  const [blocks, setBlocks] = useState<Block[]>(initial?.content ?? []);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (i: number, patch: Block, drop: string[] = []) =>
    setBlocks((bs) =>
      bs.map((b, idx) => {
        if (idx !== i) return b;
        const next = { ...b, ...patch };
        drop.forEach((k) => delete next[k]);
        return next;
      }),
    );

  const move = (i: number, d: number) =>
    setBlocks((bs) => {
      const j = i + d;
      if (j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const toggleJson = () => {
    if (!jsonMode) {
      setJsonText(JSON.stringify(blocks, null, 2));
      setJsonMode(true);
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error('Content must be a JSON array of blocks.');
      setBlocks(parsed);
      setJsonMode(false);
      setMsg(null);
    } catch (e) {
      setMsg({ kind: 'err', text: `Invalid JSON: ${(e as Error).message}` });
    }
  };

  const save = async () => {
    setMsg(null);
    const cleanSlug = slug.trim().toLowerCase();
    if (!title.trim()) return setMsg({ kind: 'err', text: 'Title is required.' });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cleanSlug))
      return setMsg({ kind: 'err', text: 'Slug may contain lowercase letters, numbers and single dashes only.' });
    if (RESERVED_SLUGS.has(cleanSlug) && cleanSlug !== 'home')
      return setMsg({ kind: 'err', text: `“${cleanSlug}” is reserved by the site — pick another slug.` });

    let content = blocks;
    if (jsonMode) {
      try {
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed)) throw new Error('Content must be a JSON array of blocks.');
        content = parsed;
      } catch (e) {
        return setMsg({ kind: 'err', text: `Invalid JSON: ${(e as Error).message}` });
      }
    }

    setBusy(true);
    const db = createClient();
    const row = { slug: cleanSlug, title: title.trim(), h1: h1.trim() || null, status, content };
    let id = initial?.id;
    if (id) {
      const { error } = await db.from('cms_pages').update(row).eq('id', id);
      if (error) {
        setBusy(false);
        return setMsg({ kind: 'err', text: error.message });
      }
    } else {
      const { data, error } = await db.from('cms_pages').insert(row).select('id').single();
      if (error || !data) {
        setBusy(false);
        return setMsg({ kind: 'err', text: error?.message ?? 'Could not create page.' });
      }
      id = data.id as string;
    }
    const { error: seoErr } = await db
      .from('cms_seo')
      .upsert(
        { page_id: id, meta_title: metaTitle.trim() || null, meta_description: metaDescription.trim() || null },
        { onConflict: 'page_id' },
      );
    await revalidateSite();
    setBusy(false);
    if (seoErr) return setMsg({ kind: 'err', text: `Page saved, but SEO failed: ${seoErr.message}` });
    setMsg({ kind: 'ok', text: 'Saved. The public site is updated.' });
    if (!initial) router.replace(`/admin/pages/${id}`);
    else router.refresh();
  };

  return (
    <div className="adm-editor">
      <div className="adm-card adm-form">
        <div className="adm-grid2">
          <label className="adm-label">
            Title
            <input className="adm-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="adm-label">
            Slug
            <input
              className="adm-input"
              value={slug}
              placeholder="e.g. about-us  (use “home” for the homepage)"
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <label className="adm-label">
            Main heading (H1)
            <input className="adm-input" value={h1} onChange={(e) => setH1(e.target.value)} />
          </label>
          <label className="adm-label">
            Status
            <select className="adm-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <h3 className="adm-h3">SEO</h3>
        <label className="adm-label">
          Meta title
          <input className="adm-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </label>
        <label className="adm-label">
          Meta description
          <textarea className="adm-input" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </label>
      </div>

      <div className="adm-head">
        <h2 className="adm-h2">Content blocks</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={toggleJson}>
          {jsonMode ? 'Back to visual editor' : 'Edit as JSON'}
        </button>
      </div>

      {jsonMode ? (
        <textarea
          className="adm-input adm-code"
          rows={24}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <>
          {blocks.length === 0 && <div className="adm-empty adm-card">No blocks yet. Add a hero to start.</div>}
          {blocks.map((b, i) => {
            const type = s(b.type);
            const variants = VARIANTS[type] ?? [];
            return (
              <div className="adm-card adm-block" key={i}>
                <div className="adm-block-head">
                  <b>
                    {i + 1}. {type || 'block'}
                    {type === 'slot' && SLOT_HINT[Number(b.slot)] ? ` · ${SLOT_HINT[Number(b.slot)]}` : ''}
                  </b>
                  <div className="adm-actions">
                    <button type="button" className="adm-btn adm-btn-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                      ↑
                    </button>
                    <button type="button" className="adm-btn adm-btn-sm" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}>
                      ↓
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn-sm adm-btn-danger"
                      onClick={() => setBlocks((bs) => bs.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="adm-grid2">
                  <label className="adm-label">
                    Type
                    <select className="adm-input" value={type} onChange={(e) => update(i, { type: e.target.value })}>
                      {!BLOCK_TYPES.includes(type) && <option value={type}>{type}</option>}
                      {BLOCK_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="adm-label">
                    Variant
                    <input
                      className="adm-input"
                      list={`variants-${type}`}
                      value={s(b.variant)}
                      onChange={(e) => update(i, { variant: e.target.value })}
                      placeholder={variants[0] ?? 'optional'}
                    />
                    <datalist id={`variants-${type}`}>
                      {variants.map((v) => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                  </label>
                  {type === 'slot' && (
                    <label className="adm-label">
                      Slot (4–10)
                      <select className="adm-input" value={s(b.slot) || '4'} onChange={(e) => update(i, { slot: Number(e.target.value) })}>
                        {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} — {SLOT_HINT[n]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="adm-label">
                    Heading
                    <input
                      className="adm-input"
                      value={s(b.heading ?? b.headline ?? b.label)}
                      onChange={(e) => update(i, { heading: e.target.value }, ['headline', 'label'])}
                    />
                  </label>
                </div>
                <label className="adm-label">
                  Body
                  <textarea
                    className="adm-input"
                    rows={3}
                    value={s(b.subheadline ?? b.body ?? b.description)}
                    onChange={(e) => update(i, { body: e.target.value }, ['subheadline', 'description'])}
                  />
                </label>
                <div className="adm-grid2">
                  <label className="adm-label">
                    Button label
                    <input className="adm-input" value={s(b.buttonLabel)} onChange={(e) => update(i, { buttonLabel: e.target.value })} />
                  </label>
                  <label className="adm-label">
                    Button link
                    <input className="adm-input" value={s(b.buttonHref ?? b.href)} placeholder="/contact" onChange={(e) => update(i, { buttonHref: e.target.value }, ['href'])} />
                  </label>
                  <label className="adm-label">
                    Second button label
                    <input className="adm-input" value={s(b.button2Label)} onChange={(e) => update(i, { button2Label: e.target.value })} />
                  </label>
                  <label className="adm-label">
                    Second button link
                    <input className="adm-input" value={s(b.button2Href)} placeholder="/sign-up" onChange={(e) => update(i, { button2Href: e.target.value })} />
                  </label>
                </div>
                <label className="adm-label">
                  Items <span className="adm-muted">(one per line; use “Title|Description” for two-part items)</span>
                  <textarea
                    className="adm-input"
                    rows={4}
                    defaultValue={itemsToText(b.items ?? b.faqs)}
                    key={`items-${i}-${type}`}
                    onChange={(e) =>
                      update(
                        i,
                        { items: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean) },
                        ['faqs'],
                      )
                    }
                  />
                </label>
              </div>
            );
          })}
          <div className="adm-add">
            <span className="adm-muted">Add block:</span>
            {BLOCK_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                className="adm-btn adm-btn-sm"
                onClick={() => setBlocks((bs) => [...bs, { type: t, ...(t === 'slot' ? { slot: 4 } : {}) }])}
              >
                + {t}
              </button>
            ))}
          </div>
        </>
      )}

      {msg && <div className={msg.kind === 'ok' ? 'adm-alert adm-alert-ok' : 'adm-alert adm-alert-err'}>{msg.text}</div>}
      <div className="adm-savebar">
        <button type="button" className="adm-btn adm-btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save page'}
        </button>
        <button type="button" className="adm-btn" onClick={() => router.push('/admin/pages')}>
          Back to pages
        </button>
      </div>
    </div>
  );
}
