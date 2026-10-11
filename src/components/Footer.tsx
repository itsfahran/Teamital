import { ROUTES, SITE } from '@/lib/config';
import { AvailableFor } from './AvailableFor';
import { BRAND_ICONS, type BrandIconName } from './brand-icons';
import { BrandLogo, Icon, SmartLink } from './ui';

const SOCIALS: Array<{ name: BrandIconName; label: string; url: string }> = [
  { name: 'linkedin', label: 'LinkedIn', url: SITE.socialLinkedIn },
  { name: 'x', label: 'X (Twitter)', url: SITE.socialX },
  { name: 'youtube', label: 'YouTube', url: SITE.socialYouTube },
  { name: 'facebook', label: 'Facebook', url: SITE.socialFacebook },
  { name: 'instagram', label: 'Instagram', url: SITE.socialInstagram },
  { name: 'pinterest', label: 'Pinterest', url: SITE.socialPinterest },
  { name: 'tiktok', label: 'TikTok', url: SITE.socialTikTok },
];

const COLUMNS: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: 'Product',
    links: [
      ['Features', ROUTES.features],
      ['How it works', ROUTES.howItWorks],
      ['Pricing', ROUTES.pricing],
      ['Sign in', ROUTES.signIn],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About us', ROUTES.about],
      ['Contact', ROUTES.contact],
      ['Careers', ROUTES.careers],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Guide for Companies', ROUTES.guideCompanies],
      ['Guide for Employees', ROUTES.guideEmployees],
      ['Blog', ROUTES.blog],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', ROUTES.privacyPolicy],
      ['Terms & Conditions', ROUTES.terms],
      ['Cookie Policy', ROUTES.cookies],
      ['Security Policy', ROUTES.security],
      ['Delete account', ROUTES.deleteAccount],
    ],
  },
];

function SocialIcon({ name }: { name: BrandIconName }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={BRAND_ICONS[name]} />
    </svg>
  );
}

/** Shared marketing footer: brand + contact, link columns, app badges and legal bar. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ft">
      <div className="ft-accent" aria-hidden="true" />
      <div className="ft-inner">
        <div className="ft-main">
          <div className="ft-brand">
            <div className="ft-logo-box">
              <BrandLogo height={72} />
            </div>
            <p className="ft-tag">
              Complete workforce intelligence in one place: attendance, GPS, leave, tasks and live insights for every
              team.
            </p>
            <ul className="ft-contact">
              <li>
                <Icon name="mail_outline" size={18} color="#1A56DB" />
                <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
              </li>
              <li>
                <Icon name="location_on" size={18} color="#1A56DB" />
                <span>Kandoy House, 2 Fairview Strand, Clontarf West, Dublin, D03 R8P3, Ireland</span>
              </li>
            </ul>
            <div className="ft-social" role="list">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Teamital on ${s.label}`}
                  title={s.label}
                  role="listitem"
                  className={`ft-social-btn ft-social-${s.name}`}
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <nav className="ft-cols" aria-label="Footer">
            {COLUMNS.map((c) => (
              <div className="ft-col" key={c.title}>
                <div className="ft-col-title">{c.title}</div>
                <ul className="ft-links">
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      <SmartLink href={href} className="ft-link">
                        {label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="ft-avail">
          <AvailableFor />
        </div>

        <div className="ft-bottom">
          <div className="ft-copy">
            © {year} {SITE.displayName}. All rights reserved.
          </div>
          <div className="ft-bottom-links">
            <SmartLink href={ROUTES.privacyPolicy}>Privacy</SmartLink>
            <SmartLink href={ROUTES.terms}>Terms</SmartLink>
            <SmartLink href={ROUTES.cookies}>Cookies</SmartLink>
            <SmartLink href={ROUTES.security}>Security</SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
