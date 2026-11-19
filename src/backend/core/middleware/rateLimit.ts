import { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "../types/errors.js";

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_TRACKED_KEYS = 10_000;

/**
 * Limiteur en mémoire par IP (suffisant pour une instance unique).
 * Derrière un reverse proxy, activer `app.set("trust proxy", 1)` pour que req.ip soit correct.
 */
export function rateLimit({ windowMs, max }: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip ?? "unknown";

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      if (buckets.size >= MAX_TRACKED_KEYS) {
        for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
      }
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    if (bucket.count > max) {
      res.setHeader("Retry-After", Math.ceil((bucket.resetAt - now) / 1000));
      next(new TooManyRequestsError());
      return;
    }
    next();
  };
}
