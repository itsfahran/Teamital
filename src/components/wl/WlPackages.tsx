'use client';

import { useState } from 'react';
import { plainText } from '@/lib/content/utils';
import { ROUTES } from '@/lib/config';
import type { WLContent } from '@/content/white-label';
import { Icon, SmartLink, cx } from '../ui';

/** Monthly / yearly package cards (same card design as the pricing page). Content comes from the CMS. */
export function WlPackages({ c }: { c: WLContent['packages'] }) {
  const [yearly, setYearly] = useState(false);
  const cards = yearly ? c.yearly : c.monthly;
  const tabs = [
    { label: c.monthlyTab, on: !yearly, set: () => setYearly(false) },
    { label: c.yearlyTab, on: yearly, set: () => setYearly(true) },
  ];

  return (
    <div className="wlp">
      <div className="pr-toggle" role="tablist" aria-label="Billing period">
        {tabs.map((t, i) => (
          <button type="button" role="tab" aria-selected={t.on} key={i} className={cx('seg', t.on && 'seg-on')} onClick={t.set}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="plans-wrap wlp-wrap" key={String(yearly)}>
        <div className="plans wlp-plans">
          {cards.map((p, i) => (
            <div className="plan" key={i}>
              <div className="plan-top">
                <span className="wlp-num">{i + 1}</span>
                <div className="plan-name">{p.name}</div>
                <span className={cx('bill-chip', yearly ? 'chip-year' : 'chip-month')}>{yearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="plan-price">
                {p.price}
                <span className="wlp-unit">{p.unit}</span>
              </div>
              <div className="plan-feats">
                {p.features.map((f, j) => (
                  <div className="plan-feat" key={j}>
                    <Icon name="arrow_forward" size={20} color="#1A56DB" />
                    <span>{plainText(f)}</span>
                  </div>
                ))}
              </div>
              <SmartLink href={ROUTES.contact} className="plan-btn">
                {c.cta}
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
