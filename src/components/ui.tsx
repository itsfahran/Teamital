import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { resolveHref } from '@/lib/config';

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

/** Material Icons (Round by default, matching Flutter's *_rounded icons). */
export function Icon({
  name,
  size = 24,
  color,
  filled = false,
  style,
  className,
}: {
  name: string;
  size?: number;
  color?: string;
  /** Use the baseline (non-rounded) Material Icons font, like Flutter's Icons.circle. */
  filled?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(filled ? 'mi mi-base' : 'mi', className)}
      style={{ fontSize: size, color, ...style }}
    >
      {name}
    </span>
  );
}

/** Link that sends auth routes to the app subdomain and keeps the rest in-app. */
export function SmartLink({
  href,
  children,
  className,
  style,
  onClick,
  title,
  newTab,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  title?: string;
  newTab?: boolean;
  ariaLabel?: string;
}) {
  const r = resolveHref(href);
  if (r.external) {
    return (
      <a
        href={r.href}
        className={className}
        style={style}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={r.href} className={className} style={style} onClick={onClick} title={title} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** The rounded "pill" used in hero/CTA areas (Flutter _HeroPill / _pill). */
export function Pill({
  label,
  href,
  filled = true,
  large = false,
  variant = 'hero',
}: {
  label: string;
  href: string;
  filled?: boolean;
  large?: boolean;
  /** hero: blue 2563EB, slot: masterPrimary 1A56DB */
  variant?: 'hero' | 'slot';
}) {
  return (
    <SmartLink
      href={href}
      className={cx('pill', `pill-${variant}`, filled ? 'pill-filled' : 'pill-outline', large && 'pill-lg')}
    >
      {label}
    </SmartLink>
  );
}

export function BrandLogo({ height, className }: { height: number; className?: string }) {
  const width = height * (1000 / 300);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/brand_logo_web.png"
      alt="Teamital"
      width={width}
      height={height}
      className={cx('brand-logo', className)}
      style={{ height, width }}
    />
  );
}
