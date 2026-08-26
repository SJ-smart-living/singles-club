-- LivingHub v1.1.1 - REMOVE DIGEST DEPENDENCY COMPLETELY
-- Run this once in Supabase SQL Editor.
-- This replaces the management functions so they no longer call pgcrypto digest().

drop function if exists public.register_livinghub_profile(text,integer,text,text,text,text,text,text);
drop function if exists public.get_livinghub_profile(uuid,text);
drop function if exists public.update_livinghub_profile(uuid,text,text,integer,text,text,text,text);
drop function if exists public.delete_livinghub_profile(uuid,text);

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
  )
  values(
    trim(p_display_name),
    p_age,
    trim(p_city),
    nullif(trim(coalesce(p_interests,'')),''),
    nullif(trim(coalesce(p_intro,'')),''),
    nullif(trim(coalesce(p_photo_url,'')),''),
    'active'
  )
  returning * into v_profile;

  insert into public.profile_secrets(profile_id,manage_hash,photo_path)
  values(
    v_profile.id,
    p_manage_key,
    nullif(trim(coalesce(p_photo_path,'')),'')
  );

  return v_profile;
end;
$$;

grant execute on function public.register_livinghub_profile(
  text,integer,text,text,text,text,text,text
) to anon, authenticated;


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
    select 1
    from public.profile_secrets s
    where s.profile_id=p_profile_id
      and s.manage_hash=p_manage_key
  ) then
    raise exception 'Invalid management credentials';
  end if;

  select * into v_profile
  from public.profiles
  where id=p_profile_id;

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
    select 1
    from public.profile_secrets s
    where s.profile_id=p_profile_id
      and s.manage_hash=p_manage_key
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

grant execute on function public.update_livinghub_profile(
  uuid,text,text,integer,text,text,text,text
) to anon, authenticated;


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
    and s.manage_hash=p_manage_key;

  if not found then
    raise exception 'Invalid management credentials';
  end if;

  if v_photo_path is not null then
    insert into public.deleted_photo_queue(photo_path)
    values(v_photo_path);
  end if;

  delete from public.profiles
  where id=p_profile_id;

  return true;
end;
$$;

grant execute on function public.delete_livinghub_profile(uuid,text)
to anon, authenticated;

notify pgrst, 'reload schema';
