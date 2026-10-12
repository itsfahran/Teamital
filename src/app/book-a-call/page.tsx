import { BookingWidget } from '@/components/booking/BookingWidget';
import { SitePage } from '@/components/SitePage';
import { Icon } from '@/components/ui';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/book-a-call');

const POINTS: Array<[string, string, string]> = [
  ['rocket_launch', 'A live product walkthrough', 'See attendance, GPS, leave and tasks working end to end.'],
  ['tune', 'Tailored to your team', 'We map Teamital to your sites, shifts and approval flow.'],
  ['sell', 'Straight answers on pricing', 'Plans, billing and our White Label program explained.'],
  ['support_agent', 'No pressure', 'A friendly 30-minute conversation. Ask us anything.'],
];

export default function Page() {
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bk-hero">
        <div className="bk-hero-in">
          <aside className="bk-info">
            <span className="bhero-pill">
              <span className="bhero-dot" />
              Free 1:1 call
            </span>
            <h1>Book a free call with the Teamital team</h1>
            <p>Pick a time that suits you. We will show you how Teamital fits your business and answer every question.</p>
            <div className="bk-meta">
              <span>
                <Icon name="schedule" size={18} color="#1A56DB" />
                30 minutes
              </span>
              <span>
                <Icon name="videocam" size={18} color="#1A56DB" />
                Online meeting
              </span>
              <span>
                <Icon name="payments" size={18} color="#1A56DB" />
                Free, no obligation
              </span>
            </div>
            <ul className="bk-points">
              {POINTS.map(([icon, t, s]) => (
                <li key={t}>
                  <span className="bk-point-ico">
                    <Icon name={icon} size={22} />
                  </span>
                  <span>
                    <b>{t}</b>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
          <BookingWidget />
        </div>
      </section>
    </SitePage>
  );
}
