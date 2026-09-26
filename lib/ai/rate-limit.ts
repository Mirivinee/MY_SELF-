/**
 * Best-effort in-memory rate limiter, per server instance. On a serverless
 * platform with multiple concurrent instances this won't be a hard global
 * limit — it's a free, key-less first line of defense, not a substitute for
 * a shared store (Redis/Upstash) if this ever needs to be airtight.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export function clientKeyFrom(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
