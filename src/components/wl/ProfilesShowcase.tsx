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
 * Two columns. Each column is a profile card with its own details area underneath:
 * hovering (or tapping) a card opens that column's feature list with an animation.
 */
export function ProfilesShowcase({ profiles }: { profiles: Profile[] }) {
  const [open, setOpen] = useState<boolean[]>(() => profiles.map(() => false));

  const set = (i: number, v: boolean) => setOpen((o) => o.map((x, idx) => (idx === i ? v : x)));
  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <div className="ps">
      {profiles.map((p, i) => {
        const isOpen = open[i];
        return (
          <div
            key={p.title}
            className={cx('ps-col', `tone-${p.tone}`, isOpen && 'ps-col-open')}
            onMouseEnter={() => canHover() && set(i, true)}
            onMouseLeave={() => canHover() && set(i, false)}
          >
            <button
              type="button"
              className="ps-card"
              aria-expanded={isOpen}
              aria-controls={`ps-details-${i}`}
              onFocus={() => set(i, true)}
              onClick={() => {
                if (!canHover()) set(i, !isOpen);
              }}
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
                {isOpen ? 'Features' : 'Hover to see features'}
                <Icon name="expand_more" size={18} className="ps-card-chev" />
              </span>
            </button>

            <div className="ps-details" id={`ps-details-${i}`} role="region" aria-label={p.label}>
              <div className="ps-details-in">
                <div className="ps-details-card">
                  <div className="ps-panel-label">{p.label}</div>
                  <ul>
                    {p.features.map(([name, text], k) => (
                      <li key={name} style={{ transitionDelay: isOpen ? `${80 + k * 40}ms` : '0ms' }}>
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
          </div>
        );
      })}
    </div>
  );
}
