'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { appAbsolute, ROUTES, STORE_LINKS } from '@/lib/config';
import { BRAND_ICONS } from './brand-icons';
import { BrandLogo, Icon, SmartLink, cx } from './ui';

type MegaItem = { icon: string; title: string; subtitle: string; href?: string; external?: boolean };
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
          { icon: 'article', title: 'Blog', subtitle: 'Guides on attendance and GPS', href: ROUTES.blog },
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

const TONES = ['blue', 'violet', 'green', 'amber', 'rose', 'sky'] as const;

/** Which top-level tab is highlighted for a given path. */
function currentFor(path: string): string {
  if (path === '/') return 'home';
  if (path === ROUTES.pricing) return 'pricing';
  if (path === ROUTES.howItWorks) return 'howItWorks';
  if (path === ROUTES.contact) return 'contact';
  if (path === ROUTES.features) return 'Features';
  if (path === ROUTES.blog || path.startsWith(`${ROUTES.blog}/`)) return 'Resources';
  return 'home';
}

/** Width below which the compact (hamburger) header shows. */
export type CompactBelow = 0 | 900 | 980;

/** Material Icons has no Apple logo, so the real glyph is drawn inline. */
function GlyphIcon({ name, size, className }: { name: string; size: number; className?: string }) {
  if (name === 'apple') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
        <path d={BRAND_ICONS.apple} />
      </svg>
    );
  }
  return <Icon name={name} size={size} className={className} />;
}

