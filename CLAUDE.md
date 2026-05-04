# Meal Tracker — Project Context

Personal meal tracking web app. User: jcluc1 (GitHub).

## Stack (all recent — check bundled docs before coding!)

- **Next.js 16.2.4** (App Router) — docs in `node_modules/next/dist/docs/01-app/`
- **React 19.2.4** — server components by default; `"use client"` for interactive
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in `globals.css` (no `tailwind.config.js` needed); configure via `@theme` in CSS
- **TypeScript 5**, strict
- **Supabase** via `@supabase/ssr` v0.10.2 and `@supabase/supabase-js` v2.105.1

**Breaking-change alert:** Some Next.js APIs moved. Before writing route handlers, server actions, `cookies()`, or middleware, read the matching file under `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/`.

## Architecture

```
src/
  app/
    layout.tsx              — root layout with global styles
    page.tsx                — home: today's meals + quick-add form
    history/page.tsx        — full meal history list
    stats/page.tsx          — totals per day/week, calorie chart
    globals.css             — Tailwind + theme
  lib/
    supabase/
      client.ts             — browser client (createBrowserClient)
      server.ts             — server client (createServerClient w/ cookies)
    types.ts                — Meal type matching the DB schema
  components/
    MealForm.tsx            — add/edit meal (client)
    MealList.tsx            — list of meals grouped by day (server)
    MealCard.tsx            — single meal display
    DeleteButton.tsx        — client component, calls server action
    Nav.tsx                 — top nav: Today / History / Stats
supabase/
  schema.sql                — CREATE TABLE meals + RLS policies
```

## Data Model

```sql
CREATE TABLE meals (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eaten_at   timestamptz NOT NULL DEFAULT now(),
  name       text NOT NULL,
  meal_type  text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  calories   int,
  protein_g  numeric(5,1),
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Single-user app → **no auth**. RLS: allow all using anon key (simple; document tradeoff in README).

## Env Vars (both needed)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Reference them via `process.env.NEXT_PUBLIC_SUPABASE_URL!` in supabase client factories.

## Conventions

- **Server Components by default.** Add `"use client"` ONLY for interactive bits (forms, buttons with onClick).
- **Mutations go through Server Actions** (`"use server"`), not route handlers.
- **Dates:** store as `timestamptz`, render with `Intl.DateTimeFormat` in the user's locale.
- **Tailwind v4:** use `@theme` block in `globals.css` for custom tokens. NO `tailwind.config.js`.
- **Style:** clean, minimal, mobile-first. Dark mode via `prefers-color-scheme`. Use neutral slate/stone palette with one accent (emerald).
- **No toast libraries, no state managers, no ORMs.** Keep deps minimal.
- **Form validation:** native HTML (`required`, `type="number"`), plus server-side guards.
- **No auth, no login screens.** This is a single-user personal app.

## Error Handling

- Supabase errors: log server-side, show friendly message in UI via `error.tsx` boundaries.
- Always check `{ data, error }` from Supabase calls.

## Commands

- `npm run dev` — local dev on :3000
- `npm run build` — production build (MUST PASS before commit)
- `npm start` — run production server

Before finishing any task: run `npm run build` and fix all errors.
