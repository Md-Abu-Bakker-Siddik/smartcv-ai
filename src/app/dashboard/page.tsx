import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { saveResumeAction } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { ResumePdfButton } from "@/components/dashboard/resume-pdf-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, ats_score, keyword_match_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              SmartCV AI
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/settings" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Settings
            </Link>
            <form action={signOutAction}>
              <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Resume Builder + ATS Score</h2>
          <p className="mt-2 text-sm text-slate-300">
            Save a resume draft and get instant rule-based ATS scoring.
          </p>

          <form action={saveResumeAction} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              name="title"
              required
              placeholder="Resume title (e.g. Frontend Engineer Resume)"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />
            <input
              name="fullName"
              required
              placeholder="Full name"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />
            <input
              name="experienceYears"
              type="number"
              min={0}
              max={40}
              required
              placeholder="Experience (years)"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />
            <input
              name="skills"
              required
              placeholder="Skills (comma separated)"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
            />
            <textarea
              name="summary"
              required
              placeholder="Professional summary"
              rows={4}
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
            />
            <textarea
              name="jobDescription"
              required
              placeholder="Paste target job description for keyword matching"
              rows={5}
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
            />
            <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
              Save Resume Draft
            </button>
          </form>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-3">
          <Link
            href="/dashboard/cover-letter"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
          >
            <p className="font-medium">Cover Letter Generator</p>
            <p className="mt-1 text-sm text-slate-300">Template-based generator</p>
          </Link>
          <Link
            href="/dashboard/linkedin-summary"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
          >
            <p className="font-medium">LinkedIn Summary Generator</p>
            <p className="mt-1 text-sm text-slate-300">Professional branding summary</p>
          </Link>
          <Link
            href="/dashboard/interview-questions"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
          >
            <p className="font-medium">Interview Questions</p>
            <p className="mt-1 text-sm text-slate-300">Role-based question bank</p>
          </Link>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Recent Resume Drafts</h3>
            <ResumePdfButton
              resumes={
                resumes?.map((resume) => ({
                  title: resume.title,
                  ats: resume.ats_score,
                  keyword: resume.keyword_match_score,
                })) ?? []
              }
            />
          </div>
          <div className="mt-4 grid gap-3">
            {resumes?.length ? (
              resumes.map((resume) => (
                <article
                  key={resume.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-medium">{resume.title}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    ATS Score: {resume.ats_score}/100 | Keyword Match:{" "}
                    {resume.keyword_match_score}/100
                  </p>
                </article>
              ))
            ) : (
              <article className="rounded-xl border border-dashed border-white/20 p-4 text-sm text-slate-300">
                No resume yet. Submit the form above to create your first draft.
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
