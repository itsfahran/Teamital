import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ManageBooking } from '@/components/booking/ManageBooking';
import { SitePage } from '@/components/SitePage';

export const metadata: Metadata = {
  title: { absolute: 'Manage your booking | Teamital' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bk-hero bk-hero-narrow">
        <Suspense>
          <ManageBooking />
        </Suspense>
      </section>
    </SitePage>
  );
}
