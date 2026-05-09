import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const [profilesCount, resumesCount, postsCount, usageCount] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("resumes").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("usage_logs").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-300">
          Platform metrics and content overview.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Users</p>
            <p className="mt-1 text-2xl font-semibold">{profilesCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Resumes</p>
            <p className="mt-1 text-2xl font-semibold">{resumesCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Blog Posts</p>
            <p className="mt-1 text-2xl font-semibold">{postsCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Usage Events</p>
            <p className="mt-1 text-2xl font-semibold">{usageCount.count ?? 0}</p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Recent Blog Posts</h2>
          <div className="mt-4 grid gap-3">
            {recentPosts?.map((post) => (
              <article key={post.id} className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                <p className="font-medium">{post.title}</p>
                <p className="mt-1 text-sm text-slate-300">
                  /blog/{post.slug} - {post.is_published ? "Published" : "Draft"}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
