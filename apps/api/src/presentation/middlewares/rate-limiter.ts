import type { MiddlewareHandler } from 'hono';
import { redis } from '../../infrastructure/cache/redis.service.js';

export const rateLimiter = (opts: { windowSec: number; max: number; keyPrefix: string }): MiddlewareHandler => async (c, next) => {
  try{
    const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown';
    const key = `${opts.keyPrefix}:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, opts.windowSec);
    if (count > opts.max) return c.json({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } }, 429);
  }catch{
    // Redis unavailable — allow in demo mode
  }
  await next();
};
