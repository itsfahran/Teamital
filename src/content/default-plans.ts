import type { SubscriptionPlan } from '@/lib/cms';

/** Shown on /pricing when the database has no plans yet (or Supabase is unreachable). */
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'default-basic',
    name: 'Basic',
    price: 19.99,
    price_eur: 19.99,
    billing: 'monthly',
    is_active: true,
    features: [
      'Up to 10 Employees',
      '24/7 Support',
      'Clock in & Out- facial-biometric-PIN -GPS Verified',
      'Leave requests- holiday management',
      'HR-Community & AI',
      'IN-APP messaging- Company Broadcasts',
    ],
  },
  {
    id: 'default-standard',
    name: 'Standard',
    price: 49.99,
    price_eur: 49.99,
    billing: 'monthly',
    is_active: true,
    features: [
      'Up to 30 Employees',
      '24/7 Support',
      'Clock in & Out- facial-biometric-PIN -GPS Verified',
      'Leave requests- holiday management',
      'HR-Community & AI',
      'IN-APP messaging- Company Broadcasts',
    ],
  },
  {
    id: 'default-premium',
    name: 'Premium',
    price: 79.99,
    price_eur: 79.99,
    billing: 'monthly',
    is_active: true,
    features: [
      'Up to 50 Employees',
      '24/7 Priority Support',
      'Clock in & Out- facial-biometric-PIN -GPS Verified',
      'Leave requests- holiday management',
      'HR-Community & AI',
      'IN-APP messaging- Company Broadcasts',
    ],
  },
];
