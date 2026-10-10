'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    const next = params.get('next');
    router.replace(next && next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  };

  return (
    <form className="adm-login-card" onSubmit={submit}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/brand_logo_web.png" alt="Teamital" className="adm-login-logo" />
      <h1>Admin sign in</h1>
      <p className="adm-muted">Sign in with your Supabase admin account.</p>
      {!configured && (
        <div className="adm-alert adm-alert-warn">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and fill in{' '}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </div>
      )}
      <label className="adm-label">
        Email
        <input className="adm-input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="adm-label">
        Password
        <input className="adm-input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <div className="adm-alert adm-alert-err">{error}</div>}
      <button className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || !configured}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
