'use client';

import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { appAbsolute, ROUTES, STORE_LINKS } from '@/lib/config';
import { BrandLogo, Icon, SmartLink, cx } from './ui';

type MegaItem = { icon: string; title: string; subtitle: string; href?: string; external?: boolean; filled?: boolean };
type MegaCol = { title: string; items: MegaItem[] };
type MegaMenu = { id: string; label: string; columns: MegaCol[] };

const MENUS: MegaMenu[] = [
  {
    id: 'Features',
    label: 'Features',
    columns: [
      {
        title: 'Workforce',
        items: [
          { icon: 'fingerprint', title: 'Clock in / out', subtitle: 'GPS, face & biometric attendance' },
          { icon: 'task_alt', title: 'Tasks', subtitle: 'Assign work and track progress' },
          { icon: 'beach_access', title: 'Leave', subtitle: 'Requests, balances & approvals' },
          { icon: 'schedule', title: 'Shifts', subtitle: 'Schedules your team can trust' },
        ],
      },
      {
        title: 'Insights',
        items: [
          { icon: 'bar_chart', title: 'Live dashboards', subtitle: 'Realtime hours & attendance charts' },
          { icon: 'assignment', title: 'Work summary', subtitle: 'Hours, overtime & attendance %' },
          { icon: 'notifications', title: 'Alerts', subtitle: 'Clock-in reminders & updates' },
        ],
      },
      {
        title: 'Collaboration',
        items: [
          { icon: 'forum', title: 'Community & AI', subtitle: 'Chat with HR and company teams' },
          { icon: 'support_agent', title: 'Help desk', subtitle: 'Tickets and support in-app' },
        ],
      },
    ],
  },
  {
    id: 'Solutions',
    label: 'Solutions',
    columns: [
      {
        title: 'Teams',
        items: [
          { icon: 'rocket_launch', title: 'For Startups', subtitle: 'Get attendance live without a big HR team' },
          { icon: 'storefront', title: 'For Small Businesses', subtitle: 'One place for clock-in, leave and reports' },
          { icon: 'apartment', title: 'For Enterprises', subtitle: 'Multi-site workforce with role-based access' },
          { icon: 'wifi', title: 'For Remote Teams', subtitle: 'See who is working, from any location' },
          { icon: 'location_on', title: 'For Field Employees', subtitle: 'GPS-verified presence on site' },
        ],
      },
      {
        title: 'Industries',
        items: [
          { icon: 'trending_up', title: 'For Sales Teams', subtitle: 'Track field visits and daily activity' },
          { icon: 'local_shipping', title: 'For Delivery Teams', subtitle: 'Confirm stops and on-the-road hours' },
          { icon: 'construction', title: 'For Construction Companies', subtitle: 'Site attendance with geofencing' },
          { icon: 'handyman', title: 'For Service Businesses', subtitle: 'Technicians, jobs and time on site' },
          { icon: 'precision_manufacturing', title: 'For Manufacturing Companies', subtitle: 'Shift attendance across factory floors' },
        ],
      },
    ],
  },
  {
    id: 'Platforms',
    label: 'Platforms',
    columns: [
      {
        title: 'Get the app',
        items: [
          { icon: 'android', title: 'Android', subtitle: 'Download on Google Play', href: STORE_LINKS.playStore, external: true },
          { icon: 'apple', title: 'iOS', subtitle: 'Download on the App Store', href: STORE_LINKS.appStore, external: true },
          { icon: 'desktop_windows', title: 'Windows', subtitle: 'Install from Microsoft Store', href: STORE_LINKS.microsoftStore, external: true },
          { icon: 'language', title: 'Web', subtitle: 'Open the browser app', href: ROUTES.signIn },
        ],
      },
    ],
  },
  {
    id: 'Resources',
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        items: [
          { icon: 'article', title: 'Blog', subtitle: 'Guides on attendance and GPS' },
          { icon: 'menu_book', title: 'Guides', subtitle: 'How attendance & workforce tools work' },
          { icon: 'new_releases', title: 'Product Updates', subtitle: 'What is new in Teamital' },
        ],
      },
      {
        title: 'Support',
        items: [
          { icon: 'help_center', title: 'Help Center', subtitle: 'Get answers and how-to steps' },
          { icon: 'quiz', title: 'FAQs', subtitle: 'Common questions about the workflow' },
          { icon: 'mail_outline', title: 'Contact Support', subtitle: 'Reach our support inbox', href: ROUTES.contact },
        ],
      },
    ],
  },
];

