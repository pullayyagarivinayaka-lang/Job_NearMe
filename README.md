# JobNearMe

A modern, responsive job-search platform for undergraduate students, freshers, interns,
graduates and experienced candidates. Build your profile once, discover jobs near your
location, and apply in one click.

**Stack:** Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Supabase/PostgreSQL

## Status of this build

This project runs end-to-end on realistic **mock data** and browser `localStorage` so you can
preview and demo every screen immediately, with zero setup. The Supabase schema
(`supabase/schema.sql`) and client (`lib/supabaseClient.ts`) are included and wired for you to
connect a real database — swap the mock-data reads/writes in `components/AppDataProvider.tsx`
for Supabase calls when you're ready to go live with real users.

**Honesty note on Apply:** one-click apply only ever "succeeds" for jobs marked
`applyMethod: "one-click"`, and does so by simulating a submission to your own saved profile —
wire this to a real ATS/email integration before launch. Jobs marked `"external"` always open
the employer's official portal in a new tab and are tracked as *"In progress (external)"*,
never falsely marked "Applied", until the user confirms completion.

## Getting started locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Connecting Supabase (optional, for real data)

1. Create a project at https://supabase.com.
2. In the SQL editor, run `supabase/schema.sql` to create tables, RLS policies, and indexes.
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Replace the mock reads in `components/AppDataProvider.tsx` and `lib/mockData.ts` with
   Supabase queries (`getSupabaseClient()` is already set up in `lib/supabaseClient.ts`).
5. Set up Supabase Storage for resume uploads (a `resumes` bucket with per-user folder policies
   mirrors the RLS pattern already used for `profiles`).

## Pushing this to your own GitHub repository

From this project folder:

```bash
git init
git add .
git commit -m "Initial commit: JobNearMe"
git branch -M main
git remote add origin https://github.com/<your-username>/jobnearme.git
git push -u origin main
```

(Create the empty repo first at https://github.com/new — don't initialize it with a README so
the push above doesn't conflict.)

## Deploying a live site (Vercel, free tier)

1. Push the repo to GitHub as above.
2. Go to https://vercel.com/new and import the repository.
3. If you connected Supabase, add the two environment variables from `.env.example` in the
   Vercel project settings.
4. Click Deploy. Vercel builds and gives you a live `https://your-project.vercel.app` URL in
   about a minute.

## Project structure

```
app/                 Next.js App Router pages (dashboard, jobs, profile, auth, settings, etc.)
components/          Reusable UI: JobCard, FilterSidebar, Navbar, ApplyModal, providers
lib/                 Mock data, matching algorithm, distance calculation, Supabase client
types/               Shared TypeScript types
supabase/schema.sql  PostgreSQL schema + Row Level Security policies for Supabase
```

## Features implemented

- GPS-based location detection with graceful fallback to manual city selection
- Distance-based, keyword, and multi-facet filtering (salary, education, experience, job type,
  work mode, category, company)
- 14 categories including internships, fresher, undergraduate, graduate, IT/software, data
  science, analytics, finance, marketing, design, customer support, and government jobs
- Job cards with title, company, location, live distance, salary, experience, education,
  posted date, deadline, match %, Save and Apply Now
- One-click apply for supported jobs; honest external-portal redirect otherwise
- Dashboard, Jobs, Job Details, Saved Jobs, Applications Tracker, Profile/Resume,
  Login/Register, and Settings pages
- Mobile-first, accessible (visible focus states, semantic roles, reduced-motion support),
  blue/white palette with full dark mode

---

Made with ❤️ by Pullayyagari Vinayaka
