-- Singles Club PWA v1.0.0
create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  page_title text,
  site_url text,
  city text,
  contact_email text,
  business_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_admins (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  primary key (tenant_id,user_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title_zh text,
  title_en text not null,
  description_zh text,
  description_en text,
  start_at timestamptz not null,
  application_deadline timestamptz,
  city text not null,
  region text,
  country text default 'US',
  venue_public text,
  private_venue text,
  capacity int default 0,
  confirmed_count int default 0,
  price numeric(10,2) default 0,
  currency text default 'USD',
  image_url text,
  is_public boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  post_type text not null default 'platform' check (post_type in ('platform','activity','member')),
  content_zh text,
  content_en text not null,
  is_public boolean default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  summary_zh text,
  summary_en text,
  features_zh text,
  features_en text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_groups (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title_zh text,
  title_en text not null,
  description_zh text,
  description_en text,
  city text,
  sort_order int default 0,
  is_public boolean default true
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  method_name text not null,
  method_type text not null check (method_type in ('stripe','zelle','qr','cash','bank','other')),
  payment_url text,
  qr_image_url text,
  instructions_zh text,
  instructions_en text,
  offer_type text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  application_code text unique not null,
  display_name text not null,
  age int not null check (age >= 18),
  city text not null,
  contact text not null,
  relationship_goal text,
  intro text,
  offer_type text not null check (offer_type in ('event','plan')),
  event_id uuid references public.events(id) on delete set null,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'submitted',
  private_venue text,
  payment_reference text,
  consent_at timestamptz not null,
  source_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.application_photos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  storage_path text not null,
  sort_order int default 0,
  approved boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_tenant on public.events(tenant_id,start_at);
create index if not exists idx_posts_tenant on public.posts(tenant_id,created_at desc);
create index if not exists idx_apps_tenant on public.applications(tenant_id,created_at desc);
create index if not exists idx_apps_code_contact on public.applications(application_code,contact);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('member-photos','member-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
