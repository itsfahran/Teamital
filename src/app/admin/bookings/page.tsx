import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { getSiteContent } from '@/lib/content/server';
import { BookingsManager, type Booking } from '@/components/admin/BookingsManager';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function BookingsPage() {
  const ui = (await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)).pages.bookings;
  const db = await createServerSupabase();
  const { data, error } = await db.from('meeting_bookings').select('*').order('start_at', { ascending: false }).limit(500);
  return (
    <>
      <h1 className="adm-h1">{ui.title}</h1>
      <p className="adm-muted">{ui.intro}</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <BookingsManager bookings={(data ?? []) as Booking[]} />
    </>
  );
}
