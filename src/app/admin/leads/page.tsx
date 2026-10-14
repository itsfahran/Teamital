import { LeadsManager, type Lead } from '@/components/admin/LeadsManager';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const db = await createServerSupabase();
  const { data, error } = await db.from('leads').select('*').order('created_at', { ascending: false }).limit(1000);

  return (
    <>
      <h1 className="adm-h1">Leads</h1>
      <p className="adm-muted">Everyone who submitted a lead form on the website. Each lead is also emailed to your team. Set the notification address under Site content → Lead notifications.</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <LeadsManager leads={(data ?? []) as Lead[]} />
    </>
  );
}
