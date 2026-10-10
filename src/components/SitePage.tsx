import type { ReactNode } from 'react';
import { Header, type CompactBelow } from './Header';
import { Footer } from './Footer';
import { cx } from './ui';

/**
 * Page chrome shared by all marketing pages: header + content + footer.
 * `theme` mirrors the Flutter Theme in use ("seed" = ColorScheme.fromSeed pages, "app" = app theme).
 */
export function SitePage({
  children,
  compactBelow = 980,
  stickyHeader = false,
  theme = 'seed',
  background = '#F5F7FA',
  footer = true,
}: {
  children: ReactNode;
  compactBelow?: CompactBelow;
  stickyHeader?: boolean;
  theme?: 'seed' | 'app';
  background?: string;
  footer?: boolean;
}) {
  return (
    <div className={cx('page', `theme-${theme}`)} style={{ background }}>
      <div className={cx('page-header', stickyHeader && 'page-header-sticky')}>
        <Header compactBelow={compactBelow} />
      </div>
      {children}
      {footer && <Footer />}
    </div>
  );
}

/** AppBar-style chrome used by the long-form policy pages (no site header). */
export function PolicyShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page theme-seed" style={{ background: '#F5F7FA' }}>
      <div className="appbar">
        <span className="appbar-title">{title}</span>
      </div>
      {children}
      <Footer />
    </div>
  );
}
