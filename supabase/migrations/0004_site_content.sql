-- Site content CMS: one JSON document per built-in page (overrides the defaults shipped in code) + media storage.
-- Safe to re-run.

create table if not exists public.site_content (
  page_key   text primary key check (page_key ~ '^[a-z0-9][a-z0-9-]*$'),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "site_content: public read" on public.site_content;
create policy "site_content: public read" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "site_content: admin write" on public.site_content;
create policy "site_content: admin write" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Media bucket for images uploaded from the admin panel (public read, admin write).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-media', 'cms-media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = 10485760;

drop policy if exists "cms-media: public read" on storage.objects;
create policy "cms-media: public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'cms-media');

drop policy if exists "cms-media: admin insert" on storage.objects;
create policy "cms-media: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "cms-media: admin update" on storage.objects;
create policy "cms-media: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "cms-media: admin delete" on storage.objects;
create policy "cms-media: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'cms-media' and public.is_admin());
