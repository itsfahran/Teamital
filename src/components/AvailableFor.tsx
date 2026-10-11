import { appAbsolute, ROUTES, STORE_LINKS } from '@/lib/config';
import { BRAND_ICONS, type BrandIconName } from './brand-icons';
import { Icon } from './ui';

const PLATFORMS: Array<{ name: BrandIconName | 'web'; label: string; url: string }> = [
  { name: 'apple', label: 'iOS · App Store', url: STORE_LINKS.appStore },
  { name: 'android', label: 'Android · Google Play', url: STORE_LINKS.playStore },
  { name: 'windows', label: 'Windows · Microsoft Store', url: STORE_LINKS.microsoftStore },
  { name: 'web', label: 'Web app', url: appAbsolute(ROUTES.signIn) },
];

/** Centered "Available for:" row of real platform logos (no background). */
export function AvailableFor({ label = 'Available for:', align = 'center' }: { label?: string; align?: 'center' | 'left' }) {
  return (
    <div className={align === 'left' ? 'avail avail-left' : 'avail'}>
      <span className="avail-label">{label}</span>
      <ul className="avail-icons">
        {PLATFORMS.map((p) => (
          <li key={p.name}>
            <a
              href={p.url}
              target={p.name === 'web' ? undefined : '_blank'}
              rel={p.name === 'web' ? undefined : 'noopener noreferrer'}
              aria-label={p.label}
              className="avail-btn"
              data-tip={p.label}
            >
              {p.name === 'web' ? (
                <Icon name="language" size={30} />
              ) : (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                  <path d={BRAND_ICONS[p.name]} />
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
