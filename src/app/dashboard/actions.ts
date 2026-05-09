"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calculateAtsScore } from "@/lib/ats/scorer";
import { canUseFeature } from "@/lib/usage";

const resumeSchema = z.object({
  title: z.string().min(2, "Title is required."),
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email."),
  summary: z.string().min(30, "Summary should be at least 30 characters."),
  skills: z.string().min(2, "Add at least one skill."),
  experienceYears: z.coerce.number().int().min(0).max(40),
  jobDescription: z.string().min(10, "Paste a job description."),
});

function makeSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveResumeAction(formData: FormData) {
  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    summary: formData.get("summary"),
    skills: formData.get("skills"),
    experienceYears: formData.get("experienceYears"),
    jobDescription: formData.get("jobDescription"),
  });

  if (!parsed.success) {
    revalidatePath("/dashboard");
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    revalidatePath("/dashboard");
    return;
  }

  const usage = await canUseFeature(user.id, "resume_save");
  if (!usage.allowed) {
    revalidatePath("/dashboard");
    return;
  }

  const skillList = parsed.data.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const jdWords = new Set(
    parsed.data.jobDescription
      .toLowerCase()
      .split(/[^a-z0-9+#]+/g)
      .filter((word) => word.length > 2),
  );
  const keywordMatches = skillList.filter((skill) => jdWords.has(skill.toLowerCase())).length;
  const score = calculateAtsScore({
    summary: parsed.data.summary,
    skills: skillList,
    experienceYears: parsed.data.experienceYears,
    keywordMatches,
  });

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: parsed.data.fullName,
  });

  const slug = `${makeSlug(parsed.data.title)}-${Date.now()}`;

  const { error } = await supabase.from("resumes").insert({
    user_id: user.id,
    title: parsed.data.title,
    slug,
    personal_info: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
    },
    professional_summary: parsed.data.summary,
    skills: skillList,
    work_experience: [{ years: parsed.data.experienceYears }],
    ats_score: score.total,
    keyword_match_score: Math.min(100, keywordMatches * 10),
  });

  if (error) {
    revalidatePath("/dashboard");
    return;
  }

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "resume_save",
    action_group: "resume_builder",
    metadata: { title: parsed.data.title, atsScore: score.total },
  });

  revalidatePath("/dashboard");
}
