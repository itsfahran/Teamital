import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { getSiteContent } from '@/lib/content/server';
import { AvailabilityForm } from '@/components/admin/AvailabilityForm';
import { GoogleMeetCard } from '@/components/admin/GoogleMeetCard';
import { getSettings } from '@/lib/booking';
import { getConnectionStatus, googleConfigured } from '@/lib/google';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  const ui = (await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)).pages.availability;
  const settings = await getSettings();
  const status = await getConnectionStatus();
  const { google } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">{ui.title}</h1>
      <p className="adm-muted">{ui.intro}</p>
      <GoogleMeetCard configured={googleConfigured()} status={status} result={google ?? null} />
      <AvailabilityForm initial={settings} />
    </>
  );
}
