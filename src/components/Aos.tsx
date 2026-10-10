'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from './ui';

/**
 * Scroll-reveal (port of WebAos): fades/slides in once the top edge is on screen,
 * with a 700ms safety net so tall sections never stay hidden.
 */
export function Aos({
  children,
  delay = 0,
  fromLeft = false,
  fromRight = false,
  offset = 36,
}: {
  children: ReactNode;
  delay?: number;
  fromLeft?: boolean;
  fromRight?: boolean;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reveal = () => {
      if (started) return;
      started = true;
      clearInterval(poll);
      timers.push(setTimeout(() => setShown(true), delay));
    };
    const check = () => {
      if (started) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - offset && r.top + 48 > 0) reveal();
    };
    const poll = setInterval(check, 160);
    check();
    timers.push(setTimeout(reveal, 700));
    return () => {
      clearInterval(poll);
      timers.forEach(clearTimeout);
    };
  }, [delay, offset]);

  return (
    <div ref={ref} className={cx('aos', fromLeft && 'aos-l', fromRight && 'aos-r', shown && 'aos-in')}>
      {children}
    </div>
  );
}
