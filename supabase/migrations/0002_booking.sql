-- "Book a free 1:1 call": availability settings + bookings. Safe to re-run.

-- ───────────────────────── Availability settings (single row) ─────────────────────────
create table if not exists public.booking_settings (
  id               int primary key default 1 check (id = 1),
  is_enabled       boolean not null default true,
  timezone         text    not null default 'Europe/Dublin',
  weekdays         int[]   not null default '{1,2,3,4,5}',      -- 0=Sun .. 6=Sat (in the business timezone)
  start_time       time    not null default '09:00',
  end_time         time    not null default '17:00',
  slot_minutes     int     not null default 30 check (slot_minutes between 10 and 240),
  buffer_minutes   int     not null default 0  check (buffer_minutes between 0 and 120),
  min_notice_hours int     not null default 12 check (min_notice_hours >= 0),
  max_days_ahead   int     not null default 45 check (max_days_ahead between 1 and 365),
  meeting_link     text,
  host_name        text    not null default 'Teamital Team',
  host_email       text,
  updated_at       timestamptz not null default now()
);
insert into public.booking_settings (id) values (1) on conflict (id) do nothing;

-- ───────────────────────── Bookings ─────────────────────────
create table if not exists public.meeting_bookings (
  id             uuid primary key default gen_random_uuid(),
  cancel_token   uuid not null default gen_random_uuid() unique,
  name           text not null check (char_length(name) between 1 and 200),
  email          text not null check (char_length(email) between 3 and 320),
  phone          text check (phone is null or char_length(phone) <= 40),
  company        text check (company is null or char_length(company) <= 200),
  team_size      text check (team_size is null or char_length(team_size) <= 40),
  topic          text check (topic is null or char_length(topic) <= 100),
  message        text check (message is null or char_length(message) <= 3000),
  start_at       timestamptz not null,
  end_at         timestamptz not null,
  visitor_tz     text,
  status         text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled', 'no_show')),
  admin_notes    text,
  source         text not null default 'web',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (end_at > start_at)
);

-- One active booking per start time (prevents double booking even under races).
create unique index if not exists meeting_bookings_active_slot
  on public.meeting_bookings (start_at) where status = 'confirmed';
create index if not exists meeting_bookings_start_idx on public.meeting_bookings (start_at desc);

drop trigger if exists meeting_bookings_updated_at on public.meeting_bookings;
create trigger meeting_bookings_updated_at before update on public.meeting_bookings
  for each row execute function public.set_updated_at();

drop trigger if exists booking_settings_updated_at on public.booking_settings;
create trigger booking_settings_updated_at before update on public.booking_settings
  for each row execute function public.set_updated_at();

-- ───────────────────────── Row level security ─────────────────────────
alter table public.booking_settings enable row level security;
alter table public.meeting_bookings enable row level security;

drop policy if exists "booking_settings: public read" on public.booking_settings;
create policy "booking_settings: public read" on public.booking_settings
  for select to anon, authenticated using (true);

drop policy if exists "booking_settings: admin write" on public.booking_settings;
create policy "booking_settings: admin write" on public.booking_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "meeting_bookings: anyone can create" on public.meeting_bookings;
create policy "meeting_bookings: anyone can create" on public.meeting_bookings
  for insert to anon, authenticated
  with check (status = 'confirmed' and source in ('web', 'app') and admin_notes is null);

drop policy if exists "meeting_bookings: admin read" on public.meeting_bookings;
create policy "meeting_bookings: admin read" on public.meeting_bookings
  for select to authenticated using (public.is_admin());

drop policy if exists "meeting_bookings: admin update" on public.meeting_bookings;
create policy "meeting_bookings: admin update" on public.meeting_bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "meeting_bookings: admin delete" on public.meeting_bookings;
create policy "meeting_bookings: admin delete" on public.meeting_bookings
  for delete to authenticated using (public.is_admin());

-- ───────────────────────── Safe public functions ─────────────────────────
-- Booked start times only (no personal data), so the public page can hide taken slots.
create or replace function public.booked_slots(p_from timestamptz, p_to timestamptz)
returns table (start_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select b.start_at from public.meeting_bookings b
  where b.status = 'confirmed' and b.start_at >= p_from and b.start_at < p_to;
$$;

-- Look up one booking by its secret token (used for the confirmation page, .ics and cancel link).
create or replace function public.booking_by_token(p_token uuid)
returns table (id uuid, name text, email text, company text, topic text, start_at timestamptz, end_at timestamptz, status text, visitor_tz text)
language sql
stable
security definer
set search_path = public
as $$
  select b.id, b.name, b.email, b.company, b.topic, b.start_at, b.end_at, b.status, b.visitor_tz
  from public.meeting_bookings b where b.cancel_token = p_token;
$$;

create or replace function public.cancel_booking(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  update public.meeting_bookings set status = 'cancelled'
  where cancel_token = p_token and status = 'confirmed' and start_at > now();
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

grant execute on function public.booked_slots(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.booking_by_token(uuid) to anon, authenticated;
grant execute on function public.cancel_booking(uuid) to anon, authenticated;

grant select on public.booking_settings to anon;
grant insert on public.meeting_bookings to anon;
grant select, insert, update, delete on public.booking_settings, public.meeting_bookings to authenticated;
