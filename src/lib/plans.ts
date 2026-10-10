import type { SubscriptionPlan } from './cms';

/** Port of SubscriptionPlanHelpers (display + billing filters). */
export type BillingTab = 'Monthly' | '1 Year' | '5 Years';
export const WEB_BILLING_TABS: BillingTab[] = ['Monthly', '1 Year'];

export function normalizeBillingTab(tab?: string | null): BillingTab {
  const t = (tab ?? '').trim().toLowerCase();
  if (['5 years', '5 year', '5years', '5year'].includes(t)) return '5 Years';
  if (['1 year', '1 years', 'yearly', 'annual', 'annually', 'year'].includes(t)) return '1 Year';
  return 'Monthly';
}

export function billingTabFor(billing?: string | null): BillingTab {
  const b = (billing ?? 'monthly').toLowerCase().replace(/[_\s-]/g, '');
  if (['5year', '5years', 'quinquennial'].includes(b)) return '5 Years';
  if (['annual', 'yearly', 'year', '1year', '1years'].includes(b)) return '1 Year';
  return 'Monthly';
}

export const isFiveYearBilling = (billing?: string | null) => normalizeBillingTab(billing) === '5 Years';
export const matchesBilling = (billing: string | null | undefined, tab: string) =>
  billingTabFor(billing) === normalizeBillingTab(tab);

export function amountForPlan(plan: SubscriptionPlan): number {
  const eur = Number(plan.price_eur);
  if (Number.isFinite(eur) && eur > 0) return eur;
  const p = Number(plan.price);
  return Number.isFinite(p) ? p : 0;
}

export function priceLabel(plan: SubscriptionPlan): string {
  const price = amountForPlan(plan);
  if (price === 0) return 'Custom';
  const tab = billingTabFor(plan.billing as string | undefined);
  const amount = price >= 100 || price === Math.round(price) ? String(Math.trunc(price)) : price.toFixed(2);
  if (tab === '1 Year') return `€${amount}/yr`;
  if (tab === '5 Years') return `€${amount}/5yr`;
  return `€${amount}/mo`;
}

export function isCustomPlan(plan: SubscriptionPlan): boolean {
  const name = String(plan.name ?? '').trim().toLowerCase();
  return amountForPlan(plan) <= 0 || name.includes('custom');
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export function featureLines(plan: SubscriptionPlan): string[] {
  const raw = plan.features;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((e) => (e == null ? '' : String(e).trim())).filter(Boolean);
  }
  const out: string[] = [];
  if (plan.max_users != null) out.push(`${plan.max_users} Users`);
  if (plan.storage_gb != null) out.push(`${plan.storage_gb}GB Storage`);
  out.push(`${cap(String(plan.support_tier ?? 'email'))} Support`);
  return out;
}
