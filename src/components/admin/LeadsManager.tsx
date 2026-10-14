'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  page_path: string | null;
  form_name: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes: string | null;
  email_sent: boolean;
  created_at: string;
};

const STATUSES: Lead['status'][] = ['new', 'contacted', 'qualified', 'closed'];

const csvCell = (v: string | null | boolean) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export function LeadsManager({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [q, setQ] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return leads.filter(
      (l) => (filter === 'all' || l.status === filter) && (!s || [l.name, l.email, l.company, l.phone, l.message, l.page_path].some((x) => (x ?? '').toLowerCase().includes(s))),
    );
  }, [leads, filter, q]);

  const update = async (l: Lead, patch: Partial<Lead>) => {
    await createClient().from('leads').update(patch).eq('id', l.id);
    router.refresh();
  };

  const remove = async (l: Lead) => {
    if (!confirm(`Delete the lead from ${l.name}?`)) return;
    await createClient().from('leads').delete().eq('id', l.id);
    router.refresh();
  };

  const exportCsv = () => {
    const head = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Page', 'Form', 'Status', 'Notes'];
    const rows = shown.map((l) => [new Date(l.created_at).toISOString(), l.name, l.email, l.phone, l.company, l.message, l.page_path, l.form_name, l.status, l.notes]);
    const csv = [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `teamital-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="adm-tabs" style={{ flexWrap: 'wrap' }}>
        <button className={filter === 'all' ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => setFilter('all')}>
          All ({leads.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} className={filter === s ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => setFilter(s)}>
            {s[0].toUpperCase() + s.slice(1)} ({leads.filter((l) => l.status === s).length})
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <input className="adm-input" style={{ maxWidth: 240 }} placeholder="Search leads…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="adm-btn" onClick={exportCsv} disabled={shown.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="adm-card">
        {shown.length === 0 && <div className="adm-empty">No leads here yet.</div>}
        {shown.map((l) => {
          const isOpen = open === l.id;
          return (
            <div key={l.id} className={l.status === 'new' ? 'adm-msg adm-msg-new' : 'adm-msg'}>
              <button className="adm-msg-head" onClick={() => setOpen(isOpen ? null : l.id)}>
                <div>
                  <b>{l.name}</b> <span className="adm-muted">&lt;{l.email}&gt;</span>
                  {l.company && <span className="adm-muted"> · {l.company}</span>}
                  {l.status === 'new' && <span className="adm-badge">new</span>}
                  {!isOpen && (
                    <div className="adm-muted adm-clip">
                      {l.phone ? `${l.phone} · ` : ''}
                      {l.message || l.page_path || ''}
                    </div>
                  )}
                </div>
                <div className="adm-muted" suppressHydrationWarning>{new Date(l.created_at).toLocaleString()}</div>
              </button>
              {isOpen && (
                <div className="adm-msg-body">
                  <div className="ld-grid">
                    <div><span>Name</span><b>{l.name}</b></div>
                    <div><span>Email</span><b><a href={`mailto:${l.email}`}>{l.email}</a></b></div>
                    <div><span>Phone</span><b>{l.phone ? <a href={`tel:${l.phone}`}>{l.phone}</a> : '—'}</b></div>
                    <div><span>Company</span><b>{l.company || '—'}</b></div>
                    <div><span>Page</span><b>{l.page_path || '—'}</b></div>
                    <div><span>Form</span><b>{l.form_name || '—'}</b></div>
                    <div><span>Team emailed</span><b>{l.email_sent ? 'Yes' : 'No'}</b></div>
                  </div>
                  {l.message && <p style={{ whiteSpace: 'pre-wrap' }}>{l.message}</p>}
                  <label className="adm-label">
                    Internal notes
                    <textarea
                      className="adm-input"
                      rows={2}
                      value={notes[l.id] ?? l.notes ?? ''}
                      onChange={(e) => setNotes({ ...notes, [l.id]: e.target.value })}
                      onBlur={() => notes[l.id] !== undefined && notes[l.id] !== (l.notes ?? '') && update(l, { notes: notes[l.id] || null })}
                    />
                  </label>
                  <div className="adm-actions">
                    <select className="adm-input" style={{ width: 'auto' }} value={l.status} onChange={(e) => update(l, { status: e.target.value as Lead['status'] })}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <a className="adm-btn adm-btn-sm adm-btn-primary" href={`mailto:${l.email}?subject=${encodeURIComponent('Re: your enquiry to Teamital')}`}>
                      Reply
                    </a>
                    <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(l)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
