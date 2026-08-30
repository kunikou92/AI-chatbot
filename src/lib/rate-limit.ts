const windowMs = 60_000;
const defaultLimit = 20;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requests = new Map<string, RateLimitEntry>();
const maxTrackedClients = 10_000;

function getLimit(): number {
  const configured = Number.parseInt(
    process.env.API_RATE_LIMIT_PER_MINUTE || String(defaultLimit),
    10
  );
  return Number.isFinite(configured) && configured > 0
    ? configured
    : defaultLimit;
}

export function checkRateLimit(clientId: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const current = requests.get(clientId);

  if (!current || current.resetAt <= now) {
    if (!current && requests.size >= maxTrackedClients) {
      for (const [key, entry] of requests) {
        if (entry.resetAt <= now) requests.delete(key);
      }

      if (requests.size >= maxTrackedClients) {
        const oldestKey = requests.keys().next().value;
        if (oldestKey) requests.delete(oldestKey);
      }
    }

    requests.set(clientId, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= getLimit()) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
