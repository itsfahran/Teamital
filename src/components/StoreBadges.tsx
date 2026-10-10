import { appAbsolute, ROUTES, STORE_LINKS } from '@/lib/config';
import { Icon, cx } from './ui';

function ImageBadge({ src, url, label, compact }: { src: string; url: string; label: string; compact: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cx('store-badge', compact && 'store-badge-compact')}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} />
    </a>
  );
}

function WebAppBadge({ compact }: { compact: boolean }) {
  return (
    <a
      href={appAbsolute(ROUTES.signIn)}
      aria-label="Open web app"
      className={cx('store-badge store-badge-web', compact && 'store-badge-compact')}
    >
      <Icon name="language" size={compact ? 26 : 30} color="#fff" />
      <span className="store-badge-web-text">
        <span className="store-badge-web-small">Open in</span>
        <span className="store-badge-web-big">Web App</span>
      </span>
    </a>
  );
}

/** App Store · Google Play · Windows Store · Web, same size everywhere. */
export function StoreBadgeRow({ center = false, compact = false }: { center?: boolean; compact?: boolean }) {
  return (
    <div className={cx('store-row', center && 'store-row-center', compact && 'store-row-compact')}>
      <ImageBadge src="/assets/app-store.png" url={STORE_LINKS.appStore} label="Download on the App Store" compact={compact} />
      <ImageBadge src="/assets/play-store.png" url={STORE_LINKS.playStore} label="Get it on Google Play" compact={compact} />
      <ImageBadge src="/assets/window-store.png" url={STORE_LINKS.microsoftStore} label="Download from Windows Store" compact={compact} />
      <WebAppBadge compact={compact} />
    </div>
  );
}
