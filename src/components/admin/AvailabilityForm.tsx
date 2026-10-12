'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BookingSettings } from '@/lib/booking';

const DAYS = [
  [1, 'Mon'],
  [2, 'Tue'],
  [3, 'Wed'],
  [4, 'Thu'],
  [5, 'Fri'],
  [6, 'Sat'],
  [0, 'Sun'],
] as const;

const TIMEZONES = [
  'Europe/Dublin', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Istanbul',
  'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Australia/Sydney', 'UTC',
];

const hhmm = (t: string) => t.slice(0, 5);

export function AvailabilityForm({ initial }: { initial: BookingSettings }) {
  const [s, setS] = useState({
    ...initial,
    start_time: hhmm(initial.start_time),
    end_time: hhmm(initial.end_time),
    meeting_link: initial.meeting_link ?? '',
    host_email: initial.host_email ?? '',
  });
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleDay = (d: number) =>
    setS((cur) => ({ ...cur, weekdays: cur.weekdays.includes(d) ? cur.weekdays.filter((x) => x !== d) : [...cur.weekdays, d].sort() }));

  const save = async () => {
    setMsg(null);
    if (s.weekdays.length === 0) return setMsg({ kind: 'err', text: 'Select at least one working day.' });
    if (s.end_time <= s.start_time) return setMsg({ kind: 'err', text: 'End time must be after start time.' });
    if (s.meeting_link.trim() && !/^https?:\/\/\S+$/i.test(s.meeting_link.trim()))
      return setMsg({ kind: 'err', text: 'The meeting link must start with https:// (for example a Google Meet or Zoom link).' });
    setBusy(true);
    const { error } = await createClient()
      .from('booking_settings')
      .upsert({
        id: 1,
        is_enabled: s.is_enabled,
        timezone: s.timezone,
        weekdays: s.weekdays,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_minutes: Number(s.slot_minutes),
        buffer_minutes: Number(s.buffer_minutes),
        min_notice_hours: Number(s.min_notice_hours),
        max_days_ahead: Number(s.max_days_ahead),
        meeting_link: s.meeting_link.trim() || null,
        host_name: s.host_name.trim() || 'Teamital Team',
        host_email: s.host_email.trim() || null,
      });
    setBusy(false);
    setMsg(error ? { kind: 'err', text: error.message } : { kind: 'ok', text: 'Saved. The booking page is updated.' });
  };

  const num = (k: 'slot_minutes' | 'buffer_minutes' | 'min_notice_hours' | 'max_days_ahead') => (
    <input className="adm-input" type="number" min={0} value={s[k]} onChange={(e) => setS({ ...s, [k]: Number(e.target.value) })} />
  );

  return (
    <div className="adm-card adm-form">
      <label className="adm-label adm-check">
        <input type="checkbox" checked={s.is_enabled} onChange={(e) => setS({ ...s, is_enabled: e.target.checked })} />
        Accept bookings (turn off to pause the booking page)
      </label>

      <div className="adm-grid2">
        <label className="adm-label">
          Business time zone
          <select className="adm-input" value={s.timezone} onChange={(e) => setS({ ...s, timezone: e.target.value })}>
            {!TIMEZONES.includes(s.timezone) && <option>{s.timezone}</option>}
            {TIMEZONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="adm-label">
          Working days
          <div className="adm-tabs" style={{ margin: 0, flexWrap: 'wrap' }}>
            {DAYS.map(([d, label]) => (
              <button type="button" key={d} className={s.weekdays.includes(d) ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => toggleDay(d)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="adm-label">
          Day starts
          <input className="adm-input" type="time" value={s.start_time} onChange={(e) => setS({ ...s, start_time: e.target.value })} />
        </label>
        <label className="adm-label">
          Day ends
          <input className="adm-input" type="time" value={s.end_time} onChange={(e) => setS({ ...s, end_time: e.target.value })} />
        </label>
        <label className="adm-label">
          Call length (minutes)
          {num('slot_minutes')}
        </label>
        <label className="adm-label">
          Break between calls (minutes)
          {num('buffer_minutes')}
        </label>
        <label className="adm-label">
          Minimum notice (hours)
          {num('min_notice_hours')}
        </label>
        <label className="adm-label">
          Bookable up to (days ahead)
          {num('max_days_ahead')}
        </label>
        <label className="adm-label">
          Host name
          <input className="adm-input" value={s.host_name} onChange={(e) => setS({ ...s, host_name: e.target.value })} />
        </label>
        <label className="adm-label">
          Notification email
          <input className="adm-input" type="email" placeholder="contact@teamital.com" value={s.host_email} onChange={(e) => setS({ ...s, host_email: e.target.value })} />
        </label>
      </div>

      <label className="adm-label">
        Fallback meeting link <span className="adm-muted">(optional: only used if Google is not connected; must start with https://)</span>
        <input className="adm-input" placeholder="https://meet.google.com/…" value={s.meeting_link} onChange={(e) => setS({ ...s, meeting_link: e.target.value })} />
      </label>

      {msg && <div className={msg.kind === 'ok' ? 'adm-alert adm-alert-ok' : 'adm-alert adm-alert-err'}>{msg.text}</div>}
      <div className="adm-savebar">
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save availability'}
        </button>
      </div>
    </div>
  );
}
