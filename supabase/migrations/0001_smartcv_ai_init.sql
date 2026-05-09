-- SmartCV AI initial schema and security policies.
-- Run this in Supabase SQL editor or with Supabase CLI migrations.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  profession text,
  country text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  template_name text not null default 'modern-pro',
  personal_info jsonb not null default '{}'::jsonb,
  professional_summary text,
  skills jsonb not null default '[]'::jsonb,
  work_experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  ats_score integer not null default 0 check (ats_score >= 0 and ats_score <= 100),
  keyword_match_score integer not null default 0 check (keyword_match_score >= 0 and keyword_match_score <= 100),
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, slug)
);

create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  job_title text not null,
  company_name text not null,
  tone text not null default 'professional',
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.linkedin_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  summary text not null,
  tone text not null default 'professional',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  role_target text not null,
  seniority text not null default 'mid',
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.usage_logs (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  action_group text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'trialing')),
  current_period_start timestamptz not null default timezone('utc', now()),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  slug text not null unique,
  excerpt text,
  content_markdown text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_created_at on public.resumes(created_at desc);
create index if not exists idx_cover_letters_user_id on public.cover_letters(user_id);
create index if not exists idx_linkedin_summaries_user_id on public.linkedin_summaries(user_id);
create index if not exists idx_interview_questions_user_id on public.interview_questions(user_id);
create index if not exists idx_usage_logs_user_action_created on public.usage_logs(user_id, action, created_at desc);
create index if not exists idx_blog_posts_published on public.blog_posts(is_published, published_at desc);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_resumes_updated_at on public.resumes;
create trigger trg_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

drop trigger if exists trg_cover_letters_updated_at on public.cover_letters;
create trigger trg_cover_letters_updated_at
before update on public.cover_letters
for each row execute function public.set_updated_at();

drop trigger if exists trg_linkedin_summaries_updated_at on public.linkedin_summaries;
create trigger trg_linkedin_summaries_updated_at
before update on public.linkedin_summaries
for each row execute function public.set_updated_at();

drop trigger if exists trg_interview_questions_updated_at on public.interview_questions;
create trigger trg_interview_questions_updated_at
before update on public.interview_questions
for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.cover_letters enable row level security;
alter table public.linkedin_summaries enable row level security;
alter table public.interview_questions enable row level security;
alter table public.usage_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles: self insert" on public.profiles;
create policy "profiles: self insert"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "resumes: owner full access" on public.resumes;
create policy "resumes: owner full access"
on public.resumes
for all
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "cover_letters: owner full access" on public.cover_letters;
create policy "cover_letters: owner full access"
on public.cover_letters
for all
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "linkedin_summaries: owner full access" on public.linkedin_summaries;
create policy "linkedin_summaries: owner full access"
on public.linkedin_summaries
for all
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "interview_questions: owner full access" on public.interview_questions;
create policy "interview_questions: owner full access"
on public.interview_questions
for all
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "usage_logs: owner read" on public.usage_logs;
create policy "usage_logs: owner read"
on public.usage_logs
for select
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "usage_logs: owner insert" on public.usage_logs;
create policy "usage_logs: owner insert"
on public.usage_logs
for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "subscriptions: owner full access" on public.subscriptions;
create policy "subscriptions: owner full access"
on public.subscriptions
for all
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "blog_posts: public can read published" on public.blog_posts;
create policy "blog_posts: public can read published"
on public.blog_posts
for select
to anon, authenticated
using (is_published = true or public.is_admin(auth.uid()) or auth.uid() = author_id);

drop policy if exists "blog_posts: admin manage all" on public.blog_posts;
create policy "blog_posts: admin manage all"
on public.blog_posts
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
