alter table public.tenants enable row level security;
alter table public.tenant_admins enable row level security;
alter table public.events enable row level security;
alter table public.posts enable row level security;
alter table public.plans enable row level security;
alter table public.learning_groups enable row level security;
alter table public.payment_methods enable row level security;
alter table public.applications enable row level security;
alter table public.application_photos enable row level security;

create or replace function public.is_tenant_admin(p_tenant uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.tenant_admins where tenant_id=p_tenant and user_id=auth.uid());
$$;

drop policy if exists "public read tenant" on public.tenants;
create policy "public read tenant" on public.tenants for select using (true);

drop policy if exists "admins update tenant" on public.tenants;
create policy "admins update tenant" on public.tenants for update using (public.is_tenant_admin(id));

drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select using (is_public=true);
drop policy if exists "admins manage events" on public.events;
create policy "admins manage events" on public.events for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts for select using (is_public=true and (expires_at is null or expires_at>now()));
drop policy if exists "admins manage posts" on public.posts;
create policy "admins manage posts" on public.posts for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public read plans" on public.plans;
create policy "public read plans" on public.plans for select using (is_active=true);
drop policy if exists "admins manage plans" on public.plans;
create policy "admins manage plans" on public.plans for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public read learning" on public.learning_groups;
create policy "public read learning" on public.learning_groups for select using (is_public=true);
drop policy if exists "admins manage learning" on public.learning_groups;
create policy "admins manage learning" on public.learning_groups for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public read payment methods" on public.payment_methods;
create policy "public read payment methods" on public.payment_methods for select using (is_active=true);
drop policy if exists "admins manage payment methods" on public.payment_methods;
create policy "admins manage payment methods" on public.payment_methods for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public create application" on public.applications;
create policy "public create application" on public.applications for insert with check (true);
drop policy if exists "admins manage applications" on public.applications;
create policy "admins manage applications" on public.applications for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

drop policy if exists "public create photo records" on public.application_photos;
create policy "public create photo records" on public.application_photos for insert with check (true);
drop policy if exists "admins read photos" on public.application_photos;
create policy "admins read photos" on public.application_photos for select using (public.is_tenant_admin(tenant_id));
drop policy if exists "admins manage photos" on public.application_photos;
create policy "admins manage photos" on public.application_photos for update using (public.is_tenant_admin(tenant_id));

drop policy if exists "public upload member photos" on storage.objects;
create policy "public upload member photos" on storage.objects for insert to anon with check (bucket_id='member-photos');
drop policy if exists "admins read member photos" on storage.objects;
create policy "admins read member photos" on storage.objects for select to authenticated using (
  bucket_id='member-photos' and exists (
    select 1 from public.tenant_admins ta
    where ta.user_id=auth.uid() and (storage.foldername(name))[1]=ta.tenant_id::text
  )
);

create or replace function public.public_application_status(
  p_tenant_slug text,
  p_application_code text,
  p_contact text
)
returns table (
  application_code text,
  status text,
  offer_type text,
  private_venue text,
  created_at timestamptz
)
language sql
security definer
set search_path=public
as $$
  select a.application_code,a.status,a.offer_type,
    case when a.status in ('venue_unlocked','checked_in','completed') then a.private_venue else null end,
    a.created_at
  from public.applications a
  join public.tenants t on t.id=a.tenant_id
  where t.slug=p_tenant_slug
    and lower(a.application_code)=lower(p_application_code)
    and lower(a.contact)=lower(p_contact)
  limit 1;
$$;
grant execute on function public.public_application_status(text,text,text) to anon,authenticated;
