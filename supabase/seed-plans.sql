-- Default monthly plans shown on /pricing (safe to re-run: skips plans that already exist).
insert into public.subscription_plans (name, price, price_eur, billing, features, max_users, is_active)
select v.name, v.price, v.price_eur, v.billing, v.features::jsonb, v.max_users, true
from (values
  ('Premium',  79.99, 79.99, 'monthly',
   '["Up to 50 Employees","24/7 Priority Support","Clock in & Out- facial-biometric-PIN","Leave requests- holiday management"]', 50),
  ('Standard', 49.99, 49.99, 'monthly',
   '["Up to 30 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN","Leave requests- holiday management"]', 30),
  ('Basic',    19.99, 19.99, 'monthly',
   '["Up to 10 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN","Leave requests- holiday management"]', 10)
) as v(name, price, price_eur, billing, features, max_users)
where not exists (
  select 1 from public.subscription_plans p where p.name = v.name and p.billing = v.billing
);
