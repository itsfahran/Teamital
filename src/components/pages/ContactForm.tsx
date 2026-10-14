'use client';

import { useState, type FormEvent } from 'react';
import type { ContactContent } from '@/content/pages';
import { SITE } from '@/lib/config';
import { Icon, cx } from '../ui';
import { useToast } from '../Toast';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactForm({ c }: { c: ContactContent['form'] }) {
  const toast = useToast();
  const [values, setValues] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (!values.email.trim()) next.email = 'Email is required';
    else if (!values.email.includes('@')) next.email = 'Enter a valid email';
    if (values.message.trim().length < 8) next.message = 'Please write a short message';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const clear = () => {
    setValues({ name: '', email: '', company: '', message: '' });
    setErrors({});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    const name = values.name.trim();
    const email = values.email.trim();
    const company = values.company.trim();
    const message = values.message.trim();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message }),
      });
      if (res.ok) {
        toast.success(c.successMessage);
        clear();
        return;
      }
      throw new Error('send failed');
    } catch {
      // Fallback: open the visitor's mail client so the message is never lost.
      const to = SITE.contactEmail;
      const subject = encodeURIComponent(`Contact from ${name} — Teamital`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\n\n${message}`,
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      toast.success('Opening your email app — send to finish.');
      clear();
    } finally {
      setSending(false);
    }
  };

  const field = (
    key: keyof typeof values,
    label: string,
    icon: string,
    opts: { type?: string; multiline?: boolean } = {},
  ) => {
    const err = key in errors ? errors[key as keyof Errors] : undefined;
    const filled = values[key].length > 0;
    return (
      <div className={cx('cf-field', opts.multiline && 'cf-field-multi', err && 'cf-field-err')}>
        <Icon name={icon} size={20} color="#1A56DB" className="cf-ico" />
        {opts.multiline ? (
          <textarea id={`cf-${key}`} rows={5} value={values[key]} onChange={set(key)} placeholder=" " />
        ) : (
          <input id={`cf-${key}`} type={opts.type ?? 'text'} value={values[key]} onChange={set(key)} placeholder=" " />
        )}
        <label htmlFor={`cf-${key}`} className={cx(filled && 'cf-filled')}>
          {label}
        </label>
        {err && <div className="cf-err">{err}</div>}
      </div>
    );
  };

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <div className="cf-title">{c.title}</div>
      <div className="cf-sub">{c.subtitle}</div>
      <div className="cf-fields">
        {field('name', c.nameLabel, 'person_outline')}
        {field('email', c.emailLabel, 'email', { type: 'email' })}
        {field('company', c.companyLabel, 'apartment')}
        {field('message', c.messageLabel, 'chat_bubble_outline', { multiline: true })}
      </div>
      <button type="submit" className="cf-submit" disabled={sending}>
        {sending ? <span className="cf-spin" /> : c.submitLabel}
      </button>
    </form>
  );
}
