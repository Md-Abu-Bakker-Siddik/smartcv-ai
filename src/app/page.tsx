import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <header className="mb-14 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">
              SmartCV AI
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              Build job-winning resumes in minutes
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-cyan-500/50 bg-cyan-500/15 px-5 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-500/25 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:bg-cyan-300/20"
            >
              Open Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <h2 className="text-lg font-semibold">Resume Builder</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Personal info, summary, skills, experience, projects and
              certifications in one guided flow.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <h2 className="text-lg font-semibold">ATS Score + Keywords</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Rule-based ATS analyzer with keyword matching from job
              descriptions and actionable suggestions.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <h2 className="text-lg font-semibold">Career Content Tools</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Generate cover letters, LinkedIn summaries and interview questions
              with reliable templates.
            </p>
          </article>
        </section>

        <section className="mt-12 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/15 p-8 dark:border-cyan-400/20 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-indigo-500/10">
          <h2 className="text-xl font-semibold md:text-2xl">
            Free-tier ready SaaS architecture
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            Built with Next.js 15, Supabase Auth + RLS, TypeScript, Tailwind,
            shadcn/ui, and Vercel deployment workflow. Perfect for a
            portfolio-grade demo project.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">
              Next.js 15
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">
              Supabase
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">
              PostgreSQL + RLS
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">
              Vercel Deploy
            </span>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            href="/dashboard"
          >
            Go to App
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
            href="/blog"
          >
            Read Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
