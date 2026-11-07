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
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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

          <div className="ft-avail-top">
            <AvailableFor label={f.availableLabel} align="left" />
          </div>
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
