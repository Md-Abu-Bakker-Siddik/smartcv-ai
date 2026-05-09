"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  initialResumeFormState,
  saveResumeAction,
  type ResumeFormState,
} from "@/app/dashboard/actions";

function SubmitButton() {
  return (
    <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2">
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
      {state.status !== "idle" ? (
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
        placeholder="Resume title (e.g. Frontend Engineer Resume)"
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
      />
      <input
        name="fullName"
        required
        placeholder="Full name"
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
      />
      <input
        name="experienceYears"
        type="number"
        min={0}
        max={40}
        required
        placeholder="Experience (years)"
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
      />
      <input
        name="skills"
        required
        placeholder="Skills (comma separated)"
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
      />
      <textarea
        name="summary"
        required
        placeholder="Professional summary"
        rows={4}
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
      />
      <textarea
        name="jobDescription"
        required
        placeholder="Paste target job description for keyword matching"
        rows={5}
        className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm md:col-span-2"
      />
      <SubmitButton />
    </form>
  );
}
