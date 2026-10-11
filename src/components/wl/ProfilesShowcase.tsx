'use client';

import { useState } from 'react';
import { Icon, cx } from '../ui';

type Profile = {
  title: string;
  text: string;
  label: string;
  features: Array<[string, string]>;
  icon: string;
  tone: 'blue' | 'green';
};

/**
 * Two profile cards. Hovering (or focusing / tapping) a card pops its feature list open
 * in the panel beneath, with a staggered animation.
 */
export function ProfilesShowcase({ profiles }: { profiles: Profile[] }) {
  const [active, setActive] = useState(0);
  const cur = profiles[active];

  return (
    <div className="ps">
      <div className="ps-cards" role="tablist" aria-label="Profiles">
        {profiles.map((p, i) => (
          <button
            key={p.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={cx('ps-card', `tone-${p.tone}`, i === active && 'ps-card-on')}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="ps-card-top">
              <span className="ps-card-ico">
                <Icon name={p.icon} size={28} />
              </span>
              <span className="ps-card-count">{p.features.length} features</span>
            </span>
            <span className="ps-card-title">{p.title}</span>
            <span className="ps-card-text">{p.text}</span>
            <span className="ps-card-hint">
              {i === active ? 'Showing features below' : 'Hover to see features'}
              <Icon name={i === active ? 'expand_more' : 'arrow_downward'} size={18} />
            </span>
          </button>
        ))}
      </div>

      <div className={cx('ps-panel', `tone-${cur.tone}`)} aria-live="polite">
        <span className="ps-pointer" style={{ left: active === 0 ? '25%' : '75%' }} aria-hidden="true" />
        <div className="ps-pop" key={active} role="tabpanel">
          <div className="ps-panel-label">{cur.label}</div>
          <ul>
            {cur.features.map(([name, text], i) => (
              <li key={name} style={{ animationDelay: `${60 + i * 45}ms` }}>
                <span className="ps-check">
                  <Icon name="check" size={16} color="#fff" />
                </span>
                <span>
                  <b>{name}</b>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
