'use client';

import { useState, type FormEvent } from 'react';
import { Icon, cx } from '../ui';

export type LeadFormData = {
  formName: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  companyLabel: string;
  messageLabel: string;
  showPhone: boolean;
  showCompany: boolean;
  showMessage: boolean;
  submitLabel: string;
  successTitle: string;
  successText: string;
  privacyNote: string;
};

/** CMS lead form: posts to /api/leads (saved in the backend and emailed to the team). */
export function LeadForm({ data, pagePath, inline = false }: { data: LeadFormData; pagePath: string; inline?: boolean }) {
  const [v, setV] = useState({ name: '', email: '', phone: '', company: '', message: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!v.name.trim()) return setErr('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return setErr('Please enter a valid email.');
    setBusy(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, pagePath: pagePath || window.location.pathname, formName: data.formName }),
      });
      if (res.ok) setDone(true);
      else setErr(((await res.json()) as { error?: string }).error || 'Something went wrong. Please try again.');
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <div className="sx-form sx-form-done">
        <span className="sx-done-ico">
          <Icon name="check" size={34} color="#fff" />
        </span>
        <h3>{data.successTitle}</h3>
        <p>{data.successText}</p>
      </div>
    );

  return (
    <form className={cx('sx-form', inline && 'sx-form-inline')} onSubmit={submit} noValidate>
      <div className="sx-fields">
        <label>
          <span>{data.nameLabel}</span>
          <input value={v.name} onChange={set('name')} autoComplete="name" required />
        </label>
        <label>
          <span>{data.emailLabel}</span>
          <input type="email" value={v.email} onChange={set('email')} autoComplete="email" required />
        </label>
        {data.showPhone && (
          <label>
            <span>{data.phoneLabel}</span>
            <input type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" />
          </label>
        )}
        {data.showCompany && (
          <label>
            <span>{data.companyLabel}</span>
            <input value={v.company} onChange={set('company')} autoComplete="organization" />
          </label>
        )}
        {data.showMessage && !inline && (
          <label className="sx-field-wide">
            <span>{data.messageLabel}</span>
            <textarea rows={3} value={v.message} onChange={set('message')} />
          </label>
        )}
      </div>
      {/* honeypot: hidden from people, filled in by bots */}
      <input className="sx-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={set('website')} />
      {err && <div className="sx-form-err">{err}</div>}
      <button type="submit" className="hero-btn hero-btn-primary sx-submit" disabled={busy}>
        {busy ? <span className="cf-spin" /> : <span>{data.submitLabel}</span>}
        {!busy && <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />}
      </button>
      {data.privacyNote && <p className="sx-fine">{data.privacyNote}</p>}
    </form>
  );
}
