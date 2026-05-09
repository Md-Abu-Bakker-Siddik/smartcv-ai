# SmartCV AI

Portfolio-grade SaaS application for resume creation, ATS scoring, keyword matching, and career-content generation.

Built with free-tier friendly services and production-ready architecture patterns.

## Live Demo

- [SmartCV AI - Live App](https://smartcv-ai-beige.vercel.app/)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL, Auth, RLS)
- Vercel (deployment)
- jsPDF (resume PDF export)
- Zod + React Hook Form foundation

## Core Features

- Premium landing page
- Email/password authentication (sign up, sign in, reset flow)
- Protected dashboard
- Resume builder with ATS score + keyword match
- Cover letter generator (template based)
- LinkedIn summary generator (template based)
- Interview question generator (template based)
- Profile settings page
- Usage tracking for free plan limits
- Admin dashboard (role-based)
- SEO-ready blog listing + dynamic blog detail page
- Dark/light theme toggle
- Resume PDF export in clean professional layout

## Project Structure

```txt
src/
  app/
    (auth)/
    admin/
    api/
    blog/
    dashboard/
  components/
    dashboard/
    ui/
  lib/
    ats/
    constants/
    rate-limit/
    supabase/
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## Local Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Run development server
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`

## Database Setup (Supabase)

Run these SQL files in Supabase SQL Editor:

1. `supabase/migrations/0001_smartcv_ai_init.sql`
2. `supabase/seed/seed.sql`

This creates:

- `profiles`
- `resumes`
- `cover_letters`
- `linkedin_summaries`
- `interview_questions`
- `usage_logs`
- `subscriptions`
- `blog_posts`

and configures:

- Row Level Security (RLS) policies
- owner/admin access controls
- published blog public-read policy
- updated_at triggers

## Auth Configuration (Important)

In Supabase:

1. Go to `Authentication -> Sign In / Providers -> Email`
2. Enable Email provider
3. For testing, set `Confirm email` to OFF (optional but easier)
4. For production, keep confirm email ON and verify from inbox

If you hit `email rate limit exceeded`, wait a few minutes or adjust limits in `Authentication -> Rate Limits`.

## Quality Checks

Run before pushing:

```bash
npm run lint
npm run build
```

## Deployment (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Add all env vars in Vercel project settings
4. Deploy
5. Ensure Supabase Auth redirect URLs include your Vercel domain

## Demo Flow (For Recruiters / Hiring Managers)

1. Sign up / sign in
2. Open dashboard
3. Fill resume form and save
4. See ATS score and recent resume drafts
5. Export resume PDF
6. Generate cover letter / LinkedIn summary / interview questions
7. Open blog + dynamic blog post
8. (Admin role) open `/admin` for platform metrics

## Current Notes

- PDF exports the latest resume data in a professional two-column format
- Free-plan usage checks are enabled per day by action type
- Basic API rate limiting is implemented in memory

## Troubleshooting

- **Login fails after signup**: check email confirmation settings in Supabase Auth
- **Signup blocked**: likely auth rate limit; wait/reset rate limits
- **Blog empty**: publish posts in `blog_posts` table with `is_published = true`
- **Dashboard empty after save**: verify `resumes` insert success in Supabase table logs

## Scripts

- `npm run dev` - start dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - run production server
