import { BookingsManager, type Booking } from '@/components/admin/BookingsManager';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function BookingsPage() {
  const db = await createServerSupabase();
  const { data, error } = await db.from('meeting_bookings').select('*').order('start_at', { ascending: false }).limit(500);
  return (
    <>
      <h1 className="adm-h1">Call bookings</h1>
      <p className="adm-muted">Calls booked from the “Book a free 1:1 call” page. Times are shown in your browser’s time zone.</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <BookingsManager bookings={(data ?? []) as Booking[]} />
    </>
  );
}
