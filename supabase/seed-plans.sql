-- Default monthly plans shown on /pricing. Safe to re-run: inserts missing plans and refreshes
-- the features of the three default plans.
insert into public.subscription_plans (name, price, price_eur, billing, features, max_users, is_active)
select v.name, v.price, v.price_eur, v.billing, v.features::jsonb, v.max_users, true
from (values
  ('Premium',  79.99, 79.99, 'monthly',
   '["Up to 50 Employees","24/7 Priority Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 50),
  ('Standard', 49.99, 49.99, 'monthly',
   '["Up to 30 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 30),
  ('Basic',    19.99, 19.99, 'monthly',
   '["Up to 10 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 10)
) as v(name, price, price_eur, billing, features, max_users)
where not exists (
  select 1 from public.subscription_plans p where p.name = v.name and p.billing = v.billing
);

update public.subscription_plans p
set features = v.features::jsonb, max_users = v.max_users
from (values
  ('Premium',  'monthly', '["Up to 50 Employees","24/7 Priority Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 50),
  ('Standard', 'monthly', '["Up to 30 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 30),
  ('Basic',    'monthly', '["Up to 10 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 10)
) as v(name, billing, features, max_users)
where p.name = v.name and p.billing = v.billing;
