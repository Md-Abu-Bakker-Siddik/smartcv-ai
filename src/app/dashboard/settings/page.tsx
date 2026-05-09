import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function saveProfileSettings(formData: FormData) {
  "use server";

  const fullName = String(formData.get("fullName") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName || null,
    profession: profession || null,
    country: country || null,
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?success=saved");
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, profession, country, plan, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="mt-2 text-sm text-slate-300">
          Manage your profile and account preferences.
        </p>

        <div className="mt-4 rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm">
          <p>Email: {user.email}</p>
          <p>Plan: {profile?.plan ?? "free"}</p>
          <p>Role: {profile?.role ?? "user"}</p>
        </div>

        <form action={saveProfileSettings} className="mt-6 grid gap-4">
          <input
            name="fullName"
            defaultValue={profile?.full_name ?? ""}
            placeholder="Full name"
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
          />
          <input
            name="profession"
            defaultValue={profile?.profession ?? ""}
            placeholder="Profession"
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
          />
          <input
            name="country"
            defaultValue={profile?.country ?? ""}
            placeholder="Country"
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Save Settings
          </button>
        </form>
      </div>
    </main>
  );
}
