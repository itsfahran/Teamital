'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/config';
import { Icon } from '../ui';
import { BookingWidget } from './BookingWidget';

const Ctx = createContext<{ open: () => void; close: () => void }>({ open: () => {}, close: () => {} });
export const useBookingModal = () => useContext(Ctx);

/**
 * Opens the booking widget in a pop-up. Every link to /book-a-call on the site (navbar, footer, CMS
 * content) is intercepted and opens the pop-up instead of navigating; the page itself still works
 * when visited directly.
 */
export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const u = new URL(a.href, window.location.href);
      if (u.origin !== window.location.origin || u.pathname.replace(/\/$/, '') !== ROUTES.bookCall) return;
      if (window.location.pathname.startsWith(ROUTES.bookCall)) return; // already on the page
      e.preventDefault(); // Next's <Link> skips navigation when the click is defaultPrevented
      setOpen(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && (
        <div className="bkm" role="dialog" aria-modal="true" aria-label="Book a free call" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div className="bkm-panel">
            <div className="bkm-head">
              <span className="bkm-title">
                <Icon name="event_available" size={22} color="#1A56DB" />
                Book a free 1:1 call
              </span>
              <button type="button" className="bkm-close" onClick={close} aria-label="Close">
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="bkm-body">
              <BookingWidget />
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
