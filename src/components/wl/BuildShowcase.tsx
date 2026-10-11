'use client';

import { useState } from 'react';
import type { IconCard } from '@/content/white-label';
import { Icon, cx } from '../ui';

/**
 * Left: three named cards (25%). Right: a panel (75%) where the hovered / focused / tapped
 * card's content pops up with an animation.
 */
export function BuildShowcase({ items }: { items: IconCard[] }) {
  const [active, setActive] = useState(0);
  const cur = items[active];

  return (
    <div className="bs">
      <div className="bs-list" role="tablist" aria-label="Brand, customers and pricing">
        {items.map((it, i) => (
          <button
            key={it.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={cx('bs-card', `tone-${it.tone ?? 'blue'}`, i === active && 'bs-card-on')}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="bs-card-ico">
              <Icon name={it.icon} size={22} />
            </span>
            <span className="bs-card-name">{it.title}</span>
            <Icon name="arrow_forward" size={18} className="bs-card-arrow" />
          </button>
        ))}
      </div>

      <div className={cx('bs-stage', `tone-${cur.tone ?? 'blue'}`)} aria-live="polite">
        <span className="bs-glow" aria-hidden="true" />
        <span className="bs-water" aria-hidden="true">
          <Icon name={cur.icon} size={220} />
        </span>
        <div className="bs-pop" key={active} role="tabpanel">
          <span className="bs-pop-ico">
            <Icon name={cur.icon} size={30} color="#fff" />
          </span>
          <span className="bs-pop-step">
            {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <h3>{cur.title}</h3>
          <p>{cur.text}</p>
        </div>
        <div className="bs-dots" aria-hidden="true">
          {items.map((_, i) => (
            <i key={i} className={i === active ? 'bs-dot-on' : ''} />
          ))}
        </div>
      </div>
    </div>
  );
}
