import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canUseFeature } from "@/lib/usage";

async function saveInterviewQuestions(formData: FormData) {
  "use server";

  const role = String(formData.get("role") ?? "").trim();
  const seniority = String(formData.get("seniority") ?? "mid").trim();
  const skills = String(formData.get("skills") ?? "").trim();

  if (!role || !skills) {
    redirect("/dashboard/interview-questions?error=missing_fields");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const usage = await canUseFeature(user.id, "interview_questions_generate");
  if (!usage.allowed) {
    redirect("/dashboard/interview-questions?error=limit_reached");
  }

  const skillList = skills.split(",").map((item) => item.trim()).filter(Boolean);
  const questions = [
    `How would you approach a complex ${role} project end-to-end as a ${seniority} engineer?`,
    `Describe a time you used ${skillList[0] ?? "core technical skills"} to solve a production issue.`,
    `How do you prioritize trade-offs between speed, quality, and maintainability?`,
    `What metrics would you track to measure success in this role?`,
    `How do you collaborate with product and design teams under tight deadlines?`,
  ];

  await supabase.from("interview_questions").insert({
    user_id: user.id,
    role_target: role,
    seniority,
    questions,
  });

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "interview_questions_generate",
    action_group: "generator",
    metadata: { role, seniority },
  });

  revalidatePath("/dashboard/interview-questions");
  redirect("/dashboard/interview-questions?success=created");
}

export default async function InterviewQuestionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: sets } = await supabase
    .from("interview_questions")
    .select("id, role_target, seniority, questions, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Interview Questions Generator</h1>
          <Link href="/dashboard" className="text-sm text-cyan-300 hover:text-cyan-200">
            Back to Dashboard
          </Link>
        </div>

        <form action={saveInterviewQuestions} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <input name="role" required placeholder="Target role" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <select name="seniority" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm">
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
          <textarea name="skills" required rows={4} placeholder="Skills (comma separated)" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2" />
          <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
            Generate & Save
          </button>
        </form>

        <section className="mt-8 grid gap-3">
          {sets?.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium">
                {item.role_target} ({item.seniority})
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {(item.questions as string[]).map((q) => (
                  <li key={q}>- {q}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
