import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) {
    return { title: "Post Not Found - SmartCV AI" };
  }

  return {
    title: `${post.title} - SmartCV AI`,
    description: post.seo_description ?? "SmartCV AI blog post",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, content_markdown, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Published: {post.published_at ? new Date(post.published_at).toLocaleDateString() : "N/A"}
        </p>
        <pre className="mt-8 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          {post.content_markdown}
        </pre>
      </article>
    </main>
  );
}
