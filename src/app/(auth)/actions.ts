"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const resetSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

export async function signUpAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/sign-up?error=invalid_input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      redirect("/sign-up?error=email_exists");
    }
    redirect("/sign-up?error=signup_failed");
  }

  if (!data.session) {
    redirect("/sign-in?success=check_email");
  }

  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/sign-in?error=invalid_input");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect("/sign-in?error=email_not_confirmed");
    }
    redirect("/sign-in?error=invalid_credentials");
  }

  redirect("/dashboard");
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    redirect("/forgot-password?error=invalid_email");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
  });

  if (error) {
    redirect("/forgot-password?error=request_failed");
  }
  redirect("/forgot-password?success=sent");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
