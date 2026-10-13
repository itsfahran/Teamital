import { NextResponse } from 'next/server';
import { DURATIONS } from '@/lib/booking-constants';
import { getAvailableSlots } from '@/lib/booking';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public: bookable slot start times (ISO UTC) + the settings the page needs to render. */
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ enabled: false, slots: [] });
  const { settings, slots } = await getAvailableSlots();
  return NextResponse.json(
    {
      enabled: settings.is_enabled,
      slotMinutes: settings.slot_minutes,
      durations: DURATIONS.filter((d) => d <= settings.slot_minutes),
      businessTimezone: settings.timezone,
      hostName: settings.host_name,
      slots,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
