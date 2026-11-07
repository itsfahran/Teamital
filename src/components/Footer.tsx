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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.26A9.5 9.5 0 1 0 12 2.5z" stroke="#25D366" strokeWidth="1.8" strokeLinejoin="round" />
      <path
        fill="#25D366"
        transform="translate(6.2 6.2) scale(0.5)"
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
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
              {f.whatsapp && (
                <li>
                  <WhatsAppIcon />
                  <a href={`https://wa.me/${f.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    {f.whatsapp}
                  </a>
                </li>
              )}
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
            <div className="ft-avail-top">
              <AvailableFor label={f.availableLabel} align="left" />
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
