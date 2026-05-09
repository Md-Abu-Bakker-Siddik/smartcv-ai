"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveResumeAction, type ResumeFormState } from "@/app/dashboard/actions";

const initialResumeFormState: ResumeFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  return (
    <button className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
      Save Resume Draft
    </button>
  );
}

export function ResumeBuilderForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<ResumeFormState, FormData>(
    saveResumeAction,
    initialResumeFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
      {state.status !== "idle" && state.message.trim().length > 0 ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm md:col-span-2 ${
            state.status === "success"
              ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <input
        name="title"
        required
        placeholder="Resume title (e.g. Senior Frontend Engineer)"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <input
        name="fullName"
        required
        placeholder="Full name"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <input
        name="phone"
        placeholder="Phone"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <input
        name="address"
        placeholder="Address"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <h3 className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 md:col-span-2">
        Core Resume Sections
      </h3>
      <input
        name="experienceYears"
        type="number"
        min={0}
        max={40}
        required
        placeholder="Experience (years)"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <input
        name="skills"
        required
        placeholder="Skills (comma separated): React, TypeScript, Next.js"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <textarea
        name="summary"
        required
        placeholder="Professional summary"
        rows={4}
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <textarea
        name="experience"
        required
        rows={4}
        placeholder="Experience (one line per role): Company - Role - Duration - Impact"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <textarea
        name="education"
        required
        rows={3}
        placeholder="Education (one line per entry): School - Degree - Year"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <textarea
        name="projects"
        required
        rows={3}
        placeholder="Projects (one line per project): Name - Tech - Result"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <textarea
        name="certifications"
        rows={2}
        placeholder="Certifications (one line per entry)"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <input
        name="languages"
        placeholder="Languages (comma separated): English, Bangla"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <textarea
        name="awards"
        rows={2}
        placeholder="Awards (one line per award)"
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm"
      />
      <textarea
        name="jobDescription"
        required
        placeholder="Paste target job description for keyword matching"
        rows={5}
        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm md:col-span-2"
      />
      <SubmitButton />
    </form>
  );
}
