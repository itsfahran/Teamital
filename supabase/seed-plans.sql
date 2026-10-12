-- Default plans shown on /pricing (monthly + yearly). Safe to re-run: inserts missing plans and
-- refreshes price + features of these default plans.
-- Yearly price = 12 x monthly - saving: Basic 199 (save 40.88), Standard 499 (save 100.88), Premium 799 (save 160.88).
with defaults(name, billing, price, features, max_users) as (
  values
  ('Basic',    'monthly',  19.99, '["Up to 10 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 10),
  ('Standard', 'monthly',  49.99, '["Up to 30 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 30),
  ('Premium',  'monthly',  79.99, '["Up to 50 Employees","24/7 Priority Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 50),
  ('Basic',    'annual',  199.00, '["Up to 10 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 10),
  ('Standard', 'annual',  499.00, '["Up to 30 Employees","24/7 Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 30),
  ('Premium',  'annual',  799.00, '["Up to 50 Employees","24/7 Priority Support","Clock in & Out- facial-biometric-PIN -GPS Verified","Leave requests- holiday management","HR-Community & AI","IN-APP messaging- Company Broadcasts"]', 50)
),
upd as (
  update public.subscription_plans p
  set price = d.price, price_eur = d.price, features = d.features::jsonb, max_users = d.max_users
  from defaults d
  where p.name = d.name and p.billing = d.billing
  returning p.name, p.billing
)
insert into public.subscription_plans (name, price, price_eur, billing, features, max_users, is_active)
select d.name, d.price, d.price, d.billing, d.features::jsonb, d.max_users, true
from defaults d
where not exists (select 1 from public.subscription_plans p where p.name = d.name and p.billing = d.billing);
