'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DURATIONS } from '@/lib/booking-constants';
import { useChrome } from '../ChromeProvider';
import { Icon, cx } from '../ui';
import { CopyLink } from './CopyLink';

type Availability = {
  enabled: boolean;
  slotMinutes: number;
  durations?: number[];
  businessTimezone: string;
  hostName: string;
  slots: string[];
};

type Done = { token: string; start: string; end: string; meetingLink: string | null; googleInvite?: boolean };

const pad = (n: number) => String(n).padStart(2, '0');
/** Calendar day (YYYY-MM-DD) of an instant in the given time zone. */
const dayKeyIn = (d: Date, tz: string) => {
  const p: Record<string, string> = {};
  for (const x of new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d)) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}`;
};
/** The four time zones offered in the pop-up. */
const MAIN_ZONES = [
  { id: 'Europe/Dublin', name: 'Ireland / UK', city: 'Dublin' },
  { id: 'America/New_York', name: 'US East', city: 'New York' },
  { id: 'Asia/Dubai', name: 'Gulf', city: 'Dubai' },
  { id: 'Asia/Karachi', name: 'Pakistan', city: 'Karachi' },
];
const offsetMin = (tz: string) => {
  try {
    const v = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date()).find((x) => x.type === 'timeZoneName')?.value ?? 'GMT';
    const m = /GMT([+-])(\d+)(?::(\d+))?/.exec(v);
    return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +(m[3] ?? 0)) : 0;
  } catch {
    return 0;
  }
};
const offsetLabel = (tz: string) => {
  const o = offsetMin(tz);
  const a = Math.abs(o);
  return `GMT${o < 0 ? '-' : '+'}${Math.floor(a / 60)}${a % 60 ? ':' + pad(a % 60) : ''}`;
};
/** The main zone closest to the visitor's own clock. */
const nearestMain = (detected: string) => {
  const o = offsetMin(detected);
  return MAIN_ZONES.reduce((best, z) => (Math.abs(offsetMin(z.id) - o) < Math.abs(offsetMin(best.id) - o) ? z : best)).id;
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function BookingWidget() {
  const t = useChrome().booking;
  const [av, setAv] = useState<Availability | null>(null);
  const [error, setError] = useState('');
  const [tz, setTz] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', teamSize: '', topic: t.topics[0] ?? '', message: '' });
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState<Done | null>(null);

  const load = () =>
    fetch('/api/booking/availability', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Availability) => setAv(d))
      .catch(() => setError(t.loadError));

  useEffect(() => {
    setTz(nearestMain(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'));
    void load();
  }, []);

  // Slots grouped by the visitor's own calendar day.
  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of av?.slots ?? []) {
      const k = dayKeyIn(new Date(iso), tz || 'UTC');
      map.set(k, [...(map.get(k) ?? []), iso]);
    }
    return map;
  }, [av, tz]);


  // Start on the first month that has availability.
  useEffect(() => {
    if (!av || month) return;
    if (!tz) return;
    const k = (av.slots[0] ? dayKeyIn(new Date(av.slots[0]), tz) : dayKeyIn(new Date(), tz)).split('-');
    setMonth({ y: +k[0], m: +k[1] - 1 });
  }, [av, month, tz]);

  const keys = [...byDay.keys()].sort();
  const firstDay = keys[0] ? { y: +keys[0].slice(0, 4), m: +keys[0].slice(5, 7) - 1 } : null;
  const lastDay = keys.length ? { y: +keys[keys.length - 1].slice(0, 4), m: +keys[keys.length - 1].slice(5, 7) - 1 } : null;

  const timeFmt = useMemo(() => new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', timeZone: tz || undefined }), [tz]);
  const longFmt = useMemo(() => new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz || undefined }), [tz]);
  const dayFmt = useMemo(() => new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }), []);

  const cells = useMemo(() => {
    if (!month) return [];
    const first = new Date(month.y, month.m, 1);
    const lead = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(month.y, month.m + 1, 0).getDate();
    const out: Array<{ d: number; key: string } | null> = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) out.push({ d, key: `${month.y}-${pad(month.m + 1)}-${pad(d)}` });
    return out;
  }, [month]);

  const canPrev = !!(month && firstDay && (month.y > firstDay.y || (month.y === firstDay.y && month.m > firstDay.m)));
  const canNext = !!(month && lastDay && (month.y < lastDay.y || (month.y === lastDay.y && month.m < lastDay.m)));
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
        body: JSON.stringify({ ...form, start: slot, timezone: tz, duration }),
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
  if (!av) return <div className="bk-card bk-loading"><span className="cf-spin bk-spin" /> {t.loading}</div>;
  if (!av.enabled || av.slots.length === 0) {
    return (
      <div className="bk-card bk-msg">
        <Icon name="event_busy" size={40} color="#9CA3AF" />
        <h3>{t.noTimesTitle}</h3>
        <p>{t.noTimesText}</p>
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
        <h3>{t.doneTitle}</h3>
        <p>
          {t.sentTo} <b>{form.email}</b>.{done.googleInvite ? ` ${t.inviteNote}` : ''}
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
            <span>{done.meetingLink ? t.meetIncluded : t.meetLater}</span>
          </div>
        </div>
        {done.meetingLink && <CopyLink link={done.meetingLink} />}
        {done.meetingLink && (
          <p className="bk-sent">
            <Icon name="mark_email_read" size={18} color="#047857" />
            {t.emailedLinkTo} <b>{form.email}</b>.
          </p>
        )}
        <div className="bk-done-btns">
          {done.meetingLink && (
            <a className="hero-btn hero-btn-primary" href={done.meetingLink} target="_blank" rel="noopener noreferrer">
              <span>{t.joinMeet}</span>
              <Icon name="arrow_forward" size={20} color="#fff" />
            </a>
          )}
          <a className="hero-btn hero-btn-ghost" href={gcal(done)} target="_blank" rel="noopener noreferrer">
            <Icon name="event" size={20} color="#1A56DB" />
            <span>{t.googleCalendar}</span>
          </a>
          <a className="hero-btn hero-btn-ghost" href={`${origin}/api/booking/ics?token=${done.token}`}>
            <Icon name="download" size={20} color="#1A56DB" />
            <span>{t.icsButton}</span>
          </a>
        </div>
        <a className="bk-cancel" href={`/book-a-call/manage?token=${done.token}`}>
          {t.manageLink}
        </a>
      </div>
    );
  }

  /* ───────── Steps 1-2 ───────── */
  const daySlots = day ? (byDay.get(day) ?? []) : [];

  return (
    <div className="bk-card">
      <div className="bk-steps" aria-label="Progress">
        {t.steps.map((label, i) => (
          <span key={i} className={cx('bk-step', step === i + 1 && 'bk-step-on', step > i + 1 && 'bk-step-done')}>
            <b>{step > i + 1 ? <Icon name="check" size={14} color="#fff" /> : i + 1}</b>
            {label}
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
            <div className="bk-tzs" role="radiogroup" aria-label="Time zone">
              {MAIN_ZONES.map((z) => (
                <button
                  type="button"
                  key={z.id}
                  role="radio"
                  aria-checked={tz === z.id}
                  className={cx('bk-tzb', tz === z.id && 'bk-tzb-on')}
                  onClick={() => {
                    setTz(z.id);
                    setDay(null);
                    setSlot(null);
                    setMonth(null);
                  }}
                >
                  <b>{z.name}</b>
                  <span>
                    {z.city} · {offsetLabel(z.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bk-slots">
            <div className="bk-dur" role="radiogroup" aria-label="Call length">
              {(av.durations?.length ? av.durations : [...DURATIONS]).map((m) => (
                <button type="button" key={m} role="radio" aria-checked={duration === m} className={cx('bk-dur-b', duration === m && 'bk-dur-on')} onClick={() => setDuration(m)}>
                  {m} {t.minutesWord}
                </button>
              ))}
            </div>
            {!day ? (
              <div className="bk-slots-empty">
                <Icon name="touch_app" size={34} color="#93C5FD" />
                <span>{t.selectDate}</span>
              </div>
            ) : (
              <>
                <div className="bk-slots-t">{dayFmt.format(new Date(`${day}T12:00:00Z`))}</div>
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
                  <span>{t.continueButton}</span>
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
                {timeFmt.format(new Date(slot))} · {duration} {t.minutesWord} ·{tz.replace(/_/g, ' ')}
              </i>
            </span>
            <button type="button" onClick={() => setStep(1)}>
              {t.changeButton}
            </button>
          </div>

          <div className="bk-grid2">
            <label>
              {t.nameLabel}
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </label>
            <label>
              {t.emailLabel}
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </label>
            <label>
              {t.phoneLabel}
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </label>
            <label>
              {t.companyLabel}
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoComplete="organization" />
            </label>
            <label>
              {t.teamSizeLabel}
              <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                <option value="">{t.selectPlaceholder}</option>
                {t.teamSizes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label>
              {t.topicLabel}
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {t.topics.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            {t.messageLabel}
            <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </label>

          {formError && <div className="bk-err">{formError}</div>}

          <div className="bk-form-btns">
            <button type="button" className="hero-btn hero-btn-ghost" onClick={() => setStep(1)}>
              <Icon name="arrow_back" size={20} color="#1A56DB" />
              <span>{t.backButton}</span>
            </button>
            <button type="submit" className="hero-btn hero-btn-primary" disabled={busy}>
              {busy ? <span className="cf-spin" /> : <span>{t.confirmButton}</span>}
              {!busy && <Icon name="check" size={20} color="#fff" />}
            </button>
          </div>
          <p className="bk-fine">{t.finePrint}</p>
        </form>
      )}
    </div>
  );
}
