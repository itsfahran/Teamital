-- OPTIONAL starter data. The plans below are placeholders so the Pricing page is not empty:
-- edit or replace them from Admin → Plans with your real packages.

insert into public.subscription_plans (name, price, price_eur, billing, features, max_users, is_active)
select * from (values
  ('Starter',  9,   9,   'monthly', '["Up to 10 users","GPS clock-in","Email support"]'::jsonb,                10,   true),
  ('Growth',   29,  29,  'monthly', '["Up to 50 users","GPS + face check","Leave & tasks","Priority support"]'::jsonb, 50, true),
  ('Business', 79,  79,  'monthly', '["Up to 200 users","All attendance checks","Reports & exports","Priority support"]'::jsonb, 200, true),
  ('Starter',  90,  90,  'annual',  '["Up to 10 users","GPS clock-in","Email support"]'::jsonb,                10,   true),
  ('Growth',   290, 290, 'annual',  '["Up to 50 users","GPS + face check","Leave & tasks","Priority support"]'::jsonb, 50, true),
  ('Custom',   0,   0,   'monthly', '["Unlimited users","Dedicated onboarding","Custom integrations"]'::jsonb,  null, true)
) as v(name, price, price_eur, billing, features, max_users, is_active)
where not exists (select 1 from public.subscription_plans);

-- Make an existing Supabase Auth user an admin (replace the email):
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
