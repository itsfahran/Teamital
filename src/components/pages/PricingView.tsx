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
import type { PricingPageContent } from '@/content/pages';
import { plainText } from '@/lib/content/utils';
import { RichText } from '../RichText';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';

function BillingChip({ billing }: { billing?: string }) {
  const tab = billingTabFor(billing);
  const cls = tab === '1 Year' ? 'chip-year' : tab === '5 Years' ? 'chip-5y' : 'chip-month';
  return <span className={cx('bill-chip', cls)}>{tab}</span>;
}

/** Yearly saving versus paying monthly for 12 months (matched by plan name). */
function yearlySaving(plan: SubscriptionPlan, all: SubscriptionPlan[]) {
  if (billingTabFor(plan.billing as string) !== '1 Year') return null;
  const name = String(plan.name ?? '').trim().toLowerCase();
  const monthly = all.find(
    (p) => String(p.name ?? '').trim().toLowerCase() === name && billingTabFor(p.billing as string) === 'Monthly',
  );
  if (!monthly) return null;
  const full = amountForPlan(monthly) * 12;
  const paid = amountForPlan(plan);
  if (!(full > 0) || !(paid > 0) || paid >= full) return null;
  const save = full - paid;
  return { save: save.toFixed(2), percent: ((save / full) * 100).toFixed(2), full: full.toFixed(2) };
}

function PlanCard({ plan, all, buttonLabel, contactLabel, popularLabel }: { plan: SubscriptionPlan; all: SubscriptionPlan[]; buttonLabel: string; contactLabel: string; popularLabel: string }) {
  const saving = yearlySaving(plan, all);
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
      {popular && <div className="plan-pop">{popularLabel}</div>}
      <div className="plan-price">{priceLabel(plan)}</div>
      {saving && (
        <div className="plan-save">
          <span className="plan-off">{saving.percent}% OFF</span>
          <span className="plan-save-t">Save €{saving.save} per year</span>
        </div>
      )}
      <div className="plan-feats">
        {features.map((f, i) => (
          <div className="plan-feat" key={i}>
            <Icon name="check_circle" size={20} color="#10B981" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <SmartLink href={custom ? ROUTES.contact : ROUTES.signUp} className="plan-btn">
        {custom ? contactLabel : buttonLabel}
      </SmartLink>
    </div>
  );
}

export function PricingView({ plans, c }: { plans: SubscriptionPlan[]; c: PricingPageContent }) {
  const [tab, setTab] = useState<string>('Monthly');
  const publicPlans = useMemo(() => plans.filter((p) => !isFiveYearBilling(p.billing as string)), [plans]);
  const filtered = useMemo(
    () => publicPlans.filter((p) => matchesBilling(p.billing as string, tab)),
    [publicPlans, tab],
  );
  const rank = (pl: SubscriptionPlan) => (isCustomPlan(pl) ? Number.MAX_SAFE_INTEGER : amountForPlan(pl));
  const shown = [...(filtered.length > 0 ? filtered : publicPlans)].sort((a, b) => rank(a) - rank(b));
  const selected = normalizeBillingTab(tab);

  return (
    <SitePage stickyHeader compactBelow={900}>
      <div className="pr">
        <div className="pr-in">
          <Aos>
            <div className="pr-head">
              <h1 className="pr-title">{c.title}</h1>
              <RichText className="pr-sub" value={c.subtitle} />
              <div className="pr-toggle">
                {WEB_BILLING_TABS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={cx('seg', t === selected && 'seg-on')}
                    onClick={() => setTab(t)}
                  >
                    {t === 'Monthly' ? c.monthlyTab : t === '1 Year' ? c.yearlyTab : t}
                  </button>
                ))}
              </div>
            </div>
          </Aos>
          <div className="gap-36" />
          {shown.length === 0 ? (
            <Aos>
              <p className="pr-empty">{c.emptyText}</p>
            </Aos>
          ) : (
            <div className="plans-wrap">
              <div className="plans">
                {shown.map((p, i) => (
                  <Aos key={String(p.id ?? i)} delay={80 * i}>
                    <PlanCard plan={p} all={plans} buttonLabel={c.planButton} contactLabel={c.contactSalesButton} popularLabel={c.popularLabel} />
                  </Aos>
                ))}
              </div>
            </div>
          )}
          <div className="gap-48" />
          <Aos>
            <div className="pr-cta">
              <div className="pr-cta-t">{c.ctaTitle}</div>
              <div className="pr-cta-s">{plainText(c.ctaText)}</div>
              <SmartLink href={ROUTES.signUp} className="btn-filled pr-cta-btn">
                {c.ctaButton}
              </SmartLink>
            </div>
          </Aos>
        </div>
      </div>
    </SitePage>
  );
}
