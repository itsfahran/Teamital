'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/config';
import { Icon, SmartLink, cx } from '../ui';

type Pkg = {
  tab: 'Monthly' | 'Yearly';
  setup: number;
  discount: number;
  price: number;
  per: string;
  companies: number;
  employees: number;
};

const PACKAGES: Pkg[] = [
  { tab: 'Monthly', setup: 500, discount: 50, price: 1000, per: 'month', companies: 10, employees: 1000 },
  { tab: 'Yearly', setup: 500, discount: 60, price: 5000, per: 'year', companies: 50, employees: 2000 },
];

const eur = (n: number) => `€${n.toLocaleString('en-IE')}`;

export function WlPackages() {
  const [tab, setTab] = useState<Pkg['tab']>('Monthly');
  const p = PACKAGES.find((x) => x.tab === tab) ?? PACKAGES[0];

  return (
    <div className="wlp">
      <div className="pr-toggle wlp-toggle" role="tablist" aria-label="Billing period">
        {PACKAGES.map((x) => (
          <button type="button" role="tab" aria-selected={x.tab === tab} key={x.tab} className={cx('seg', x.tab === tab && 'seg-on')} onClick={() => setTab(x.tab)}>
            {x.tab}
          </button>
        ))}
      </div>

      <div className="wlp-card" key={tab}>
        <div className="wlp-main">
          <div className="wlp-top">
            <span className="wlp-name">White Label Package</span>
            <span className="bill-chip">{p.tab}</span>
          </div>
          <div className="wlp-label">{p.tab} cost</div>
          <div className="wlp-price">
            {eur(p.price)}
            <span>/{p.per}</span>
          </div>
          <div className="wlp-setup">
            <Icon name="payments" size={20} color="#1A56DB" />
            <span>
              One-time setup fee <b>{eur(p.setup)}</b>
            </span>
          </div>
          <SmartLink href={ROUTES.contact} className="hero-btn hero-btn-primary wlp-cta">
            <span>Become a partner</span>
            <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
          </SmartLink>
        </div>

        <ul className="wlp-feats">
          <li>
            <span className="wlp-ico wlp-ico-a">
              <Icon name="domain" size={26} />
            </span>
            <span>
              <b>{p.companies} Companies</b>
              <i>Onboard and manage up to {p.companies} client companies</i>
            </span>
          </li>
          <li>
            <span className="wlp-ico wlp-ico-b">
              <Icon name="groups" size={26} />
            </span>
            <span>
              <b>{p.employees.toLocaleString('en-IE')} Employees</b>
              <i>Across all of your client companies</i>
            </span>
          </li>
          <li>
            <span className="wlp-ico wlp-ico-c">
              <Icon name="percent" size={26} />
            </span>
            <span>
              <b>{p.discount}% on all packages</b>
              <i>Partner discount on every Teamital package you resell</i>
            </span>
          </li>
          <li>
            <span className="wlp-ico wlp-ico-d">
              <Icon name="palette" size={26} />
            </span>
            <span>
              <b>Your brand, your pricing</b>
              <i>Your name, logo and domain, with the full partner portal</i>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
