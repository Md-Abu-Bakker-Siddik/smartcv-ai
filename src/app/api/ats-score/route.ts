import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateAtsScore } from "@/lib/ats/scorer";
import { checkRateLimit } from "@/lib/rate-limit/memory";

const requestSchema = z.object({
  summary: z.string().min(1),
  skills: z.array(z.string()).default([]),
  experienceYears: z.number().int().min(0).max(40),
  keywordMatches: z.number().int().min(0),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 60);
  const limit = checkRateLimit(`ats:${ip}`, windowMs, maxRequests);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const result = calculateAtsScore(parsed.data);
  return NextResponse.json(result);
}
