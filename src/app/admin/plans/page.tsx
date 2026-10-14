import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { getSiteContent } from '@/lib/content/server';
import { PlansManager, type Plan } from '@/components/admin/PlansManager';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function PlansPage() {
  const ui = (await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)).pages.plans;
  const db = await createServerSupabase();
  const { data, error } = await db.from('subscription_plans').select('*').order('price');
  return (
    <>
      <h1 className="adm-h1">{ui.title}</h1>
      <p className="adm-muted">{ui.intro}</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <PlansManager plans={(data ?? []) as Plan[]} />
    </>
  );
}
