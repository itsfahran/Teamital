'use client';

import { useEffect, useState } from 'react';
import { Icon, cx } from '../ui';

export type TocItem = { id: string; num: string; title: string };

/** Scroll progress bar, scroll-spy contents list and back-to-top button for legal pages. */
export function PolicyNav({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('pg-article');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-r.top + window.innerHeight * 0.3, 0), Math.max(total, 1));
      setProgress(Math.min(100, (done / Math.max(total, 1)) * 100));
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -62% 0px', threshold: 0 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <>
      <div className="pg-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <nav className="pg-toc" aria-label="On this page">
        <div className="pg-toc-t">On this page</div>
        <ol>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className={cx(active === it.id && 'pg-toc-on')}>
                <span className="pg-toc-n">{it.num}</span>
                <span>{it.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="pg-toc-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </nav>

      <button
        type="button"
        className={cx('pg-top', showTop && 'pg-top-on')}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon name="arrow_upward" size={22} color="#fff" />
      </button>
    </>
  );
}
