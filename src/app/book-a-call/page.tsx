import type { Metadata } from 'next';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { RichText } from '@/components/RichText';
import { SitePage } from '@/components/SitePage';
import { Icon } from '@/components/ui';
import { BOOK_CALL, BOOK_CALL_KEY } from '@/content/book-call';
import { getSiteContent } from '@/lib/content/server';
import { plainText } from '@/lib/content/utils';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(BOOK_CALL_KEY, BOOK_CALL);
  return metadataFor('/book-a-call', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(BOOK_CALL_KEY, BOOK_CALL);
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bk-hero">
        <div className="bk-hero-in">
          <aside className="bk-info">
            <span className="bhero-pill">
              <span className="bhero-dot" />
              {c.pill}
            </span>
            <h1>{c.title}</h1>
            <RichText value={c.text} />
            <div className="bk-meta">
              {c.meta.map((m, i) => (
                <span key={i}>
                  <Icon name={m.icon} size={18} color="#1A56DB" />
                  {m.text}
                </span>
              ))}
            </div>
            <ul className="bk-points">
              {c.points.map((pt, i) => (
                <li key={i}>
                  <span className="bk-point-ico">
                    <Icon name={pt.icon} size={22} />
                  </span>
                  <span>
                    <b>{pt.title}</b>
                    {plainText(pt.text)}
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
