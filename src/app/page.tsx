import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <header className="mb-14 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              SmartCV AI
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              Build job-winning resumes in minutes
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/sign-in"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/20"
            >
              Open Dashboard
            </a>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Resume Builder</h2>
            <p className="mt-2 text-sm text-slate-300">
              Personal info, summary, skills, experience, projects and
              certifications in one guided flow.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">ATS Score + Keywords</h2>
            <p className="mt-2 text-sm text-slate-300">
              Rule-based ATS analyzer with keyword matching from job
              descriptions and actionable suggestions.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Career Content Tools</h2>
            <p className="mt-2 text-sm text-slate-300">
              Generate cover letters, LinkedIn summaries and interview questions
              with reliable templates.
            </p>
          </article>
        </section>

        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-8">
          <h2 className="text-xl font-semibold md:text-2xl">
            Free-tier ready SaaS architecture
          </h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Built with Next.js 15, Supabase Auth + RLS, TypeScript, Tailwind,
            shadcn/ui, and Vercel deployment workflow. Perfect for a
            portfolio-grade demo project.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/20 px-3 py-1">
              Next.js 15
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1">
              Supabase
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1">
              PostgreSQL + RLS
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1">
              Vercel Deploy
            </span>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            href="/dashboard"
          >
            Go to App
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            href="/blog"
          >
            Read Blog
          </a>
        </div>
      </main>
    </div>
  );
}
