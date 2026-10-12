import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const db = await createServerSupabase();
  const count = async (table: string, filter?: (q: any) => any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    let q = db.from(table).select('*', { count: 'exact', head: true });
    if (filter) q = filter(q);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [pages, published, unread, messages, plans, upcoming] = await Promise.all([
    count('cms_pages'),
    count('cms_pages', (q) => q.eq('status', 'published')),
    count('contact_messages', (q) => q.eq('is_read', false)),
    count('contact_messages'),
    count('subscription_plans'),
    count('meeting_bookings', (q) => q.eq('status', 'confirmed').gte('start_at', new Date().toISOString())),
  ]);

  const { data: recent } = await db
    .from('contact_messages')
    .select('id,name,email,message,created_at,is_read')
    .order('created_at', { ascending: false })
    .limit(5);

  const cards = [
    { label: 'Pages', value: pages, sub: `${published} published`, href: '/admin/pages', icon: 'article' },
    { label: 'Unread messages', value: unread, sub: `${messages} total`, href: '/admin/messages', icon: 'mail' },
    { label: 'Upcoming calls', value: upcoming, sub: 'booked from /book-a-call', href: '/admin/bookings', icon: 'event' },
    { label: 'Pricing plans', value: plans, sub: 'shown on /pricing', href: '/admin/plans', icon: 'sell' },
  ];

  return (
    <>
      <h1 className="adm-h1">Dashboard</h1>
      <div className="adm-cards">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="adm-card adm-stat">
            <span className="mi adm-stat-ico">{c.icon}</span>
            <div className="adm-stat-v">{c.value}</div>
            <div className="adm-stat-l">{c.label}</div>
            <div className="adm-muted">{c.sub}</div>
          </Link>
        ))}
      </div>

      <h2 className="adm-h2">Latest messages</h2>
      <div className="adm-card">
        {(recent ?? []).length === 0 && <p className="adm-muted">No messages yet.</p>}
        {(recent ?? []).map((m) => (
          <Link key={m.id} href="/admin/messages" className="adm-row">
            <div>
              <b>{m.name}</b> <span className="adm-muted">&lt;{m.email}&gt;</span>
              {!m.is_read && <span className="adm-badge">new</span>}
              <div className="adm-muted adm-clip">{m.message}</div>
            </div>
            <div className="adm-muted">{new Date(m.created_at).toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
