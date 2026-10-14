'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/config';
import { Icon, SmartLink, cx } from '../ui';

type Tab = 'Monthly' | '1 Year';

type Pkg = { key: string; name: string; price: string; unit: string; features: string[] };

const eur = (n: number) => `€${n.toLocaleString('en-IE')}`;

/** Two packages per billing period (same card design as the pricing page). */
function packagesFor(tab: Tab): Pkg[] {
  const yearly = tab === '1 Year';
  const label = yearly ? 'Yearly' : 'Monthly';
  return [
    {
      key: 'license',
      name: `${label} License`,
      price: eur(yearly ? 5000 : 1000),
      unit: yearly ? '/year' : '/month',
      features: [`Up to ${yearly ? 50 : 10} Companies`, `Up to ${(yearly ? 2000 : 1000).toLocaleString('en-IE')} Employees`],
    },
    {
      key: 'usage',
      name: `${label} Usage-Based`,
      price: eur(500),
      unit: '/One-time Setup Fee',
      features: [
        `${yearly ? 60 : 50}% OFF all packages listed on Teamital’s official website price list`,
        'Pay according to the packages selected',
      ],
    },
  ];
}

export function WlPackages() {
  const [tab, setTab] = useState<Tab>('Monthly');

  return (
    <div className="wlp">
      <div className="pr-toggle" role="tablist" aria-label="Billing period">
        {(['Monthly', '1 Year'] as Tab[]).map((t) => (
          <button type="button" role="tab" aria-selected={t === tab} key={t} className={cx('seg', t === tab && 'seg-on')} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="plans-wrap wlp-wrap" key={tab}>
        <div className="plans wlp-plans">
          {packagesFor(tab).map((p, i) => (
            <div className="plan" key={p.key}>
              <div className="plan-top">
                <span className="wlp-num">{i + 1}</span>
                <div className="plan-name">{p.name}</div>
                <span className={cx('bill-chip', tab === '1 Year' ? 'chip-year' : 'chip-month')}>{tab === '1 Year' ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="plan-price">
                {p.price}
                <span className="wlp-unit">{p.unit}</span>
              </div>
              <div className="plan-feats">
                {p.features.map((f) => (
                  <div className="plan-feat" key={f}>
                    <Icon name="arrow_forward" size={20} color="#1A56DB" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <SmartLink href={ROUTES.contact} className="plan-btn">
                Become a partner
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
