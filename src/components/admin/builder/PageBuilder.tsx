'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { revalidateSite } from '@/lib/admin-client';
import { RESERVED_SLUGS } from '@/lib/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_BY_TYPE, SECTION_DEFS, newSection, type SectionBlock, type SectionType, type ThumbBox } from '@/content/sections';
import { Labels, Node, setAt, type Path } from '../content/ContentEditor';

export type BuilderPage = {
  id: string;
  slug: string;
  title: string;
  status: string;
  sections: SectionBlock[];
  metaTitle: string;
  metaDescription: string;
};

const THUMB_COLORS: Record<ThumbBox[4], string> = {
  title: '#1a56db',
  text: '#c7d2e5',
  img: 'linear-gradient(135deg,#93c5fd,#38bdf8)',
  btn: '#1a56db',
  card: '#ffffff',
  dark: 'linear-gradient(135deg,#0b1b4d,#1a56db)',
  line: '#dbe3ef',
};

/** Tiny wireframe of a layout, drawn from the variant's box list. */
export function Thumb({ boxes }: { boxes: ThumbBox[] }) {
  return (
    <div className="pb-thumb" aria-hidden="true">
      {boxes.map(([x, y, w, h, k], i) => (
        <i
          key={i}
          className={`pb-th pb-th-${k}`}
          style={{ left: `${x}%`, top: `${(y / 60) * 100}%`, width: `${w}%`, height: `${(h / 60) * 100}%`, background: THUMB_COLORS[k] }}
        />
      ))}
    </div>
  );
}

function SectionCard({
  section, index, total, onChange, onVariant, onMove, onDelete, onDuplicate,
}: {
  section: SectionBlock; index: number; total: number;
  onChange: (p: Path, v: unknown) => void; onVariant: (v: string) => void;
  onMove: (d: number) => void; onDelete: () => void; onDuplicate: () => void;
}) {
  const def = SECTION_BY_TYPE[section.type];
  const [open, setOpen] = useState(false);
  const variant = def.variants.find((v) => v.id === section.variant) ?? def.variants[0];

  return (
    <div className="pb-sec">
      <div className="pb-sec-h">
        <button type="button" className="pb-sec-t" onClick={() => setOpen(!open)}>
          <span className="pb-sec-n">{index + 1}</span>
          <span className="pb-sec-ico">
            <span className="mi">{def.icon}</span>
          </span>
          <span className="pb-sec-name">
            <b>{def.label}</b>
            <i>{variant.label}</i>
          </span>
          <span className="mi">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
        <span className="cx-item-btns">
          <button type="button" title="Move up" disabled={index === 0} onClick={() => onMove(-1)}><span className="mi">arrow_upward</span></button>
          <button type="button" title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}><span className="mi">arrow_downward</span></button>
          <button type="button" title="Duplicate" onClick={onDuplicate}><span className="mi">content_copy</span></button>
          <button type="button" title="Delete" onClick={() => confirm(`Delete this ${def.label} section?`) && onDelete()}><span className="mi">delete</span></button>
        </span>
      </div>

      {open && (
        <div className="pb-sec-b">
          <div className="cx-label">Design variant</div>
          <div className="pb-variants">
            {def.variants.map((v) => (
              <button type="button" key={v.id} className={v.id === section.variant ? 'pb-var pb-var-on' : 'pb-var'} onClick={() => onVariant(v.id)}>
                <Thumb boxes={v.thumb} />
                <b>{v.label}</b>
                <i>{v.description}</i>
              </button>
            ))}
          </div>
          <div className="pb-fields">
            <Labels.Provider value={def.labels ?? {}}>
              <Node label={def.label} k="root" parentKey="" value={section.data} path={[]} set={onChange} depth={0} />
            </Labels.Provider>
          </div>
        </div>
      )}
    </div>
  );
}

