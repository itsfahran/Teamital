import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { getSiteContent } from '@/lib/content/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: { absolute: 'Admin | Teamital' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <h1>Supabase not configured</h1>
          <p className="adm-muted">
            Copy <code>.env.example</code> to <code>.env.local</code>, set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, run <code>supabase/migrations/0001_init.sql</code> in your
            project, then restart the server.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: adminRow } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!adminRow) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <h1>Not an admin</h1>
          <p className="adm-muted">
            <b>{user.email}</b> is signed in but is not in the <code>admin_users</code> table. In the Supabase SQL
            editor run:
          </p>
          <pre className="adm-pre">{`insert into public.admin_users (user_id)\nselect id from auth.users where email = '${user.email}';`}</pre>
          <AdminNav email={user.email ?? ''} ui={await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)} signOutOnly />
        </div>
      </div>
    );
  }

  return (
    <div className="adm">
      <AdminNav email={user.email ?? ''} ui={await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)} />
      <main className="adm-main">{children}</main>
    </div>
  );
}
