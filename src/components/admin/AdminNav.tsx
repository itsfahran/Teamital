'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminUi } from '@/content/admin-ui';
import { createClient } from '@/lib/supabase/client';

const ITEMS = [
  { href: '/admin', key: 'dashboard', icon: 'dashboard' },
  { href: '/admin/content', key: 'content', icon: 'edit_note' },
  { href: '/admin/pages', key: 'customPages', icon: 'article' },
  { href: '/admin/navigation', key: 'navigation', icon: 'menu' },
  { href: '/admin/plans', key: 'plans', icon: 'sell' },
  { href: '/admin/bookings', key: 'bookings', icon: 'event' },
  { href: '/admin/availability', key: 'availability', icon: 'edit_calendar' },
  { href: '/admin/messages', key: 'messages', icon: 'mail' },
] as const;

export function AdminNav({ email, ui, signOutOnly = false }: { email: string; ui: AdminUi; signOutOnly?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  if (signOutOnly) {
    return (
      <button className="adm-btn adm-btn-block" onClick={signOut}>
        {ui.signOut}
      </button>
    );
  }

  return (
    <aside className="adm-side">
      <div className="adm-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand_logo_web.png" alt="Teamital" />
        <span>{ui.brand}</span>
      </div>
      <nav className="adm-nav">
        {ITEMS.map((it) => {
          const active = it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? 'adm-nav-item adm-nav-on' : 'adm-nav-item'}>
              <span className="mi">{it.icon}</span>
              {ui.nav[it.key]}
            </Link>
          );
        })}
        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-nav-item">
          <span className="mi">open_in_new</span>
          {ui.viewSite}
        </a>
      </nav>
      <div className="adm-user">
        <div className="adm-user-email" title={email}>
          {email}
        </div>
        <button className="adm-btn adm-btn-block" onClick={signOut}>
          {ui.signOut}
        </button>
      </div>
    </aside>
  );
}
