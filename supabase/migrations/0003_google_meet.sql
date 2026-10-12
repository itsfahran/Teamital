-- Google Calendar / Meet connection. Safe to re-run.

-- OAuth refresh token for the connected Google account. Readable ONLY with the service-role key.
create table if not exists public.google_connection (
  id            int primary key default 1 check (id = 1),
  email         text,
  refresh_token text not null,
  scope         text,
  connected_at  timestamptz not null default now()
);
alter table public.google_connection enable row level security;   -- no policies = no anon/authenticated access
revoke all on table public.google_connection from anon, authenticated;

alter table public.meeting_bookings add column if not exists meet_link text;
alter table public.meeting_bookings add column if not exists google_event_id text;

-- Booking lookup by secret token now also returns the Meet link.
drop function if exists public.booking_by_token(uuid);
create function public.booking_by_token(p_token uuid)
returns table (id uuid, name text, email text, company text, topic text, start_at timestamptz, end_at timestamptz, status text, visitor_tz text, meet_link text)
language sql
stable
security definer
set search_path = public
as $$
  select b.id, b.name, b.email, b.company, b.topic, b.start_at, b.end_at, b.status, b.visitor_tz, b.meet_link
  from public.meeting_bookings b where b.cancel_token = p_token;
$$;
grant execute on function public.booking_by_token(uuid) to anon, authenticated;
