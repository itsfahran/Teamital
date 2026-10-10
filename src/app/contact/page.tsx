import { Aos } from '@/components/Aos';
import { ContactForm } from '@/components/pages/ContactForm';
import { SitePage } from '@/components/SitePage';
import { Icon } from '@/components/ui';
import { SITE } from '@/lib/config';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/contact');

export default function Page() {
  return (
    <SitePage stickyHeader compactBelow={900}>
      <div className="ct">
        <div className="ct-in">
          <div className="ct-left">
            <Aos fromLeft>
              <div className="ct-intro">
                <span className="ct-badge">Mail us</span>
                <h1 className="ct-title">Contact us</h1>
                <p className="ct-sub">
                  Questions about plans, demos, or onboarding? Send a message — we will reply shortly.
                </p>
                <div className="ct-mail">
                  <div className="ct-mail-ico">
                    <Icon name="mail_outline" size={24} color="#1A56DB" />
                  </div>
                  <div>
                    <div className="ct-mail-l">Email</div>
                    <div className="ct-mail-v">{SITE.contactEmail}</div>
                  </div>
                </div>
              </div>
              <div className="ct-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/undraw_questions_52ic.svg" alt="" />
              </div>
            </Aos>
          </div>
          <div className="ct-right">
            <Aos fromRight delay={100}>
              <ContactForm />
            </Aos>
          </div>
        </div>
      </div>
    </SitePage>
  );
}
