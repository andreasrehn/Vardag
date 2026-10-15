-- Vardagen – database schema for Supabase.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
--
-- Data model
--   spaces          a shared place (Familjen or Hemmet) with its own member list
--   space_members   who belongs to which space; only members can read or write its data
--   invites         one-time codes that make a person a member of exactly one space
--   docs            every record in the app (events, receipts, lists, children …)
--                   scope = 'user'  → private to one person (Mitt); scope_id is their user id
--                   scope = 'space' → shared with the members of one space; scope_id is the space id

create extension if not exists pgcrypto;

create table if not exists public.spaces (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null default 'family' check (kind in ('family', 'home')),
  name        text,
  created_by  uuid not null default auth.uid() references auth.users on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.space_members (
  space_id   uuid not null references public.spaces on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (space_id, user_id)
);

create table if not exists public.invites (
  code        text primary key,
  space_id    uuid not null references public.spaces on delete cascade,
  created_by  uuid not null default auth.uid() references auth.users on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days',
  used_by     uuid references auth.users on delete set null,
  used_at     timestamptz
);

create table if not exists public.docs (
  scope       text not null check (scope in ('user', 'space')),
  scope_id    uuid not null,
  coll        text not null,
  id          text not null,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (scope, scope_id, coll, id)
);
create index if not exists docs_scope_coll on public.docs (scope, scope_id, coll);

-- ---------- helpers ----------
create or replace function public.is_member(s uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.space_members where space_id = s and user_id = auth.uid());
$$;

create or replace function public.can_access(sc text, sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select case
    when sc = 'user'  then sid = auth.uid()
    when sc = 'space' then public.is_member(sid)
    else false end;
$$;

-- ---------- row level security ----------
alter table public.spaces        enable row level security;
alter table public.space_members enable row level security;
alter table public.invites       enable row level security;
alter table public.docs          enable row level security;

drop policy if exists "members read their spaces" on public.spaces;
create policy "members read their spaces" on public.spaces
  for select using (public.is_member(id));

drop policy if exists "members see each other" on public.space_members;
create policy "members see each other" on public.space_members
  for select using (public.is_member(space_id));

drop policy if exists "leave a space" on public.space_members;
create policy "leave a space" on public.space_members
  for delete using (user_id = auth.uid());

drop policy if exists "members read invites" on public.invites;
create policy "members read invites" on public.invites
  for select using (public.is_member(space_id));

drop policy if exists "read own or shared docs" on public.docs;
create policy "read own or shared docs" on public.docs
  for select using (public.can_access(scope, scope_id));

drop policy if exists "insert own or shared docs" on public.docs;
create policy "insert own or shared docs" on public.docs
  for insert with check (public.can_access(scope, scope_id));

drop policy if exists "update own or shared docs" on public.docs;
create policy "update own or shared docs" on public.docs
  for update using (public.can_access(scope, scope_id)) with check (public.can_access(scope, scope_id));

drop policy if exists "delete own or shared docs" on public.docs;
create policy "delete own or shared docs" on public.docs
  for delete using (public.can_access(scope, scope_id));

-- ---------- functions the app calls ----------
-- Creates a space and makes the caller its first member.
create or replace function public.create_space(p_kind text default 'family', p_name text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into public.spaces (kind, name, created_by) values (coalesce(p_kind, 'family'), p_name, auth.uid()) returning id into sid;
  insert into public.space_members (space_id, user_id) values (sid, auth.uid());
  return sid;
end $$;

-- Makes a one-time invite code for a space the caller belongs to.
create or replace function public.create_invite(p_space uuid)
returns text language plpgsql security definer set search_path = public as $$
declare c text;
begin
  if not public.is_member(p_space) then raise exception 'not a member'; end if;
  loop
    c := upper(substr(translate(encode(gen_random_bytes(9), 'base64'), '/+=0OIl1', ''), 1, 8));
    exit when length(c) = 8 and not exists (select 1 from public.invites where code = c);
  end loop;
  insert into public.invites (code, space_id, created_by) values (c, p_space, auth.uid());
  return c;
end $$;

-- Uses an invite code: the caller becomes a member of that one space.
create or replace function public.join_space(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare inv public.invites;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into inv from public.invites where code = upper(trim(p_code)) for update;
  if inv.code is null then raise exception 'invite not found'; end if;
  if inv.used_by is not null and inv.used_by <> auth.uid() then raise exception 'invite already used'; end if;
  if inv.expires_at < now() then raise exception 'invite expired'; end if;
  insert into public.space_members (space_id, user_id) values (inv.space_id, auth.uid()) on conflict do nothing;
  update public.invites set used_by = auth.uid(), used_at = now() where code = inv.code;
  return inv.space_id;
end $$;

-- Lists the spaces the caller belongs to, with member count.
create or replace function public.my_spaces()
returns table (id uuid, kind text, name text, members int, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.id, s.kind, s.name, (select count(*)::int from public.space_members m2 where m2.space_id = s.id), s.created_at
  from public.spaces s join public.space_members m on m.space_id = s.id
  where m.user_id = auth.uid()
  order by s.created_at;
$$;

revoke all on function public.create_space(text, text) from public, anon;
revoke all on function public.create_invite(uuid)       from public, anon;
revoke all on function public.join_space(text)          from public, anon;
revoke all on function public.my_spaces()               from public, anon;
grant execute on function public.create_space(text, text) to authenticated;
grant execute on function public.create_invite(uuid)       to authenticated;
grant execute on function public.join_space(text)          to authenticated;
grant execute on function public.my_spaces()               to authenticated;

-- ---------- live updates ----------
alter table public.docs replica identity full;
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'docs') then
    execute 'alter publication supabase_realtime add table public.docs';
  end if;
end $$;
