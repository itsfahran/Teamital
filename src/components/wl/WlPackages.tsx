'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/config';
import { Icon, SmartLink, cx } from '../ui';

type Tab = 'Monthly' | 'Yearly';

type Card = {
  key: string;
  icon: string;
  title: string;
  price: number;
  per: string | null;
  note: string;
  features: Array<[string, string]>;
};

const eur = (n: number) => `€${n.toLocaleString('en-IE')}`;

/** Two packages per billing period: the one-time setup fee, and the recurring cost. */
function cardsFor(tab: Tab): Card[] {
  const yearly = tab === 'Yearly';
  return [
    {
      key: 'setup',
      icon: 'rocket_launch',
      title: 'One Time Setup Fee',
      price: 500,
      per: null,
      note: 'Paid once to launch your branded platform',
      features: [[`${yearly ? 60 : 50}% on all packages`, 'check']],
    },
    {
      key: 'cost',
      icon: 'event_repeat',
      title: yearly ? 'Yearly Cost' : 'Monthly Cost',
      price: yearly ? 5000 : 1000,
      per: yearly ? 'year' : 'month',
      note: yearly ? 'Billed once a year' : 'Billed every month',
      features: [
        [`${yearly ? 50 : 10} Companies`, 'check'],
        [`${(yearly ? 2000 : 1000).toLocaleString('en-IE')} Employees`, 'check'],
      ],
    },
  ];
}

export function WlPackages() {
  const [tab, setTab] = useState<Tab>('Monthly');

  return (
    <div className="wlp">
      <div className="pr-toggle wlp-toggle" role="tablist" aria-label="Billing period">
        {(['Monthly', 'Yearly'] as Tab[]).map((t) => (
          <button type="button" role="tab" aria-selected={t === tab} key={t} className={cx('seg', t === tab && 'seg-on')} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="wlp-grid" key={tab}>
        {cardsFor(tab).map((c, i) => (
          <div className={cx('wlp-pkg', i === 1 && 'wlp-pkg-main')} key={c.key} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="wlp-top">
              <span className="wlp-ico">
                <Icon name={c.icon} size={26} />
              </span>
              <span className="bill-chip">{tab}</span>
            </div>
            <div className="wlp-name">{c.title}</div>
            <div className="wlp-price">
              {eur(c.price)}
              {c.per && <span>/{c.per}</span>}
            </div>
            <div className="wlp-note">{c.note}</div>
            <ul className="wlp-list">
              {c.features.map(([t]) => (
                <li key={t}>
                  <Icon name="check_circle" size={22} color="#10B981" />
                  {t}
                </li>
              ))}
            </ul>
            <SmartLink href={ROUTES.contact} className={cx('hero-btn wlp-cta', i === 1 ? 'hero-btn-primary' : 'hero-btn-ghost')}>
              <span>Become a partner</span>
              <Icon name="arrow_forward" size={20} color={i === 1 ? '#fff' : '#1A56DB'} className="hero-btn-arrow" />
            </SmartLink>
          </div>
        ))}
      </div>
    </div>
  );
}
