-- Seed baseline data for SmartCV AI.
-- Safe to run multiple times.

insert into public.subscriptions (user_id, plan, status)
select p.id, 'free', 'active'
from public.profiles p
where not exists (
  select 1 from public.subscriptions s where s.user_id = p.id
);

insert into public.blog_posts (
  author_id,
  title,
  slug,
  excerpt,
  content_markdown,
  tags,
  is_published,
  published_at,
  seo_title,
  seo_description
)
select
  p.id,
  'How to Build an ATS-Friendly Resume in 2026',
  'ats-friendly-resume-2026',
  'A practical guide to improving readability, keyword coverage, and recruiter impact.',
  E'# Build an ATS-Friendly Resume\n\nUse concise sections, measurable outcomes, and role-specific keywords.\n\n## Quick Checklist\n- Keep section titles standard\n- Add quantified impact\n- Align skills with job description\n',
  array['resume', 'ats', 'career'],
  true,
  timezone('utc', now()),
  'How to Build an ATS-Friendly Resume in 2026',
  'Learn practical steps to improve ATS score and recruiter impact.'
from public.profiles p
where p.role = 'admin'
  and not exists (
    select 1 from public.blog_posts b where b.slug = 'ats-friendly-resume-2026'
  )
limit 1;