export function Header({ compactBelow = 980 }: { compactBelow?: CompactBelow }) {
  const pathname = usePathname() || '/';
  const current = currentFor(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openOnHover = (id: string | null) => {
    cancelClose();
    setOpenMenu(id);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 90);
  };

  // Close menus on navigation.
  useEffect(() => {
    setOpenMenu(null);
    setSheet(false);
  }, [pathname]);

  // Shrink + shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outside click / Escape closes the mega menu.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  const closeAll = () => {
    setOpenMenu(null);
    setSheet(false);
  };
  const open = MENUS.find((m) => m.id === openMenu);

  const tab = (id: string, label: string, href: string) => (
    <li className="hdr-li" key={id} onMouseEnter={() => openOnHover(null)}>
      <Link
        href={href}
        onClick={closeAll}
        className={cx('hdr-tab', current === id && !openMenu && 'hdr-tab-active')}
        aria-current={current === id ? 'page' : undefined}
      >
        {label}
      </Link>
    </li>
  );

  const renderItem = (item: MegaItem, tone: string, mobile = false) => {
    const clickable = Boolean(item.href);
    const tile = (
      <span className={cx('tile', `tone-${tone}`, mobile && 'tile-sm')}>
        <GlyphIcon name={item.icon} size={mobile ? 20 : 22} />
      </span>
    );
    const text = (
      <span className="mi-text">
        <span className="mi-title">{item.title}</span>
        <span className="mi-sub">{item.subtitle}</span>
      </span>
    );
    const arrow = clickable ? <Icon name="arrow_forward" size={18} className="mi-arrow" /> : null;
    const cls = cx(mobile ? 'sheet-item' : 'mega-item', clickable ? 'is-link' : 'is-soon');
    const body = (
      <>
        {tile}
        {text}
        {arrow}
      </>
    );
    if (!clickable) {
      return (
        <div key={item.title} className={cls}>
          {body}
        </div>
      );
    }
    if (item.external) {
      return (
        <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={closeAll}>
          {body}
        </a>
      );
    }
    return (
      <SmartLink key={item.title} href={item.href!} className={cls} onClick={closeAll}>
        {body}
      </SmartLink>
    );
  };

  return (
    <header ref={rootRef} className={cx('hdr', scrolled && 'hdr-scrolled', openMenu && 'hdr-open')} data-bp={compactBelow}>
      {openMenu && <div className="hdr-scrim" aria-hidden="true" onMouseEnter={scheduleClose} />}

      {/* Wide bar */}
      <div className="hdr-bar hdr-wide">
        <Link href="/" onClick={closeAll} className="hdr-logo" aria-label="Teamital home">
          <BrandLogo height={72} />
        </Link>

        <nav className="hdr-nav" aria-label="Primary">
          <ul className="hdr-list">
            {tab('home', 'Home', '/')}
            {MENUS.map((m) => {
              const isOpen = openMenu === m.id;
              const active = isOpen || current === m.id;
              return (
                <li className="hdr-li" key={m.id} onMouseEnter={() => openOnHover(m.id)}>
                  <button
                    type="button"
                    className={cx('hdr-tab', active && 'hdr-tab-active', isOpen && 'hdr-tab-open')}
                    onClick={() => setOpenMenu(isOpen ? null : m.id)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {m.label}
                    <Icon name="keyboard_arrow_down" size={18} className="hdr-chev" />
                  </button>
                </li>
              );
            })}
            {tab('howItWorks', 'How It Works', ROUTES.howItWorks)}
            {tab('pricing', 'Pricing', ROUTES.pricing)}
          </ul>
        </nav>

        <div className="hdr-actions">
          <a href={appAbsolute(ROUTES.signIn)} className="hdr-signin">
            <Icon name="login" size={18} />
            Sign in
          </a>
          <a href={appAbsolute(ROUTES.signUp)} className="hdr-cta">
            <span>Start free trial</span>
            <Icon name="arrow_forward" size={18} className="hdr-cta-arrow" />
          </a>
        </div>
      </div>

      {/* Compact bar */}
      <div className="hdr-bar hdr-compact">
        <Link href="/" className="hdr-logo hdr-logo-compact" aria-label="Teamital home">
          <BrandLogo height={60} />
        </Link>
        <span style={{ flex: 1 }} />
        <button type="button" className="hdr-burger" aria-label="Open menu" onClick={() => setSheet(true)}>
          <Icon name="menu" size={24} />
        </button>
      </div>

      {/* Mega menu (overlays the page) */}
      {open && (
        <div className="mega hdr-wide" key={open.id} role="menu" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          <div className="mega-inner">
            <div className="mega-cols">
              {open.columns.map((col, ci) => (
                <Fragment key={col.title}>
                  {ci > 0 && <div className="mega-div" />}
                  <div className="mega-col">
                    <div className="mega-col-title">{col.title}</div>
                    {col.items.map((it, ii) => renderItem(it, TONES[(ci * 3 + ii) % TONES.length]))}
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="mega-foot">
              <span className="mega-foot-t">
                <Icon name="auto_awesome" size={18} />
                Not sure where to start? We will walk you through it.
              </span>
              <span className="mega-foot-links">
                <Link href={ROUTES.pricing} onClick={closeAll}>
                  See pricing
                </Link>
                <Link href={ROUTES.contact} onClick={closeAll} className="mega-foot-btn">
                  Talk to our team
                  <Icon name="arrow_forward" size={16} />
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {sheet && (
        <div className="sheet-scrim" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="sheet-top">
              <span className="sheet-grab" aria-hidden="true" />
              <button type="button" className="sheet-close" aria-label="Close menu" onClick={() => setSheet(false)}>
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="sheet-body">
              <div className="sheet-quick">
                <Link href="/" className={cx('sheet-chip', current === 'home' && 'sheet-chip-on')} onClick={closeAll}>
                  Home
                </Link>
                <Link href={ROUTES.howItWorks} className={cx('sheet-chip', current === 'howItWorks' && 'sheet-chip-on')} onClick={closeAll}>
                  How It Works
                </Link>
                <Link href={ROUTES.pricing} className={cx('sheet-chip', current === 'pricing' && 'sheet-chip-on')} onClick={closeAll}>
                  Pricing
                </Link>
              </div>
              {MENUS.map((m) => (
                <section key={m.id} className="sheet-sec">
                  <h3 className="sheet-h">{m.label}</h3>
                  {m.columns.flatMap((c, ci) =>
                    c.items.map((it, ii) => renderItem(it, TONES[(ci * 3 + ii) % TONES.length], true)),
                  )}
                </section>
              ))}
            </div>
            <div className="sheet-cta">
              <a href={appAbsolute(ROUTES.signIn)} className="sheet-btn sheet-btn-ghost">
                Sign in
              </a>
              <a href={appAbsolute(ROUTES.signUp)} className="sheet-btn sheet-btn-primary">
                Start free trial
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
