const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, windowMs: number, maxRequests: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: maxRequests - current.count, resetAt: current.resetAt };
}
