import { AvailabilityForm } from '@/components/admin/AvailabilityForm';
import { GoogleMeetCard } from '@/components/admin/GoogleMeetCard';
import { getSettings } from '@/lib/booking';
import { getConnectionStatus, googleConfigured } from '@/lib/google';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  const settings = await getSettings();
  const status = await getConnectionStatus();
  const { google } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">Booking availability</h1>
      <p className="adm-muted">Choose when visitors can book a call. Changes apply to the public booking page straight away.</p>
      <GoogleMeetCard configured={googleConfigured()} status={status} result={google ?? null} />
      <AvailabilityForm initial={settings} />
    </>
  );
}
