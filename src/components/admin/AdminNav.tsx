'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/content', label: 'Site content', icon: 'edit_note' },
  { href: '/admin/pages', label: 'Custom pages', icon: 'article' },
  { href: '/admin/navigation', label: 'Navigation', icon: 'menu' },
  { href: '/admin/plans', label: 'Pricing plans', icon: 'sell' },
  { href: '/admin/bookings', label: 'Call bookings', icon: 'event' },
  { href: '/admin/availability', label: 'Availability', icon: 'edit_calendar' },
  { href: '/admin/messages', label: 'Messages', icon: 'mail' },
];

export function AdminNav({ email, signOutOnly = false }: { email: string; signOutOnly?: boolean }) {
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
        Sign out
      </button>
    );
  }

  return (
    <aside className="adm-side">
      <div className="adm-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand_logo_web.png" alt="Teamital" />
        <span>Admin</span>
      </div>
      <nav className="adm-nav">
        {ITEMS.map((it) => {
          const active = it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? 'adm-nav-item adm-nav-on' : 'adm-nav-item'}>
              <span className="mi">{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-nav-item">
          <span className="mi">open_in_new</span>
          View site
        </a>
      </nav>
      <div className="adm-user">
        <div className="adm-user-email" title={email}>
          {email}
        </div>
        <button className="adm-btn adm-btn-block" onClick={signOut}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
