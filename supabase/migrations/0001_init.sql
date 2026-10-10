-- Teamital website schema: CMS, navigation, contact messages, pricing plans, admin users.
-- Run in the Supabase SQL editor (or `supabase db push`). Safe to re-run.

create extension if not exists pgcrypto;

-- ───────────────────────── Admin users ─────────────────────────
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.admin_users enable row level security;

drop policy if exists "admin_users: read own row" on public.admin_users;
create policy "admin_users: read own row" on public.admin_users
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin_users: admins manage" on public.admin_users;
create policy "admin_users: admins manage" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Helpers ─────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────── CMS pages ─────────────────────────
create table if not exists public.cms_pages (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title      text not null,
  h1         text,
  content    jsonb not null default '[]'::jsonb,
  status     text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists cms_pages_updated_at on public.cms_pages;
create trigger cms_pages_updated_at before update on public.cms_pages
  for each row execute function public.set_updated_at();

create table if not exists public.cms_seo (
  id               uuid primary key default gen_random_uuid(),
  page_id          uuid not null unique references public.cms_pages (id) on delete cascade,
  meta_title       text,
  meta_description text,
  updated_at       timestamptz not null default now()
);

drop trigger if exists cms_seo_updated_at on public.cms_seo;
create trigger cms_seo_updated_at before update on public.cms_seo
  for each row execute function public.set_updated_at();

create table if not exists public.cms_nav_items (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  href       text not null,
  location   text not null default 'header' check (location in ('header', 'footer')),
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Contact messages ─────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 200),
  email      text not null check (char_length(email) between 3 and 320),
  company    text check (company is null or char_length(company) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  source     text not null default 'web',
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ───────────────────────── Subscription plans ─────────────────────────
create table if not exists public.subscription_plans (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  price      numeric not null default 0,
  price_eur  numeric,
  billing    text not null default 'monthly',
  features   jsonb not null default '[]'::jsonb,
  max_users  int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Row level security ─────────────────────────
alter table public.cms_pages          enable row level security;
alter table public.cms_seo            enable row level security;
alter table public.cms_nav_items      enable row level security;
alter table public.contact_messages   enable row level security;
alter table public.subscription_plans enable row level security;

-- cms_pages: public reads published pages, admins do everything.
drop policy if exists "cms_pages: public read published" on public.cms_pages;
create policy "cms_pages: public read published" on public.cms_pages
  for select to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "cms_pages: admin write" on public.cms_pages;
create policy "cms_pages: admin write" on public.cms_pages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- cms_seo: visible only together with a published page.
drop policy if exists "cms_seo: public read published" on public.cms_seo;
create policy "cms_seo: public read published" on public.cms_seo
  for select to anon, authenticated using (
    public.is_admin()
    or exists (select 1 from public.cms_pages p where p.id = page_id and p.status = 'published')
  );

drop policy if exists "cms_seo: admin write" on public.cms_seo;
create policy "cms_seo: admin write" on public.cms_seo
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- cms_nav_items
drop policy if exists "cms_nav_items: public read" on public.cms_nav_items;
create policy "cms_nav_items: public read" on public.cms_nav_items
  for select to anon, authenticated using (true);

drop policy if exists "cms_nav_items: admin write" on public.cms_nav_items;
create policy "cms_nav_items: admin write" on public.cms_nav_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- subscription_plans
drop policy if exists "subscription_plans: public read active" on public.subscription_plans;
create policy "subscription_plans: public read active" on public.subscription_plans
  for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "subscription_plans: admin write" on public.subscription_plans;
create policy "subscription_plans: admin write" on public.subscription_plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contact_messages: anyone can submit, only admins can read/manage.
drop policy if exists "contact_messages: anyone can insert" on public.contact_messages;
create policy "contact_messages: anyone can insert" on public.contact_messages
  for insert to anon, authenticated
  with check (is_read = false and source in ('web', 'app'));

drop policy if exists "contact_messages: admin read" on public.contact_messages;
create policy "contact_messages: admin read" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "contact_messages: admin update" on public.contact_messages;
create policy "contact_messages: admin update" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_messages: admin delete" on public.contact_messages;
create policy "contact_messages: admin delete" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- Table privileges (RLS above is what actually restricts access).
grant usage on schema public to anon, authenticated;
grant select on public.cms_pages, public.cms_seo, public.cms_nav_items, public.subscription_plans to anon;
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on
  public.cms_pages, public.cms_seo, public.cms_nav_items, public.subscription_plans,
  public.contact_messages, public.admin_users
  to authenticated;
grant insert on public.contact_messages to authenticated;
