-- LivingHub Join v1.1.1 Member + Admin Management
-- Run this ONCE in Supabase SQL Editor after the earlier profiles/member-photos setup.

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname='profiles_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_status_check
      check (status in ('active','paused'));
  end if;
end $$;

create table if not exists public.profile_secrets (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  manage_hash text not null,
  photo_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.deleted_photo_queue (
  id bigint generated always as identity primary key,
  photo_path text not null,
  requested_at timestamptz not null default now()
);

create table if not exists public.admin_emails (
  email text primary key
);

insert into public.admin_emails(email)
values ('hello.singlesclub@outlook.com')
on conflict (email) do nothing;

alter table public.profile_secrets enable row level security;
alter table public.deleted_photo_queue enable row level security;
alter table public.admin_emails enable row level security;

-- Public directory: only active profiles.
drop policy if exists "public read profiles" on public.profiles;
create policy "public read active profiles"
on public.profiles for select
to anon, authenticated
using (status='active');

-- Prevent direct public inserts; registration must go through secure RPC.
drop policy if exists "public insert profiles" on public.profiles;

create or replace function public.is_livinghub_admin()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1
    from public.admin_emails a
    where lower(a.email)=lower(coalesce(auth.jwt()->>'email',''))
  );
$$;

revoke all on function public.is_livinghub_admin() from public;
grant execute on function public.is_livinghub_admin() to authenticated;

-- Admin can see/update/delete all profiles.
drop policy if exists "admin read all profiles" on public.profiles;
create policy "admin read all profiles"
on public.profiles for select
to authenticated
using (public.is_livinghub_admin());

drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles"
on public.profiles for update
to authenticated
using (public.is_livinghub_admin())
with check (public.is_livinghub_admin());

-- Admin can inspect and clear deletion queue.
drop policy if exists "admin read deleted photo queue" on public.deleted_photo_queue;
create policy "admin read deleted photo queue"
on public.deleted_photo_queue for select
to authenticated
using (public.is_livinghub_admin());

drop policy if exists "admin delete deleted photo queue" on public.deleted_photo_queue;
create policy "admin delete deleted photo queue"
on public.deleted_photo_queue for delete
to authenticated
using (public.is_livinghub_admin());

-- Admin can delete Storage photos; public upload policy stays unchanged.
drop policy if exists "admin delete member photos" on storage.objects;
create policy "admin delete member photos"
on storage.objects for delete
to authenticated
using (
  bucket_id='member-photos'
  and public.is_livinghub_admin()
);

-- Secure public registration: creates profile + private manage secret atomically.
create or replace function public.register_livinghub_profile(
  p_display_name text,
  p_age integer,
  p_city text,
  p_interests text,
  p_intro text,
  p_photo_url text,
  p_photo_path text,
  p_manage_key text
)
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare
  v_profile public.profiles;
begin
  if p_age < 18 or p_age > 100 then
    raise exception 'Age must be between 18 and 100';
  end if;
  if length(trim(coalesce(p_display_name,'')))=0 then
    raise exception 'Display name is required';
  end if;
  if length(trim(coalesce(p_city,'')))=0 then
    raise exception 'City is required';
  end if;
  if length(coalesce(p_manage_key,'')) < 16 then
    raise exception 'Invalid manage key';
  end if;

  insert into public.profiles(
    display_name,age,city,interests,intro,photo_url,status
  ) values (
    trim(p_display_name),p_age,trim(p_city),
    nullif(trim(coalesce(p_interests,'')),''),
    nullif(trim(coalesce(p_intro,'')),''),
    nullif(trim(coalesce(p_photo_url,'')),''),
    'active'
  )
  returning * into v_profile;

  insert into public.profile_secrets(profile_id,manage_hash,photo_path)
  values (
    v_profile.id,
    encode(digest(p_manage_key,'sha256'),'hex'),
    nullif(trim(coalesce(p_photo_path,'')),'')
  );

  return v_profile;
end;
$$;

grant execute on function public.register_livinghub_profile(text,integer,text,text,text,text,text,text)
to anon, authenticated;

create or replace function public.get_livinghub_profile(
  p_profile_id uuid,
  p_manage_key text
)
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare
  v_profile public.profiles;
begin
  if not exists(
    select 1 from public.profile_secrets s
    where s.profile_id=p_profile_id
      and s.manage_hash=encode(digest(p_manage_key,'sha256'),'hex')
  ) then
    raise exception 'Invalid management credentials';
  end if;

  select * into v_profile from public.profiles where id=p_profile_id;
  return v_profile;
end;
$$;

grant execute on function public.get_livinghub_profile(uuid,text)
to anon, authenticated;

create or replace function public.update_livinghub_profile(
  p_profile_id uuid,
  p_manage_key text,
  p_display_name text,
  p_age integer,
  p_city text,
  p_interests text,
  p_intro text,
  p_status text
)
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare
  v_profile public.profiles;
begin
  if not exists(
    select 1 from public.profile_secrets s
    where s.profile_id=p_profile_id
      and s.manage_hash=encode(digest(p_manage_key,'sha256'),'hex')
  ) then
    raise exception 'Invalid management credentials';
  end if;

  if p_status not in ('active','paused') then
    raise exception 'Invalid status';
  end if;

  update public.profiles
  set display_name=trim(p_display_name),
      age=p_age,
      city=trim(p_city),
      interests=nullif(trim(coalesce(p_interests,'')),''),
      intro=nullif(trim(coalesce(p_intro,'')),''),
      status=p_status,
      updated_at=now()
  where id=p_profile_id
  returning * into v_profile;

  return v_profile;
end;
$$;

grant execute on function public.update_livinghub_profile(uuid,text,text,integer,text,text,text,text)
to anon, authenticated;

-- Self-delete: profile disappears immediately; photo path is queued for admin cleanup.
create or replace function public.delete_livinghub_profile(
  p_profile_id uuid,
  p_manage_key text
)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  v_photo_path text;
begin
  select s.photo_path into v_photo_path
  from public.profile_secrets s
  where s.profile_id=p_profile_id
    and s.manage_hash=encode(digest(p_manage_key,'sha256'),'hex');

  if not found then
    raise exception 'Invalid management credentials';
  end if;

  if v_photo_path is not null then
    insert into public.deleted_photo_queue(photo_path) values (v_photo_path);
  end if;

  delete from public.profiles where id=p_profile_id;
  return true;
end;
$$;

grant execute on function public.delete_livinghub_profile(uuid,text)
to anon, authenticated;

-- Admin delete: same queue behavior, but requires authenticated admin.
create or replace function public.admin_delete_livinghub_profile(
  p_profile_id uuid
)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  v_photo_path text;
begin
  if not public.is_livinghub_admin() then
    raise exception 'Unauthorized';
  end if;

  select photo_path into v_photo_path
  from public.profile_secrets
  where profile_id=p_profile_id;

  if v_photo_path is not null then
    insert into public.deleted_photo_queue(photo_path) values (v_photo_path);
  end if;

  delete from public.profiles where id=p_profile_id;
  return true;
end;
$$;

grant execute on function public.admin_delete_livinghub_profile(uuid)
to authenticated;
