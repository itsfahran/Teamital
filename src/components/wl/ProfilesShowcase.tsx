'use client';

import { useState } from 'react';
import { plainText } from '@/lib/content/utils';
import { Icon, cx } from '../ui';

type Profile = {
  title: string;
  text: string;
  label: string;
  features: Array<{ title: string; text: string }>;
  icon: string;
  tone: 'blue' | 'green';
};

/**
 * Left column: the two profile cards, stacked. Right column: the details of the card that is
 * hovered / focused / tapped, popping in with an animation.
 */
export function ProfilesShowcase({ profiles, labels }: { profiles: Profile[]; labels: { profileHint: string; profileHintActive: string; featuresWord: string; featuresIncluded: string } }) {
  const [active, setActive] = useState(0);
  const cur = profiles[active];

  return (
    <div className="ps">
      <div className="ps-left" role="tablist" aria-label="Profiles">
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
                <Icon name={p.icon} size={26} />
              </span>
              <span className="ps-card-count">{p.features.length} {labels.featuresWord}</span>
            </span>
            <span className="ps-card-title">{p.title}</span>
            <span className="ps-card-text">{plainText(p.text)}</span>
            <span className="ps-card-hint">
              {i === active ? labels.profileHintActive : labels.profileHint}
              <Icon name="arrow_forward" size={18} className="ps-card-arrow" />
            </span>
          </button>
        ))}
      </div>

      <div className={cx('ps-right', `tone-${cur.tone}`)} aria-live="polite">
        <span className="ps-glow" aria-hidden="true" />
        <div className="ps-pop" key={active} role="tabpanel">
          <div className="ps-right-head">
            <span className="ps-right-ico">
              <Icon name={cur.icon} size={24} color="#fff" />
            </span>
            <span>
              <span className="ps-panel-label">{cur.label}</span>
              <span className="ps-right-sub">{cur.features.length} {labels.featuresIncluded}</span>
            </span>
          </div>
          <ul>
            {cur.features.map(({ title: name, text }, i) => (
              <li key={name + i} style={{ animationDelay: `${60 + i * 40}ms` }}>
                <span className="ps-check">
                  <Icon name="check" size={16} color="#fff" />
                </span>
                <span>
                  <b>{name}</b>
                  <span>{plainText(text)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
