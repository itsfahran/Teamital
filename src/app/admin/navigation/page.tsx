import { NavManager, type NavItem } from '@/components/admin/NavManager';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function NavigationPage() {
  const db = await createServerSupabase();
  const { data, error } = await db.from('cms_nav_items').select('*').order('sort_order');
  return (
    <>
      <h1 className="adm-h1">Navigation</h1>
      <p className="adm-muted">
        Link lists stored in the database for header / footer menus. (The public header currently uses the built-in
        mega menu design.)
      </p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <NavManager items={(data ?? []) as NavItem[]} />
    </>
  );
}
