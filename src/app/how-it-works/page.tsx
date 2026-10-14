import type { Metadata } from 'next';
import { Aos } from '@/components/Aos';
import { RichText } from '@/components/RichText';
import { SitePage } from '@/components/SitePage';
import { Icon, SmartLink } from '@/components/ui';
import { ROUTES } from '@/lib/config';
import { HOW_IT_WORKS, PAGE_KEYS } from '@/content/pages';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(PAGE_KEYS.howItWorks, HOW_IT_WORKS);
  return metadataFor('/how-it-works', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(PAGE_KEYS.howItWorks, HOW_IT_WORKS);
  return (
    <SitePage stickyHeader compactBelow={980}>
      <div className="hw2">
        <div className="hw2-in">
          <Aos>
            <h1 className="hw2-title">{c.title}</h1>
            <RichText className="hw2-sub" value={c.subtitle} />
          </Aos>
          <div className="gap-32" />
          {c.steps.map(({ icon, title, text }, i) => (
            <Aos key={i} delay={60 * i}>
              <div className="hw2-step">
                <div className="hw2-ico">
                  <Icon name={icon} size={22} color="#fff" />
                </div>
                <div>
                  <div className="hw2-step-t">
                    {i + 1}. {title}
                  </div>
                  <RichText className="hw2-step-d" value={text} />
                </div>
              </div>
            </Aos>
          ))}
          <div className="gap-24" />
          <SmartLink href={ROUTES.signUp} className="btn-filled hw2-btn">
            {c.buttonLabel}
          </SmartLink>
        </div>
      </div>
    </SitePage>
  );
}
