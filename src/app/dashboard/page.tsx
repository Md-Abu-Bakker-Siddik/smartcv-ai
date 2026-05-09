export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
          SmartCV AI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-slate-300">
          Welcome. Core modules are ready for the next step: resume builder,
          ATS analyzer, cover letter generator, LinkedIn summary, and interview
          question generator.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Resume Builder",
            "ATS Score Analyzer",
            "Keyword Matcher",
            "Cover Letter Generator",
            "LinkedIn Summary Generator",
            "Interview Question Generator",
          ].map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-medium">{item}</h2>
              <p className="mt-2 text-sm text-slate-300">
                Module shell created. Implementation will be added in upcoming
                steps.
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
