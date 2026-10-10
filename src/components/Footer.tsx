import { ROUTES, SITE } from '@/lib/config';
import { BrandLogo, Icon, SmartLink } from './ui';
import { StoreBadgeRow } from './StoreBadges';

const SOCIALS = [
  { icon: 'business_center', tip: 'in', url: SITE.socialLinkedIn, bg: '#0A66C2' },
  { icon: 'alternate_email', tip: 'X', url: SITE.socialX, bg: '#111827' },
  { icon: 'play_circle_filled', tip: 'YT', url: SITE.socialYouTube, bg: '#FF0000' },
  { icon: 'facebook', tip: 'f', url: SITE.socialFacebook, bg: '#1877F2' },
  { icon: 'camera_alt', tip: 'IG', url: SITE.socialInstagram, bg: '#E1306C' },
  { icon: 'push_pin', tip: 'Pin', url: SITE.socialPinterest, bg: '#E60023' },
  { icon: 'music_note', tip: 'TT', url: SITE.socialTikTok, bg: '#010101' },
];

function Col({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div className="ft-col">
      <div className="ft-col-title">{title}</div>
      {links.map(([label, href]) => (
        <SmartLink key={label} href={href} className="ft-link">
          {label}
        </SmartLink>
      ))}
    </div>
  );
}

/** Shared marketing footer with menus, legal pages and social icons. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-grid-wrap">
          <div className="ft-grid">
            <div className="ft-col">
              <div className="ft-logo-box">
                <BrandLogo height={72} />
              </div>
              <p className="ft-tag">Teamital - Complete Workforce Intelligence in One Place</p>
            </div>
            <Col
              title="Product"
              links={[
                ['Features', ROUTES.features],
                ['How it works', ROUTES.howItWorks],
                ['Pricing', ROUTES.pricing],
                ['Security', ROUTES.security],
              ]}
            />
            <Col
              title="Company"
              links={[
                ['About', ROUTES.about],
                ['Contact', ROUTES.contact],
                ['Careers', ROUTES.careers],
                ['Blog', ROUTES.blog],
              ]}
            />
            <Col
              title="Legal"
              links={[
                ['Privacy', ROUTES.privacyPolicy],
                ['Terms', ROUTES.terms],
                ['Cookies', ROUTES.cookies],
                ['Security', ROUTES.security],
                ['Delete account', ROUTES.deleteAccount],
                ['Sign in', ROUTES.signIn],
              ]}
            />
            <div className="ft-col">
              <div className="ft-col-title">Follow us</div>
              <div className="ft-social">
                {SOCIALS.map((s) => (
                  <a
                    key={s.tip}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.tip}
                    aria-label={s.tip}
                    className="ft-social-btn"
                    style={{ background: s.bg }}
                  >
                    <Icon name={s.icon} size={18} color="#fff" />
                  </a>
                ))}
              </div>
              <div className="ft-site">{SITE.publicSiteUrl.replace(/^https?:\/\//, '')}</div>
              <SmartLink href={ROUTES.signUp} className="btn-filled ft-cta">
                Get started
              </SmartLink>
            </div>
          </div>
        </div>
        <div className="ft-badges">
          <StoreBadgeRow compact />
        </div>
        <hr className="ft-hr" />
        <div className="ft-copy">
          © {year} {SITE.displayName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
