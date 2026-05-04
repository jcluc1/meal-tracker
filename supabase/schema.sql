-- Meal Tracker schema — run this in Supabase SQL editor after creating your project.

create extension if not exists "pgcrypto";

create table if not exists public.meals (
  id         uuid primary key default gen_random_uuid(),
  eaten_at   timestamptz not null default now(),
  name       text not null,
  meal_type  text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  calories   int,
  protein_g  numeric(5,1),
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists meals_eaten_at_idx on public.meals (eaten_at desc);

-- Single-user personal app: allow anon full access.
-- For multi-user, replace these with auth.uid() policies.
alter table public.meals enable row level security;

drop policy if exists "meals_anon_all" on public.meals;
create policy "meals_anon_all"
  on public.meals
  for all
  to anon, authenticated
  using (true)
  with check (true);
