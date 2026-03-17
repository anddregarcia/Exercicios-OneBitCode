create schema if not exists budget;

create table if not exists budget.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  phone text,
  whatsapp text,
  email text,
  street text,
  city text,
  state text,
  created_at timestamptz default now()
);

create table if not exists budget.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  default_price numeric not null default 0,
  created_at timestamptz default now()
);

create table if not exists budget.estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id uuid references budget.clients(id),
  estimate_number integer not null,
  problem_description text,
  problem_cause text,
  labor_cost numeric not null default 0,
  materials_cost numeric not null default 0,
  total_cost numeric not null default 0,
  payment_method text not null check (payment_method in ('pix','debit','boleto','credit')),
  installments integer,
  execution_date date,
  execution_time_hours numeric,
  status text not null default 'pending' check (status in ('approved','pending','canceled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, estimate_number)
);

create table if not exists budget.estimate_materials (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid references budget.estimates(id) on delete cascade,
  material_id uuid references budget.materials(id),
  name text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  total_price numeric not null default 0
);

create table if not exists budget.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  company_name text,
  cnpj text,
  address text,
  phone text,
  email text,
  instagram text,
  pix_key text,
  bank_details text,
  logo_url text,
  default_labor_cost numeric default 0
);

create table if not exists budget.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table budget.clients enable row level security;
alter table budget.materials enable row level security;
alter table budget.estimates enable row level security;
alter table budget.estimate_materials enable row level security;
alter table budget.settings enable row level security;
alter table budget.drafts enable row level security;

create policy if not exists "clients_owner" on budget.clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "materials_owner" on budget.materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "estimates_owner" on budget.estimates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "settings_owner" on budget.settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "drafts_owner" on budget.drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "estimate_materials_owner" on budget.estimate_materials for all
using (exists (select 1 from budget.estimates e where e.id = estimate_id and e.user_id = auth.uid()))
with check (exists (select 1 from budget.estimates e where e.id = estimate_id and e.user_id = auth.uid()));
