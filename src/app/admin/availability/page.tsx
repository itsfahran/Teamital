import { AvailabilityForm } from '@/components/admin/AvailabilityForm';
import { getSettings } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage() {
  const settings = await getSettings();
  return (
    <>
      <h1 className="adm-h1">Booking availability</h1>
      <p className="adm-muted">Choose when visitors can book a call. Changes apply to the public booking page straight away.</p>
      <AvailabilityForm initial={settings} />
    </>
  );
}
