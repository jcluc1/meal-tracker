# Meal Tracker 🍽️

Personal meal tracking web app. Log what you eat, see daily totals, track calories and protein over time.

Built with **Next.js 16** + **React 19** + **Supabase** + **Tailwind v4**. Scaffolded by [Hermes Agent](https://hermes-agent.nousresearch.com) orchestrating Claude Code subagents.

## Features

- **Today** — quick-add form + today's meals grouped by breakfast/lunch/dinner/snack with daily totals
- **History** — full log, grouped by date, newest first
- **Stats** — totals, daily averages, and a 7-day calorie bar chart
- Dark mode via `prefers-color-scheme`, mobile-first responsive UI
- No auth — single-user personal app (see _Security note_ below)

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

## Security note

This is a **single-user** app. Row-level security is enabled but policies allow the anon key to read/write all rows. That means **anyone with your deployed URL could view and modify your meals** if they inspect the client-side requests and learn the anon key.

For personal use on a URL you don't publicize, this is fine. If you want real multi-user protection:

1. Enable Supabase Auth (email magic links are one-click)
2. Add a `user_id uuid references auth.users` column to `meals`
3. Replace the `using (true)` policy with `using (auth.uid() = user_id)`
4. Add a `src/middleware.ts` using `@supabase/ssr` to refresh sessions
5. Add a login page

## License

MIT — hack away.