export function PageBuilder({ initial }: { initial: BuilderPage | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? '');
  const [sections, setSections] = useState<SectionBlock[]>(initial?.sections ?? []);
  const [picker, setPicker] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [pageId, setPageId] = useState(initial?.id ?? null);

  const mutate = (fn: (s: SectionBlock[]) => SectionBlock[]) => {
    setMsg(null);
    setSections(fn);
  };
  const autoSlug = useMemo(() => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), [title]);

  const save = async (publish?: boolean) => {
    setMsg(null);
    const cleanSlug = (slug.trim() || autoSlug).toLowerCase();
    if (!title.trim()) return setMsg({ kind: 'err', text: 'Please give the page a title.' });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cleanSlug)) return setMsg({ kind: 'err', text: 'The address may contain lowercase letters, numbers and single dashes only.' });
    if (RESERVED_SLUGS.has(cleanSlug)) return setMsg({ kind: 'err', text: `“${cleanSlug}” is used by the site already. Please choose another address.` });
    const nextStatus = publish === undefined ? status : publish ? 'published' : 'draft';

    setBusy(true);
    const db = createClient();
    const row = { slug: cleanSlug, title: title.trim(), h1: title.trim(), status: nextStatus, content: sections };
    let id = pageId;
    if (id) {
      const { error } = await db.from('cms_pages').update(row).eq('id', id);
      if (error) {
        setBusy(false);
        return setMsg({ kind: 'err', text: error.code === '23505' ? 'Another page already uses this address.' : error.message });
      }
    } else {
      const { data, error } = await db.from('cms_pages').insert(row).select('id').single();
      if (error || !data) {
        setBusy(false);
        return setMsg({ kind: 'err', text: error?.code === '23505' ? 'Another page already uses this address.' : (error?.message ?? 'Could not create the page.') });
      }
      id = data.id as string;
      setPageId(id);
    }
    await db.from('cms_seo').upsert({ page_id: id, meta_title: metaTitle.trim() || null, meta_description: metaDescription.trim() || null }, { onConflict: 'page_id' });
    await revalidateSite();
    setBusy(false);
    setSlug(cleanSlug);
    setStatus(nextStatus);
    setMsg({ kind: 'ok', text: nextStatus === 'published' ? 'Saved and published. The page is live.' : 'Saved as a draft. Use Preview to see it.' });
    if (!initial) router.replace(`/admin/pages/${id}`);
    else router.refresh();
  };

  return (
    <div className="pb">
      <div className="adm-card adm-form">
        <div className="adm-grid2">
          <label className="adm-label">
            Page title
            <input className="adm-input" value={title} placeholder="e.g. GPS time tracking" onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="adm-label">
            Page address
            <span className="pb-slug">
              <i>/</i>
              <input className="adm-input" value={slug} placeholder={autoSlug || 'gps-time-tracking'} onChange={(e) => setSlug(e.target.value)} />
            </span>
          </label>
        </div>
        <div className="adm-grid2">
          <label className="adm-label">
            Search engine title
            <input className="adm-input" value={metaTitle} placeholder={title} onChange={(e) => setMetaTitle(e.target.value)} />
          </label>
          <label className="adm-label">
            Status
            <select className="adm-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft (not visible to visitors)</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <label className="adm-label">
          Search engine description
          <textarea className="adm-input" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </label>
      </div>

      <div className="adm-head">
        <h2 className="adm-h2">Sections ({sections.length})</h2>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setPicker(true)}>
          + Add section
        </button>
      </div>

      {sections.length === 0 && (
        <div className="adm-card pb-empty">
          <span className="mi">dashboard_customize</span>
          <b>This page has no sections yet</b>
          <p>Add a Hero, Features, Content, Benefits, Call to action, FAQ, Testimonials or Lead form section, and pick a design for each.</p>
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => setPicker(true)}>
            + Add your first section
          </button>
        </div>
      )}

      <div className="pb-list">
        {sections.map((sec, i) => (
          <SectionCard
            key={sec.id}
            section={sec}
            index={i}
            total={sections.length}
            onChange={(p, v) => mutate((all) => all.map((s, x) => (x === i ? { ...s, data: setAt(s.data, p, v) as Record<string, unknown> } : s)))}
            onVariant={(v) => mutate((all) => all.map((s, x) => (x === i ? { ...s, variant: v } : s)))}
            onMove={(d) =>
              mutate((all) => {
                const j = i + d;
                if (j < 0 || j >= all.length) return all;
                const next = [...all];
                [next[i], next[j]] = [next[j], next[i]];
                return next;
              })
            }
            onDelete={() => mutate((all) => all.filter((_, x) => x !== i))}
            onDuplicate={() =>
              mutate((all) => {
                const copy = { ...JSON.parse(JSON.stringify(sec)), id: `s_${Math.random().toString(36).slice(2, 10)}` } as SectionBlock;
                return [...all.slice(0, i + 1), copy, ...all.slice(i + 1)];
              })
            }
          />
        ))}
      </div>

      {msg && <div className={msg.kind === 'ok' ? 'adm-alert adm-alert-ok' : 'adm-alert adm-alert-err'}>{msg.text}</div>}

      <div className="adm-savebar cx-save">
        <Link className="adm-btn" href="/admin/pages">
          All pages
        </Link>
        <span style={{ flex: 1 }} />
        {pageId && (
          <a className="adm-btn" href={`/preview/${pageId}`} target="_blank" rel="noopener noreferrer">
            Preview ↗
          </a>
        )}
        <button className="adm-btn" onClick={() => save(false)} disabled={busy}>
          Save as draft
        </button>
        <button className="adm-btn adm-btn-primary" onClick={() => save(true)} disabled={busy}>
          {busy ? 'Saving…' : status === 'published' ? 'Save & publish' : 'Publish'}
        </button>
      </div>

      {picker && (
        <div className="pb-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && setPicker(false)}>
          <div className="pb-modal-in">
            <div className="adm-head">
              <h2 className="adm-h2">Add a section</h2>
              <button type="button" className="adm-btn" onClick={() => setPicker(false)}>
                Close
              </button>
            </div>
            <div className="pb-types">
              {SECTION_DEFS.map((d) => (
                <button
                  type="button"
                  key={d.type}
                  className="pb-type"
                  onClick={() => {
                    mutate((all) => [...all, newSection(d.type as SectionType)]);
                    setPicker(false);
                  }}
                >
                  <span className="pb-sec-ico">
                    <span className="mi">{d.icon}</span>
                  </span>
                  <b>{d.label}</b>
                  <i>{d.description}</i>
                  <em>{d.variants.length} designs</em>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
