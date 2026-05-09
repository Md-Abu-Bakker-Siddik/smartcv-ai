import { FREE_PLAN_DAILY_LIMITS } from "@/lib/constants/plans";
import { createClient } from "@/lib/supabase/server";

function startOfUtcDayIso() {
  const now = new Date();
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return utc.toISOString();
}

export async function canUseFeature(userId: string, action: keyof typeof FREE_PLAN_DAILY_LIMITS) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.plan === "pro") {
    return { allowed: true, remaining: Number.MAX_SAFE_INTEGER, limit: null };
  }

  const since = startOfUtcDayIso();
  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", since);

  const used = count ?? 0;
  const limit = FREE_PLAN_DAILY_LIMITS[action];
  const remaining = Math.max(0, limit - used);

  return { allowed: used < limit, remaining, limit };
}
