'use client';

import { useEffect, useRef, useState } from 'react';

/** Animates a value like "99.9%" or "24/7" the first time it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const target = m ? parseFloat(m[1]) : NaN;
  const suffix = m ? m[2] : '';
  const decimals = m && m[1].includes('.') ? m[1].split('.')[1].length : 0;
  const animate = Number.isFinite(target) && !suffix.startsWith('/');
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(target * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [animate, target]);

  if (!animate) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {Number(shown).toFixed(decimals)}
      {suffix}
    </span>
  );
}
