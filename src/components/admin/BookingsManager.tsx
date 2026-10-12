'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  team_size: string | null;
  topic: string | null;
  message: string | null;
  start_at: string;
  end_at: string;
  visitor_tz: string | null;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  admin_notes: string | null;
  created_at: string;
  meet_link?: string | null;
};

const STATUS_LABEL: Record<Booking['status'], string> = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'cancelled' | 'all'>('upcoming');
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const now = Date.now();

  const shown = useMemo(() => {
    const list = bookings.filter((b) => {
      const future = new Date(b.start_at).getTime() >= now;
      if (filter === 'upcoming') return b.status === 'confirmed' && future;
      if (filter === 'past') return b.status !== 'cancelled' && !(b.status === 'confirmed' && future);
      if (filter === 'cancelled') return b.status === 'cancelled';
      return true;
    });
    return filter === 'upcoming' ? [...list].reverse() : list;
  }, [bookings, filter, now]);

  const counts = {
    upcoming: bookings.filter((b) => b.status === 'confirmed' && new Date(b.start_at).getTime() >= now).length,
    all: bookings.length,
  };

  const setStatus = async (b: Booking, status: Booking['status']) => {
    if (status === 'cancelled') {
      await fetch('/api/admin/bookings/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id }) });
    } else {
      await createClient().from('meeting_bookings').update({ status }).eq('id', b.id);
    }
    router.refresh();
  };
  const saveNotes = async (b: Booking) => {
    await createClient().from('meeting_bookings').update({ admin_notes: notes[b.id] ?? b.admin_notes ?? '' }).eq('id', b.id);
    router.refresh();
  };
  const remove = async (b: Booking) => {
    if (!confirm(`Delete the booking from ${b.name}?`)) return;
    await createClient().from('meeting_bookings').delete().eq('id', b.id);
    router.refresh();
  };

  return (
    <>
      <div className="adm-cards">
        <div className="adm-card adm-stat">
          <div className="adm-stat-v">{counts.upcoming}</div>
          <div className="adm-stat-l">Upcoming calls</div>
        </div>
        <div className="adm-card adm-stat">
          <div className="adm-stat-v">{counts.all}</div>
          <div className="adm-stat-l">All bookings</div>
        </div>
      </div>

      <div className="adm-tabs">
        {(['upcoming', 'past', 'cancelled', 'all'] as const).map((f) => (
          <button key={f} className={filter === f ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="adm-card">
        {shown.length === 0 && <div className="adm-empty">No bookings here.</div>}
        {shown.map((b) => {
          const isOpen = open === b.id;
          return (
            <div key={b.id} className="adm-msg">
              <button className="adm-msg-head" onClick={() => setOpen(isOpen ? null : b.id)}>
                <div>
                  <b>{fmt(b.start_at)}</b> <span className={b.status === 'confirmed' ? 'adm-pill adm-pill-ok' : 'adm-pill'}>{STATUS_LABEL[b.status]}</span>
                  <div className="adm-muted">
                    {b.name} · {b.email}
                    {b.company ? ` · ${b.company}` : ''}
                  </div>
                </div>
                <div className="adm-muted">{b.topic ?? ''}</div>
              </button>
              {isOpen && (
                <div className="adm-msg-body">
                  <div className="adm-grid2">
                    <div>
                      <div className="adm-muted">Phone</div>
                      {b.phone || '—'}
                    </div>
                    <div>
                      <div className="adm-muted">Team size</div>
                      {b.team_size || '—'}
                    </div>
                    <div>
                      <div className="adm-muted">Visitor time zone</div>
                      {b.visitor_tz || '—'}
                    </div>
                    <div>
                      <div className="adm-muted">Booked on</div>
                      {fmt(b.created_at)}
                    </div>
                  </div>
                  {b.message && <p style={{ marginTop: 12 }}>{b.message}</p>}
                  <label className="adm-label" style={{ marginTop: 12 }}>
                    Internal notes
                    <textarea className="adm-input" rows={2} defaultValue={b.admin_notes ?? ''} onChange={(e) => setNotes({ ...notes, [b.id]: e.target.value })} />
                  </label>
                  <div className="adm-actions" style={{ justifyContent: 'flex-start' }}>
                    {b.meet_link && (
                      <a className="adm-btn adm-btn-sm adm-btn-primary" href={b.meet_link} target="_blank" rel="noopener noreferrer">
                        Join Meet
                      </a>
                    )}
                    <a className="adm-btn adm-btn-sm" href={`mailto:${b.email}?subject=${encodeURIComponent('Your Teamital call')}`}>
                      Email
                    </a>
                    <button className="adm-btn adm-btn-sm" onClick={() => saveNotes(b)}>
                      Save notes
                    </button>
                    {b.status !== 'completed' && (
                      <button className="adm-btn adm-btn-sm" onClick={() => setStatus(b, 'completed')}>
                        Mark completed
                      </button>
                    )}
                    {b.status !== 'no_show' && (
                      <button className="adm-btn adm-btn-sm" onClick={() => setStatus(b, 'no_show')}>
                        No show
                      </button>
                    )}
                    {b.status !== 'confirmed' && (
                      <button className="adm-btn adm-btn-sm" onClick={() => setStatus(b, 'confirmed')}>
                        Reopen
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => setStatus(b, 'cancelled')}>
                        Cancel
                      </button>
                    )}
                    <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(b)}>
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
