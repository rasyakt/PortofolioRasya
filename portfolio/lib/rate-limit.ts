/**
 * Minimal in-memory rate limiter (per server instance).
 * Protects login + public beacons from brute force / flooding.
 * For multi-instance deployments use Redis instead.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function prune() {
  const now = Date.now();
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
  // Hard cap to avoid unbounded growth
  if (buckets.size > 5000) {
    const oldest = [...buckets.keys()].slice(0, 1000);
    for (const key of oldest) buckets.delete(key);
  }
}

/** Returns true when the call is allowed, false when the limit is hit. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  prune();
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
