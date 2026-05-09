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
  phone: z.string().optional(),
  address: z.string().optional(),
  summary: z.string().min(30, "Summary should be at least 30 characters."),
  skills: z.string().min(2, "Add at least one skill."),
  experienceYears: z.coerce.number().int().min(0).max(40),
  experience: z.string().min(5, "Add work experience details."),
  education: z.string().min(5, "Add education details."),
  projects: z.string().min(5, "Add project details."),
  certifications: z.string().optional(),
  awards: z.string().optional(),
  languages: z.string().optional(),
  jobDescription: z.string().min(10, "Paste a job description."),
});

export type ResumeFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function makeSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLineItems(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

export async function saveResumeAction(
  _prevState: ResumeFormState,
  formData: FormData,
): Promise<ResumeFormState> {
  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    summary: formData.get("summary"),
    skills: formData.get("skills"),
    experienceYears: formData.get("experienceYears"),
    experience: formData.get("experience"),
    education: formData.get("education"),
    projects: formData.get("projects"),
    certifications: formData.get("certifications"),
    awards: formData.get("awards"),
    languages: formData.get("languages"),
    jobDescription: formData.get("jobDescription"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please sign in again and retry.",
    };
  }

  const usage = await canUseFeature(user.id, "resume_save");
  if (!usage.allowed) {
    return {
      status: "error",
      message: "Daily free-plan resume limit reached. Try again tomorrow.",
    };
  }

  const skillList = parsed.data.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const languageList = (parsed.data.languages ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const awardList = (parsed.data.awards ?? "")
    .split("\n")
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
      phone: parsed.data.phone?.trim() || null,
      address: parsed.data.address?.trim() || null,
      languages: languageList,
      awards: awardList,
    },
    professional_summary: parsed.data.summary,
    skills: skillList,
    work_experience: parseLineItems(parsed.data.experience).map((item) => ({
      ...item,
      years: parsed.data.experienceYears,
    })),
    education: parseLineItems(parsed.data.education),
    projects: parseLineItems(parsed.data.projects),
    certifications: parseLineItems(parsed.data.certifications ?? ""),
    ats_score: score.total,
    keyword_match_score: Math.min(100, keywordMatches * 10),
  });

  if (error) {
    return {
      status: "error",
      message: `Save failed: ${error.message}`,
    };
  }

  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "resume_save",
    action_group: "resume_builder",
    metadata: { title: parsed.data.title, atsScore: score.total },
  });

  revalidatePath("/dashboard");
  return {
    status: "success",
    message: `Resume saved successfully. ATS score: ${score.total}/100.`,
  };
}
