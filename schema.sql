-- JobNearMe database schema for Supabase (PostgreSQL)
-- Run this in the Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Profiles ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  headline text,
  education_level text,
  field_of_study text,
  graduation_year int,
  experience_years numeric default 0,
  skills text[] default '{}',
  preferred_categories text[] default '{}',
  preferred_work_modes text[] default '{}',
  expected_salary numeric,
  resume_file_name text,
  resume_url text,
  city text,
  latitude double precision,
  longitude double precision,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- Jobs (public read) ----------------------------------------------------
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  company_logo text,
  location text not null,
  latitude double precision not null,
  longitude double precision not null,
  salary_min numeric,
  salary_max numeric,
  salary_period text check (salary_period in ('month', 'year')),
  experience text not null,
  education text not null,
  job_type text not null check (job_type in ('internship', 'full-time', 'part-time', 'contract')),
  work_mode text not null check (work_mode in ('remote', 'on-site', 'hybrid')),
  categories text[] not null default '{}',
  posted_date timestamptz default now(),
  deadline timestamptz not null,
  description text not null,
  responsibilities text[] default '{}',
  requirements text[] default '{}',
  skills text[] default '{}',
  apply_method text not null check (apply_method in ('one-click', 'external')),
  external_apply_url text
);

alter table jobs enable row level security;
create policy "Jobs are publicly readable"
  on jobs for select using (true);

-- Saved jobs ------------------------------------------------------------
create table if not exists saved_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade not null,
  saved_at timestamptz default now(),
  unique (user_id, job_id)
);

alter table saved_jobs enable row level security;
create policy "Users manage their own saved jobs"
  on saved_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Applications ------------------------------------------------------------
create table if not exists applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade not null,
  applied_date timestamptz default now(),
  status text not null default 'applied'
    check (status in ('applied','under_review','shortlisted','interview','rejected','offer')),
  method text not null check (method in ('one-click','external')),
  notes text,
  unique (user_id, job_id)
);

alter table applications enable row level security;
create policy "Users manage their own applications"
  on applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful index for distance-adjacent sorting/filtering by category
create index if not exists jobs_categories_idx on jobs using gin (categories);
create index if not exists jobs_deadline_idx on jobs (deadline);
