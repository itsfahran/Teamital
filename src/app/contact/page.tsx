import type { Metadata } from 'next';
import { Aos } from '@/components/Aos';
import { RichText } from '@/components/RichText';
import { ContactForm } from '@/components/pages/ContactForm';
import { SitePage } from '@/components/SitePage';
import { Icon } from '@/components/ui';
import { SITE } from '@/lib/config';
import { CONTACT, PAGE_KEYS } from '@/content/pages';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(PAGE_KEYS.contact, CONTACT);
  return metadataFor('/contact', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(PAGE_KEYS.contact, CONTACT);
  return (
    <SitePage stickyHeader compactBelow={900}>
      <div className="ct">
        <div className="ct-in">
          <div className="ct-left">
            <Aos fromLeft>
              <div className="ct-intro">
                <span className="ct-badge">{c.badge}</span>
                <h1 className="ct-title">{c.title}</h1>
                <RichText className="ct-sub" value={c.text} />
                <div className="ct-mail">
                  <div className="ct-mail-ico">
                    <Icon name="mail_outline" size={24} color="#1A56DB" />
                  </div>
                  <div>
                    <div className="ct-mail-l">{c.emailLabel}</div>
                    <div className="ct-mail-v">{SITE.contactEmail}</div>
                  </div>
                </div>
              </div>
              <div className="ct-art">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt="" />
                )}
              </div>
            </Aos>
          </div>
          <div className="ct-right">
            <Aos fromRight delay={100}>
              <ContactForm c={c.form} />
            </Aos>
          </div>
        </div>
      </div>
    </SitePage>
  );
}
