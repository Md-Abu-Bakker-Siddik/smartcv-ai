import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canUseFeature } from "@/lib/usage";

async function saveLinkedinSummary(formData: FormData) {
  "use server";

  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const impact = String(formData.get("impact") ?? "").trim();

  if (!fullName || !role || !skills || !impact) {
    redirect("/dashboard/linkedin-summary?error=missing_fields");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const usage = await canUseFeature(user.id, "linkedin_summary_generate");
  if (!usage.allowed) {
    redirect("/dashboard/linkedin-summary?error=limit_reached");
  }

  const summary = `${fullName} is a ${role} focused on building high-impact digital products. Core strengths include ${skills}. Known for ${impact}, they combine technical excellence with business outcomes to deliver measurable results.`;

  await supabase.from("linkedin_summaries").insert({
    user_id: user.id,
    summary,
    tone: "professional",
  });

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "linkedin_summary_generate",
    action_group: "generator",
    metadata: { role },
  });

  revalidatePath("/dashboard/linkedin-summary");
  redirect("/dashboard/linkedin-summary?success=created");
}

export default async function LinkedinSummaryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: summaries } = await supabase
    .from("linkedin_summaries")
    .select("id, summary, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">LinkedIn Summary Generator</h1>
          <Link href="/dashboard" className="text-sm text-cyan-300 hover:text-cyan-200">
            Back to Dashboard
          </Link>
        </div>

        <form action={saveLinkedinSummary} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <input name="fullName" required placeholder="Full name" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input name="role" required placeholder="Target role" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input name="skills" required placeholder="Top skills (comma separated)" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2" />
          <textarea name="impact" required rows={4} placeholder="Biggest impact you've created" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2" />
          <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
            Generate & Save
          </button>
        </form>

        <section className="mt-8 grid gap-3">
          {summaries?.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="whitespace-pre-line text-sm text-slate-300">{item.summary}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
