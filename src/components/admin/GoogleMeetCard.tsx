'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Status = { connected: boolean; email: string | null; connectedAt: string | null; canEmail: boolean };

const RESULT: Record<string, { kind: 'ok' | 'err'; text: string }> = {
  connected: { kind: 'ok', text: 'Google connected. New bookings now get a Google Calendar event with a Meet link.' },
  denied: { kind: 'err', text: 'Google access was not granted. Please try again and allow calendar access.' },
  bad_state: { kind: 'err', text: 'The sign-in session expired. Please click “Connect Google” again.' },
  no_refresh: { kind: 'err', text: 'Google did not return offline access. Remove Teamital at myaccount.google.com/permissions and connect again.' },
  failed: { kind: 'err', text: 'Could not finish connecting to Google. Check the client ID/secret and the redirect URI.' },
  not_configured: { kind: 'err', text: 'Google is not configured on the server yet. See the setup steps below.' },
};

export function GoogleMeetCard({ configured, status, result }: { configured: boolean; status: Status; result: string | null }) {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);

  const disconnect = async () => {
    if (!confirm('Disconnect Google? New bookings will use the static meeting link instead.')) return;
    setBusy(true);
    await fetch('/api/google/disconnect', { method: 'POST' });
    setBusy(false);
    router.replace('/admin/availability');
    router.refresh();
  };

  const msg = result ? RESULT[result] : null;

  return (
    <div className="adm-card adm-form">
      <div className="adm-head" style={{ margin: 0 }}>
        <h2 className="adm-h2" style={{ margin: 0 }}>
          Google Meet connection
        </h2>
        <span className={status.connected ? 'adm-pill adm-pill-ok' : 'adm-pill'}>{status.connected ? 'Connected' : 'Not connected'}</span>
      </div>

      {msg && <div className={msg.kind === 'ok' ? 'adm-alert adm-alert-ok' : 'adm-alert adm-alert-err'}>{msg.text}</div>}

      {status.connected ? (
        <>
          <p className="adm-muted">
            Connected as <b>{status.email ?? 'your Google account'}</b>. Every booking creates an event in that calendar with a unique Google Meet link, and Google
            emails the invitation to the visitor.
          </p>
          {status.canEmail ? (
            <div className="adm-alert adm-alert-ok">Email sending is on: booking confirmations (with the Meet link) are sent to the visitor and to you from this Google account.</div>
          ) : (
            <div className="adm-alert adm-alert-warn">
              <b>Booking emails are NOT being sent.</b> This connection was made before email permission was added. Click <b>Reconnect Google</b> and tick the
              “Send email on your behalf” permission. Also make sure the <b>Gmail API</b> is enabled in Google Cloud Console → APIs &amp; Services → Library.
            </div>
          )}
          <div className="adm-savebar" style={{ position: 'static' }}>
            {!status.canEmail && (
              <a className="adm-btn adm-btn-primary" href="/api/google/connect">
                Reconnect Google
              </a>
            )}
            <button className="adm-btn adm-btn-danger" onClick={disconnect} disabled={busy}>
              {busy ? 'Disconnecting…' : 'Disconnect Google'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="adm-muted">
            Connect the Google account whose calendar should host the calls. Each booking will then automatically get a Google Calendar event with its own Meet link.
          </p>
          {configured ? (
            <div className="adm-savebar" style={{ position: 'static' }}>
              <a className="adm-btn adm-btn-primary" href="/api/google/connect">
                Connect Google
              </a>
            </div>
          ) : (
            <div className="adm-alert adm-alert-warn">
              <b>One-time setup needed.</b> Create a Google OAuth client and add these environment variables to the server:
              <pre className="adm-pre">{`GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...   (Supabase → Project Settings → API)`}</pre>
              In Google Cloud Console → <b>APIs &amp; Services</b>: enable the <b>Google Calendar API</b>, configure the OAuth consent screen, then create an{' '}
              <b>OAuth client ID (Web application)</b> with this authorised redirect URI:
              <pre className="adm-pre">{origin ? `${origin}/api/google/callback` : '/api/google/callback'}</pre>
              Redeploy, return here and click <b>Connect Google</b>.
            </div>
          )}
        </>
      )}
    </div>
  );
}
