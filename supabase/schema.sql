-- Meal Tracker schema — run this in Supabase SQL editor after creating your project.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.

create extension if not exists "pgcrypto";

-- 1. Create the meals table (fresh installs).
create table if not exists public.meals (
  id         uuid primary key default gen_random_uuid(),
  eaten_at   timestamptz not null default now(),
  name       text not null,
  meal_type  text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  calories   int,
  protein_g  numeric(5,1),
  notes      text,
  created_at timestamptz not null default now(),
  user_id    uuid references auth.users (id) on delete cascade
);

-- 2. Migration: if table pre-existed without user_id, add the column now.
alter table public.meals add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists meals_eaten_at_idx on public.meals (eaten_at desc);
create index if not exists meals_user_id_idx on public.meals (user_id);

-- 3. Enable RLS and replace any prior anon-all policy with per-user policies.
alter table public.meals enable row level security;

drop policy if exists "meals_anon_all"      on public.meals;
drop policy if exists "meals_select_own"    on public.meals;
drop policy if exists "meals_insert_own"    on public.meals;
drop policy if exists "meals_update_own"    on public.meals;
drop policy if exists "meals_delete_own"    on public.meals;

create policy "meals_select_own"
  on public.meals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "meals_insert_own"
  on public.meals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "meals_update_own"
  on public.meals for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "meals_delete_own"
  on public.meals for delete
  to authenticated
  using (auth.uid() = user_id);
