import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canUseFeature } from "@/lib/usage";

async function saveCoverLetter(formData: FormData) {
  "use server";

  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const highlights = String(formData.get("highlights") ?? "").trim();

  if (!jobTitle || !companyName || !fullName || !highlights) {
    redirect("/dashboard/cover-letter?error=missing_fields");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const usage = await canUseFeature(user.id, "cover_letter_generate");
  if (!usage.allowed) {
    redirect("/dashboard/cover-letter?error=limit_reached");
  }

  const body = `Dear Hiring Manager,\n\nI am excited to apply for the ${jobTitle} role at ${companyName}. My background includes ${highlights}. I believe I can deliver immediate value through strong execution, collaboration, and measurable business impact.\n\nI would welcome the opportunity to discuss how my experience aligns with your team goals.\n\nSincerely,\n${fullName}`;

  await supabase.from("cover_letters").insert({
    user_id: user.id,
    job_title: jobTitle,
    company_name: companyName,
    tone: "professional",
    body,
  });

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "cover_letter_generate",
    action_group: "generator",
    metadata: { companyName, jobTitle },
  });

  revalidatePath("/dashboard/cover-letter");
  redirect("/dashboard/cover-letter?success=created");
}

export default async function CoverLetterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: letters } = await supabase
    .from("cover_letters")
    .select("id, company_name, job_title, body, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Cover Letter Generator</h1>
          <Link href="/dashboard" className="text-sm text-cyan-300 hover:text-cyan-200">
            Back to Dashboard
          </Link>
        </div>

        <form action={saveCoverLetter} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <input name="jobTitle" required placeholder="Job title" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input name="companyName" required placeholder="Company name" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input name="fullName" required placeholder="Your full name" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2" />
          <textarea name="highlights" required rows={4} placeholder="Key experience highlights" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2" />
          <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
            Generate & Save
          </button>
        </form>

        <section className="mt-8 grid gap-3">
          {letters?.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium">{item.job_title} - {item.company_name}</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
