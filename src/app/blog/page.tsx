const demoPosts = [
  {
    title: "How to Improve ATS Score in 15 Minutes",
    excerpt:
      "A practical checklist to improve resume readability, keyword coverage, and structure.",
  },
  {
    title: "Resume Mistakes That Get Ignored by Recruiters",
    excerpt:
      "Avoid common formatting and content issues that reduce interview callbacks.",
  },
  {
    title: "Write Better Project Bullets for Developer Roles",
    excerpt:
      "Turn generic responsibilities into measurable achievements with impact.",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
          SmartCV AI Blog
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Career Insights</h1>
        <p className="mt-3 text-slate-300">
          SEO-ready blog area for resume, interview, and job-search content.
        </p>

        <section className="mt-8 grid gap-4">
          {demoPosts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-xl font-medium">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
