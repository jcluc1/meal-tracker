# Meal Tracker 🍽️

Personal meal tracking web app. Log what you eat, see daily totals, track calories and protein over time.

Built with **Next.js 16** + **React 19** + **Supabase** + **Tailwind v4**. Scaffolded by [Hermes Agent](https://hermes-agent.nousresearch.com) orchestrating Claude Code subagents.

## Features

- **Today** — quick-add form + today's meals grouped by breakfast/lunch/dinner/snack with daily totals
- **History** — full log, grouped by date, newest first
- **Stats** — totals, daily averages, and a 7-day calorie bar chart
- Dark mode via `prefers-color-scheme`, mobile-first responsive UI
- Magic-link auth via Supabase — no password, just email (see _Authentication_ below)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router), React 19 Server Components |
| Styling | Tailwind CSS v4 |
| DB | Supabase Postgres |
| Client | `@supabase/ssr` with server actions for mutations |
| Language | TypeScript strict |
| Hosting | Vercel (recommended) |

## Setup

### 1. Create a Supabase project

1. Go to <https://supabase.com> and sign up (free, no credit card)
2. Click **New Project**, pick a region close to you, set a DB password, wait ~1 min
3. Once ready, open **Project Settings → API** and copy:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create the `meals` table

Open **SQL Editor** in your Supabase dashboard, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.

### 3. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjcluc1%2Fmeal-tracker&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20URL%20and%20anon%20key%20%E2%80%94%20see%20README.md&envLink=https%3A%2F%2Fgithub.com%2Fjcluc1%2Fmeal-tracker%23setup)

Click the button → sign in with GitHub → paste the two Supabase env vars when prompted → deploy. Done.

### 4. (Optional) Run locally

```bash
cp .env.local.example .env.local
# edit .env.local and paste your real Supabase URL + anon key
npm install
npm run dev
```

Open <http://localhost:3000>.

## Project Structure

```
src/
├── app/
│   ├── actions.ts         Server actions (add/update/delete)
│   ├── error.tsx          Error boundary
│   ├── history/page.tsx   History view
│   ├── layout.tsx         Root layout + nav
│   ├── page.tsx           Today view
│   └── stats/page.tsx     Stats view
├── components/
│   ├── DeleteButton.tsx   Client — deletes with confirm
│   ├── MealCard.tsx       Server — single meal display
│   ├── MealForm.tsx       Client — add meal form
│   └── Nav.tsx            Client — top navigation
└── lib/
    ├── queries.ts         Server-side data fetchers
    ├── supabase/
    │   ├── client.ts      Browser client
    │   └── server.ts      Server client
    └── types.ts           Meal type + MealType union
supabase/
└── schema.sql             CREATE TABLE + RLS policies
```

## Authentication

This app uses **Supabase magic-link (OTP) auth**. On first visit you are redirected to `/login`, enter your email, and receive a one-click sign-in link. No password required.

### Magic-link flow

1. User submits email on `/login` → server action calls `supabase.auth.signInWithOtp()`.
2. Supabase emails a link to `<your-url>/auth/callback?code=…`.
3. The callback route calls `exchangeCodeForSession(code)` and sets a secure session cookie.
4. Middleware (`src/middleware.ts`) runs on every request, refreshes the session cookie via `getUser()`, and redirects unauthenticated visitors to `/login`.

### Supabase dashboard configuration

Before deploying, open your Supabase project and configure:

| Location | Setting | Value |
|---|---|---|
| Authentication → URL Configuration | Site URL | Your Vercel deployment URL (e.g. `https://meal-tracker-xyz.vercel.app`) |
| Authentication → URL Configuration | Redirect URLs | Add `https://meal-tracker-xyz.vercel.app/auth/callback` |
| Authentication → Providers → Email | Enable email provider | On (default) |
| Authentication → Providers → Email | Confirm email | Off — magic links don't need a separate confirm step |

For local dev, Supabase automatically allows `http://localhost:3000/auth/callback`.

## Security note

Auth is enabled. Row-level security policies enforce that each user can only read and write their own meals (`auth.uid() = user_id`). The anon key alone cannot access any meal data.

## License

MIT — hack away.
