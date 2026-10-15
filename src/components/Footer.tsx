'use client';

import { SITE } from '@/lib/config';
import { useChrome } from './ChromeProvider';
import { RichText } from './RichText';
import { AvailableFor } from './AvailableFor';
import { BRAND_ICONS, type BrandIconName } from './brand-icons';
import { BrandLogo, Icon, SmartLink } from './ui';

function SocialIcon({ name }: { name: BrandIconName }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={BRAND_ICONS[name]} />
    </svg>
  );
}

/** Shared marketing footer: brand + contact, link columns, app badges and legal bar. */
export function Footer() {
  const { footer: f } = useChrome();
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
            <RichText className="ft-tag" value={f.tagline} />
            <ul className="ft-contact">
              <li>
                <Icon name="mail_outline" size={18} color="#1A56DB" />
                <a href={`mailto:${f.email}`}>{f.email}</a>
              </li>
              <li>
                <Icon name="location_on" size={18} color="#1A56DB" />
                <span>{f.address}</span>
              </li>
            </ul>
            <div className="ft-social" role="list">
              {f.social.filter((s) => s.url).map((s) => (
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
                  <SocialIcon name={s.name as BrandIconName} />
                </a>
              ))}
            </div>
          </div>

          <nav className="ft-cols" aria-label="Footer">
            {f.columns.map((c) => (
              <div className="ft-col" key={c.title}>
                <div className="ft-col-title">{c.title}</div>
                <ul className="ft-links">
                  {c.links.map(({ label, href }, li) => (
                    <li key={li}>
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
          <AvailableFor label={f.availableLabel} />
        </div>

        <div className="ft-bottom">
          <div className="ft-copy">
            © {year} {SITE.displayName}. {f.copyright}
            {f.credit && <span className="ft-credit"> · {f.credit}</span>}
          </div>
          <div className="ft-bottom-links">
            {f.bottomLinks.map((l, i) => (
              <SmartLink href={l.href} key={i}>
                {l.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
