import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit/memory";

const schema = z.object({
  skills: z.array(z.string()).min(1),
  jobDescription: z.string().min(10),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 60);
  const limit = checkRateLimit(`keyword:${ip}`, windowMs, maxRequests);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const words = new Set(
    parsed.data.jobDescription
      .toLowerCase()
      .split(/[^a-z0-9+#]+/g)
      .filter((word) => word.length > 2),
  );

  const matched = parsed.data.skills.filter((skill) => words.has(skill.toLowerCase()));
  const missing = parsed.data.skills.filter((skill) => !words.has(skill.toLowerCase()));
  const score = Math.min(100, Math.round((matched.length / parsed.data.skills.length) * 100));

  return NextResponse.json({ score, matched, missing });
}
