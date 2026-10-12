'use client';

import { useMemo, useState } from 'react';
import type { SubscriptionPlan } from '@/lib/cms';
import { ROUTES } from '@/lib/config';
import {
  amountForPlan,
  WEB_BILLING_TABS,
  billingTabFor,
  featureLines,
  isCustomPlan,
  isFiveYearBilling,
  matchesBilling,
  normalizeBillingTab,
  priceLabel,
} from '@/lib/plans';
import { Aos } from '../Aos';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';

function BillingChip({ billing }: { billing?: string }) {
  const tab = billingTabFor(billing);
  const cls = tab === '1 Year' ? 'chip-year' : tab === '5 Years' ? 'chip-5y' : 'chip-month';
  return <span className={cx('bill-chip', cls)}>{tab}</span>;
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const features = featureLines(plan);
  const name = String(plan.name ?? 'Plan');
  const lower = name.toLowerCase();
  const popular = lower.includes('pro') || lower.includes('growth');
  const custom = isCustomPlan(plan);
  return (
    <div className={cx('plan', popular && 'plan-popular')}>
      <div className="plan-top">
        <div className="plan-name">{name}</div>
        <BillingChip billing={plan.billing as string | undefined} />
      </div>
      {popular && <div className="plan-pop">Popular</div>}
      <div className="plan-price">{priceLabel(plan)}</div>
      <div className="plan-feats">
        {features.map((f, i) => (
          <div className="plan-feat" key={i}>
            <Icon name="check_circle" size={20} color="#10B981" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <SmartLink href={custom ? ROUTES.contact : ROUTES.signUp} className="plan-btn">
        {custom ? 'Contact sales' : 'Choose plan'}
      </SmartLink>
    </div>
  );
}

export function PricingView({ plans }: { plans: SubscriptionPlan[] }) {
  const [tab, setTab] = useState<string>('Monthly');
  const publicPlans = useMemo(() => plans.filter((p) => !isFiveYearBilling(p.billing as string)), [plans]);
  const filtered = useMemo(
    () => publicPlans.filter((p) => matchesBilling(p.billing as string, tab)),
    [publicPlans, tab],
  );
  const rank = (pl: SubscriptionPlan) => (isCustomPlan(pl) ? -1 : amountForPlan(pl));
  const shown = [...(filtered.length > 0 ? filtered : publicPlans)].sort((a, b) => rank(b) - rank(a));
  const selected = normalizeBillingTab(tab);

  return (
    <SitePage stickyHeader compactBelow={900}>
      <div className="pr">
        <div className="pr-in">
          <Aos>
            <div className="pr-head">
              <h1 className="pr-title">Pricing</h1>
              <p className="pr-sub">Same subscription plans as the mobile app — pick Monthly or Yearly.</p>
              <div className="pr-toggle">
                {WEB_BILLING_TABS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={cx('seg', t === selected && 'seg-on')}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Aos>
          <div className="gap-36" />
          {shown.length === 0 ? (
            <Aos>
              <p className="pr-empty">No plans available right now.</p>
            </Aos>
          ) : (
            <div className="plans-wrap">
              <div className="plans">
                {shown.map((p, i) => (
                  <Aos key={String(p.id ?? i)} delay={80 * i}>
                    <PlanCard plan={p} />
                  </Aos>
                ))}
              </div>
            </div>
          )}
          <div className="gap-48" />
          <Aos>
            <div className="pr-cta">
              <div className="pr-cta-t">Ready to activate a plan?</div>
              <div className="pr-cta-s">Sign up, then choose your plan from the company subscription screen.</div>
              <SmartLink href={ROUTES.signUp} className="btn-filled pr-cta-btn">
                Get started
              </SmartLink>
            </div>
          </Aos>
        </div>
      </div>
    </SitePage>
  );
}