/** Which top-level tab is highlighted for a given path (mirrors WebSitePage). */
function currentFor(path: string): string {
  if (path === '/') return 'home';
  if (path === ROUTES.pricing) return 'pricing';
  if (path === ROUTES.howItWorks) return 'howItWorks';
  if (path === ROUTES.contact) return 'contact';
  if (path === ROUTES.features) return 'Features';
  if (path === ROUTES.blog) return 'Resources';
  return 'home';
}

/** Bootstrapped breakpoint: width below which the compact (hamburger) header shows. */
export type CompactBelow = 0 | 900 | 980;

export function Header({ compactBelow = 980 }: { compactBelow?: CompactBelow }) {
  const pathname = usePathname() || '/';
  const current = currentFor(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);

  // Close menus on navigation.
  useEffect(() => {
    setOpenMenu(null);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  const closeMenu = () => setOpenMenu(null);
  const open = MENUS.find((m) => m.id === openMenu);

  const tab = (id: string, label: string, href: string) => (
    <div className="hdr-tabwrap" key={id}>
      <Link
        href={href}
        onClick={closeMenu}
        className={cx('hdr-tab', current === id && 'hdr-tab-active')}
      >
        {label}
      </Link>
    </div>
  );

  const renderItem = (item: MegaItem, mobile = false) => {
    const clickable = Boolean(item.href);
    const inner = mobile ? (
      <>
        {item.icon === 'apple' ? (
          <AppleGlyph size={24} color="#4b5c92" />
        ) : (
          <Icon name={item.icon} size={24} color="#4b5c92" />
        )}
        <span className="sheet-tile-text">
          <span className="sheet-tile-title">{item.title}</span>
          <span className="sheet-tile-sub">{item.subtitle}</span>
        </span>
      </>
    ) : (
      <div className="mega-row">
        <div className="mega-ico">
          {item.icon === 'apple' ? (
            <AppleGlyph size={18} color="#1A56DB" />
          ) : (
            <Icon name={item.icon} size={18} color="#1A56DB" />
          )}
        </div>
        <div className="mega-txt">
          <div className={cx('mega-title', !clickable && 'mega-title-dim')}>{item.title}</div>
          <div className="mega-sub">{item.subtitle}</div>
        </div>
      </div>
    );
    const wrapCls = mobile ? 'sheet-tile' : 'mega-item';
    if (!clickable) {
      return (
        <div key={item.title} className={cx(wrapCls, mobile && 'sheet-tile-off')}>
          {inner}
        </div>
      );
    }
    if (item.external) {
      return (
        <a
          key={item.title}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(wrapCls, 'is-link')}
          onClick={() => setSheet(false)}
        >
          {inner}
        </a>
      );
    }
    return (
      <SmartLink
        key={item.title}
        href={item.href!}
        className={cx(wrapCls, 'is-link')}
        onClick={() => {
          setOpenMenu(null);
          setSheet(false);
        }}
      >
        {inner}
      </SmartLink>
    );
  };

  return (
    <header className="hdr" data-bp={compactBelow}>
      {/* Wide bar */}
      <div className="hdr-bar hdr-wide">
        <div className="hdr-slot hdr-slot-left">
          <Link href="/" onClick={closeMenu} className="hdr-logo">
            <BrandLogo height={132} />
          </Link>
        </div>
        <div className="hdr-center">
          <nav className="hdr-nav">
            {tab('home', 'Home', '/')}
            {MENUS.map((m) => {
              const isOpen = openMenu === m.id;
              const active = isOpen || current === m.id;
              return (
                <div className="hdr-tabwrap" key={m.id}>
                  <button
                    type="button"
                    className={cx('hdr-tab', active && 'hdr-tab-active')}
                    onClick={() => setOpenMenu(isOpen ? null : m.id)}
                    aria-expanded={isOpen}
                  >
                    {m.label}
                    <Icon
                      name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      size={18}
                      color={active ? '#1A56DB' : '#6B7280'}
                    />
                  </button>
                </div>
              );
            })}
            {tab('howItWorks', 'How It Works', ROUTES.howItWorks)}
            {tab('pricing', 'Pricing', ROUTES.pricing)}
          </nav>
        </div>
        <div className="hdr-slot hdr-slot-right">
          <a href={appAbsolute(ROUTES.signIn)} className="btn-text">
            Sign in
          </a>
          <a href={appAbsolute(ROUTES.signUp)} className="btn-filled hdr-cta">
            Start free trial
          </a>
        </div>
      </div>

      {/* Compact bar */}
      <div className="hdr-bar hdr-compact">
        <Link href="/" className="hdr-logo hdr-logo-compact">
          <BrandLogo height={104} />
        </Link>
        <span style={{ flex: 1 }} />
        <button type="button" className="hdr-burger" aria-label="Menu" onClick={() => setSheet(true)}>
          <Icon name="menu" size={24} color="#111827" />
        </button>
      </div>

      {open && (
        <div className="mega hdr-wide">
          <div className="mega-inner">
            {open.columns.map((col, i) => (
              <Fragment key={col.title}>
                {i > 0 && <div className="mega-div" />}
                <div className="mega-col">
                  <div className="mega-col-title">{col.title.toUpperCase()}</div>
                  {col.items.map((it) => renderItem(it))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {sheet && (
        <div className="sheet-scrim" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="sheet-body">
              <div className="sheet-logo">
                <BrandLogo height={108} />
              </div>
              <Link href="/" className="sheet-tile is-link" onClick={() => setSheet(false)}>
                <span className="sheet-tile-text">
                  <span className="sheet-tile-title">Home</span>
                </span>
              </Link>
              {MENUS.map((m) => m.columns.map((c) => c.items.map((it) => renderItem(it, true))))}
              <Link href={ROUTES.howItWorks} className="sheet-tile is-link" onClick={() => setSheet(false)}>
                <span className="sheet-tile-text">
                  <span className="sheet-tile-title">How It Works</span>
                </span>
              </Link>
              <Link href={ROUTES.pricing} className="sheet-tile is-link" onClick={() => setSheet(false)}>
                <span className="sheet-tile-text">
                  <span className="sheet-tile-title">Pricing</span>
                </span>
              </Link>
              <hr className="sheet-hr" />
              <a href={appAbsolute(ROUTES.signIn)} className="btn-outlined sheet-btn">
                Sign in
              </a>
              <a href={appAbsolute(ROUTES.signUp)} className="btn-filled sheet-btn sheet-btn-filled">
                Start free trial
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Material Icons has no Apple logo, so this draws the same glyph Flutter's Icons.apple shows. */
function AppleGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.82 2.3-4.17 2.4-4.24-1.31-1.91-3.34-2.17-4.06-2.2-1.73-.18-3.37 1.02-4.25 1.02-.88 0-2.23-.99-3.67-.96-1.89.03-3.63 1.1-4.6 2.79-1.96 3.4-.5 8.43 1.41 11.19.93 1.35 2.05 2.86 3.51 2.81 1.41-.06 1.94-.91 3.64-.91 1.7 0 2.18.91 3.67.88 1.52-.03 2.48-1.38 3.4-2.74 1.07-1.57 1.51-3.09 1.54-3.17-.03-.01-2.95-1.13-2.99-4.47zM14.27 3.88c.77-.94 1.29-2.24 1.15-3.54-1.11.05-2.46.74-3.25 1.68-.71.83-1.34 2.16-1.17 3.43 1.24.1 2.5-.63 3.27-1.57z" />
    </svg>
  );
}
