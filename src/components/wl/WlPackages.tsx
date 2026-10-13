'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/config';
import { Icon, SmartLink, cx } from '../ui';

type Tab = 'Monthly' | '1 Year';

type Pkg = { key: string; name: string; price: string; features: string[] };

const eur = (n: number) => `€${n.toLocaleString('en-IE')}`;

/** Two packages per billing period (same card design as the pricing page). */
function packagesFor(tab: Tab): Pkg[] {
  const yearly = tab === '1 Year';
  return [
    { key: 'setup', name: 'One Time Setup Fee', price: eur(500), features: [`${yearly ? 60 : 50}% on all packages`] },
    {
      key: 'cost',
      name: yearly ? 'Yearly Cost' : 'Monthly Cost',
      price: `${eur(yearly ? 5000 : 1000)}/${yearly ? 'yr' : 'mo'}`,
      features: [`${yearly ? 50 : 10} Companies`, `${(yearly ? 2000 : 1000).toLocaleString('en-IE')} Employees`],
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
          {packagesFor(tab).map((p) => (
            <div className="plan" key={p.key}>
              <div className="plan-top">
                <div className="plan-name">{p.name}</div>
                <span className={cx('bill-chip', tab === '1 Year' ? 'chip-year' : 'chip-month')}>{tab === '1 Year' ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="plan-price">{p.price}</div>
              <div className="plan-feats">
                {p.features.map((f) => (
                  <div className="plan-feat" key={f}>
                    <Icon name="check_circle" size={20} color="#10B981" />
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
