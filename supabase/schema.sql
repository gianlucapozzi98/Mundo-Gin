-- Schema Sistema Eventi Mundo Club
-- Esegui questo SQL nel SQL Editor di Supabase dopo aver creato il progetto.

create extension if not exists "pgcrypto";

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  event_date date not null,
  location text not null,
  created_at timestamptz not null default now()
);

create table if not exists promoters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  promoter_id uuid references promoters(id) on delete set null,
  first_name text not null,
  last_name text not null,
  qr_token text not null unique,
  present boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists registrations_event_id_idx on registrations(event_id);
create index if not exists registrations_promoter_id_idx on registrations(promoter_id);
create index if not exists registrations_qr_token_idx on registrations(qr_token);

-- Seed: Mundo Castel
insert into events (slug, name, event_date, location)
values (
  'mundo-castel',
  'Mundo Castel',
  '2026-09-20',
  'Piazza Castello, 1, Pagazzano (BG)'
)
on conflict (slug) do update set
  name = excluded.name,
  event_date = excluded.event_date,
  location = excluded.location;

-- Seed: PR (codici corti nei link: /pc, /rg)
insert into promoters (name, code)
values
  ('Pausa Caffè', 'pc'),
  ('Rubin', 'rg')
on conflict (code) do update set
  name = excluded.name;
