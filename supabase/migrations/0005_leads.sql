-- Lead forms: every submission from a CMS "Lead form" section is stored here (and emailed to the team). Safe to re-run.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null check (char_length(email) between 3 and 320),
  phone       text check (phone is null or char_length(phone) <= 60),
  company     text check (company is null or char_length(company) <= 200),
  message     text check (message is null or char_length(message) <= 5000),
  page_path   text,                      -- where the form was submitted (e.g. /landing-gps)
  form_name   text,                      -- label of the lead-form section
  status      text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  notes       text,
  email_sent  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Visitors can submit a lead (insert only); only admins can read or manage them.
drop policy if exists "leads: anyone can submit" on public.leads;
create policy "leads: anyone can submit" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null and email_sent = false);

drop policy if exists "leads: admin read" on public.leads;
create policy "leads: admin read" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads: admin update" on public.leads;
create policy "leads: admin update" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads: admin delete" on public.leads;
create policy "leads: admin delete" on public.leads
  for delete to authenticated using (public.is_admin());
