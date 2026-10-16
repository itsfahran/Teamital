'use client';

import Link from 'next/link';
import { createContext, useContext, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/admin-client';
import { diffContent, isObj, sameValue } from '@/lib/content/utils';
import { ImageField } from './ImageField';
import { RichTextEditor } from './RichTextEditor';

export type Path = Array<string | number>;
type Json = unknown;

const RICH_KEY = /^(body|text|description|intro|answer|a|paragraphs|onePara|summary|content|subtext|details|sub|captionText)$/i;
const IMAGE_KEY = /(image|img|photo|picture|logo|cover|thumbnail|banner|avatar|background)$/i;
const LINK_KEY = /(href|url|link)$/i;
const TONES = ['blue', 'violet', 'green', 'amber', 'rose', 'sky'];
const BLOCK_TYPES = ['heading', 'paragraph', 'list'];

const humanize = (k: string) => {
  const s = k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const setAt = (root: Json, path: Path, value: Json): Json => {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const next = [...root];
    next[head as number] = setAt(root[head as number], rest, value);
    return next;
  }
  return { ...(root as Record<string, Json>), [head]: setAt((root as Record<string, Json>)[head as string], rest, value) };
};

const firstText = (v: Json): string => {
  if (typeof v === 'string') return v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (isObj(v)) {
    for (const k of ['title', 'name', 'q', 'label', 'heading', 'tab', 'text', 'quote', 'role']) if (typeof v[k] === 'string' && v[k]) return firstText(v[k]);
    if (Array.isArray(v.items) && typeof v.items[0] === 'string') return '• ' + firstText(v.items[0]);
    for (const [k, x] of Object.entries(v)) if (k !== 'type' && k !== 'kind' && typeof x === 'string' && x) return firstText(x);
  }
  return '';
};

function Leaf({ label, k, parentKey, value, onChange }: { label: string; k: string; parentKey: string; value: string; onChange: (v: string) => void }) {
  const key = typeof k === 'string' ? k : parentKey;
  if (IMAGE_KEY.test(key))
    return (
      <div className="cx-field">
        <div className="cx-label">{label}</div>
        <ImageField value={value} onChange={onChange} />
      </div>
    );
  if (RICH_KEY.test(key) || RICH_KEY.test(parentKey))
    return (
      <div className="cx-field">
        <div className="cx-label">{label}</div>
        <RichTextEditor value={value} onChange={onChange} />
      </div>
    );
  if (key === 'changefreq' || key === 'priority') {
    const opts = key === 'changefreq' ? ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] : ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'];
    return (
      <label className="cx-field">
        <span className="cx-label">{label}</span>
        <select className="adm-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {[...new Set([value, ...opts])].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
    );
  }
  if (key === 'tone')
    return (
      <label className="cx-field">
        <span className="cx-label">{label}</span>
        <select className="adm-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {[...new Set([value, ...TONES])].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
    );
  if (key === 'icon')
    return (
      <label className="cx-field">
        <span className="cx-label">{label} <i>(Material icon name, e.g. rocket_launch)</i></span>
        <span className="cx-icon">
          <span className="mi">{value || 'help'}</span>
          <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />
        </span>
      </label>
    );
  const long = value.length > 110 || value.includes('\n');
  return (
    <label className="cx-field">
      <span className="cx-label">{label}</span>
      {long ? (
        <textarea className="adm-input" rows={Math.min(8, Math.ceil(value.length / 90) + 1)} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="adm-input" value={value} placeholder={LINK_KEY.test(key) ? '/page or https://…' : ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export const Labels = createContext<Record<string, string>>({});

export function Node({ label: baseLabel, k, parentKey, value, path, set, depth, flat: flatProp = false }: { label: string; k: string; parentKey: string; value: Json; path: Path; set: (p: Path, v: Json) => void; depth: number; flat?: boolean }) {
  const labels = useContext(Labels);
  const label = labels[path.filter((x) => typeof x === "string").join(".")] ?? baseLabel;
  const [open, setOpen] = useState(depth < 1);

  if (typeof value === 'string')
    return <Leaf label={label} k={k} parentKey={parentKey} value={value} onChange={(v) => set(path, v)} />;

  if (typeof value === 'number')
    return (
      <label className="cx-field">
        <span className="cx-label">{label}</span>
        <input className="adm-input" type="number" value={value} onChange={(e) => set(path, Number(e.target.value))} />
      </label>
    );

  if (typeof value === 'boolean')
    return (
      <label className="cx-field cx-check">
        <input type="checkbox" checked={value} onChange={(e) => set(path, e.target.checked)} />
        <span className="cx-label">{label}</span>
      </label>
    );

  if (Array.isArray(value)) {
    const mutate = (next: Json[]) => set(path, next);
    const blank = (tpl: Json): Json => (typeof tpl === 'string' ? '' : Array.isArray(tpl) ? [] : isObj(tpl) ? Object.fromEntries(Object.entries(tpl).map(([kk, vv]) => [kk, typeof vv === 'string' ? '' : vv])) : tpl);
    const simple = value.every((v) => typeof v === 'string');
    return (
      <section className="cx-group">
        <header className="cx-group-h" onClick={() => setOpen(!open)}>
          <span className="mi">{open ? 'expand_more' : 'chevron_right'}</span>
          <b>{label}</b>
          <span className="cx-count">{value.length}</span>
        </header>
        {open && (
          <div className="cx-group-b">
            {value.map((item, i) => (
              <ArrayItem
                key={i}
                index={i}
                total={value.length}
                title={firstText(item)}
                simple={simple}
                onMove={(d) => {
                  const j = i + d;
                  if (j < 0 || j >= value.length) return;
                  const next = [...value];
                  [next[i], next[j]] = [next[j], next[i]];
                  mutate(next);
                }}
                onDelete={() => mutate(value.filter((_, x) => x !== i))}
                onDuplicate={() => mutate([...value.slice(0, i + 1), JSON.parse(JSON.stringify(item)), ...value.slice(i + 1)])}
              >
                <Node label={simple ? label.replace(/s$/, '') : `Item ${i + 1}`} k={simple ? parentKey || k : String(i)} parentKey={k} value={item} path={[...path, i]} set={set} depth={depth + 1} flat />
              </ArrayItem>
            ))}
            <button type="button" className="adm-btn" onClick={() => mutate([...value, value.length ? blank(value[value.length - 1]) : ''])}>
              + Add {label.toLowerCase().replace(/s$/, '')}
            </button>
          </div>
        )}
      </section>
    );
  }

  if (isObj(value) && typeof value.type === 'string' && BLOCK_TYPES.includes(value.type) && 'text' in value && 'items' in value) {
    const t = value.type;
    return (
      <div className="cx-flat">
        <label className="cx-field">
          <span className="cx-label">Block type</span>
          <select className="adm-input" value={t} onChange={(e) => set([...path, 'type'], e.target.value)}>
            <option value="heading">Heading</option>
            <option value="paragraph">Paragraph (rich text)</option>
            <option value="list">Bullet list</option>
          </select>
        </label>
        {t === 'heading' && <Leaf label="Heading" k="heading" parentKey="" value={String(value.text)} onChange={(v) => set([...path, 'text'], v)} />}
        {t === 'paragraph' && <Leaf label="Text" k="text" parentKey="" value={String(value.text)} onChange={(v) => set([...path, 'text'], v)} />}
        {t === 'list' && <Node label="List items" k="items" parentKey="items" value={value.items} path={[...path, 'items']} set={set} depth={depth + 1} />}
      </div>
    );
  }

  if (isObj(value)) {
    const entries = Object.entries(value);
    const flat = depth === 0 || flatProp;
    const body = entries.map(([kk, vv]) => (
      <Node key={kk} label={humanize(kk)} k={kk} parentKey={k} value={vv} path={[...path, kk]} set={set} depth={depth + 1} />
    ));
    if (flat) return <div className="cx-flat">{body}</div>;
    return (
      <section className="cx-group">
        <header className="cx-group-h" onClick={() => setOpen(!open)}>
          <span className="mi">{open ? 'expand_more' : 'chevron_right'}</span>
          <b>{label}</b>
        </header>
        {open && <div className="cx-group-b">{body}</div>}
      </section>
    );
  }
  return null;
}

function ArrayItem({
  index, total, title, simple, onMove, onDelete, onDuplicate, children,
}: {
  index: number; total: number; title: string; simple: boolean; onMove: (d: number) => void; onDelete: () => void; onDuplicate: () => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(simple);
  return (
    <div className="cx-item">
      <div className="cx-item-h">
        <button type="button" className="cx-item-t" onClick={() => setOpen(!open)}>
          <span className="cx-num">{index + 1}</span>
          <span className="cx-item-txt">{title ? (title.length > 70 ? `${title.slice(0, 70)}…` : title) : '(empty)'}</span>
          <span className="mi">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
        <span className="cx-item-btns">
          <button type="button" title="Move up" disabled={index === 0} onClick={() => onMove(-1)}><span className="mi">arrow_upward</span></button>
          <button type="button" title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}><span className="mi">arrow_downward</span></button>
          <button type="button" title="Duplicate" onClick={onDuplicate}><span className="mi">content_copy</span></button>
          <button type="button" title="Delete" onClick={() => confirm('Delete this item?') && onDelete()}><span className="mi">delete</span></button>
        </span>
      </div>
      {open && <div className="cx-item-b">{children}</div>}
    </div>
  );
}

export function ContentEditor({ pageKey, label, route, defaults, initial, hasOverride, labels = {} }: { pageKey: string; label: string; route: string; defaults: Json; initial: Json; hasOverride: boolean; labels?: Record<string, string> }) {
  const [data, setData] = useState<Json>(initial);
  const [saved, setSaved] = useState<Json>(initial);
  const [overridden, setOverridden] = useState(hasOverride);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const dirty = useMemo(() => !sameValue(data, saved), [data, saved]);

  const set = (p: Path, v: Json) => {
    setMsg(null);
    setData((d: Json) => setAt(d, p, v));
  };

  const save = async () => {
    setBusy(true);
    setMsg(null);
    const sb = createClient();
    const override = diffContent(defaults, data);
    const { data: u } = await sb.auth.getUser();
    const { error } = override === undefined
      ? await sb.from('site_content').delete().eq('page_key', pageKey)
      : await sb.from('site_content').upsert({ page_key: pageKey, data: override, updated_by: u.user?.id ?? null });
    setBusy(false);
    if (error) return setMsg({ kind: 'err', text: error.message });
    await revalidateSite();
    setSaved(data);
    setOverridden(override !== undefined);
    setMsg({ kind: 'ok', text: 'Saved and published. The live page is updated.' });
  };

  const reset = async () => {
    if (!confirm('Reset this page to its original content? All your edits on it will be removed.')) return;
    setBusy(true);
    const { error } = await createClient().from('site_content').delete().eq('page_key', pageKey);
    setBusy(false);
    if (error) return setMsg({ kind: 'err', text: error.message });
    await revalidateSite();
    setData(defaults);
    setSaved(defaults);
    setOverridden(false);
    setMsg({ kind: 'ok', text: 'Page reset to its original content.' });
  };

  return (
    <div className="cx">
      <div className="adm-head">
        <div>
          <h1 className="adm-h1" style={{ margin: 0 }}>{label}</h1>
          <p className="adm-muted" style={{ margin: '4px 0 0' }}>
            Edit every heading, description, image and button on this page. Descriptions have a formatting toolbar.
          </p>
        </div>
        <div className="cx-top-btns">
          <a className="adm-btn" href={route} target="_blank" rel="noopener noreferrer">View page ↗</a>
          <Link className="adm-btn" href="/admin/content">All pages</Link>
        </div>
      </div>

      {msg && <div className={msg.kind === 'ok' ? 'adm-alert adm-alert-ok' : 'adm-alert adm-alert-err'}>{msg.text}</div>}

      <div className="cx-body">
        <Labels.Provider value={labels}>
          <Node label={label} k="root" parentKey="" value={data} path={[]} set={set} depth={0} />
        </Labels.Provider>
      </div>

      <div className="adm-savebar cx-save">
        <span className="adm-muted">{dirty ? 'You have unsaved changes' : overridden ? 'Customised: differs from the original text' : 'Showing the original content'}</span>
        <span style={{ flex: 1 }} />
        {overridden && (
          <button className="adm-btn adm-btn-danger" onClick={reset} disabled={busy}>
            Reset to original
          </button>
        )}
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={busy || !dirty}>
          {busy ? 'Saving…' : 'Save & publish'}
        </button>
      </div>
    </div>
  );
}
