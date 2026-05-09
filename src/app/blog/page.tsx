import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

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
          {posts?.length ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
              >
                <h2 className="text-xl font-medium">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
              </Link>
            ))
          ) : (
            <article
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-xl font-medium">No blog posts yet</h2>
              <p className="mt-2 text-sm text-slate-300">
                Publish a post from admin dashboard to show it here.
              </p>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
