'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon, SmartLink } from '../ui';
import { useChrome } from '../ChromeProvider';
import { CopyLink } from './CopyLink';

type B = { name: string; topic: string | null; start: string; end: string; status: string; meetLink: string | null };

export function ManageBooking() {
  const t = useChrome().booking;
  const token = useSearchParams().get('token') ?? '';
  const [b, setB] = useState<B | null>(null);
  const [state, setState] = useState<'loading' | 'missing' | 'ready' | 'cancelled'>('loading');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!token) return setState('missing');
    fetch(`/api/booking/manage?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (!r.ok) return setState('missing');
        const d = (await r.json()) as B;
        setB(d);
        setState(d.status === 'cancelled' ? 'cancelled' : 'ready');
      })
      .catch(() => setState('missing'));
  }, [token]);

  const cancel = async () => {
    if (!confirm(t.cancelConfirm)) return;
    setBusy(true);
    setErr('');
    const res = await fetch('/api/booking/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    setBusy(false);
    if (res.ok) return setState('cancelled');
    setErr((await res.json()).error || 'Could not cancel.');
  };

  const when = b
    ? new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(b.start))
    : '';
  const past = b ? new Date(b.start).getTime() < Date.now() : false;

  return (
    <div className="bk-card bk-manage">
      {state === 'loading' && <span className="cf-spin bk-spin" />}
      {state === 'missing' && (
        <>
          <Icon name="link_off" size={40} color="#9CA3AF" />
          <h3>{t.notFoundTitle}</h3>
          <p>{t.notFoundText}</p>
        </>
      )}
      {state === 'cancelled' && (
        <>
          <Icon name="event_busy" size={40} color="#EF4444" />
          <h3>{t.cancelledTitle}</h3>
          <p>{t.cancelledText}</p>
          <SmartLink href="/book-a-call" className="hero-btn hero-btn-primary">
            <span>{t.bookNew}</span>
            <Icon name="arrow_forward" size={20} color="#fff" />
          </SmartLink>
        </>
      )}
      {state === 'ready' && b && (
        <>
          <Icon name="event_available" size={40} color="#1A56DB" />
          <h3>{t.manageTitle}</h3>
          <div className="bk-summary">
            <div>
              <Icon name="person" size={20} color="#1A56DB" />
              <span>{b.name}</span>
            </div>
            <div>
              <Icon name="event" size={20} color="#1A56DB" />
              <span>{when}</span>
            </div>
            {b.topic && (
              <div>
                <Icon name="chat" size={20} color="#1A56DB" />
                <span>{b.topic}</span>
              </div>
            )}
          </div>
          {b.meetLink && !past && <CopyLink link={b.meetLink} />}
          {b.meetLink && !past && (
            <a className="hero-btn hero-btn-primary" href={b.meetLink} target="_blank" rel="noopener noreferrer">
              <Icon name="videocam" size={20} color="#fff" />
              <span>{t.joinMeet}</span>
            </a>
          )}
          {err && <div className="bk-err">{err}</div>}
          {!past ? (
            <div className="bk-done-btns">
              <a className="hero-btn hero-btn-ghost" href={`/api/booking/ics?token=${token}`}>
                <Icon name="download" size={20} color="#1A56DB" />
                <span>{t.addToCalendar}</span>
              </a>
              <button className="hero-btn hero-btn-danger" onClick={cancel} disabled={busy}>
                {busy ? <span className="cf-spin" /> : <span>{t.cancelBooking}</span>}
              </button>
            </div>
          ) : (
            <p>{t.pastNote}</p>
          )}
        </>
      )}
    </div>
  );
}
