import { PlansManager, type Plan } from '@/components/admin/PlansManager';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function PlansPage() {
  const db = await createServerSupabase();
  const { data, error } = await db.from('subscription_plans').select('*').order('price');
  return (
    <>
      <h1 className="adm-h1">Pricing plans</h1>
      <p className="adm-muted">These plans appear on the public Pricing page.</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <PlansManager plans={(data ?? []) as Plan[]} />
    </>
  );
}
