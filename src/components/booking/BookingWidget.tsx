'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { TEAM_SIZES, TOPICS } from '@/lib/booking-constants';
import { Icon, cx } from '../ui';

type Availability = {
  enabled: boolean;
  slotMinutes: number;
  businessTimezone: string;
  hostName: string;
  slots: string[];
};

type Done = { token: string; start: string; end: string; meetingLink: string | null; googleInvite?: boolean };

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function BookingWidget() {
  const [av, setAv] = useState<Availability | null>(null);
  const [error, setError] = useState('');
  const [tz, setTz] = useState('');
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', teamSize: '', topic: TOPICS[0] as string, message: '' });
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState<Done | null>(null);

  const load = () =>
    fetch('/api/booking/availability', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Availability) => setAv(d))
      .catch(() => setError('We could not load available times. Please refresh.'));

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    void load();
  }, []);

  // Slots grouped by the visitor's own calendar day.
  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of av?.slots ?? []) {
      const k = dayKey(new Date(iso));
      map.set(k, [...(map.get(k) ?? []), iso]);
    }
    return map;
  }, [av]);

  // Start on the first month that has availability.
  useEffect(() => {
    if (!av || month) return;
    const first = av.slots[0] ? new Date(av.slots[0]) : new Date();
    setMonth({ y: first.getFullYear(), m: first.getMonth() });
  }, [av, month]);

  const firstDay = av?.slots[0] ? new Date(av.slots[0]) : null;
  const lastDay = av?.slots.length ? new Date(av.slots[av.slots.length - 1]) : null;

  const timeFmt = useMemo(() => new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }), []);
  const longFmt = useMemo(() => new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), []);

  const cells = useMemo(() => {
    if (!month) return [];
    const first = new Date(month.y, month.m, 1);
    const lead = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(month.y, month.m + 1, 0).getDate();
    const out: Array<{ d: number; key: string } | null> = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) out.push({ d, key: `${month.y}-${pad(month.m + 1)}-${pad(d)}` });
    return out;
  }, [month]);

  const canPrev = !!(month && firstDay && (month.y > firstDay.getFullYear() || month.m > firstDay.getMonth()));
  const canNext = !!(month && lastDay && (month.y < lastDay.getFullYear() || month.m < lastDay.getMonth()));
  const shiftMonth = (delta: number) =>
    setMonth((cur) => {
      if (!cur) return cur;
      const d = new Date(cur.y, cur.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setFormError('');
    if (!form.name.trim()) return setFormError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setFormError('Please enter a valid email.');
    setBusy(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, start: slot, timezone: tz }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(data as Done);
        setStep(3);
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
        if (data.code === 'slot_taken') {
          await load();
          setSlot(null);
          setStep(1);
        }
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const gcal = (d: Done) => {
    const f = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Teamital: free 1:1 call',
      dates: `${f(d.start)}/${f(d.end)}`,
      details: d.meetingLink ? `Join: ${d.meetingLink}` : 'Teamital free 1:1 call',
      ...(d.meetingLink ? { location: d.meetingLink } : {}),
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  if (error) return <div className="bk-card bk-msg">{error}</div>;
  if (!av) return <div className="bk-card bk-loading"><span className="cf-spin bk-spin" /> Loading available times…</div>;
  if (!av.enabled || av.slots.length === 0) {
    return (
      <div className="bk-card bk-msg">
        <Icon name="event_busy" size={40} color="#9CA3AF" />
        <h3>No times available right now</h3>
        <p>New slots open up regularly. Please check back soon or email us and we will arrange a time.</p>
      </div>
    );
  }

  /* ───────── Step 3: confirmation ───────── */
  if (step === 3 && done) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      <div className="bk-card bk-done">
        <div className="bk-done-check">
          <Icon name="check" size={44} color="#fff" />
        </div>
        <h3>You are booked in!</h3>
        <p>
          We sent a confirmation to <b>{form.email}</b>.{done.googleInvite ? ' A Google Calendar invitation is on its way too.' : ''}
        </p>
        <div className="bk-summary">
          <div>
            <Icon name="event" size={20} color="#1A56DB" />
            <span>{longFmt.format(new Date(done.start))}</span>
          </div>
          <div>
            <Icon name="schedule" size={20} color="#1A56DB" />
            <span>
              {timeFmt.format(new Date(done.start))} – {timeFmt.format(new Date(done.end))} ({tz.replace(/_/g, ' ')})
            </span>
          </div>
          <div>
            <Icon name="videocam" size={20} color="#1A56DB" />
            <span>{done.meetingLink ? 'Google Meet link included' : 'Meeting details will be emailed to you'}</span>
          </div>
        </div>
        <div className="bk-done-btns">
          {done.meetingLink && (
            <a className="hero-btn hero-btn-primary" href={done.meetingLink} target="_blank" rel="noopener noreferrer">
              <span>Join Google Meet</span>
              <Icon name="arrow_forward" size={20} color="#fff" />
            </a>
          )}
          <a className="hero-btn hero-btn-ghost" href={gcal(done)} target="_blank" rel="noopener noreferrer">
            <Icon name="event" size={20} color="#1A56DB" />
            <span>Google Calendar</span>
          </a>
          <a className="hero-btn hero-btn-ghost" href={`${origin}/api/booking/ics?token=${done.token}`}>
            <Icon name="download" size={20} color="#1A56DB" />
            <span>Apple / Outlook (.ics)</span>
          </a>
        </div>
        <a className="bk-cancel" href={`/book-a-call/manage?token=${done.token}`}>
          Need to cancel? Manage this booking
        </a>
      </div>
    );
  }

  /* ───────── Steps 1-2 ───────── */
  const daySlots = day ? (byDay.get(day) ?? []) : [];

  return (
    <div className="bk-card">
      <div className="bk-steps" aria-label="Progress">
        {['Choose a time', 'Your details', 'Confirmed'].map((t, i) => (
          <span key={t} className={cx('bk-step', step === i + 1 && 'bk-step-on', step > i + 1 && 'bk-step-done')}>
            <b>{step > i + 1 ? <Icon name="check" size={14} color="#fff" /> : i + 1}</b>
            {t}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="bk-pick">
          <div className="bk-cal">
            <div className="bk-cal-head">
              <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Previous month">
                <Icon name="chevron_left" size={22} />
              </button>
              <span>{month ? `${MONTHS[month.m]} ${month.y}` : ''}</span>
              <button type="button" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Next month">
                <Icon name="chevron_right" size={22} />
              </button>
            </div>
            <div className="bk-dow">
              {DOW.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="bk-grid">
              {cells.map((c, i) =>
                c ? (
                  <button
                    type="button"
                    key={c.key}
                    disabled={!byDay.has(c.key)}
                    className={cx('bk-day', day === c.key && 'bk-day-on', byDay.has(c.key) && 'bk-day-has')}
                    onClick={() => {
                      setDay(c.key);
                      setSlot(null);
                    }}
                  >
                    {c.d}
                  </button>
                ) : (
                  <span key={`e${i}`} />
                ),
              )}
            </div>
            <div className="bk-tz">
              <Icon name="public" size={16} />
              Times shown in {tz.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="bk-slots">
            {!day ? (
              <div className="bk-slots-empty">
                <Icon name="touch_app" size={34} color="#93C5FD" />
                <span>Select a date to see available times</span>
              </div>
            ) : (
              <>
                <div className="bk-slots-t">{longFmt.format(new Date(`${day}T12:00:00`))}</div>
                <div className="bk-slot-list">
                  {daySlots.map((iso) => (
                    <button
                      type="button"
                      key={iso}
                      className={cx('bk-slot', slot === iso && 'bk-slot-on')}
                      onClick={() => setSlot(iso)}
                    >
                      {timeFmt.format(new Date(iso))}
                    </button>
                  ))}
                </div>
                <button type="button" className="hero-btn hero-btn-primary bk-next" disabled={!slot} onClick={() => setStep(2)}>
                  <span>Continue</span>
                  <Icon name="arrow_forward" size={20} color="#fff" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && slot && (
        <form className="bk-form" onSubmit={submit} noValidate>
          <div className="bk-chosen">
            <Icon name="event_available" size={22} color="#1A56DB" />
            <span>
              <b>{longFmt.format(new Date(slot))}</b>
              <i>
                {timeFmt.format(new Date(slot))} · {av.slotMinutes} min · {tz.replace(/_/g, ' ')}
              </i>
            </span>
            <button type="button" onClick={() => setStep(1)}>
              Change
            </button>
          </div>

          <div className="bk-grid2">
            <label>
              Full name *
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </label>
            <label>
              Work email *
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </label>
            <label>
              Phone
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </label>
            <label>
              Company
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoComplete="organization" />
            </label>
            <label>
              Team size
              <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                <option value="">Select…</option>
                {TEAM_SIZES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              What is the call about?
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Anything we should know? (optional)
            <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </label>

          {formError && <div className="bk-err">{formError}</div>}

          <div className="bk-form-btns">
            <button type="button" className="hero-btn hero-btn-ghost" onClick={() => setStep(1)}>
              <Icon name="arrow_back" size={20} color="#1A56DB" />
              <span>Back</span>
            </button>
            <button type="submit" className="hero-btn hero-btn-primary" disabled={busy}>
              {busy ? <span className="cf-spin" /> : <span>Confirm booking</span>}
              {!busy && <Icon name="check" size={20} color="#fff" />}
            </button>
          </div>
          <p className="bk-fine">By booking you agree to be contacted about your request. We never share your details.</p>
        </form>
      )}
    </div>
  );
}
